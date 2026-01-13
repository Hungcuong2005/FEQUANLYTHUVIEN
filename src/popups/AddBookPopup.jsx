import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addBook } from "../store/slices/bookSlice";
import { toggleAddBookPopup } from "../store/slices/popUpSlice";
import { toast } from "react-toastify";

const AddBookPopup = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.book);

  const apiBaseUrl =
    import.meta?.env?.VITE_API_BASE_URL || "http://localhost:4000";

  const [isbn, setIsbn] = useState("");
  const [isbnStatus, setIsbnStatus] = useState("idle"); // idle | checking | exists | new

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [description, setDescription] = useState("");


  // ✅ Toggle bật/tắt chỉnh sửa khi ISBN đã tồn tại
  const [allowEdit, setAllowEdit] = useState(false);

  const lastCheckedIsbnRef = useRef("");

  const normalizeIsbn = (v) =>
    String(v || "")
      .trim()
      .replace(/[-\s]/g, "")
      .toUpperCase();

  const inputClass =
    "w-full px-4 py-2 border-2 border-gray-300 rounded-md " +
    "focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200";

  const disabledInputClass =
    "w-full px-4 py-2 border-2 border-gray-200 rounded-md bg-gray-100 cursor-not-allowed";

  const checkIsbn = async ({ force = false } = {}) => {
    const normalized = normalizeIsbn(isbn);

    if (!normalized) {
      setIsbnStatus("idle");
      setAllowEdit(false);
      return "idle";
    }

    if (!force && lastCheckedIsbnRef.current === normalized) return isbnStatus;

    setIsbnStatus("checking");
    lastCheckedIsbnRef.current = normalized;

    try {
      const { data } = await axios.get(
        `${apiBaseUrl}/api/v1/book/isbn/${normalized}`,
        { withCredentials: true }
      );

      if (data?.exists && data?.book) {
        setIsbnStatus("exists");

        // ✅ Đổ thông tin đầu sách từ DB
        setTitle(data.book.title || "");
        setAuthor(data.book.author || "");
        setDescription(String(data.book.description || ""));
        if (typeof data.book.price === "number") setPrice(String(data.book.price));
        

        // ✅ Mặc định: KHÓA chỉnh sửa, người dùng có thể bấm bật
        setAllowEdit(false);

        return "exists";
      }

      setIsbnStatus("new");
      setAllowEdit(true); // ISBN mới → cho nhập
      return "new";
    } catch (err) {
      setIsbnStatus("idle");
      setAllowEdit(true);
      toast.error(err?.response?.data?.message || "Không kiểm tra được ISBN.");
      return "idle";
    }
  };

  useEffect(() => {
    const t = setTimeout(() => {
      const normalized = normalizeIsbn(isbn);
      if (!normalized) return;
      checkIsbn();
    }, 450);

    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isbn]);

  // ✅ Có thể sửa metadata nếu:
  // - ISBN mới (new) hoặc chưa nhập ISBN (idle)  → sửa được
  // - ISBN đã tồn tại (exists) nhưng người dùng bật allowEdit
  const canEditMeta = isbnStatus !== "exists" || allowEdit;

  const handleAddBook = async (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (loading) return;

    const normalized = normalizeIsbn(isbn);
    let statusToUse = isbnStatus;

    if (normalized) {
      if (isbnStatus === "checking") {
        toast.info("Đang kiểm tra ISBN, vui lòng đợi...");
        return;
      }
      if (isbnStatus === "idle") {
        statusToUse = await checkIsbn({ force: true });
      }
    }

    const q = Math.max(parseInt(quantity, 10) || 1, 1);

    // ✅ Nếu ISBN đã tồn tại và KHÔNG bật chỉnh sửa → chỉ cần số bản sao
    if (statusToUse === "exists" && !allowEdit) {
      const payload = {
        isbn: normalized || "",
        quantity: q,
      };
      dispatch(addBook(payload));
      return;
    }

    // ✅ Nếu ISBN mới hoặc có bật chỉnh sửa → validate đủ thông tin
    const trimmedTitle = title.trim();
    const trimmedAuthor = author.trim();

    if (!trimmedTitle || !trimmedAuthor) {
      toast.error("Vui lòng nhập Tên sách và Tác giả.");
      return;
    }

    const priceValue = Number(price);
    if (Number.isNaN(priceValue) || priceValue < 0) {
      toast.error("Giá mượn không hợp lệ.");
      return;
    }

    const payload = {
      isbn: normalized || "",
      title: trimmedTitle,
      author: trimmedAuthor,
      price: priceValue,
      quantity: q,
      description,
    };

    dispatch(addBook(payload));
  };

  return (
    <div className="fixed inset-0 bg-black/50 p-5 flex items-center justify-center z-50">
      <div className="w-full bg-white rounded-lg shadow-lg md:w-1/2 lg:w-1/3 border-t-4 border-[#C41526]">
        <div className="p-6">
          <h3 className="text-xl font-bold mb-4 text-[#C41526]">
            Thêm sách / Thêm bản sao
          </h3>

          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="text-sm">
              {isbnStatus === "checking" && (
                <span className="inline-flex items-center px-3 py-1 rounded-md bg-gray-100 text-gray-700">
                  Đang kiểm tra ISBN...
                </span>
              )}

              {isbnStatus === "exists" && (
                <span className="inline-flex items-center px-3 py-1 rounded-md bg-[#E9FBEF] text-[#0F7A2A] font-semibold">
                  ISBN đã tồn tại → mặc định chỉ thêm bản sao
                </span>
              )}

              {isbnStatus === "new" && (
                <span className="inline-flex items-center px-3 py-1 rounded-md bg-[#FDE8EA] text-[#C41526] font-semibold">
                  ISBN chưa có → tạo đầu sách + thêm bản sao
                </span>
              )}
            </div>

            {/* ✅ Nút bật/tắt chỉnh sửa khi ISBN đã tồn tại */}
            {isbnStatus === "exists" ? (
              <button
                type="button"
                onClick={() => setAllowEdit((prev) => !prev)}
                className="px-3 py-1 rounded-md border border-gray-400 text-gray-700 font-semibold hover:bg-gray-100 transition"
                disabled={loading}
                title="Bật để sửa thông tin đầu sách, tắt để chỉ thêm bản sao"
              >
                {allowEdit ? "Tắt chỉnh sửa" : "Bật chỉnh sửa"}
              </button>
            ) : null}
          </div>

          {/* ✅ CHỈ DÙNG onSubmit để tránh gọi 2 lần */}
          <form onSubmit={handleAddBook}>
            <div className="mb-4">
              <label className="block text-gray-900 font-medium">ISBN (khuyến nghị)</label>
              <input
                type="text"
                value={isbn}
                onChange={(e) => {
                  setIsbn(e.target.value);
                  setIsbnStatus("idle");
                  lastCheckedIsbnRef.current = "";
                  setAllowEdit(false);
                }}
                onBlur={checkIsbn}
                placeholder="Ví dụ: 9786041234567"
                className={inputClass}
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-900 font-medium">Tên sách</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Nhập tên sách"
                disabled={!canEditMeta}
                className={canEditMeta ? inputClass : disabledInputClass}
                required={isbnStatus === "new" || allowEdit || !isbn}
              />
              {isbnStatus === "exists" && !allowEdit && (
                <p className="mt-1 text-xs text-gray-500">
                  Đang khóa (bấm “Bật chỉnh sửa” nếu muốn sửa).
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-gray-900 font-medium">Tác giả</label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Nhập tên tác giả"
                disabled={!canEditMeta}
                className={canEditMeta ? inputClass : disabledInputClass}
                required={isbnStatus === "new" || allowEdit || !isbn}
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-900 font-medium">Giá mượn (phí mượn sách)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Nhập giá mượn"
                disabled={!canEditMeta}
                className={canEditMeta ? inputClass : disabledInputClass}
                required={isbnStatus === "new" || allowEdit}
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-900 font-medium">
                Số bản sao muốn thêm
              </label>
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className={inputClass}
                required
              />
              <p className="mt-1 text-xs text-gray-500">
                Mã cuốn sẽ tự sinh và tăng dần theo số lượng bạn nhập.
              </p>
            </div>

      

            <div className="mb-4">
              <label className="block text-gray-900 font-medium">Mô tả</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={canEditMeta ? inputClass : disabledInputClass}
                rows={3}
                disabled={!canEditMeta}
                required={isbnStatus === "new" || allowEdit}
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition"
                onClick={() => dispatch(toggleAddBookPopup())}
                disabled={loading}
              >
                Đóng
              </button>

              {/* ✅ ĐỔI THÀNH submit, bỏ onClick để không chạy 2 lần */}
              <button
                type="submit"
                disabled={loading}
                className={`px-4 py-2 rounded-md transition text-white ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#C41526] hover:bg-[#A81220]"
                }`}
              >
                {loading ? "Đang thêm..." : "Thêm"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddBookPopup;
