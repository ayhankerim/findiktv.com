import { useState } from "react"
import { useRouter } from "next/router"
import axios from "axios"
import { getGlobalData } from "utils/api"

const Register = () => {
  const router = useRouter()
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post("/api/register", userData)
      router.replace("/profile")
    } catch (err) {
      console.log(err.response.data)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setUserData({ ...userData, [name]: value })
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Username:
        <input type="text" name="username" onChange={(e) => handleChange(e)} />
      </label>
      <br />
      <label>
        Email:
        <input type="text" name="email" onChange={(e) => handleChange(e)} />
      </label>
      <br />
      <label>
        Password:
        <input
          type="password"
          name="password"
          onChange={(e) => handleChange(e)}
        />
      </label>
      <br />
      <button>Register</button>
    </form>
  )
}

export async function getStaticProps(context) {
  const { locale } = context
  const globalLocale = await getGlobalData(locale)

  return {
    props: {
      global: globalLocale.data,
    },
    revalidate: 15,
  }
}

export default Register
