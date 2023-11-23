import { useContext, useState } from "react"
import AuthContext from "../contexts/AuthContext"
import RoomContext from "../contexts/RoomContext"
import Game from "./Game"


function Lobby() {

    const { currentRoom, createRoom, joinRoom, leaveRoom, toggleReadyState } = useContext(RoomContext)

    const [ inputRoomID, setRoomID ] = useState<string>('')

    const { auth, logout } = useContext(AuthContext)

    return (
        <>
            {(!currentRoom?.isStarted) && <header
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '1rem',
                    padding: '1rem',
                    boxSizing: 'border-box'
                }}
            >
                <h3>Hii,  <h2
                    style={{display: 'inline-block'}}
                >{auth?.nickname}</h2></h3>
                {(!currentRoom?.isStarted) && <button
                    type="button"
                    onClick={(_event) => logout()}
                    children={'Logout'}
                    style={{
                        margin: 'auto 0',
                        padding: '0.2rem 0.5rem',
                        fontSize: '0.6rem',
                        height: 'fit-content'
                    }}
                />
                }
            </header>
            }
    
            {(currentRoom?.isStarted) &&
                <>
                    <Game
                        GameState={currentRoom.isStarted}
                    />
                </>
            }

            {(!currentRoom?.isStarted) && <>
                {(currentRoom?.id)
                    ? <div
                        style={{
                            margin: 'auto',
                            width: 'fit-content',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: '1rem',
                            gap: '0.5rem',
                        }} 
                    >
                        <h1>room code: <h1
                            style={{display: 'inline-block'}}
                        >{currentRoom?.id}</h1></h1>
                        <div style={{
                            display: 'flex',
                            gap: '0.6rem'
                        }}>
                            <button onClick={() => leaveRoom()} children={'leave'} />
                            <button onClick={() => toggleReadyState()} children={'ready'} />
                        </div>
                        <h2>Users in room: {'['}{currentRoom.users.length}{']'}</h2>
                        {currentRoom.users.map((user, i) => 
                            <h3 key={i}>{user.nickname} {user.host ? '( host )' : null} -- <h2 style={{
                                color: user.isReady ? 'rgb(87, 219, 39)' : '#ff0048',
                                display: 'inline-block'
                            }}>{user.isReady ? 'ready' : 'is not ready'}</h2></h3>
                        )}
                    </div>
                    : <>
                        <div
                            style={{
                                margin: 'auto',
                                width: 'fit-content',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                padding: '1rem',
                                gap: '0.5rem',

                            }}
                        >
                        <h1 style={{fontSize: '5rem'}}>Join a room.</h1>
                        <input type="text" placeholder="room id" value={inputRoomID} onChange={(event) => { setRoomID(event.target.value) }} />
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