import React, { useRef, useState, useEffect } from 'react'
import { Vector3, Color, Mesh } from 'three'
import { useFrame } from '@react-three/fiber'
import { COLORS } from '../utils'

interface FoodProps {
  position: Vector3
}

export function Food({ position }: FoodProps) {
  // Use refs for the meshes so we can animate them
  const foodRef = useRef<Mesh>(null)
  const glowRef = useRef<Mesh>(null)

  // Food color - static values to avoid unnecessary re-renders
  const foodColor = COLORS.food
  const glowColor = COLORS.foodGlow

  // Animation for the food item
  useFrame(({ clock }) => {
    if (foodRef.current && glowRef.current) {
      const t = clock.getElapsedTime()

      // Simple rotation animation
      foodRef.current.rotation.x = t * 0.5
      foodRef.current.rotation.y = t
      foodRef.current.rotation.z = t * 0.3

      // Pulsating glow
      const scale = 1.3 + Math.sin(t * 2) * 0.1
      glowRef.current.scale.set(scale, scale, scale)
    }
  })

  return (
    <group position={[position.x, position.y, position.z]}>
      {/* Main food mesh - using standard Three.js meshes and materials */}
      <mesh ref={foodRef} scale={0.6}>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial
          color={foodColor}
          emissive={foodColor}
          emissiveIntensity={0.5}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* Glow effect */}
      <mesh ref={glowRef} scale={1.3}>
        <sphereGeometry args={[0.6, 16, 16]} />
        <meshBasicMaterial color={glowColor} transparent={true} opacity={0.3} />
      </mesh>

      {/* Point light for illumination */}
      <pointLight color={foodColor} intensity={1.5} distance={3} decay={2} />
    </group>
  )
}
