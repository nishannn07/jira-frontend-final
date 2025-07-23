"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import { toast } from "react-hot-toast"

const EpicDetails = () => {
  const { epicId } = useParams()
  const navigate = useNavigate()
  const token = sessionStorage.getItem("token")

  const [epic, setEpic] = useState(null)
  const [stories, setStories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEpicDetails = async () => {
      try {
        // Fetch epic details
        const epicRes = await axios.get(`${import.meta.env.VITE_URL}/api/epics/${epicId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setEpic(epicRes.data)

        // Fetch stories for this epic
        const storiesRes = await axios.get(`${import.meta.env.VITE_URL}/api/stories/epic/${epicId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setStories(storiesRes.data)
      } catch (err) {
        toast.error("Error fetching epic details")
        console.error("Epic details error:", err.response?.data || err.message)
      } finally {
        setLoading(false)
      }
    }

    if (epicId) {
      fetchEpicDetails()
    }
  }, [epicId, token])

  const handleStoryClick = (storyId) => {
    navigate(`/story/${storyId}`)
  }

  const handleCreateStory = () => {
    // Set the epic context and navigate to story form
    sessionStorage.setItem("selected_epic_id", epicId)
    navigate("/storyform")
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    )
  }

  if (!epic) {
    return (
      <div className="text-center mt-10">
        <p className="text-red-500">Epic not found</p>
        <button
          onClick={() => navigate("/epics")}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Back to Epics
        </button>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-6xl mx-auto min-h-screen border shadow-2xl">
      {/* Epic Header */}
      <div className="mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-blue-400 mb-2">{epic.title}</h1>
            <p className="text-gray-400 mb-4">{epic.description}</p>
          </div>
          <button
            onClick={() => navigate("/epics")}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Back to Epics
          </button>
        </div>

        {/* Epic Status and Priority */}
        <div className="flex gap-4 mb-4">
          <span
            className={`px-3 py-1 rounded text-sm font-medium ${
              epic.status === "open" ? "bg-yellow-600" : epic.status === "in_progress" ? "bg-blue-600" : "bg-green-600"
            }`}
          >
            {epic.status.replace("_", " ").toUpperCase()}
          </span>
          <span
            className={`px-3 py-1 rounded text-sm font-medium ${
              epic.priority === "high" ? "bg-red-600" : epic.priority === "medium" ? "bg-orange-600" : "bg-gray-600"
            }`}
          >
            {epic.priority.toUpperCase()} PRIORITY
          </span>
        </div>

        {/* Epic Dates */}
        <div className="flex gap-6 text-sm text-gray-400">
          {epic.start_date && <span>Start: {epic.start_date}</span>}
          {epic.end_date && <span>End: {epic.end_date}</span>}
        </div>
      </div>

      {/* Stories Section */}
      <div className="bg-base-300 border  rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Stories ({stories.length})</h2>
          <button onClick={handleCreateStory} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Add Story
          </button>
        </div>

        {stories.length > 0 ? (
          <div className="grid gap-4">
            {stories.map((story) => (
              <div
                key={story.id}
                className="bg-base-100 p-4 rounded cursor-pointer hover:bg-base-300 transition-colors"
                onClick={() => handleStoryClick(story.id)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-green-400 mb-2">{story.title}</h3>
                    <p className="text-gray-300 mb-3">{story.description}</p>

                    <div className="flex gap-3 text-sm">
                      <span
                        className={`px-2 py-1 rounded ${
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
                        className={`px-2 py-1 rounded ${
                          story.priority === "high"
                            ? "bg-red-600"
                            : story.priority === "medium"
                              ? "bg-orange-600"
                              : "bg-gray-600"
                        }`}
                      >
                        {story.priority.toUpperCase()}
                      </span>
                      {story.story_points && <span className="text-gray-400">{story.story_points} points</span>}
                      <span className="text-gray-400">{story.tasks_count} tasks</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-400 mb-4">No stories in this epic yet</p>
            <button
              onClick={handleCreateStory}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
            >
              Create First Story
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default EpicDetails
