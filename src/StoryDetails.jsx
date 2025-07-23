"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import { toast } from "react-hot-toast"

const StoryDetails = () => {
  const { storyId } = useParams()
  const navigate = useNavigate()
  const token = sessionStorage.getItem("token")

  const [story, setStory] = useState(null)
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStoryDetails = async () => {
      try {
        // Fetch story details
        const storyRes = await axios.get(`${import.meta.env.VITE_URL}/api/stories/${storyId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setStory(storyRes.data)

        // Fetch tasks for this story
        const tasksRes = await axios.get(`${import.meta.env.VITE_URL}/api/tasks/story/${storyId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setTasks(tasksRes.data)
      } catch (err) {
        toast.error("Error fetching story details")
        console.error("Story details error:", err.response?.data || err.message)
      } finally {
        setLoading(false)
      }
    }

    if (storyId) {
      fetchStoryDetails()
    }
  }, [storyId, token])

  const handleTaskClick = (taskId) => {
    navigate(`/task/${taskId}`)
  }

  const handleCreateTask = () => {
    // Set the story context and navigate to task form
    sessionStorage.setItem("selected_story_id", storyId)
    navigate("/taskform")
  }

  const handleEpicClick = () => {
    if (story?.epic_id) {
      navigate(`/epic/${story.epic_id}`)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    )
  }

  if (!story) {
    return (
      <div className="text-center mt-10">
        <p className="text-red-500">Story not found</p>
        <button
          onClick={() => navigate("/stories")}
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Back to Stories
        </button>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-6xl mx-auto bg-base-200 min-h-screen">
      {/* Story Header */}
      <div className="mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-green-400 mb-2">{story.title}</h1>
            <p className="text-gray-300 mb-4">{story.description}</p>
          </div>
          <button
            onClick={() => navigate("/stories")}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Back to Stories
          </button>
        </div>

        {/* Epic Link */}
        {story.epic_title && (
          <div className="mb-4">
            <span className="text-gray-400">Epic: </span>
            <button onClick={handleEpicClick} className="text-blue-400 hover:text-blue-300 underline">
              {story.epic_title}
            </button>
          </div>
        )}

        {/* Story Status and Priority */}
        <div className="flex gap-4 mb-4">
          <span
            className={`px-3 py-1 rounded text-sm font-medium ${
              story.status === "todo"
                ? "bg-gray-400"
                : story.status === "in_progress"
                  ? "bg-blue-600"
                  : story.status === "in_review"
                    ? "bg-yellow-600"
                    : "bg-green-600"
            }`}
          >
            {story.status.replace("_", " ").toUpperCase()}
          </span>
          <span
            className={`px-3 py-1 rounded text-sm font-medium ${
              story.priority === "high" ? "bg-red-600" : story.priority === "medium" ? "bg-orange-600" : "bg-gray-600"
            }`}
          >
            {story.priority.toUpperCase()} PRIORITY
          </span>
          {story.story_points && (
            <span className="px-3 py-1 rounded text-sm font-medium bg-purple-600">{story.story_points} POINTS</span>
          )}
        </div>
      </div>

      {/* Tasks Section */}
      <div className="bg-base-300 border-2 rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Tasks ({tasks.length})</h2>
          <button onClick={handleCreateTask} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Add Task
          </button>
        </div>

        {tasks.length > 0 ? (
          <div className="grid gap-4">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="bg-base-100 p-4 rounded cursor-pointer hover:bg-base-300 transition-colors"
                onClick={() => handleTaskClick(task.id)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">{task.title}</h3>
                    <p className="text-gray-500 mb-3">{task.description}</p>

                    <div className="flex gap-3 text-sm">
                      <span
                        className={`px-2 py-1 rounded ${
                          task.status === "todo"
                            ? "bg-gray-400"
                            : task.status === "in_progress"
                              ? "bg-blue-600"
                              : task.status === "in_review"
                                ? "bg-yellow-600"
                                : "bg-green-600"
                        }`}
                      >
                        {task.status.replace("_", " ").toUpperCase()}
                      </span>
                      <span
                        className={`px-2 py-1 rounded ${
                          task.priority === "high"
                            ? "bg-red-600"
                            : task.priority === "medium"
                              ? "bg-orange-600"
                              : "bg-pink-400"
                        }`}
                      >
                        {task.priority.toUpperCase()}
                      </span>
                      <span className="px-2 py-1 rounded bg-indigo-400">
                        {task.work_type.replace("_", " ").toUpperCase()}
                      </span>
                      {task.due_date && <span className="text-gray-400">Due: {task.due_date}</span>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-400 mb-4">No tasks in this story yet</p>
            <button onClick={handleCreateTask} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
              Create First Task
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default StoryDetails
