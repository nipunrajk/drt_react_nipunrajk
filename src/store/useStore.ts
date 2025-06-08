import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AppState {
  selected: number[]
  add: (id: number) => void
  remove: (id: number) => void
  clear: () => void
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      selected: [],
      add: (id) =>
        set((state) => ({
          selected:
            state.selected.length < 10 && !state.selected.includes(id)
              ? [...state.selected, id]
              : state.selected,
        })),
      remove: (id) =>
        set((state) => ({
          selected: state.selected.filter((x) => x !== id),
        })),
      clear: () => set({ selected: [] }),
    }),
    {
      name: 'satellite-storage',
      partialize: (state) => ({ selected: state.selected }),
    }
  )
)
