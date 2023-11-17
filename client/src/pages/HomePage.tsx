import { useContext, useEffect, useState } from "react"
import AuthContext from "../contexts/AuthContext"
import { useForm } from "react-hook-form"

type sendMessageFormValues = {
    message: string,
}

type roomType = {
    id: string,
    users: {nickname: string, ready: boolean}[],
    host: string
}

function HomePage() {

    const { sendMessageFormRegister,  sendMessageFormHandleSubmit } = useForm<sendMessageFormValues>()
    
    const [currentRoom, setCurrentRoom] = useState<roomType | null>(null)

    const [inputRoomID, setRoomID] = useState<string>('')
    const [allMessages, setAllMessages] = useState<{message: string, from: {nickname: string}}[]>([])

    const { auth, logout, socket } = useContext(AuthContext)
    
    
    const createRoom = () => {
        
    }

    const joinRoom = () => {

    }

    const leaveRoom = () => {

    }
    
    const ready = () => {
        
    }

    const sendMessageSubmit = sendMessageFormHandleSubmit((formData: sendMessageFormValues) => {
        currentRoom?.id && socket.emit('send_message', {message: formData.message, roomID: currentRoom.id})
    })

    useEffect(() => {
        socket.on('receiving_message', data => {
            setAllMessages((prev) => [...prev, data])
        })
        // socket.on('user_left_room', (departedUser) => {
        //     alert(`${departedUser} left`)
        //     setUsersInRoom((prev) => prev.filter((user => user !== departedUser)))
        // })
        socket.on('user_entered_room', (enteredUser: {nickname: string, ready: boolean}) => {
            setCurrentRoom(prev => 
                prev
                ? {...prev, users: [...prev.users, enteredUser ]}
                : null
            )
        })
    }, [])

  return (
    <>
        <h1>Hii, {auth?.nickname}!</h1>
        <button type="button" onClick={(_event) => logout()} children={'Logout'}/>

        { currentRoom?.id
            ? <>
                <h2>{`Current room: ${currentRoom?.id}`}</h2>
                <button onClick={() => leaveRoom()} children={'leave'}/>
                <button onClick={() => ready()} children={'ready'}/>
                <h3>Users in room:</h3>
                {currentRoom.users.map(user => <h4>{user.nickname} - {user.ready ? 'ready' : 'is not ready'}</h4>)}

                <form
                    name='sendMessage'
                    onSubmit={sendMessageSubmit}
                    style={{display: 'flex', flexDirection: 'column', width: '10rem', margin: '1rem 0'}}
                    >

                    <input {...sendMessageFormRegister("message")}/>
                    <input type='submit' children={'send message'}/>

                </form>
                {allMessages.map((messageData) => <div><h2>{messageData.from.nickname}</h2> {messageData.message}</div>)}
            </>
            : <>
                <h1>Join a room!</h1>
                <input type="text" placeholder="room id" value={inputRoomID} onChange={(event) => {setRoomID(event.target.value)}}/>
                <div style={{display: 'flex', flexDirection: 'column', width: '10rem', margin: '1rem 0'}}>
                    <button onClick={() => joinRoom()} children={'join a room'}/>
                    <p>or</p>
                    <button onClick={() => createRoom()} children={'create a room'}/>
                </div>
            </>
        }
    </>
  )
}

export default HomePage