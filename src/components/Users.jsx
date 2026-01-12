import React from "react";
import { useSelector } from "react-redux";
import Header from "../layout/Header";

const Users = () => {
  const { users } = useSelector((state) => state.user);

  const formatDate = (timeStamp) => {
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

  const userList = users?.filter((u) => u.role === "User") || [];

  return (
    <>
      <main className="relative flex-1 p-6 pt-28">
        <Header />

        {/* Sub Header */}
        <header className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center">
          <h2 className="text-xl font-medium md:text-2xl md:font-semibold text-[#C41526]">
            Danh sách người dùng đã đăng ký
          </h2>
        </header>

        {/* Table */}
        {userList.length > 0 ? (
          <div className="mt-6 overflow-auto bg-white rounded-md shadow-lg border-t-4 border-[#C41526]">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-[#FDE8EA]">
                  <th className="px-4 py-3 text-left text-base font-bold text-[#C41526]">
                    STT
                  </th>
                  <th className="px-4 py-3 text-left text-base font-bold text-[#C41526]">
                    Họ tên
                  </th>
                  <th className="px-4 py-3 text-left text-base font-bold text-[#C41526]">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-base font-bold text-[#C41526]">
                    Vai trò
                  </th>
                  <th className="px-4 py-3 text-center text-base font-bold text-[#C41526]">
                    Số sách đã mượn
                  </th>
                  <th className="px-4 py-3 text-center text-base font-bold text-[#C41526]">
                    Ngày đăng ký
                  </th>
                </tr>
              </thead>


              <tbody>
                {userList.map((user, index) => (
                  <tr
                    key={user._id}
                    className={(index + 1) % 2 === 0 ? "bg-gray-50" : ""}
                  >
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">{user.name}</td>
                    <td className="px-4 py-2">{user.email}</td>
                    <td className="px-4 py-2">
                      {user.role === "User" ? "Người dùng" : user.role}
                    </td>
                    <td className="px-4 py-2 text-center">
                      {user?.borrowedBooks?.length || 0}
                    </td>
                    <td className="px-4 py-2 text-center">
                      {formatDate(user.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <h3 className="text-2xl mt-5 font-medium text-[#C41526]">
            Không có người dùng nào đã đăng ký trong thư viện.
          </h3>
        )}
      </main>
    </>
  );
};

export default Users;
