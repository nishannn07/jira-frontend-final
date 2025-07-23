import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
function UserLogs() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_URL}/api/activities/user`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('token')}`,
          },
        });
        setLogs(res.data);
      } catch (err) {
        toast.error("Error fetching logs");
        console.error('Error fetching logs:', err);
      }
    };

    fetchLogs();
  }, []);

  return (
    <div className="p-5 shadow-2xl rounded-lg max-w-2xl mx-auto border">
      <h2 className="text-xl font-bold mb-4">My Activity Logs</h2>
      <ul className="space-y-2">
        {logs.map(log => (
          <li key={log.id} className="border border-gray-600 p-2 rounded shadow-sm">
            <div><strong>Action:</strong> {log.action}</div>
            <div><strong>Description:</strong> {log.description}</div>
            <div className="text-sm text-gray-500"><strong>At:</strong> {log.timestamp}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserLogs;
