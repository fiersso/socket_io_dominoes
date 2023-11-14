import { ReactElement, createContext, useEffect, useRef, useState } from "react"
import { io } from "socket.io-client"
import Cookies from 'universal-cookie'

const cookies = new Cookies()

type UserType = {
    nickname: string,
    accessToken: string,
    email: string,
    freshToken: string,
} | null

type AuthContextType = {
    auth: UserType,
    login: (user: UserType) => void,
    logout: () => void,
    socket: any,
}

const AuthContext = createContext({} as AuthContextType)

export const AuthProvider = ({ children }: { children: ReactElement }) => {
    const [auth, setAuth] = useState<UserType>(cookies.get('authorization') || null)

    const socketRef = useRef<any>(null)

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

    useEffect(() => {
        if (!auth && socketRef.current) {
            socketRef.current.disconnect(true)
            socketRef.current = null
            return
        }

        if (auth && !socketRef.current) {
            socketRef.current = io('http://127.0.0.1:4500')
            socketRef.current.emit('init', auth.accessToken)
            return
        }

    }, [auth])

    return (
        <AuthContext.Provider value={{ socket: socketRef.current, auth, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;