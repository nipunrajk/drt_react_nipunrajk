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

  const toggleCategory = (categoryId: string) => {
    if (categoryId === 'all') {
      onSelectCategories([])
      return
    }

    if (selectedCategories.includes(categoryId)) {
      onSelectCategories(selectedCategories.filter((id) => id !== categoryId))
    } else {
      onSelectCategories([...selectedCategories, categoryId])
    }
  }

  return (
    <div className='flex gap-4 mb-4'>
      {categories.map(({ id, label, count }) => (
        <button
          key={id}
          onClick={() => toggleCategory(id)}
          className={`px-4 py-2 rounded-full transition-colors ${
            id === 'all'
              ? selectedCategories.length === 0
                ? 'bg-primary text-[#0a192f] font-semibold'
                : 'bg-[#112240] text-white hover:bg-[#233554]'
              : selectedCategories.includes(id)
              ? 'bg-primary text-[#0a192f] font-semibold'
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
