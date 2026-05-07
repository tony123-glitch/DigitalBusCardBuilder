'use client'

import { useState } from 'react'
import { Plus, X, Link as LinkIcon, Camera, MessageCircle, Briefcase, Users, Video, Code, Music, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const AVAILABLE_PLATFORMS = [
  { id: 'instagram', label: 'Instagram', icon: Camera },
  { id: 'twitter', label: 'Twitter / X', icon: MessageCircle },
  { id: 'linkedin', label: 'LinkedIn', icon: Briefcase },
  { id: 'facebook', label: 'Facebook', icon: Users },
  { id: 'youtube', label: 'YouTube', icon: Video },
  { id: 'tiktok', label: 'TikTok', icon: Music },
  { id: 'github', label: 'GitHub', icon: Code },
  { id: 'other', label: 'Other', icon: LinkIcon },
]

export interface SocialLink {
  platform: string
  url: string
}

export interface CustomButton {
  label: string
  url: string
  type?: 'link' | 'phone'  // defaults to 'link' for backwards compatibility
}

interface SocialLinksEditorProps {
  initialLinks?: SocialLink[]
  initialCustomButtons?: CustomButton[]
  onLinksChange?: (links: SocialLink[]) => void
  onCustomButtonsChange?: (buttons: CustomButton[]) => void
}

export default function SocialLinksEditor({ 
  initialLinks = [], 
  initialCustomButtons = [],
  onLinksChange,
  onCustomButtonsChange
}: SocialLinksEditorProps) {
  const hiddenMeta = initialLinks.filter(l => l.platform.startsWith('_'))
  const [links, setLinks] = useState<SocialLink[]>(initialLinks.filter(l => !l.platform.startsWith('_')))
  const [customButtons, setCustomButtons] = useState<CustomButton[]>(initialCustomButtons)

  // Social Links
  const addLink = () => {
    const newLinks = [...links, { platform: 'linkedin', url: '' }]
    setLinks(newLinks)
    onLinksChange?.([...hiddenMeta, ...newLinks])
  }

  const updateLink = (index: number, field: keyof SocialLink, value: string) => {
    const newLinks = [...links]
    newLinks[index][field] = value
    setLinks(newLinks)
    onLinksChange?.([...hiddenMeta, ...newLinks])
  }

  const removeLink = (index: number) => {
    const newLinks = links.filter((_, i) => i !== index)
    setLinks(newLinks)
    onLinksChange?.([...hiddenMeta, ...newLinks])
  }

  // Custom Buttons / Numbers
  const addCustomItem = (type: 'link' | 'phone') => {
    const newBtns = [...customButtons, { label: type === 'phone' ? 'Call Us' : 'Visit My Website', url: '', type }]
    setCustomButtons(newBtns)
    onCustomButtonsChange?.(newBtns)
  }

  const updateCustomButton = (index: number, field: keyof CustomButton, value: string) => {
    const newBtns = [...customButtons]
    newBtns[index] = { ...newBtns[index], [field]: value }
    setCustomButtons(newBtns)
    onCustomButtonsChange?.(newBtns)
  }

  const removeCustomButton = (index: number) => {
    const newBtns = customButtons.filter((_, i) => i !== index)
    setCustomButtons(newBtns)
    onCustomButtonsChange?.(newBtns)
  }

  return (
    <div className="space-y-8">
      {/* Social Icons Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-zinc-100">Social Icons</h3>
        {links.length > 0 && (
          <div className="space-y-3">
            {links.map((link, index) => (
              <div key={index} className="flex items-start gap-2 p-3 bg-zinc-900 rounded-xl border border-zinc-800">
                <div className="w-[130px] shrink-0">
                  <Select
                    value={link.platform}
                    onValueChange={(val) => updateLink(index, 'platform', val)}
                  >
                    <SelectTrigger className="bg-zinc-950 border-zinc-800 text-zinc-100 h-9">
                      <SelectValue placeholder="Platform" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-100">
                      {AVAILABLE_PLATFORMS.map((p) => (
                        <SelectItem key={p.id} value={p.id} className="focus:bg-zinc-800 focus:text-zinc-100">
                          <div className="flex items-center gap-2">
                            <p.icon className="h-4 w-4 opacity-70" />
                            <span>{p.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex-1">
                  <Input
                    value={link.url}
                    onChange={(e) => updateLink(index, 'url', e.target.value)}
                    placeholder="https://..."
                    className="bg-zinc-950 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 h-9"
                    required
                  />
                </div>
                
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeLink(index)}
                  className="text-zinc-500 hover:text-red-400 hover:bg-red-500/10 shrink-0 h-9 w-9"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {links.length === 0 && (
          <div className="text-center p-4 border border-dashed border-zinc-800 rounded-xl bg-zinc-900">
            <p className="text-xs text-zinc-500">No social media links added yet.</p>
          </div>
        )}

        <Button
          type="button"
          onClick={addLink}
          className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border-none h-9 text-xs"
        >
          <Plus className="mr-2 h-3.5 w-3.5" /> Add Social Icon
        </Button>
      </div>

      <div className="h-px bg-zinc-800" />

      {/* Custom Links & Numbers Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-zinc-100">Custom Links & Numbers</h3>

        {customButtons.length > 0 && (
          <div className="space-y-3">
            {customButtons.map((btn, index) => {
              const isPhone = btn.type === 'phone'
              return (
                <div key={index} className="flex items-start gap-2 p-3 bg-zinc-900 rounded-xl border border-zinc-800">
                  {/* Type badge */}
                  <div className={`shrink-0 mt-1.5 flex items-center justify-center w-7 h-7 rounded-lg ${isPhone ? 'bg-green-500/10 text-green-400' : 'bg-blue-500/10 text-blue-400'}`}>
                    {isPhone ? <Phone className="w-3.5 h-3.5" /> : <LinkIcon className="w-3.5 h-3.5" />}
                  </div>

                  <div className="flex-1 space-y-2">
                    <Input
                      value={btn.label}
                      onChange={(e) => updateCustomButton(index, 'label', e.target.value)}
                      placeholder={isPhone ? 'Label (e.g. Office Line)' : 'Label (e.g. My Website)'}
                      className="bg-zinc-950 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 h-9"
                    />
                    <Input
                      value={btn.url}
                      onChange={(e) => updateCustomButton(index, 'url', e.target.value)}
                      placeholder={isPhone ? '+1 555-000-0000' : 'https://...'}
                      className="bg-zinc-950 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 h-9"
                      type={isPhone ? 'tel' : 'url'}
                    />
                  </div>
                  
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeCustomButton(index)}
                    className="text-zinc-500 hover:text-red-400 hover:bg-red-500/10 shrink-0 h-9 w-9 mt-1"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )
            })}
          </div>
        )}

        {customButtons.length === 0 && (
          <div className="text-center p-4 border border-dashed border-zinc-800 rounded-xl bg-zinc-900">
            <p className="text-xs text-zinc-500">No custom links or numbers added yet.</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2">
          <Button
            type="button"
            onClick={() => addCustomItem('link')}
            className="bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border-none h-9 text-xs"
          >
            <LinkIcon className="mr-1.5 h-3.5 w-3.5" /> Add Link
          </Button>
          <Button
            type="button"
            onClick={() => addCustomItem('phone')}
            className="bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border-none h-9 text-xs"
          >
            <Phone className="mr-1.5 h-3.5 w-3.5" /> Add Number
          </Button>
        </div>
      </div>
    </div>
  )
}
