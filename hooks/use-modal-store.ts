import { create } from 'zustand'

export type ModalType = "create-server" | "update-server" | null
export type ModalStore = {
  type: ModalType,
  isOpen: boolean,
  onOpen: (type: ModalType) => void
  onClose: () => void
}

export const useModal = create<ModalStore>((set) => ({
  type: null,
  isOpen: false,
  onOpen: (type) => set({ isOpen: true, type }),
  onClose: () => set({ isOpen: false, type: null })
}))