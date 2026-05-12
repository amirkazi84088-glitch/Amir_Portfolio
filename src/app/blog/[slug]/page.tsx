'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

export default function BlogPost() {
  const params = useParams()
  const slug = params?.slug as string
  const [blog, setBlog] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!slug) return
    fetch(`/api/public/blogs?slug=${slug}`)
      .then(r => { if (r.status === 404) { setNotFound(true); setLoading(false); return null } return r.json() })
      .then(data => { if (data && !data.error) setBlog(data); setLoading(false) })
      .catch(() => { setNotFound(true); setLoading(false) })
  }, [slug])

  if (loading) return <div style={{minHeight:'100vh',background:'var(--bg)',display:'flex',alignItems:'center',justifyContent:'center'}}><div style={{fontFamily:'var(--mono)',color:'var(--accent)'}}>Loading post...</div></div>

  if (notFound || !blog) return (
    <div style={{minHeight:'100vh',background:'var(--bg)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:'1.5rem'}}>
      <div style={{fontFamily:'var(--heading)',fontSize:'5rem',fontWeight:800,background:'linear-gradient(135deg,var(--accent),var(--accent2))',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>404</div>
      <p style={{color:'var(--muted)'}}>Blog post not found</p>
      <Link href="/blog" style={{color:'var(--accent)',border:'1px solid rgba(0,212,255,.3)',padding:'.6rem 1.5rem',borderRadius:6}}>← Back to Blog</Link>
    </div>
  )

  return (
    <div style={{minHeight:'100vh',background:'var(--bg)'}}>
      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        .bc h2{font-family:var(--heading);font-size:1.6rem;font-weight:800;margin:2.5rem 0 1rem;background:linear-gradient(135deg,var(--text),var(--accent));-webkit-background-clip:text;-webkit-text-fill-color:transparent}
        .bc h3{font-family:var(--heading);font-size:1.2rem;font-weight:700;margin:2rem 0 .8rem;color:var(--accent)}
        .bc p{color:var(--muted);line-height:1.9;margin-bottom:1.2rem}
        .bc code{font-family:var(--mono);font-size:.88em;background:rgba(0,212,255,.08);border:1px solid rgba(0,212,255,.15);border-radius:4px;padding:.2rem .6rem;color:var(--accent);display:inline-block;margin:.2rem 0}
        .bc ul,.bc ol{color:var(--muted);padding-left:1.5rem;margin-bottom:1.2rem;line-height:2}
        .bc strong{color:var(--text)}
      `}</style>
      <nav style={{padding:'1.2rem 4rem',display:'flex',justifyContent:'space-between',alignItems:'center',borderBottom:'1px solid var(--border)',background:'rgba(4,6,15,.95)',backdropFilter:'blur(20px)',position:'sticky',top:0,zIndex:100}}>
        <Link href="/" style={{fontFamily:'var(--heading)',fontSize:'1.4rem',fontWeight:800,background:'linear-gradient(135deg,var(--accent),var(--accent2))',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>AK.</Link>
        <Link href="/blog" style={{color:'var(--muted)',fontSize:'.85rem'}}>← All Posts</Link>
      </nav>
      <article style={{maxWidth:760,margin:'0 auto',padding:'5rem 2rem',animation:'fadeUp .6s ease'}}>
        <div style={{marginBottom:'3rem'}}>
          <div style={{display:'flex',gap:'.8rem',fontSize:'.78rem',fontFamily:'var(--mono)',marginBottom:'1.5rem',flexWrap:'wrap',alignItems:'center'}}>
            <span style={{background:'rgba(0,212,255,.08)',border:'1px solid rgba(0,212,255,.2)',borderRadius:4,padding:'.25rem .8rem',color:'var(--accent)'}}>{blog.category}</span>
            <span style={{color:'var(--muted)'}}>⏱ {blog.read_time}</span>
            <span style={{color:'var(--muted)'}}>📅 {new Date(blog.created_at).toLocaleDateString('en-IN',{year:'numeric',month:'long',day:'numeric'})}</span>
          </div>
          <div style={{fontSize:'4rem',marginBottom:'1rem'}}>{blog.emoji}</div>
          <h1 style={{fontFamily:'var(--heading)',fontSize:'clamp(1.8rem,4vw,2.8rem)',fontWeight:800,lineHeight:1.15,letterSpacing:'-.03em',marginBottom:'1.2rem'}}>{blog.title}</h1>
          {blog.summary && <p style={{color:'var(--muted)',fontSize:'1.05rem',lineHeight:1.7,borderLeft:'3px solid var(--accent)',paddingLeft:'1.2rem',fontStyle:'italic'}}>{blog.summary}</p>}
        </div>
        <div className="bc" dangerouslySetInnerHTML={{__html:blog.content}} />
        <div style={{marginTop:'4rem',paddingTop:'2rem',borderTop:'1px solid var(--border)',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'1rem'}}>
          <div style={{display:'flex',alignItems:'center',gap:'1rem'}}>
            <div style={{width:44,height:44,borderRadius:'50%',background:'linear-gradient(135deg,var(--accent),var(--accent2))',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'var(--heading)',fontWeight:800,color:'#fff'}}>AK</div>
            <div><div style={{fontWeight:600,fontSize:'.92rem'}}>Amir Kazi</div><div style={{color:'var(--muted)',fontSize:'.78rem'}}>Cybersecurity & Full Stack Developer</div></div>
          </div>
          <div style={{display:'flex',gap:'1rem'}}>
            <Link href="/blog" style={{background:'rgba(0,212,255,.08)',border:'1px solid rgba(0,212,255,.2)',borderRadius:6,padding:'.5rem 1.2rem',color:'var(--accent)',fontSize:'.82rem'}}>← More Posts</Link>
            <Link href="/#contact" style={{background:'linear-gradient(135deg,var(--accent),var(--accent2))',borderRadius:6,padding:'.5rem 1.2rem',color:'#fff',fontSize:'.82rem',fontWeight:600}}>Contact Me</Link>
          </div>
        </div>
      </article>
    </div>
  )
}
