import React from 'react'
import { FileIcon, X } from 'lucide-react'
import Image from 'next/image'

import { OurFileRouter } from '../app/api/uploadthing/core'
import { UploadDropzone } from '../lib/uploadthing'
import '@uploadthing/react/styles.css'
interface FileUploadProps {
  endpoint: keyof OurFileRouter
  onChange: (url?: string) => void
  value: string
}
const FileUpload: React.FC<FileUploadProps> = ({
  endpoint,
  value,
  onChange
}) => {
  const fileType = value.split('.').pop()
  if (value && fileType === 'pdf') {
    return (
      <div className="relative mt-2 flex items-center rounded-md bg-background/10 p-2">
        <FileIcon className="h-10 w-10 rounded-full fill-indigo-200 stroke-emerald-400 object-cover" />
        <a
          href={value}
          className="ml-2 text-sm text-emerald-500 hover:underline"
          target="_blank"
          rel="noopener roreferrer"
          onClick={() => onChange('')}
        >
          {value}
        </a>
        <button
          className="absolute -right-2 -top-2 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-red-500 text-white"
          onClick={() => onChange('')}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    )
  }
  if (value && fileType !== 'pdf') {
    return (
      <div className="relative h-20 w-20 ">
        <Image
          fill
          src={value}
          alt="Upload"
          sizes="300"
          className="rounded-full object-cover"
        />
        <button
          className="absolute right-0 top-0 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-red-500 text-white"
          onClick={() => onChange('')}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    )
  }
  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={res => {
        onChange?.(res?.[0].url)
      }}
      onUploadError={err => {
        console.log(err)
      }}
    />
  )
}

export default FileUpload
