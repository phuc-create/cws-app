"use client"
import { Plus } from 'lucide-react'
import React from 'react'
import { ActionTooltip } from '../action-tooltip'
import { useModal } from '../../hooks/use-modal-store'

const NavigationAction = () => {
  const { onOpen } = useModal()
  const handleOpenModal = () => {
    onOpen("create-server")
  }
  return (
    <div>
      <ActionTooltip side='right' align='center' label='Add new Server'>
        <button className='group flex items-center' onClick={handleOpenModal}>
          <div className='flex mx-3 h-[48px] w-[48px] rounded-[25px] group-hover:rounded-[16px] transition-all overflow-hidden items-center bg-background dark:bg-neutral-700 group-hover:bg-emerald-800 dark:group-hover:bg-emerald-500 justify-center'>
            <Plus className='group-hover:text-white transition-all text-emerald-500' size={25} />
          </div>
        </button>
      </ActionTooltip>
    </div>
  )
}

export default NavigationAction