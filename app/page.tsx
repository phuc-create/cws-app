import { Button } from "../components/ui/button"
import { UserButton } from "@clerk/nextjs"
import { ModeToggle } from "../components/mode-toggle"
import { initialProfile } from "../lib/initial-profile"
import { db } from "../lib/db"
import { redirect } from "next/navigation"
import CreateServerModal from "../components/modals/create-server-modal"
import OpenCreateServer from "./_components/open-create-server"
import NavigationSidebar from "../components/navigation/navigation-sidebar"

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
      <div className="hidden md:flex h-full w-[72px] z-30 flex-col fixed inset-y-0">
        <NavigationSidebar />
      </div>
      <main className="md:pl-[72px] h-full">

        <OpenCreateServer />
        <CreateServerModal />
      </main>
    </div>
  )
}
