'use client'

import { useState } from 'react'
import Link from '@/components/Link'
import PageTitle from '@/components/PageTitle'
import dynamic from 'next/dynamic'
import { AuthProvider } from './contexts/AuthContext'
import { AuthModal } from './components/AuthModal'
import { UserProfile } from './components/UserProfile'
import { Leaderboard } from './components/Leaderboard'

// Use dynamic import with no SSR for the 3D component
const SnakeGame = dynamic(() => import('./SnakeGame'), { ssr: false })

export default function SnakeGamePage() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

  const openAuthModal = () => setIsAuthModalOpen(true)
  const closeAuthModal = () => setIsAuthModalOpen(false)

  return (
    <AuthProvider>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className=" pb-2 ">
          <PageTitle>3D Snake Game</PageTitle>
          <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
            Play a fully 3D Snake game built with React Three Fiber and Three.js
          </p>
        </div>

        <div className="w-full py-2 px-0">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Left column for profile and leaderboard on larger screens */}
            <div className="md:w-72 lg:w-80 space-y-4 order-2 md:order-1">
              <UserProfile onLogin={openAuthModal} />
              <Leaderboard />
            </div>

            {/* Main game container - using as much space as possible */}
            <div className="flex-1 h-[70vh] rounded-xl overflow-hidden border-2 border-indigo-500/30 dark:border-indigo-500/20 shadow-lg order-1 md:order-2">
              <SnakeGame />
            </div>
          </div>

          <div className="mt-4 text-center space-y-2">
            {/* Game controls section - collapsible */}
            <details className="mx-auto w-1/2 max-w-none">
              <summary className="cursor-pointer p-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-xl font-bold text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                Game Controls
              </summary>
              <div className="bg-gray-100 dark:bg-gray-800 rounded-b-lg p-4 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="text-left">
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                      Movement:
                    </h4>
                    <ul className="list-disc pl-5 text-gray-600 dark:text-gray-400 space-y-1">
                      <li>
                        <span className="font-mono bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded">
                          Arrow keys
                        </span>{' '}
                        or{' '}
                        <span className="font-mono bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded">
                          W/A/S/D
                        </span>{' '}
                        - 2D plane movement
                      </li>
                      <li>
                        <span className="font-mono bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded">
                          Q
                        </span>{' '}
                        - Move forward (into screen) in 3D space
                      </li>
                      <li>
                        <span className="font-mono bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded">
                          E
                        </span>{' '}
                        - Move backward (out of screen) in 3D space
                      </li>
                    </ul>
                  </div>
                  <div className="text-left">
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                      Game Controls:
                    </h4>
                    <ul className="list-disc pl-5 text-gray-600 dark:text-gray-400 space-y-1">
                      <li>
                        <span className="font-mono bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded">
                          Tab
                        </span>{' '}
                        - Open Settings menu
                      </li>
                      <li>
                        <span className="font-mono bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded">
                          P
                        </span>{' '}
                        - Pause/Resume game
                      </li>
                      <li>
                        <span className="font-mono bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded">
                          R
                        </span>{' '}
                        - Restart game after Game Over
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="text-left">
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                      Settings Controls:
                    </h4>
                    <ul className="list-disc pl-5 text-gray-600 dark:text-gray-400 space-y-1">
                      <li>
                        <span className="font-mono bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded">
                          [ / ]
                        </span>{' '}
                        - Decrease/Increase grid size
                      </li>
                      <li>
                        <span className="font-mono bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded">
                          - / =
                        </span>{' '}
                        - Decrease/Increase game speed
                      </li>
                      <li>
                        <span className="font-mono bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded">
                          ESC
                        </span>{' '}
                        - Close settings menu
                      </li>
                    </ul>
                  </div>
                  <div className="text-left">
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                      Camera & Visuals:
                    </h4>
                    <ul className="list-disc pl-5 text-gray-600 dark:text-gray-400 space-y-1">
                      <li>
                        <span className="font-mono bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded">
                          F
                        </span>{' '}
                        - Toggle path visualization
                      </li>
                      <li>
                        <span className="font-mono bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded">
                          G
                        </span>{' '}
                        - Toggle grid guidelines
                      </li>
                      <li>
                        Use <span className="font-semibold">mouse drag</span> to rotate camera view
                      </li>
                      <li>
                        Use <span className="font-semibold">scroll wheel</span> to zoom in/out
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </details>
          </div>
        </div>
      </div>

      {/* Authentication Modal */}
      <AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} />
    </AuthProvider>
  )
}
