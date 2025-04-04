import { Vector3 } from 'three'

// Constants for the game
export const INITIAL_GRID_SIZE = 14
export const MIN_GRID_SIZE = 10
export const MAX_GRID_SIZE = 24
export const CELL_SIZE = 1
export const INITIAL_SNAKE = [new Vector3(0, 0, 0)]
export const INITIAL_DIRECTION = new Vector3(1, 0, 0)
export const INITIAL_GAME_SPEED = 3.0 // moves per second

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
  W: new Vector3(0, 1, 0),
  S: new Vector3(0, -1, 0),
  A: new Vector3(-1, 0, 0),
  D: new Vector3(1, 0, 0),

  // Z-axis controls
  q: new Vector3(0, 0, -1),
  e: new Vector3(0, 0, 1),
  Q: new Vector3(0, 0, -1),
  E: new Vector3(0, 0, 1),
}

// Check if two vectors are equal
export const vectorsEqual = (v1: Vector3, v2: Vector3): boolean =>
  v1.x === v2.x && v1.y === v2.y && v1.z === v2.z

// Function to generate random food position in 3D
export const generateFood = (snake: Vector3[], gridSize: number): Vector3 => {
  let position: Vector3
  do {
    const halfGrid = Math.floor(gridSize / 2)
    position = new Vector3(
      Math.floor(Math.random() * gridSize) - halfGrid,
      Math.floor(Math.random() * gridSize) - halfGrid,
      Math.floor(Math.random() * gridSize) - halfGrid
    )

    // Check if position is within bounds
    if (
      Math.abs(position.x) > halfGrid ||
      Math.abs(position.y) > halfGrid ||
      Math.abs(position.z) > halfGrid
    ) {
      // If out of bounds, regenerate
      continue
    }
  } while (snake.some((segment) => vectorsEqual(segment, position)))

  return position
}

// Color palette
export const COLORS = {
  background: '#0f172a', // Darker background for better contrast
  grid: '#475569',
  gridLines: '#94a3b8',
  snakeHead: '#10b981', // Green
  snakeBody: '#059669',
  snakeTrail: '#047857', // Darker green for trail effect
  food: '#f59e0b', // Amber/gold for food
  foodGlow: '#fcd34d', // Light yellow glow
  text: '#f1f5f9',
  gameOver: '#ef4444',
  buttonHighlight: '#3b82f6',
  difficultyEasy: '#22c55e',
  difficultyMedium: '#f59e0b',
  difficultyHard: '#ef4444',
  directionX: '#f87171', // Red for X axis
  directionY: '#4ade80', // Green for Y axis
  directionZ: '#60a5fa', // Blue for Z axis
}
