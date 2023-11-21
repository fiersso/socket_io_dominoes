import { Navigate, Route, Routes } from "react-router-dom"
import Lobby from "./pages/Lobby"
import LoginPage from "./pages/LoginPage"
import SignUpPage from "./pages/SignUpPage"
import { useContext } from "react"
import AuthContext from "./contexts/AuthContext"


function App() {

  const { auth } = useContext(AuthContext)

  return (
    <>
      <Routes>
        <Route path="/" element={auth
          ? <Lobby/>
          : <Navigate to={'/signup'}/>
        }/>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/signup" element={<SignUpPage/>}/>
      </Routes>
    </>
  )
}

export default App
