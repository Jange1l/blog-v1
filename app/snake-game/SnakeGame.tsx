'use client'

import { useRef, useState, useCallback, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars, Text, Center } from '@react-three/drei'
import { Vector3 } from 'three'
import { COLORS } from './utils'
import { GameController } from './components/GameController'

// Main game component
export default function SnakeGame() {
  // Use any for OrbitControls ref due to typing complexity
  const orbitControlsRef = useRef(null)
  const [gameStarted, setGameStarted] = useState(false)
  const [isFullScreen, setIsFullScreen] = useState(false)
  const gameContainerRef = useRef<HTMLDivElement>(null)

  // Toggle fullscreen
  const toggleFullScreen = useCallback(() => {
    if (!document.fullscreenElement) {
      // Enter fullscreen
      gameContainerRef.current
        ?.requestFullscreen()
        .then(() => setIsFullScreen(true))
        .catch((err) => console.error(`Error attempting to enable fullscreen: ${err.message}`))
    } else {
      // Exit fullscreen
      document
        .exitFullscreen()
        .then(() => setIsFullScreen(false))
        .catch((err) => console.error(`Error attempting to exit fullscreen: ${err.message}`))
    }
  }, [])

  // Listen for fullscreen change events (for when user presses Esc to exit)
  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullScreenChange)
    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange)
    }
  }, [])

  // Reset camera to default position
  const resetCamera = () => {
    if (orbitControlsRef.current) {
      // @ts-ignore (TypeScript doesn't know about the target property)
      orbitControlsRef.current.target.set(0, 0, 0)
      // @ts-ignore
      orbitControlsRef.current.object.position.set(28, 28, 28)
      // @ts-ignore
      orbitControlsRef.current.update()
    }
  }

  if (!gameStarted) {
    return (
      <div className="relative h-full w-full">
        {/* 3D Preview Canvas */}
        <Canvas camera={{ position: [10, 10, 10], fov: 40 }}>
          <color attach="background" args={[COLORS.background]} />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={0.8} color="#ffffff" />

          {/* Simple grid preview */}
          {[...Array(3)].map((_, i) => (
            <mesh key={`grid-${i}`} position={[0, 0, 0]}>
              <boxGeometry args={[4, 0.05, 4]} />
              <meshStandardMaterial color={COLORS.grid} transparent opacity={0.15} />
            </mesh>
          ))}

          {/* 3D Title */}
          <Center position={[0, 1.5, 0]}>
            <Text
              fontSize={1.2}
              color={COLORS.snakeHead}
              anchorX="center"
              anchorY="middle"
              outlineWidth={0.05}
              outlineColor="#000"
            >
              3D SNAKE
            </Text>
          </Center>

          {/* Background star effect */}
          <Stars radius={50} depth={50} count={1000} factor={4} saturation={0.5} fade />

          {/* Allow camera control in the preview */}
          <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
        </Canvas>

        {/* UI Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
          <div className="bg-gray-900 bg-opacity-80 p-8 rounded-xl backdrop-blur-sm max-w-lg w-full shadow-2xl border border-indigo-500/30">
            <h2 className="text-4xl font-bold mb-6 text-gradient bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
              3D Snake Game
            </h2>
            <p className="mb-6 text-lg text-gray-200">
              Navigate in 3D space, collect gems, and avoid hitting yourself or the boundaries.
            </p>

            {/* Key Controls Summary */}
            <div className="mb-6 grid grid-cols-2 gap-3 text-gray-300 text-sm">
              <div>
                <span className="inline-block bg-gray-800 px-2 py-1 rounded mr-2 font-mono">
                  Arrows/WASD
                </span>
                <span>2D Movement</span>
              </div>
              <div>
                <span className="inline-block bg-gray-800 px-2 py-1 rounded mr-2 font-mono">
                  Q/E
                </span>
                <span>Z-axis Movement (Q:Out, E:In)</span>
              </div>
              <div>
                <span className="inline-block bg-gray-800 px-2 py-1 rounded mr-2 font-mono">
                  F/G
                </span>
                <span>Toggle Visual Guides</span>
              </div>
              <div>
                <span className="inline-block bg-gray-800 px-2 py-1 rounded mr-2 font-mono">P</span>
                <span>Pause Game</span>
              </div>
            </div>

            <button
              onClick={() => setGameStarted(true)}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-xl font-medium transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 text-white"
            >
              Start Game
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div ref={gameContainerRef} className="relative h-full w-full">
      <Canvas camera={{ position: [30, 30, 30], fov: 35 }}>
        {/* Environment setup for better lighting and atmosphere */}
        <color attach="background" args={[COLORS.background]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={0.8} color="#ffffff" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#d1c4e9" />
        <pointLight position={[0, 0, 10]} intensity={0.3} color="#a5f3fc" />
        <pointLight position={[0, 20, 0]} intensity={0.4} color="#ffffff" />

        {/* Reduced fog for better visibility from a distance */}
        <fog attach="fog" args={[COLORS.background, 30, 60]} />

        {/* Star field background */}
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

        {/* Camera controls for 3D exploration */}
        <OrbitControls
          ref={orbitControlsRef}
          enableZoom={true}
          enablePan={false}
          minDistance={15}
          maxDistance={60}
          autoRotate={false}
          enableDamping={true}
          dampingFactor={0.05}
          makeDefault
        />

        <GameController orbitControlsRef={orbitControlsRef} />
      </Canvas>

      {/* Camera position reset button */}
      <button
        onClick={resetCamera}
        className="absolute bottom-4 left-4 z-10 p-2 bg-gray-800 text-white rounded-full hover:bg-gray-700 transition-colors"
        title="Reset Camera View"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
          />
        </svg>
      </button>

      {/* Fullscreen toggle button */}
      <button
        onClick={toggleFullScreen}
        className="absolute bottom-4 right-4 z-10 p-2 bg-gray-800 text-white rounded-full hover:bg-gray-700 transition-colors"
        title={isFullScreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
      >
        {isFullScreen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5"
            />
          </svg>
        )}
      </button>
    </div>
  )
}
