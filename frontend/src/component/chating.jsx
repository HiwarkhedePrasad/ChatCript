import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("https://chatcript.onrender.com");

const RoomPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState("");
  const [username, setUsername] = useState("");
  const [roomName, setRoomName] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [inRoom, setInRoom] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on("room_error", (message) => {
      setErrorMessage(message);
    });

    socket.on("room_success", (data) => {
      console.log("Room created/joined successfully", data);
      setInRoom(true);
    });

    socket.on("receive_message", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      socket.off("room_error");
      socket.off("room_success");
      socket.off("receive_message");
    };
  }, []);

  const handleButtonClick = (type) => {
    setFormType(type);
    setShowForm(true);
  };

  const handleSubmit = () => {
    setErrorMessage("");
    if (formType === "create") {
      socket.emit("createRoom", { username, roomName, password });
    } else if (formType === "join") {
      socket.emit("join_room", { formType, username, roomName, password });
    }
  };

  const sendMessage = () => {
    if (message.trim()) {
      const messageData = { roomName, username, message };
      socket.emit("send_message", messageData);
      setMessages((prev) => [...prev, messageData]);
      setMessage("");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      {!inRoom ? (
        !showForm ? (
          <div className="space-x-4">
            <button
              onClick={() => handleButtonClick("create")}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md"
            >
              Create Room
            </button>
            <button
              onClick={() => handleButtonClick("join")}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md"
            >
              Join Room
            </button>
          </div>
        ) : (
          <div className="w-80 p-4 bg-gray-800 rounded-md shadow-lg">
            <h2 className="text-xl mb-4">
              {formType === "create" ? "Create Room" : "Join Room"}
            </h2>
            <input
              type="text"
              placeholder="Username"
              className="w-full mb-2 p-2 rounded bg-gray-700 text-white"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="text"
              placeholder="Room Name"
              className="w-full mb-2 p-2 rounded bg-gray-700 text-white"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full mb-4 p-2 rounded bg-gray-700 text-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errorMessage && (
              <p className="text-red-500 mb-2">{errorMessage}</p>
            )}
            <button
              onClick={handleSubmit}
              className="w-full py-2 bg-purple-600 hover:bg-purple-700 rounded-md"
            >
              Submit
            </button>
          </div>
        )
      ) : (
        <div className="w-full max-w-md p-4 bg-gray-800 rounded-md shadow-lg">
          <h2 className="text-xl mb-4">Room: {roomName}</h2>
          <div className="mb-4 h-64 overflow-y-auto bg-gray-700 p-2 rounded-md">
            {messages.map((msg, index) => (
              <div key={index} className="mb-2">
                <span className="text-green-400">{msg.username}: </span>
                <span>{msg.message}</span>
              </div>
            ))}
          </div>
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Type a message..."
              className="flex-grow p-2 rounded bg-gray-700 text-white"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button
              onClick={sendMessage}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomPage;
