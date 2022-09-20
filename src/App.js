import "./App.css"
import React from "react"
import { Routes, Route } from "react-router-dom"
import { Home } from "./features/Home"
import { Login } from "./features/Login"
import { Layout } from "./features/common/Layout"
import { NotFound } from "./features/NotFound"
import { Messenger } from "./features/chat/Messenger"
import { AddFriends } from "./features/chat/AddFriends"
import { AcceptFriendRequests } from "./features/chat/AcceptFriendRequests"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="messages" exact element={<Messenger />} />
        <Route path="add-friends" exact element={<AddFriends />} />
        <Route
          path="accept-friend-requests"
          exact
          element={<AcceptFriendRequests />}
        />
      </Route>
      <Route path="/login" exact element={<Login />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
