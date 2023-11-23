import { ReactElement, createContext, useContext, useEffect, useState } from "react"
import AuthContext from "./AuthContext"


type playerType = { id: number, nickname: string, isReady: boolean, host?: boolean }

type roomType = {
    id: string,
    users: playerType[],
    isStarted: false | {
        individualData: {
          [userId: string]: { dominoes: (number | null)[][] },
        }
      },
}

type RoomContextType = {
    currentRoom: roomType | null,
    setCurrentRoom: React.Dispatch<React.SetStateAction<roomType | null>>,
    createRoom: (roomId: string) => void,
    joinRoom: (roomId: string) => void,
    leaveRoom: () => void,
    toggleReadyState: () => void,
}

const RoomContext = createContext({} as RoomContextType)

export const RoomProvider = ({ children }: { children: ReactElement }) => {

    const { auth, socket } = useContext(AuthContext)
    const [ currentRoom, setCurrentRoom ] = useState<roomType | null>(null)

    const createRoom = (roomId: string) => {
        socket.emit('create_room', roomId, (error: { message: string } | null, room: roomType) => {
            if (error?.message) {
                alert(error.message)
                return
            }
            setCurrentRoom(room)
        })
    }

    const joinRoom = (roomId: string) => {
        socket.emit('join_room', roomId, (error: { message: string } | null, room: roomType) => {
            if (error?.message) {
                alert(error.message)
                return
            }
            setCurrentRoom(room)
        })
    }

    const leaveRoom = () => {
        socket.emit('leave_room', currentRoom?.id, (error: { message: string } | null) => {
            if (error?.message) {
                return
            }
            setCurrentRoom(null)
        })
    }

    const toggleReadyState = () => {
        currentRoom?.id && 
        socket.emit('change_ready_state', currentRoom.id, !currentRoom.users.find(user => user.nickname === auth?.nickname)?.isReady)
    } 

    useEffect(() => {

        socket.on('user_left_room', (departedUser) => {
            setCurrentRoom(prev =>
                prev
                    ? { ...prev, users: prev.users.filter(user => user.id !== departedUser.id) }
                    : null
            )
        })

        socket.on('user_entered_room', (enteredUser: playerType) => {
            setCurrentRoom(prev =>
                prev
                    ? { ...prev, users: [...prev.users, enteredUser] }
                    : null
            )
        })

        socket.on('changed_host', (newHost: playerType) => {
            setCurrentRoom(prev =>
                prev
                    ? { ...prev, users: 
                        prev.users.map(user => {
                            if (user?.host) {return {...user, host: false}}
                            else if (user.id === newHost.id) {return {...user, host: true}}
                            else {return user}
                        }) 
                    }
                    : null
            )
        })
        socket.on('user_changed_ready_state', (userChangedReadyState: playerType, newState: boolean) => {
            setCurrentRoom(prev =>
                prev
                    ? { ...prev, users: 
                        prev.users.map(user => {
                            if (userChangedReadyState.id === user.id) {return {...user, isReady: newState}}
                            else {return user}
                        }) 
                    }
                    : null
            )
        })

        socket.on('start_game', (GameState) => {
            // alert(JSON.stringify(GameState))
            setCurrentRoom(prev => prev ? {...prev, isStarted: GameState} : null)
        })

        socket.on('end_game', (reason) => {
            alert(reason)
            setCurrentRoom(prev => prev ? {...prev, users: prev.users.map(user => { return {...user, isReady: false}}), isStarted: false} : null)
        })

        socket.on('update_game_state', (newGameState) => {
            setCurrentRoom(prev => prev ? {...prev, isStarted: newGameState} : null)
        })
    
    }, [])

    useEffect(() => {
        leaveRoom()
    }, [auth])

    return (
        <RoomContext.Provider value={{ currentRoom, setCurrentRoom, createRoom, joinRoom, leaveRoom, toggleReadyState }}>
            {children}
        </RoomContext.Provider>
    )
}

export default RoomContext