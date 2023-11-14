import { Route, Routes } from "react-router-dom"
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import SignUpPage from "./pages/SignUpPage"
import { useContext } from "react"
import AuthContext from "./contexts/AuthContext"


function App() {

  const { auth } = useContext(AuthContext)

  return (
    <>
      <h3>{auth?.nickname || 'You are not logged in to your account.'}</h3>
      <Routes>
        <Route path="/" element={auth ? <HomePage /> : <LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
      </Routes>
    </>
  )
}

export default App
