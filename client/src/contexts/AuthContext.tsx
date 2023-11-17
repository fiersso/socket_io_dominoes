import { ReactElement, createContext, useEffect, useRef, useState } from "react"
import { Socket, io } from "socket.io-client"
import Cookies from 'universal-cookie'

const cookies = new Cookies()

type UserType = {
    nickname: string,
    accessToken: string,
    email: string,
    freshToken: string,
}

type AuthContextType = {
    auth: UserType | null,
    login: (user: UserType) => void,
    logout: () => void,
    socket: Socket,
}

const AuthContext = createContext({} as AuthContextType)

export const AuthProvider = ({ children }: { children: ReactElement }) => {
    const [auth, setAuth] = useState<UserType | null>(cookies.get('authorization') || null)

    const socket = useRef<Socket>(io('http://localhost:4500'))

    const login = (user: UserType) => {
        setAuth(user)
        cookies.set('authorization', JSON.stringify(user), {
            maxAge: (1_000 * 60 * 60 * 24),
        })
    }

    const logout = () => {
        setAuth(null)
        cookies.remove('authorization')
    }

    const init = () => {
        socket.current.emit('init', auth?.accessToken)
    }

    useEffect(() => {
        socket.current.on('error', (error) => {
            alert(error?.message || 'error, but no exists message.')
            if (error?.code === 401) {
                logout()
            }
        })
    }, [])

    useEffect(() => {
        if (auth) {
            socket.current.connect()
            init()
        }
    }, [auth])

    return (
        <AuthContext.Provider value={{ auth, login, logout, socket: socket.current }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;