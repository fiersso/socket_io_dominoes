import Express from 'express'
import Cors from 'cors'
import Database from 'better-sqlite3'
import JWT from 'jsonwebtoken'
import 'dotenv/config'
import { Server } from 'socket.io'
import http from 'http'


const port = process.env.PORT || 4500
const app = Express()
const server = http.createServer(app)

//------------------------------------------------------

const clear = true

const db = new Database('./db/db.db')
db.pragma('journal_mode = WAL')

clear
	&& db.prepare(`drop table if exists users`).run()
	&& db.prepare(`drop table if exists refreshTokens`).run()
	&& console.log('All databases have been cleared.')

db.prepare(`
	create table if not exists users (
		id integer primary key,
		nickname text not null,
		email text not null,
		password text not null
	)
`).run()

db.prepare(`
	create table if not exists refreshTokens (
		token text not null
	)
`).run()

//-----------------------------------------------------


const io = new Server(server, {
	cors: {
		origin: '*',
		methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
	}
})

let onlineUsers = new Map()

let rooms = {}


io.on('connect', socket => {

	socket.on('init', token => {

		JWT.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY, (error, auth) => {
			if (error || (auth?.id && !db.prepare('select count(*) as count from users where id = (?)').get(auth.id).count)) {
				socket.emit('error', { code: 401, message: 'Token is not valid.' })
				return
			}

			const userData = db.prepare('select * from users where id = (?)').get(auth.id)
			onlineUsers.set(socket.id, { ...userData, currentRoom: null })
			console.log(`${userData.nickname} is online now!`)


			socket.on('join_room', (roomId, callBack) => {

				if (!(roomId in rooms)) {
					callBack({ message: `room with id = "${roomId}" not exists.` }, null)
					return
				}
				rooms[roomId].users.push({ socketId: socket.id, isReady: false, host: false })
				socket.join(roomId)

				socket.broadcast.to(roomId).emit('user_entered_room', {
					nickname: userData.nickname,
					isReady: false,
					host: false,
				})

				callBack(null, {
					id: roomId,
					users: rooms[roomId].users.map(user => {
						return {
							nickname: onlineUsers.get(user.socketId).nickname,
							host: user.host,
							isReady: user.isReady,
						}
					})
				})
			})


			socket.on('leave_room', (roomId, callBack) => {

				if (!(roomId in rooms)) {
					callBack({ message: `room with id = "${roomId}" not exists.` })
					return
				}
				const goneUser = rooms[roomId].users.find((user) => user.socketId === socket.id)
				rooms[roomId].users = rooms[roomId].users.filter(user => user.socketId !== socket.id)
				if (rooms[roomId].users.length < 1) {
					delete rooms[roomId]
				}
				// if (goneUser.host) {
				// rooms[roomId].users[0] = {...rooms[roomId].users[0], host: true}
				// }
				socket.leave(roomId)

				socket.broadcast.to(roomId).emit('user_left_room', {
					nickname: onlineUsers.get(socket.id),
					isReady: goneUser.isReady,
					host: goneUser.host,
				})
				callBack(null)
			})


			socket.on('create_room', (roomId, callBack) => {
				if ((roomId in rooms)) {
					callBack({ message: `room with id = "${roomId}" already exists.` }, null)
					return
				}
				const newRoom = {
					users: [
						{ socketId: socket.id, isReady: false, host: true }
					]
				}
				rooms[roomId] = newRoom
				socket.join(roomId)

				callBack(null, {
					id: roomId,
					users: [{
						nickname: onlineUsers.get(socket.id),
						isReady: false,
						host: true,
					}],
				})
			})


			socket.on('send_message', data => {
				//room check
				socket.to(data.roomId).emit('receiving_message', { ...data, from: { nickname: userData.nickname } })
			})
		})
	})

	socket.on('disconnect', _reason => {
		if (!onlineUsers.has(socket.id)) { return }

		console.log(`Bye, ${onlineUsers.get(socket.id).nickname}..`)
		onlineUsers.delete(socket.id)
	})
})

//------------------------------------------------------

app.use(Express.json())
app.use(
	Cors(
		{
			origin: ['http://localhost:5173'],
			credentials: true,
		}
	)
)

app.use((req, res, next) => {
	console.log(req.method, req.url, req.query, req.body)
	next()
})

//------------------------------------------------------

const createAccessToken = (id) => JWT.sign({ id }, process.env.ACCESS_TOKEN_SECRET_KEY, { expiresIn: '2d' })

const createRefreshToken = (id) => JWT.sign({ id }, process.env.REFRESH_TOKEN_SECRET_KEY)

const verify = (req, res, next) => {
	const authHeader = req.headers.authorization

	if (!authHeader) { return res.status(401).json({ message: 'You are not authenticated.' }) }

	const token = authHeader.split(' ')[1]

	JWT.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY, (error, user) => {
		if (error) { return res.status(403).json({ message: 'Token is not valid.' }) }
		req.user = user
		next()
	})
}

//------------------------------------------------------


app.get('/get_all_users', (req, res) => {
	const allUsers = db.prepare('select * from users').all()
	res.status(200).json({ data: allUsers })
})


app.post('/signup', (req, res) => {
	const { nickname, email, password } = req.body

	if (!nickname || !email || !password) {
		return res.status(400).json({ message: 'All fields are requared.' })
	}

	if (db.prepare('select count(id) as count from users where email = (?)').get(email).count) {
		return res.status(400).json({ message: 'An account with such an email already exists.' })
	}

	if (db.prepare('select count(id) as count from users where nickname = (?)').get(nickname).count) {
		return res.status(400).json({ message: 'This nickname is already taken. Take another.' })
	}

	db.prepare('insert into users (nickname, email, password) values (?,?,?)')
		.run(nickname, email, password)

	const user = db.prepare('select * from users where nickname = (?) and email = (?) and password = (?)')
		.get(nickname, email, password)

	const accessToken = createAccessToken(user.id)

	const refreshToken = createRefreshToken(user.id)
	db.prepare('insert into refreshTokens (token) values (?)').run(refreshToken)

	res.status(200).json({
		message: 'You have successfully registered.',
		data: {
			nickname: user.nickname,
			email: user.email,
			accessToken,
			refreshToken
		}
	})
})


app.post('/login', (req, res) => {
	const { email, password } = req.body

	if (!email || !password) {
		return res.status(400).json({ message: 'All fields are requared.' })
	}

	if (!db.prepare('select count(id) as count from users where email = (?)').get(email).count) {
		return res.status(400).json({ message: 'There is no account with this email address.' })
	}

	if (!db.prepare('select count(id) as count from users where email = (?) and password = (?)').get(email, password).count) {
		return res.status(400).json({ message: 'Incorrect password.' })
	}

	const user = db.prepare('select * from users where email = (?) and password = (?)').get(email, password)

	const accessToken = createAccessToken(user.id)

	const refreshToken = createRefreshToken(user.id)
	db.prepare('insert into refreshTokens (token) values (?)').run(refreshToken)

	res.status(200).json({
		message: 'You have successfully logged in.',
		data: {
			nickname: user.nickname,
			email: user.email,
			accessToken,
			refreshToken
		}
	})
})


app.post('/logout', verify, (req, res) => {
	const refresh_token = req.body.token
	db.prepare('delete from refreshTokens where token = (?)').run(refresh_token)
	res.status(200).json({ message: 'You logged out succesfily.' })
})


app.post('/refresh_token', (req, res) => {
	const refreshToken = req.body.token

	if (!refreshToken) {
		return res.status(401).json({ message: 'You are not authenticated.' })
	}

	if (!db.prepare('select count(*) as count from refreshtokens where token = (?)').get(refreshToken).count) {
		return res.status(403).json({ message: 'Refresh token is not valid.' })
	}

	JWT.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET_KEY, (error, user) => {
		db.prepare('delete from refreshTokens where token = (?)').run(refreshToken)

		const newAccessToken = createAccessToken(user.id)
		const newRefreshToken = createRefreshToken(user.id)

		db.prepare('insert into refreshTokens (token) values (?)').run(newRefreshToken)

		return res.status(200).json({
			message: 'You have successfully refreshed the tokens.',
			data: {
				accessToken: newAccessToken,
				refreshToken: newRefreshToken
			}
		})
	})
})


app.delete('/delete_account/:userID', verify, (req, res) => {
	if (req.user.id !== +req.params.userID) {
		return res.status(403).json({ message: 'You are not allowed to delete this user.' })
	}

	if (!db.prepare('select count(id) as count from users where id = (?)').get(req.user.id).count) {
		return res.status(400).json({ message: 'There is no user with this id.' })
	}

	db.prepare('delete from users where id = (?)').run(req.user.id)

	return res.status(200).json({ message: 'User has been deleted.' })
})


app.post('/get_self_info', verify, (req, res) => {
	const user = db.prepare('select * from users where id = (?)').get(req.user.id)
	return res.status(200).json({ data: user })
})


server.listen(port, () => {
	console.log(`Server is running on port ${port}.`)
})