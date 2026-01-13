import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toggleAddBookPopup } from "./popUpSlice";
import { toast } from "react-toastify";

const bookSlice = createSlice({
  name: "book",
  initialState: {
    loading: false,
    error: null,
    message: null,
    books: [],
    totalBooks: 0,
    page: 1,
    limit: 0,
    totalPages: 1,
  },
  reducers: {
    // ===== FETCH BOOKS =====
    fetchBooksRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    fetchBooksSuccess(state, action) {
      state.loading = false;
      state.books = action.payload.books;
      state.totalBooks = action.payload.totalBooks;
      state.page = action.payload.page;
      state.limit = action.payload.limit;
      state.totalPages = action.payload.totalPages;
      state.message = null;
    },
    fetchBooksFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.message = null;
    },

    // ===== ADD BOOK =====
    addBookRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    addBookSuccess(state, action) {
      state.loading = false;
      state.message = action.payload;
    },
    addBookFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    // ===== RESET =====
    resetBookSlice(state) {
      state.error = null;
      state.message = null;
      state.loading = false;
    },
  },
});

export const fetchAllBooks = (params = {}) => async (dispatch) => {
  dispatch(bookSlice.actions.fetchBooksRequest());

  await axios
    .get("http://localhost:4000/api/v1/book/all", {
      withCredentials: true,
      params,
    })
    .then((res) => {
      dispatch(
        bookSlice.actions.fetchBooksSuccess({
          books: res.data.books,
          totalBooks: res.data.totalBooks,
          page: res.data.page,
          limit: res.data.limit,
          totalPages: res.data.totalPages,
        })
      );
    })
    .catch((err) => {
      dispatch(
        bookSlice.actions.fetchBooksFailed(
          err.response.data.message
        )
      );
    });
};

export const addBook = (data) => async (dispatch) => {
  dispatch(bookSlice.actions.addBookRequest());

  await axios
    .post(
      "http://localhost:4000/api/v1/book/admin/add",
      data,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then((res) => {
      dispatch(
        bookSlice.actions.addBookSuccess(res.data.message)
      );
      toast.success(res.data.message);
      dispatch(toggleAddBookPopup());
      dispatch(fetchAllBooks());
    })
    .catch((err) => {
      dispatch(
        bookSlice.actions.addBookFailed(
          err.response.data.message
        )
      );
    });
};

export const resetBookSlice = () => (dispatch) => {
  dispatch(bookSlice.actions.resetBookSlice());
};

export default bookSlice.reducer;