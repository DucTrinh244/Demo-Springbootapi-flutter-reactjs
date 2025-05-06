import { Client } from "@stomp/stompjs";
import { motion } from "framer-motion";
import { MessageSquare, PlusCircle, Search, Send, Users } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import SockJS from "sockjs-client";
import Header from "../../components/common/Header";
import api from "../../configs/ApiConfig";

// Fix for "global is not defined" error with SockJS
if (typeof window !== "undefined") {
  window.global = window;
}

const ChatGroup = ({ room, isActive, onClick, currentUserEmail }) => {
  const lastMessage =
    room.messages && room.messages.length > 0
      ? room.messages[room.messages.length - 1]
      : null;

  return (
    <div
      className={`p-4 border-b border-gray-700 hover:bg-gray-800 cursor-pointer flex items-center ${
        isActive ? "bg-gray-800 border-l-4 border-l-blue-500" : ""
      }`}
      onClick={onClick}
    >
      <div className="h-10 w-10 rounded-full bg-blue-900 flex items-center justify-center mr-3">
        <MessageSquare size={20} className="text-blue-400" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <h3 className="font-medium truncate text-gray-200">
            {room.roomName}
          </h3>
          {lastMessage && (
            <span className="text-xs text-gray-400">
              {new Date(lastMessage.timeStamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          )}
        </div>
        <div className="flex justify-between items-center">
          {lastMessage ? (
            <p className="text-sm text-gray-400 truncate">
              {lastMessage.sender === currentUserEmail
                ? "You: "
                : `${lastMessage.sender.split("@")[0]}: `}
              {lastMessage.content}
            </p>
          ) : (
            <p className="text-sm text-gray-400 truncate">No messages yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

const Message = ({ message, currentUserEmail }) => {
  const isMine = message.sender === currentUserEmail;

  const formattedTime = new Date(message.timeStamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const senderName = message.sender.split("@")[0];

  return (
    <div className={`mb-4 flex ${isMine ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-3/4 rounded-lg px-4 py-2 ${
          isMine ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-200"
        }`}
      >
        {!isMine && (
          <p className="font-medium text-xs text-gray-300">{senderName}</p>
        )}
        <p className="text-sm">{message.content}</p>
        <p
          className={`text-xs mt-1 text-right ${
            isMine ? "text-blue-200" : "text-gray-400"
          }`}
        >
          {formattedTime}
        </p>
      </div>
    </div>
  );
};

const ChatPage = () => {
  // State management
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [currentUserEmail, setCurrentUserEmail] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const messageEndRef = useRef(null);
  const stompClientRef = useRef(null);

  // Get current user information
  useEffect(() => {
    const userEmail = localStorage.getItem("email");
    if (userEmail) {
      setCurrentUserEmail(userEmail);
    }
  }, []);

  // Fetch chat rooms when component mounts
  useEffect(() => {
    fetchRooms();

    // Disconnect WebSocket when component unmounts
    return () => {
      disconnectWebSocket();
    };
  }, []);

  // Handle WebSocket connection when room selection changes
  useEffect(() => {
    if (selectedRoom) {
      // Disconnect previous connection if exists
      disconnectWebSocket();
      // Connect to the new room
      connectWebSocket();
    }
  }, [selectedRoom]);

  // Scroll to latest message
  useEffect(() => {
    scrollToBottom();
  }, [selectedRoom, rooms]);

  const scrollToBottom = () => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const disconnectWebSocket = () => {
    if (stompClientRef.current) {
      try {
        if (stompClientRef.current.connected) {
          console.log("Disconnecting from WebSocket");
          stompClientRef.current.deactivate();
        }
      } catch (err) {
        console.error("Error disconnecting WebSocket:", err);
      } finally {
        stompClientRef.current = null;
        setIsConnected(false);
        setIsConnecting(false);
      }
    }
  };

  const connectWebSocket = () => {
    if (!selectedRoom || !selectedRoom.roomId) {
      console.error("No room selected or invalid room ID");
      return;
    }

    if (isConnecting) {
      console.log("Connection attempt already in progress");
      return;
    }

    try {
      setIsConnecting(true);

      // Create SockJS instance
      const socket = new SockJS("http://localhost:8080/chat");

      // Create STOMP client with SockJS
      const client = new Client({
        webSocketFactory: () => socket,
        connectHeaders: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        debug: (str) => {
          console.log("STOMP Debug: " + str);
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
      });

      // Handle successful connection
      client.onConnect = () => {
        console.log(
          `Connected to chat server for room: ${selectedRoom.roomId}`
        );
        setIsConnected(true);
        setIsConnecting(false);
        setError(null);

        // Subscribe to room topic
        client.subscribe(
          `/topic/room/${selectedRoom.roomId}`,
          (message) => {
            try {
              const receivedMessage = JSON.parse(message.body);
              console.log("Received message:", receivedMessage);

              // Update room messages
              updateRoomMessages(selectedRoom.id, receivedMessage);
            } catch (err) {
              console.error("Error processing received message:", err);
            }
          },
          {
            id: `room-subscription-${selectedRoom.roomId}`,
          }
        );
      };

      // Handle connection errors
      client.onStompError = (frame) => {
        console.error("STOMP error:", frame);
        setError(
          `Connection error: ${frame.headers?.message || "Unknown error"}`
        );
        setIsConnected(false);
        setIsConnecting(false);
      };

      client.onWebSocketError = (event) => {
        console.error("SockJS error:", event);
        setError("Connection error. Please try again.");
        setIsConnected(false);
        setIsConnecting(false);
      };

      client.onWebSocketClose = (event) => {
        console.log("SockJS connection closed:", event);
        setIsConnected(false);
        setIsConnecting(false);
      };

      // Activate the client
      client.activate();
      stompClientRef.current = client;
    } catch (err) {
      console.error("Error setting up connection:", err);
      setError("Failed to establish connection: " + err.message);
      setIsConnected(false);
      setIsConnecting(false);
    }
  };

  const updateRoomMessages = (roomId, newMessage) => {
    setRooms((prevRooms) => {
      return prevRooms.map((room) => {
        if (room.id === roomId) {
          return {
            ...room,
            messages: [...(room.messages || []), newMessage],
          };
        }
        return room;
      });
    });

    // Update selected room if it's currently selected
    setSelectedRoom((prevRoom) => {
      if (prevRoom && prevRoom.id === roomId) {
        return {
          ...prevRoom,
          messages: [...(prevRoom.messages || []), newMessage],
        };
      }
      return prevRoom;
    });

    // Scroll to bottom after a short delay
    setTimeout(scrollToBottom, 100);
  };

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await api.get("/rooms/my-rooms");

      const roomsData = response.data || [];
      setRooms(roomsData);

      // Select first room if available
      if (roomsData.length > 0) {
        setSelectedRoom(roomsData[0]);
      }

      setLoading(false);
    } catch (err) {
      setError("Could not load chat rooms");
      setLoading(false);
      console.error("Error fetching rooms:", err);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();

    // Validate input and connection
    if (newMessage.trim() === "") return;
    if (!selectedRoom || !selectedRoom.roomId) {
      setError("No chat room selected");
      return;
    }
    if (!stompClientRef.current || !isConnected) {
      setError("Not connected to chat server. Trying to reconnect...");
      connectWebSocket();
      return;
    }

    try {
      // Create message payload matching the backend MessageRequest structure
      const messagePayload = {
        roomId: selectedRoom.roomId,
        content: newMessage,
        sender: currentUserEmail,
      };

      console.log("Sending message:", messagePayload);

      // Send message via STOMP - note the destination matches the @MessageMapping in ChatController
      stompClientRef.current.publish({
        destination: `/app/sendMessage/${selectedRoom.roomId}`,
        body: JSON.stringify(messagePayload),
        headers: { "content-type": "application/json" },
      });

      // Clear input
      setNewMessage("");

      // Scroll to new message
      setTimeout(scrollToBottom, 100);
    } catch (err) {
      console.error("Error sending message:", err);
      setError("Failed to send message: " + err.message);
    }
  };

  const handleRoomSelect = (room) => {
    setSelectedRoom(room);
    setError(null); // Clear any previous errors
  };

  const getConnectionStatus = () => {
    if (isConnecting) return { text: "Connecting...", color: "bg-yellow-500" };
    if (isConnected) return { text: "Connected", color: "bg-green-500" };
    return { text: "Disconnected", color: "bg-red-500" };
  };

  const status = getConnectionStatus();
  const navigate = useNavigate();
  return (
    <div className="flex-1 overflow-hidden relative z-10 flex flex-col bg-gray-900">
      <Header title="Chat" />

      <div className="flex-1 flex overflow-hidden">
        {/* Chat Groups Sidebar */}
        <div className="w-full sm:w-1/3 lg:w-1/4 border-r border-gray-700 bg-gray-900 flex flex-col">
          <div className="p-4 border-b border-gray-700">
            <div className="relative">
              <Search
                className="absolute left-3 top-2.5 text-gray-500"
                size={18}
              />
              <input
                type="text"
                placeholder="Search chat rooms"
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-800 border-gray-700 border text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
          </div>

          <div className="px-4 py-3 border-b border-gray-700 flex justify-between items-center bg-gray-800">
            <div className="flex items-center">
              <Users size={16} className="text-blue-400 mr-2" />
              <h2 className="font-medium text-gray-200">Chat Rooms</h2>
            </div>
            <button
              className="text-blue-400 hover:text-blue-300"
              onClick={() => navigate("add-room")}
            >
              <PlusCircle size={20} />
            </button>
          </div>

          <div className="overflow-y-auto flex-1">
            {loading ? (
              <div className="p-4 text-center text-gray-400">
                Loading chat rooms...
              </div>
            ) : error && rooms.length === 0 ? (
              <div className="p-4 text-center text-red-400">{error}</div>
            ) : rooms.length === 0 ? (
              <div className="p-4 text-center text-gray-400">
                No chat rooms found
              </div>
            ) : (
              rooms.map((room) => (
                <ChatGroup
                  key={room.id}
                  room={room}
                  isActive={selectedRoom && selectedRoom.id === room.id}
                  onClick={() => handleRoomSelect(room)}
                  currentUserEmail={currentUserEmail}
                />
              ))
            )}
          </div>
        </div>

        {/* Chat Messages */}
        <div className="hidden sm:flex flex-col flex-1 bg-gray-900">
          {selectedRoom ? (
            <>
              <div className="px-6 py-4 border-b border-gray-700 flex items-center justify-between bg-gray-800">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-blue-900 flex items-center justify-center mr-3">
                    <MessageSquare size={20} className="text-blue-400" />
                  </div>
                  <div>
                    <h2 className="font-medium text-gray-200">
                      {selectedRoom.roomName}
                    </h2>
                    <p className="text-sm text-gray-400">
                      {selectedRoom.members?.length || 0} members
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span
                    className={`h-2 w-2 rounded-full mr-2 ${status.color}`}
                  ></span>
                  <span className="text-xs text-gray-400">{status.text}</span>
                  {!isConnected && !isConnecting && (
                    <button
                      onClick={connectWebSocket}
                      className="ml-3 text-xs bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded"
                    >
                      Reconnect
                    </button>
                  )}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 bg-gray-900">
                {error && (
                  <div className="mb-4 p-2 bg-red-900/50 border border-red-700 rounded text-red-200 text-sm">
                    {error}
                  </div>
                )}

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  {!selectedRoom.messages ||
                  selectedRoom.messages.length === 0 ? (
                    <div className="text-center text-gray-400 mt-10">
                      No messages yet. Start a conversation!
                    </div>
                  ) : (
                    selectedRoom.messages.map((message, index) => (
                      <Message
                        key={`${selectedRoom.id}-${index}-${message.timeStamp}`}
                        message={message}
                        currentUserEmail={currentUserEmail}
                      />
                    ))
                  )}
                  <div ref={messageEndRef} />
                </motion.div>
              </div>

              <div className="p-4 border-t border-gray-700 bg-gray-800">
                <form
                  onSubmit={handleSendMessage}
                  className="flex items-center"
                >
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 rounded-lg bg-gray-700 border-gray-600 border text-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-2 text-sm"
                    disabled={!isConnected}
                  />
                  <button
                    type="submit"
                    className={`ml-2 p-2 rounded-lg transition ${
                      isConnected
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "bg-gray-600 text-gray-400 cursor-not-allowed"
                    }`}
                    disabled={!isConnected}
                  >
                    <Send size={20} />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center flex-col text-gray-400">
              <MessageSquare size={48} className="text-blue-500" />
              <p className="mt-2">Select a chat room to start</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
