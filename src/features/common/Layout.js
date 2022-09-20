import React from "react"
import { Outlet } from "react-router-dom"
import { Sidebar } from "./Sidebar"
import { TopNavbar } from "./TopNavbar"

export const Layout = () => {
  return (
    <React.Fragment>
      <TopNavbar />
      <div className="container-fluid">
        <div className="row">
          <Sidebar />
          <Outlet />
        </div>
      </div>
    </React.Fragment>
  )
}
