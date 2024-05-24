import { Menu } from 'lucide-react'
import React from 'react'
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet'
import NavigationSidebar from './navigation/navigation-sidebar'
import ServerSidebar from './server/server-sidebar'
import { Button } from './ui/button'

interface MobileToggleProps {
  serverID: string
}

const MobileToggle = ({ serverID }: MobileToggleProps) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant={'ghost'} className="md:hidden">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side={'left'} className="flex gap-0 bg-inherit p-0">
        <div className="w-[72px]">
          <NavigationSidebar />
        </div>
        <ServerSidebar serverID={serverID} />
      </SheetContent>
    </Sheet>
  )
}

export default MobileToggle
