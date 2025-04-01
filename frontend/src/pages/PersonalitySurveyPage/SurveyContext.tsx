// ✅ 선택지(OptionCircle) 상태 관리를 위한 Context (Props Drilling 해결)
import type React from "react"
import { createContext, useContext, useState, useCallback } from "react"

type SurveyContextType = {
  selectedOptions: { [key: number]: number }
  handleSelect: (questionId: number, optionIndex: number) => void
}

const SurveyContext = createContext<SurveyContextType | undefined>(undefined)

export const SurveyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedOptions, setSelectedOptions] = useState<{ [key: number]: number}>({})

  const handleSelect = useCallback((questionId: number, optionIndex: number) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }))
    console.log(`Question ${questionId}, optionIndex: ${optionIndex}`)
  }, [])

  return <SurveyContext.Provider value={{ selectedOptions, handleSelect }}>{children}</SurveyContext.Provider>
}

export const useSurvey = () => {
  const context = useContext(SurveyContext)
  if (context === undefined) {
    throw new Error("useSurvey must be used within a SurveyProvider")
  }
  return context
}