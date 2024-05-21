import { server_tbl } from '@prisma/client'
import { create } from 'zustand'
import { ServerWithMemberWithProfile } from '../types'

export type ModalType = "create-server" | "create-channel" | "members" | "update-server" | "invite" | null
interface ModalData {
  server?: ServerWithMemberWithProfile
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