import React, { useMemo, useState } from "react";

const PaymentMethodPopup = ({
  amount = 0,
  defaultMethod = "cash",
  onClose,
  onConfirm,
}) => {
  const [method, setMethod] = useState(defaultMethod);

  const moneyVND = useMemo(() => {
    if (typeof amount === "number") return `${amount.toLocaleString("vi-VN")}₫`;
    if (amount === null || amount === undefined) return "—";
    return `${amount}₫`;
  }, [amount]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (typeof onConfirm === "function") onConfirm(method);
  };

  return (
    <div className="fixed inset-0 bg-black/50 p-5 flex items-center justify-center z-50">
      <div className="w-full bg-white rounded-xl shadow-xl md:w-1/3 overflow-hidden border-t-4 border-[#C41526]">
        <div className="p-6">
          <h3 className="text-xl font-bold mb-2 text-[#C41526]">
            Chọn phương thức thanh toán
          </h3>

          <p className="text-sm text-gray-600 mb-4">
            Số tiền cần thanh toán:{" "}
            <span className="font-semibold text-gray-900">{moneyVND}</span>
          </p>

          <form onSubmit={handleSubmit}>
            <div className="space-y-3 mb-6">
              <label className="flex items-center gap-3 p-3 rounded-lg border-2 border-gray-200 hover:border-[#C41526] hover:bg-[#FDE8EA] transition cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  value="cash"
                  checked={method === "cash"}
                  onChange={() => setMethod("cash")}
                  className="accent-[#C41526]"
                />
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">Tiền mặt</p>
                  <p className="text-sm text-gray-600">
                    Thanh toán trực tiếp tại quầy.
                  </p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-lg border-2 border-gray-200 hover:border-[#C41526] hover:bg-[#FDE8EA] transition cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  value="zalopay"
                  checked={method === "zalopay"}
                  onChange={() => setMethod("zalopay")}
                  className="accent-[#C41526]"
                />
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">ZaloPay</p>
                  <p className="text-sm text-gray-600">
                    Quét QR hoặc chuyển khoản qua ZaloPay.
                  </p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-lg border-2 border-gray-200 hover:border-[#C41526] hover:bg-[#FDE8EA] transition cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  value="vnpay"
                  checked={method === "vnpay"}
                  onChange={() => setMethod("vnpay")}
                  className="accent-[#C41526]"
                />
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">VNPAY</p>
                  <p className="text-sm text-gray-600">
                    Thanh toán qua cổng VNPAY.
                  </p>
                </div>
              </label>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition"
                onClick={onClose}
              >
                Đóng
              </button>

              <button
                type="submit"
                className="px-4 py-2 bg-[#C41526] text-white rounded-md hover:bg-[#A81220] transition"
              >
                Xác nhận thanh toán
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodPopup;
