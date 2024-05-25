import { Server as NetServer } from 'http'
import { NextApiRequest } from 'next'

import { Server as IOServer } from 'socket.io'

import { NextAPIServerResponseIO } from '../../../types'

export const config = {
  api: {
    bodyParser: false
  }
}

const ioHandler = (req: NextApiRequest, res: NextAPIServerResponseIO) => {
  if (!res.socket.server.io) {
    const path = '/api/socket/io'
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const httpServer: NetServer = res.socket.server as any
    const io = new IOServer(httpServer, { path, addTrailingSlash: false })
    res.socket.server.io = io
  }
  res.end()
}

export default ioHandler
