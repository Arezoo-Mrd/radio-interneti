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
  console.log('inputValue', inputValue)


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
    <div className={`flex flex-wrap w-full gap-2   px-2 pt-2  shadow-xs focus:border-primary-light border-slate-light border-[1px]  rounded-md bg-white  ${className}`}>
      {value.map((tag, index) => (
        <div
          key={index}

          className="flex items-center gap-1 border border-[#C1C1C1] rounded-sm px-3 py-1 bg-[#E5E5E5B2] text-[#292929] hover:bg-gray-200"
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
        className="flex-1 border-none shadow-none  px-2 py-1.5 focus-visible:ring-0 min-w-[120px] text-right"
        dir="rtl"

      />
    </div>
  )
}
