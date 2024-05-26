import { create } from 'zustand'
import { ServerWithMemberWithProfile } from '../types'
import { channel_tbl, CHANNEL_TYPE } from '@prisma/client'

export type ModalType =
  | 'create-server'
  | 'create-channel'
  | 'delete-channel'
  | 'edit-channel'
  | 'members'
  | 'update-server'
  | 'leave-server'
  | 'delete-server'
  | 'invite'
  | 'message-file'
  | 'message-delete'
  | null
interface ModalData {
  server?: ServerWithMemberWithProfile
  channel?: channel_tbl
  channelType?: CHANNEL_TYPE
  apiURL?: string
  query?: Record<string, any>
}
export type ModalStore = {
  type: ModalType
  isOpen: boolean
  data: ModalData
  // eslint-disable-next-line no-unused-vars
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
