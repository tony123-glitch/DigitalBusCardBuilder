'use client'

import { motion } from 'framer-motion'
import { Phone, Mail, Globe, MapPin, Download, Share2, ExternalLink } from 'lucide-react'
import { useState, useEffect } from 'react'

// Real SVG brand icons
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

const platformColors: Record<string, string> = {
  instagram: '#E1306C',
  twitter:   '#000000',
  linkedin:  '#0A66C2',
  facebook:  '#1877F2',
  youtube:   '#FF0000',
  tiktok:    '#000000',
  github:    '#24292e',
}

export default function CardClient({ card }: { card: any }) {
  const [mounted, setMounted] = useState(false)
  const themeColor = card.theme_color || '#0a0a0a'

  useEffect(() => { setMounted(true) }, [])
  if (!mounted) return <div className="min-h-screen bg-zinc-950" />

  const contactItems = [
    card.phone_number && { href: `tel:${card.phone_number}`, icon: Phone, label: 'Call' },
    card.email       && { href: `mailto:${card.email}`, icon: Mail, label: 'Email' },
    card.website     && { href: card.website.startsWith('http') ? card.website : `https://${card.website}`, icon: Globe, label: 'Website', external: true },
    card.location    && { href: `https://maps.google.com/?q=${encodeURIComponent(card.location)}`, icon: MapPin, label: card.location, external: true },
  ].filter(Boolean) as { href: string; icon: any; label: string; external?: boolean }[]

  return (
    <div className="min-h-screen bg-zinc-950 font-sans pb-32 overflow-x-hidden">
      <div className="relative max-w-sm mx-auto">

        {/* Banner */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="h-52 w-full relative overflow-hidden"
          style={{ backgroundColor: themeColor }}
        >
          {card.banner_image_url ? (
            <img src={card.banner_image_url} alt="Banner" className="w-full h-full object-cover" />
          ) : (
            <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${themeColor} 0%, #1a1a2e 100%)` }} />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/30 to-transparent" />
        </motion.div>

        {/* Content — overlaps banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative z-10 -mt-16 px-4 space-y-3"
        >
          {/* Avatar + Identity */}
          <div className="flex items-end gap-4">
            <div className="h-24 w-24 rounded-2xl border-2 border-zinc-800 shadow-2xl overflow-hidden bg-zinc-800 flex items-center justify-center shrink-0">
              {card.profile_picture_url ? (
                <img src={card.profile_picture_url} alt={card.owner_name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl font-bold text-zinc-400">
                  {card.owner_name?.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div className="pb-1 min-w-0">
              {card.company_name && (
                <div className="flex items-center gap-1.5 mb-1">
                  {card.company_logo_url && (
                    <img src={card.company_logo_url} alt={card.company_name} className="h-4 w-4 rounded object-contain opacity-80" />
                  )}
                  <span className="text-xs font-semibold text-zinc-400 uppercase tracking-widest truncate">
                    {card.company_name}
                  </span>
                </div>
              )}
              <h1 className="text-xl font-bold text-white tracking-tight leading-tight">{card.owner_name}</h1>
              {card.job_title && (
                <p className="text-sm text-zinc-400 mt-0.5">{card.job_title}</p>
              )}
            </div>
          </div>

          {/* Bio */}
          {card.bio && (
            <div className="rounded-2xl bg-zinc-900 border border-zinc-800 px-4 py-3.5">
              <p className="text-sm text-zinc-300 leading-relaxed">{card.bio}</p>
            </div>
          )}

          {/* Contact items */}
          {contactItems.length > 0 && (
            <div className="space-y-2">
              {contactItems.map(({ href, icon: Icon, label, external }) => (
                <a
                  key={label}
                  href={href}
                  {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-600 transition-all active:scale-[0.98] group"
                >
                  <div className="h-8 w-8 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${themeColor}25`, color: themeColor === '#0a0a0a' ? '#a1a1aa' : themeColor }}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="text-sm text-zinc-200 font-medium truncate">{label}</span>
                  {external && <ExternalLink className="h-3.5 w-3.5 text-zinc-600 ml-auto group-hover:text-zinc-400 transition-colors shrink-0" />}
                </a>
              ))}
            </div>
          )}

          {/* Social Links */}
          {card.card_social_links?.length > 0 && (
            <div className="rounded-2xl bg-zinc-900 border border-zinc-800 px-4 py-4">
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">Social</p>
              <div className="grid grid-cols-2 gap-2">
                {card.card_social_links.map((social: any, idx: number) => {
                  const key = social.platform?.toLowerCase()
                  const Icon = BrandIcons[key]
                  const color = platformColors[key] || '#71717a'
                  return (
                    <a
                      key={idx}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 transition-colors active:scale-[0.97]"
                    >
                      {Icon ? (
                        <Icon className="h-4 w-4 shrink-0" />
                      ) : (
                        <div className="h-4 w-4 rounded-sm bg-zinc-600 shrink-0" />
                      )}
                      <span className="text-xs font-semibold text-zinc-300 capitalize truncate">
                        {social.platform}
                      </span>
                    </a>
                  )
                })}
              </div>
            </div>
          )}

          {/* Custom links */}
          {card.card_custom_buttons?.length > 0 && (
            <div className="space-y-2">
              {card.card_custom_buttons.map((btn: any, idx: number) => (
                <a
                  key={idx}
                  href={btn.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between px-4 py-3 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-600 transition-all active:scale-[0.98] group"
                >
                  <span className="text-sm font-semibold text-zinc-200">{btn.label}</span>
                  <ExternalLink className="h-3.5 w-3.5 text-zinc-600 group-hover:text-zinc-400 transition-colors shrink-0" />
                </a>
              ))}
            </div>
          )}

          {/* Company tagline */}
          {card.company_tagline && (
            <p className="text-center text-xs text-zinc-600 italic px-4">{card.company_tagline}</p>
          )}

          {/* Owner login */}
          <div className="text-center pb-4">
            <a href={`/card/${card.slug}/edit/login`} className="text-[10px] text-zinc-700 hover:text-zinc-500 transition-colors tracking-widest uppercase">
              Owner
            </a>
          </div>
        </motion.div>

        {/* Sticky CTA Bar */}
        <motion.div
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 260, damping: 24 }}
          className="fixed bottom-0 left-0 right-0 px-4 pb-5 pt-3 z-50"
          style={{ background: 'linear-gradient(to top, rgb(9,9,11) 60%, transparent)' }}
        >
          <div className="max-w-sm mx-auto flex gap-2.5">
            <a
              href={`/card/${card.slug}/edit/login`}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-bold rounded-2xl transition-all active:scale-[0.97] shadow-lg"
              style={{ backgroundColor: themeColor === '#0a0a0a' ? '#ffffff' : themeColor, color: themeColor === '#0a0a0a' ? '#000000' : '#ffffff' }}
            >
              <Download className="h-4 w-4" />
              Save Contact
            </a>
            <button
              className="flex items-center justify-center py-3.5 px-4 bg-zinc-800 text-zinc-200 rounded-2xl font-bold border border-zinc-700 hover:bg-zinc-700 transition-all active:scale-[0.97]"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: card.owner_name, url: window.location.href })
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
