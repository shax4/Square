"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { View, StyleSheet, Dimensions, ScrollView } from "react-native"
import { styles } from "./BubbleChart.styles";
import { BubbleChartProps, Bubble } from "./BubbleChart.types";
import Text from '../../../../components/Common/Text';

const colors = ["#00AEFF", "#6541F2", "#F553DA", "#CB59FF", "#FFA500", "#FF4500", "#32CD32", "#8A2BE2"]

const BubbleChart: React.FC<BubbleChartProps> = ({
  data,
  width = Dimensions.get("window").width * 0.7,
  height = 400,
  minRadius = 30,
  maxRadius = 100,
  padding = 5, // Minimum space between bubbles
  maxIterations = 100, // Maximum number of iterations for collision resolution
}) => {
  const [bubbles, setBubbles] = useState<Bubble[]>([])

  function formatBubbleData(data: { value: number; label: string }[]) {
    // value 기준 내림차순 정렬
    const sorted = [...data].sort((a, b) => b.value - a.value);

    // 3개 이하면 그대로 반환
    if (sorted.length <= 3) return sorted;

    const topThree = sorted.slice(0, 3);
    const otherTotal = sorted.slice(3).reduce((sum, item) => sum + item.value, 0);

    return otherTotal > 0
      ? [...topThree, { value: otherTotal, label: "기타" }]
      : topThree;
  }

  // Calculate bubble sizes and positions with collision avoidance
  useEffect(() => {
    if (!data || data.length === 0) return

    const formattedData = formatBubbleData(data);

    const total = formattedData.reduce((sum, item) => sum + item.value, 0)

    // Initial bubble creation with sizes but no positions yet
    const initialBubbles: Bubble[] = formattedData.map((item, index) => {
      // Calculate radius based on value percentage
      const percentage = item.value / total
      const radius = minRadius + percentage * (maxRadius - minRadius)

      return {
        id: index,
        data: item,
        radius,
        x: 0, // Will be set during positioning
        y: 0, // Will be set during positioning
        color: colors[index % colors.length],
      }
    })

    // Sort bubbles by size (largest first) for better placement
    const sortedBubbles = [...initialBubbles].sort((a, b) => b.radius - a.radius)

    // Position bubbles using force-directed placement
    const positionedBubbles = positionBubblesWithoutOverlap(sortedBubbles, width, height, maxIterations, padding)

    setBubbles(positionedBubbles)
  }, [data, width, height, minRadius, maxRadius, padding, maxIterations])

  // Position bubbles without overlap using force-directed placement
  const positionBubblesWithoutOverlap = (
    bubbles: Bubble[],
    width: number,
    height: number,
    maxIterations: number,
    padding: number,
  ): Bubble[] => {
    // Deep copy bubbles to avoid mutating the original
    const result = JSON.parse(JSON.stringify(bubbles)) as Bubble[]

    // Initial placement - start with a grid-like arrangement
    result.forEach((bubble, i) => {
      // Place the first bubble in the center
      if (i === 0) {
        bubble.x = width / 2
        bubble.y = height / 2
        return
      }

      // Try to find a position with minimal overlap
      let bestX = 0
      let bestY = 0
      let minOverlaps = Number.POSITIVE_INFINITY

      // Try several random positions and pick the best one
      for (let attempt = 0; attempt < 20; attempt++) {
        const testX = bubble.radius + Math.random() * (width - 2 * bubble.radius)
        const testY = bubble.radius + Math.random() * (height - 2 * bubble.radius)

        let overlaps = 0
        for (let j = 0; j < i; j++) {
          const other = result[j]
          const dx = testX - other.x
          const dy = testY - other.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          if (distance < bubble.radius + other.radius + padding) {
            overlaps++
          }
        }

        if (overlaps < minOverlaps) {
          minOverlaps = overlaps
          bestX = testX
          bestY = testY

          // If we found a position with no overlaps, use it immediately
          if (overlaps === 0) break
        }
      }

      bubble.x = bestX
      bubble.y = bestY
    })

    // Iteratively adjust positions to reduce overlaps
    for (let iteration = 0; iteration < maxIterations; iteration++) {
      let moved = false

      // For each bubble
      for (let i = 0; i < result.length; i++) {
        const bubble = result[i]
        let fx = 0 // Force in x direction
        let fy = 0 // Force in y direction

        // Calculate repulsive forces from other bubbles
        for (let j = 0; j < result.length; j++) {
          if (i === j) continue

          const other = result[j]
          const dx = bubble.x - other.x
          const dy = bubble.y - other.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          const minDistance = bubble.radius + other.radius + padding

          // If bubbles overlap, calculate repulsive force
          if (distance < minDistance) {
            const force = (minDistance - distance) / distance
            fx += dx * force * 0.05 // Scale force for smoother movement
            fy += dy * force * 0.05
            moved = true
          }
        }

        // Add forces to keep bubbles within bounds
        const margin = bubble.radius + padding
        if (bubble.x < margin) fx += (margin - bubble.x) * 0.1
        if (bubble.x > width - margin) fx -= (bubble.x - (width - margin)) * 0.1
        if (bubble.y < margin) fy += (margin - bubble.y) * 0.1
        if (bubble.y > height - margin) fy -= (bubble.y - (height - margin)) * 0.1

        // Apply forces
        bubble.x += fx
        bubble.y += fy
      }

      // If no bubble moved, we're done
      if (!moved) break
    }

    // Final check to ensure bubbles are within bounds
    result.forEach((bubble) => {
      bubble.x = Math.max(bubble.radius, Math.min(width - bubble.radius, bubble.x))
      bubble.y = Math.max(bubble.radius, Math.min(height - bubble.radius, bubble.y))
    })

    return result
  }

  return (
    <ScrollView contentContainerStyle={[styles.container, { width, height }]}>
      {bubbles.map((bubble) => (
        <View
          key={bubble.id}
          style={[
            styles.bubbleContainer,
            {
              left: bubble.x - bubble.radius,
              top: bubble.y - bubble.radius,
              width: bubble.radius * 2,
              height: bubble.radius * 2,
            },
          ]}
        >
          <View
            style={[
              styles.bubble,
              {
                width: bubble.radius * 2,
                height: bubble.radius * 2,
                borderRadius: bubble.radius,
                backgroundColor: bubble.color,
              },
            ]}
          />
          <View style={styles.labelContainer}>
            <Text style={styles.valueText}>
              {`${Math.round(bubble.data.value)}%`}
            </Text>
            <Text style={styles.labelText} numberOfLines={2}>
              {bubble.data.label}
            </Text>
          </View>
        </View>
      ))}
    </ScrollView>
  )
}

export default BubbleChart

