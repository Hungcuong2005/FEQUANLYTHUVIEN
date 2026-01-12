import React, { useEffect, useMemo, useState } from "react";
import { BookA, NotebookPen, Search } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleAddBookPopup,
  toggleReadBookPopup,
  toggleRecordBookPopup,
} from "../store/slices/popUpSlice";
import { toast } from "react-toastify";
import { fetchAllBooks, resetBookSlice } from "../store/slices/bookSlice";
import {
  fetchAllBorrowedBooks,
  resetBorrowSlice,
} from "../store/slices/borrowSlice";
import Header from "../layout/Header";
import AddBookPopup from "../popups/AddBookPopup";
import ReadBookPopup from "../popups/ReadBookPopup";
import RecordBookPopup from "../popups/RecordBookPopup";

const BookManagement = () => {
  const dispatch = useDispatch();

  // ===== REDUX STATES =====
  const { loading, error, message, books } = useSelector((state) => state.book);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { addBookPopup, readBookPopup, recordBookPopup } = useSelector(
    (state) => state.popup
  );

  const {
    loading: borrowSliceLoading,
    error: borrowSliceError,
    message: borrowSliceMessage,
  } = useSelector((state) => state.borrow);

  // ===== LOCAL STATES =====
  const [readBook, setReadBook] = useState({});
  const [borrowBookId, setBorrowBookId] = useState("");
  const [searchedKeyword, setSearchedKeyword] = useState("");

  // ===== FUNCTIONS =====
  const openReadPopup = (id) => {
    const book = books.find((b) => b._id === id);
    setReadBook(book);
    dispatch(toggleReadBookPopup());
  };

  const openRecordBookPopup = (bookId) => {
    setBorrowBookId(bookId);
    dispatch(toggleRecordBookPopup());
  };

  // ===== EFFECT =====
  useEffect(() => {
    if (message || borrowSliceMessage) {
      toast.success(message || borrowSliceMessage);
      dispatch(fetchAllBooks());
      dispatch(fetchAllBorrowedBooks());
      dispatch(resetBookSlice());
      dispatch(resetBorrowSlice());
    }

    if (error || borrowSliceError) {
      toast.error(error || borrowSliceError);
      dispatch(resetBookSlice());
      dispatch(resetBorrowSlice());
    }
  }, [
    dispatch,
    message,
    error,
    loading,
    borrowSliceError,
    borrowSliceLoading,
    borrowSliceMessage,
  ]);

  const searchedBooks = useMemo(() => {
    const key = searchedKeyword.trim().toLowerCase();
    if (!key) return books || [];
    return (books || []).filter((b) => (b.title || "").toLowerCase().includes(key));
  }, [books, searchedKeyword]);

  const moneyVND = (value) => {
    if (typeof value === "number") return `${value.toLocaleString("vi-VN")}₫`;
    if (value === null || value === undefined) return "—";
    return `${value}₫`;
  };

  return (
    <>
      <main className="relative flex-1 p-6 pt-28">
        <Header />

        {/* ===== Top Bar ===== */}
        <div className="bg-white rounded-xl shadow-md border border-[#FDE8EA] p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl md:text-2xl font-semibold text-[#C41526]">
                {user?.role === "Admin" ? "Quản lý sách" : "Danh sách sách"}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {user?.role === "Admin"
                  ? "Thêm / xem / ghi nhận mượn-trả sách trong thư viện."
                  : "Xem danh sách sách hiện có trong thư viện."}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
              {/* Search */}
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Tìm theo tên sách..."
                  className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C41526] focus:border-[#C41526]"
                  value={searchedKeyword}
                  onChange={(e) => setSearchedKeyword(e.target.value)}
                />
              </div>

              {/* Add */}
              {isAuthenticated && user?.role === "Admin" && (
                <button
                  type="button"
                  onClick={() => dispatch(toggleAddBookPopup())}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#C41526] text-white font-semibold hover:bg-[#A81220] transition"
                >
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white text-[#C41526] font-bold">
                    +
                  </span>
                  Thêm sách
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ===== Table ===== */}
        <div className="mt-6 bg-white rounded-xl shadow-lg border border-[#FDE8EA] overflow-hidden">
          {/* table title strip */}
          <div className="px-5 py-3 border-b border-[#FDE8EA] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#C41526]" />
              <span className="font-semibold text-gray-800">
                Tổng: {searchedBooks.length} sách
              </span>
            </div>

            {loading || borrowSliceLoading ? (
              <span className="text-sm text-gray-500">Đang tải...</span>
            ) : null}
          </div>

          {searchedBooks && searchedBooks.length > 0 ? (
            <div className="overflow-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-[#FDE8EA]">
                    <th className="px-4 py-3 text-left text-base font-bold text-[#C41526]">
                      STT
                    </th>
                    <th className="px-4 py-3 text-left text-base font-bold text-[#C41526]">
                      Tên sách
                    </th>
                    <th className="px-4 py-3 text-left text-base font-bold text-[#C41526]">
                      Tác giả
                    </th>

                    {isAuthenticated && user?.role === "Admin" && (
                      <th className="px-4 py-3 text-left text-base font-bold text-[#C41526]">
                        Số lượng
                      </th>
                    )}

                    <th className="px-4 py-3 text-left text-base font-bold text-[#C41526]">
                      Giá mượn
                    </th>
                    <th className="px-4 py-3 text-left text-base font-bold text-[#C41526]">
                      Trạng thái
                    </th>

                    {isAuthenticated && user?.role === "Admin" && (
                      <th className="px-4 py-3 text-center text-base font-bold text-[#C41526]">
                        Thao tác
                      </th>
                    )}
                  </tr>
                </thead>



                <tbody>
                  {searchedBooks.map((book, index) => (
                    <tr
                      key={book._id}
                      className={`border-t border-gray-100 ${(index + 1) % 2 === 0 ? "bg-gray-50" : "bg-white"
                        } hover:bg-[#FFF5F6] transition`}
                    >
                      <td className="px-4 py-3">{index + 1}</td>
                      <td className="px-4 py-3 font-bold text-gray-900">
                        {book.title}
                      </td>
                      <td className="px-4 py-3 text-gray-700">{book.author}</td>

                      {isAuthenticated && user?.role === "Admin" && (
                        <td className="px-4 py-3">{book.quantity}</td>
                      )}

                      <td className="px-4 py-3">{moneyVND(book.price)}</td>

                      <td className="px-4 py-3">
                        {book.availability ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-md text-sm font-semibold bg-[#E9FBEF] text-[#0F7A2A]">
                            Còn sách
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 rounded-md text-sm font-semibold bg-[#FDE8EA] text-[#C41526]">
                            Hết sách
                          </span>
                        )}
                      </td>

                      {isAuthenticated && user?.role === "Admin" && (
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={() => openReadPopup(book._id)}
                              className="p-2 rounded-lg border border-gray-200 hover:border-[#C41526] hover:bg-[#FDE8EA] transition"
                              title="Xem chi tiết"
                            >
                              <BookA className="w-5 h-5 text-[#C41526]" />
                            </button>

                            <button
                              type="button"
                              onClick={() => openRecordBookPopup(book._id)}
                              className="p-2 rounded-lg border border-gray-200 hover:border-[#C41526] hover:bg-[#FDE8EA] transition"
                              title="Ghi nhận mượn/trả"
                            >
                              <NotebookPen className="w-5 h-5 text-[#C41526]" />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-6">
              <h3 className="text-lg font-semibold text-[#C41526]">
                Không tìm thấy sách!
              </h3>
              <p className="text-gray-600 mt-1">
                Thử nhập từ khoá khác hoặc kiểm tra lại dữ liệu thư viện.
              </p>
            </div>
          )}
        </div>
      </main>

      {addBookPopup && <AddBookPopup />}
      {readBookPopup && <ReadBookPopup book={readBook} />}
      {recordBookPopup && <RecordBookPopup bookId={borrowBookId} />}
    </>
  );
};

export default BookManagement;
