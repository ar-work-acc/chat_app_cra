import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useLoginMutation, useOauthSignInMutation } from "./api/sliceAPI"
import { decodeJwtResponse } from "./common/utils"

export const Login = () => {
  const navigate = useNavigate()

  // form username state:
  const [username, setUsername] = useState("")
  const onUserNameChanged = (e) => setUsername(e.target.value)

  // form password state:
  const [password, setPassword] = useState("")
  const onPasswordChanged = (e) => setPassword(e.target.value)

  const [login, { isLoading, isError, error }] = useLoginMutation()
  const canSave = [username, password].every(Boolean) && !isLoading
  const submitLoginForm = async (e) => {
    e.preventDefault()
    if (canSave) {
      try {
        const data = await login({
          username: username,
          password,
        }).unwrap()
        console.log(data.message)

        setUsername("")
        setPassword("")

        navigate(`/`, { replace: true })
      } catch (err) {
        console.error(`Failed to log in. Reason: ${JSON.stringify(err)}`)
      }
    }
  }

  /**
   * Sign in with OAuth.
   */
  const [oauthSignIn] = useOauthSignInMutation()
  const handleCredentialResponse = async (response) => {
    const jwtData = decodeJwtResponse(response.credential)
    const account = {
      email: jwtData.email,
      firstName: jwtData.given_name,
      lastName: jwtData.family_name,
      avatar: jwtData.picture,
    }
    console.log("Sign in with Google", account)

    const data = await oauthSignIn(account).unwrap()
    console.log(data.message)

    navigate(`/`, { replace: true })
  }

  useEffect(() => {
    window.google.accounts.id.initialize({
      client_id:
        "724193603456-4hr80n9qj4ttmgs2td79dk66164joco7.apps.googleusercontent.com",
      callback: handleCredentialResponse,
    })

    window.google.accounts.id.renderButton(
      document.getElementById("buttonDiv"),
      { theme: "outline", size: "large" } // customization attributes
    )

    // window.google.accounts.id.prompt() // also display the One Tap dialog
  }, [])

  /**
   * Sign in with Facebook.
   * https://developers.facebook.com/docs/facebook-login/web/
   * https://developers.facebook.com/docs/javascript/reference/FB.api/
   */

  const onClickSignInWithFacebook = () => {
    console.log(`Clicked sign in with FB button...`)
    window.FB.login(
      (response) => {
        if (response.status === "connected") {
          // Logged into your webpage and Facebook.
          // handle the response
          console.log("Connected to FB.")
          console.log(response)
          window.FB.api(
            "/me",
            {
              fields: "email, first_name, last_name, picture",
            },
            async (response) => {
              console.log(response)
              const account = {
                email: response.email,
                firstName: response.first_name,
                lastName: response.last_name,
                avatar: response.picture?.data?.url,
                accountType: 2,
              }
              const data = await oauthSignIn(account).unwrap()
              console.log(data.message)
              navigate(`/`, { replace: true })
            }
          )
        } else {
          // The person is not logged into your webpage or we are unable to tell.
          console.log(`Not logged in to FB.`)
        }
      },
      { scope: "public_profile,email" }
    )
  }

  return (
    <div className="container">
      <form className="w-50 mx-auto mt-5">
        <div className="h3 mt-3 mb-3" style={{ color: "red" }}>
          {isError ? `${error.status}: ${error.data?.message}` : ""}
        </div>
        <h2 className="mb-4 mt-1 mb-1">User Log In</h2>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">
            Account
          </label>
          <input
            type="text"
            className="form-control"
            id="username"
            name="username"
            value={username}
            onChange={onUserNameChanged}
          />
          <div className="form-text">Log in with your account</div>
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            name="password"
            id="password"
            autoComplete="on"
            value={password}
            onChange={onPasswordChanged}
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary btn-fixed-150px"
          onClick={submitLoginForm}
          disabled={!canSave}
        >
          Submit
        </button>
      </form>
      <hr />
      <div className="row">
        <div className="col-md-4">
          <button
            onClick={onClickSignInWithFacebook}
            type="button"
            className="btn btn-primary mb-2"
            style={{ width: "200px" }}
          >
            Sign in with Facebook
          </button>
        </div>
      </div>
      <div className="row">
        <div id="buttonDiv"></div>
      </div>
    </div>
  )
}
