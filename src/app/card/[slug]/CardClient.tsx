'use client'

import { motion } from 'framer-motion'
import { Phone, Mail, Globe, MapPin, Download, Share2, ExternalLink, Camera, MessageCircle, Briefcase, Users, Video, Code, Music, Link as LinkIcon } from 'lucide-react'
import { useState, useEffect } from 'react'

const platformMeta: Record<string, { label: string; icon: any; color: string }> = {
  instagram: { label: 'Instagram', icon: Camera, color: '#E1306C' },
  twitter:   { label: 'Twitter / X', icon: MessageCircle, color: '#1DA1F2' },
  linkedin:  { label: 'LinkedIn', icon: Briefcase, color: '#0A66C2' },
  facebook:  { label: 'Facebook', icon: Users, color: '#1877F2' },
  youtube:   { label: 'YouTube', icon: Video, color: '#FF0000' },
  tiktok:    { label: 'TikTok', icon: Music, color: '#000000' },
  github:    { label: 'GitHub', icon: Code, color: '#333333' },
}

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } }
}

export default function CardClient({ card }: { card: any }) {
  const [mounted, setMounted] = useState(false)
  const themeColor = card.theme_color || '#0F172A'

  useEffect(() => { setMounted(true) }, [])
  if (!mounted) return <div className="min-h-screen bg-slate-50" />

  const contactItems = [
    card.phone_number && { href: `tel:${card.phone_number}`, icon: Phone, label: 'Call' },
    card.email       && { href: `mailto:${card.email}`, icon: Mail, label: 'Email' },
    card.website     && { href: card.website.startsWith('http') ? card.website : `https://${card.website}`, icon: Globe, label: 'Web', external: true },
    card.location    && { href: `https://maps.google.com/?q=${encodeURIComponent(card.location)}`, icon: MapPin, label: 'Map', external: true },
  ].filter(Boolean) as { href: string; icon: any; label: string; external?: boolean }[]

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans pb-36 overflow-x-hidden">
      {/* Subtle gradient bg */}
      <div
        className="fixed inset-0 opacity-[0.04] pointer-events-none z-0"
        style={{ backgroundImage: `radial-gradient(ellipse at 50% 0%, ${themeColor} 0%, transparent 65%)` }}
      />

      <div className="relative z-10 max-w-sm mx-auto">
        {/* Banner */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="h-52 w-full relative overflow-hidden"
          style={{ backgroundColor: themeColor }}
        >
          {card.banner_image_url && (
            <img src={card.banner_image_url} alt="Banner" className="w-full h-full object-cover" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
        </motion.div>

        <div className="px-4 -mt-16 relative z-20 space-y-3">
          {/* Avatar */}
          <motion.div custom={0} variants={fadeUp} initial="hidden" animate="show" className="flex justify-center">
            <div className="h-32 w-32 rounded-full border-4 border-white shadow-xl overflow-hidden bg-white flex items-center justify-center">
              {card.profile_picture_url ? (
                <img src={card.profile_picture_url} alt={card.owner_name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl font-bold" style={{ color: themeColor }}>
                  {card.owner_name?.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
          </motion.div>

          {/* Identity Card */}
          <motion.div custom={1} variants={fadeUp} initial="hidden" animate="show"
            className="bg-white rounded-2xl px-5 py-5 text-center shadow-sm border border-slate-100"
          >
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{card.owner_name}</h1>
            {card.job_title && (
              <p className="text-slate-500 font-medium mt-0.5 text-sm">{card.job_title}</p>
            )}
            {card.company_name && (
              <div className="flex items-center justify-center gap-1.5 mt-3">
                {card.company_logo_url && (
                  <img src={card.company_logo_url} alt={card.company_name} className="h-5 w-5 rounded object-contain" />
                )}
                <span className="text-sm font-semibold text-slate-700">{card.company_name}</span>
              </div>
            )}
            {card.company_tagline && (
              <p className="text-xs text-slate-400 mt-1">{card.company_tagline}</p>
            )}
          </motion.div>

          {/* Quick Contact Grid */}
          {contactItems.length > 0 && (
            <motion.div custom={2} variants={fadeUp} initial="hidden" animate="show"
              className={`grid gap-2 ${contactItems.length === 1 ? 'grid-cols-1' : contactItems.length === 2 ? 'grid-cols-2' : contactItems.length === 3 ? 'grid-cols-3' : 'grid-cols-4'}`}
            >
              {contactItems.map(({ href, icon: Icon, label, external }) => (
                <a
                  key={label}
                  href={href}
                  {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="flex flex-col items-center justify-center gap-1.5 py-3.5 bg-white rounded-2xl shadow-sm border border-slate-100 hover:border-slate-200 hover:shadow-md transition-all active:scale-95"
                >
                  <div className="p-2 rounded-full" style={{ backgroundColor: `${themeColor}14`, color: themeColor }}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-500">{label}</span>
                </a>
              ))}
            </motion.div>
          )}

          {/* Bio */}
          {card.bio && (
            <motion.div custom={3} variants={fadeUp} initial="hidden" animate="show"
              className="bg-white rounded-2xl px-5 py-4 shadow-sm border border-slate-100"
            >
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">About</p>
              <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">{card.bio}</p>
            </motion.div>
          )}

          {/* Social Links */}
          {card.card_social_links?.length > 0 && (
            <motion.div custom={4} variants={fadeUp} initial="hidden" animate="show"
              className="bg-white rounded-2xl px-5 py-4 shadow-sm border border-slate-100"
            >
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Connect</p>
              <div className="flex flex-col gap-2">
                {card.card_social_links.map((social: any, idx: number) => {
                  const meta = platformMeta[social.platform?.toLowerCase()] || { label: social.platform, icon: LinkIcon, color: '#64748b' }
                  const Icon = meta.icon
                  return (
                    <a
                      key={idx}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors active:scale-[0.98] group"
                    >
                      <div className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${meta.color}15`, color: meta.color }}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-semibold text-slate-700">{meta.label}</span>
                      <ExternalLink className="h-3.5 w-3.5 text-slate-300 ml-auto group-hover:text-slate-500 transition-colors" />
                    </a>
                  )
                })}
              </div>
            </motion.div>
          )}

          {/* Custom Links */}
          {card.card_custom_buttons?.length > 0 && (
            <motion.div custom={5} variants={fadeUp} initial="hidden" animate="show" className="space-y-2">
              {card.card_custom_buttons.map((btn: any, idx: number) => (
                <a
                  key={idx}
                  href={btn.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between px-4 py-3.5 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all active:scale-[0.98] group"
                >
                  <span className="font-semibold text-slate-800 text-sm">{btn.label}</span>
                  <ExternalLink className="h-4 w-4 text-slate-300 group-hover:text-slate-600 transition-colors" />
                </a>
              ))}
            </motion.div>
          )}

          {/* Owner login footer */}
          <motion.div custom={6} variants={fadeUp} initial="hidden" animate="show" className="text-center pt-2 pb-4">
            <a href={`/card/${card.slug}/edit/login`} className="text-[11px] text-slate-300 hover:text-slate-500 transition-colors tracking-widest uppercase">
              Owner Login
            </a>
          </motion.div>
        </div>

        {/* Sticky CTA Bar */}
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 300, damping: 28 }}
          className="fixed bottom-0 left-0 right-0 px-4 pb-6 pt-3 z-50 bg-gradient-to-t from-[#f8fafc] via-[#f8fafc]/90 to-transparent pointer-events-none"
        >
          <div className="max-w-sm mx-auto flex gap-2.5 pointer-events-auto">
            <a
              href={`/card/${card.slug}/edit/login`}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 text-white rounded-2xl font-bold text-sm shadow-lg transition-all active:scale-[0.98]"
              style={{ backgroundColor: themeColor }}
            >
              <Download className="h-4 w-4" />
              Save Contact
            </a>
            <button
              className="flex items-center justify-center py-3.5 px-4 bg-white text-slate-900 rounded-2xl font-bold shadow-sm border border-slate-200 hover:bg-slate-50 transition-all active:scale-[0.98]"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: `${card.owner_name}${card.company_name ? ` — ${card.company_name}` : ''}`,
                    url: window.location.href,
                  })
                } else {
                  navigator.clipboard?.writeText(window.location.href)
                }
              }}
            >
              <Share2 className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
