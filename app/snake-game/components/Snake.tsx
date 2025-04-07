import React, { useMemo } from 'react'
import { Vector3 } from 'three'
import { RoundedBox, MeshDistortMaterial, MeshWobbleMaterial } from '@react-three/drei'
import { CELL_SIZE, COLORS } from '../utils'

interface SnakeProps {
  positions: Vector3[]
}

export function Snake({ positions }: SnakeProps) {
  // Create a color array based on position in the snake
  const segmentColors = useMemo(() => {
    // Parse the base color once
    const baseR = parseInt(COLORS.snakeBody.slice(1, 3), 16) / 255
    const baseG = parseInt(COLORS.snakeBody.slice(3, 5), 16) / 255
    const baseB = parseInt(COLORS.snakeBody.slice(5, 7), 16) / 255

    return positions.map((_, i) => {
      if (i === 0) return COLORS.snakeHead

      // Create a more pronounced gradient effect along the snake body
      const gradientPosition = i / positions.length
      const colorFactor = 1 - Math.pow(gradientPosition, 0.8) * 0.5

      return `rgb(
        ${Math.floor(baseR * 255 * colorFactor)}, 
        ${Math.floor(baseG * 255 * colorFactor)}, 
        ${Math.floor(baseB * 255 * colorFactor)}
      )`
    })
  }, [positions])

  // Define the head segment separately for special effects
  const head = positions[0]

  return (
    <group>
      {/* The head of the snake - larger and more distinct */}
      <group position={[head.x, head.y, head.z]}>
        {/* Main head segment with enhanced material */}
        <RoundedBox
          args={[0.9 * CELL_SIZE, 0.9 * CELL_SIZE, 0.9 * CELL_SIZE]}
          radius={0.25}
          smoothness={6}
        >
          <MeshDistortMaterial
            color={COLORS.snakeHead}
            roughness={0.1}
            metalness={0.9}
            emissive={COLORS.snakeHead}
            emissiveIntensity={0.7}
            distort={0.3} // More pronounced distortion for organic look
            speed={0.8} // Speed of the distortion
          />
        </RoundedBox>

        {/* Enhanced glow for the head */}
        <pointLight color={COLORS.snakeHead} intensity={0.9} distance={2.5} decay={1.8} />
      </group>

      {/* Body segments using individual meshes with improved visuals */}
      {positions.slice(1).map((pos, i) => {
        // Calculate size based on position in the snake - tapers toward tail
        const sizeFactor = 0.85 - (i / positions.length) * 0.15

        return (
          <group key={i} position={[pos.x, pos.y, pos.z]}>
            <RoundedBox
              args={[
                0.8 * CELL_SIZE * sizeFactor,
                0.8 * CELL_SIZE * sizeFactor,
                0.8 * CELL_SIZE * sizeFactor,
              ]}
              radius={0.15}
              smoothness={4}
            >
              {i < positions.length / 3 ? (
                // Front third of the body gets wobble effect
                <MeshWobbleMaterial
                  color={segmentColors[i + 1]}
                  roughness={0.3}
                  metalness={0.6}
                  factor={0.15} // Wobble amount
                  speed={0.5} // Wobble speed
                />
              ) : (
                // Rest of the body gets standard material
                <meshStandardMaterial
                  color={segmentColors[i + 1]}
                  roughness={0.3}
                  metalness={0.5}
                />
              )}
            </RoundedBox>

            {/* Smaller light for each segment - gradually dimming toward tail */}
            <pointLight
              color={COLORS.snakeTrail}
              intensity={0.4 * (1 - i / positions.length)} // Dimmer toward tail
              distance={1.2}
              decay={2}
            />
          </group>
        )
      })}
    </group>
  )
}
