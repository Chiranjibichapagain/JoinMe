import React from 'react'
import { GoogleLogin } from 'react-google-login'
import { useCookies } from 'react-cookie'
import axios from 'axios'

const GoogleUserLogin = () => {
  const GOOGLE_CLIENT = process.env.REACT_APP_GOOGLE_API_KEY as string
  const [cookies, setCookies] = useCookies(['user'])

  const responseSuccessGoogle = async (response: any) => {
    const userToken = await response.tokenObj.id_token
    try {
      const res = await axios.post('/api/v1/users/google-authenticate', {
        id_token: userToken
      })
      const { user_id, first_name, last_name, profile_image } = res.data
      setCookies('user', { user_id, first_name, last_name, profile_image })
    } catch (error) {
      console.log(error)
    }
  }

  const responseFailGoogle = (response: any) => {
    alert(
      'Oh no 😢\nSomething went wrong with your login.\n\nTry again, or let us know at contact.joinme2020@gmail.com that there is an issue.'
    )
  }

  return (
    <GoogleLogin
      clientId={GOOGLE_CLIENT}
      buttonText='Google Login'
      onSuccess={responseSuccessGoogle}
      onFailure={responseFailGoogle}
      cookiePolicy={'single_host_origin'}
    />
  )
}

export default GoogleUserLogin
