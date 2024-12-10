import { baseApi } from "../../api/baseApi";

export const flightsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => ({
        url: "/users",
        method: "GET",
      }),
      providesTags: ["Users"],
    }),

    getSingleUser: builder.query({
      query: (id) => ({
        url: `/users/${id}`,
        method: "GET",
      }),
      providesTags: ["User"],
    }),

    updateProfile: builder.mutation({
      query: ({ profileData, id }) => ({
        url: `/users/${id}`,
        method: "PUT",
        body: profileData,
      }),
      invalidatesTags: ["User", "Users"],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetSingleUserQuery,
  useUpdateProfileMutation,
} = flightsApi;
