// Define the type for gender data
export type GenderDataItem = {
    value: number
    label: string
  }
  
  // Props interface
export  interface GenderChartProps {
    data: GenderDataItem[]
}