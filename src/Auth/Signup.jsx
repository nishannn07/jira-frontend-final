"use client"

import { useState, useEffect } from "react"
import siguplogo from "../assets/Screenshot (658).png"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { toast } from "react-hot-toast"

function Signup() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    username: "",
    lastname: "",
    email: "",
    password: "",
    confirm: "",
    role: "employee",
    team_id: "",
  })
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Fetch teams for employee selection
    const fetchTeams = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_URL}/api/users/teams`)
        setTeams(response.data)
      } catch (error) {
        console.error("Error fetching teams:", error)
      }
    }
    fetchTeams()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })

    // Reset team selection when role changes
    if (name === "role" && value === "manager") {
      setForm((prev) => ({ ...prev, team_id: "" }))
    }
  }

  const handleSubmit = async () => {
    if (form.password !== form.confirm) {
      toast.error("Passwords do not match")
      return
    }

    if (form.role === "employee" && !form.team_id) {
      toast.error("Please select a team for employee role")
      return
    }

    setLoading(true)
    try {
      const payload = {
        username: form.username,
        lastname: form.lastname,
        email: form.email,
        password: form.password,
        confirm: form.confirm,
        role: form.role,
        ...(form.role === "employee" && { team_id: Number.parseInt(form.team_id) }),
      }

      const response = await axios.post(`${import.meta.env.VITE_URL}/api/users/register`, payload)
      toast.success(response.data.msg)
      navigate("/login")
    } catch (err) {
      toast.error(err.response?.data?.msg || "Signup failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center w-full min-h-screen bg-yellow-50 px-5 py-5">
      <div className="xl:max-w-7xl bg-white drop-shadow-xl border border-black/20 w-full rounded-md flex justify-between items-stretch px-5 xl:px-5 py-5">
        <div className="sm:w-[60%] lg:w-[50%] bg-cover bg-center items-center justify-center hidden md:flex">
          <img src={siguplogo || "/placeholder.svg"} alt="signup" className="h-[500px]" />
        </div>
        <div className="mx-auto w-full lg:w-1/2 md:p-10 py-5 md:py-0">
          <h1 className="text-center text-2xl sm:text-3xl font-semibold text-[#4A07DA]">Create Account</h1>
          <div className="w-full mt-5 sm:mt-8">
            <div className="mx-auto w-full sm:max-w-md md:max-w-lg flex flex-col gap-5">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="Enter Your First Name"
                  className="input input-bordered input-primary w-full max-w-xs text-black bg-slate-50 placeholder:text-black/70"
                  required
                />
                <input
                  type="text"
                  name="lastname"
                  value={form.lastname}
                  onChange={handleChange}
                  placeholder="Enter Your Last Name"
                  className="input input-bordered input-primary w-full max-w-xs text-black bg-white placeholder:text-black/70"
                  required
                />
              </div>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter Your Email"
                className="input input-bordered input-primary w-full text-black bg-white placeholder:text-black/70"
                required
              />

              {/* Role Selection */}
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text text-black font-medium">Select Role</span>
                </label>
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="select select-bordered select-primary w-full text-black bg-white"
                  required
                >
                  <option value="employee">Employee</option>
                  <option value="manager">Manager</option>
                </select>
              </div>

              {/* Team Selection - Only for Employees */}
              {form.role === "employee" && (
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text text-black font-medium">Select Team</span>
                  </label>
                  <select
                    name="team_id"
                    value={form.team_id}
                    onChange={handleChange}
                    className="select select-bordered select-primary w-full text-black bg-white"
                    required
                  >
                    <option value="">Choose a team...</option>
                    {teams.map((team) => (
                      <option key={team.team_id} value={team.team_id}>
                        {team.team_name} - {team.description}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter Your Password"
                className="input input-bordered input-primary w-full text-black bg-white placeholder:text-black/70"
                required
              />

              <input
                type="password"
                name="confirm"
                value={form.confirm}
                onChange={handleChange}
                placeholder="Confirm Password"
                className="input input-bordered input-primary w-full text-black bg-white placeholder:text-black/70"
                required
              />

              {/* Role Information */}
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong>{" "}
                  {form.role === "employee"
                    ? "As an employee, your account will need approval from both admin and your team manager."
                    : "As a manager, your account will need approval from the admin only."}
                </p>
              </div>

              <div className="flex flex-col md:flex-row gap-2 md:gap-4 justify-center items-center">
                <button
                  className={`btn btn-active btn-primary btn-block max-w-[200px] ${loading ? "loading" : ""}`}
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? "Signing Up..." : "Sign Up"}
                </button>
                <button
                  className="btn btn-outline btn-primary btn-block max-w-[200px]"
                  onClick={() => navigate("/login")}
                  disabled={loading}
                >
                  Sign In
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signup
