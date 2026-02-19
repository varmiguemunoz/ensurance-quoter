import { create } from "zustand"

/* ------------------------------------------------------------------ */
/*  UIStore — panel visibility, sizes, and view state                  */
/* ------------------------------------------------------------------ */

export type ActiveView = "list" | "detail" | "quote"

interface PanelSizes {
  left: number
  center: number
  right: number
}

interface UIState {
  activeView: ActiveView
  leftPanelOpen: boolean
  centerPanelOpen: boolean
  rightPanelOpen: boolean
  panelSizes: PanelSizes
}

interface UIActions {
  setActiveView: (view: ActiveView) => void
  setLeftPanelOpen: (open: boolean) => void
  setCenterPanelOpen: (open: boolean) => void
  setRightPanelOpen: (open: boolean) => void
  toggleLeftPanel: () => void
  toggleCenterPanel: () => void
  toggleRightPanel: () => void
  setPanelSizes: (sizes: PanelSizes) => void
  resetPanelSizes: () => void
}

export type UIStoreType = UIState & UIActions

const DEFAULT_PANEL_SIZES: PanelSizes = {
  left: 30,
  center: 45,
  right: 25,
}

export const useUIStore = create<UIStoreType>()((set) => ({
  // State
  activeView: "list",
  leftPanelOpen: true,
  centerPanelOpen: true,
  rightPanelOpen: true,
  panelSizes: DEFAULT_PANEL_SIZES,

  // Actions
  setActiveView: (activeView) => set({ activeView }),

  setLeftPanelOpen: (leftPanelOpen) => set({ leftPanelOpen }),
  setCenterPanelOpen: (centerPanelOpen) => set({ centerPanelOpen }),
  setRightPanelOpen: (rightPanelOpen) => set({ rightPanelOpen }),

  toggleLeftPanel: () =>
    set((state) => ({ leftPanelOpen: !state.leftPanelOpen })),
  toggleCenterPanel: () =>
    set((state) => ({ centerPanelOpen: !state.centerPanelOpen })),
  toggleRightPanel: () =>
    set((state) => ({ rightPanelOpen: !state.rightPanelOpen })),

  setPanelSizes: (panelSizes) => set({ panelSizes }),
  resetPanelSizes: () => set({ panelSizes: DEFAULT_PANEL_SIZES }),
}))
