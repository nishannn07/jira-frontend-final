"use client"

import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { toast } from "react-hot-toast"

const EpicForm = () => {
  const token = sessionStorage.getItem("token")
  const p_id = sessionStorage.getItem("p_id")
  const navigate = useNavigate()

  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "open",
    priority: "medium",
    start_date: "",
    end_date: "",
    project_id: p_id,
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post(`${import.meta.env.VITE_URL}/api/epics/new`, form, {
        headers: { Authorization: `Bearer ${token}` },
      })
      toast.success("Epic created successfully!")
      navigate("/epics")
    } catch (err) {
      toast.error("Something went wrong")
      console.error("Epic creation error:", err.response?.data || err.message)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 border border-gray-600 shadow rounded max-w-2xl mx-auto">
      <div className="text-xl mb-3">Create Epic</div>

      <input
        name="title"
        value={form.title}
        onChange={handleChange}
        placeholder="Epic Title"
        required
        className="w-full border p-2 rounded"
      />

      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Epic Description"
        className="w-full border p-2 rounded"
        rows="4"
      />

      <select name="status" value={form.status} onChange={handleChange} className="w-full border p-2 rounded">
        <option value="open">Open</option>
        <option value="in_progress">In Progress</option>
        <option value="done">Done</option>
      </select>

      <select name="priority" value={form.priority} onChange={handleChange} className="w-full border p-2 rounded">
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>

      <input
        name="start_date"
        type="date"
        value={form.start_date}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        placeholder="Start Date"
      />

      <input
        name="end_date"
        type="date"
        value={form.end_date}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        placeholder="End Date"
      />

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Create Epic
      </button>
    </form>
  )
}

export default EpicForm
