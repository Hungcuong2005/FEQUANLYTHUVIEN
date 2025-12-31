import React, { useEffect, useState } from "react";
import logo from "../assets/logo.png";
import logo_with_title from "../assets/logo.png";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate } from "react-router-dom";
import { login, resetAuthSlice } from "../store/slices/authSlice";
import { toast } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();

  const { loading, error, message, user, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const handleLogin = (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("email", email);
    data.append("password", password);

    dispatch(login(data));
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(resetAuthSlice());
    }
  }, [dispatch, isAuthenticated, error, loading]);

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <>
      <div className="flex flex-col justify-center md:flex-row h-screen">
        {/* LEFT SIDE */}
        <div className="w-full md:w-1/2 flex items-center justify-center bg-white p-8 relative">
          <div className="max-w-sm w-full">
            <div className="flex justify-center mb-12">
              <div className="rounded-full flex items-center justify-center">
                <img src={logo} alt="logo" className="h-24 w-auto" />
              </div>
            </div>

            <h1 className="text-4xl font-medium text-center mb-12 overflow-hidden text-[#C41526]">
              Chào mừng quay trở lại!
            </h1>

            <p className="text-gray-700 text-center mb-12">
              Vui lòng nhập thông tin để đăng nhập
            </p>

            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full px-4 py-3 border border-[#C41526] rounded-md focus:outline-none"
                />
              </div>

              <div className="mb-4">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mật khẩu"
                  className="w-full px-4 py-3 border border-[#C41526] rounded-md focus:outline-none"
                />
              </div>

              <Link
                to="/password/forgot"
                className="font-semibold text-[#C41526] mb-12 block"
              >
                Quên mật khẩu?
              </Link>

              <div className="block md:hidden font-semibold mt-5">
                <p>
                  Chưa có tài khoản?{" "}
                  <Link
                    to="/register"
                    className="text-sm text-gray-600 hover:underline"
                  >
                    Đăng ký
                  </Link>
                </p>
              </div>

              <button
                type="submit"
                className="border-2 mt-5 border-[#C41526] w-full font-semibold bg-[#C41526] text-white py-2 rounded-lg hover:bg-white hover:text-[#C41526] transition"
              >
                ĐĂNG NHẬP
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
              Bạn chưa có tài khoản?
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

export default Login;
