'use client'

import React from 'react'
import { useAuth } from '../contexts/AuthContext'

interface UserProfileProps {
  onLogin: () => void
}

export function UserProfile({ onLogin }: UserProfileProps) {
  const { user, loading, logout } = useAuth()

  if (loading) {
    return (
      <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-500" />
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Guest Player</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
          Sign in to save your scores and compete on the leaderboard!
        </p>
        <button
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded"
          onClick={onLogin}
        >
          Sign In / Register
        </button>
      </div>
    )
  }

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="flex items-center mb-4">
        <div className="bg-indigo-100 dark:bg-indigo-800 p-3 rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-indigo-600 dark:text-indigo-200"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>
        <div className="ml-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{user.username}</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm">{user.email}</p>
        </div>
      </div>

      <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg mb-4">
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Your Highest Score</p>
          <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
            {user.highestScore || 0}
          </p>
        </div>
      </div>

      <button
        className="w-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold py-2 px-4 rounded"
        onClick={logout}
      >
        Sign Out
      </button>
    </div>
  )
}
