import { db } from './db'

const findConversation = async (memberOneID: string, memberTwoID: string) => {
  try {
    const conversation = await db.conversation_tbl.findFirst({
      where: {
        AND: [{ memberOneID }, { memberTwoID }]
      },
      include: {
        memberOne: {
          include: {
            profile: true
          }
        },
        memberTwo: {
          include: {
            profile: true
          }
        }
      }
    })

    return conversation
  } catch (error) {
    console.log('ERROR FIND CONVERSATION: ', error)
    return null
  }
}

const createConversation = async (memberOneID: string, memberTwoID: string) => {
  try {
    return await db.conversation_tbl.create({
      data: {
        memberOneID,
        memberTwoID
      },
      include: {
        memberOne: {
          include: { profile: true }
        },
        memberTwo: {
          include: {
            profile: true
          }
        }
      }
    })
  } catch (error) {
    console.log('ERROR CREATE CONVERSATION: ', error)
    return null
  }
}

const getOrCreateConvesation = async (
  memberOneID: string,
  memberTwoID: string
) => {
  let conversation =
    (await findConversation(memberOneID, memberTwoID)) ||
    (await findConversation(memberTwoID, memberOneID))
  if (!conversation) {
    conversation = await createConversation(memberOneID, memberTwoID)
  }
  return conversation
}

export { findConversation, createConversation, getOrCreateConvesation }
