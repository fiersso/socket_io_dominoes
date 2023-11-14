import { useContext, useEffect } from "react"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"
import axios from "../api/axios"
import AuthContext from "../contexts/AuthContext"

type FormValues = {
  nickname: string,
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
    axios.post('/signup', {
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
        <h1>Sign up</h1>
        <form name='signup' onSubmit={onSubmit}>
          <input {...register("nickname")} />
          <input {...register("email")} />
          <input {...register("password")} />
          {/* <IsolateReRender control={control} /> */}

          <input type="submit" />
        </form>
        <Link to={'/login'} children={'Login'}/>
        <Link to={'/'} children={'Home page'}/>
      </div>
    </>
  )
}

export default SignupPage
