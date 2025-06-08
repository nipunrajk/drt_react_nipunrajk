import React from 'react'
import type { Satellite } from '../types'

interface CategoryFilterProps {
  data: Satellite[]
  selectedCategories: string[]
  onSelectCategories: (categories: string[]) => void
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  data,
  selectedCategories,
  onSelectCategories,
}) => {
  // Calculate counts for each category
  const counts = {
    all: data.length,
    PAYLOAD: data.filter((item) => item.objectType === 'PAYLOAD').length,
    DEBRIS: data.filter((item) => item.objectType === 'DEBRIS').length,
    'ROCKET BODY': data.filter((item) => item.objectType === 'ROCKET BODY')
      .length,
    UNKNOWN: data.filter((item) => item.objectType === 'UNKNOWN').length,
  }

  const categories = [
    { id: 'all', label: 'All Objects', count: counts.all },
    { id: 'PAYLOAD', label: 'Payloads', count: counts.PAYLOAD },
    { id: 'DEBRIS', label: 'Debris', count: counts.DEBRIS },
    { id: 'ROCKET BODY', label: 'Rocket Bodies', count: counts['ROCKET BODY'] },
    { id: 'UNKNOWN', label: 'Unknown', count: counts.UNKNOWN },
  ]

  const handleCategoryClick = (categoryId: string) => {
    if (categoryId === 'all') {
      // If 'all' is clicked, clear all selections
      onSelectCategories([])
      return
    }

    const newCategories = selectedCategories.includes(categoryId)
      ? selectedCategories.filter((c) => c !== categoryId)
      : [...selectedCategories, categoryId]
    onSelectCategories(newCategories)
  }

  return (
    <div className='flex gap-4 mb-4 flex-wrap'>
      {categories.map(({ id, label, count }) => (
        <button
          key={id}
          onClick={() => handleCategoryClick(id)}
          className={`px-4 py-2 rounded-full transition-colors ${
            (id === 'all' && selectedCategories.length === 0) ||
            selectedCategories.includes(id)
              ? 'bg-[#64ffda] text-[#0a192f] font-semibold'
              : 'bg-[#112240] text-white hover:bg-[#233554]'
          }`}
        >
          {label} ({count})
        </button>
      ))}
    </div>
  )
}

export default CategoryFilter
