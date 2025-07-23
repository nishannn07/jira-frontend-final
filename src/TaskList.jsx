import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TaskComment from './TaskComment';
import TaskLogTime from './TaskLogTime';
import { toast } from 'react-hot-toast';

const TaskList = () => {
  const token = sessionStorage.getItem('token');
  const [tasks, setTasks] = useState([]);
  const [openAccordion, setOpenAccordion] = useState(null);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_URL}/api/tasks/my-tasks`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setTasks(res.data))
      .catch(err => {
        console.error("Listtask error:", err.response?.data || err.message);
      });
  }, [token]);

  const toggleAccordion = (taskId) => {
    setOpenAccordion(openAccordion === taskId ? null : taskId);
  };

  const handleStatusChange = async (taskId, newStatus) => {
  try {
    await axios.put(`${import.meta.env.VITE_URL}/api/tasks/${taskId}/edit`, {
      status: newStatus
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const updated = await axios.get(`${import.meta.env.VITE_URL}/api/tasks/my-tasks`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setTasks(updated.data);

    toast.success("Status updated!");
  } catch (err) {
    console.error('Status update error:', err.response?.data || err.message);
    toast.error("Failed to update status.");
  }
};


  return (
    <div className="p-4 max-w-4xl mx-auto bg-base-300 shadow-inner">
      <h2 className="text-xl font-bold mb-4">My Tasks</h2>
      <ul className="space-y-2">
        {tasks.length ? (
          tasks.map(task => (
            <li key={task.id} className="p-4 rounded shadow border border-gray-600 overflow-hidden">
              <div>Project: {task.project_name}</div>
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-semibold">{task.title}</span>
                  <span className="text-sm text-gray-400 ml-2">({task.status})</span>
                </div>
                <button
                  onClick={() => toggleAccordion(task.id)}
                  className="text-sm text-blue-400 hover:underline focus:outline-none"
                >
                  {openAccordion === task.id ? 'Hide Details' : 'Show Details'}
                </button>
              </div>
              <div>
                  <select
                    value={task.status}
                    onChange={(e) => handleStatusChange(task.id, e.target.value)}
                    className="mt-2 bg-gray-700 text-white p-1 rounded border border-gray-500"
                    disabled={task.status === 'done'}
                  >
                    <option value="todo">To Do</option>
                    <option value="in_progress">In Progress</option>
                    <option value="in_review">In Review</option>
                    <option value="done">Done</option>
                  </select>
              </div>

              {openAccordion === task.id && (
                <div className="mt-4 space-y-4 border-t border-gray-600 pt-4">
                  <TaskComment taskId={task.id} projectId={task.project_id} />
                  <TaskLogTime taskId={task.id} />
                </div>
              )}
            </li>
          ))
        ) : (
          <p>No Tasks yet.</p>
        )}
      </ul>
    </div>
  );
};

export default TaskList;
