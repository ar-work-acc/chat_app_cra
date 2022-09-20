import React from "react"
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { sliceAPI } from "../api/sliceAPI"
import { useDispatch } from "react-redux"
import { useGetUserQuery, useLogoutMutation } from "../api/sliceAPI"
import Cookies from "js-cookie"
import na from "../../assets/na.png"

export const TopNavbar = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { data: user, isSuccess: isSuccessGetUser } = useGetUserQuery(null, {
    skip: Cookies.get("jwt-exists") === undefined,
  })

  const [logout] = useLogoutMutation()

  const onLogout = async (e) => {
    e.preventDefault()

    // remove cookies
    await logout().unwrap()

    // remove all existing cache entries
    dispatch(sliceAPI.util.resetApiState())

    navigate(`/`, { replace: true })
  }

  let loginStatus = isSuccessGetUser ? (
    <React.Fragment>
      <span>
        Hi,{" "}
        <b>
          {user.firstName} {user.lastName} ({user.username})
        </b>
      </span>
    </React.Fragment>
  ) : (
    <span>(not logged in)</span>
  )

  const userIcon = user?.avatar ? user.avatar : na

  return (
    <header className="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0 shadow">
      <Link to="/" className="navbar-brand col-md-3 col-lg-2 me-0 px-3">
        Chat App
      </Link>
      <div className="navbar-nav ms-auto me-5">
        <span style={{ color: "white" }}>{loginStatus}</span>
      </div>
      <span href="" className="avatar avatar-responsive">
        <img className="avatar-img" src={userIcon} alt="" />
      </span>
      <div className="navbar-nav">
        <div className="nav-item text-nowrap">
          {isSuccessGetUser ? (
            <a className="nav-link px-3" href="/" onClick={onLogout}>
              Sign out
            </a>
          ) : (
            <Link to={"/login"} className="nav-link px-3">
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
