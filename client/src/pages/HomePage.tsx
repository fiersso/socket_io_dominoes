import { useContext, useEffect } from "react"
import AuthContext from "../contexts/AuthContext"
import axios from "../api/axios"


function HomePage() {
    const { logout } = useContext(AuthContext)

    useEffect(() => {
        axios.get('/get_online_users')
            .then(res => console.log(res.data.data))
    }, [])

    return (
        <>
            <h1>HomePage</h1>
            <button type="button" onClick={(_event) => logout()} children={'Logout'} />
        </>
    )
}

export default HomePage