import { create } from 'zustand'

interface AppState {
  selected: number[]
  add: (id: number) => void
  remove: (id: number) => void
}

export const useStore = create<AppState>((set) => ({
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
}))
