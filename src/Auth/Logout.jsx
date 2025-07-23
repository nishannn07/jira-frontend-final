// Main/jiraboard_frontend-dev/src/Auth/Logout.jsx
import React from 'react'
import { useNavigate } from "react-router-dom" // Import useNavigate

function Logout({ setAuth }) { // Accept setAuth as prop to update global auth state
    const navigate = useNavigate();

    const handleLogout = () => { // Renamed to avoid confusion with the component name
        sessionStorage.clear(); // Clear session storage
        setAuth(false); // Update authentication state
        navigate("/"); // Redirect to home page
    }

    return (
        <div className="flex justify-center items-center min-h-screen">
            <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 text-xl"
            >
                Logout
            </button>
        </div>
    )
}

export default Logout
