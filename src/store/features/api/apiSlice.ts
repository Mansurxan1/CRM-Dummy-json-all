import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'apiSlice',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://dummyjson.com/' }),
  tagTypes: ['User', 'Product', 'Cart', 'Post', 'Comment', 'Todo'],
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: ({ limit = 10, skip = 0 }) => `users?limit=${limit}&skip=${skip}`,
      providesTags: ['User'],
    }),
    addUser: builder.mutation({
      query: (user) => ({
        url: 'users/add',
        method: 'POST',
        body: user,
      }),
      invalidatesTags: ['User'],
    }),
    updateUser: builder.mutation({
      query: ({ id, ...user }) => ({
        url: `users/${id}`,
        method: 'PUT',
        body: user,
      }),
      invalidatesTags: ['User'],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),
    getProducts: builder.query({
      query: ({ limit = 10, skip = 0 }) => `products?limit=${limit}&skip=${skip}`,
      providesTags: ['Product'],
    }),
    addProduct: builder.mutation({
      query: (product) => ({
        url: 'products/add',
        method: 'POST',
        body: product,
      }),
      invalidatesTags: ['Product'],
    }),
    updateProduct: builder.mutation({
      query: ({ id, ...product }) => ({
        url: `products/${id}`,
        method: 'PUT',
        body: product,
      }),
      invalidatesTags: ['Product'],
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Product'],
    }),
    getCarts: builder.query({
      query: ({ limit = 10, skip = 0 }) => `carts?limit=${limit}&skip=${skip}`,
      providesTags: ['Cart'],
    }),
    addCart: builder.mutation({
      query: (cart) => ({
        url: 'carts/add',
        method: 'POST',
        body: cart,
      }),
      invalidatesTags: ['Cart'],
    }),
    updateCart: builder.mutation({
      query: ({ id, ...cart }) => ({
        url: `carts/${id}`,
        method: 'PUT',
        body: cart,
      }),
      invalidatesTags: ['Cart'],
    }),
    deleteCart: builder.mutation({
      query: (id) => ({
        url: `carts/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Cart'],
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: 'auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    getPosts: builder.query({
      query: ({ limit = 10, skip = 0 }) => `posts?limit=${limit}&skip=${skip}`,
      providesTags: ['Post'],
    }),
    addPost: builder.mutation({
      query: (post) => ({
        url: 'posts/add',
        method: 'POST',
        body: post,
      }),
      invalidatesTags: ['Post'],
    }),
    updatePost: builder.mutation({
      query: ({ id, ...post }) => ({
        url: `posts/${id}`,
        method: 'PUT',
        body: post,
      }),
      invalidatesTags: ['Post'],
    }),
    deletePost: builder.mutation({
      query: (id) => ({
        url: `posts/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Post'],
    }),
    getComments: builder.query({
      query: ({ limit = 10, skip = 0 }) => `comments?limit=${limit}&skip=${skip}`,
      providesTags: ['Comment'],
    }),
    addComment: builder.mutation({
      query: (comment) => ({
        url: 'comments/add',
        method: 'POST',
        body: comment,
      }),
      invalidatesTags: ['Comment'],
    }),
    updateComment: builder.mutation({
      query: ({ id, ...comment }) => ({
        url: `comments/${id}`,
        method: 'PUT',
        body: comment,
      }),
      invalidatesTags: ['Comment'],
    }),
    deleteComment: builder.mutation({
      query: (id) => ({
        url: `comments/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Comment'],
    }),
    getTodos: builder.query({
      query: ({ limit = 10, skip = 0 }) => `todos?limit=${limit}&skip=${skip}`,
      providesTags: ['Todo'],
    }),
    addTodo: builder.mutation({
      query: (todo) => ({
        url: 'todos/add',
        method: 'POST',
        body: todo,
      }),
      invalidatesTags: ['Todo'],
    }),
    updateTodo: builder.mutation({
      query: ({ id, ...todo }) => ({
        url: `todos/${id}`,
        method: 'PUT',
        body: todo,
      }),
      invalidatesTags: ['Todo'],
    }),
    deleteTodo: builder.mutation({
      query: (id) => ({
        url: `todos/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Todo'],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useAddUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetProductsQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetCartsQuery,
  useAddCartMutation,
  useUpdateCartMutation,
  useDeleteCartMutation,
  useLoginMutation,
  useGetPostsQuery,
  useAddPostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
  useGetCommentsQuery,
  useAddCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
  useGetTodosQuery,
  useAddTodoMutation,
  useUpdateTodoMutation,
  useDeleteTodoMutation,
} = apiSlice;