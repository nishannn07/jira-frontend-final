{import.meta.env.VITE_URL}"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { toast } from "react-hot-toast"

const TaskForm = () => {
  const p_id = sessionStorage.getItem("p_id")
  const [projects, setProjects] = useState([])
  const [users, setUsers] = useState([])
  const [stories, setStories] = useState([])
  const token = sessionStorage.getItem("token")
  const navigate = useNavigate()

  const [form, setForm] = useState({
    title: "",
    description: "",
    work_type: "task",
    priority: "low",
    status: "todo",
    assigned_to: "",
    project_id: p_id,
    story_id: "",
    due_date: "",
    estimated_hours: "",
    story_points: "",
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projRes = await axios.get(`${import.meta.env.VITE_URL}/api/projects/`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setProjects(projRes.data)

        const usersRes = await axios.get(`${import.meta.env.VITE_URL}/api/users/`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setUsers(usersRes.data)

        if (p_id) {
          const storiesRes = await axios.get(`${import.meta.env.VITE_URL}/api/stories/project/${p_id}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          setStories(storiesRes.data)

          // Check if there's a pre-selected story from story details page
          const selectedStoryId = sessionStorage.getItem("selected_story_id")
          if (selectedStoryId) {
            setForm((prev) => ({ ...prev, story_id: selectedStoryId }))
            sessionStorage.removeItem("selected_story_id") // Clean up
          }
        }
      } catch (err) {
        console.error("Data fetch error:", err.response?.data || err.message)
      }
    }
    fetchData()
  }, [p_id, token])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post(`${import.meta.env.VITE_URL}/api/tasks/new`, form, {
        headers: { Authorization: `Bearer ${token}` },
      })
      toast.success("Task created successfully!")
      navigate("/dashboard")
    } catch (err) {
      toast.error("Something went wrong")
      console.error("Task creation error:", err.response?.data || err.message)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 border border-slate-500 rounded shadow-md max-w-xl mx-auto">
      <h2 className="text-xl mb-3">Create Task</h2>

      <input
        name="title"
        value={form.title}
        onChange={handleChange}
        placeholder="Title"
        required
        className="w-full border border-gray-300 rounded p-2"
      />

      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Description"
        className="w-full border border-gray-300 rounded p-2"
      />

      <select
        name="work_type"
        value={form.work_type}
        onChange={handleChange}
        required
        className="w-full border border-gray-300 rounded p-2"
      >
        <option value="task">Task</option>
        <option value="bug">Bug</option>
        <option value="improvement">Improvement</option>
        <option value="new_feature">New Feature</option>
        <option value="sub_task">Sub-task</option>
      </select>

      <select
        name="story_id"
        value={form.story_id}
        onChange={handleChange}
        className="w-full border border-gray-300 rounded p-2"
      >
        <option value="">No Story (Optional)</option>
        {stories.map((story) => (
          <option key={story.id} value={story.id}>
            {story.title}
          </option>
        ))}
      </select>

      <select
        name="priority"
        value={form.priority}
        onChange={handleChange}
        className="w-full border border-gray-300 rounded p-2"
      >
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>

      <select
        name="status"
        value={form.status}
        onChange={handleChange}
        className="w-full border border-gray-300 rounded p-2"
      >
        <option value="todo">To Do</option>
        <option value="in_progress">In Progress</option>
        <option value="in_review">In Review</option>
        <option value="done">Done</option>
      </select>

      <select
        name="assigned_to"
        value={form.assigned_to}
        onChange={handleChange}
        className="w-full border border-gray-300 rounded p-2"
      >
        <option value="">Unassigned</option>
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.username}
          </option>
        ))}
      </select>

      <input
        name="due_date"
        type="date"
        value={form.due_date}
        onChange={handleChange}
        className="w-full border border-gray-300 rounded p-2"
      />

      <input
        name="estimated_hours"
        type="number"
        value={form.estimated_hours}
        onChange={handleChange}
        placeholder="Estimated Hours"
        className="w-full border border-gray-300 rounded p-2"
      />

      <input
        name="story_points"
        type="number"
        value={form.story_points}
        onChange={handleChange}
        placeholder="Story Points"
        className="w-full border border-gray-300 rounded p-2"
      />

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Create Task
      </button>
    </form>
  )
}

export default TaskForm
