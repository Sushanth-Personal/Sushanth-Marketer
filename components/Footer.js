import Link from 'next/link'

export default function Footer() {
  return (
    <footer style={{ background: 'var(--dark)', borderTop: '1px solid var(--border-dark)', padding: '40px 32px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <span style={{ fontFamily: 'var(--font-serif)', fontSize: 18, color: 'var(--text-light)', fontWeight: 400 }}>Sushanth P</span>
          <p style={{ fontSize: 12, color: 'var(--text-light-muted)', marginTop: 6, letterSpacing: 0.5, fontFamily: 'var(--font-sans)' }}>Sharp marketing for founders who are done guessing.</p>
        </div>
        <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          <Link href="/blog" style={{ fontSize: 12, color: '#3A3830', letterSpacing: 1, textDecoration: 'none', fontFamily: 'var(--font-sans)', textTransform: 'uppercase' }}>Blog</Link>
          <a href="mailto:hello@sushanthp.com" style={{ fontSize: 12, color: '#3A3830', letterSpacing: 1, textDecoration: 'none', fontFamily: 'var(--font-sans)', textTransform: 'uppercase' }}>Contact</a>
          <span style={{ fontSize: 12, color: '#2A2820', fontFamily: 'var(--font-sans)' }}>© 2026 sushanthp.com</span>
        </div>
      </div>
    </footer>
  )
}
