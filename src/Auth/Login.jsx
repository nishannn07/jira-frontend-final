"use client"

import { useState } from "react"
import loginlogo from "../assets/Screenshot (658).png"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { toast } from "react-hot-toast"

function Login({ setAuth }) {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: "", password: "" })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const handleSubmit = async () => {
    if (!form.email || !form.password) {
      toast.error("Please fill in all fields")
      return
    }

    setLoading(true)
    try {
      const response = await axios.post(`${import.meta.env.VITE_URL}/api/users/login`, {
        email: form.email,
        password: form.password,
      })

      const { token, user } = response.data
      sessionStorage.setItem("token", token)
      sessionStorage.setItem("userInfo", JSON.stringify(user))
      
      setAuth(true)
      toast.success("Login successful!")
      navigate("/dashboard")
    } catch (err) {
      if (err.response?.status === 403) {
        toast.error("Your account is pending approval. Please wait for admin/manager approval.")
      } else {
        toast.error(err.response?.data?.msg || "Login failed")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center w-full min-h-screen bg-yellow-50 px-5 py-5">
      <div className="xl:max-w-7xl bg-white drop-shadow-xl border border-black/20 w-full rounded-md flex justify-between items-stretch px-5 xl:px-5 py-5">
        <div className="sm:w-[60%] lg:w-[50%] bg-cover bg-center items-center justify-center hidden md:flex">
          <img src={loginlogo || "/placeholder.svg"} alt="login" className="h-[500px]" />
        </div>
        <div className="mx-auto w-full lg:w-1/2 md:p-10 py-5 md:py-0">
          <h1 className="text-center text-2xl sm:text-3xl font-semibold text-[#4A07DA]">Welcome Back</h1>
          <div className="w-full mt-5 sm:mt-8">
            <div className="mx-auto w-full sm:max-w-md md:max-w-lg flex flex-col gap-5">
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter Your Email"
                className="input input-bordered input-primary w-full text-black bg-white placeholder:text-black/70"
                required
              />
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter Your Password"
                className="input input-bordered input-primary w-full text-black bg-white placeholder:text-black/70"
                required
              />
              <div className="flex flex-col md:flex-row gap-2 md:gap-4 justify-center items-center">
                <button
                  className={`btn btn-active btn-primary btn-block max-w-[200px] ${loading ? "loading" : ""}`}
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? "Signing In..." : "Sign In"}
                </button>
                <button
                  className="btn btn-outline btn-primary btn-block max-w-[200px]"
                  onClick={() => navigate("/signup")}
                  disabled={loading}
                >
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
