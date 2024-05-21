"use client"
import React from 'react'
import { ActionTooltip } from '../action-tooltip'
import { cn } from '../../lib/utils'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'

interface NavigationItemProps {
  id: string,
  name: string,
  imageURL: string
}
const NavigationItem: React.FC<NavigationItemProps> = ({ id, name, imageURL }) => {
  const params = useParams()
  const router = useRouter()

  const handleChangeServer = () => {
    router.push(`/servers/${id}`)
  }
  return (
    <div>
      <ActionTooltip side='right' align='center' label={name}>
        <button onClick={handleChangeServer} className='relative group flex items-center mb-4'>
          <div className={cn("absolute left-0 bg-primary rounded-r-full transition-all w-[4px]",
            params?.serverID !== id && "group-hover:h-[20px]",
            params?.serverID === id ? "h-[36px]" : "h-[8px]"
          )} />
          <div className={cn("relative group flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden",
            params?.serverID === id && "bg-primary/10 text-primary rounded-[16px]"
          )}>
            <Image fill sizes="48" src={imageURL} alt='Server Channel' className='object-cover' />
          </div>
        </button>
      </ActionTooltip>
    </div>
  )
}

export default NavigationItem