import axios from "axios";
import { useEffect, useState } from "react";

const MyRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:8080/api/rooms/my-rooms",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setRooms(response.data.data || []); // Nếu data không có, gán giá trị mặc định là mảng rỗng
        setLoading(false);
        console.log(response.data);
      } catch (error) {
        setError("Lỗi khi tải danh sách phòng");
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>My Rooms</h1>
      <ul>
        {rooms.length > 0 ? (
          rooms.map((room) => (
            <li key={room.id}>
              <h3>{room.roomName}</h3>
              <p>ID: {room.roomId}</p>
              <p>Creator: {room.userEmail}</p>
              <p>Members: {room.members.join(", ")}</p>
            </li>
          ))
        ) : (
          <p>No rooms found.</p>
        )}
      </ul>
    </div>
  );
};

export default MyRooms;
