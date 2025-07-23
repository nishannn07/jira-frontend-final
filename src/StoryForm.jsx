"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { toast } from "react-hot-toast"

const StoryForm = () => {
  const token = sessionStorage.getItem("token")
  const p_id = sessionStorage.getItem("p_id")
  const navigate = useNavigate()

  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "todo",
    priority: "medium",
    story_points: "",
    epic_id: "",
    project_id: p_id,
  })

  const [epics, setEpics] = useState([])

  useEffect(() => {
    if (p_id) {
      axios
        .get(`${import.meta.env.VITE_URL}/api/epics/project/${p_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setEpics(res.data)

          // Check if there's a pre-selected epic from epic details page
          const selectedEpicId = sessionStorage.getItem("selected_epic_id")
          if (selectedEpicId) {
            setForm((prev) => ({ ...prev, epic_id: selectedEpicId }))
            sessionStorage.removeItem("selected_epic_id") // Clean up
          }
        })
        .catch((err) => {
          console.error("Epic fetch error:", err.response?.data || err.message)
        })
    }
  }, [p_id, token])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post(`${import.meta.env.VITE_URL}/api/stories/new`, form, {
        headers: { Authorization: `Bearer ${token}` },
      })
      toast.success("Story created successfully!")
      navigate("/stories")
    } catch (err) {
      toast.error("Something went wrong")
      console.error("Story creation error:", err.response?.data || err.message)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 border border-gray-600 shadow rounded max-w-2xl mx-auto">
      <div className="text-xl mb-3">Create Story</div>

      <input
        name="title"
        value={form.title}
        onChange={handleChange}
        placeholder="Story Title"
        required
        className="w-full border p-2 rounded"
      />

      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Story Description"
        className="w-full border p-2 rounded"
        rows="4"
      />

      <select
        name="epic_id"
        value={form.epic_id}
        onChange={handleChange}
        required
        className="w-full border p-2 rounded"
      >
        <option value="">Select Epic</option>
        {epics.map((epic) => (
          <option key={epic.id} value={epic.id}>
            {epic.title}
          </option>
        ))}
      </select>

      <select name="status" value={form.status} onChange={handleChange} className="w-full border p-2 rounded">
        <option value="todo">To Do</option>
        <option value="in_progress">In Progress</option>
        <option value="in_review">In Review</option>
        <option value="done">Done</option>
      </select>

      <select name="priority" value={form.priority} onChange={handleChange} className="w-full border p-2 rounded">
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>

      <input
        name="story_points"
        type="number"
        value={form.story_points}
        onChange={handleChange}
        placeholder="Story Points"
        className="w-full border p-2 rounded"
      />

      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
        Create Story
      </button>
    </form>
  )
}

export default StoryForm
