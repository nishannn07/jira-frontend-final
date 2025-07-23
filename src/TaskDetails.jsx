import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import TaskComment from './TaskComment';
import TaskLogTime from './TaskLogTime';

const TaskDetails = () => {
  const { taskId } = useParams(); // URL param: /task/:taskId
  const [task, setTask] = useState(null);
  const [error, setError] = useState(null);
  const token = sessionStorage.getItem('token');

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_URL}/api/tasks/${taskId}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setTask(res.data))
      .catch(err => {
        setError(err.response?.data?.msg || "Error fetching task");
      });
  }, [taskId, token]);

  if (error) return <div className="text-red-500 text-center mt-4">{error}</div>;
  if (!task) return <div className="text-center mt-4">Loading task...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-base-300 rounded shadow-2xl">
      <h1 className="text-2xl font-bold mb-2">{task.title}</h1>
      <p className="mb-2"><span className="font-semibold">Description:</span> {task.description}</p>
      <p className="mb-2"><span className="font-semibold">Status:</span> {task.status}</p>
      <p className="mb-2"><span className="font-semibold">Priority:</span> {task.priority}</p>
      <p className="mb-2"><span className="font-semibold">Due Date:</span> {task.due_date}</p>
      {/* <p className="mb-4"><span className="font-semibold">Assigned To:</span> {task.assigned_to?.username || 'Unassigned'}</p> */}

      {/* <TaskComment taskId={task.id} /> */}
      <TaskLogTime taskId={task.id} />
    </div>
  );
};

export default TaskDetails;
