import { Vector3 } from 'three'

// Constants for the game
export const INITIAL_GRID_SIZE = 16
export const MIN_GRID_SIZE = 10
export const MAX_GRID_SIZE = 24
export const CELL_SIZE = 1
export const INITIAL_SNAKE = [new Vector3(0, 0, 0)]
export const INITIAL_DIRECTION = new Vector3(1, 0, 0)
export const INITIAL_GAME_SPEED = 2.5 // moves per second

// Direction mappings with additional Z-axis controls (q/e for up/down in 3D space)
export const DIRECTIONS: Record<string, Vector3> = {
  // X-Y plane (traditional controls)
  ArrowUp: new Vector3(0, 1, 0),
  ArrowDown: new Vector3(0, -1, 0),
  ArrowLeft: new Vector3(-1, 0, 0),
  ArrowRight: new Vector3(1, 0, 0),
  w: new Vector3(0, 1, 0),
  s: new Vector3(0, -1, 0),
  a: new Vector3(-1, 0, 0),
  d: new Vector3(1, 0, 0),
  // No need to duplicate uppercase mappings, we can handle case-insensitivity in the key handler

  // Z-axis controls - inverted
  q: new Vector3(0, 0, 1), // Backward out of the screen (positive Z)
  e: new Vector3(0, 0, -1), // Forward into the screen (negative Z)
}

// Check if two vectors are equal
export const vectorsEqual = (v1: Vector3, v2: Vector3): boolean =>
  v1.x === v2.x && v1.y === v2.y && v1.z === v2.z

// Function to generate random food position in 3D
export const generateFood = (snake: Vector3[], gridSize: number): Vector3 => {
  const halfGrid = Math.floor(gridSize / 2)
  let position: Vector3

  do {
    position = new Vector3(
      Math.floor(Math.random() * gridSize) - halfGrid,
      Math.floor(Math.random() * gridSize) - halfGrid,
      Math.floor(Math.random() * gridSize) - halfGrid
    )
    // We don't need explicit bounds checking as the random calculation already ensures it's within grid bounds
  } while (snake.some((segment) => vectorsEqual(segment, position)))

  return position
}

// Color palette
export const COLORS = {
  background: '#0f172a', // Dark blue-gray background
  grid: '#64748b', // Lighter grid color
  gridLines: '#cbd5e1', // Even lighter grid lines
  snakeHead: '#e2e8f0', // Bright white-ish for head
  snakeBody: '#cbd5e1', // Light gray for body
  snakeTrail: '#94a3b8', // Medium gray for trail effect
  food: '#fb923c', // Brighter, more vibrant orange for food
  foodGlow: '#fdba74', // Brighter orange glow
  text: '#f1f5f9', // Keep light text
  gameOver: '#ef4444', // Keep bright red for game over
  buttonHighlight: '#3b82f6', // Keep blue for buttons
  difficultyEasy: '#22c55e', // Keep green for easy
  difficultyMedium: '#f59e0b', // Keep amber for medium
  difficultyHard: '#ef4444', // Keep red for hard
  directionX: '#f87171', // Keep red for X axis
  directionY: '#4ade80', // Keep green for Y axis
  directionZ: '#60a5fa', // Keep blue for Z axis
}
