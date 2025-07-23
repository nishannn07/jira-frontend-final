"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

const StoryList = () => {
  const token = sessionStorage.getItem("token")
  const p_id = sessionStorage.getItem("p_id")
  const [stories, setStories] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    if (p_id) {
      axios
        .get(`${import.meta.env.VITE_URL}/api/stories/project/${p_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setStories(res.data))
        .catch((err) => {
          console.error("Story fetch error:", err.response?.data || err.message)
        })
    }
  }, [p_id, token])

  const handleStoryClick = (storyId) => {
    navigate(`/story/${storyId}`)
  }

  return (
    <div className="p-4 max-w-4xl mx-auto bg-base shadow-2xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Stories</h2>
        <button
          onClick={() => navigate("/storyform")}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Create Story
        </button>
      </div>

      <div className="grid gap-4">
        {stories.length ? (
          stories.map((story) => (
            <div
              key={story.id}
              className=" p-4 rounded shadow border border-gray-600 cursor-pointer hover:bg-base-300"
              onClick={() => handleStoryClick(story.id)}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-green-400">{story.title}</h3>
                  <p className="text-gray-400 mt-1">{story.description}</p>
                  <p className="text-blue-400 text-sm mt-1">Epic: {story.epic_title}</p>
                  <div className="flex gap-4 mt-2 text-sm">
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
                    {story.story_points && <span className="bg-green-400 px-2 py-1 rounded">{story.story_points} points</span>}
                    <span className="bg-pink-500 px-2 py-1 rounded">{story.tasks_count} tasks</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400">No stories found. Create your first story!</p>
        )}
      </div>
    </div>
  )
}

export default StoryList
