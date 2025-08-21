import React from "react";

const UserList = ({ users }) => {
  return (
    <div className="w-64 bg-gray-50 border-r border-gray-300 p-4 flex-shrink-0">
      <h2 className="text-lg font-bold mb-4 text-gray-800 border-b pb-2">
        Users Online ({users.length})
      </h2>
      <ul className="space-y-3">
        {users.map((user, index) => (
          <li key={index} className="flex items-center space-x-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-gray-700 font-medium">{user}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
