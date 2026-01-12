import React, { useEffect, useState } from "react";
import { PiKeyReturnBold } from "react-icons/pi";
import { FaSquareCheck } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { toggleReturnBookPopup } from "../store/slices/popUpSlice";
import { toast } from "react-toastify";
import {
  fetchAllBorrowedBooks,
  resetBorrowSlice,
} from "../store/slices/borrowSlice";
import { fetchAllBooks, resetBookSlice } from "../store/slices/bookSlice";
import ReturnBookPopup from "../popups/ReturnBookPopup";
import Header from "../layout/Header";

const Catalog = () => {
  const dispatch = useDispatch();

  const { returnBookPopup } = useSelector((state) => state.popup);
  const { loading, error, allBorrowedBooks, message } = useSelector(
    (state) => state.borrow
  );

  const [filter, setFilter] = useState("borrowed");

  const formatDateAndTime = (timeStamp) => {
    const date = new Date(timeStamp);

    const formattedDate = `${String(date.getDate()).padStart(2, "0")}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${date.getFullYear()}`;

    const formattedTime = `${String(date.getHours()).padStart(
      2,
      "0"
    )}:${String(date.getMinutes()).padStart(2, "0")}:${String(
      date.getSeconds()
    ).padStart(2, "0")}`;

    return `${formattedDate} ${formattedTime}`;
  };

  const formatDate = (timeStamp) => {
    const date = new Date(timeStamp);

    return `${String(date.getDate()).padStart(2, "0")}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${String(date.getFullYear())}`;
  };

  // ===== FILTER BOOKS =====
  const currentDate = new Date();

  // Đang mượn (chưa quá hạn)
  const borrowedBooks = allBorrowedBooks?.filter((book) => {
    const dueDate = new Date(book.dueDate);
    return dueDate > currentDate;
  });

  // Quá hạn
  const overdueBooks = allBorrowedBooks?.filter((book) => {
    const dueDate = new Date(book.dueDate);
    return dueDate <= currentDate;
  });

  const booksToDisplay = filter === "borrowed" ? borrowedBooks : overdueBooks;

  // ===== RETURN BOOK POPUP =====
  const [email, setEmail] = useState("");
  const [borrowedBookId, setBorrowedBookId] = useState("");

  const openReturnBookPopup = (bookId, email) => {
    setBorrowedBookId(bookId);
    setEmail(email);
    dispatch(toggleReturnBookPopup());
  };

  // ===== EFFECT =====
  useEffect(() => {
    if (message) {
      toast.success(message);
      dispatch(fetchAllBooks());
      dispatch(fetchAllBorrowedBooks());
      dispatch(resetBookSlice());
      dispatch(resetBorrowSlice());
    }

    if (error) {
      toast.error(error);
      dispatch(resetBorrowSlice());
    }
  }, [dispatch, error, loading]);

  return (
    <>
      <main className="relative flex-1 p-6 pt-28">
        <Header />

        {/* Filter Buttons */}
        <header className="flex flex-col gap-3 sm:flex-row md:items-center">
          <button
            className={`relative rounded sm:rounded-tr-none sm:rounded-br-none sm:rounded-tl-lg sm:rounded-bl-lg
            text-center border-2 font-semibold py-2 w-full sm:w-72 transition
            ${filter === "borrowed"
                ? "bg-[#C41526] text-white border-[#C41526]"
                : "bg-gray-200 text-black border-gray-200 hover:bg-gray-300"
              }`}
            onClick={() => setFilter("borrowed")}
          >
            Sách đang mượn
          </button>

          <button
            className={`relative rounded sm:rounded-tl-none sm:rounded-bl-none sm:rounded-tr-lg sm:rounded-br-lg
            text-center border-2 font-semibold py-2 w-full sm:w-72 transition
            ${filter === "overdue"
                ? "bg-[#C41526] text-white border-[#C41526]"
                : "bg-gray-200 text-black border-gray-200 hover:bg-gray-300"
              }`}
            onClick={() => setFilter("overdue")}
          >
            Danh sách quá hạn
          </button>
        </header>

        {booksToDisplay && booksToDisplay.length > 0 ? (
          <div className="mt-6 overflow-auto bg-white rounded-md shadow-lg border-t-4 border-[#C41526]">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-[#FDE8EA]">
                  <th className="px-4 py-3 text-left text-base font-bold text-[#C41526]">
                    STT
                  </th>
                  <th className="px-4 py-3 text-left text-base font-bold text-[#C41526]">
                    Tên người dùng
                  </th>
                  <th className="px-4 py-3 text-left text-base font-bold text-[#C41526]">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-base font-bold text-[#C41526]">
                    Giá
                  </th>
                  <th className="px-4 py-3 text-left text-base font-bold text-[#C41526]">
                    Hạn trả
                  </th>
                  <th className="px-4 py-3 text-left text-base font-bold text-[#C41526]">
                    Ngày &amp; giờ mượn
                  </th>
                  <th className="px-4 py-3 text-left text-base font-bold text-[#C41526]">
                    Trả sách
                  </th>
                </tr>
              </thead>



              <tbody>
                {booksToDisplay.map((book, index) => (
                  <tr
                    key={index}
                    className={(index + 1) % 2 === 0 ? "bg-gray-50" : ""}
                  >
                    <td className="px-4 py-2">{index + 1}</td>

                    <td className="px-4 py-2">{book?.user?.name}</td>

                    <td className="px-4 py-2">{book?.user?.email}</td>

                    <td className="px-4 py-2">
                      {typeof book.price === "number"
                        ? `${book.price.toLocaleString("vi-VN")}₫`
                        : book.price}
                    </td>

                    <td className="px-4 py-2">{formatDate(book.dueDate)}</td>

                    <td className="px-4 py-2">
                      {formatDateAndTime(book.createdAt)}
                    </td>

                    <td className="px-4 py-2">
                      {book.returnDate ? (
                        <FaSquareCheck className="w-6 h-6 text-green-600" />
                      ) : (
                        <PiKeyReturnBold
                          className="w-6 h-6 cursor-pointer text-[#C41526] hover:opacity-80 transition"
                          onClick={() =>
                            openReturnBookPopup(book.book, book?.user?.email)
                          }
                          title="Xác nhận trả sách"
                        />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <h3 className="text-2xl mt-5 font-medium text-[#C41526]">
            Không có{" "}
            {filter === "borrowed" ? "sách đang mượn" : "sách quá hạn"}!
          </h3>
        )}
      </main>

      {returnBookPopup && (
        <ReturnBookPopup bookId={borrowedBookId} email={email} />
      )}
    </>
  );
};

export default Catalog;
