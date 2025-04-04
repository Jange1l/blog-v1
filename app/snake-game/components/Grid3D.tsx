import React from 'react'
import { Box, Line, Text } from '@react-three/drei'
import * as THREE from 'three'
import { CELL_SIZE, COLORS } from '../utils'

interface Grid3DProps {
  gridSize: number
}

export function Grid3D({ gridSize }: Grid3DProps) {
  const size = gridSize * CELL_SIZE

  return (
    <group>
      {/* Edge lines to highlight boundaries */}
      <group>
        {/* Bottom edges */}
        <Line
          points={[
            [-gridSize / 2, -gridSize / 2, -gridSize / 2],
            [gridSize / 2, -gridSize / 2, -gridSize / 2],
          ]}
          color={COLORS.buttonHighlight}
          lineWidth={2}
        />
        <Line
          points={[
            [-gridSize / 2, gridSize / 2, -gridSize / 2],
            [gridSize / 2, gridSize / 2, -gridSize / 2],
          ]}
          color={COLORS.buttonHighlight}
          lineWidth={2}
        />
        <Line
          points={[
            [-gridSize / 2, -gridSize / 2, -gridSize / 2],
            [-gridSize / 2, gridSize / 2, -gridSize / 2],
          ]}
          color={COLORS.buttonHighlight}
          lineWidth={2}
        />
        <Line
          points={[
            [gridSize / 2, -gridSize / 2, -gridSize / 2],
            [gridSize / 2, gridSize / 2, -gridSize / 2],
          ]}
          color={COLORS.buttonHighlight}
          lineWidth={2}
        />

        {/* Top edges */}
        <Line
          points={[
            [-gridSize / 2, -gridSize / 2, gridSize / 2],
            [gridSize / 2, -gridSize / 2, gridSize / 2],
          ]}
          color={COLORS.buttonHighlight}
          lineWidth={2}
        />
        <Line
          points={[
            [-gridSize / 2, gridSize / 2, gridSize / 2],
            [gridSize / 2, gridSize / 2, gridSize / 2],
          ]}
          color={COLORS.buttonHighlight}
          lineWidth={2}
        />
        <Line
          points={[
            [-gridSize / 2, -gridSize / 2, gridSize / 2],
            [-gridSize / 2, gridSize / 2, gridSize / 2],
          ]}
          color={COLORS.buttonHighlight}
          lineWidth={2}
        />
        <Line
          points={[
            [gridSize / 2, -gridSize / 2, gridSize / 2],
            [gridSize / 2, gridSize / 2, gridSize / 2],
          ]}
          color={COLORS.buttonHighlight}
          lineWidth={2}
        />

        {/* Vertical edges */}
        <Line
          points={[
            [-gridSize / 2, -gridSize / 2, -gridSize / 2],
            [-gridSize / 2, -gridSize / 2, gridSize / 2],
          ]}
          color={COLORS.buttonHighlight}
          lineWidth={2}
        />
        <Line
          points={[
            [gridSize / 2, -gridSize / 2, -gridSize / 2],
            [gridSize / 2, -gridSize / 2, gridSize / 2],
          ]}
          color={COLORS.buttonHighlight}
          lineWidth={2}
        />
        <Line
          points={[
            [-gridSize / 2, gridSize / 2, -gridSize / 2],
            [-gridSize / 2, gridSize / 2, gridSize / 2],
          ]}
          color={COLORS.buttonHighlight}
          lineWidth={2}
        />
        <Line
          points={[
            [gridSize / 2, gridSize / 2, -gridSize / 2],
            [gridSize / 2, gridSize / 2, gridSize / 2],
          ]}
          color={COLORS.buttonHighlight}
          lineWidth={2}
        />
      </group>

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
