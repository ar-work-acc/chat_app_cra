// Import the RTK Query methods from the React-specific entry point
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

// Define our single API slice object
export const sliceAPI = createApi({
  // The cache reducer expects to be added at `state.api` (already default - this is optional)
  reducerPath: "api",
  // All of our requests will have URLs starting with '/api/v1'
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/v1",
    // prepareHeaders: () => {
    //   return new Headers({
    //     Accept: "application/json, text/plain, */*",
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${localStorage.getItem("jwt")}`, // for Koa.js JWT (use cookies instead)
    //   })
    // },
  }),
  // The "endpoints" represent operations and requests for this server
  endpoints: (builder) => ({
    login: builder.mutation({
      query: ({ username, password }) => ({
        url: `login/`,
        method: "POST",
        body: { username, password },
      }),
      invalidatesTags: [{ type: "User", id: "login" }],
    }),
    logout: builder.mutation({
      query: () => ({
        url: `logout/`,
        method: "POST",
      }),
      // invalidatesTags: [{ type: "User", id: "login" }],
    }),
    getUser: builder.query({
      query: () => ({
        url: `user/`,
      }),
      providesTags: [{ type: "User", id: "login" }],
    }),
    oauthSignIn: builder.mutation({
      query: ({ email, firstName, lastName, avatar, accountType = 1 }) => ({
        url: `oauth-sign-in/`,
        method: "POST",
        body: { email, firstName, lastName, avatar, accountType },
      }),
      invalidatesTags: [{ type: "User", id: "login" }],
    }),
  }),
})

// Export the auto-generated hook for query endpoints
export const {
  useLoginMutation,
  useLogoutMutation,
  useGetUserQuery,
  useOauthSignInMutation,
} = sliceAPI
