import { baseApi } from "../../api/baseApi";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (loginInfo) => ({
        url: "/login",
        method: "POST",
        body: loginInfo,
      }),
    }),

    signUp: builder.mutation({
      query: (signUpInfo) => ({
        url: "/register",
        method: "POST",
        body: signUpInfo,
      }),
    }),
  }),
});

export const { useLoginMutation, useSignUpMutation } = authApi;
