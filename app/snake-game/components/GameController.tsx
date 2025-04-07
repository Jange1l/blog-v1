import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, OrbitControls } from '@react-three/drei'
import { Vector3 } from 'three'
import {
  INITIAL_SNAKE,
  INITIAL_DIRECTION,
  INITIAL_GRID_SIZE,
  INITIAL_GAME_SPEED,
  MIN_GRID_SIZE,
  MAX_GRID_SIZE,
  DIRECTIONS,
  generateFood,
  vectorsEqual,
  COLORS,
} from '../utils'
import { Snake } from './Snake'
import { Food } from './Food'
import { Grid3D } from './Grid3D'
import { DirectionIndicator, PathPredictor, PathGuidelines } from './Indicators'
import { SettingsUI } from './SettingsUI'
import { EnhancedScene } from './EnhancedScene'
import { useAuth } from '../contexts/AuthContext'

interface GameControllerProps {
  orbitControlsRef: React.RefObject<typeof OrbitControls>
}

export function GameController({ orbitControlsRef }: GameControllerProps) {
  const [snake, setSnake] = useState<Vector3[]>(INITIAL_SNAKE)
  const [direction, setDirection] = useState<Vector3>(INITIAL_DIRECTION)
  const [gridSize, setGridSize] = useState<number>(INITIAL_GRID_SIZE)
  const [gameSpeed, setGameSpeed] = useState<number>(INITIAL_GAME_SPEED)

  // Initialize food with a fixed position that won't change unless explicitly set
  const initialFood = useMemo(() => generateFood(INITIAL_SNAKE, INITIAL_GRID_SIZE), [])
  const [food, setFood] = useState<Vector3>(initialFood)

  // We'll manage food generation directly in the game loop without additional state
  const foodProcessedRef = useRef<boolean>(false)

  // Keep a ref to the current food to avoid closure issues
  const foodRef = useRef<Vector3>(food)
  useEffect(() => {
    foodRef.current = food
  }, [food])

  const [gameOver, setGameOver] = useState<boolean>(false)
  const [score, setScore] = useState<number>(0)
  const [isPaused, setIsPaused] = useState<boolean>(false)
  const [showSettings, setShowSettings] = useState<boolean>(false)
  const [showPathPredictor, setShowPathPredictor] = useState<boolean>(true)
  const [showPathGuidelines, setShowPathGuidelines] = useState<boolean>(true)

  const lastUpdateTime = useRef<number>(0)
  const lastDirection = useRef<Vector3>(direction)

  const { user, updateScore } = useAuth()
  const [isNewHighScore, setIsNewHighScore] = useState(false)

  // Check if a move would cause collision with snake or boundaries
  const checkCollision = useCallback(
    (nextHead: Vector3): boolean => {
      // Check boundary collision
      const halfGrid = gridSize / 2
      if (
        Math.abs(nextHead.x) > halfGrid ||
        Math.abs(nextHead.y) > halfGrid ||
        Math.abs(nextHead.z) > halfGrid
      ) {
        return true
      }

      // Check self collision - excluding the tail which will move
      return snake.slice(0, -1).some((segment) => vectorsEqual(segment, nextHead))
    },
    [snake, gridSize]
  )

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Common key handling (regardless of game state)

      // Toggle path predictor with F key
      if (e.key === 'f' || e.key === 'F') {
        setShowPathPredictor(!showPathPredictor)
        return
      }

      // Toggle path guidelines with G key
      if (e.key === 'g' || e.key === 'G') {
        setShowPathGuidelines(!showPathGuidelines)
        return
      }

      // Game state checks - don't process movement if paused, in settings, or game over
      if (isPaused || showSettings || gameOver) {
        // Settings/pause/game over controls
        if (e.key === 'Tab') {
          e.preventDefault() // Prevent focus change
          setShowSettings(!showSettings)
          if (!isPaused && !gameOver) {
            setIsPaused(true)
          }
          return
        }

        // Settings-specific controls
        if (showSettings) {
          if (e.key === 'Escape') {
            setShowSettings(false)
            return
          }

          // Grid size controls
          if (e.key === '[' && gridSize > MIN_GRID_SIZE) {
            setGridSize(gridSize - 1)
            return
          }
          if (e.key === ']' && gridSize < MAX_GRID_SIZE) {
            setGridSize(gridSize + 1)
            return
          }

          // Speed controls
          if (e.key === '-' && gameSpeed > 1) {
            setGameSpeed(Math.max(1, gameSpeed - 0.5))
            return
          }
          if (e.key === '=' && gameSpeed < 6) {
            setGameSpeed(Math.min(6, gameSpeed + 0.5))
            return
          }

          return // No further processing while in settings
        }

        // Pause/Unpause with P key
        if (e.key === 'p' || e.key === 'P') {
          if (!gameOver) {
            setIsPaused(!isPaused)
          }
          return
        }

        // Restart game with R key if game over
        if ((e.key === 'r' || e.key === 'R') && gameOver) {
          handleRestart()
          return
        }

        return // No further processing while paused or game over
      }

      // Normal movement controls when game is active
      const key = e.key.toLowerCase() // Case-insensitive key handling

      if (DIRECTIONS[key]) {
        const newDirection = DIRECTIONS[key]

        // Prevent 180-degree turns (don't allow reversing direction)
        if (!vectorsEqual(newDirection, lastDirection.current.clone().multiplyScalar(-1))) {
          setDirection(newDirection)
        }
      }

      // Pause with P key
      if (e.key === 'p' || e.key === 'P') {
        setIsPaused(true)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isPaused, gameOver, showSettings, gridSize, gameSpeed, showPathPredictor, showPathGuidelines])

  // Game loop
  useFrame(({ clock }) => {
    if (gameOver || isPaused || showSettings) return

    const currentTime = clock.getElapsedTime()
    if (currentTime - lastUpdateTime.current < 1 / gameSpeed) return

    lastUpdateTime.current = currentTime
    lastDirection.current = direction

    // Move snake
    const head = snake[0].clone()
    const newHead = head.add(direction)

    // Check boundaries in 3D
    if (
      Math.abs(newHead.x) > gridSize / 2 ||
      Math.abs(newHead.y) > gridSize / 2 ||
      Math.abs(newHead.z) > gridSize / 2
    ) {
      handleGameOver()
      return
    }

    // Check self-collision
    if (snake.slice(1).some((segment) => vectorsEqual(segment, newHead))) {
      handleGameOver()
      return
    }

    // Update snake
    const newSnake = [newHead]

    // Check if food is eaten - use exact position comparison
    if (vectorsEqual(newHead, food)) {
      // Add all existing segments
      newSnake.push(...snake)
      setScore(score + 10)

      // Mark that we need to generate new food
      foodProcessedRef.current = false

      // Generate new food position with a longer delay to ensure stable rendering
      window.setTimeout(() => {
        if (!foodProcessedRef.current) {
          // Create a new food position that doesn't overlap with the snake
          const newFoodPosition = generateFood(newSnake, gridSize)

          // Set the new food position
          setFood(newFoodPosition)

          // Mark food as processed to prevent multiple generations
          foodProcessedRef.current = true
        }
      }, 300) // Increased delay for more stability
    } else {
      // Add all segments except the last one
      newSnake.push(...snake.slice(0, -1))
    }

    setSnake(newSnake)
  })

  // Game over handler
  const handleGameOver = () => {
    setGameOver(true)

    // Check if we need to update high score
    if (user && updateScore && score > 0) {
      // Handle the Promise properly by using .then()
      updateScore(score)
        .then((result) => {
          setIsNewHighScore(result)
        })
        .catch((err) => {
          console.error('Error updating score:', err)
        })
    }
  }

  // Close settings
  const closeSettings = () => {
    setShowSettings(false)
    if (!gameOver) {
      setIsPaused(false)
    }
  }

  // Restart game
  const handleRestart = () => {
    setSnake(INITIAL_SNAKE)
    setDirection(INITIAL_DIRECTION)
    lastDirection.current = INITIAL_DIRECTION
    setGameOver(false)
    setScore(0)
    setIsNewHighScore(false)
    setFood(generateFood(INITIAL_SNAKE, gridSize))
    foodProcessedRef.current = false
  }

  return (
    <EnhancedScene gridSize={gridSize} gameOver={gameOver}>
      <Snake positions={snake} />
      <Food position={food} />
      <Grid3D gridSize={gridSize} />

      {/* Direction indicator */}
      <DirectionIndicator direction={direction} position={snake[0]} />

      {/* Path guidelines */}
      {showPathGuidelines && !gameOver && !isPaused && (
        <PathGuidelines gridSize={gridSize} currentDirection={direction} snakeHead={snake[0]} />
      )}

      {/* Path predictor */}
      {showPathPredictor && !gameOver && !isPaused && (
        <PathPredictor snakeHead={snake[0]} food={food} />
      )}

      {/* Settings UI */}
      <SettingsUI
        gridSize={gridSize}
        setGridSize={setGridSize}
        gameSpeed={gameSpeed}
        setGameSpeed={setGameSpeed}
        isVisible={showSettings}
      />

      {/* Game UI */}
      {gameOver && !showSettings && (
        <group position={[0, 0, 5]}>
          <Text
            position={[0, 2, 0]}
            color={COLORS.gameOver}
            fontSize={1.5}
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.08}
            outlineColor="#000"
          >
            GAME OVER
          </Text>

          {/* Game stats panel */}
          <mesh position={[0, -0.5, -0.5]} rotation={[0.1, 0, 0]}>
            <planeGeometry args={[8, 5]} />
            <meshBasicMaterial color="#0f172a" opacity={0.85} transparent />
          </mesh>

          {/* Final score with larger display */}
          <Text
            position={[0, 0.8, 0]}
            color={COLORS.text}
            fontSize={0.9}
            anchorX="center"
            anchorY="middle"
          >
            Final Score: {score}
          </Text>

          {/* Snake length stat */}
          <Text
            position={[0, 0, 0]}
            color={COLORS.text}
            fontSize={0.6}
            anchorX="center"
            anchorY="middle"
          >
            Snake Length: {snake.length}
          </Text>

          {/* Game difficulty */}
          <Text
            position={[0, -0.8, 0]}
            color={
              gameSpeed >= 5
                ? COLORS.difficultyHard
                : gameSpeed >= 3.5
                  ? COLORS.difficultyMedium
                  : COLORS.difficultyEasy
            }
            fontSize={0.6}
            anchorX="center"
            anchorY="middle"
          >
            Difficulty: {gameSpeed >= 5 ? 'Hard' : gameSpeed >= 3.5 ? 'Medium' : 'Easy'}
          </Text>

          {/* Restart prompt with pulsating effect */}
          <group position={[0, -2, 0]}>
            <Text
              color="#FFFFFF"
              fontSize={0.7}
              anchorX="center"
              anchorY="middle"
              outlineWidth={0.03}
              outlineColor="#000"
            >
              Press R to restart
            </Text>

            {/* Animated subtle arrow pointing to text */}
            <mesh position={[-3.5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <coneGeometry args={[0.2, 0.5, 8]} />
              <meshBasicMaterial color={COLORS.buttonHighlight} />
            </mesh>

            <mesh position={[3.5, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
              <coneGeometry args={[0.2, 0.5, 8]} />
              <meshBasicMaterial color={COLORS.buttonHighlight} />
            </mesh>
          </group>

          {/* Show high score notification if it's a new high score */}
          {isNewHighScore && (
            <>
              <Text
                position={[0, -3.5, 0]}
                color="#FFD700" // Gold color for high score
                fontSize={0.9}
                anchorX="center"
                anchorY="middle"
                outlineWidth={0.05}
                outlineColor="#000"
              >
                New High Score!
              </Text>

              {/* Crown icon for high score */}
              <mesh position={[0, -3.5, -0.5]} rotation={[0, 0, 0]}>
                <sphereGeometry args={[0.5, 16, 16]} />
                <meshBasicMaterial color="#FFD700" transparent opacity={0.3} />
              </mesh>
            </>
          )}
        </group>
      )}

      {isPaused && !gameOver && !showSettings && (
        <Text
          position={[0, 0, 5]}
          color={COLORS.text}
          fontSize={1.2}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.05}
          outlineColor="#000"
        >
          Paused - Press P to resume
        </Text>
      )}

      {/* Score display */}
      <Text
        position={[0, gridSize / 2 + 1.5, 0]}
        color={COLORS.text}
        fontSize={0.8}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.03}
        outlineColor="#000"
      >
        Score: {score}
      </Text>

      {/* 3D Position Indicator */}
      <Text
        position={[0, gridSize / 2 + 0.7, 0]}
        color={COLORS.text}
        fontSize={0.5}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000"
      >
        Position: x:{snake[0]?.x.toFixed(0)} y:{snake[0]?.y.toFixed(0)} z:{snake[0]?.z.toFixed(0)}
      </Text>

      {/* Difficulty indicator */}
      {(() => {
        let difficultyText = 'Easy'
        let difficultyColor = COLORS.difficultyEasy

        if (gameSpeed >= 5) {
          difficultyText = 'Hard'
          difficultyColor = COLORS.difficultyHard
        } else if (gameSpeed >= 3.5) {
          difficultyText = 'Medium'
          difficultyColor = COLORS.difficultyMedium
        }

        return (
          <Text
            position={[gridSize / 2 + 1, gridSize / 2 + 0.8, 0]}
            color={difficultyColor}
            fontSize={0.5}
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.02}
            outlineColor="#000"
          >
            {difficultyText} (Speed: {gameSpeed.toFixed(1)})
          </Text>
        )
      })()}

      {/* Path indicator toggle */}
      <Text
        position={[-gridSize / 2 - 1, gridSize / 2 + 0.8, 0]}
        color={showPathPredictor ? COLORS.difficultyEasy : COLORS.text}
        fontSize={0.5}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000"
        onClick={() => setShowPathPredictor(!showPathPredictor)}
      >
        [Path: {showPathPredictor ? 'On' : 'Off'}]
      </Text>

      {/* Path guidelines toggle */}
      <Text
        position={[-gridSize / 2 - 1, gridSize / 2 + 0.2, 0]}
        color={showPathGuidelines ? COLORS.difficultyEasy : COLORS.text}
        fontSize={0.5}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000"
        onClick={() => setShowPathGuidelines(!showPathGuidelines)}
      >
        [Guidelines: {showPathGuidelines ? 'On' : 'Off'}]
      </Text>

      {/* Settings button */}
      <Text
        position={[gridSize / 2 + 1, gridSize / 2 + 1.5, 0]}
        color={COLORS.buttonHighlight}
        fontSize={0.5}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000"
        onClick={() => {
          setShowSettings(true)
          setIsPaused(true)
        }}
      >
        [Settings]
      </Text>

      {/* Controls info */}
      <Text
        position={[0, -gridSize / 2 - 1.5, 0]}
        color={COLORS.text}
        fontSize={0.5}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000"
      >
        Controls: Arrow/WASD = N/S/E/W | Q = Up/E = Down | F: Path | G: Guidelines | Tab: Settings
      </Text>
    </EnhancedScene>
  )
}
