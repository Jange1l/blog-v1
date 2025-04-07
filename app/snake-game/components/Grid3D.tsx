import React, { useMemo } from 'react'
import { Box, Line, Text } from '@react-three/drei'
import * as THREE from 'three'
import { CELL_SIZE, COLORS } from '../utils'

interface Grid3DProps {
  gridSize: number
}

export function Grid3D({ gridSize }: Grid3DProps) {
  const size = gridSize * CELL_SIZE

  // Generate the edge lines for the grid boundary
  const edgeLines = useMemo(() => {
    const halfGrid = gridSize / 2
    const edges: JSX.Element[] = []

    // Define the 8 vertices of the cube (grid boundaries)
    const vertices = [
      [-halfGrid, -halfGrid, -halfGrid], // 0: bottom-left-back
      [halfGrid, -halfGrid, -halfGrid], // 1: bottom-right-back
      [-halfGrid, halfGrid, -halfGrid], // 2: top-left-back
      [halfGrid, halfGrid, -halfGrid], // 3: top-right-back
      [-halfGrid, -halfGrid, halfGrid], // 4: bottom-left-front
      [halfGrid, -halfGrid, halfGrid], // 5: bottom-right-front
      [-halfGrid, halfGrid, halfGrid], // 6: top-left-front
      [halfGrid, halfGrid, halfGrid], // 7: top-right-front
    ]

    // Define the 12 edges of the cube using vertex indices
    const edgeConnections = [
      [0, 1],
      [2, 3],
      [0, 2],
      [1, 3], // back face
      [4, 5],
      [6, 7],
      [4, 6],
      [5, 7], // front face
      [0, 4],
      [1, 5],
      [2, 6],
      [3, 7], // connecting edges
    ]

    // Create Line components for each edge
    edgeConnections.forEach((edge, index) => {
      edges.push(
        <Line
          key={`edge-${index}`}
          points={[vertices[edge[0]], vertices[edge[1]]]}
          color={COLORS.buttonHighlight}
          lineWidth={2}
        />
      )
    })

    return edges
  }, [gridSize])

  return (
    <group>
      {/* Edge lines to highlight boundaries */}
      <group>{edgeLines}</group>

      {/* Coordinate axes for orientation */}
      <group position={[-gridSize / 2, -gridSize / 2, -gridSize / 2]}>
        <Line
          points={[
            [0, 0, 0],
            [2, 0, 0],
          ]}
          color="red"
          lineWidth={3}
        />
        <Text position={[2.5, 0, 0]} color="red" fontSize={0.5} anchorX="center" anchorY="middle">
          X
        </Text>

        <Line
          points={[
            [0, 0, 0],
            [0, 2, 0],
          ]}
          color="green"
          lineWidth={3}
        />
        <Text position={[0, 2.5, 0]} color="green" fontSize={0.5} anchorX="center" anchorY="middle">
          Y
        </Text>

        <Line
          points={[
            [0, 0, 0],
            [0, 0, 2],
          ]}
          color="blue"
          lineWidth={3}
        />
        <Text position={[0, 0, 2.5]} color="blue" fontSize={0.5} anchorX="center" anchorY="middle">
          Z
        </Text>
      </group>
    </group>
  )
}
