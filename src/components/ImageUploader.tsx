'use client'

import { useState, useRef } from 'react'
import { uploadImage } from '@/app/actions/upload'
import { Loader2, ImageIcon, Camera, FolderOpen, X, RefreshCw } from 'lucide-react'

export interface ImageUploaderProps {
  name: string
  label: string
  defaultValue?: string
  contextSlug?: string
  description?: string
  aspectRatio?: 'square' | 'video' | 'auto'
}

export function ImageUploader({ 
  name, 
  label,
  defaultValue = '', 
  contextSlug,
  description,
  aspectRatio = 'auto'
}: ImageUploaderProps) {
  const [url, setUrl] = useState(defaultValue)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file.')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be under 5MB.')
      return
    }

    setIsUploading(true)
    setError('')

    const formData = new FormData()
    formData.append('file', file)
    if (contextSlug) formData.append('contextSlug', contextSlug)

    try {
      const res = await uploadImage(formData)
      if (res.error) {
        setError(res.error)
      } else if (res.url) {
        setUrl(res.url)
      }
    } catch {
      setError('Upload failed. Check your connection.')
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
      if (cameraInputRef.current) cameraInputRef.current.value = ''
    }
  }

  const isSquare = aspectRatio === 'square'
  const previewClass = isSquare ? 'aspect-square w-28' : 'aspect-video w-full'
  const zoneClass = isSquare ? 'aspect-square w-28' : 'aspect-video w-full'

  return (
    <div className="space-y-2">
      <div>
        <p className="text-xs font-semibold text-slate-700">{label}</p>
        {description && <p className="text-[11px] text-slate-400 mt-0.5">{description}</p>}
      </div>

      <input type="hidden" name={name} value={url} />
      {error && <p className="text-[11px] font-medium text-red-500">{error}</p>}

      {/* Hidden file inputs */}
      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
      <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" onChange={handleFileChange} className="hidden" />

      {url ? (
        /* Preview */
        <div className="flex items-start gap-3">
          <div className={`relative group rounded-xl overflow-hidden border border-slate-200 bg-slate-50 shrink-0 ${previewClass}`}>
            <img src={url} alt="Preview" className="w-full h-full object-cover" />
            {isUploading && (
              <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2 pt-1">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 h-8 px-3 text-xs font-semibold bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
            >
              <RefreshCw className="h-3 w-3" /> Change
            </button>
            <button
              type="button"
              onClick={() => setUrl('')}
              className="inline-flex items-center gap-1.5 h-8 px-3 text-xs font-semibold bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
            >
              <X className="h-3 w-3" /> Remove
            </button>
          </div>
        </div>
      ) : isUploading ? (
        /* Uploading state */
        <div className={`rounded-xl border-2 border-dashed border-blue-200 bg-blue-50 flex flex-col items-center justify-center gap-2 ${zoneClass}`}>
          <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
          <span className="text-xs font-medium text-blue-600">Uploading...</span>
        </div>
      ) : (
        /* Upload zone with two options */
        <div className={`rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 flex flex-col items-center justify-center gap-3 ${zoneClass}`}>
          <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-100">
            <ImageIcon className="h-4 w-4 text-slate-400" />
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => cameraInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 h-8 px-3 text-xs font-semibold bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-colors shadow-sm"
            >
              <Camera className="h-3.5 w-3.5" />
              Camera
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 h-8 px-3 text-xs font-semibold bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-colors shadow-sm"
            >
              <FolderOpen className="h-3.5 w-3.5" />
              Browse
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
