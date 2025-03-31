import axios from "axios";
import { UserPlus } from "lucide-react"; // Import icon từ lucide-react
import React, { useState } from "react";
import { toast } from "react-hot-toast"; // Import react-hot-toast

const AddUserPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleAddUser = async () => {
    if (!name.trim() || !email.trim()) {
      toast.error("⚠️ Vui lòng nhập đầy đủ tên và email.");
      return;
    }

    try {
      const newUser = { name, email };
      await axios.post("http://localhost:8080/api/users", newUser);
      toast.success("🎉 Người dùng đã được thêm thành công!");
      setName("");
      setEmail("");
    } catch (error) {
      console.error("Lỗi khi thêm người dùng:", error);
      toast.error("❌ Không thể thêm người dùng. Vui lòng thử lại.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md">
        {/* Tiêu đề */}
        <h1 className="text-2xl font-bold text-gray-700 mb-4 flex items-center gap-2">
          <UserPlus className="w-6 h-6 text-blue-600" />
          Thêm Người Dùng
        </h1>

        {/* Input: Nhập tên */}
        <input
          type="text"
          placeholder="Tên người dùng"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Input: Nhập email */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded-lg mt-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Button: Thêm người dùng */}
        <button
          onClick={handleAddUser}
          className="w-full bg-blue-600 text-white font-bold p-2 rounded-lg mt-4 hover:bg-blue-700 transition duration-300"
        >
          + Thêm Người Dùng
        </button>
      </div>
    </div>
  );
};

export default AddUserPage;
