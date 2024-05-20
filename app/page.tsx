import { Button } from "../components/ui/button"
import { UserButton } from "@clerk/nextjs"
import { ModeToggle } from "../components/mode-toggle"
import { initialProfile } from "../lib/initial-profile"
import { db } from "../lib/db"
import { redirect } from "next/navigation"
import CreateServerModal from "../components/modals/create-server-modal"

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
    <main>
      <CreateServerModal />
      {/* hello chat with sam project
      <UserButton afterSignOutUrl="/sign-in" />
      <ModeToggle />
      <Button>Hello</Button> */}
    </main>
  )
}
