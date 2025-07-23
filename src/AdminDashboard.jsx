// jiraboard_frontend-dev/src/AdminDashboard.jsx

"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { toast } from "react-hot-toast"

const AdminDashboard = () => {
  const [pendingUsers, setPendingUsers] = useState([])
  const [roleRaiseRequests, setRoleRaiseRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const token = sessionStorage.getItem("token")

  useEffect(() => {
    fetchPendingUsers()
    fetchRoleRaiseRequests()
  }, [])

  const fetchPendingUsers = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_URL}/api/users/admin/pending`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setPendingUsers(response.data)
    } catch (error) {
      console.error("Error fetching pending users:", error)
      if (error.response?.status === 403) {
        toast.error("Access denied. Super admin only.")
      }
    } finally {
      setLoading(false)
    }
  }

  const fetchRoleRaiseRequests = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_URL}/api/users/admin/role-raise-requests`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRoleRaiseRequests(response.data);
    } catch (error) {
      console.error("Error fetching role raise requests:", error);
    }
  };

  const handleApprove = async (userId) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_URL}/api/users/admin/approve/${userId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      toast.success("User approved successfully")
      fetchPendingUsers() // Refresh the list
    } catch (error) {
      toast.error(error.response?.data?.msg || "Error approving user")
    }
  }

  const handleReject = async (userId) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_URL}/api/users/admin/reject/${userId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      toast.success("User rejected successfully")
      fetchPendingUsers() // Refresh the list
    } catch (error) {
      toast.error(error.response?.data?.msg || "Error rejecting user")
    }
  }

  const handleApproveRoleRaise = async (userId) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_URL}/api/users/admin/approve-role-raise/${userId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Role raise approved successfully");
      fetchRoleRaiseRequests(); // Refresh the list
    } catch (error) {
      toast.error(error.response?.data?.msg || "Error approving role raise");
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
      <h1 className="text-3xl font-bold mb-6 text-center">Admin - User Management</h1>
      <h2 className="text-2xl font-semibold mb-4">Pending User Approvals</h2>

      {pendingUsers.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg">No pending user approvals</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {pendingUsers.map((user) => (
            <div key={user.id} className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="card-title text-lg">
                      {user.first_name} {user.last_name}
                    </h3>
                    <p className="text-sm text-gray-600">@{user.username}</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    <div className="mt-2">
                      <span className="badge badge-primary mr-2">{user.roles.join(", ")}</span>
                      {user.requested_team && (
                        <span className="badge badge-secondary">Team: {user.requested_team}</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Status: {user.approval_status.replace("_", " ").toUpperCase()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button className="btn btn-success btn-sm" onClick={() => handleApprove(user.id)}>
                      Approve
                    </button>
                    <button className="btn btn-error btn-sm" onClick={() => handleReject(user.id)}>
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <h2 className="text-2xl font-semibold mb-4 mt-8">Role Raise Requests</h2>
      {roleRaiseRequests.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg">No pending role raise requests</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {roleRaiseRequests.map((user) => (
            <div key={user.id} className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="card-title text-lg">
                      {user.first_name} {user.last_name}
                    </h3>
                    <p className="text-sm text-gray-600">@{user.username}</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    <div className="mt-2">
                      <span className="badge badge-primary mr-2">{user.roles.join(", ")}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="btn btn-success btn-sm" onClick={() => handleApproveRoleRaise(user.id)}>
                      Approve Role Raise
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AdminDashboard