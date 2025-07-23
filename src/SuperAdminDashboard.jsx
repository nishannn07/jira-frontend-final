// jiraboard_frontend-dev/src/SuperAdminDashboard.jsx

"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { toast } from "react-hot-toast"

const SuperAdminDashboard = () => {
  const [projects, setProjects] = useState([])
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true)
  const token = sessionStorage.getItem("token")

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        // Fetch both projects and teams concurrently
        await Promise.all([fetchAllProjects(), fetchAllTeams()]);
      } catch (error) {
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, [])

  const fetchAllProjects = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_URL}/api/projects/super-admin/all-projects`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects(response.data);
    } catch (error) {
      console.error("Error fetching all projects:", error);
      if (error.response?.status !== 403) {
        toast.error("Could not fetch projects.");
      }
    }
  };

  const fetchAllTeams = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_URL}/api/teams/super-admin/all-teams`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTeams(response.data);
    } catch (error) {
      console.error("Error fetching all teams:", error);
      if (error.response?.status !== 403) {
       toast.error("Could not fetch teams.");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Super Admin Dashboard</h1>

      {/* All Projects Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">All Projects</h2>
        {projects.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">No projects found.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {projects.map((project) => (
              <div key={project.id} className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h3 className="card-title text-lg">{project.project_name}</h3>
                  <p>{project.description}</p>
                  <div>
                    <strong>Teams:</strong>
                    {project.teams.length > 0 ? (
                      <ul className="list-disc pl-5">
                        {project.teams.map(team => (
                          <li key={team.team_id}>{team.team_name}</li>
                        ))}
                      </ul>
                    ) : (
                      " No teams assigned."
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <hr className="my-8" />
      
      {/* All Teams Section */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">All Teams</h2>
        {teams.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">No teams found.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {teams.map((team) => (
              <div key={team.team_id} className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h3 className="card-title text-lg">{team.team_name}</h3>
                  <p>{team.description}</p>
                  <div>
                    <strong>Members:</strong>
                    {team.members.length > 0 ? (
                      <ul className="list-disc pl-5">
                        {team.members.map(member => (
                          <li key={member.id}>{member.username} ({member.email})</li>
                        ))}
                      </ul>
                    ) : (
                      " No members in this team."
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default SuperAdminDashboard