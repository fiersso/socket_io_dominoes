import { useContext, useState } from "react"
import AuthContext from "../contexts/AuthContext"
import RoomContext from "../contexts/RoomContext"
import Game from "./Game"
import Card from "../components/Card/Card"


function Lobby() {

    const { currentRoom, createRoom, joinRoom, leaveRoom, toggleReadyState } = useContext(RoomContext)

    const [ inputRoomID, setRoomID ] = useState<string>('')

    const { auth, logout } = useContext(AuthContext)

    return (
        <>
            <h1>Hii, {auth?.nickname}!</h1>

            <Card hidden={true} value={'▩'}/>

            {(currentRoom?.isStarted) &&
                <>
                    <Game
                        GameState={currentRoom.isStarted}
                        // GameState={{
                        //     individualData: {
                        //       1: { dominoes: [[1, 1, 1, 1],[1, 1, 1, 1], [1, 1, 1, 1]] },
                        //     }
                        //   }}
                    />
                </>
            }

            {(!currentRoom?.isStarted) && <>
                {(currentRoom?.id)
                    ? <>
                        <h2>{`Current room: ${currentRoom?.id}`}</h2>
                        <button onClick={() => leaveRoom()} children={'leave'} />
                        <button onClick={() => toggleReadyState()} children={'ready'} />
                        <h3>Users in room: {currentRoom.users.length}</h3>
                        {currentRoom.users.map((user, i) => 
                            <h4 key={i}>{user.nickname} {user.host ? '( host )' : null} - {user.isReady ? 'ready' : 'is not ready'}</h4>
                        )}
                    </>
                    : <>
                        <button type="button" onClick={(_event) => logout()} children={'Logout'} />
                        <h1>Join a room!</h1>
                        <input type="text" placeholder="room id" value={inputRoomID} onChange={(event) => { setRoomID(event.target.value) }} />
                        <div style={{ display: 'flex', flexDirection: 'column', width: '10rem', margin: '1rem 0' }}>
                            <button onClick={() => joinRoom(inputRoomID)} children={'join a room'} />
                            <p>or</p>
                            <button onClick={() => createRoom(inputRoomID)} children={'create a room'} />
                        </div>
                    </>
                }
                </>
            }
        </>
    )
}

export default Lobby