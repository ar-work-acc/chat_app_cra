import React, { useEffect, useRef, useState } from "react"
import { useGetUserQuery } from "../api/sliceAPI"
import {
  useGetFriendsQuery,
  useGetMessagesQuery,
  useGetFriendDataQuery,
} from "./sliceMessage"
import Cookies from "js-cookie"
// Reference this theme:
// https://themes.getbootstrap.com/preview/?theme_id=38342
import "./Messenger.css"
import na from "../../assets/na.png"
import classNames from "classnames"
import { wss } from "./sliceMessage"

export const Messenger = () => {
  // get logged in user's data:
  const { data: user, isSuccess: isSuccessGetUser } = useGetUserQuery(null, {
    skip: Cookies.get("jwt-exists") === undefined,
  })
  const userIcon = isSuccessGetUser && user?.avatar ? user.avatar : na

  // get user's friend list:
  const { data: friends = [], isSuccess } = useGetFriendsQuery(null, {
    skip: !Cookies.get("jwt-exists"),
  })

  // which user is selected:
  const [selectedUser, setSelectedUser] = useState({})
  const onSelectUser = (user) => {
    return () => {
      setSelectedUser(user)
    }
  }

  const { data: selectedFriend, isSuccess: isSuccessGetFriendData } =
    useGetFriendDataQuery(selectedUser._id, {
      skip: selectedUser._id === undefined,
    })
  const selectedFriendIcon =
    isSuccessGetFriendData && selectedFriend?.avatar
      ? selectedFriend.avatar
      : na

  // get conversation with selected user
  const { data: messages = [], isSuccess: isSuccessGetMessages } =
    useGetMessagesQuery(
      {
        page: 0,
        pageSize: 20, // last N messages
        friendId: selectedUser._id,
      },
      {
        skip: !selectedUser._id,
      }
    )

  // current message:
  const [message, setMessage] = useState("")

  const onMessageChange = (e) => setMessage(e.target.value)

  const sendMessage = () => {
    // don't send empty messages
    if (message === "") {
      console.log("Empty message. Not sending.")
      return
    }

    // also check websocket connection first
    if (wss == null || wss.readyState !== WebSocket.OPEN) {
      console.log("WebSocket not ready. Cannot send message.")
      return
    }

    // send your message through wss:
    wss.send(JSON.stringify({ to: selectedUser._id, message }))

    // reset message after sending
    setMessage("")
  }

  const onMessageSubmit = (e) => {
    e.preventDefault()
    sendMessage()
  }

  const handleOnKeyUp = (e) => {
    if (e.keyCode === 13) {
      sendMessage()
    }
  }

  // scroll to bottom
  const messagesEndRef = useRef(null)
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  return (
    <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
      <div className="row d-flex justify-content-between flex-wrap flex-md-nowrap pt-3 pb-2 mb-3">
        <div className="col-md-4">
          <h2>Friends</h2>
          {isSuccess
            ? friends.map((friend) => {
                const iconImgSrc = friend.avatar ? friend.avatar : na

                const friendDivClassNames = classNames("row gx-5 py-2", {
                  "friend-selected": friend._id === selectedUser?._id,
                })

                return (
                  <div
                    key={friend._id}
                    className={friendDivClassNames}
                    onClick={onSelectUser(friend)}
                  >
                    <div className="col-auto">
                      <div className="avatar avatar-online">
                        <img src={iconImgSrc} alt="#" className="avatar-img" />
                      </div>
                    </div>

                    <div className="col">
                      <div className="d-flex align-items-center mb-3">
                        <h5 className="me-auto mb-0">
                          {friend.firstName} {friend.lastName} (
                          {friend.username})
                        </h5>
                        <span className="text-muted extra-small ms-2">
                          (last time)
                        </span>
                      </div>

                      <div className="d-flex align-items-center">
                        <div className="line-clamp me-auto">(last message)</div>
                        <div className="badge badge-circle bg-primary ms-5">
                          <span>(#)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })
            : ""}
        </div>
        {selectedUser._id ? (
          <div className="col-md-8">
            <h2>
              Messages from {selectedUser?.firstName} {selectedUser?.lastName} (
              {selectedUser?.username})
            </h2>
            <div className="chat-messages">
              {isSuccessGetMessages
                ? messages.map((message) => {
                    // generate date time string for this message:
                    const time = new Date(message.date)
                    const timeString =
                      time.toLocaleDateString() +
                      " " +
                      time.toLocaleTimeString()

                    // CSS class names for message in/out:
                    const messageClassNames = classNames("message", {
                      "ps-2": selectedUser._id === message.from,
                      "message-out pe-2": selectedUser._id === message.to,
                    })

                    const avatarImgSrc =
                      message.from === user?._id ? userIcon : selectedFriendIcon

                    return (
                      <div className={messageClassNames} key={message._id}>
                        <span href="" className="avatar avatar-responsive">
                          <img
                            className="avatar-img"
                            src={avatarImgSrc}
                            alt=""
                          />
                        </span>
                        <div className="message-inner">
                          <div className="message-body">
                            <div className="message-content">
                              <div className="message-text">
                                <p>{message.content}</p>
                              </div>
                            </div>
                          </div>
                          <div className="message-footer">
                            <span className="extra-small text-muted">
                              {timeString}
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  })
                : ""}
              <div
                className="chat-finished"
                id="chat-finished"
                ref={messagesEndRef}
              />
            </div>
            <form
              className="chat-form rounded-pill bg-dark mt-4"
              data-emoji-form=""
            >
              <div className="row align-items-center gx-0 ms-3">
                <div className="col">
                  <div className="input-group">
                    <textarea
                      value={message}
                      onChange={onMessageChange}
                      onKeyUp={handleOnKeyUp}
                      className="form-control px-0"
                      placeholder="  Type your message..."
                      rows="1"
                      data-emoji-input=""
                      data-autosize="true"
                      style={{
                        overflow: "hidden",
                        overflowWrap: "break-word",
                        resize: "none",
                        height: "47px",
                      }}
                    ></textarea>
                  </div>
                </div>

                <div className="col-auto">
                  <button
                    className="btn btn-icon btn-primary rounded-circle ms-3"
                    onClick={onMessageSubmit}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="feather feather-send"
                    >
                      <line x1="22" y1="2" x2="11" y2="13"></line>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                  </button>
                </div>
              </div>
            </form>
          </div>
        ) : (
          ""
        )}
      </div>
    </main>
  )
}
