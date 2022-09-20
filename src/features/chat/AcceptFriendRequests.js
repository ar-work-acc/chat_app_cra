import React from "react"
import {
  useGetFriendRequestsQuery,
  useAcceptFriendRequestMutation,
} from "./sliceMessage"

export const AcceptFriendRequests = () => {
  const { data: friendRequests = [], isSuccess } = useGetFriendRequestsQuery()

  const [acceptFriendRequest] = useAcceptFriendRequestMutation()
  const acceptFriendRequestCallbackGenerator = (targetUserId) => {
    return async () => {
      try {
        const payload = await acceptFriendRequest({ targetUserId }).unwrap()
        console.log("fulfilled", payload)
      } catch (error) {
        console.error("rejected", error)
      }
    }
  }

  return (
    <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
      <h2>AcceptFriendRequests</h2>
      <table className="table table-dark table-striped">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">e-mail</th>
            <th scope="col">First Name</th>
            <th scope="col">Last Name</th>
            <th scope="col">Operations</th>
          </tr>
        </thead>
        <tbody>
          {isSuccess ? (
            friendRequests.map((request, index) => {
              const user = request.from
              return (
                <tr key={request._id}>
                  <th scope="row">{index + 1}</th>
                  <td>{user.username}</td>
                  <td>{user.firstName}</td>
                  <td>{user.lastName}</td>
                  <td>
                    <button
                      onClick={acceptFriendRequestCallbackGenerator(user._id)}
                      type="button"
                      className="btn btn-primary btn-sm"
                    >
                      Accept Friend Request
                    </button>
                  </td>
                </tr>
              )
            })
          ) : (
            <React.Fragment></React.Fragment>
          )}
        </tbody>
      </table>
    </main>
  )
}
