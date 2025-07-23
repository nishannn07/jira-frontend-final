import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const Dashboard = () => {
  const [data, setData] = useState({ projects: [], tasks: [], activities: [] });
  const token1 = sessionStorage.getItem('token');

  const fetchDashboardData = () => {
    axios.get(`${import.meta.env.VITE_URL}/api/dashboard`, {
      headers: { Authorization: `Bearer ${token1}` }
    }).then(res => setData(res.data))
    .catch(err => {
      console.error("Dashboard error:", err.response?.data || err.message);
    });
  };

  useEffect(() => {
    fetchDashboardData();
  }, [token1]);

  const navigate = useNavigate();
  const handleClick = (id) => {
    navigate('/board');
    sessionStorage.setItem('p_id', id);
  };

  const handleClickTask = (id) => {
    navigate(`/task/${id}`);
  };

  const handleDeleteProject = (id) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      axios.delete(`${import.meta.env.VITE_URL}/api/projects/${id}/delete`, {
        headers: { Authorization: `Bearer ${token1}` }
      })
      .then(res => {
        toast.success("Project deleted successfully!");
        fetchDashboardData(); // Refresh the dashboard data
      })
      .catch(err => {
        toast.error("Error deleting project.");
        console.error("Delete project error:", err.response?.data || err.message);
      });
    }
  };

  return (
    <div className="p-1 m-20 mt-4">
      <h1 className="text-3xl font-semibold mb-4">Dashboard</h1>

      <div className="shadow-xl rounded mb-6 p-5">
        <h2 className="text-xl font-bold mb-6">My Projects</h2>
        {data.projects.length ? (
          <ul className='flex flex-wrap gap-10'>
            {data.projects.slice(0, 5).map(p => (
              <li key={p.id} className="cursor-pointer ">
                <div className="p-2 ">
                  <div className="bg-gray-300 rounded-lg shadow">
                    <div className="bg-gray-800 text-white text-center py-2 rounded-t" onClick={() => handleClick(p.id)}>{p.project_name.toUpperCase()}</div>
                    <div className="p-2 space-y-2 text-black">
                      <div className='text-blue-500'>Description: <span className='text-black'>{p.description}</span></div>
                      <div className='text-blue-500'>Status: <span className='text-black'>{p.status}</span></div>
                      <button
                        onClick={() => handleDeleteProject(p.id)}
                        className="btn btn-sm btn-error mt-2"
                      >
                        Delete
                      </button>
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