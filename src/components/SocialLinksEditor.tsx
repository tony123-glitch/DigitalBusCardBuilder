'use client'

import { useState } from 'react'
import { Plus, X, Link as LinkIcon, Camera, MessageCircle, Briefcase, Users, Video, Code, Music } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'

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

interface SocialLinksEditorProps {
  initialLinks?: SocialLink[]
}

export default function SocialLinksEditor({ initialLinks = [] }: SocialLinksEditorProps) {
  const [links, setLinks] = useState<SocialLink[]>(initialLinks)

  const addLink = () => {
    setLinks([...links, { platform: 'linkedin', url: '' }])
  }

  const updateLink = (index: number, field: keyof SocialLink, value: string) => {
    const newLinks = [...links]
    newLinks[index][field] = value
    setLinks(newLinks)
  }

  const removeLink = (index: number) => {
    setLinks(links.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-4">
      {links.length > 0 && (
        <div className="space-y-3">
          {links.map((link, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-white rounded-xl border border-slate-200 shadow-sm">
              <input type="hidden" name="social_platform[]" value={link.platform} />
              <input type="hidden" name="social_url[]" value={link.url} />
              
              <div className="w-[140px] shrink-0">
                <Select
                  value={link.platform}
                  onValueChange={(val) => updateLink(index, 'platform', val)}
                >
                  <SelectTrigger className="bg-slate-50 border-slate-200">
                    <SelectValue placeholder="Platform" />
                  </SelectTrigger>
                  <SelectContent>
                    {AVAILABLE_PLATFORMS.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        <div className="flex items-center gap-2">
                          <p.icon className="h-4 w-4 text-slate-500" />
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
                  className="bg-slate-50 border-slate-200"
                  required
                />
              </div>
              
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeLink(index)}
                className="text-slate-400 hover:text-red-600 hover:bg-red-50 shrink-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {links.length === 0 && (
        <div className="text-center p-6 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
          <p className="text-sm text-slate-500">No social media links added yet.</p>
        </div>
      )}

      <Button
        type="button"
        variant="outline"
        onClick={addLink}
        className="w-full bg-white border-dashed border-slate-300 text-slate-600 hover:text-slate-900"
      >
        <Plus className="mr-2 h-4 w-4" /> Add Social Link
      </Button>
    </div>
  )
}
