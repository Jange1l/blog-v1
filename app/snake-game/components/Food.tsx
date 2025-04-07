import React, { useRef, useState, useEffect } from 'react'
import { Vector3, Color, Mesh, PointLight } from 'three'
import { useFrame } from '@react-three/fiber'
import { COLORS } from '../utils'

interface FoodProps {
  position: Vector3
}

export function Food({ position }: FoodProps) {
  // Use refs for the meshes so we can animate them
  const foodRef = useRef<Mesh>(null)
  const glowRef = useRef<Mesh>(null)
  const pointLightRef = useRef<PointLight>(null)

  // Food color - static values to avoid unnecessary re-renders
  const foodColor = COLORS.food
  const glowColor = COLORS.foodGlow

  // Animation for the food item
  useFrame(({ clock }) => {
    if (foodRef.current && glowRef.current && pointLightRef.current) {
      const t = clock.getElapsedTime()

      // Enhanced rotation animation
      foodRef.current.rotation.x = t * 0.7
      foodRef.current.rotation.y = t * 1.2
      foodRef.current.rotation.z = t * 0.5

      // Stronger pulsating effect for better visibility
      const pulseFactor = 0.2 + Math.sin(t * 3) * 0.15
      const scale = 1.3 + pulseFactor
      glowRef.current.scale.set(scale, scale, scale)

      // Pulsating light intensity
      pointLightRef.current.intensity = 1.5 + Math.sin(t * 2.5) * 0.5

      // Subtle hovering motion for better 3D visibility
      foodRef.current.position.y = Math.sin(t * 1.5) * 0.2
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
          emissiveIntensity={0.7}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* Enhanced glow effect */}
      <mesh ref={glowRef} scale={1.5}>
        <sphereGeometry args={[0.7, 20, 20]} />
        <meshBasicMaterial color={glowColor} transparent={true} opacity={0.4} />
      </mesh>

      {/* Stronger point light for better illumination */}
      <pointLight ref={pointLightRef} color={foodColor} intensity={2} distance={4} decay={1.5} />
    </group>
  )
}
