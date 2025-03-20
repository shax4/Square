
// Define the data structure
export interface BubbleData {
    value: number
    label: string
  }
  
export interface BubbleChartProps {
    data: BubbleData[]
    width?: number
    height?: number
    minRadius?: number
    maxRadius?: number
    padding?: number
    maxIterations?: number
}

export interface Bubble {
    id: number
    data: BubbleData
    radius: number
    x: number
    y: number
    color: string
}