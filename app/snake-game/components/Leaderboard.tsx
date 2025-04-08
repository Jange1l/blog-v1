'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'

interface LeaderboardEntry {
  rank: number
  username: string
  score: number
}

export function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { user } = useAuth()

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch('/api/scores/leaderboard', {
          cache: 'no-store',
          headers: {
            Pragma: 'no-cache',
            'Cache-Control': 'no-cache',
          },
        })
        console.log('Response: ', response)
        if (!response.ok) {
          throw new Error('Failed to fetch leaderboard')
        }

        const data = await response.json()
        setLeaderboard(data.leaderboard || [])
      } catch (error) {
        console.error('Error fetching leaderboard:', error)
        setError('Failed to load leaderboard data')
      } finally {
        setLoading(false)
      }
    }

    fetchLeaderboard()

    // Set up polling to refresh the leaderboard every minute
    const intervalId = setInterval(fetchLeaderboard, 60000)

    return () => {
      clearInterval(intervalId)
    }
  }, [])

  if (loading) {
    return (
      <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
        <h3 className="text-xl font-bold text-center text-gray-800 dark:text-white mb-4">
          Leaderboard
        </h3>
        <div className="flex justify-center items-center h-24">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
        <h3 className="text-xl font-bold text-center text-gray-800 dark:text-white mb-4">
          Leaderboard
        </h3>
        <div className="bg-red-100 dark:bg-red-900 p-3 rounded">
          <p className="text-red-800 dark:text-red-200 text-center">{error}</p>
        </div>
      </div>
    )
  }

  const currentUserRanking = leaderboard.find((entry) => user && entry.username === user.username)

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h3 className="text-xl font-bold text-center text-gray-800 dark:text-white mb-4">
        Leaderboard
      </h3>

      {leaderboard.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400">
          No scores yet. Be the first to play!
        </p>
      ) : (
        <>
          <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Player
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Score
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {leaderboard.map((entry) => (
                  <tr
                    key={entry.rank}
                    className={
                      user && entry.username === user.username
                        ? 'bg-indigo-50 dark:bg-indigo-900'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                    }
                  >
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {entry.rank <= 3 ? (
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-yellow-100 dark:bg-yellow-900">
                            {entry.rank}
                          </span>
                        ) : (
                          entry.rank
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {entry.username}
                        {user && entry.username === user.username && (
                          <span className="ml-2 text-xs text-indigo-600 dark:text-indigo-400">
                            (You)
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right">
                      <div className="text-sm font-bold text-gray-900 dark:text-gray-100">
                        {entry.score}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {user && !currentUserRanking && user.highestScore > 0 && (
            <div className="mt-4 p-3 border border-indigo-200 dark:border-indigo-800 rounded-lg bg-indigo-50 dark:bg-indigo-900">
              <p className="text-sm text-center text-indigo-800 dark:text-indigo-200">
                Your best score: <span className="font-bold">{user.highestScore}</span>
              </p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
