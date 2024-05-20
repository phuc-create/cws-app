import React from 'react'
import { X } from 'lucide-react'
import Image from 'next/image'

import { OurFileRouter } from '../app/api/uploadthing/core'
import { UploadDropzone } from '../lib/uploadthing'
import "@uploadthing/react/styles.css"
interface FileUploadProps {
  endpoint: keyof OurFileRouter,
  onChange: (url?: string) => void
  value: string

}
const FileUpload: React.FC<FileUploadProps> = ({ endpoint, value, onChange }) => {
  const fileType = value.split(".").pop()
  if (value && fileType !== "pdf") {
    return <div className='relative h-20 w-20 '>
      <Image fill src={value} alt='Upload' className='rounded-full' />
      <X className='absolute cursor-pointer w-6 h-6 top-0 right-0 bg-red-500 rounded-full text-white' onClick={() => onChange("")} />
    </div>
  }
  return (
    <UploadDropzone
      endpoint={endpoint} onClientUploadComplete={(res) => {
        onChange?.(res?.[0].url)
      }}
      onUploadError={(err) => {
        console.log(err)
      }} />
  )
}

export default FileUpload