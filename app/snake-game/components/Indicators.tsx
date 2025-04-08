import React from 'react'
import { Line, Text } from '@react-three/drei'
import { Vector3 } from 'three'
import { COLORS, vectorsEqual } from '../utils'

// Direction indicator component
interface DirectionIndicatorProps {
  direction: Vector3
  position: Vector3
}

export function DirectionIndicator({ direction, position }: DirectionIndicatorProps) {
  // Calculate endpoint - extend the direction vector for visualization
  const endpoint = new Vector3().copy(direction).multiplyScalar(1.5)

  // Determine color based on primary axis of movement
  let color = COLORS.directionX // Default to X

  if (
    Math.abs(direction.y) > Math.abs(direction.x) &&
    Math.abs(direction.y) > Math.abs(direction.z)
  ) {
    color = COLORS.directionY // Y axis is dominant
  } else if (
    Math.abs(direction.z) > Math.abs(direction.x) &&
    Math.abs(direction.z) > Math.abs(direction.y)
  ) {
    color = COLORS.directionZ // Z axis is dominant
  }

  return (
    <group position={[position.x, position.y, position.z]}>
      {/* Direction arrow */}
      <Line
        points={[
          [0, 0, 0],
          [endpoint.x, endpoint.y, endpoint.z],
        ]}
        color={color}
        lineWidth={3}
      />

      {/* Arrow head */}
      <mesh position={endpoint.toArray()} rotation={[0, 0, 0]}>
        <coneGeometry args={[0.2, 0.4, 8]} />
        <meshBasicMaterial color={color} />
      </mesh>

      {/* Direction text */}
      <Text
        position={[endpoint.x * 1.2, endpoint.y * 1.2, endpoint.z * 1.2]}
        color={color}
        fontSize={0.3}
        anchorX="center"
        anchorY="middle"
      >
        {direction.x !== 0
          ? direction.x > 0
            ? '+X'
            : '-X'
          : direction.y !== 0
            ? direction.y > 0
              ? '+Y'
              : '-Y'
            : direction.z > 0
              ? '+Z'
              : '-Z'}
      </Text>
    </group>
  )
}

// Path predictor component to show potential path to food
interface PathPredictorProps {
  snakeHead: Vector3
  food: Vector3
}

export function PathPredictor({ snakeHead, food }: PathPredictorProps) {
  // Calculate the difference vector
  const diff = new Vector3().subVectors(food, snakeHead)

  // Create points array for path visualization
  const points: [number, number, number][] = []
  const currentPoint = new Vector3().copy(snakeHead)

  // X path segment
  if (diff.x !== 0) {
    points.push([currentPoint.x, currentPoint.y, currentPoint.z])
    currentPoint.x = food.x
    points.push([currentPoint.x, currentPoint.y, currentPoint.z])
  }

  // Y path segment
  if (diff.y !== 0) {
    points.push([currentPoint.x, currentPoint.y, currentPoint.z])
    currentPoint.y = food.y
    points.push([currentPoint.x, currentPoint.y, currentPoint.z])
  }

  // Z path segment
  if (diff.z !== 0) {
    points.push([currentPoint.x, currentPoint.y, currentPoint.z])
    currentPoint.z = food.z
    points.push([currentPoint.x, currentPoint.y, currentPoint.z])
  }

  // Need at least 2 points to draw a line
  if (points.length < 2) return null

  return (
    <group>
      <Line
        points={points}
        color="white"
        lineWidth={1}
        opacity={0.7}
        transparent
        dashed
        dashSize={0.5}
        gapSize={0.3}
      />
    </group>
  )
}

// Path guidelines component to show possible directions in 3D space
interface PathGuidelinesProps {
  gridSize: number
  currentDirection: Vector3
  snakeHead: Vector3
}

export function PathGuidelines({ gridSize, currentDirection, snakeHead }: PathGuidelinesProps) {
  // Half grid size for calculations
  const halfGrid = gridSize / 2

  // Grid lines - create a grid visualization focused around the snake
  const createGridLines = () => {
    const lines: JSX.Element[] = []

    // Use larger spacing to reduce number of lines
    const spacing = 2

    // Round snake position to nearest grid point
    const snakeGridX = Math.round(snakeHead.x)
    const snakeGridY = Math.round(snakeHead.y)
    const snakeGridZ = Math.round(snakeHead.z)

    // Major axis lines - color-coded to match coordinate system
    // These run through the snake's current position

    // X axis through snake
    lines.push(
      <Line
        key="x-axis-through-snake"
        points={[
          new Vector3(-halfGrid, snakeGridY, snakeGridZ),
          new Vector3(halfGrid, snakeGridY, snakeGridZ),
        ]}
        color={COLORS.directionX} // Red for X axis
        lineWidth={1}
        opacity={0.3}
      />
    )

    // Y axis through snake
    lines.push(
      <Line
        key="y-axis-through-snake"
        points={[
          new Vector3(snakeGridX, -halfGrid, snakeGridZ),
          new Vector3(snakeGridX, halfGrid, snakeGridZ),
        ]}
        color={COLORS.directionY} // Green for Y axis
        lineWidth={1}
        opacity={0.3}
      />
    )

    // Z axis through snake
    lines.push(
      <Line
        key="z-axis-through-snake"
        points={[
          new Vector3(snakeGridX, snakeGridY, -halfGrid),
          new Vector3(snakeGridX, snakeGridY, halfGrid),
        ]}
        color={COLORS.directionZ} // Blue for Z axis
        lineWidth={1}
        opacity={0.3}
      />
    )

    // Major coordinate axes at origin (for reference)
    if (Math.abs(snakeGridX) > 2 || Math.abs(snakeGridY) > 2 || Math.abs(snakeGridZ) > 2) {
      // Only show if snake is not too close to origin
      lines.push(
        <Line
          key="x-axis-origin"
          points={[new Vector3(-halfGrid, 0, 0), new Vector3(halfGrid, 0, 0)]}
          color={COLORS.directionX}
          lineWidth={0.5}
          opacity={0.1}
          dashed
        />
      )

      lines.push(
        <Line
          key="y-axis-origin"
          points={[new Vector3(0, -halfGrid, 0), new Vector3(0, halfGrid, 0)]}
          color={COLORS.directionY}
          lineWidth={0.5}
          opacity={0.1}
          dashed
        />
      )

      lines.push(
        <Line
          key="z-axis-origin"
          points={[new Vector3(0, 0, -halfGrid), new Vector3(0, 0, halfGrid)]}
          color={COLORS.directionZ}
          lineWidth={0.5}
          opacity={0.1}
          dashed
        />
      )
    }

    // // // Add a few spaced grid lines in each plane
    // // // Only show 2-3 lines in each direction around the snake

    // // // Calculate range - just a few lines near the snake
    // // const range = 4 // How many grid cells away from snake to show
    // // const min = -range
    // // const max = range

    // // for (let offset = min; offset <= max; offset += spacing) {
    // //   if (offset === 0) continue // Skip the lines that pass through the snake (already drawn)

    // //   const i = snakeGridX + offset
    // //   if (i >= -halfGrid && i <= halfGrid) {
    // //     // Vertical line in YZ plane at X=i
    // //     lines.push(
    // //       <Line
    // //         key={`yz-at-x-${i}`}
    // //         points={[new Vector3(i, -halfGrid, snakeGridZ), new Vector3(i, halfGrid, snakeGridZ)]}
    // //         color={COLORS.gridLines}
    // //         lineWidth={0.5}
    // //         dashed
    // //         dashSize={0.3}
    // //         dashScale={10}
    // //         opacity={0.08}
    // //       />
    // //     )
    // //   }

    // //   const j = snakeGridY + offset
    // //   if (j >= -halfGrid && j <= halfGrid) {
    // //     // Horizontal line in XZ plane at Y=j
    // //     lines.push(
    // //       <Line
    // //         key={`xz-at-y-${j}`}
    // //         points={[new Vector3(-halfGrid, j, snakeGridZ), new Vector3(halfGrid, j, snakeGridZ)]}
    // //         color={COLORS.gridLines}
    // //         lineWidth={0.5}
    // //         dashed
    // //         dashSize={0.3}
    // //         dashScale={10}
    // //         opacity={0.08}
    // //       />
    // //     )
    // //   }

    // //   const k = snakeGridZ + offset
    // //   if (k >= -halfGrid && k <= halfGrid) {
    // //     // Horizontal line in XY plane at Z=k
    // //     lines.push(
    // //       <Line
    // //         key={`xy-at-z-${k}`}
    // //         points={[new Vector3(snakeGridX, -halfGrid, k), new Vector3(snakeGridX, halfGrid, k)]}
    // //         color={COLORS.gridLines}
    // //         lineWidth={0.5}
    // //         dashed
    // //         dashSize={0.3}
    // //         dashScale={10}
    // //         opacity={0.08}
    // //       />
    // //     )
    // //   }
    // }

    // return lines
  }

  // Create a line from the snake's head in the current direction
  const createCurrentPathLine = () => {
    // Start at snake head
    const start = snakeHead.clone()

    // End at grid boundary in direction of movement
    const end = snakeHead.clone()

    // Extend to boundary based on current direction
    if (Math.abs(currentDirection.x) > 0) {
      end.x = currentDirection.x > 0 ? halfGrid : -halfGrid
    } else if (Math.abs(currentDirection.y) > 0) {
      end.y = currentDirection.y > 0 ? halfGrid : -halfGrid
    } else if (Math.abs(currentDirection.z) > 0) {
      end.z = currentDirection.z > 0 ? halfGrid : -halfGrid
    }

    return <Line points={[start, end]} color={COLORS.snakeHead} lineWidth={3} opacity={0.7} />
  }

  return (
    <>
      {/* Static grid lines */}
      {/* {createGridLines()} */}

      {/* Current path highlight */}
      {/* {createCurrentPathLine()} */}
    </>
  )
}
