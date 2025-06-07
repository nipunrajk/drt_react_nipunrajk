import React, { useState } from 'react'

interface SearchBarProps {
  onSearch: (query: string) => void
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [value, setValue] = useState('')

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') onSearch(value)
  }

  return (
    <input
      type='text'
      placeholder='Search by Name/ NORAD ID'
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={handleKeyDown}
      className='w-full px-4 py-2 rounded-full bg-[#0a192f] text-white border border-[#233554] focus:border-[#64ffda] focus:outline-none placeholder-gray-400'
    />
  )
}

export default SearchBar
