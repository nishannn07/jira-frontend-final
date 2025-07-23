import React, { useEffect, useState } from 'react';

import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [data, setData] = useState({ projects: [], tasks: [], activities: [] });
  const token1 = sessionStorage.getItem('token')
  useEffect(() => {
    
    axios.get(`${import.meta.env.VITE_URL}/api/dashboard`, {
      headers: { Authorization: `Bearer ${token1}` }
    }).then(res => setData(res.data))
    .catch(err => {
    console.error("Dashboard error:", err.response?.data || err.message);
  });
  }, []);

  const navigate = useNavigate();
  const handleClick = (id) => {
    // navigate('/taskboard', { state: { p_id: id } });
    navigate('/board');
    sessionStorage.setItem('p_id', id);
  };

  const handleClickTask = (id) => {
    navigate(`/task/${id}`)
  }
  return (
    <div className="p-1  m-20 mt-4">
      <h1 className="text-3xl font-semibold mb-4">Dashboard</h1>

      <div className="shadow-xl rounded mb-6 p-5">
        <h2 className="text-xl font-bold mb-6">My Projects</h2>
        {data.projects.length ? (
          <ul className='flex flex-wrap gap-10'>
            {data.projects.slice(0, 5).map(p => (
              <li key={p.id} onClick={() => handleClick(p.id)} className="cursor-pointer ">
                <div className="p-2 ">
                  <div className="bg-gray-300 rounded-lg shadow">
                  <div className="bg-gray-800 text-white text-center py-2 rounded-t">{p.project_name.toUpperCase()}</div>
                  <div className="p-2 space-y-2 text-black">
                  <div className='text-blue-500'>Description: <span className='text-black'>{p.description}</span></div>
                  <div className='text-blue-500'>Status: <span className='text-black'>{p.status}</span></div>
                  
                </div>
                </div>
          </div>
              </li>
            ))}
          </ul>
        ) : <p>No projects yet.</p>}
      </div>

      <div className="shadow-2xl rounded mb-6 p-5">
        <h2 className="text-xl font-bold mb-6">My Tasks</h2>
        {data.tasks.length ? (
          <ul className='flex flex-wrap gap-10'>
            {data.tasks.slice(0, 5).map(t => (
              <li key={t.id} onClick={() => handleClickTask(t.id)} className="cursor-pointer ">
                <div className="p-2 ">
                  <div className="bg-gray-300 rounded-lg shadow">
                  <div className="bg-gray-600 text-white text-center py-2 rounded-t">{t.title.toUpperCase()}</div>
                  <div className="p-2 space-y-2 text-black">
                  <div className='text-blue-500'>Description: <span className='text-black'>{t.description}</span></div>
                  <div className='text-blue-500'>Priority: <span className='text-black'>{t.priority}</span></div>
                  <div className='text-blue-500'>Status: <span className='text-black'>{t.status}</span></div>
                  <div className='text-blue-500'>Due: <span className='text-black'>{t.due_date}</span></div>
                </div>
                </div>
          </div>
              </li>
            ))}
          </ul>
        ) : <p>No tasks assigned to you.</p>}
      </div>

      <div className="shadow-2xl p-4 rounded">
        <h2 className="text-xl font-bold mb-6">Activity Logs</h2>
        {data.activities.length ? (
          <ul className="space-y-1">
            {data.activities.map(t => (
              <li key={t.id} className="border border-gray-600 p-2 rounded shadow-sm bg-base-300">
                  <div><strong>Action:</strong> {t.action}</div>
                  <div><strong>Description:</strong> {t.description}</div>
                  <div className="text-sm text-gray-500"><strong>At:</strong> {t.timestamp}</div>
              </li>
            ))}
          </ul>
        ) : <p>No Activity Logs.</p>}
      </div>
    </div>
  );
};

export default Dashboard;
