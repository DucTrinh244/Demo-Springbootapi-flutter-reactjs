// api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api", // Thay thế URL này với API thực tế của bạn
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`, // Lấy token từ localStorage
  },
});

export default api;
