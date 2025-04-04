import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { SpotLight, Sparkles, Stars, Text, Line } from '@react-three/drei'
import { Vector3, SpotLight as ThreeSpotLight } from 'three'
import { COLORS } from '../utils'

interface EnhancedSceneProps {
  children: React.ReactNode
  gridSize: number
  gameOver: boolean
}

export function EnhancedScene({ children, gridSize, gameOver }: EnhancedSceneProps) {
  // References for animating lights with proper types
  const spotLight1 = useRef<ThreeSpotLight>(null)
  const spotLight2 = useRef<ThreeSpotLight>(null)
  const spotLight3 = useRef<ThreeSpotLight>(null)

  // Animation for lighting
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()

    // Orbit lights around the scene
    if (spotLight1.current && spotLight2.current && spotLight3.current) {
      const radius = gridSize * 1.5

      // First spotlight orbits in XZ plane
      spotLight1.current.position.x = Math.sin(t * 0.2) * radius
      spotLight1.current.position.z = Math.cos(t * 0.2) * radius
      spotLight1.current.target.position.set(0, 0, 0)
      spotLight1.current.target.updateMatrixWorld()

      // Second spotlight orbits in XY plane
      spotLight2.current.position.x = Math.sin(t * 0.1) * radius
      spotLight2.current.position.y = Math.cos(t * 0.1) * radius
      spotLight2.current.target.position.set(0, 0, 0)
      spotLight2.current.target.updateMatrixWorld()

      // Third spotlight orbits in YZ plane
      spotLight3.current.position.y = Math.sin(t * 0.15) * radius
      spotLight3.current.position.z = Math.cos(t * 0.15) * radius
      spotLight3.current.target.position.set(0, 0, 0)
      spotLight3.current.target.updateMatrixWorld()
    }
  })

  // Calculate positions based on grid size
  const halfGrid = gridSize / 2
  const areaSize = gridSize * 1.5

  // Create axis labels for orientation
  const axisLabels = () => {
    const labelDist = halfGrid + 1.5
    return (
      <>
        {/* X-axis label */}
        <Text
          position={[labelDist, 0, 0]}
          color={COLORS.directionX}
          fontSize={1.2}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.1}
          outlineColor="#000"
        >
          X
        </Text>
        {/* Y-axis label */}
        <Text
          position={[0, labelDist, 0]}
          color={COLORS.directionY}
          fontSize={1.2}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.1}
          outlineColor="#000"
        >
          Y
        </Text>
        {/* Z-axis label */}
        <Text
          position={[0, 0, labelDist]}
          color={COLORS.directionZ}
          fontSize={1.2}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.1}
          outlineColor="#000"
        >
          Z
        </Text>
      </>
    )
  }

  // Create coordinate grid guides
  const coordinateGrids = () => {
    // Create lines for a faint coordinate grid
    const gridLines: JSX.Element[] = []
    const spacing = 5 // Grid spacing

    // Only draw grid lines every 'spacing' units
    for (let i = -halfGrid; i <= halfGrid; i += spacing) {
      if (i === 0) continue // Skip center lines as they're drawn more prominently as axes

      // XY plane lines (parallel to X and Y axes)
      gridLines.push(
        <Line
          key={`x-y-${i}`}
          points={[new Vector3(i, -halfGrid, 0), new Vector3(i, halfGrid, 0)]}
          color="#1e293b"
          lineWidth={1}
          opacity={0.3}
        />
      )
      gridLines.push(
        <Line
          key={`y-x-${i}`}
          points={[new Vector3(-halfGrid, i, 0), new Vector3(halfGrid, i, 0)]}
          color="#1e293b"
          lineWidth={1}
          opacity={0.3}
        />
      )

      // XZ plane lines (parallel to X and Z axes)
      gridLines.push(
        <Line
          key={`x-z-${i}`}
          points={[new Vector3(i, 0, -halfGrid), new Vector3(i, 0, halfGrid)]}
          color="#1e293b"
          lineWidth={1}
          opacity={0.3}
        />
      )
      gridLines.push(
        <Line
          key={`z-x-${i}`}
          points={[new Vector3(-halfGrid, 0, i), new Vector3(halfGrid, 0, i)]}
          color="#1e293b"
          lineWidth={1}
          opacity={0.3}
        />
      )

      // YZ plane lines (parallel to Y and Z axes)
      gridLines.push(
        <Line
          key={`y-z-${i}`}
          points={[new Vector3(0, i, -halfGrid), new Vector3(0, i, halfGrid)]}
          color="#1e293b"
          lineWidth={1}
          opacity={0.3}
        />
      )
      gridLines.push(
        <Line
          key={`z-y-${i}`}
          points={[new Vector3(0, -halfGrid, i), new Vector3(0, halfGrid, i)]}
          color="#1e293b"
          lineWidth={1}
          opacity={0.3}
        />
      )
    }

    return gridLines
  }

  // Create prominent axis lines for orientation
  const axisLines = () => {
    return (
      <>
        {/* X-axis (red) */}
        <Line
          points={[new Vector3(-halfGrid, 0, 0), new Vector3(halfGrid, 0, 0)]}
          color={COLORS.directionX}
          lineWidth={2}
        />

        {/* Y-axis (green) */}
        <Line
          points={[new Vector3(0, -halfGrid, 0), new Vector3(0, halfGrid, 0)]}
          color={COLORS.directionY}
          lineWidth={2}
        />

        {/* Z-axis (blue) */}
        <Line
          points={[new Vector3(0, 0, -halfGrid), new Vector3(0, 0, halfGrid)]}
          color={COLORS.directionZ}
          lineWidth={2}
        />
      </>
    )
  }

  return (
    <>
      {/* Ambient Environment */}
      <color attach="background" args={[COLORS.background]} />
      <fog attach="fog" args={[COLORS.background, gridSize * 2.5, gridSize * 6]} />
      <ambientLight intensity={0.3} />

      {/* Spatial orientation guides */}
      {axisLines()}
      {coordinateGrids()}
      {axisLabels()}

      {/* Dynamic Lighting */}
      <SpotLight
        ref={spotLight1}
        position={[halfGrid * 1.5, halfGrid, 0]}
        angle={0.5}
        penumbra={0.8}
        intensity={0.7}
        distance={gridSize * 4}
        color="#6366f1"
        castShadow
      />

      <SpotLight
        ref={spotLight2}
        position={[0, halfGrid * 1.5, halfGrid]}
        angle={0.6}
        penumbra={0.6}
        intensity={0.7}
        distance={gridSize * 4}
        color="#8b5cf6"
        castShadow
      />

      <SpotLight
        ref={spotLight3}
        position={[-halfGrid * 1.5, 0, halfGrid]}
        angle={0.5}
        penumbra={0.7}
        intensity={0.7}
        distance={gridSize * 4}
        color="#0ea5e9"
        castShadow
      />

      {/* Additional global light for better visibility */}
      <directionalLight position={[halfGrid * 3, halfGrid * 3, halfGrid * 3]} intensity={0.3} />

      {/* Ambient Particle Effects */}
      <Sparkles
        count={100}
        size={3}
        scale={areaSize}
        position={[0, 0, 0]}
        color={gameOver ? '#ef4444' : '#38bdf8'}
        speed={0.2}
      />

      {/* Space Background with Stars */}
      <Stars
        radius={gridSize * 5}
        depth={50}
        count={1000}
        factor={4}
        fade
        speed={gameOver ? 2 : 0.5}
      />

      {/* Game Content */}
      {children}
    </>
  )
}
