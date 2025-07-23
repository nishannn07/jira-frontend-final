import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import TaskComment from './TaskComment';
import TaskLogTime from './TaskLogTime';

const TaskBoard = () => {
  // const location = useLocation();
  const token = sessionStorage.getItem('token');
  const projectId = sessionStorage.getItem('p_id');
  // const projectId = location.state.p_id;
  const [board, setBoard] = useState({ todo: [], in_progress: [], in_review: [], done: [] });

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_URL}/api/tasks/project/${projectId}/board`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setBoard(res.data));
  }, [projectId, token]);

  const renderColumn = (title, tasks) => (
    <div className="flex-1 bg-gray-900 p-4 rounded shadow">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <div className="space-y-2">
        {tasks.map(task => (
          <div key={task.id} className="bg-grey-900 p-2 rounded border shadow-sm">{task.title}
        </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col md:flex-row gap-4 p-4 max-w-6xl mx-auto">
      {renderColumn('To Do', board.todo)}
      {renderColumn('In Progress', board.in_progress)}
      {renderColumn('In Review', board.in_review)}
      {renderColumn('Done', board.done)}

    </div>
  );
};

export default TaskBoard;
