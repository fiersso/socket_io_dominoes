import { useContext, useEffect } from "react"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"
import axios from "../api/axios"
import AuthContext from "../contexts/AuthContext"

type FormValues = {
  email: string,
  password: string,
}

// function IsolateReRender({ control }: { control: Control<FormValues> }) {
//   const nickname = useWatch({
//     control,
//     name: "nickname",
//     defaultValue: "default",
//   })

//   return <div>{nickname}</div>
// }


function SignupPage() {

  const { register, handleSubmit } = useForm<FormValues>()

  const { auth, login } = useContext(AuthContext)

  const navigate = useNavigate()

  useEffect(() => {
    if ( auth ) {navigate('/')}
  }, [])

  const onSubmit = handleSubmit((formData) => {
    axios.post('/login', {
      ...formData
    })
    .then(res => {
      login(res.data.data)
      navigate('/')
    })
    .catch(error => console.log(error))
  })

  return (
    <>
      <div className="form">
        <h1>Login</h1>
        <form name='login' onSubmit={onSubmit}>
          <input {...register("email")} />
          <input {...register("password")} />
          {/* <IsolateReRender control={control} /> */}

          <input type="submit" />
        </form>
        <Link to={'/signup'} children={'Sign up'}/>
        <Link to={'/'} children={'Home page'}/>
      </div>
    </>
  )
}

export default SignupPage
