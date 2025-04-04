import React, { useMemo } from 'react'
import { Vector3 } from 'three'
import { RoundedBox, MeshDistortMaterial } from '@react-three/drei'
import { CELL_SIZE, COLORS } from '../utils'

interface SnakeProps {
  positions: Vector3[]
}

export function Snake({ positions }: SnakeProps) {
  // Create a color array based on position in the snake
  const segmentColors = useMemo(() => {
    return positions.map((_, i) => {
      if (i === 0) return COLORS.snakeHead

      // Create a gradient effect along the snake body
      const gradientPosition = i / positions.length
      const r = parseInt(COLORS.snakeBody.slice(1, 3), 16) / 255
      const g = parseInt(COLORS.snakeBody.slice(3, 5), 16) / 255
      const b = parseInt(COLORS.snakeBody.slice(5, 7), 16) / 255

      // Slightly vary the color for each segment to create a dynamic effect
      return `rgb(
        ${Math.floor(r * 255 * (1 - gradientPosition * 0.3))}, 
        ${Math.floor(g * 255 * (1 - gradientPosition * 0.1))}, 
        ${Math.floor(b * 255 * (1 - gradientPosition * 0.2))}
      )`
    })
  }, [positions.length])

  // Define the head segment separately for special effects
  const head = positions[0]

  return (
    <group>
      {/* The head of the snake gets special treatment */}
      <group position={[head.x, head.y, head.z]}>
        {/* Head segment with advanced material */}
        <RoundedBox
          args={[0.85 * CELL_SIZE, 0.85 * CELL_SIZE, 0.85 * CELL_SIZE]}
          radius={0.2}
          smoothness={5}
        >
          <MeshDistortMaterial
            color={COLORS.snakeHead}
            roughness={0.1}
            metalness={0.8}
            emissive={COLORS.snakeHead}
            emissiveIntensity={0.5}
            distort={0.2} // Subtle distortion for organic look
            speed={0.5} // Speed of the distortion
          />
        </RoundedBox>

        {/* Add a point light to make the head glow */}
        <pointLight color={COLORS.snakeHead} intensity={0.7} distance={2} decay={2} />
      </group>

      {/* Body segments using individual meshes for better stability */}
      {positions.slice(1).map((pos, i) => (
        <group key={i} position={[pos.x, pos.y, pos.z]}>
          <RoundedBox
            args={[0.8 * CELL_SIZE, 0.8 * CELL_SIZE, 0.8 * CELL_SIZE]}
            radius={0.15}
            smoothness={4}
          >
            <meshStandardMaterial color={segmentColors[i + 1]} roughness={0.2} metalness={0.6} />
          </RoundedBox>

          {/* Small pulsating light for each segment */}
          <pointLight
            color={COLORS.snakeTrail}
            intensity={0.4 + (0.6 / positions.length) * (positions.length - i - 1)}
            distance={1.5}
            decay={2}
          />
        </group>
      ))}
    </group>
  )
}
