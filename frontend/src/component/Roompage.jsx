import React, { useState, useEffect, useCallback } from "react";
import { io } from "socket.io-client";
import Lobby from "./lobby";
import ChatRoom from "./chatroom";

const socket = io("https://chatcript.onrender.com");

const RoomPage = () => {
  const [username, setUsername] = useState("");
  const [roomName, setRoomName] = useState("");
  const [inRoom, setInRoom] = useState(false);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    socket.on("room_success", (data) => {
      setInRoom(true);
      setErrorMessage("");
    });

    socket.on("room_error", (message) => {
      setErrorMessage(message);
    });

    socket.on("receive_message", (data) => {
      // Add a timestamp to all incoming messages
      const newMessage = { ...data, time: new Date() };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    socket.on("update_user_list", (userList) => {
      setUsers(userList);
    });

    return () => {
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
        // Use the 'createRoom' event name from your backend
        if (type === "create") {
          socket.emit("createRoom", payload);
        } else {
          socket.emit("join_room", payload);
        }
      } else {
        setErrorMessage("Username and Room Name cannot be empty.");
      }
    },
    [username, roomName]
  );

  const sendMessage = useCallback(
    (message) => {
      if (message.trim()) {
        const messageData = { roomName, username, message };
        socket.emit("send_message", messageData);
      }
    },
    [roomName, username]
  );

  // Updated: Leave room by resetting state, as backend only handles disconnect
  const leaveRoom = useCallback(() => {
    setInRoom(false);
    setMessages([]);
    setUsers([]);
    // This effectively takes the user back to the lobby without a full page reload.
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
          leaveRoom={leaveRoom}
        />
      )}
    </div>
  );
};

export default RoomPage;
