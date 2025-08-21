import React, { useState } from "react";
import { Send } from "lucide-react"; // For the send icon

const MessageInput = ({ sendMessage }) => {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    sendMessage(message);
    setMessage("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      // Send on Enter, new line on Shift+Enter
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-gray-300 bg-white p-4">
      <div className="flex items-center space-x-4">
        <input
          type="text"
          placeholder="Type your message..."
          className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button
          onClick={handleSend}
          className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-all duration-200 font-bold flex items-center justify-center disabled:bg-gray-400"
          disabled={!message.trim()}
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default MessageInput;
