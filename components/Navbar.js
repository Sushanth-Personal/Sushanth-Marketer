'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [navSettings, setNavSettings] = useState({ blog: true, pricing: false })
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    async function fetchSettings() {
      const { data } = await supabase.from('settings').select('*').eq('key', 'nav')
      if (data && data[0]) {
        try { setNavSettings(JSON.parse(data[0].value)) } catch {}
      }
    }
    fetchSettings()
  }, [])

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: scrolled ? 'rgba(15,15,13,0.97)' : 'transparent',
      borderBottom: scrolled ? '1px solid #2A2A26' : '1px solid transparent',
      transition: 'all 0.3s ease',
      backdropFilter: scrolled ? 'blur(8px)' : 'none',
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 68 }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <span style={{ fontFamily: 'var(--font-serif)', fontSize: 20, color: 'var(--text-light)', letterSpacing: 1, fontWeight: 400 }}>Sushanth P</span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 36 }}>
          <div style={{ display: 'flex', gap: 32, listStyle: 'none' }}>
            <Link href="/" style={{ color: 'var(--text-light-muted)', fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', textDecoration: 'none', fontFamily: 'var(--font-sans)' }}>Home</Link>
            {navSettings.blog && (
              <Link href="/blog" style={{ color: 'var(--text-light-muted)', fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', textDecoration: 'none', fontFamily: 'var(--font-sans)' }}>Blog</Link>
            )}
            {navSettings.pricing && (
              <Link href="/pricing" style={{ color: 'var(--text-light-muted)', fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', textDecoration: 'none', fontFamily: 'var(--font-sans)' }}>Pricing</Link>
            )}
          </div>
          <a href="mailto:hello@sushanthp.com" style={{
            background: 'transparent', border: '1px solid var(--amber)', color: 'var(--amber)',
            padding: '8px 20px', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase',
            fontFamily: 'var(--font-sans)', cursor: 'pointer', textDecoration: 'none',
            transition: 'all 0.2s'
          }}>Work With Me</a>
        </div>
      </div>
    </nav>
  )
}
