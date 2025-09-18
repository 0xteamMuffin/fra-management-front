"use client"

import React, { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { useVillages } from "@/lib/hooks/useGeographic"
import { Village } from "@/lib/types/api"
import { LoadingSpinner } from "@/components/ui/loading"

interface VillageSearchProps {
  districtId: string
  onVillageSelect: (village: Village) => void
}

export function VillageSearch({ districtId, onVillageSelect }: VillageSearchProps) {
  const [search, setSearch] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const { villages, isLoading } = useVillages(districtId, search)
  const searchContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleSelectVillage = (village: Village) => {
    onVillageSelect(village)
    setSearch(village.name)
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={searchContainerRef}>
      <Input
        placeholder="Search for a village..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onFocus={() => setIsOpen(true)}
      />
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
          <ul className="max-h-60 overflow-y-auto">
            {isLoading && <li className="px-4 py-2 text-sm text-gray-500">Loading...</li>}
            {!isLoading && villages.length === 0 && <li className="px-4 py-2 text-sm text-gray-500">No villages found</li>}
            {villages.map((village) => (
              <li
                key={village.id}
                onClick={() => handleSelectVillage(village)}
                className="px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-100"
              >
                {village.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
