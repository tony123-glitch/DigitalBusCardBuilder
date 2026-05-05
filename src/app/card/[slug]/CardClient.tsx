'use client'

import { motion } from 'framer-motion'
import { Phone, Mail, Globe, MapPin, Download, Share2, ExternalLink } from 'lucide-react'
import { useState, useEffect } from 'react'

const platformColors: Record<string, string> = {
  twitter: 'bg-[#1DA1F2] text-white',
  linkedin: 'bg-[#0A66C2] text-white',
  instagram: 'bg-gradient-to-tr from-[#fd5949] to-[#d6249f] text-white',
  facebook: 'bg-[#1877F2] text-white',
  youtube: 'bg-[#FF0000] text-white',
  tiktok: 'bg-black text-white',
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
}

export default function CardClient({ card }: { card: any }) {
  const [mounted, setMounted] = useState(false)
  const themeColor = card.theme_color || '#0F172A'

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return <div className="min-h-screen bg-slate-50" />

  const vcardUrl = '#' // Placeholder

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100 pb-32 overflow-x-hidden">
      {/* Animated Background Gradient overlay */}
      <div 
        className="fixed inset-0 opacity-[0.03] z-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 0%, ${themeColor} 0%, transparent 70%)`
        }}
      />

      <div className="relative z-10 max-w-md mx-auto">
        {/* Banner Section */}
        <motion.div 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="h-56 w-full relative overflow-hidden rounded-b-[2.5rem] shadow-sm"
          style={{ backgroundColor: themeColor }}
        >
          {card.banner_image_url && (
            <img 
              src={card.banner_image_url} 
              alt="Banner" 
              className="w-full h-full object-cover opacity-90"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="px-5 -mt-20 relative z-20 space-y-4"
        >
          {/* Profile Picture */}
          <motion.div variants={itemVariants} className="flex justify-center mb-2">
            <div className="relative">
              <div className="absolute -inset-1 bg-white rounded-full blur-sm opacity-50" />
              <div className="h-36 w-36 rounded-full border-4 border-white shadow-2xl overflow-hidden bg-white flex items-center justify-center relative z-10">
                {card.profile_picture_url ? (
                  <img src={card.profile_picture_url} alt={card.owner_name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-5xl font-bold text-slate-300" style={{ color: themeColor }}>
                    {card.owner_name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              {/* Optional verification badge could go here */}
            </div>
          </motion.div>

          {/* Core Info - Glassmorphism Bento Card */}
          <motion.div variants={itemVariants} className="bg-white/70 backdrop-blur-xl border border-white rounded-3xl p-6 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">{card.owner_name}</h1>
            {card.job_title && (
              <p className="text-slate-600 font-medium mt-1">{card.job_title}</p>
            )}
            {card.company_name && (
              <div className="flex items-center justify-center gap-2 mt-3 p-2 bg-slate-50/50 rounded-2xl mx-auto inline-flex">
                {card.company_logo_url && (
                  <img src={card.company_logo_url} alt={card.company_name} className="h-6 w-6 rounded border border-slate-200 object-cover" />
                )}
                <span className="text-sm font-bold text-slate-800">{card.company_name}</span>
              </div>
            )}
            {card.company_tagline && (
              <p className="text-xs text-slate-500 mt-2 font-medium">{card.company_tagline}</p>
            )}
          </motion.div>

          {/* Quick Contact Links - Bento Grid */}
          <motion.div variants={itemVariants} className="grid grid-cols-4 gap-3">
            {card.phone_number && (
              <a href={`tel:${card.phone_number}`} className="flex flex-col items-center justify-center p-4 bg-white/70 backdrop-blur-md rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-white hover:bg-white transition-all active:scale-95 group">
                <div className="p-2.5 rounded-full mb-1 group-hover:scale-110 transition-transform" style={{ backgroundColor: `${themeColor}15`, color: themeColor }}>
                  <Phone className="h-5 w-5" />
                </div>
                <span className="text-[11px] font-semibold text-slate-600">Call</span>
              </a>
            )}
            {card.email && (
              <a href={`mailto:${card.email}`} className="flex flex-col items-center justify-center p-4 bg-white/70 backdrop-blur-md rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-white hover:bg-white transition-all active:scale-95 group">
                <div className="p-2.5 rounded-full mb-1 group-hover:scale-110 transition-transform" style={{ backgroundColor: `${themeColor}15`, color: themeColor }}>
                  <Mail className="h-5 w-5" />
                </div>
                <span className="text-[11px] font-semibold text-slate-600">Email</span>
              </a>
            )}
            {card.website && (
              <a href={card.website.startsWith('http') ? card.website : `https://${card.website}`} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center p-4 bg-white/70 backdrop-blur-md rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-white hover:bg-white transition-all active:scale-95 group">
                <div className="p-2.5 rounded-full mb-1 group-hover:scale-110 transition-transform" style={{ backgroundColor: `${themeColor}15`, color: themeColor }}>
                  <Globe className="h-5 w-5" />
                </div>
                <span className="text-[11px] font-semibold text-slate-600">Web</span>
              </a>
            )}
            {card.location && (
              <a href={`https://maps.google.com/?q=${encodeURIComponent(card.location)}`} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center p-4 bg-white/70 backdrop-blur-md rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-white hover:bg-white transition-all active:scale-95 group">
                <div className="p-2.5 rounded-full mb-1 group-hover:scale-110 transition-transform" style={{ backgroundColor: `${themeColor}15`, color: themeColor }}>
                  <MapPin className="h-5 w-5" />
                </div>
                <span className="text-[11px] font-semibold text-slate-600">Map</span>
              </a>
            )}
          </motion.div>

          {/* Bio */}
          {card.bio && (
            <motion.div variants={itemVariants} className="bg-white/70 backdrop-blur-xl border border-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: themeColor }} />
              <h3 className="text-xs font-bold text-slate-400 mb-3 tracking-widest uppercase ml-2">About</h3>
              <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap ml-2">{card.bio}</p>
            </motion.div>
          )}

          {/* Custom Links */}
          {card.card_custom_buttons && card.card_custom_buttons.length > 0 && (
            <motion.div variants={itemVariants} className="space-y-3">
              {card.card_custom_buttons.map((btn: any, idx: number) => (
                <a
                  key={idx}
                  href={btn.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 bg-white/80 backdrop-blur-md rounded-2xl shadow-[0_4px_15px_rgb(0,0,0,0.02)] border border-white/50 hover:shadow-md transition-all active:scale-[0.98] group"
                >
                  <span className="font-semibold text-slate-800">{btn.label}</span>
                  <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-slate-100 transition-colors">
                    <ExternalLink className="h-4 w-4 text-slate-400 group-hover:text-slate-700" />
                  </div>
                </a>
              ))}
            </motion.div>
          )}

          {/* Social Links */}
          {card.card_social_links && card.card_social_links.length > 0 && (
            <motion.div variants={itemVariants} className="bg-white/60 backdrop-blur-xl border border-white rounded-3xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <div className="flex flex-wrap justify-center gap-2.5">
                {card.card_social_links.map((social: any, idx: number) => {
                  const bgClass = platformColors[social.platform.toLowerCase()] || 'bg-slate-800 text-white'
                  return (
                    <a
                      key={idx}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`px-4 py-2 rounded-xl text-[13px] font-semibold shadow-sm hover:shadow-md transition-all active:scale-95 flex-grow sm:flex-grow-0 text-center ${bgClass}`}
                    >
                      {social.platform.charAt(0).toUpperCase() + social.platform.slice(1)}
                    </a>
                  )
                })}
              </div>
            </motion.div>
          )}

          {/* Footer Link to Edit */}
          <motion.div variants={itemVariants} className="text-center mt-6 pt-4 pb-12">
            <a href={`/card/${card.slug}/edit/login`} className="text-[11px] font-medium text-slate-400 hover:text-slate-600 transition-colors tracking-wide uppercase">
              Owner Login
            </a>
          </motion.div>
        </motion.div>

        {/* Sticky Floating Action Buttons */}
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, type: 'spring', stiffness: 300, damping: 25 }}
          className="fixed bottom-6 left-0 right-0 px-5 z-50 pointer-events-none"
        >
          <div className="max-w-md mx-auto flex gap-3 pointer-events-auto">
            <a
              href={vcardUrl}
              className="flex-1 flex items-center justify-center gap-2 py-4 px-4 text-white rounded-2xl font-bold shadow-xl shadow-slate-900/20 hover:shadow-2xl transition-all active:scale-95"
              style={{ backgroundColor: themeColor }}
            >
              <Download className="h-5 w-5" />
              Save Contact
            </a>
            <button
              className="flex items-center justify-center py-4 px-5 bg-white text-slate-900 rounded-2xl font-bold shadow-xl shadow-slate-200/50 hover:bg-slate-50 transition-all active:scale-95 border border-slate-100"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: `${card.owner_name} - ${card.company_name || 'Digital Business Card'}`,
                    url: window.location.href,
                  })
                }
              }}
            >
              <Share2 className="h-5 w-5" />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
