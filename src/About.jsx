import React from 'react'
import { useNavigate } from 'react-router-dom'
function About() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-yellow-50 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-2xl w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">About This Project</h1>
        <p className="text-gray-600 text-lg mb-4">
          This task management platform helps users collaborate on projects efficiently. It supports features like project creation, task assignment, team management, commenting, activity logging, time tracking, and role-based access control.
        </p>
        <p className="text-gray-600 text-lg mb-4">
          Built using:
        </p>
        <ul className="list-disc pl-6 text-gray-600 text-lg space-y-2">
          <li><strong>Frontend:</strong> React.js + Tailwind CSS</li>
          <li><strong>Backend:</strong> Flask (Python) + SQLAlchemy</li>
          <li><strong>Auth:</strong> JWT-based Authentication</li>
          <li><strong>Database:</strong> PostgreSQL / SQLite (dev)</li>
        </ul>
        <p className="text-gray-600 text-lg mt-6">
          Developed with 😒 by team [Lorem Ipsum].
        </p>
        <div className='flex justify-center m-5 gap-3'>
          <button className='btn hover:bg-blue-900' onClick={() => navigate('/login')}>Login</button>
          <button className="btn hover:bg-blue-900" onClick={() => navigate('/signup')}>SignUp</button>
        </div>
      </div>
    </div>
  )
}

export default About
