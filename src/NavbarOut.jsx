import React, { useState } from "react";
import { NavLink } from "react-router-dom";

function NavbarOut() {
    const [dropdownSmOpen, setDropdownSmOpen] = useState(false);
    const [dropdownLgOpen, setDropdownLgOpen] = useState(false);

    return (
        <nav className="bg-gray-900 text-white px-4 py-3 flex items-center justify-between">
            <NavLink className="text-xl font-bold" to="/">Lorem Ipsum</NavLink>

            {/* Small screen user icon dropdown */}
            <div className="lg:hidden relative">
                <button
                    className="focus:outline-none"
                    onClick={() => setDropdownSmOpen(!dropdownSmOpen)}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor"
                         className="text-white" viewBox="0 0 16 16">
                        <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
                        <path fillRule="evenodd"
                              d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 
                              11.37C3.242 11.226 4.805 10 8 10s4.757 
                              1.225 5.468 2.37A7 7 0 0 0 8 1"/>
                    </svg>
                </button>
                {dropdownSmOpen && (
                    <ul className="absolute right-0 mt-2 w-40 bg-gray-800 border border-gray-700 rounded shadow-lg z-50">
                        <li>
                            <NavLink className="block px-4 py-2 hover:bg-gray-700" to="/login" onClick={() => setDropdownSmOpen(false)}>Login</NavLink>
                        </li>
                        <li>
                            <NavLink className="block px-4 py-2 hover:bg-gray-700" to="/signup" onClick={() => setDropdownSmOpen(false)}>Sign Up</NavLink>
                        </li>
                    </ul>
                )}
            </div>

            {/* Large screen user icon dropdown */}
            <div className="hidden lg:flex relative">
                <button
                    className="focus:outline-none"
                    onClick={() => setDropdownLgOpen(!dropdownLgOpen)}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor"
                         className="text-white" viewBox="0 0 16 16">
                        <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
                        <path fillRule="evenodd"
                              d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 
                              11.37C3.242 11.226 4.805 10 8 10s4.757 
                              1.225 5.468 2.37A7 7 0 0 0 8 1"/>
                    </svg>
                </button>
                {dropdownLgOpen && (
                    <ul className="absolute right-0 mt-2 w-40 bg-gray-800 border border-gray-700 rounded shadow-lg z-50">
                        <li>
                            <NavLink className="block px-4 py-2 hover:bg-gray-700" to="/login" onClick={() => setDropdownLgOpen(false)}>Login</NavLink>
                        </li>
                        <li>
                            <NavLink className="block px-4 py-2 hover:bg-gray-700" to="/signup" onClick={() => setDropdownLgOpen(false)}>Sign Up</NavLink>
                        </li>
                    </ul>
                )}
            </div>
        </nav>
    );
}

export default NavbarOut;
