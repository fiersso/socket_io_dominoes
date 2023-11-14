import { ReactElement, createContext, useState } from "react"
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
}

const AuthContext = createContext({} as AuthContextType)

export const AuthProvider = ({ children }: { children: ReactElement }) => {
    const [auth, setAuth] = useState<UserType>(cookies.get('authorization') || null)

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

    return (
        <AuthContext.Provider value={{ auth, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;