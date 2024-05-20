import { auth, currentUser } from "@clerk/nextjs/server"
import { db } from "./db"


export const initialProfile = async () => {
  const user = await currentUser()
  if (!user) {
    return auth().redirectToSignIn()
  }

  const profile = await db.profile_tbl.findUnique({
    where: { userID: user.id }
  })

  if (profile) {
    return profile
  }

  const newProfile = await db.profile_tbl.create({
    data: {
      userID: user.id,
      name: user.firstName + " " + user.lastName,
      imageUrl: user.imageUrl,
      email: user.emailAddresses[0].emailAddress

    }
  })

  return newProfile
}