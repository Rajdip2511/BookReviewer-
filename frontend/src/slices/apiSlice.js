import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:3000',
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.userInfo?.token;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ['User', 'Book', 'Review'],
  endpoints: (builder) => ({
    // Auth endpoints
    login: builder.mutation({
      query: (data) => ({
        url: '/login',
        method: 'POST',
        body: data,
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: '/register',
        method: 'POST',
        body: data,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: '/customer/logout',
        method: 'POST',
      }),
    }),
    updateUser: builder.mutation({
      query: (data) => ({
        url: '/customer/profile',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),

    // Book endpoints
    getBooks: builder.query({
      query: () => '/',
      transformResponse: (response) => response,
      providesTags: ['Book'],
    }),
    getBookByIsbn: builder.query({
      query: (isbn) => `/isbn/${isbn}`,
      transformResponse: (response) => response,
      providesTags: ['Book'],
    }),
    getBooksByAuthor: builder.query({
      query: (author) => `/author/${author}`,
      transformResponse: (response) => response,
      providesTags: ['Book'],
    }),
    getBooksByTitle: builder.query({
      query: (title) => `/title/${title}`,
      transformResponse: (response) => response,
      providesTags: ['Book'],
    }),

    // Review endpoints
    getBookReviews: builder.query({
      query: (isbn) => `/review/${isbn}`,
      transformResponse: (response) => response,
      providesTags: ['Review'],
    }),
    getUserReviews: builder.query({
      query: () => '/customer/reviews',
      providesTags: ['Review'],
    }),
    addReview: builder.mutation({
      query: ({ isbn, review }) => ({
        url: `/customer/auth/review/${isbn}`,
        method: 'PUT',
        body: { review },
      }),
      invalidatesTags: ['Review'],
    }),
    deleteReview: builder.mutation({
      query: (isbn) => ({
        url: `/customer/auth/review/${isbn}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Review'],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useUpdateUserMutation,
  useGetBooksQuery,
  useGetBookByIsbnQuery,
  useGetBooksByAuthorQuery,
  useGetBooksByTitleQuery,
  useGetBookReviewsQuery,
  useGetUserReviewsQuery,
  useAddReviewMutation,
  useDeleteReviewMutation,
} = apiSlice; 