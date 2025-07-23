"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { toast } from "react-hot-toast"

const ManagerDashboard = () => {
  const [pendingEmployees, setPendingEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const token = sessionStorage.getItem("token")

  useEffect(() => {
    fetchPendingEmployees()
  }, [])

  const fetchPendingEmployees = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_URL}/api/users/manager/pending`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setPendingEmployees(response.data)
    } catch (error) {
      console.error("Error fetching pending employees:", error)
      if (error.response?.status === 403) {
        toast.error("Access denied. Manager only.")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (employeeId) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_URL}/api/users/manager/approve/${employeeId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      toast.success("Employee approved successfully")
      fetchPendingEmployees() // Refresh the list
    } catch (error) {
      toast.error(error.response?.data?.msg || "Error approving employee")
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Manager Dashboard</h1>
      <h2 className="text-2xl font-semibold mb-4">Pending Employee Approvals</h2>

      {pendingEmployees.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg">No pending employee approvals</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {pendingEmployees.map((employee) => (
            <div key={employee.id} className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="card-title text-lg">
                      {employee.first_name} {employee.last_name}
                    </h3>
                    <p className="text-sm text-gray-600">@{employee.username}</p>
                    <p className="text-sm text-gray-600">{employee.email}</p>
                    <div className="mt-2">
                      <span className="badge badge-primary mr-2">{employee.roles.join(", ")}</span>
                      {employee.requested_team && (
                        <span className="badge badge-secondary">Requested Team: {employee.requested_team}</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Status: Admin Approved - Pending Manager Approval</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="btn btn-success btn-sm" onClick={() => handleApprove(employee.id)}>
                      Approve for Team
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

export default ManagerDashboard
