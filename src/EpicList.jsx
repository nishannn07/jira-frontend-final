"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

const EpicList = () => {
  const token = sessionStorage.getItem("token")
  const p_id = sessionStorage.getItem("p_id")
  const [epics, setEpics] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    if (p_id) {
      axios
        .get(`${import.meta.env.VITE_URL}/api/epics/project/${p_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setEpics(res.data))
        .catch((err) => {
          console.error("Epic fetch error:", err.response?.data || err.message)
        })
    }
  }, [p_id, token])

  const handleEpicClick = (epicId) => {
    navigate(`/epic/${epicId}`)
  }

  return (
    <div className="p-4 max-w-4xl mx-auto bg-base-300">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Epics</h2>
        <button
          onClick={() => navigate("/epicform")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create Epic
        </button>
      </div>

      <div className="grid gap-4">
        {epics.length ? (
          epics.map((epic) => (
            <div
              key={epic.id}
              className="bg-base-200 p-4 rounded shadow border border-gray-600 cursor-pointer hover:bg-base-300"
              onClick={() => handleEpicClick(epic.id)}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-blue-400">{epic.title}</h3>
                  <p className="text-gray-400 mt-1">{epic.description}</p>
                  <div className="flex gap-4 mt-2 text-sm">
                    <span
                      className={`px-2 py-1 rounded ${
                        epic.status === "open"
                          ? "bg-yellow-600"
                          : epic.status === "in_progress"
                            ? "bg-blue-600"
                            : "bg-green-600"
                      }`}
                    >
                      {epic.status.replace("_", " ").toUpperCase()}
                    </span>
                    <span
                      className={`px-2 py-1 rounded ${
                        epic.priority === "high"
                          ? "bg-red-600"
                          : epic.priority === "medium"
                            ? "bg-orange-600"
                            : "bg-gray-600"
                      }`}
                    >
                      {epic.priority.toUpperCase()}
                    </span>
                    <span className="text-black bg-green-400 px-2 py-1 rounded">{epic.stories_count} stories</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400">No epics found. Create your first epic!</p>
        )}
      </div>
    </div>
  )
}

export default EpicList
