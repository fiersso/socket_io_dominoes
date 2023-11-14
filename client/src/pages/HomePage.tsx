import { useContext, useEffect, useRef, useState } from "react"
import axios from "../api/axios"
import { Link } from "react-router-dom"
import AuthContext from "../contexts/AuthContext"
import { io } from "socket.io-client"


function HomePage() {
    
    const { auth, logout } = useContext(AuthContext)

    const socket = useRef(auth ? io('http://127.0.0.1:4500'): null)

    const [allUsers, setAllUsers] = useState([])


    useEffect(() => {
        axios.get('/get_all_users')
        .then(res => {
            setAllUsers(res.data.data)
        })

        socket?.current?.emit('init', {nickname: auth?.nickname, email: auth?.email})

    }, [])

    const join = (roomID: string) => {
        socket?.current?.emit('join_to_room', roomID)
    } 

  return (
    <>
        <h1>HomePage</h1>
        {!auth
            ? <>
                <Link to={'/login'}>Login</Link>
                <Link to={'/signup'}>Sign up</Link>
            </>
            : <>
                <button type="button" onClick={(_event) => logout()} children={'Logout'}/>
                <button type="button" onClick={(_event) => join('1010')} children={'Join'}/>
            </>
        }
        
        {allUsers.length
            ? allUsers.map((user, i) => <div key={i}><h2>{JSON.stringify(user)}</h2></div>)
            : <h3>No users.</h3>
        }
    </>
  )
}

export default HomePage