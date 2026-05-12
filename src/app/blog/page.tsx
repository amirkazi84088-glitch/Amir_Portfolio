import Link from 'next/link'

async function getBlogs() {
  try {
    const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const res = await fetch(`${base}/api/public/blogs`, { cache: 'no-store' })
    return res.ok ? res.json() : []
  } catch { return [] }
}

const bgs = ['linear-gradient(135deg,#001a2e,#00334d)', 'linear-gradient(135deg,#1a0028,#2e0047)', 'linear-gradient(135deg,#002b1a,#004d2e)']

export default async function BlogPage() {
  const blogs = await getBlogs()
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <nav style={{ padding: '1.2rem 4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', backdropFilter: 'blur(20px)', background: 'rgba(4,6,15,.85)', position: 'sticky', top: 0, zIndex: 100 }}>
        <Link href="/" style={{ fontFamily: 'var(--heading)', fontSize: '1.4rem', fontWeight: 800, background: 'linear-gradient(135deg,var(--accent),var(--accent2))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>AK.</Link>
        <Link href="/" style={{ color: 'var(--muted)', fontSize: '.85rem' }}>← Back to Portfolio</Link>
      </nav>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '5rem 2rem' }}>
        <div style={{ marginBottom: '3rem' }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: '.75rem', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '.2em', display: 'flex', alignItems: 'center', gap: '.8rem', marginBottom: '1rem' }}>
            <span style={{ width: 30, height: 1, background: 'var(--accent)', display: 'inline-block' }} /> Blog
          </div>
          <h1 style={{ fontFamily: 'var(--heading)', fontSize: 'clamp(2rem,5vw,3.5rem)', fontWeight: 800, letterSpacing: '-.03em' }}>
            Security Insights &amp; <span style={{ background: 'linear-gradient(135deg,var(--accent),var(--accent2))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Dev Stories</span>
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: '1rem', marginTop: '1rem', lineHeight: 1.8 }}>Penetration testing, Spring Boot, Angular, CTF writeups, and more.</p>
        </div>
        {blogs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--muted)', fontFamily: 'var(--mono)' }}>No blog posts yet. Check back soon!</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: '1.5rem' }}>
            {blogs.map((b: any, i: number) => (
              <Link key={b.id} href={`/blog/${b.slug}`} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', display: 'block', textDecoration: 'none', transition: 'all .3s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,212,255,.4)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.borderColor = '' }}>
                <div style={{ height: 160, background: bgs[i % 3], display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.8rem' }}>{b.emoji || '✍️'}</div>
                <div style={{ padding: '1.3rem' }}>
                  <div style={{ display: 'flex', gap: '.8rem', fontSize: '.72rem', color: 'var(--muted)', fontFamily: 'var(--mono)', marginBottom: '.8rem' }}>
                    <span style={{ color: 'var(--accent)' }}>{b.category}</span><span>·</span><span>{b.read_time}</span>
                    <span>·</span><span>{new Date(b.created_at).toLocaleDateString()}</span>
                  </div>
                  <h2 style={{ fontWeight: 600, fontSize: '1rem', lineHeight: 1.5, marginBottom: '.6rem', color: 'var(--text)' }}>{b.title}</h2>
                  <p style={{ fontSize: '.83rem', color: 'var(--muted)', lineHeight: 1.7 }}>{b.summary}</p>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '.3rem', fontSize: '.78rem', color: 'var(--accent)', marginTop: '1rem' }}>Read More →</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
