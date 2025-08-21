import React, { useState } from "react";
import MessageList from "./msglist";
import UserList from "./userlist";
import MessageInput from "./msginput";
import { X, Users, Menu } from "lucide-react"; // For icons, run: npm install lucide-react

const ChatRoom = ({
  roomName,
  username,
  messages,
  users,
  sendMessage,
  leaveRoom,
}) => {
  const [isUserListVisible, setIsUserListVisible] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* User List - visible on larger screens */}
      <div className="hidden md:flex md:flex-shrink-0">
        <UserList users={users} />
      </div>

      <div className="flex flex-col flex-1 w-full">
        {/* Header */}
        <header className="bg-white border-b border-gray-300 p-4 shadow-sm flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-black">Room: {roomName}</h1>
            <p className="text-sm text-gray-500">Connected as: {username}</p>
          </div>
          <div className="flex items-center space-x-4">
            {/* Hamburger menu for user list on mobile */}
            <button
              onClick={() => setIsUserListVisible(!isUserListVisible)}
              className="p-2 rounded-full hover:bg-gray-200 md:hidden"
            >
              <Users size={24} />
            </button>
            <button
              onClick={leaveRoom}
              className="py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-semibold flex items-center space-x-2"
            >
              <X size={16} />
              <span>Leave</span>
            </button>
          </div>
        </header>

        {/* Main Chat Area */}
        <main className="flex-1 overflow-hidden p:2 sm:p-4 flex">
          <MessageList messages={messages} currentUser={username} />
        </main>

        {/* Message Input */}
        <MessageInput sendMessage={sendMessage} />
      </div>

      {/* User List - Mobile Overlay */}
      {isUserListVisible && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsUserListVisible(false)}
        >
          <div className="fixed top-0 right-0 h-full bg-white z-50 w-64 shadow-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Users</h2>
              <button
                onClick={() => setIsUserListVisible(false)}
                className="p-1 rounded-full hover:bg-gray-200"
              >
                <X size={20} />
              </button>
            </div>
            <UserList users={users} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatRoom;
