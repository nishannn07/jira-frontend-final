import React, { useState } from 'react';

function NotificationBox() {
  const [showBox, setShowBox] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setShowBox(!showBox)}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Show Notification
      </button>

      {showBox && (
        <div className="absolute top-12 right-0 w-64 p-3 bg-white border rounded shadow-md z-50 text-black">
          🔔 You have a new message!
        </div>
      )}
    </div>
  );
}

export default NotificationBox;
