import React, { useState, useEffect, useCallback } from "react";
import { io } from "socket.io-client";
import Lobby from "./lobby";
import ChatRoom from "./chatroom";

// Fix the URL: remove extra spaces!
const socket = io("https://chatcript.onrender.com"); // ← No trailing spaces!

const RoomPage = () => {
  const [username, setUsername] = useState("");
  const [roomName, setRoomName] = useState("");
  const [inRoom, setInRoom] = useState(false);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  // 🔥 Handle incoming files
  useEffect(() => {
    const handleReceiveFile = (metadata, file) => {
      const { username: sender, fileName } = metadata;

      // Create downloadable blob
      const blob = new Blob([file]);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // Optional: Add system message
      const fileMessage = {
        username: "System",
        message: `${sender} sent a file: ${fileName}`,
        time: new Date(),
      };
      setMessages((prev) => [...prev, fileMessage]);
    };

    socket.on("receive_file", handleReceiveFile);

    // Existing listeners
    socket.on("room_success", () => {
      setInRoom(true);
      setErrorMessage("");
    });

    socket.on("room_error", (message) => {
      setErrorMessage(message);
    });

    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, { ...data, time: new Date() }]);
    });

    socket.on("update_user_list", setUsers);

    return () => {
      socket.off("receive_file", handleReceiveFile);
      socket.off("room_success");
      socket.off("room_error");
      socket.off("receive_message");
      socket.off("update_user_list");
    };
  }, []);

  const handleRoomAction = useCallback(
    (type, password) => {
      setErrorMessage("");
      if (username.trim() && roomName.trim()) {
        const payload = { username, roomName, password };
        socket.emit(type === "create" ? "createRoom" : "join_room", payload);
      } else {
        setErrorMessage("Username and Room Name cannot be empty.");
      }
    },
    [username, roomName]
  );

  const sendMessage = useCallback(
    (message) => {
      if (message.trim()) {
        socket.emit("send_message", { roomName, username, message });
      }
    },
    [roomName, username]
  );

  // ✅ NEW: Send file function
  const sendFile = useCallback(
    (file) => {
      if (!inRoom) return;
      socket.emit("send_file", { roomName, username, fileName: file.name }, file);
    },
    [roomName, username, inRoom]
  );

  const leaveRoom = useCallback(() => {
    setInRoom(false);
    setMessages([]);
    setUsers([]);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 font-sans">
      {!inRoom ? (
        <Lobby
          username={username}
          setUsername={setUsername}
          roomName={roomName}
          setRoomName={setRoomName}
          handleRoomAction={handleRoomAction}
          errorMessage={errorMessage}
        />
      ) : (
        <ChatRoom
          roomName={roomName}
          username={username}
          messages={messages}
          users={users}
          sendMessage={sendMessage}
          sendFile={sendFile} // ✅ Pass down
          leaveRoom={leaveRoom}
        />
      )}
    </div>
  );
};

export default RoomPage;