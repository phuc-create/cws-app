import { server_tbl } from '@prisma/client'
import { create } from 'zustand'

export type ModalType = "create-server" | "update-server" | "invite" | null
interface ModalData {
  server?: server_tbl
}
export type ModalStore = {
  type: ModalType,
  isOpen: boolean,
  data: ModalData
  onOpen: (type: ModalType, data?: ModalData) => void
  onClose: () => void
}

export const useModal = create<ModalStore>((set) => ({
  type: null,
  isOpen: false,
  data: {},
  onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
  onClose: () => set({ isOpen: false, type: null, data: {} })
}))