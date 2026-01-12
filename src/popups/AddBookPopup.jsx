import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addBook } from "../store/slices/bookSlice";
import { toggleAddBookPopup } from "../store/slices/popUpSlice";

const AddBookPopup = () => {
  const dispatch = useDispatch();

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [description, setDescription] = useState("");

  const handleAddBook = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("author", author);
    formData.append("price", price);
    formData.append("quantity", quantity);
    formData.append("description", description);

    dispatch(addBook(formData));
  };

  return (
    <div className="fixed inset-0 bg-black/50 p-5 flex items-center justify-center z-50">
      <div className="w-full bg-white rounded-lg shadow-lg md:w-1/3 border-t-4 border-[#C41526]">
        <div className="p-6">
          <h3 className="text-xl font-bold mb-4 text-[#C41526]">
            Thêm sách mới
          </h3>

          <form onSubmit={handleAddBook}>
            <div className="mb-4">
              <label className="block text-gray-900 font-medium">
                Tên sách
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Nhập tên sách"
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:border-[#C41526] focus:ring-2 focus:ring-[#C41526]"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-900 font-medium">
                Tác giả
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Nhập tên tác giả"
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:border-[#C41526] focus:ring-2 focus:ring-[#C41526]"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-900 font-medium">
                Giá mượn (phí mượn sách)
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Nhập giá mượn"
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:border-[#C41526] focus:ring-2 focus:ring-[#C41526]"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-900 font-medium">
                Số lượng
              </label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Nhập số lượng"
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:border-[#C41526] focus:ring-2 focus:ring-[#C41526]"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-900 font-medium">
                Mô tả
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Nhập mô tả sách"
                rows={4}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:border-[#C41526] focus:ring-2 focus:ring-[#C41526]"
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition"
                onClick={() => dispatch(toggleAddBookPopup())}
              >
                Đóng
              </button>

              <button
                type="submit"
                className="px-4 py-2 bg-[#C41526] text-white rounded-md hover:bg-[#A81220] transition"
              >
                Thêm
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddBookPopup;
