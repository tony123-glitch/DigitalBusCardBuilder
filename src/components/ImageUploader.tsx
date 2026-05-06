'use client'

import { useState, useRef } from 'react'
import { uploadImage } from '@/app/actions/upload'
import { Upload, X, Loader2, ImageIcon } from 'lucide-react'

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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file.')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB.')
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
    }
  }

  // Determine preview container dimensions
  const previewClass =
    aspectRatio === 'square' ? 'aspect-square max-w-[120px]' :
    aspectRatio === 'video'  ? 'aspect-video w-full max-w-[220px]' :
    'aspect-video w-full max-w-[220px]'

  const uploadZoneClass =
    aspectRatio === 'square' ? 'aspect-square max-w-[120px]' :
    aspectRatio === 'video'  ? 'aspect-video w-full' :
    'aspect-video w-full'

  return (
    <div className="space-y-2">
      {/* Label + description */}
      <div>
        <p className="text-xs font-semibold text-slate-700">{label}</p>
        {description && <p className="text-[11px] text-slate-400 mt-0.5">{description}</p>}
      </div>

      <input type="hidden" name={name} value={url} />
      {error && <p className="text-[11px] font-medium text-red-500">{error}</p>}

      {url ? (
        /* Preview with hover controls */
        <div className={`relative group rounded-xl overflow-hidden border border-slate-200 bg-slate-50 ${previewClass}`}>
          <img src={url} alt="Preview" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="h-8 px-3 text-xs font-semibold bg-white text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
            >
              Change
            </button>
            <button
              type="button"
              onClick={() => setUrl('')}
              className="h-8 w-8 bg-red-500 text-white rounded-lg flex items-center justify-center hover:bg-red-600 transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      ) : (
        /* Upload zone */
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className={`w-full rounded-xl border-2 border-dashed border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 transition-all flex flex-col items-center justify-center gap-2 text-slate-400 active:scale-[0.99] ${uploadZoneClass}`}
        >
          {isUploading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
              <span className="text-xs font-medium text-blue-600">Uploading...</span>
            </>
          ) : (
            <>
              <div className="p-2.5 bg-white rounded-xl shadow-sm border border-slate-100">
                <ImageIcon className="h-4 w-4 text-slate-400" />
              </div>
              <span className="text-xs font-medium text-slate-500">Tap to upload</span>
            </>
          )}
        </button>
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        capture="environment"
        className="hidden"
      />
    </div>
  )
}
