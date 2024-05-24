import { initialProfile } from '../lib/initial-profile'
import { db } from '../lib/db'
import { redirect } from 'next/navigation'
import CreateServerModal from '../components/modals/create-server-modal'
import OpenCreateServer from './_components/open-create-server'
import NavigationSidebar from '../components/navigation/navigation-sidebar'

export default async function Home() {
  const profile = await initialProfile()
  const server = await db.server_tbl.findFirst({
    where: {
      members: {
        some: {
          profileID: profile.id
        }
      }
    }
  })

  if (server) {
    return redirect(`/servers/${server.id}`)
  }

  return (
    <div className="h-full">
      <div className="fixed inset-y-0 z-30 hidden h-full w-[72px] flex-col md:flex">
        <NavigationSidebar />
      </div>
      <main className="h-full md:pl-[72px]">
        <OpenCreateServer />
        <CreateServerModal />
      </main>
    </div>
  )
}
