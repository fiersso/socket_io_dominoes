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
                        <div style={{marginBottom: '4rem', display: 'flex', flexDirection: 'column', gap: '0.7rem', alignItems: 'center'}}>
                        <h1>Room code: <h1
                            style={{display: 'inline-block'}}
                        >{currentRoom?.id}</h1></h1>
                        <div style={{
                            display: 'flex',
                            gap: '0.6rem'
                        }}>
                            <button onClick={() => leaveRoom()} children={'leave'} />
                            <button onClick={() => toggleReadyState()} children={'ready'} />
                        </div>
                        </div>
                        <h1>Users in room: {'[ '}{currentRoom.users.length}{' ]'}</h1>
                        {currentRoom.users.map((user, i) => 
                            <h2 key={i}><h2 style={{ display: 'inline-block'}}> {user.nickname}</h2> {user.host ? '( host )' : null} -- <h2 style={{
                                color: user.isReady ? 'rgb(87, 219, 39)' : '#ff0048',
                                display: 'inline-block'
                            }}>{user.isReady ? 'ready' : 'is not ready'}</h2></h2>
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
                        <h1 style={{fontSize: '4rem'}}>Join a room.</h1>
                        <input style={{fontSize: '1.5rem', margin: '1rem 0 ', padding: '0.2rem'}} type="text" placeholder="room id" value={inputRoomID} onChange={(event) => { setRoomID(event.target.value) }} />
                        <button style={{fontSize: '1.2rem'}} onClick={() => joinRoom(inputRoomID)} children={'join a room'} />
                        <p>or</p>
                        <button  style={{fontSize: '1.2rem'}} onClick={() => createRoom(inputRoomID)} children={'create a room'} />
                        </div>
                    </>
                }
                </>
            }
        </>
    )
}

export default Lobby