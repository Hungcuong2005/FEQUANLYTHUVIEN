import React, { useEffect, useState } from "react";
import logo from "../assets/logo.png";
import logo_with_title from "../assets/logo.png";
import { Link, Navigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { otpVerification, resetAuthSlice } from "../store/slices/authSlice";
import { toast } from "react-toastify";

const OTP = () => {
  const { email } = useParams();
  const [otp, setOtp] = useState("");
  const dispatch = useDispatch();

  const { loading, error, message, user, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const handleOtpVerification = (e) => {
    e.preventDefault();
    dispatch(otpVerification(email, otp));
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(resetAuthSlice());
    }
  }, [dispatch, error]);

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <>
      <div className="flex flex-col justify-center md:flex-row h-screen">
        {/* LEFT SIDE */}
        <div className="w-full md:w-1/2 flex items-center justify-center bg-white p-8 relative">
          <Link
            to="/register"
            className="border-2 border-[#C41526] text-[#C41526] rounded-3xl font-bold w-52 py-2 px-4 fixed top-10 -left-28 hover:bg-[#C41526] hover:text-white transition duration-300 text-end"
          >
            Quay lại
          </Link>

          <div className="max-w-sm w-full">
            <div className="flex justify-center mb-12">
              <div className="rounded-full flex items-center justify-center">
                <img src={logo} alt="logo" className="h-24 w-auto" />
              </div>
            </div>

            <h1 className="text-4xl font-medium text-center mb-12 text-[#C41526] overflow-hidden">
              Kiểm tra hộp thư
            </h1>

            <p className="text-gray-700 text-center mb-12">
              Vui lòng nhập mã OTP để tiếp tục
            </p>

            <form onSubmit={handleOtpVerification}>
              <div className="mb-4">
                <input
                  type="number"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Mã OTP"
                  className="w-full px-4 py-3 border border-[#C41526] rounded-md focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="border-2 mt-5 border-[#C41526] w-full font-semibold bg-[#C41526] text-white py-2 rounded-lg hover:bg-white hover:text-[#C41526] transition"
              >
                XÁC NHẬN
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="hidden w-full md:w-1/2 bg-[#C41526] text-white md:flex flex-col items-center justify-center p-8 rounded-tl-[80px] rounded-bl-[80px]">
          <div className="text-center h-[400px]">
            <div className="flex justify-center mb-12">
              <img
                src={logo_with_title}
                alt="logo"
                className="mb-12 h-44 w-auto"
              />
            </div>

            <p className="text-gray-200 mb-12">
              Chưa có tài khoản?
              <br />
              Đăng ký ngay để bắt đầu!
            </p>

            <Link
              to="/register"
              className="border-2 mt-5 border-white px-8 w-full font-semibold bg-[#C41526] text-white py-2 rounded-lg hover:bg-white hover:text-[#C41526] transition"
            >
              ĐĂNG KÝ
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default OTP;
