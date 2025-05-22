"use client"

import type React from "react"

import { useState } from "react"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Sidebar */}
      <aside className={`bg-gray-800 text-white w-64 min-h-screen ${isSidebarOpen ? "block" : "hidden"} md:block`}>
        <div className="p-4">
          <h2 className="text-2xl font-semibold">Admin Panel</h2>
        </div>
        <nav>
          <ul className="p-4">
            <li className="py-2">
              <a href="#" className="hover:text-gray-300">
                Dashboard
              </a>
            </li>
            <li className="py-2">
              <a href="#" className="hover:text-gray-300">
                Users
              </a>
            </li>
            <li className="py-2">
              <a href="#" className="hover:text-gray-300">
                Products
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4">
        {/* Mobile Sidebar Toggle Button */}
        <button
          onClick={toggleSidebar}
          className="md:hidden bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
        >
          {isSidebarOpen ? "Close Menu" : "Open Menu"}
        </button>
        {children}
      </main>
    </div>
  )
}
