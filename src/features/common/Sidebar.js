import React from "react"
import { Link, useLocation } from "react-router-dom"
import classNames from "classnames"
import { useGetUserQuery } from "../api/sliceAPI"
import { getBasePath } from "./utils"
import Cookies from "js-cookie"

export const Sidebar = () => {
  const { data: { username } = {}, isSuccess: isSuccessGetUser } =
    useGetUserQuery(null, {
      skip: Cookies.get("jwt-exists") === undefined,
    })

  let location = useLocation()
  const basePath = getBasePath(location.pathname)

  const menuArray = [
    // menu item for every user:
    {
      path: "public", // relative path
      text: "Public (TODO)",
      requiresUserLogIn: false,
    },

    // requires log in:
    {
      path: "messages",
      text: "Chat messages",
      requiresUserLogIn: true,
    },
    {
      path: "add-friends",
      text: "Add Friends",
      requiresUserLogIn: true,
    },
    {
      path: "accept-friend-requests",
      text: "Accept Friend Requests",
      requiresUserLogIn: true,
    },
  ]

  const generateMenuItems = (predicate) => {
    return menuArray.filter(predicate).map((item) => {
      const linkClassName = classNames("nav-link", {
        active: item.path === basePath,
      })
      return (
        <li key={item.path} className="nav-item">
          <Link to={item.path} className={linkClassName}>
            {item.text}
          </Link>
        </li>
      )
    })
  }

  return (
    <nav
      id="sidebarMenu"
      className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse position-fixed"
    >
      <div className="position-sticky pt-3" style={{ marginBottom: "720px" }}>
        <h6 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-2 mb-1 text-muted">
          <span>
            <b>Public Section</b>
          </span>
        </h6>

        <ul className="nav flex-column">
          {generateMenuItems((item) => !item.requiresUserLogIn)}
        </ul>

        {isSuccessGetUser && username ? (
          <React.Fragment>
            <h6 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
              <span>
                <b>Private Section ({username})</b>
              </span>
            </h6>
            <ul className="nav flex-column mb-2">
              {generateMenuItems((item) => item.requiresUserLogIn)}
            </ul>
          </React.Fragment>
        ) : (
          ""
        )}
      </div>
    </nav>
  )
}
