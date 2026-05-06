'use client'

import { motion } from 'framer-motion'
import { Phone, Mail, Globe, MapPin, Download, Share2, ExternalLink, ArrowUpRight } from 'lucide-react'
import { useState, useEffect } from 'react'

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

export default function CardClient({ card }: { card: any }) {
  const [mounted, setMounted] = useState(false)
  
  // Base theme color defaults to a rich metallic gold/slate if not set
  const themeColor = card.theme_color || '#d4af37' 

  useEffect(() => { setMounted(true) }, [])
  
  if (!mounted) {
    return <div className="min-h-screen bg-[#050505]" />
  }

  const contactItems = [
    card.phone_number && { href: `tel:${card.phone_number}`, icon: Phone, label: card.phone_number },
    card.email       && { href: `mailto:${card.email}`, icon: Mail, label: card.email },
    card.website     && { href: card.website.startsWith('http') ? card.website : `https://${card.website}`, icon: Globe, label: card.website.replace(/^https?:\/\//, ''), external: true },
    card.location    && { href: `https://maps.google.com/?q=${encodeURIComponent(card.location)}`, icon: MapPin, label: card.location, external: true },
  ].filter(Boolean) as { href: string; icon: any; label: string; external?: boolean }[]

  return (
    <div className="min-h-screen bg-[#050505] font-sans pb-32 overflow-x-hidden selection:bg-white/20 text-white relative">
      
      {/* Dynamic Cinematic Lighting Background */}
      <div 
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: `
            radial-gradient(ellipse at 50% -20%, ${themeColor}30 0%, transparent 60%),
            radial-gradient(circle at 100% 40%, ${themeColor}08 0%, transparent 40%),
            radial-gradient(circle at 0% 100%, ${themeColor}10 0%, transparent 40%)
          `
        }}
      />

      <div className="relative z-10 max-w-[420px] mx-auto px-5 sm:px-6">

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
               <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-black/40 to-transparent" />
             </div>
          )}
          {!card.banner_image_url && (
            <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${themeColor} 0%, transparent 100%)`, opacity: 0.2 }} />
          )}
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="relative z-20 -mt-16 space-y-6"
        >
          {/* Identity & Avatar */}
          <motion.div variants={itemVariants} className="flex flex-col items-center text-center">
            <div className="relative mb-5 group">
               <div className="absolute -inset-1 rounded-full blur-md opacity-30 group-hover:opacity-50 transition duration-1000" style={{ backgroundColor: themeColor }} />
               <div className="relative h-28 w-28 rounded-full shadow-2xl overflow-hidden bg-[#111] flex items-center justify-center ring-1 ring-white/10">
                 {card.profile_picture_url ? (
                   <img src={card.profile_picture_url} alt={card.owner_name} className="w-full h-full object-cover" />
                 ) : (
                   <span className="text-3xl font-light text-white tracking-widest">
                     {card.owner_name?.charAt(0).toUpperCase()}
                   </span>
                 )}
               </div>
            </div>

            {card.company_name && (
              <div className="flex items-center justify-center gap-3 mb-2">
                {card.company_logo_url && (
                  <img src={card.company_logo_url} alt={card.company_name} className="h-14 w-auto max-w-[200px] rounded-sm object-contain opacity-100" />
                )}
                <span className="text-xs font-semibold text-white/80 uppercase tracking-[0.15em]">
                  {card.company_name}
                </span>
              </div>
            )}
            
            <h1 className="text-[28px] font-medium text-white tracking-tight leading-none mb-2">
              {card.owner_name}
            </h1>
            
            {card.job_title && (
              <p className="text-sm font-light text-white/60 tracking-wide">{card.job_title}</p>
            )}
          </motion.div>

          {/* Bio - Elegant editorial block */}
          {card.bio && (
            <motion.div variants={itemVariants} className="text-center px-4">
              <p className="text-[13px] font-light text-white/70 leading-relaxed">
                {card.bio}
              </p>
            </motion.div>
          )}

          {/* Primary Contact Actions */}
          {contactItems.length > 0 && (
            <motion.div variants={itemVariants} className="space-y-2.5 pt-2">
              {contactItems.map(({ href, icon: Icon, label, external }) => (
                <a
                  key={label}
                  href={href}
                  {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="flex items-center gap-4 px-5 py-4 rounded-2xl bg-white/5 border border-white/[0.08] hover:bg-white/[0.08] hover:border-white/[0.15] transition-all active:scale-[0.98] group backdrop-blur-xl"
                >
                  <div className="flex items-center justify-center w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity" style={{ color: themeColor }}>
                    <Icon strokeWidth={1.5} className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-light text-white/90 truncate flex-1 tracking-wide">{label}</span>
                  {external && <ArrowUpRight strokeWidth={1.5} className="w-4 h-4 text-white/30 group-hover:text-white/60 transition-colors" />}
                </a>
              ))}
            </motion.div>
          )}

          {/* Social Links - Clean Grid */}
          {card.card_social_links?.length > 0 && (
            <motion.div variants={itemVariants} className="pt-4">
              <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-4 text-center">
                Connect
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {card.card_social_links.map((social: any, idx: number) => {
                  const key = social.platform?.toLowerCase()
                  const Icon = BrandIcons[key]
                  return (
                    <a
                      key={idx}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-12 h-12 rounded-full bg-white/5 border border-white/[0.08] hover:bg-white/[0.12] transition-all active:scale-[0.95] group backdrop-blur-xl"
                    >
                      {Icon ? (
                        <Icon className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" />
                      ) : (
                        <ArrowUpRight className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" />
                      )}
                    </a>
                  )
                })}
              </div>
            </motion.div>
          )}

          {/* Custom Links */}
          {card.card_custom_buttons?.length > 0 && (
            <motion.div variants={itemVariants} className="space-y-2.5 pt-4">
              <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-4 text-center">
                Links
              </p>
              {card.card_custom_buttons.map((btn: any, idx: number) => (
                <a
                  key={idx}
                  href={btn.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between px-5 py-4 rounded-2xl bg-gradient-to-r from-white/5 to-transparent border border-white/[0.08] hover:border-white/[0.15] hover:from-white/[0.08] transition-all active:scale-[0.98] group"
                >
                  <span className="text-sm font-medium text-white/90 tracking-wide">{btn.label}</span>
                  <ArrowUpRight strokeWidth={1.5} className="w-4 h-4 text-white/30 group-hover:text-white/60 transition-colors" />
                </a>
              ))}
            </motion.div>
          )}

          {/* Tagline & Footer */}
          {card.company_tagline && (
            <motion.div variants={itemVariants} className="pt-6 pb-2 text-center">
              <p className="text-xs italic font-medium tracking-wide text-white/90">
                "{card.company_tagline}"
              </p>
            </motion.div>
          )}

          <motion.div variants={itemVariants} className="text-center pt-8 pb-10">
            <a href={`/card/${card.slug}/edit/login`} className="text-[9px] text-white/20 hover:text-white/50 transition-colors tracking-[0.2em] uppercase font-bold">
              Owner Access
            </a>
          </motion.div>
        </motion.div>

        {/* Floating Action Bar - Ultra Premium */}
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1, duration: 1, ease: cinematicEase }}
          className="fixed bottom-0 left-0 right-0 px-5 pb-8 pt-10 z-50 pointer-events-none"
          style={{ background: 'linear-gradient(to top, rgba(5,5,5,1) 20%, rgba(5,5,5,0.8) 60%, transparent)' }}
        >
          <div className="max-w-[420px] mx-auto flex gap-3 pointer-events-auto">
            <a
              href={`/card/${card.slug}/edit/login`}
              className="flex-1 flex items-center justify-center gap-2.5 h-14 rounded-2xl font-semibold text-[13px] tracking-wide transition-all active:scale-[0.97] shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:shadow-[0_0_50px_rgba(255,255,255,0.15)]"
              style={{ backgroundColor: '#ffffff', color: '#000000' }}
            >
              <Download className="w-4 h-4" strokeWidth={2.5} />
              Save Contact
            </a>
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
      </div>
    </div>
  )
}
