import { auth } from "@clerk/nextjs/server"
import { db } from "./db"


const currentProfile = async () => {
  const { userId } = auth()

  if (!userId) return null

  const profile = await db.profile_tbl.findUnique({
    where: { userID: userId }
  })

  return profile
}

export { currentProfile }