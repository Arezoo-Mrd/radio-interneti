"use client"

import { useState, type KeyboardEvent } from "react"
import { X } from "lucide-react"
import { Input } from "@/components/ui/input"

import { Button } from "@/components/ui/button"

interface MultiInputProps {
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
  className?: string
}

export function MultiInput({ value, onChange, placeholder, className }: MultiInputProps) {
  const [inputValue, setInputValue] = useState("")

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault()
      if (!value.includes(inputValue.trim())) {
        onChange([...value, inputValue.trim()])
      }
      setInputValue("")
    } else if (e.key === "Backspace" && !inputValue && value.length > 0) {
      onChange(value.slice(0, -1))
    }
  }

  const removeTag = (indexToRemove: number) => {
    onChange(value.filter((_, index) => index !== indexToRemove))
  }

  return (
    <div className={`flex flex-wrap gap-2 p-3 border border-gray-200 rounded-md bg-white min-h-[42px] ${className}`}>
      {value.map((tag, index) => (
        <div
          key={index}

          className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-800 hover:bg-gray-200"
        >
          <span className="text-sm">{tag}</span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-4 w-4 p-0 hover:bg-gray-300 rounded-full"
            onClick={() => removeTag(index)}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ))}
      <Input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={value.length === 0 ? placeholder : ""}
        className="flex-1 border-none shadow-none focus-visible:ring-0 min-w-[120px] text-right"
        dir="rtl"
      />
    </div>
  )
}
