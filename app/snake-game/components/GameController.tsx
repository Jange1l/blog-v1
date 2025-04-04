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
  const [aiSimulation, setAiSimulation] = useState<boolean>(false)
  const [viewMode] = useState<string>('free') // Always use free camera mode

  const lastUpdateTime = useRef<number>(0)
  const lastDirection = useRef<Vector3>(direction)
  const cameraPositionRef = useRef<Vector3>(new Vector3(15, 15, 15))

  const { user, updateScore } = useAuth()
  const [isNewHighScore, setIsNewHighScore] = useState(false)

  // AI simulation algorithm
  const calculateAiDirection = () => {
    if (snake.length === 0 || gameOver) return null

    const head = snake[0]

    // Calculate the difference between the snake head and the food
    const diffX = food.x - head.x
    const diffY = food.y - head.y
    const diffZ = food.z - head.z

    // First try to move along the axis with the largest difference
    // This creates a simple but effective pathfinding algorithm
    let preferredDirection: Vector3 | null = null

    // Check if we're already aligned on 2 axes and just need to move on the third
    if (Math.abs(diffX) > 0 && Math.abs(diffY) === 0 && Math.abs(diffZ) === 0) {
      preferredDirection = new Vector3(Math.sign(diffX), 0, 0)
    } else if (Math.abs(diffY) > 0 && Math.abs(diffX) === 0 && Math.abs(diffZ) === 0) {
      preferredDirection = new Vector3(0, Math.sign(diffY), 0)
    } else if (Math.abs(diffZ) > 0 && Math.abs(diffX) === 0 && Math.abs(diffY) === 0) {
      preferredDirection = new Vector3(0, 0, Math.sign(diffZ))
    }
    // If not perfectly aligned, prioritize the largest difference
    else {
      // First try X axis if it has the largest difference
      if (
        Math.abs(diffX) >= Math.abs(diffY) &&
        Math.abs(diffX) >= Math.abs(diffZ) &&
        Math.abs(diffX) > 0
      ) {
        preferredDirection = new Vector3(Math.sign(diffX), 0, 0)
      }
      // Then try Y axis
      else if (
        Math.abs(diffY) >= Math.abs(diffX) &&
        Math.abs(diffY) >= Math.abs(diffZ) &&
        Math.abs(diffY) > 0
      ) {
        preferredDirection = new Vector3(0, Math.sign(diffY), 0)
      }
      // Then try Z axis
      else if (Math.abs(diffZ) > 0) {
        preferredDirection = new Vector3(0, 0, Math.sign(diffZ))
      }
    }

    // If we found a direction, check if it would cause collision
    if (preferredDirection) {
      // Check if this direction would cause a 180-degree turn
      if (vectorsEqual(preferredDirection, lastDirection.current.clone().multiplyScalar(-1))) {
        preferredDirection = null
      } else {
        // Check if moving in this direction would cause collision with self
        const nextHead = head.clone().add(preferredDirection)
        if (snake.slice(1).some((segment) => vectorsEqual(segment, nextHead))) {
          preferredDirection = null
        }

        // Check boundary collision
        if (
          Math.abs(nextHead.x) > gridSize / 2 ||
          Math.abs(nextHead.y) > gridSize / 2 ||
          Math.abs(nextHead.z) > gridSize / 2
        ) {
          preferredDirection = null
        }
      }
    }

    // If our preferred direction would cause collision, try other axes
    if (!preferredDirection) {
      const possibleDirections = [
        new Vector3(1, 0, 0),
        new Vector3(-1, 0, 0),
        new Vector3(0, 1, 0),
        new Vector3(0, -1, 0),
        new Vector3(0, 0, 1),
        new Vector3(0, 0, -1),
      ]

      // Filter out directions that cause collision
      const validDirections = possibleDirections.filter((dir) => {
        // Exclude 180-degree turns
        if (vectorsEqual(dir, lastDirection.current.clone().multiplyScalar(-1))) {
          return false
        }

        // Check self collision
        const nextHead = head.clone().add(dir)
        if (snake.slice(1).some((segment) => vectorsEqual(segment, nextHead))) {
          return false
        }

        // Check boundary collision
        if (
          Math.abs(nextHead.x) > gridSize / 2 ||
          Math.abs(nextHead.y) > gridSize / 2 ||
          Math.abs(nextHead.z) > gridSize / 2
        ) {
          return false
        }

        return true
      })

      if (validDirections.length > 0) {
        // Choose the direction that gets us closest to the food
        const bestDirection = validDirections.reduce((best, dir) => {
          const nextHead = head.clone().add(dir)
          const currentDistance = nextHead.distanceTo(food)
          const bestDistance = head.clone().add(best).distanceTo(food)

          return currentDistance < bestDistance ? dir : best
        }, validDirections[0])

        preferredDirection = bestDirection
      }
    }

    return preferredDirection
  }

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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

      // Toggle AI simulation with A key
      if (e.key === 'a' || e.key === 'A') {
        // Only toggle if Alt key is pressed to avoid conflict with movement
        if (e.altKey) {
          setAiSimulation(!aiSimulation)
          // When enabling AI, unpause the game if it's paused
          if (isPaused && !aiSimulation) {
            setIsPaused(false)
          }
          return
        }
      }

      // Game state checks - don't process movement if paused, in settings, or game over
      if (isPaused || showSettings || gameOver) {
        // Skip to the settings/pause/game over controls
        if (e.key === 'Tab') {
          e.preventDefault() // Prevent focus change
          setShowSettings(!showSettings)
          if (!isPaused && !gameOver) {
            setIsPaused(true)
          }
          return
        }

        // Settings are shown, handle settings-specific controls
        if (showSettings) {
          if (e.key === 'Escape') {
            setShowSettings(false)
            return
          }

          // Grid size controls
          if (e.key === '[' && gridSize > MIN_GRID_SIZE) {
            setGridSize(gridSize - 1)
            // Don't regenerate food on grid size change
            return
          }
          if (e.key === ']' && gridSize < MAX_GRID_SIZE) {
            setGridSize(gridSize + 1)
            // Don't regenerate food on grid size change
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
          return
        }

        // Game is over, handle restart
        if (gameOver) {
          if (e.key === 'r' || e.key === 'R') {
            // Restart game
            setSnake(INITIAL_SNAKE)
            setDirection(INITIAL_DIRECTION)
            setGameOver(false)
            setScore(0)
            setIsPaused(true) // Start paused to allow initialization
            lastDirection.current = INITIAL_DIRECTION

            // Generate new food position after a delay
            foodProcessedRef.current = false
            window.setTimeout(() => {
              const newFoodPosition = generateFood(INITIAL_SNAKE, gridSize)
              setFood(newFoodPosition)
              foodProcessedRef.current = true

              // Resume game after food is generated
              window.setTimeout(() => {
                setIsPaused(false)
              }, 300)
            }, 200)
          }
          return
        }

        // Pause/resume game
        if (e.key === 'p' || e.key === 'P') {
          setIsPaused(!isPaused)
          return
        }

        return
      }

      // If AI simulation is active, don't process movement keys
      if (aiSimulation) {
        // But still allow pausing
        if (e.key === 'p' || e.key === 'P') {
          setIsPaused(!isPaused)
          return
        }
        return
      }

      // SIMPLIFIED CONTROL SYSTEM - process only if game is active

      // Handle cardinal direction movements (WASD/Arrows)
      // These always control XY plane regardless of current movement
      let newDirection: Vector3 | null = null

      switch (e.key) {
        // North (up) - always positive Y
        case 'ArrowUp':
        case 'w':
        case 'W':
          newDirection = new Vector3(0, 1, 0)
          break

        // South (down) - always negative Y
        case 'ArrowDown':
        case 's':
        case 'S':
          newDirection = new Vector3(0, -1, 0)
          break

        // West (left) - always negative X
        case 'ArrowLeft':
        case 'a':
        case 'A':
          newDirection = new Vector3(-1, 0, 0)
          break

        // East (right) - always positive X
        case 'ArrowRight':
        case 'd':
        case 'D':
          newDirection = new Vector3(1, 0, 0)
          break

        // Z-axis controls - Q/E always control Z regardless of current direction
        case 'q':
        case 'Q':
          newDirection = new Vector3(0, 0, 1)
          break

        case 'e':
        case 'E':
          newDirection = new Vector3(0, 0, -1)
          break

        // Other controls
        case 'Tab':
          e.preventDefault() // Prevent focus change
          setShowSettings(!showSettings)
          setIsPaused(true)
          return

        case 'p':
        case 'P':
          setIsPaused(!isPaused)
          return

        default:
          // No recognized key pressed
          return
      }

      // If we have a new direction, check if it's valid and update
      if (newDirection) {
        // Prevent 180-degree turns (can't go directly backwards)
        if (!vectorsEqual(newDirection, lastDirection.current.clone().multiplyScalar(-1))) {
          setDirection(newDirection)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [
    gameOver,
    isPaused,
    showSettings,
    gridSize,
    gameSpeed,
    showPathPredictor,
    showPathGuidelines,
    aiSimulation,
    viewMode,
  ])

  // Handle game over with score tracking
  const handleGameOver = () => {
    setGameOver(true)

    // Update user's score if authenticated
    if (user && score > 0) {
      // Check if it's a new high score for the user
      updateScore(score).then((isNewHighScore) => {
        setIsNewHighScore(isNewHighScore)
      })
    }
  }

  // Game loop
  useFrame(({ clock }) => {
    if (gameOver || isPaused || showSettings) return

    const currentTime = clock.getElapsedTime()
    if (currentTime - lastUpdateTime.current < 1 / gameSpeed) return

    lastUpdateTime.current = currentTime

    // If AI simulation is active, calculate and set the AI's next direction
    if (aiSimulation && !gameOver) {
      const aiDirection = calculateAiDirection()
      if (aiDirection) {
        setDirection(aiDirection)
        lastDirection.current = aiDirection
      }
    } else {
      lastDirection.current = direction
    }

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

  const closeSettings = () => {
    setShowSettings(false)
    if (gameOver === false) {
      setIsPaused(false)
    }
  }

  // Reset the new high score flag when restarting
  const handleRestart = () => {
    // ... existing restart code ...
    setIsNewHighScore(false)
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
            position={[0, 0, 0]}
            color={COLORS.gameOver}
            fontSize={1.2}
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.05}
            outlineColor="#000"
          >
            Game Over! Press R to restart
          </Text>
          <Text
            position={[0, -1.5, 0]}
            color={COLORS.text}
            fontSize={0.7}
            anchorX="center"
            anchorY="middle"
          >
            Final Score: {score}
          </Text>

          {/* Show high score notification if it's a new high score */}
          {isNewHighScore && (
            <Text
              position={[0, -2.5, 0]}
              color="#FFD700" // Gold color for high score
              fontSize={0.7}
              anchorX="center"
              anchorY="middle"
              outlineWidth={0.03}
              outlineColor="#000"
            >
              New High Score!
            </Text>
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

      {/* Camera mode indicator */}
      <Text
        position={[-gridSize / 2 - 1, gridSize / 2 + 1.5, 0]}
        color={COLORS.text}
        fontSize={0.5}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000"
      >
        [Camera: Free]
      </Text>

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

      {/* AI Simulation toggle */}
      <Text
        position={[-gridSize / 2 - 1, gridSize / 2 - 0.4, 0]}
        color={aiSimulation ? COLORS.foodGlow : COLORS.text}
        fontSize={0.5}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000"
        onClick={() => {
          setAiSimulation(!aiSimulation)
          if (isPaused && !aiSimulation) {
            setIsPaused(false)
          }
        }}
      >
        [AI: {aiSimulation ? 'On' : 'Off'}]
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

      {/* Controls info - update to include G key for guidelines toggle */}
      <Text
        position={[0, -gridSize / 2 - 1.5, 0]}
        color={COLORS.text}
        fontSize={0.5}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000"
      >
        Controls: Arrow/WASD = N/S/E/W | Q = Up/E = Down | F: Path | G: Guidelines | Alt+A: AI |
        Tab: Settings
      </Text>
    </EnhancedScene>
  )
}
