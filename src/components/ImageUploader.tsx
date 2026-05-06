'use client'

import { useState, useRef, useCallback } from 'react'
import { uploadImage } from '@/app/actions/upload'
import { Loader2, ImageIcon, Camera, FolderOpen, X, RefreshCw, Check } from 'lucide-react'
import Cropper from 'react-easy-crop'
import getCroppedImg from '@/utils/cropImage'

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

  // Cropping State
  const [imageToCrop, setImageToCrop] = useState<string | null>(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file.')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('Image must be under 10MB.')
      return
    }

    setError('')

    // Read the file as a Data URL for the cropper
    const reader = new FileReader()
    reader.addEventListener('load', () => {
      setImageToCrop(reader.result?.toString() || null)
    })
    reader.readAsDataURL(file)

    // Reset inputs
    if (fileInputRef.current) fileInputRef.current.value = ''
    if (cameraInputRef.current) cameraInputRef.current.value = ''
  }

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const handleConfirmCrop = async () => {
    if (!imageToCrop || !croppedAreaPixels) return

    try {
      setIsUploading(true)
      const croppedFile = await getCroppedImg(imageToCrop, croppedAreaPixels)
      setImageToCrop(null) // Close cropper modal immediately
      
      if (!croppedFile) {
        throw new Error("Failed to crop image")
      }

      const formData = new FormData()
      formData.append('file', croppedFile)
      if (contextSlug) formData.append('contextSlug', contextSlug)

      const res = await uploadImage(formData)
      if (res.error) {
        setError(res.error)
      } else if (res.url) {
        setUrl(res.url)
      }
    } catch (e) {
      console.error(e)
      setError('Upload failed. Check your connection.')
      setIsUploading(false)
    } finally {
      setIsUploading(false)
    }
  }

  const isSquare = aspectRatio === 'square'
  const previewClass = isSquare ? 'aspect-square w-28' : 'aspect-video w-full'
  const zoneClass = isSquare ? 'aspect-square w-28' : 'aspect-video w-full'

  // Determine crop aspect ratio for react-easy-crop
  const cropAspect = isSquare ? 1 : aspectRatio === 'video' ? 16 / 9 : 3 / 1 // Default to 3:1 for banners

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
      <input ref={cameraInputRef} type="file" accept="image/*" capture="camera" onChange={handleFileChange} className="hidden" />

      {/* Cropper Modal */}
      {imageToCrop && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col">
          <div className="flex-1 relative">
            <Cropper
              image={imageToCrop}
              crop={crop}
              zoom={zoom}
              aspect={cropAspect}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
              objectFit="contain"
            />
          </div>
          <div className="h-24 bg-zinc-950 px-6 flex items-center justify-between border-t border-white/10 shrink-0">
             <button
                type="button"
                onClick={() => setImageToCrop(null)}
                className="text-white/70 hover:text-white font-medium text-sm transition-colors"
             >
               Cancel
             </button>
             <button
                type="button"
                onClick={handleConfirmCrop}
                className="flex items-center gap-2 bg-white text-black px-6 py-2.5 rounded-full font-semibold text-sm hover:bg-zinc-200 transition-colors active:scale-95"
             >
               <Check className="w-4 h-4" /> Confirm
             </button>
          </div>
        </div>
      )}

      {/* Normal View */}
      {url ? (
        /* Preview */
        <div className="flex flex-col sm:flex-row items-start gap-3 w-full">
          <div className={`relative group rounded-xl overflow-hidden border border-slate-200 bg-slate-50 shrink-0 ${isSquare ? 'aspect-square w-32' : 'aspect-video w-full sm:w-64'}`}>
            <img src={url} alt="Preview" className="w-full h-full object-cover" />
            {isUploading && (
              <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
              </div>
            )}
          </div>
          <div className="flex sm:flex-col gap-2 pt-1 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 h-9 px-4 text-xs font-semibold bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
              disabled={isUploading}
            >
              <RefreshCw className="h-3.5 w-3.5" /> Change
            </button>
            <button
              type="button"
              onClick={() => setUrl('')}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 h-9 px-4 text-xs font-semibold bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
              disabled={isUploading}
            >
              <X className="h-3.5 w-3.5" /> Remove
            </button>
          </div>
        </div>
      ) : isUploading ? (
        /* Uploading state */
        <div className={`rounded-xl border-2 border-dashed border-blue-200 bg-blue-50 flex flex-col items-center justify-center gap-2 w-full ${isSquare ? 'aspect-square max-w-[160px]' : 'aspect-video'}`}>
          <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
          <span className="text-xs font-medium text-blue-600">Uploading...</span>
        </div>
      ) : (
        /* Upload zone with two options */
        <div className={`rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 flex flex-col items-center justify-center gap-4 w-full p-6 ${isSquare ? 'aspect-square max-w-[200px] mx-auto' : 'aspect-video'}`}>
          <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-100 shrink-0">
            <ImageIcon className="h-5 w-5 text-slate-400" />
          </div>
          <div className="flex items-center gap-2 w-full justify-center">
            <button
              type="button"
              onClick={() => cameraInputRef.current?.click()}
              className="flex-1 max-w-[120px] inline-flex items-center justify-center gap-2 h-9 px-3 text-xs font-semibold bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-colors shadow-sm"
            >
              <Camera className="h-3.5 w-3.5" />
              Camera
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 max-w-[120px] inline-flex items-center justify-center gap-2 h-9 px-3 text-xs font-semibold bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-colors shadow-sm"
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
