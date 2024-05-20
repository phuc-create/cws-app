import React from 'react'
interface ServerPageProps {
  params: {
    serverID: string
  }
}
const ServerPage: React.FC<ServerPageProps> = ({ params }) => {
  return (
    <div>ServerPage: {params.serverID}</div>
  )
}

export default ServerPage