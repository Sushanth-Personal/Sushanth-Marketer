import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'
import Script from 'next/script'

export const revalidate = 60

export async function generateMetadata({ params }) {
  const { data } = await supabase
    .from('posts')
    .select('title, excerpt, cover_image, created_at')
    .eq('slug', params.slug)
    .single()

  if (!data) return { title: 'Post not found' }

  return {
    title: data.title,
    description: data.excerpt,
    alternates: {
      canonical: `https://sushanthp.com/blog/${params.slug}`,
    },
    openGraph: {
      title: data.title,
      description: data.excerpt,
      url: `https://sushanthp.com/blog/${params.slug}`,
      type: 'article',
      publishedTime: data.created_at,
      authors: ['Sushanth P'],
      images: data.cover_image
        ? [{ url: data.cover_image, width: 1200, height: 630 }]
        : [{ url: '/og-image.png', width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: data.title,
      description: data.excerpt,
      images: data.cover_image ? [data.cover_image] : ['/og-image.png'],
    },
  }
}

export default async function BlogPost({ params }) {
  const { data: post } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', params.slug)
    .eq('published', true)
    .single()

  if (!post) notFound()

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.created_at,
    dateModified: post.created_at,
    author: {
      '@type': 'Person',
      name: 'Sushanth P',
      url: 'https://sushanthp.com',
    },
    publisher: {
      '@type': 'Person',
      name: 'Sushanth P',
      url: 'https://sushanthp.com',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://sushanthp.com/blog/${post.slug}`,
    },
    ...(post.cover_image && { image: post.cover_image }),
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)' }}>
      <Script
        id="schema-article"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <Navbar />
      <div style={{ paddingTop: 68 }}>
        {/* Post header */}
        <section style={{ background: 'var(--dark)', padding: '80px 32px 64px' }}>
          <div style={{ maxWidth: 720, margin: '0 auto' }}>
            <Link href="/blog" style={{ fontSize: 12, color: 'var(--text-light-muted)', fontFamily: 'var(--font-sans)', letterSpacing: 1, textTransform: 'uppercase', textDecoration: 'none', display: 'inline-block', marginBottom: 32 }}>
              ← All posts
            </Link>
            {post.tag && (
              <p style={{ fontSize: 11, color: 'var(--amber)', letterSpacing: 3, textTransform: 'uppercase', fontFamily: 'var(--font-sans)', marginBottom: 20 }}>
                {post.tag}
              </p>
            )}
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 400, color: 'var(--text-light)', lineHeight: 1.2, marginBottom: 24 }}>
              {post.title}
            </h1>
            <p style={{ fontSize: 13, color: 'var(--text-light-muted)', fontFamily: 'var(--font-sans)' }}>
              {new Date(post.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
        </section>

        {/* Post content */}
        <section style={{ padding: '72px 32px 96px' }}>
          <div style={{ maxWidth: 720, margin: '0 auto' }}>
            {post.cover_image && (
              <img
                src={post.cover_image}
                alt={post.title}
                style={{ width: '100%', height: 380, objectFit: 'cover', marginBottom: 56, borderRadius: 2 }}
              />
            )}
            <div className="blog-content" dangerouslySetInnerHTML={{ __html: post.content }} />

            <div style={{ marginTop: 72, paddingTop: 40, borderTop: '1px solid var(--border-light)', textAlign: 'center' }}>
              <p style={{ fontFamily: 'var(--font-serif)', fontSize: 22, color: 'var(--text-primary)', marginBottom: 16 }}>
                Found this useful?
              </p>
              <p style={{ fontSize: 15, color: 'var(--text-muted)', marginBottom: 28 }}>
                Let's talk about what this means for your marketing.
              </p>
              <a
                href="mailto:hello@sushanthp.com"
                style={{ background: 'var(--dark)', color: 'var(--text-light)', padding: '13px 28px', fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', fontFamily: 'var(--font-sans)', textDecoration: 'none', display: 'inline-block' }}
              >
               Work With Me &#8594;
              </a>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  )
}