import { create } from 'zustand'
import { ServerWithMemberWithProfile } from '../types'
import { CHANNEL_TYPE } from '@prisma/client'

export type ModalType =
  | 'create-server'
  | 'create-channel'
  | 'members'
  | 'update-server'
  | 'leave-server'
  | 'delete-server'
  | 'invite'
  | null
interface ModalData {
  server?: ServerWithMemberWithProfile
  channelType?: CHANNEL_TYPE
}
export type ModalStore = {
  type: ModalType
  isOpen: boolean
  data: ModalData
  onOpen: (type: ModalType, data?: ModalData) => void
  onClose: () => void
}

export const useModal = create<ModalStore>(set => ({
  type: null,
  isOpen: false,
  data: {},
  onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
  onClose: () => set({ isOpen: false, type: null, data: {} })
}))
