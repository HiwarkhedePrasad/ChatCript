## Chatcript

Real‑time, room‑based chat application built with a Node.js/Express + Socket.IO backend and a Vite + React frontend styled with Tailwind CSS.

### Features
- **Password‑protected rooms**: Create or join rooms with a shared password.
- **Real‑time messaging**: Messages broadcast to all users in the room via Socket.IO.
- **System join/leave notices**: Automatic room system messages on user connect/disconnect.
- **Responsive UI**: Clean chat interface; mobile overlay for user list.

### Tech stack
- **Backend**: Node.js, Express, Socket.IO, CORS
- **Frontend**: React 19, Vite 6, Tailwind CSS 4, socket.io‑client
- **UI/Utils**: framer‑motion (landing animation), lucide‑react (icons)

### Project structure
```
chatcript/
  backend/
    index.js                 # Express + Socket.IO server (port 5000)
    package.json
  frontend/
    src/
      App.jsx                # Renders RoomPage
      main.jsx               # Vite entry
      index.css              # Tailwind CSS import
      component/
        Roompage.jsx         # Lobby ↔ ChatRoom controller (active UI)
        lobby.jsx            # Create/Join form
        chatroom.jsx         # Chat UI shell (header, list, input, user list)
        msglist.jsx          # Message list with timestamps
        msginput.jsx         # Message input with send button
        userlist.jsx         # Sidebar/overlay user list
        chating.jsx          # Legacy/alternate single‑file chat page (unused)
    vite.config.js           # React + Tailwind plugin config
    package.json
    index.html
```

### How it works (high‑level)
- **Backend** keeps in‑memory `rooms` and `userSocketMap` objects (no database). It listens for Socket.IO events:
  - `createRoom { username, roomName, password }`
  - `join_room { username, roomName, password }`
  - `send_message { roomName, username, message }`
  - On disconnect, it cleans up users/rooms and emits a system message.
- **Frontend** connects to `http://localhost:5000` via socket.io‑client. The `RoomPage` component handles lobby actions and renders `ChatRoom` which composes `MessageList` and `MessageInput`.

Note: User list UI (`userlist.jsx`) expects an `update_user_list` event, which the backend does not currently emit.

### Prerequisites
- Node.js 18+ and npm

### Setup and run (development)
Open two terminals, one for the backend and one for the frontend.

1) Backend
```
cd backend
npm install
npm run dev
# Server: http://localhost:5000
```

2) Frontend
```
cd frontend
npm install
npm install lucide-react
npm run dev
# App: printed by Vite (usually http://localhost:5173)
```

The frontend connects to the backend at `http://localhost:5000` (hardcoded in components). Ensure the backend is running first.

### Usage
1. In the lobby, choose Create or Join.
2. Enter a username, room name, and room password.
3. Share the room name and password with others to chat together in real time.

### Available scripts
- Backend (`backend/package.json`):
  - `npm run dev` — start server with nodemon
  - `npm start` — start server with node
- Frontend (`frontend/package.json`):
  - `npm run dev` — Vite dev server
  - `npm run build` — build for production
  - `npm run preview` — preview production build
  - `npm run lint` — run ESLint

### Configuration notes
- **Socket URL**: `http://localhost:5000` is hardcoded in components (`Roompage.jsx`, `chatroom.jsx`, `chating.jsx`). For environments other than local, you may want to refactor this into an environment variable.
- **CORS**: Backend Socket.IO server allows all origins for dev convenience.

### Known limitations / TODOs
- **No persistence**: Rooms and users live only in memory; all data is lost when the server restarts.
- **User list updates**: UI includes a user list, but the backend does not emit `update_user_list`; the list will remain empty until implemented.
- **Duplicate/legacy UI**: `chating.jsx` is an unused alternative to `Roompage.jsx`.
- **Encryption claim**: The `Home.jsx` copy mentions end‑to‑end encryption, but encryption is not implemented.
- **Single server instance**: No horizontal scaling or sticky sessions.

### Future improvements
- Emit and handle `update_user_list` to populate the online users panel.
- Externalize the Socket.IO server URL into env config.
- Persist rooms/messages in a database if history is desired.
- Add authentication and per‑room admin controls.
- Implement actual end‑to‑end encryption if required.

### License
ISC (see package.json)


