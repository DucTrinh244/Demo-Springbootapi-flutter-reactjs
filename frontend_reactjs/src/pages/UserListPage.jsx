import axios from "axios";
import { User } from "lucide-react"; // Import icon từ lucide-react
import React, { useEffect, useState } from "react";

const UserListPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("❌ Không thể tải danh sách người dùng.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">📜 Danh Sách Người Dùng</h1>

      {/* Hiển thị lỗi nếu có */}
      {error && <p className="text-red-500 font-medium">{error}</p>}

      {/* Hiển thị hiệu ứng loading */}
      {loading && <p className="text-blue-600">⏳ Đang tải dữ liệu...</p>}

      {/* Nếu danh sách rỗng */}
      {!loading && users.length === 0 && (
        <p className="text-gray-500 italic">🚀 Chưa có người dùng nào!</p>
      )}

      {/* Danh sách người dùng */}
      <div className="w-full max-w-2xl">
        {users.map((user) => (
          <div
            key={user.id}
            className="bg-white shadow-md rounded-lg p-4 mb-3 flex items-center gap-4 hover:bg-gray-50 transition"
          >
            <User className="text-blue-600 w-6 h-6" />
            <div>
              <p className="text-lg font-semibold">{user.name}</p>
              <p className="text-gray-500">{user.email}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserListPage;
