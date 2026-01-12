import React from "react";
import { useDispatch } from "react-redux";
import { returnBook } from "../store/slices/borrowSlice";
import { toggleReturnBookPopup } from "../store/slices/popUpSlice";

const ReturnBookPopup = ({ bookId, email }) => {
  const dispatch = useDispatch();

  const handleReturnBook = (e) => {
    e.preventDefault();
    dispatch(returnBook(email, bookId));
    dispatch(toggleReturnBookPopup());
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 p-5 flex items-center justify-center z-50">
        <div className="w-full bg-white rounded-xl shadow-xl md:w-1/3 overflow-hidden border-t-4 border-[#C41526]">
          <div className="p-6">
            <h3 className="text-xl font-bold mb-4 text-[#C41526]">
              Xác nhận trả sách
            </h3>

            <form onSubmit={handleReturnBook}>
              <div className="mb-4">
                <label className="block text-gray-900 font-medium">
                  Email người mượn
                </label>
                <input
                  type="email"
                  defaultValue={email}
                  placeholder="Email người mượn"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-md bg-gray-100 text-gray-700"
                  required
                  disabled
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition"
                  onClick={() => dispatch(toggleReturnBookPopup())}
                >
                  Đóng
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-[#C41526] text-white rounded-md hover:bg-[#A81220] transition"
                >
                  Trả sách
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReturnBookPopup;
