'use client'

import { useState, useRef } from 'react'
import { uploadImage } from '@/app/actions/upload'
import { Upload, X, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

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

    // Quick validation
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file.')
      return
    }
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setError('Image must be less than 5MB.')
      return
    }

    setIsUploading(true)
    setError('')

    const formData = new FormData()
    formData.append('file', file)
    if (contextSlug) {
      formData.append('contextSlug', contextSlug)
    }

    try {
      const res = await uploadImage(formData)
      if (res.error) {
        setError(res.error)
      } else if (res.url) {
        setUrl(res.url)
      }
    } catch (err) {
      setError('Upload failed. Check your network connection.')
    } finally {
      setIsUploading(false)
      // Reset input so the same file can be selected again if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const ratioClass = 
    aspectRatio === 'square' ? 'aspect-square max-w-[150px]' : 
    aspectRatio === 'video' ? 'aspect-video max-w-[250px]' : 
    'aspect-video max-w-[200px]'

  return (
    <div className="space-y-2">
      <div className="flex flex-col">
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {label}
        </label>
        {description && <span className="text-xs text-slate-500 mt-1">{description}</span>}
      </div>
      
      {/* Hidden input to pass the final URL to the parent form */}
      <input type="hidden" name={name} value={url} />
      
      {error && <p className="text-xs font-medium text-red-500">{error}</p>}
      
      {url ? (
        <div className={`relative group rounded-xl overflow-hidden border border-slate-200 bg-slate-50 w-full flex items-center justify-center ${ratioClass}`}>
          <img src={url} alt="Preview" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[2px]">
            <Button type="button" size="sm" variant="secondary" onClick={() => fileInputRef.current?.click()} className="shadow-sm">
              Change
            </Button>
            <Button type="button" size="icon" variant="destructive" onClick={() => setUrl('')} className="shadow-sm h-9 w-9">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className={`w-full rounded-xl border-2 border-dashed border-slate-200 hover:border-slate-400 hover:bg-slate-50 transition-all flex flex-col items-center justify-center gap-3 text-slate-500 active:scale-[0.98] ${ratioClass}`}
        >
          {isUploading ? (
            <>
              <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
              <span className="text-xs font-semibold text-blue-600">Uploading...</span>
            </>
          ) : (
            <>
              <div className="p-3 bg-white rounded-full shadow-sm ring-1 ring-slate-900/5">
                <Upload className="h-5 w-5 text-slate-400" />
              </div>
              <span className="text-xs font-medium">Tap to upload image</span>
            </>
          )}
        </button>
      )}
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
    </div>
  )
}
