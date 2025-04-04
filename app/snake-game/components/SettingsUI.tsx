import React from 'react'
import { Text, Box } from '@react-three/drei'
import { COLORS, MIN_GRID_SIZE, MAX_GRID_SIZE } from '../utils'

interface SettingsUIProps {
  gridSize: number
  setGridSize: (size: number) => void
  gameSpeed: number
  setGameSpeed: (speed: number) => void
  isVisible: boolean
}

export function SettingsUI({
  gridSize,
  setGridSize,
  gameSpeed,
  setGameSpeed,
  isVisible,
}: SettingsUIProps) {
  if (!isVisible) return null

  return (
    <group position={[0, 0, 10]}>
      {/* Settings Title */}
      <Text
        position={[0, 3, 0]}
        color={COLORS.text}
        fontSize={1}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.05}
        outlineColor="#000"
      >
        Game Settings
      </Text>

      {/* Grid Size */}
      <Text
        position={[0, 1.5, 0]}
        color={COLORS.text}
        fontSize={0.6}
        anchorX="center"
        anchorY="middle"
      >
        Grid Size: {gridSize}x{gridSize}x{gridSize}
      </Text>

      {/* Grid Size Controls */}
      <group position={[0, 0.5, 0]}>
        <Text
          position={[-2.5, 0, 0]}
          color={COLORS.text}
          fontSize={0.5}
          anchorX="center"
          anchorY="middle"
          onClick={() => gridSize > MIN_GRID_SIZE && setGridSize(gridSize - 1)}
        >
          [ - ]
        </Text>
        <Box position={[0, 0, 0]} args={[4, 0.5, 0.1]}>
          <meshBasicMaterial color={COLORS.grid} />
        </Box>
        <Box
          position={[
            ((gridSize - MIN_GRID_SIZE) / (MAX_GRID_SIZE - MIN_GRID_SIZE)) * 4 - 2,
            0,
            0.1,
          ]}
          args={[0.3, 0.7, 0.2]}
        >
          <meshBasicMaterial color={COLORS.buttonHighlight} />
        </Box>
        <Text
          position={[2.5, 0, 0]}
          color={COLORS.text}
          fontSize={0.5}
          anchorX="center"
          anchorY="middle"
          onClick={() => gridSize < MAX_GRID_SIZE && setGridSize(gridSize + 1)}
        >
          [ + ]
        </Text>
      </group>

      {/* Game Speed */}
      <Text
        position={[0, -1, 0]}
        color={COLORS.text}
        fontSize={0.6}
        anchorX="center"
        anchorY="middle"
      >
        Game Speed: {gameSpeed.toFixed(1)}
      </Text>

      {/* Speed Controls */}
      <group position={[0, -2, 0]}>
        <Text
          position={[-2.5, 0, 0]}
          color={COLORS.text}
          fontSize={0.5}
          anchorX="center"
          anchorY="middle"
          onClick={() => gameSpeed > 1 && setGameSpeed(gameSpeed - 0.5)}
        >
          [ - ]
        </Text>
        <Box position={[0, 0, 0]} args={[4, 0.5, 0.1]}>
          <meshBasicMaterial color={COLORS.grid} />
        </Box>
        <Box position={[((gameSpeed - 1) / 5) * 4 - 2, 0, 0.1]} args={[0.3, 0.7, 0.2]}>
          <meshBasicMaterial
            color={
              gameSpeed < 3
                ? COLORS.difficultyEasy
                : gameSpeed < 5
                  ? COLORS.difficultyMedium
                  : COLORS.difficultyHard
            }
          />
        </Box>
        <Text
          position={[2.5, 0, 0]}
          color={COLORS.text}
          fontSize={0.5}
          anchorX="center"
          anchorY="middle"
          onClick={() => gameSpeed < 6 && setGameSpeed(gameSpeed + 0.5)}
        >
          [ + ]
        </Text>
      </group>

      {/* Close button */}
      <Text
        position={[0, -3.5, 0]}
        color={COLORS.buttonHighlight}
        fontSize={0.6}
        anchorX="center"
        anchorY="middle"
      >
        [Close Settings]
      </Text>
    </group>
  )
}
