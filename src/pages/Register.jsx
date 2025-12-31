import React, { useEffect, useState } from "react";
import logo from "../assets/logo.png";
import logo_with_title from "../assets/logo.png";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { register, resetAuthSlice } from "../store/slices/authSlice";
import { toast } from "react-toastify";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigateTo = useNavigate();

  const { loading, error, message, user, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const handleRegister = (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", name);
    data.append("email", email);
    data.append("password", password);

    dispatch(register(data));
  };

  useEffect(() => {
    if (message) {
      toast.success(message);
      dispatch(resetAuthSlice());
      navigateTo(`/otp-verification/${email}`);
    }

    if (error) {
      toast.error(error);
      dispatch(resetAuthSlice());
    }
  }, [dispatch, error, message, email, navigateTo]);

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <>
      <div className="flex flex-col justify-center md:flex-row h-screen">
        {/* LEFT SIDE */}
        <div className="hidden w-full md:w-1/2 bg-[#C41526] text-white md:flex flex-col items-center justify-center p-8 rounded-tr-[80px] rounded-br-[80px]">
          <div className="text-center h-[376px]">
            <div className="flex justify-center mb-12">
              <img
                src={logo_with_title}
                alt="logo"
                className="mb-12 h-44 w-auto"
              />
            </div>

            <p className="text-gray-200 mb-12">
              Đã có tài khoản?
              <br />
              Đăng nhập ngay!
            </p>

            <Link
              to="/login"
              className="border-2 rounded-lg font-semibold border-white py-2 px-8 hover:bg-white hover:text-[#C41526] transition"
            >
              ĐĂNG NHẬP
            </Link>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="w-full md:w-1/2 flex items-center justify-center bg-white p-8">
          <div className="w-full max-w-sm">
            <div className="flex justify-center mb-12">
              <div className="flex flex-col-reverse sm:flex-row items-center justify-center gap-5">
                <h3 className="font-medium text-4xl overflow-hidden text-[#C41526]">
                  Đăng ký
                </h3>
                <img
                  src={logo}
                  alt="logo"
                  className="h-auto w-24 object-cover"
                />
              </div>
            </div>

            <p className="text-gray-700 text-center mb-12">
              Vui lòng nhập thông tin để tạo tài khoản
            </p>

            <form onSubmit={handleRegister}>
              <div className="mb-2">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Họ và tên"
                  className="w-full px-4 py-3 border border-[#C41526] rounded-md focus:outline-none"
                />
              </div>

              <div className="mb-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full px-4 py-3 border border-[#C41526] rounded-md focus:outline-none"
                />
              </div>

              <div className="mb-2">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mật khẩu"
                  className="w-full px-4 py-3 border border-[#C41526] rounded-md focus:outline-none"
                />
              </div>

              <div className="block md:hidden font-semibold mt-5">
                <p>
                  Đã có tài khoản?{" "}
                  <Link
                    to="/login"
                    className="text-sm text-gray-600 hover:underline"
                  >
                    Đăng nhập
                  </Link>
                </p>
              </div>

              <button
                type="submit"
                className="border-2 mt-5 border-[#C41526] w-full font-semibold bg-[#C41526] text-white py-2 rounded-lg hover:bg-white hover:text-[#C41526] transition"
              >
                ĐĂNG KÝ
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
