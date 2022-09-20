import { sliceAPI } from "../api/sliceAPI"

// use this WebSocket to send/accept messages
export let wss = null

export const sliceMessage = sliceAPI.injectEndpoints({
  endpoints: (builder) => ({
    getFriends: builder.query({
      query: (params) => ({
        url: "/friends",
        params,
      }),
      providesTags: [{ type: "friends", id: "list" }],
    }),
    getNonFriends: builder.query({
      query: (params) => ({
        url: "/non-friends",
        params,
      }),
      providesTags: [{ type: "non-friends", id: "list" }],
    }),
    getFriendData: builder.query({
      query: (friendId) => ({
        url: `/friends/${friendId}`,
      }),
      providesTags: (result, error, arg) => [{ type: "friend", id: arg }],
    }),
    getMessages: builder.query({
      query: (params) => ({
        url: `/messages/${params.friendId}`,
        params,
      }),
      providesTags: [{ type: "messages", id: "list" }],
      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) {
        // create a websocket connection when the cache subscription starts
        if (!wss) {
          wss = new WebSocket(`wss://localhost:3000`)
        }

        try {
          // wait for the initial query to resolve before proceeding
          await cacheDataLoaded

          // when data is received from the socket connection to the server,
          // if it is a message and for the appropriate channel,
          // update our query result with the received message
          const listener = (event) => {
            const data = JSON.parse(event.data)

            console.log("wss data:")
            console.log(data)
            console.log(
              `from: ${data.from}, arg, target user ID: ${arg.friendId}`
            )

            if (arg.friendId !== data.from && arg.friendId !== data.to) {
              // only accept messages from current friend
              return
            } else {
              updateCachedData((draft) => {
                draft.push(data)
              })
            }
          }

          wss.addEventListener("message", listener)
        } catch {
          // no-op in case `cacheEntryRemoved` resolves before `cacheDataLoaded`,
          // in which case `cacheDataLoaded` will throw
        }

        // cacheEntryRemoved will resolve when the cache subscription is no longer active
        await cacheEntryRemoved

        // perform cleanup steps once the `cacheEntryRemoved` promise resolves
        wss.close()
      },
    }),
    sendFriendRequest: builder.mutation({
      query: ({ targetUserId }) => ({
        url: `add-friend-request/`,
        method: "POST",
        body: { targetUserId },
      }),
      invalidatesTags: [{ type: "user-friend-requests", id: "list" }],
    }),
    getUserFriendRequests: builder.query({
      query: (params) => ({
        url: "/user-friend-requests",
        params,
      }),
      providesTags: [{ type: "user-friend-requests", id: "list" }],
    }),
    getFriendRequests: builder.query({
      query: (params) => ({
        url: "/friend-requests",
        params,
      }),
      providesTags: [{ type: "friend-requests", id: "list" }],
    }),
    acceptFriendRequest: builder.mutation({
      query: ({ targetUserId }) => ({
        url: `accept-friend-request/`,
        method: "POST",
        body: { targetUserId },
      }),
      invalidatesTags: [
        { type: "friend-requests", id: "list" },
        { type: "friends", id: "list" },
        { type: "non-friends", id: "list" },
      ],
    }),
  }),
})

export const {
  useGetFriendsQuery,
  useGetNonFriendsQuery,
  useGetMessagesQuery,
  useSendFriendRequestMutation,
  useGetUserFriendRequestsQuery,
  useGetFriendRequestsQuery,
  useAcceptFriendRequestMutation,
  useGetFriendDataQuery,
} = sliceMessage
