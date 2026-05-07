'use client'

import { useState } from 'react'
import { Plus, X, Link as LinkIcon, Camera, MessageCircle, Briefcase, Users, Video, Code, Music, GripVertical } from 'lucide-react'
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
  // Filter out any hidden metadata links (like _avatar_x) from the UI
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

  // Custom Buttons
  const addCustomButton = () => {
    const newBtns = [...customButtons, { label: 'My Website', url: '' }]
    setCustomButtons(newBtns)
    onCustomButtonsChange?.(newBtns)
  }

  const updateCustomButton = (index: number, field: keyof CustomButton, value: string) => {
    const newBtns = [...customButtons]
    newBtns[index][field] = value
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
        <h3 className="text-sm font-semibold text-white/90">Social Icons</h3>
        {links.length > 0 && (
          <div className="space-y-3">
            {links.map((link, index) => (
              <div key={index} className="flex items-start gap-2 p-3 bg-white/5 rounded-xl border border-white/10">
                <div className="w-[130px] shrink-0">
                  <Select
                    value={link.platform}
                    onValueChange={(val) => updateLink(index, 'platform', val)}
                  >
                    <SelectTrigger className="bg-black/20 border-white/10 text-white h-9">
                      <SelectValue placeholder="Platform" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-white/10 text-white">
                      {AVAILABLE_PLATFORMS.map((p) => (
                        <SelectItem key={p.id} value={p.id} className="focus:bg-white/10 focus:text-white">
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
                    className="bg-black/20 border-white/10 text-white placeholder:text-white/30 h-9"
                    required
                  />
                </div>
                
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeLink(index)}
                  className="text-white/40 hover:text-red-400 hover:bg-red-500/10 shrink-0 h-9 w-9"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {links.length === 0 && (
          <div className="text-center p-4 border border-dashed border-white/10 rounded-xl bg-white/5">
            <p className="text-xs text-white/40">No social media links added yet.</p>
          </div>
        )}

        <Button
          type="button"
          onClick={addLink}
          className="w-full bg-white/10 hover:bg-white/20 text-white border-none h-9 text-xs"
        >
          <Plus className="mr-2 h-3.5 w-3.5" /> Add Social Icon
        </Button>
      </div>

      <div className="h-px bg-white/10" />

      {/* Custom Buttons Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-white/90">Custom Links</h3>
        {customButtons.length > 0 && (
          <div className="space-y-3">
            {customButtons.map((btn, index) => (
              <div key={index} className="flex items-start gap-2 p-3 bg-white/5 rounded-xl border border-white/10">
                <div className="flex-1 space-y-2">
                  <Input
                    value={btn.label}
                    onChange={(e) => updateCustomButton(index, 'label', e.target.value)}
                    placeholder="Button Label (e.g. Visit my Website)"
                    className="bg-black/20 border-white/10 text-white placeholder:text-white/30 h-9"
                    required
                  />
                  <Input
                    value={btn.url}
                    onChange={(e) => updateCustomButton(index, 'url', e.target.value)}
                    placeholder="https://..."
                    className="bg-black/20 border-white/10 text-white placeholder:text-white/30 h-9"
                    required
                  />
                </div>
                
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeCustomButton(index)}
                  className="text-white/40 hover:text-red-400 hover:bg-red-500/10 shrink-0 h-9 w-9 mt-1"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {customButtons.length === 0 && (
          <div className="text-center p-4 border border-dashed border-white/10 rounded-xl bg-white/5">
            <p className="text-xs text-white/40">No custom links added yet.</p>
          </div>
        )}

        <Button
          type="button"
          onClick={addCustomButton}
          className="w-full bg-white/10 hover:bg-white/20 text-white border-none h-9 text-xs"
        >
          <Plus className="mr-2 h-3.5 w-3.5" /> Add Custom Link
        </Button>
      </div>
    </div>
  )
}
