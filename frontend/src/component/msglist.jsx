import React, { useEffect, useRef } from "react";

const formatTime = (date) => {
  return new Date(date).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const MessageList = ({ messages, currentUser }) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const renderMessage = (msg, index) => {
    // UPDATED: Check for username "System" to identify system messages
    if (msg.username === "System") {
      return (
        <div key={index} className="text-center my-2">
          <p className="text-xs text-gray-500 italic">
            {msg.message} -{" "}
            <span className="font-semibold">{formatTime(msg.time)}</span>
          </p>
        </div>
      );
    }

    const isCurrentUser = msg.username === currentUser;

    return (
      <div
        key={index}
        className={`flex my-1 ${
          isCurrentUser ? "justify-end" : "justify-start"
        }`}
      >
        <div
          className={`max-w-xs md:max-w-md px-4 py-2 rounded-lg shadow ${
            isCurrentUser
              ? "bg-black text-white rounded-br-none"
              : "bg-white text-black border border-gray-200 rounded-bl-none"
          }`}
        >
          {!isCurrentUser && (
            <div className="font-bold text-sm text-blue-600 mb-1">
              {msg.username}
            </div>
          )}
          <p className="text-sm leading-relaxed">{msg.message}</p>
          <div
            className={`text-xs mt-1 ${
              isCurrentUser ? "text-gray-400" : "text-gray-500"
            } text-right`}
          >
            {formatTime(msg.time)}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-100">
      {messages.map(renderMessage)}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
