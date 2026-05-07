'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Phone, Mail, Globe, MapPin, Download, Share2, ExternalLink, ArrowUpRight, Camera as CameraIcon, Check, Settings2, Plus, GripVertical, Trash2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { ImageUploader } from '@/components/ImageUploader'
import SocialLinksEditor from '@/components/SocialLinksEditor'
import { saveCustomerCard } from '@/app/actions/customer'

// Real SVG brand icons - monochrome elite style
const BrandIcons: Record<string, (props: { className?: string }) => React.ReactElement> = {
  instagram: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  ),
  twitter: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  ),
  linkedin: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  ),
  facebook: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  ),
  youtube: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  ),
  tiktok: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
    </svg>
  ),
  github: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
    </svg>
  ),
}

const cinematicEase = 'easeOut' as const

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: cinematicEase } }
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.2 } }
}

function formatPhoneNumber(phoneNumberString: string) {
  const cleaned = ('' + phoneNumberString).replace(/\D/g, '')
  if (cleaned.length === 10) {
    return '+1 ' + cleaned.slice(0, 3) + '-' + cleaned.slice(3, 6) + '-' + cleaned.slice(6)
  }
  if (cleaned.length === 11 && cleaned.startsWith('1')) {
    return '+1 ' + cleaned.slice(1, 4) + '-' + cleaned.slice(4, 7) + '-' + cleaned.slice(7)
  }
  return phoneNumberString
}

export default function CardClient({ card: initialCard, isEditable = false, editToken }: { card: any, isEditable?: boolean, editToken?: string }) {
  const [mounted, setMounted] = useState(false)
  const [card, setCard] = useState(initialCard)
  const [isSaving, setIsSaving] = useState(false)

  // Extract avatar_x from custom social links metadata hack
  const savedAvatarXObj = card.card_social_links?.find((s: any) => s.platform === '_avatar_x')
  const [avatarX, setAvatarX] = useState<number>(savedAvatarXObj ? Number(savedAvatarXObj.url) : 0)
  const [isDraggingAvatar, setIsDraggingAvatar] = useState(false)

  // Modals
  const [activeUploader, setActiveUploader] = useState<'profile_picture_url' | 'banner_image_url' | 'company_logo_url' | null>(null)
  const [showLinksEditor, setShowLinksEditor] = useState(false)
  const [showColorPicker, setShowColorPicker] = useState(false)
  
  const themeColor = card.theme_color || '#d4af37' 

  useEffect(() => { setMounted(true) }, [])
  
  if (!mounted) {
    return <div className="min-h-screen bg-[#050505]" />
  }

  const handleTextChange = (field: string, value: string) => {
    if (!isEditable) return
    setCard((prev: any) => ({ ...prev, [field]: value }))
  }

  const handleSaveAndPublish = async () => {
    if (!isEditable) return
    setIsSaving(true)
    try {
      // Bundle avatarX into social links
      const baseSocials = (card.card_social_links || []).filter((s: any) => s.platform !== '_avatar_x')
      const updatedSocials = [...baseSocials, { platform: '_avatar_x', url: String(avatarX) }]

      const formData = new FormData()
      formData.append('token', editToken || '')
      formData.append('owner_name', card.owner_name || '')
      formData.append('job_title', card.job_title || '')
      formData.append('company_name', card.company_name || '')
      formData.append('company_tagline', card.company_tagline || '')
      formData.append('bio', card.bio || '')
      formData.append('phone_number', card.phone_number || '')
      formData.append('email', card.email || '')
      formData.append('website', card.website || '')
      formData.append('location', card.location || '')
      formData.append('theme_color', card.theme_color || '#d4af37')
      formData.append('card_social_links', JSON.stringify(updatedSocials))
      formData.append('card_custom_buttons', JSON.stringify(card.card_custom_buttons || []))

      const result = await saveCustomerCard(formData)
      if (result?.error) {
        alert('Failed to save: ' + result.error)
      } else {
        alert('Published successfully!')
      }
    } catch (e) {
      alert('An error occurred while saving.')
    } finally {
      setIsSaving(false)
    }
  }

  // --- Render Helpers ---

  const InlineInput = ({ value, field, placeholder, className, multiline = false, emptyStateText = "Tap to add text" }: any) => {
    if (!isEditable) {
      if (!value) return null
      return multiline ? <p className={className}>{value}</p> : <span className={className}>{value}</span>
    }
    
    const isEmpty = !value
    const inputClass = `${className} bg-transparent outline-none w-full text-center border border-dashed hover:border-white/20 focus:border-white/50 focus:bg-white/5 rounded-md transition-all placeholder:text-white/20 ${isEmpty ? 'border-white/10 opacity-60' : 'border-transparent'}`
    
    if (multiline) {
      return (
        <textarea
          value={value || ''}
          onChange={(e) => handleTextChange(field, e.target.value)}
          placeholder={placeholder || emptyStateText}
          className={`${inputClass} resize-none overflow-hidden px-2`}
          rows={3}
        />
      )
    }

    return (
      <input
        type="text"
        value={value || ''}
        onChange={(e) => handleTextChange(field, e.target.value)}
        placeholder={placeholder || emptyStateText}
        className={`${inputClass} px-1`}
      />
    )
  }

  const ImageEditOverlay = ({ field, rounded = false, label }: { field: 'profile_picture_url' | 'banner_image_url' | 'company_logo_url', rounded?: boolean, label: string }) => {
    if (!isEditable) return null
    return (
      <div 
        className={`absolute inset-0 z-10 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer ${rounded ? 'rounded-full' : ''}`}
        onClick={(e) => { e.preventDefault(); setActiveUploader(field) }}
      >
        <div className="bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 text-white text-xs font-semibold shadow-xl">
          <CameraIcon className="w-3.5 h-3.5" /> {label}
        </div>
      </div>
    )
  }

  const contactItems = [
    { key: 'phone_number', icon: Phone, label: card.phone_number ? formatPhoneNumber(card.phone_number) : '', raw: card.phone_number },
    { key: 'email', icon: Mail, label: card.email, raw: card.email },
    { key: 'website', icon: Globe, label: card.website?.replace(/^https?:\/\//, ''), raw: card.website },
    { key: 'location', icon: MapPin, label: card.location, raw: card.location },
  ]

  const activeContactItems = isEditable ? contactItems : contactItems.filter(i => i.raw)

  return (
    <div className="min-h-screen bg-[#050505] font-sans pb-32 overflow-x-hidden selection:bg-white/20 text-white relative">
      
      {/* Dynamic Cinematic Lighting Background */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 transition-colors duration-1000"
        style={{
          background: `
            radial-gradient(ellipse at 50% -20%, ${themeColor}30 0%, transparent 60%),
            radial-gradient(circle at 100% 40%, ${themeColor}08 0%, transparent 40%),
            radial-gradient(circle at 0% 100%, ${themeColor}10 0%, transparent 40%)
          `
        }}
      />

      <div className="relative z-10 max-w-[480px] mx-auto px-5 sm:px-6">

        {/* Hero Banner Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease: cinematicEase }}
          className="w-full relative mt-6 rounded-[2rem] overflow-hidden"
          style={{ height: '28vh', minHeight: '220px', backgroundColor: `${themeColor}20` }}
        >
          {card.banner_image_url && (
             <div className="absolute inset-0">
               <img src={card.banner_image_url} alt="Banner" className="w-full h-full object-cover" />
               <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-black/40 to-transparent pointer-events-none" />
             </div>
          )}
          {!card.banner_image_url && (
            <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${themeColor} 0%, transparent 100%)`, opacity: 0.2 }} />
          )}
          <ImageEditOverlay field="banner_image_url" label="Edit Banner" />
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="relative z-20 -mt-16 space-y-6"
        >
          {/* Identity & Avatar */}
          <motion.div variants={itemVariants} className="flex flex-col items-center text-center relative w-full">
            
            {/* Center Snap Line Visualization */}
            {isEditable && isDraggingAvatar && Math.abs(avatarX) < 10 && (
              <div className="absolute top-[-40px] bottom-0 left-1/2 w-[2px] bg-white/40 shadow-[0_0_10px_rgba(255,255,255,0.8)] -translate-x-1/2 z-0 pointer-events-none rounded-full" />
            )}

            <motion.div 
              className={`relative mb-5 group z-10 ${isEditable ? 'cursor-grab active:cursor-grabbing' : ''}`}
              drag={isEditable ? "x" : false}
              dragConstraints={{ left: -140, right: 140 }}
              dragElastic={0.1}
              dragSnapToOrigin={false}
              dragMomentum={false}
              onDragStart={() => setIsDraggingAvatar(true)}
              onDrag={(e, info) => {
                if (Math.abs(info.point.x) < 15) {
                  // visually snap to center, logic handled by onDragEnd
                }
              }}
              onDragEnd={(e, info) => {
                setIsDraggingAvatar(false)
                const finalX = info.offset.x + avatarX
                if (Math.abs(finalX) < 25) {
                  setAvatarX(0) // Snap to center
                } else {
                  setAvatarX(finalX)
                }
              }}
              animate={{ x: avatarX }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            >
               <div className="absolute -inset-1 rounded-full blur-md opacity-30 group-hover:opacity-50 transition duration-1000 pointer-events-none" style={{ backgroundColor: themeColor }} />
               <div className="relative h-28 w-28 rounded-full shadow-2xl overflow-hidden bg-[#111] flex items-center justify-center ring-1 ring-white/10">
                 {card.profile_picture_url ? (
                   <img src={card.profile_picture_url} alt={card.owner_name} className="w-full h-full object-cover pointer-events-none" />
                 ) : (
                   <span className="text-3xl font-light text-white tracking-widest pointer-events-none">
                     {card.owner_name?.charAt(0)?.toUpperCase()}
                   </span>
                 )}
                 <ImageEditOverlay field="profile_picture_url" rounded label="Edit Avatar" />
               </div>
            </motion.div>

            {/* Company Logo and Name */}
            {(card.company_name || isEditable) && (
              <div className="flex flex-col items-center justify-center gap-1.5 mb-3 w-full relative">
                {(card.company_logo_url || isEditable) && (
                  <div className="relative group inline-block">
                    {card.company_logo_url ? (
                      <img src={card.company_logo_url} alt={card.company_name} className="h-14 w-auto max-w-[200px] rounded-sm object-contain opacity-100" />
                    ) : isEditable ? (
                      <div className="h-14 w-14 rounded border border-dashed border-white/20 flex items-center justify-center text-white/30 text-[10px] uppercase font-bold tracking-widest cursor-pointer hover:border-white/50">
                        Logo
                      </div>
                    ) : null}
                    <ImageEditOverlay field="company_logo_url" label="Edit Logo" />
                  </div>
                )}
                
                <InlineInput
                  field="company_name"
                  value={card.company_name}
                  placeholder="COMPANY NAME"
                  emptyStateText="+ ADD COMPANY"
                  className="text-xs font-semibold text-white/80 uppercase tracking-[0.15em] text-center"
                />
              </div>
            )}
            
            <InlineInput
              field="owner_name"
              value={card.owner_name}
              placeholder="Your Name"
              className="text-[28px] font-medium text-white tracking-tight leading-none mb-2"
            />
            
            {(card.job_title || isEditable) && (
              <InlineInput
                field="job_title"
                value={card.job_title}
                placeholder="Your Job Title"
                emptyStateText="+ Add Job Title"
                className="text-sm font-light text-white/60 tracking-wide"
              />
            )}
          </motion.div>

          {/* Bio - Elegant editorial block */}
          {(card.bio || isEditable) && (
            <motion.div variants={itemVariants} className="text-center px-4">
              <InlineInput
                field="bio"
                value={card.bio}
                placeholder="Write a short bio about yourself or your company..."
                emptyStateText="+ Add Biography"
                className="text-[13px] font-light text-white/70 leading-relaxed"
                multiline={true}
              />
            </motion.div>
          )}

          {/* Primary Contact Actions */}
          {activeContactItems.length > 0 && (
            <motion.div variants={itemVariants} className="space-y-2.5 pt-2">
              {activeContactItems.map(({ key, icon: Icon, label, raw }) => {
                // Determine href for each contact type
                const getHref = () => {
                  if (isEditable) return undefined
                  if (key === 'phone_number') return `/api/vcard/${card.id}/contact.vcf`
                  if (key === 'email') return `mailto:${raw}`
                  if (key === 'website') return raw?.startsWith('http') ? raw : `https://${raw}`
                  if (key === 'location') return `https://maps.google.com/?q=${encodeURIComponent(raw || '')}`
                  return undefined
                }
                const href = getHref()

                const inner = (
                  <div className="flex items-center gap-4 px-5 py-4 rounded-2xl bg-white/5 border border-white/[0.08] hover:bg-white/[0.08] hover:border-white/[0.15] transition-all group backdrop-blur-xl">
                    <div className="flex items-center justify-center w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity" style={{ color: themeColor }}>
                      <Icon strokeWidth={1.5} className="w-5 h-5" />
                    </div>
                    {isEditable ? (
                      <input
                        type="text"
                        value={card[key] || ''}
                        onChange={(e) => handleTextChange(key, e.target.value)}
                        placeholder={`Add ${key.replace('_', ' ')}`}
                        className="bg-transparent outline-none flex-1 text-sm font-light text-white/90 placeholder:text-white/20 tracking-wide"
                      />
                    ) : (
                      <>
                        <span className="text-sm font-light text-white/90 truncate flex-1 tracking-wide">{label}</span>
                        <ArrowUpRight strokeWidth={1.5} className="w-4 h-4 text-white/30 group-hover:text-white/60 transition-colors" />
                      </>
                    )}
                  </div>
                )

                if (href && !isEditable) {
                  const isExternal = key === 'website' || key === 'location'
                  return (
                    <a key={key} href={href} target={isExternal ? '_blank' : '_self'} rel={isExternal ? 'noopener noreferrer' : undefined}>
                      {inner}
                    </a>
                  )
                }

                return <div key={key}>{inner}</div>
              })}
            </motion.div>
          )}

          {/* Social Links & Custom Links */}
          {(card.card_social_links?.length > 0 || card.card_custom_buttons?.length > 0 || isEditable) && (
            <motion.div variants={itemVariants} className="pt-4 space-y-6">
              
              {/* Socials */}
              {(card.card_social_links?.length > 0 || isEditable) && (
                <div>
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Connect</p>
                    {isEditable && (
                      <button onClick={() => setShowLinksEditor(true)} className="text-[10px] bg-white/10 hover:bg-white/20 text-white rounded px-2 py-0.5 uppercase tracking-widest transition-colors font-bold flex items-center gap-1">
                        <Settings2 className="w-3 h-3" /> Edit Links
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap justify-center gap-3">
                    {card.card_social_links?.map((social: any, idx: number) => {
                      const key = social.platform?.toLowerCase()
                      const Icon = BrandIcons[key]
                      return (
                        <div
                          key={idx}
                          className="flex items-center justify-center w-12 h-12 rounded-full bg-white/5 border border-white/[0.08] group backdrop-blur-xl"
                        >
                          {Icon ? (
                            <Icon className="w-5 h-5 text-white/60" />
                          ) : (
                            <ArrowUpRight className="w-5 h-5 text-white/60" />
                          )}
                        </div>
                      )
                    })}
                    {card.card_social_links?.length === 0 && isEditable && (
                      <div className="text-xs text-white/30 italic">No social links added yet</div>
                    )}
                  </div>
                </div>
              )}

              {/* Custom Links & Numbers */}
              {(card.card_custom_buttons?.length > 0 || isEditable) && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Links & Numbers</p>
                    {isEditable && (
                      <button onClick={() => setShowLinksEditor(true)} className="text-[10px] bg-white/10 hover:bg-white/20 text-white rounded px-2 py-0.5 uppercase tracking-widest transition-colors font-bold flex items-center gap-1">
                        <Settings2 className="w-3 h-3" /> Edit
                      </button>
                    )}
                  </div>
                  {card.card_custom_buttons?.map((btn: any, idx: number) => {
                    const isPhone = btn.type === 'phone'
                    const href = isPhone
                      ? `tel:${btn.url?.replace(/\s/g, '')}`
                      : (btn.url?.startsWith('http') ? btn.url : `https://${btn.url}`)

                    return isEditable ? (
                      <div
                        key={idx}
                        className="flex items-center justify-between px-5 py-4 rounded-2xl bg-gradient-to-r from-white/5 to-transparent border border-white/[0.08]"
                      >
                        <div className="flex items-center gap-3">
                          {isPhone
                            ? <Phone strokeWidth={1.5} className="w-4 h-4 text-white/40" />
                            : <ArrowUpRight strokeWidth={1.5} className="w-4 h-4 text-white/40" />
                          }
                          <span className="text-sm font-medium text-white/90 tracking-wide">{btn.label}</span>
                        </div>
                        <span className={`text-[10px] uppercase tracking-widest font-bold ${isPhone ? 'text-green-400/60' : 'text-blue-400/60'}`}>
                          {isPhone ? 'Phone' : 'Link'}
                        </span>
                      </div>
                    ) : (
                      <a
                        key={idx}
                        href={href}
                        target={isPhone ? '_self' : '_blank'}
                        rel={isPhone ? undefined : 'noopener noreferrer'}
                        className="flex items-center justify-between px-5 py-4 rounded-2xl bg-gradient-to-r from-white/5 to-transparent border border-white/[0.08] hover:bg-white/[0.08] hover:border-white/[0.15] transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          {isPhone
                            ? <Phone strokeWidth={1.5} className="w-4 h-4 text-white/40 group-hover:text-white/70 transition-colors" />
                            : <ArrowUpRight strokeWidth={1.5} className="w-4 h-4 text-white/40 group-hover:text-white/70 transition-colors" />
                          }
                          <span className="text-sm font-medium text-white/90 tracking-wide">{btn.label}</span>
                        </div>
                        <ArrowUpRight strokeWidth={1.5} className="w-4 h-4 text-white/30 group-hover:text-white/60 transition-colors" />
                      </a>
                    )
                  })}
                  {card.card_custom_buttons?.length === 0 && isEditable && (
                    <div className="text-xs text-white/30 italic text-center">No custom links or numbers added yet</div>
                  )}
                </div>
              )}


            </motion.div>
          )}

          {/* Tagline & Footer */}
          {(card.company_tagline || isEditable) && (
            <motion.div variants={itemVariants} className="pt-6 pb-2 text-center">
              <InlineInput
                field="company_tagline"
                value={card.company_tagline}
                placeholder="A memorable tagline..."
                emptyStateText="+ Add Tagline"
                className="text-base italic font-medium tracking-wide text-white/90 drop-shadow-md"
              />
            </motion.div>
          )}

          {!isEditable && (
            <motion.div variants={itemVariants} className="text-center pt-8 pb-10">
              <a href={`/card/${card.slug}/edit/login`} className="text-[9px] text-white/20 hover:text-white/50 transition-colors tracking-[0.2em] uppercase font-bold">
                Owner Access
              </a>
            </motion.div>
          )}
          {isEditable && <div className="pb-24" />}
        </motion.div>

        {/* Public Floating Action Bar - Save Contact */}
        {!isEditable && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1, duration: 1, ease: cinematicEase }}
            className="fixed bottom-0 left-0 right-0 px-5 pb-8 pt-10 z-50 pointer-events-none"
            style={{ background: 'linear-gradient(to top, rgba(5,5,5,1) 20%, rgba(5,5,5,0.8) 60%, transparent)' }}
          >
            <div className="max-w-[480px] mx-auto flex gap-3 pointer-events-auto">
              <button
                onClick={async () => {
                  const ua = navigator.userAgent
                  const isIOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
                  const isSafariIOS = isIOS && /^((?!CriOS|FxiOS|OPiOS|mercury).)*Safari/i.test(ua)

                  // Safari on iOS: direct URL navigation to .vcf opens Add to Contacts natively
                  if (isSafariIOS) {
                    window.location.href = `/api/vcard/${card.id}/contact.vcf`
                    return
                  }

                  // All other browsers: fetch the vcard and share as a File
                  // On iOS this shows the share sheet with "Add to Contacts" at the top
                  // On Android Chrome this does the same
                  try {
                    const res = await fetch(`/api/vcard/${card.id}/contact.vcf`)
                    const blob = await res.blob()
                    const fileName = `${card.owner_name?.replace(/\s+/g, '_') || 'contact'}.vcf`
                    const file = new File([blob], fileName, { type: 'text/x-vcard' })

                    if (navigator.canShare && navigator.canShare({ files: [file] })) {
                      await navigator.share({ files: [file], title: 'Add Contact' })
                      return
                    }
                  } catch {
                    // Share API unavailable or cancelled — fall through to download
                  }

                  // Final fallback: regular download (desktop browsers)
                  const a = document.createElement('a')
                  a.href = `/api/vcard/${card.id}/contact.vcf`
                  a.download = `${card.owner_name?.replace(/\s+/g, '_') || 'contact'}.vcf`
                  document.body.appendChild(a)
                  a.click()
                  document.body.removeChild(a)
                }}
                className="flex-1 flex items-center justify-center gap-2.5 h-14 rounded-2xl font-semibold text-[13px] tracking-wide transition-all active:scale-[0.97] shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:shadow-[0_0_50px_rgba(255,255,255,0.15)]"
                style={{ backgroundColor: '#ffffff', color: '#000000' }}
              >
                <Download className="w-4 h-4" strokeWidth={2.5} />
                Save Contact
              </button>
              <button
                className="flex items-center justify-center w-14 h-14 rounded-2xl bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-all active:scale-[0.97] backdrop-blur-md"
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({ title: card.owner_name, url: window.location.href })
                  } else {
                    navigator.clipboard?.writeText(window.location.href)
                  }
                }}
              >
                <Share2 className="w-4 h-4" strokeWidth={2} />
              </button>
            </div>
          </motion.div>
        )}

        {/* Edit Mode Floating Action Bar - Save & Publish */}
        {isEditable && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="fixed bottom-0 left-0 right-0 px-5 pb-8 pt-10 z-[60]"
            style={{ background: 'linear-gradient(to top, rgba(5,5,5,1) 20%, rgba(5,5,5,0.8) 60%, transparent)' }}
          >
            <div className="max-w-[480px] mx-auto flex gap-3">
               <button
                 onClick={() => setShowColorPicker(!showColorPicker)}
                 className="flex flex-col items-center justify-center w-14 h-14 rounded-2xl bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-all active:scale-[0.97] backdrop-blur-md relative"
                 title="Change Theme Color"
               >
                 <div className="w-5 h-5 rounded-full shadow-inner ring-1 ring-white/50" style={{ backgroundColor: themeColor }} />
                 {showColorPicker && (
                   <div className="absolute bottom-16 right-0 bg-zinc-900 border border-white/10 p-3 rounded-2xl shadow-2xl flex flex-wrap gap-2 w-48 justify-center">
                     {['#0a0a0a', '#ffffff', '#d4af37', '#ff3366', '#3b82f6', '#10b981', '#8b5cf6', '#f97316'].map(color => (
                       <div 
                         key={color} 
                         onClick={(e) => { e.stopPropagation(); handleTextChange('theme_color', color); setShowColorPicker(false); }}
                         className="w-8 h-8 rounded-full cursor-pointer ring-1 ring-white/20 hover:scale-110 transition-transform" 
                         style={{ backgroundColor: color }} 
                       />
                     ))}
                   </div>
                 )}
               </button>
              <button
                onClick={handleSaveAndPublish}
                disabled={isSaving}
                className="flex-1 flex items-center justify-center gap-2.5 h-14 rounded-2xl font-semibold text-[13px] tracking-wide transition-all active:scale-[0.97] shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:shadow-[0_0_50px_rgba(255,255,255,0.15)] disabled:opacity-50 disabled:pointer-events-none"
                style={{ backgroundColor: '#ffffff', color: '#000000' }}
              >
                {isSaving ? (
                   <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                ) : (
                  <Check className="w-4 h-4" strokeWidth={2.5} />
                )}
                {isSaving ? 'Publishing...' : 'Save & Publish'}
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Modals */}
      {isEditable && activeUploader && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl relative">
            <button onClick={() => setActiveUploader(null)} className="absolute top-4 right-4 text-zinc-400 hover:text-black transition-colors">
              <Trash2 className="w-5 h-5" />
            </button>
            <h2 className="text-black font-bold mb-4 text-lg">Update Picture</h2>
            <ImageUploader
              name={activeUploader}
              label=""
              defaultValue={card[activeUploader] || ''}
              aspectRatio={activeUploader === 'banner_image_url' ? 'video' : 'square'}
              onUploadSuccess={(url) => {
                handleTextChange(activeUploader, url)
                setActiveUploader(null)
              }}
            />
          </div>
        </div>
      )}

      {isEditable && showLinksEditor && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-zinc-950 border border-white/10 rounded-3xl p-6 w-full max-w-md shadow-2xl relative my-8">
            <button onClick={() => setShowLinksEditor(false)} className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors bg-white/5 rounded-full p-1.5">
              <Check className="w-5 h-5" />
            </button>
            <h2 className="text-white font-bold mb-6 text-xl tracking-tight">Manage Links</h2>
            <SocialLinksEditor 
              initialLinks={card.card_social_links || []} 
              initialCustomButtons={card.card_custom_buttons || []}
              onLinksChange={(socials: any) => handleTextChange('card_social_links', socials)}
              onCustomButtonsChange={(customs: any) => handleTextChange('card_custom_buttons', customs)}
            />
            <div className="mt-8">
               <button onClick={() => setShowLinksEditor(false)} className="w-full h-12 rounded-xl bg-white text-black font-semibold tracking-wide hover:bg-zinc-200 transition-colors">
                 Done
               </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
