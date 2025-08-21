import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

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
      setMessage("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      if (inRoom) {
        sendMessage();
      } else if (showForm) {
        handleSubmit();
      }
    }
  };

  return (
    <div className="min-h-screen bg-white text-black font-serif">
      {!inRoom ? (
        <div className="flex flex-col items-center justify-center min-h-screen p-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 text-black">Chat Rooms</h1>
            <p className="text-gray-600 text-lg">
              Connect with others in secure private rooms
            </p>
          </div>

          {!showForm ? (
            <div className="flex flex-col space-y-6 w-full max-w-md">
              <button
                onClick={() => handleButtonClick("create")}
                className="w-full py-4 px-8 bg-black text-white text-lg font-semibold border-2 border-black hover:bg-white hover:text-black transition-all duration-200 tracking-wide"
              >
                CREATE NEW ROOM
              </button>
              <button
                onClick={() => handleButtonClick("join")}
                className="w-full py-4 px-8 bg-white text-black text-lg font-semibold border-2 border-black hover:bg-black hover:text-white transition-all duration-200 tracking-wide"
              >
                JOIN EXISTING ROOM
              </button>
            </div>
          ) : (
            <div className="w-full max-w-md bg-white border-2 border-black p-8 shadow-lg">
              <h2 className="text-2xl font-bold mb-6 text-center uppercase tracking-wider">
                {formType === "create" ? "Create Room" : "Join Room"}
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 uppercase tracking-wide">
                    Username
                  </label>
                  <input
                    type="text"
                    className="w-full p-3 border-2 border-black bg-white text-black focus:outline-none focus:ring-0 font-mono"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 uppercase tracking-wide">
                    Room Name
                  </label>
                  <input
                    type="text"
                    className="w-full p-3 border-2 border-black bg-white text-black focus:outline-none focus:ring-0 font-mono"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 uppercase tracking-wide">
                    Password
                  </label>
                  <input
                    type="password"
                    className="w-full p-3 border-2 border-black bg-white text-black focus:outline-none focus:ring-0 font-mono"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                </div>
              </div>

              {errorMessage && (
                <div className="mt-4 p-3 border-2 border-black bg-black text-white text-center font-semibold">
                  {errorMessage}
                </div>
              )}

              <div className="flex space-x-4 mt-6">
                <button
                  onClick={() => setShowForm(false)}
                  className="flex-1 py-3 px-6 bg-white text-black border-2 border-black hover:bg-gray-100 transition-all duration-200 font-semibold uppercase tracking-wide"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 py-3 px-6 bg-black text-white border-2 border-black hover:bg-gray-800 transition-all duration-200 font-semibold uppercase tracking-wide"
                >
                  Submit
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col h-screen">
          {/* Header */}
          <div className="bg-black text-white p-6 border-b-4 border-black">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-2xl font-bold uppercase tracking-wider">
                Room: {roomName}
              </h1>
              <p className="text-gray-300 mt-1">Connected as: {username}</p>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 bg-white overflow-hidden">
            <div className="max-w-4xl mx-auto h-full flex flex-col">
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-500 py-12">
                    <p className="text-lg italic">
                      No messages yet. Start the conversation!
                    </p>
                  </div>
                ) : (
                  messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex ${
                        msg.username === username
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-3 border-2 border-black ${
                          msg.username === username
                            ? "bg-black text-white"
                            : "bg-white text-black"
                        }`}
                      >
                        <div className="font-bold text-sm uppercase tracking-wide mb-1">
                          {msg.username}
                        </div>
                        <div className="font-mono text-sm leading-relaxed">
                          {msg.message}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Message Input */}
              <div className="border-t-4 border-black bg-white p-6">
                <div className="flex space-x-4">
                  <input
                    type="text"
                    placeholder="Type your message..."
                    className="flex-1 p-4 border-2 border-black bg-white text-black focus:outline-none focus:ring-0 font-mono text-lg"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                  <button
                    onClick={sendMessage}
                    className="px-8 py-4 bg-black text-white border-2 border-black hover:bg-gray-800 transition-all duration-200 font-bold uppercase tracking-wider"
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomPage;
