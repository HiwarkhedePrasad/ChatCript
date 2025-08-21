import React, { useState } from "react";

const Lobby = ({
  username,
  setUsername,
  roomName,
  setRoomName,
  handleRoomAction,
  errorMessage,
}) => {
  const [formType, setFormType] = useState(null); // 'create' or 'join'
  const [password, setPassword] = useState("");

  const handleShowForm = (type) => {
    setFormType(type);
    setPassword(""); // Reset password on form switch
  };

  const handleSubmit = () => {
    handleRoomAction(formType, password);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-white">
      <div className="text-center mb-10">
        <h1 className="text-5xl font-bold mb-3 text-black">ChatSphere</h1>
        <p className="text-gray-500 text-lg">
          Connect with others in secure, private rooms.
        </p>
      </div>

      {!formType ? (
        <div className="flex flex-col space-y-4 w-full max-w-sm">
          <button
            onClick={() => handleShowForm("create")}
            className="w-full py-3 px-6 bg-black text-white text-lg font-semibold rounded-md hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            CREATE A ROOM
          </button>
          <button
            onClick={() => handleShowForm("join")}
            className="w-full py-3 px-6 bg-white text-black text-lg font-semibold border-2 border-black rounded-md hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            JOIN A ROOM
          </button>
        </div>
      ) : (
        <div className="w-full max-w-sm bg-white border border-gray-200 p-8 rounded-lg shadow-xl">
          <h2 className="text-3xl font-bold mb-6 text-center text-black capitalize">
            {formType} Room
          </h2>

          <div className="space-y-4">
            <input
              type="text"
              placeholder="Your Username"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <input
              type="text"
              placeholder="Room Name"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <input
              type="password"
              placeholder="Room Password"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>

          {errorMessage && (
            <div className="mt-4 p-3 border border-red-500 bg-red-50 text-red-700 rounded-md text-center font-semibold">
              {errorMessage}
            </div>
          )}

          <div className="flex space-x-4 mt-6">
            <button
              onClick={() => setFormType(null)}
              className="flex-1 py-3 px-6 bg-gray-200 text-black border border-gray-300 rounded-md hover:bg-gray-300 transition-all duration-200 font-semibold"
            >
              Back
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 py-3 px-6 bg-black text-white rounded-md hover:bg-gray-800 transition-all duration-200 font-semibold"
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Lobby;
