import Image from "next/image"
import { Button } from "../components/ui/button"
import { UserButton } from "@clerk/nextjs"
import { ModeToggle } from "../components/mode-toggle"

export default function Home() {
  return (
    <main>
      hello chat with sam project
      <UserButton afterSignOutUrl="/sign-in" />
      <ModeToggle />
      <Button>Hello</Button>
    </main>
  )
}
