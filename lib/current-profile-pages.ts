import { getAuth } from '@clerk/nextjs/server'
import { db } from './db'
import { NextApiRequest } from 'next'

const currentProfile = async (req: NextApiRequest) => {
  const { userId } = getAuth(req)

  if (!userId) return null

  const profile = await db.profile_tbl.findUnique({
    where: { userID: userId }
  })

  return profile
}

export { currentProfile }
