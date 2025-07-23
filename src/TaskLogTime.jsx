import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
const TaskLogTime = ({ taskId }) => {
  const [form, setForm] = useState({
    hours_spent: '',
    description: '',
    work_date: ''
  });
  const token = sessionStorage.getItem('token');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitLog = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_URL}/api/tasks/${taskId}/time`, form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Time logged!");
      setForm({ hours_spent: '', description: '', work_date: '' });
    } catch (err) {
      toast.error("Something went wrong");
      console.error("Log time error:", err.response?.data || err.message);
    }
  };

  return (
    <div className="mt-4 space-y-2">
      <input
        type="number"
        name="hours_spent"
        value={form.hours_spent}
        onChange={handleChange}
        placeholder="Hours spent"
        className="w-full border p-2 rounded"
      />
      <input
        type="date"
        name="work_date"
        value={form.work_date}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      />
      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Work description"
        className="w-full border p-2 rounded"
      />
      <div dir='rtl'>
        <button
          onClick={submitLog}
          className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
        >
          Log Time
        </button>
      </div>
    </div>
  );
};

export default TaskLogTime;
