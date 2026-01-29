import React, { useEffect, useMemo, useState } from "react";
import { BookA, NotebookPen, Search } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleAddBookPopup,
  toggleReadBookPopup,
  toggleRecordBookPopup,
} from "../store/slices/popUpSlice";
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
  const { loading, error, message, books, totalBooks, totalPages } = useSelector(
    (state) => state.book
  );
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
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(8);

  // ===== FUNCTIONS =====
  const openReadPopup = (id) => {
    const book = (books || []).find((b) => b._id === id);
    setReadBook(book);
    dispatch(toggleReadBookPopup());
  };

  const openRecordBookPopup = (bookId) => {
    setBorrowBookId(bookId);
    dispatch(toggleRecordBookPopup());
  };

  // ===== EFFECT =====
  const queryParams = useMemo(() => {
    const params = {
      page,
      limit,
      sort: sortOption,
    };
    const keyword = searchedKeyword.trim();
    if (keyword) {
      params.search = keyword;
    }
    if (availabilityFilter !== "all") {
      params.availability = availabilityFilter;
    }
    if (minPrice !== "") {
      params.minPrice = minPrice;
    }
    if (maxPrice !== "") {
      params.maxPrice = maxPrice;
    }
    return params;
  }, [
    page,
    limit,
    sortOption,
    searchedKeyword,
    availabilityFilter,
    minPrice,
    maxPrice,
  ]);

  /**
   * ✅ FIX DUPLICATE TOAST:
   * - Toast đã được xử lý trong bookSlice/borrowSlice (thunks).
   * - Trang này chỉ làm nhiệm vụ reload data + reset state.
   * - KHÔNG toast ở đây nữa để tránh hiển thị 2 popup.
   */
  useEffect(() => {
    if (message || borrowSliceMessage) {
      dispatch(fetchAllBooks(queryParams));
      dispatch(fetchAllBorrowedBooks());
      dispatch(resetBookSlice());
      dispatch(resetBorrowSlice());
    }

    if (error || borrowSliceError) {
      dispatch(resetBookSlice());
      dispatch(resetBorrowSlice());
    }
  }, [
    dispatch,
    message,
    error,
    borrowSliceError,
    borrowSliceMessage,
    queryParams,
  ]);

  useEffect(() => {
    dispatch(fetchAllBooks(queryParams));
  }, [dispatch, queryParams]);

  useEffect(() => {
    if (page > totalPages && totalPages > 0) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const searchedBooks = books || [];

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

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex flex-1 flex-col gap-3 rounded-xl border border-[#FDE8EA] bg-[#FFFDFD] p-3 sm:p-4">
                <div className="text-xs uppercase tracking-wide text-gray-500 font-semibold">
                  Tìm kiếm & lọc
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  {/* Search */}
                  <div className="relative w-full sm:w-72">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Tìm theo tên / tác giả..."
                      className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-0 focus:border-gray-300"
                      value={searchedKeyword}
                      onChange={(e) => {
                        setSearchedKeyword(e.target.value);
                        setPage(1);
                      }}
                    />
                  </div>

                  <select
                    className="w-full sm:w-auto px-3 py-2 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-0 focus:border-gray-300"
                    value={availabilityFilter}
                    onChange={(e) => {
                      setAvailabilityFilter(e.target.value);
                      setPage(1);
                    }}
                  >
                    <option value="all">Tất cả trạng thái</option>
                    <option value="true">Còn sách</option>
                    <option value="false">Hết sách</option>
                  </select>

                  <select
                    className="w-full sm:w-auto px-3 py-2 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-0 focus:border-gray-300"
                    value={sortOption}
                    onChange={(e) => {
                      setSortOption(e.target.value);
                      setPage(1);
                    }}
                  >
                    <option value="newest">Mới nhất</option>
                    <option value="price_asc">Giá tăng dần</option>
                    <option value="price_desc">Giá giảm dần</option>
                    <option value="quantity_desc">Còn nhiều</option>
                    <option value="quantity_asc">Còn ít</option>
                  </select>
                </div>
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
                Tổng: {totalBooks} sách
              </span>
            </div>

            {loading || borrowSliceLoading ? (
              <span className="text-sm text-gray-500">Đang tải...</span>
            ) : null}
          </div>

          {searchedBooks.length > 0 ? (
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

                    {/* ✅ THÊM 2 CỘT: Tổng bản sao + Còn lại (chưa mượn) */}
                    {isAuthenticated && user?.role === "Admin" && (
                      <>
                        <th className="px-4 py-3 text-left text-base font-bold text-[#C41526]">
                          Tổng bản sao
                        </th>
                        <th className="px-4 py-3 text-left text-base font-bold text-[#C41526]">
                          Còn lại
                        </th>
                      </>
                    )}

                    <th className="px-4 py-3 text-left text-base font-bold text-[#C41526]">
                      Giá mượn
                    </th>
                    <th className="px-4 py-3 text-left text-base font-bold text-[#C41526]">
                      Trạng thái
                    </th>

                    {/* ✅ USER cũng thấy icon xem thông tin: mở cột thao tác cho mọi người đăng nhập */}
                    {isAuthenticated && (
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
                      className={`border-t border-gray-100 ${
                        (index + 1) % 2 === 0 ? "bg-gray-50" : "bg-white"
                      } hover:bg-[#FFF5F6] transition`}
                    >
                      <td className="px-4 py-3">
                        {(page - 1) * limit + index + 1}
                      </td>
                      <td className="px-4 py-3 font-bold text-gray-900">
                        {book.title}
                      </td>
                      <td className="px-4 py-3 text-gray-700">{book.author}</td>

                      {/* ✅ THÊM 2 CỘT DATA */}
                      {isAuthenticated && user?.role === "Admin" && (
                        <>
                          <td className="px-4 py-3">{book.totalCopies ?? 0}</td>
                          <td className="px-4 py-3">{book.quantity ?? 0}</td>
                        </>
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

                      {/* ✅ USER + ADMIN đều xem được; chỉ ADMIN mới ghi nhận mượn/trả */}
                      {isAuthenticated && (
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

                            {user?.role === "Admin" && (
                              <button
                                type="button"
                                onClick={() => openRecordBookPopup(book._id)}
                                className="p-2 rounded-lg border border-gray-200 hover:border-[#C41526] hover:bg-[#FDE8EA] transition"
                                title="Ghi nhận mượn/trả"
                              >
                                <NotebookPen className="w-5 h-5 text-[#C41526]" />
                              </button>
                            )}
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

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-5 py-4 border-t border-[#FDE8EA] bg-[#FFFDFD]">
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <span className="font-semibold text-gray-700">
                Hiển thị {searchedBooks.length} / {totalBooks} sách
              </span>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Giá</span>
                <input
                  type="number"
                  min="0"
                  placeholder="Từ"
                  className="w-20 px-2 py-1 border border-gray-200 rounded-md bg-white focus:outline-none focus:ring-0 focus:border-gray-300"
                  value={minPrice}
                  onChange={(e) => {
                    setMinPrice(e.target.value);
                    setPage(1);
                  }}
                />
                <span className="text-gray-400">-</span>
                <input
                  type="number"
                  min="0"
                  placeholder="Đến"
                  className="w-20 px-2 py-1 border border-gray-200 rounded-md bg-white focus:outline-none focus:ring-0 focus:border-gray-300"
                  value={maxPrice}
                  onChange={(e) => {
                    setMaxPrice(e.target.value);
                    setPage(1);
                  }}
                />
              </div>
              <button
                type="button"
                className="px-3 py-1 rounded-md border border-[#FDE8EA] text-[#C41526] font-semibold hover:bg-[#FDE8EA] transition"
                onClick={() => {
                  setSearchedKeyword("");
                  setAvailabilityFilter("all");
                  setMinPrice("");
                  setMaxPrice("");
                  setSortOption("newest");
                  setPage(1);
                }}
              >
                Xóa lọc
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>Hiển thị</span>
                <select
                  className="px-2 py-1 border border-gray-200 rounded-md bg-white focus:outline-none focus:ring-0 focus:border-gray-300"
                  value={limit}
                  onChange={(e) => {
                    setLimit(Number(e.target.value));
                    setPage(1);
                  }}
                >
                  <option value={5}>5</option>
                  <option value={8}>8</option>
                  <option value={12}>12</option>
                </select>
                <span>sách / trang</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={page <= 1}
                  className="px-3 py-1 rounded-md border border-gray-200 text-sm font-semibold text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:border-[#C41526] hover:text-[#C41526] transition"
                >
                  Trước
                </button>
                <span className="text-sm text-gray-600">
                  Trang {page} / {totalPages}
                </span>
                <button
                  type="button"
                  onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={page >= totalPages}
                  className="px-3 py-1 rounded-md border border-gray-200 text-sm font-semibold text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:border-[#C41526] hover:text-[#C41526] transition"
                >
                  Sau
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {addBookPopup && <AddBookPopup />}
      {readBookPopup && <ReadBookPopup book={readBook} />}
      {/* ✅ Chỉ ADMIN mới được mở popup ghi nhận mượn/trả */}
      {recordBookPopup && user?.role === "Admin" && (
        <RecordBookPopup bookId={borrowBookId} />
      )}
    </>
  );
};

export default BookManagement;
