import React from 'react'
import { currentProfile } from '../../lib/current-profile'
import { redirect } from 'next/navigation'
import { db } from '../../lib/db'
import NavigationAction from './navigation-action'
import { Separator } from '../ui/separator'
import { ScrollArea } from '../ui/scroll-area'
import NavigationItem from './navigation-item'
import { ModeToggle } from '../mode-toggle'
import { UserButton } from '@clerk/nextjs'

const NavigationSidebar = async () => {
  const profile = await currentProfile()
  if (!profile) redirect("/")

  const servers = await db.server_tbl.findMany({
    where: {
      members: {
        some: {
          profileID: profile.id
        }
      }
    }
  })

  return (
    <div className='space-y-4 flex flex-col items-center  h-full text-primary w-full bg-emerald-500 dark:bg-[#1E1F22] py-3'>
      <NavigationAction />
      <Separator className='h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto' />
      <ScrollArea className='flex-1 w-full'>
        {servers.map(server => {
          return (
            <NavigationItem key={server.id} id={server.id} name={server.name} imageURL={server.imageUrl} />
          )
        })}
      </ScrollArea>
      <div className='pb-3 mt-auto flex items-center flex-col gap-y-4'>
        <ModeToggle />
        <UserButton
          afterSignOutUrl='/'
          appearance={{
            elements: {
              avatarBox: "w-[48px] h-[48px]"
            }
          }} />
      </div>
    </div>
  )
}

export default NavigationSidebar