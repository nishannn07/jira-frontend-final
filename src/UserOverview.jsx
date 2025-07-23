import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
const UserOverview = () => {
  const token = sessionStorage.getItem('token');
  const [data, setData] = useState({ projects: [], teams: [] });
   const [userRoles, setUserRoles] = useState([])

  useEffect(() => {
    const userInfo = JSON.parse(sessionStorage.getItem("userInfo") || "{}");
    setUserRoles(userInfo.roles || []);
    axios.get(`${import.meta.env.VITE_URL}/api/users/me/overview`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setData(res.data))
      .catch(err => console.error('Overview fetch error:', err.response?.data || err.message));
  }, [token]);

  // const handleRoleRaise = async () => {
  //   const token = sessionStorage.getItem("token");
  //   try {
  //     await axios.post("http://127.0.0.1:5000/api/users/request-role-raise", {}, {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });
  //     toast.success("Role raise request sent to admin");
  //   } catch (err) {
  //     toast.error(err.response?.data?.msg || "Error sending request");
  //   }
  // };
  
  const handleRoleRaise = async () => {
  const confirmAction = window.confirm("Are you sure you want to request a role raise?");
  if (!confirmAction) {
    toast.error("Role raise request cancelled.");
    return;
  }

  const token = sessionStorage.getItem("token");

  try {
    await axios.post(`${import.meta.env.VITE_URL}/api/users/request-role-raise`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    toast.success("Role raise request sent to admin");
  } catch (err) {
    toast.error(err.response?.data?.msg || "Error sending request");
  }
};

  const isEmployee = userRoles.includes("employee") && !userRoles.includes("manager") && !userRoles.includes("super_admin");

  return (
    <>
    <div className={`p-5 max-w-4xl mx-auto bg-blue-200 mb-4 ${isEmployee ? "" : 'opacity-0'}`}>
      <div>To access features to Manager</div>
      <div dir='rtl'>

        {isEmployee && (
            <button
                onClick={handleRoleRaise}
                className="btn btn-error"
            >
                Request Role Raise
            </button>
        )}

      </div>
    </div>
    
    <div className="p-6 max-w-4xl mx-auto shadow-2xl bg-base-300 mb-4">
      <h2 className="text-2xl font-bold mb-4 text-center">My Projects</h2>
      <ul className="mb-3 space-y-2">
        {data.projects.map(p => (
          <li key={p.id} className="shadow-inner bg-base-100 p-3 rounded ">{p.project_name}</li>
        ))}
      </ul>
      </div>

      <div className="p-4 max-w-4xl mx-auto shadow-2xl bg-base-300">
      <h2 className="text-2xl font-bold mb-4 text-center">My Teams</h2>
      {data.teams.map(team => (
        <div key={team.team_id} className="mb-6 p-4 shadow-inner rounded">
          <h3 className="text-xl font-semibold">{team.team_name}</h3>
          <p className="text-sm">{team.description}</p>
          <ul className="mt-2 pl-4 list-disc">
            {team.members.map(member => (
              <li key={member.id}>{member.username} ({member.email})</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
    </>
  );
};

export default UserOverview;
