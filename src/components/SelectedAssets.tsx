import React, { useTransition } from 'react'
import { useStore } from '../store/useStore'
import type { Satellite } from '../types'
import { useNavigate } from 'react-router-dom'

interface SelectedAssetsProps {
  satellites: Satellite[]
}

const SelectedAssets: React.FC<SelectedAssetsProps> = ({ satellites }) => {
  const selected = useStore((s) => s.selected)
  const remove = useStore((s) => s.remove)
  const clear = useStore((s) => s.clear)
  const navigate = useNavigate()
  const [isPending, startTransition] = useTransition()

  const selectedSatellites = satellites.filter((sat) =>
    selected.includes(sat.noradCatId)
  )

  const handleProceed = () => {
    startTransition(async () => {
      // You could add any async operations here before navigation
      // For example, saving the selection to an API
      navigate('/selected-assets')
    })
  }

  return (
    <div className='h-full bg-[#020c1b] text-white p-6 flex flex-col'>
      <h1 className='text-[2rem] font-light mb-4'>Selected Assets</h1>

      {/* Header with count and clear button */}
      <div className='flex items-center justify-between mb-4'>
        <span className='text-[#64ffda] text-lg'>
          {selected.length} objects selected
        </span>
        <button
          onClick={clear}
          className='text-[#64ffda] hover:text-white flex items-center gap-2 text-base'
        >
          Clear all <span className='text-lg'>×</span>
        </button>
      </div>

      {/* Selected items box */}
      <div className='flex-1 mb-4 relative'>
        <div className='absolute inset-0 rounded-lg border border-[#64ffda]/20 shadow-[0_0_20px_rgba(100,255,218,0.05)]' />
        <div className='h-full overflow-auto relative'>
          <div className='flex flex-col divide-y divide-[#64ffda]/10'>
            {selectedSatellites.map((sat) => (
              <div
                key={sat.noradCatId}
                className='flex justify-between items-center px-3 py-2 hover:bg-[#64ffda]/5 transition-colors group'
              >
                <div className='flex items-center gap-8'>
                  <span className='text-white/90 font-mono text-sm'>
                    {sat.noradCatId}
                  </span>
                  <span className='text-white/90 text-sm font-medium'>
                    {sat.name}
                  </span>
                </div>
                <button
                  onClick={() => remove(sat.noradCatId)}
                  className='text-[#64ffda] text-2xl ml-2 opacity-0 group-hover:opacity-100 transition-opacity'
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Proceed button */}
      <button
        onClick={handleProceed}
        disabled={isPending || selected.length === 0}
        className='w-full py-3 bg-[#64ffda] text-[#0a192f] rounded-lg text-base font-medium 
          hover:bg-[#4cd8b9] transition-colors uppercase tracking-wider disabled:opacity-50 
          disabled:cursor-not-allowed'
      >
        {isPending ? 'Processing...' : 'PROCEED'}
      </button>
    </div>
  )
}

export default SelectedAssets
