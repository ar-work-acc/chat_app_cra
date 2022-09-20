import React from "react"
import {
  useGetNonFriendsQuery,
  useSendFriendRequestMutation,
  useGetUserFriendRequestsQuery,
} from "./sliceMessage"

export const AddFriends = () => {
  const { data: nonFriends = [], isSuccess } = useGetNonFriendsQuery()
  const {
    data: userFriendRequests = [],
    isSuccess: isSuccessGetUserFriendRequests,
  } = useGetUserFriendRequestsQuery(null, { skip: nonFriends.length === 0 })
  const userFriendRequestsIds = userFriendRequests.map((request) => request.to)

  const [sendFriendRequest] = useSendFriendRequestMutation()

  const addFriendCallbackGenerator = (targetUserId) => {
    return async () => {
      try {
        const payload = await sendFriendRequest({ targetUserId }).unwrap()
        console.log("fulfilled", payload)
      } catch (error) {
        console.error("rejected", error)
      }
    }
  }

  return (
    <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
      <h2>AddFriends</h2>
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
            nonFriends.map((user, index) => {
              return (
                <tr key={user._id}>
                  <th scope="row">{index + 1}</th>
                  <td>{user.username}</td>
                  <td>{user.firstName}</td>
                  <td>{user.lastName}</td>
                  <td>
                    {userFriendRequestsIds.includes(user._id) ? (
                      "Requested"
                    ) : (
                      <button
                        onClick={addFriendCallbackGenerator(user._id)}
                        type="button"
                        className="btn btn-primary btn-sm"
                      >
                        Add Friend
                      </button>
                    )}
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
