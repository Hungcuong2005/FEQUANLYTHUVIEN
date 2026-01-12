import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { recordBorrowBook } from "../store/slices/borrowSlice";
import { toggleRecordBookPopup } from "../store/slices/popUpSlice";

const RecordBookPopup = ({ bookId }) => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");

  const handleRecordBook = (e) => {
    e.preventDefault();
    dispatch(recordBorrowBook(email, bookId));
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 p-5 flex items-center justify-center z-50">
        <div className="w-full bg-white rounded-xl shadow-xl md:w-1/3 overflow-hidden border-t-4 border-[#C41526]">
          <div className="p-6">
            <h3 className="text-xl font-bold mb-4 text-[#C41526]">
              Ghi nhận mượn sách
            </h3>

            <form onSubmit={handleRecordBook}>
              <div className="mb-4">
                <label className="block text-gray-900 font-medium">
                  Email người mượn
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Nhập email người mượn"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C41526] focus:border-[#C41526]"
                  required
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition"
                  onClick={() => dispatch(toggleRecordBookPopup())}
                >
                  Đóng
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-[#C41526] text-white rounded-md hover:bg-[#A81220] transition"
                >
                  Ghi nhận
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default RecordBookPopup;
