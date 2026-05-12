'use client'
import { useEffect, useState, useRef, useCallback } from 'react'
import Link from 'next/link'
import Tracker from '@/components/Tracker'

const PHRASES = ['Cybersecurity Enthusiast','Full Stack Developer','Penetration Tester','Spring Boot Developer','Angular Developer','CTF Player']

function TypingText() {
  const [text, setText] = useState('')
  const [pi, setPi] = useState(0)
  const [del, setDel] = useState(false)
  const [ci, setCi] = useState(0)
  useEffect(() => {
    const phrase = PHRASES[pi]
    const t = setTimeout(() => {
      if (!del) { setText(phrase.slice(0,ci+1)); if(ci+1>=phrase.length){setTimeout(()=>setDel(true),1400);return}; setCi(c=>c+1) }
      else { setText(phrase.slice(0,ci-1)); if(ci-1<0){setDel(false);setPi(p=>(p+1)%PHRASES.length);setCi(0);return}; setCi(c=>c-1) }
    }, del?40:70)
    return ()=>clearTimeout(t)
  },[ci,del,pi])
  return <p style={{fontFamily:'var(--mono)',fontSize:'1rem',color:'var(--accent)',margin:'1.5rem 0',minHeight:'1.5rem'}}>{text}<span style={{animation:'blink 1s infinite',display:'inline-block'}}>|</span></p>
}

function CountUp({to,suffix=''}:{to:number,suffix?:string}) {
  const [val,setVal]=useState(0); const ref=useRef<HTMLDivElement>(null)
  useEffect(()=>{
    const obs=new IntersectionObserver(entries=>{
      if(entries[0].isIntersecting){let s=0;const step=Math.ceil(to/40);const t=setInterval(()=>{s+=step;if(s>=to){setVal(to);clearInterval(t)}else setVal(s)},40);obs.disconnect()}
    })
    if(ref.current)obs.observe(ref.current); return()=>obs.disconnect()
  },[to])
  return <div ref={ref} style={{fontFamily:'var(--heading)',fontSize:'2rem',fontWeight:800,background:'linear-gradient(135deg,var(--accent),var(--accent2))',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>{val}{suffix}</div>
}

function Reveal({children,delay=0}:{children:React.ReactNode,delay?:number}) {
  const ref=useRef<HTMLDivElement>(null); const [v,setV]=useState(false)
  useEffect(()=>{
    const obs=new IntersectionObserver(e=>{if(e[0].isIntersecting){setV(true);obs.disconnect()}},{threshold:0.1})
    if(ref.current)obs.observe(ref.current); return()=>obs.disconnect()
  },[])
  return <div ref={ref} style={{opacity:v?1:0,transform:v?'translateY(0)':'translateY(30px)',transition:`opacity .7s ${delay}ms cubic-bezier(.4,0,.2,1),transform .7s ${delay}ms cubic-bezier(.4,0,.2,1)`}}>{children}</div>
}

function SkillCard({name,category,percentage}:{name:string,category:string,percentage:number}) {
  const ref=useRef<HTMLDivElement>(null); const [filled,setFilled]=useState(false)
  useEffect(()=>{
    const obs=new IntersectionObserver(e=>{if(e[0].isIntersecting){setFilled(true);obs.disconnect()}},{threshold:.3})
    if(ref.current)obs.observe(ref.current); return()=>obs.disconnect()
  },[])
  return (
    <div ref={ref} style={{background:'var(--card)',border:'1px solid var(--border)',borderRadius:12,padding:'1.5rem',transition:'all .3s',cursor:'default'}} onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.borderColor='rgba(0,212,255,.4)';(e.currentTarget as HTMLElement).style.transform='translateY(-4px)'}} onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor='rgba(0,212,255,.12)';(e.currentTarget as HTMLElement).style.transform=''}}>
      <div style={{fontSize:'.7rem',color:'var(--accent)',fontFamily:'var(--mono)',textTransform:'uppercase',letterSpacing:'.15em',marginBottom:'.8rem'}}>{category}</div>
      <div style={{fontWeight:600,fontSize:'.95rem',marginBottom:'1rem'}}>{name}</div>
      <div style={{height:3,background:'rgba(255,255,255,.06)',borderRadius:2,overflow:'hidden',marginBottom:'.5rem'}}>
        <div style={{height:'100%',borderRadius:2,background:'linear-gradient(90deg,var(--accent),var(--accent2))',width:filled?`${percentage}%`:'0%',transition:'width 1.2s cubic-bezier(.4,0,.2,1)'}}/>
      </div>
      <div style={{fontSize:'.75rem',color:'var(--muted)',textAlign:'right',fontFamily:'var(--mono)'}}>{percentage}%</div>
    </div>
  )
}

// Animated background particles
function Particles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(()=>{
    const canvas = canvasRef.current; if(!canvas) return
    const ctx = canvas.getContext('2d')!
    canvas.width = window.innerWidth; canvas.height = window.innerHeight
    const particles: any[] = []
    for(let i=0;i<80;i++) particles.push({x:Math.random()*canvas.width,y:Math.random()*canvas.height,vx:(Math.random()-.5)*.3,vy:(Math.random()-.5)*.3,r:Math.random()*1.5+.5,o:Math.random()*.5+.1})
    let raf: number
    function draw() {
      ctx.clearRect(0,0,canvas.width,canvas.height)
      particles.forEach(p=>{
        p.x+=p.vx; p.y+=p.vy
        if(p.x<0)p.x=canvas.width; if(p.x>canvas.width)p.x=0
        if(p.y<0)p.y=canvas.height; if(p.y>canvas.height)p.y=0
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2)
        ctx.fillStyle=`rgba(0,212,255,${p.o})`; ctx.fill()
      })
      // Draw connections
      for(let i=0;i<particles.length;i++) for(let j=i+1;j<particles.length;j++) {
        const dx=particles[i].x-particles[j].x, dy=particles[i].y-particles[j].y
        const dist=Math.sqrt(dx*dx+dy*dy)
        if(dist<120){ctx.beginPath();ctx.moveTo(particles[i].x,particles[i].y);ctx.lineTo(particles[j].x,particles[j].y);ctx.strokeStyle=`rgba(0,212,255,${.08*(1-dist/120)})`;ctx.lineWidth=.5;ctx.stroke()}
      }
      raf=requestAnimationFrame(draw)
    }
    draw()
    const resize=()=>{canvas.width=window.innerWidth;canvas.height=window.innerHeight}
    window.addEventListener('resize',resize)
    return()=>{cancelAnimationFrame(raf);window.removeEventListener('resize',resize)}
  },[])
  return <canvas ref={canvasRef} style={{position:'fixed',inset:0,pointerEvents:'none',zIndex:0,opacity:.6}}/>
}

function ContactForm() {
  const [form,setForm]=useState({name:'',email:'',subject:'',message:''})
  const [status,setStatus]=useState<'idle'|'loading'|'sent'|'error'>('idle')
  async function submit() {
    if(!form.name||!form.email||!form.message){setStatus('error');return}
    setStatus('loading')
    try {
      const r = await fetch('/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)})
      if(r.ok){setStatus('sent');setForm({name:'',email:'',subject:'',message:''})}
      else setStatus('error')
    } catch {setStatus('error')}
    if(status==='error')setTimeout(()=>setStatus('idle'),3000)
  }
  const inp:React.CSSProperties={width:'100%',background:'rgba(255,255,255,.03)',border:'1px solid rgba(255,255,255,.08)',borderRadius:8,padding:'.85rem 1rem',color:'var(--text)',fontSize:'.9rem',outline:'none',marginBottom:'1.2rem',fontFamily:'var(--font)'}
  const lbl:React.CSSProperties={display:'block',fontSize:'.72rem',color:'var(--muted)',textTransform:'uppercase',letterSpacing:'.1em',marginBottom:'.5rem',fontFamily:'var(--mono)'}
  return (
    <div style={{background:'var(--card)',border:'1px solid var(--border)',borderRadius:16,padding:'2rem',position:'relative',overflow:'hidden'}}>
      <div style={{position:'absolute',top:0,left:0,right:0,height:2,background:'linear-gradient(90deg,var(--accent),var(--accent2),var(--accent3))'}}/>
      {status==='sent'&&<div style={{background:'rgba(0,212,255,.1)',border:'1px solid rgba(0,212,255,.3)',borderRadius:8,padding:'1rem',marginBottom:'1.2rem',color:'var(--accent)',textAlign:'center',fontWeight:600}}>✅ Message sent! I'll reply soon.</div>}
      {status==='error'&&<div style={{background:'rgba(255,45,120,.1)',border:'1px solid rgba(255,45,120,.3)',borderRadius:8,padding:'1rem',marginBottom:'1.2rem',color:'#ff2d78',textAlign:'center'}}>⚠️ Please fill all required fields.</div>}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
        <div><label style={lbl}>Name *</label><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="John Doe" style={inp}/></div>
        <div><label style={lbl}>Email *</label><input value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="john@example.com" type="email" style={inp}/></div>
      </div>
      <label style={lbl}>Subject</label>
      <input value={form.subject} onChange={e=>setForm({...form,subject:e.target.value})} placeholder="Project / Collaboration / Hello" style={inp}/>
      <label style={lbl}>Message *</label>
      <textarea value={form.message} onChange={e=>setForm({...form,message:e.target.value})} placeholder="Tell me about your project..." style={{...inp,minHeight:120,resize:'vertical',marginBottom:'1.2rem'}}/>
      <button onClick={submit} disabled={status==='loading'} style={{width:'100%',background:status==='sent'?'linear-gradient(135deg,#00c851,#007e33)':'linear-gradient(135deg,var(--accent),var(--accent2))',border:'none',borderRadius:8,padding:'.9rem',color:'#fff',fontWeight:700,fontSize:'.9rem',cursor:status==='loading'?'wait':'pointer',opacity:status==='loading'?.7:1,transition:'all .3s',letterSpacing:'.05em'}}>
        {status==='loading'?'Sending...':status==='sent'?'✅ Sent!':'Send Message ✉️'}
      </button>
    </div>
  )
}

export default function Home() {
  const [projects,setProjects]=useState<any[]>([])
  const [blogs,setBlogs]=useState<any[]>([])
  const [skills,setSkills]=useState<any[]>([])
  const [photo,setPhoto]=useState<string|null>(null)
  const [mouse,setMouse]=useState({x:0,y:0})
  const [ring,setRing]=useState({x:0,y:0})
  const ringRef=useRef({x:0,y:0}); const animRef=useRef<number>()
  const [mounted,setMounted]=useState(false)
  const [menuOpen,setMenuOpen]=useState(false)

  useEffect(()=>{setMounted(true)},[])

  useEffect(()=>{
    fetch('/api/public/projects').then(r=>r.json()).then(d=>setProjects(Array.isArray(d)?d:[])).catch(()=>setProjects([]))
    fetch('/api/public/blogs').then(r=>r.json()).then(d=>setBlogs(Array.isArray(d)?d:[])).catch(()=>setBlogs([]))
    fetch('/api/public/skills').then(r=>r.json()).then(d=>setSkills(Array.isArray(d)?d:[])).catch(()=>setSkills([]))
    // Get photo from settings
    fetch('/api/public/photo').then(r=>r.json()).then(d=>{if(d?.photo_url)setPhoto(d.photo_url)}).catch(()=>{})
  },[])

  useEffect(()=>{
    const h=(e:MouseEvent)=>setMouse({x:e.clientX,y:e.clientY})
    window.addEventListener('mousemove',h); return()=>window.removeEventListener('mousemove',h)
  },[])

  useEffect(()=>{
    function animate(){ringRef.current.x+=(mouse.x-ringRef.current.x)*.12;ringRef.current.y+=(mouse.y-ringRef.current.y)*.12;setRing({x:ringRef.current.x,y:ringRef.current.y});animRef.current=requestAnimationFrame(animate)}
    animRef.current=requestAnimationFrame(animate); return()=>cancelAnimationFrame(animRef.current!)
  },[mouse])

  const grads=['linear-gradient(135deg,#001a33,#003366)','linear-gradient(135deg,#1a0033,#330066)','linear-gradient(135deg,#330011,#660022)']
  const blogBgs=['linear-gradient(135deg,#001a2e,#00334d)','linear-gradient(135deg,#1a0028,#2e0047)','linear-gradient(135deg,#002b1a,#004d2e)']
  const displaySkills = skills.length>0 ? skills : [
    {name:'Penetration Testing',category:'Security',percentage:80},{name:'Network Security',category:'Security',percentage:75},
    {name:'OWASP / Web Security',category:'Security',percentage:78},{name:'Spring Boot / Java',category:'Backend',percentage:85},
    {name:'Angular / TypeScript',category:'Frontend',percentage:80},{name:'MySQL / JPA',category:'Database',percentage:82}
  ]

  return (
    <>
      <Tracker/>
      <style>{`
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
        @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(1.3)}}
        @keyframes glowP{from{opacity:.08}to{opacity:.2}}
        @keyframes orbF{0%,100%{transform:scale(1)translate(0,0)}50%{transform:scale(1.1)translate(20px,-20px)}}
        @keyframes scan{0%{top:-2px}100%{top:102%}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes rotate{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes gradShift{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
        .stag{font-family:var(--mono);font-size:.75rem;color:var(--accent);text-transform:uppercase;letter-spacing:.2em;display:flex;align-items:center;gap:.8rem;margin-bottom:1rem}
        .stag::before{content:'';width:30px;height:1px;background:var(--accent);display:block}
        .stitle{font-family:var(--heading);font-size:clamp(2rem,4vw,3rem);font-weight:800;letter-spacing:-.03em;line-height:1.1;margin-bottom:1rem}
        .stitle span{background:linear-gradient(135deg,var(--accent),var(--accent2));-webkit-background-clip:text;-webkit-text-fill-color:transparent}
        .ssub{color:var(--muted);font-size:1rem;line-height:1.8;max-width:550px;margin-bottom:3.5rem}
        @media(max-width:900px){
          .hgrid{grid-template-columns:1fr!important;text-align:center;padding-top:7rem!important}
          .hright{order:-1}
          .hbtns{justify-content:center!important}
          .hstats{justify-content:center!important}
          .hdesc{margin:0 auto}
          .agrid,.cgrid{grid-template-columns:1fr!important}
          .navd{display:none!important}
          .hamb{display:flex!important}
          .msec{padding:4rem 1.5rem!important}
        }
      `}</style>

      {/* PARTICLES BACKGROUND */}
      <Particles/>

      {/* CURSOR */}
      {mounted&&<>
        <div style={{position:'fixed',width:10,height:10,background:'var(--accent)',borderRadius:'50%',pointerEvents:'none',zIndex:99999,left:mouse.x-5,top:mouse.y-5,mixBlendMode:'screen'}}/>
        <div style={{position:'fixed',width:38,height:38,border:'1px solid rgba(0,212,255,.4)',borderRadius:'50%',pointerEvents:'none',zIndex:99998,left:ring.x-19,top:ring.y-19,transition:'width .2s,height .2s'}}/>
      </>}

      {/* NAV */}
      <nav style={{position:'fixed',top:0,left:0,right:0,zIndex:1000,padding:'1.1rem 4rem',display:'flex',justifyContent:'space-between',alignItems:'center',backdropFilter:'blur(20px)',background:'rgba(4,6,15,.88)',borderBottom:'1px solid var(--border)'}}>
        <div style={{fontFamily:'var(--heading)',fontSize:'1.5rem',fontWeight:800,background:'linear-gradient(135deg,var(--accent),var(--accent2))',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>AK.</div>
        <div className="navd" style={{display:'flex',gap:'2.5rem'}}>
          {['about','skills','projects','blog','contact'].map(s=>(
            <a key={s} href={`#${s}`} style={{color:'var(--muted)',fontSize:'.85rem',fontWeight:500,letterSpacing:'.08em',textTransform:'uppercase',textDecoration:'none',transition:'color .2s'}} onMouseEnter={e=>(e.currentTarget.style.color='var(--accent)')} onMouseLeave={e=>(e.currentTarget.style.color='var(--muted)')}>{s}</a>
          ))}
        </div>
        <div style={{display:'flex',gap:'1rem',alignItems:'center'}}>
          <Link href="/admin" className="navd" style={{border:'1px solid var(--accent)',color:'var(--accent)',padding:'.45rem 1.2rem',borderRadius:4,fontSize:'.78rem',fontWeight:600,letterSpacing:'.1em',textTransform:'uppercase',transition:'all .3s'}} onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background='var(--accent)';(e.currentTarget as HTMLElement).style.color='#000'}} onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background='transparent';(e.currentTarget as HTMLElement).style.color='var(--accent)'}}>Admin</Link>
          <button className="hamb" style={{display:'none',flexDirection:'column',gap:5,background:'none',border:'none',cursor:'pointer'}} onClick={()=>setMenuOpen(!menuOpen)}>
            {[0,1,2].map(i=><span key={i} style={{width:24,height:2,background:'var(--text)',borderRadius:2,display:'block'}}/>)}
          </button>
        </div>
      </nav>

      {menuOpen&&<div style={{position:'fixed',inset:0,background:'rgba(4,6,15,.98)',zIndex:999,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:'2.5rem'}}>
        {['about','skills','projects','blog','contact'].map(s=>(
          <a key={s} href={`#${s}`} onClick={()=>setMenuOpen(false)} style={{color:'var(--text)',fontSize:'1.3rem',fontWeight:600,textTransform:'uppercase',letterSpacing:'.1em',textDecoration:'none'}}>{s}</a>
        ))}
        <Link href="/admin" onClick={()=>setMenuOpen(false)} style={{color:'var(--accent)',fontSize:'1rem',border:'1px solid rgba(0,212,255,.3)',padding:'.6rem 1.5rem',borderRadius:6}}>Admin Panel</Link>
      </div>}

      {/* HERO */}
      <section id="home" style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',position:'relative',overflow:'hidden',padding:'0 4rem',zIndex:1}}>
        <div style={{position:'absolute',inset:0,backgroundImage:'linear-gradient(rgba(0,212,255,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(0,212,255,.025) 1px,transparent 1px)',backgroundSize:'50px 50px',maskImage:'radial-gradient(ellipse at center,black 0%,transparent 70%)'}}/>
        <div style={{position:'absolute',width:600,height:600,background:'radial-gradient(circle,rgba(0,212,255,.06),transparent 70%)',top:-150,right:-150,borderRadius:'50%',animation:'orbF 8s ease-in-out infinite'}}/>
        <div style={{position:'absolute',width:500,height:500,background:'radial-gradient(circle,rgba(123,47,255,.06),transparent 70%)',bottom:-100,left:-100,borderRadius:'50%',animation:'orbF 10s ease-in-out infinite reverse'}}/>

        <div className="hgrid" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'4rem',alignItems:'center',maxWidth:1200,width:'100%',paddingTop:'5rem',zIndex:2}}>
          <div style={{animation:'fadeUp .7s ease both'}}>
            <div style={{display:'inline-flex',alignItems:'center',gap:'.5rem',background:'rgba(0,212,255,.08)',border:'1px solid rgba(0,212,255,.25)',borderRadius:100,padding:'.4rem 1rem',fontSize:'.75rem',color:'var(--accent)',fontFamily:'var(--mono)',marginBottom:'1.8rem'}}>
              <span style={{width:6,height:6,background:'var(--accent)',borderRadius:'50%',animation:'pulse 1.5s infinite',display:'inline-block'}}/> Available for Opportunities
            </div>
            <h1 style={{fontFamily:'var(--heading)',fontSize:'clamp(2.8rem,6vw,5rem)',lineHeight:1.02,fontWeight:800,letterSpacing:'-.04em'}}>
              <span style={{display:'block',background:'linear-gradient(135deg,#fff 0%,var(--accent) 50%,var(--accent2) 100%)',backgroundSize:'200% 200%',animation:'gradShift 4s ease infinite',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>Amir Kazi</span>
              <span style={{display:'block',fontSize:'clamp(1.4rem,3vw,2.2rem)',background:'linear-gradient(135deg,var(--accent2),var(--accent3))',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',fontWeight:700,marginTop:'.3rem'}}>Security & Dev Expert</span>
            </h1>
            <TypingText/>
            <p className="hdesc" style={{color:'var(--muted)',lineHeight:1.8,fontSize:'1rem',maxWidth:480}}>
              Passionate about <strong style={{color:'var(--text)'}}>Cybersecurity</strong> and <strong style={{color:'var(--text)'}}>Full-Stack Development</strong>. Building secure, scalable systems at the intersection of offensive security and modern web tech.
            </p>
            <div className="hbtns" style={{display:'flex',gap:'1rem',marginTop:'2.5rem',flexWrap:'wrap'}}>
              <a href="#projects" style={{background:'linear-gradient(135deg,var(--accent),var(--accent2))',color:'#fff',padding:'.85rem 2rem',borderRadius:6,fontWeight:600,fontSize:'.9rem',textDecoration:'none',transition:'all .3s',display:'inline-block'}} onMouseEnter={e=>((e.currentTarget as HTMLElement).style.boxShadow='0 8px 30px rgba(0,212,255,.35)')} onMouseLeave={e=>((e.currentTarget as HTMLElement).style.boxShadow='none')}>View My Work →</a>
              <a href="#contact" style={{background:'transparent',color:'var(--text)',border:'1px solid rgba(255,255,255,.15)',padding:'.85rem 2rem',borderRadius:6,fontWeight:500,fontSize:'.9rem',textDecoration:'none',transition:'all .3s',display:'inline-block'}} onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.borderColor='var(--accent)';(e.currentTarget as HTMLElement).style.color='var(--accent)'}} onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor='rgba(255,255,255,.15)';(e.currentTarget as HTMLElement).style.color='var(--text)'}}>Get In Touch</a>
            </div>
            <div className="hstats" style={{display:'flex',gap:'2.5rem',marginTop:'3rem'}}>
              {[{l:'Projects',v:projects.length||3},{l:'Technologies',v:15,s:'+'},{l:'Certifications',v:3}].map(s=>(
                <div key={s.l}><CountUp to={s.v} suffix={s.s||''}/><div style={{color:'var(--muted)',fontSize:'.75rem',textTransform:'uppercase',letterSpacing:'.1em',marginTop:'.2rem'}}>{s.l}</div></div>
              ))}
            </div>
          </div>

          {/* PHOTO */}
          <div className="hright" style={{display:'flex',justifyContent:'center',animation:'fadeUp .8s .3s ease both'}}>
            <div style={{position:'relative',width:340,height:420}}>
              <div style={{position:'absolute',width:250,height:250,background:'var(--accent)',borderRadius:'50%',filter:'blur(90px)',opacity:.08,top:'50%',left:'50%',transform:'translate(-50%,-50%)',animation:'glowP 3s infinite alternate'}}/>
              <div style={{position:'absolute',width:'100%',height:'100%',borderRadius:20,background:'linear-gradient(135deg,rgba(0,212,255,.12),rgba(123,47,255,.12))',border:'1px solid rgba(0,212,255,.25)',overflow:'hidden',display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:'1rem'}}>
                <div style={{position:'absolute',width:'100%',height:2,background:'linear-gradient(90deg,transparent,var(--accent),transparent)',opacity:.5,animation:'scan 2.5s linear infinite',top:0}}/>
                {photo
                  ? <img src={photo} alt="Amir Kazi" style={{width:160,height:160,borderRadius:'50%',objectFit:'cover',border:'3px solid rgba(255,255,255,.2)',position:'relative',zIndex:2}}/>
                  : <div style={{width:150,height:150,borderRadius:'50%',background:'linear-gradient(135deg,var(--accent),var(--accent2))',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'var(--heading)',fontSize:'2.5rem',fontWeight:800,color:'#fff',border:'3px solid rgba(255,255,255,.2)',position:'relative',zIndex:2}}>AK</div>
                }
                <div style={{textAlign:'center',zIndex:2}}>
                  <h3 style={{fontFamily:'var(--heading)',fontSize:'1.2rem'}}>Amir Kazi</h3>
                  <p style={{color:'var(--muted)',fontSize:'.8rem',marginTop:'.3rem'}}>Cybersecurity · Developer</p>
                </div>
                <div style={{position:'absolute',bottom:0,left:0,right:0,height:'40%',background:'linear-gradient(0deg,rgba(4,6,15,.85),transparent)'}}/>
              </div>
              {[{t:'🔐 Pentesting',top:'8%',right:-20,c:'var(--accent)',d:0},{t:'⚡ Spring Boot',bottom:'18%',left:-20,c:'var(--accent2)',d:1},{t:'🔥 Angular',top:'48%',right:-30,c:'var(--accent3)',d:2}].map((tag:any)=>(
                <div key={tag.t} style={{position:'absolute',top:tag.top,right:tag.right,bottom:tag.bottom,left:tag.left,background:'rgba(8,13,26,.92)',border:`1px solid rgba(0,212,255,.2)`,borderRadius:8,padding:'.5rem .9rem',fontSize:'.75rem',fontFamily:'var(--mono)',color:tag.c,backdropFilter:'blur(10px)',animation:`float 3s ${tag.d}s ease-in-out infinite`,whiteSpace:'nowrap'}}>{tag.t}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="msec" style={{padding:'6rem 4rem',maxWidth:1200,margin:'0 auto',position:'relative',zIndex:1}}>
        <Reveal><div className="stag">01 — About Me</div><h2 className="stitle">Who is <span>Amir Kazi?</span></h2><p className="ssub">A passionate technologist at the crossroads of security and development.</p></Reveal>
        <Reveal delay={100}>
          <div className="agrid" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'5rem',alignItems:'center'}}>
            <div>
              {["Hey! I'm Amir Kazi, a developer and cybersecurity enthusiast from India. I love building full-stack applications and exploring security vulnerabilities — understanding how systems are broken so I can build them better.",
                "Currently part of Team Error 404, I've worked on complex projects like a Work Permit Management System with multi-level approval workflows, Spring Boot backends, and Angular frontends.",
                "My mission: write clean, secure code and never stop learning. Whether it's penetration testing, Spring Boot APIs, or deploying to the cloud — I'm here for it."
              ].map((p,i)=><p key={i} style={{color:'var(--muted)',lineHeight:1.9,marginBottom:'1.2rem',fontSize:'.95rem'}}>{p}</p>)}
              <div style={{display:'flex',flexWrap:'wrap',gap:'.6rem',marginTop:'2rem'}}>
                {['Cybersecurity','Penetration Testing','Full Stack Dev','Spring Boot','Angular','MySQL','Network Security','CTF Player'].map(c=>(
                  <span key={c} style={{background:'rgba(0,212,255,.06)',border:'1px solid rgba(0,212,255,.15)',borderRadius:4,padding:'.35rem .9rem',fontSize:'.78rem',color:'var(--accent)',fontFamily:'var(--mono)'}}>{c}</span>
                ))}
              </div>
            </div>
            <div style={{background:'var(--card)',border:'1px solid var(--border)',borderRadius:16,padding:'2rem',position:'relative',overflow:'hidden'}}>
              <div style={{position:'absolute',top:0,left:0,right:0,height:2,background:'linear-gradient(90deg,var(--accent),var(--accent2),var(--accent3))'}}/>
              <h3 style={{fontFamily:'var(--heading)',fontSize:'1.1rem',marginBottom:'1.5rem'}}>📋 Personal Info</h3>
              {[{i:'👤',l:'Full Name',v:'Amir Kazi',h:null},{i:'📍',l:'Location',v:'India',h:null},{i:'📧',l:'Email',v:'amirkazi84088@gmail.com',h:'mailto:amirkazi84088@gmail.com'},{i:'📱',l:'Phone',v:'+91 8408819938',h:'tel:+918408819938'},{i:'💼',l:'LinkedIn',v:'linkedin.com/in/amir-kazi',h:'https://www.linkedin.com/in/amir-kazi-bb320a363/'},{i:'🎯',l:'Focus',v:'Cybersecurity + Development',h:null}].map(row=>(
                <div key={row.l} style={{display:'flex',alignItems:'center',gap:'1rem',padding:'.8rem 0',borderBottom:'1px solid rgba(255,255,255,.04)'}}>
                  <div style={{width:36,height:36,background:'rgba(0,212,255,.08)',borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>{row.i}</div>
                  <div><div style={{fontSize:'.7rem',color:'var(--muted)',textTransform:'uppercase',letterSpacing:'.1em',marginBottom:'.1rem'}}>{row.l}</div>
                  {row.h?<a href={row.h} target="_blank" rel="noreferrer" style={{fontSize:'.88rem',color:'var(--accent)'}}>{row.v}</a>:<div style={{fontSize:'.88rem'}}>{row.v}</div>}</div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* SKILLS */}
      <div id="skills" style={{background:'var(--bg2)',position:'relative',zIndex:1}}>
        <div className="msec" style={{maxWidth:1200,margin:'0 auto',padding:'6rem 4rem'}}>
          <Reveal><div className="stag">02 — Skills</div><h2 className="stitle">What I <span>Know</span></h2><p className="ssub">From writing secure code to breaking it.</p></Reveal>
          <Reveal delay={100}>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))',gap:'1.5rem'}}>
              {displaySkills.map((s:any)=><SkillCard key={s.id||s.name} name={s.name} category={s.category} percentage={s.percentage}/>)}
            </div>
            <div style={{display:'flex',flexWrap:'wrap',gap:'.6rem',marginTop:'2.5rem'}}>
              {['Java','Spring Boot','Angular','TypeScript','MySQL','REST API','Git / GitHub','Linux','Kali Linux','Metasploit','Nmap','Wireshark','Burp Suite','Docker','Next.js','Postman'].map(t=>(
                <span key={t} style={{background:'var(--card)',border:'1px solid var(--border)',borderRadius:8,padding:'.5rem .9rem',fontSize:'.78rem',fontFamily:'var(--mono)',color:'var(--muted)',transition:'all .2s',cursor:'default'}} onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.borderColor='var(--accent)';(e.currentTarget as HTMLElement).style.color='var(--accent)';(e.currentTarget as HTMLElement).style.transform='translateY(-2px)'}} onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor='rgba(0,212,255,.12)';(e.currentTarget as HTMLElement).style.color='var(--muted)';(e.currentTarget as HTMLElement).style.transform=''}}>{t}</span>
              ))}
            </div>
          </Reveal>
        </div>
      </div>

      {/* PROJECTS */}
      <section id="projects" className="msec" style={{padding:'6rem 4rem',maxWidth:1200,margin:'0 auto',position:'relative',zIndex:1}}>
        <Reveal><div className="stag">03 — Projects</div><h2 className="stitle">Things I've <span>Built</span></h2><p className="ssub">A mix of security tools, full-stack apps, and experiments.</p></Reveal>
        <Reveal delay={100}>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(340px,1fr))',gap:'1.5rem'}}>
            {projects.map((p,i)=>(
              <div key={p.id} style={{background:'var(--card)',border:'1px solid var(--border)',borderRadius:16,overflow:'hidden',transition:'all .3s',cursor:'default'}} onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.transform='translateY(-6px)';(e.currentTarget as HTMLElement).style.borderColor='rgba(0,212,255,.4)';(e.currentTarget as HTMLElement).style.boxShadow='0 20px 60px rgba(0,0,0,.4)'}} onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.transform='';(e.currentTarget as HTMLElement).style.borderColor='rgba(0,212,255,.12)';(e.currentTarget as HTMLElement).style.boxShadow=''}}>
                <div style={{height:180,background:grads[i%3],display:'flex',alignItems:'center',justifyContent:'center',fontSize:'3rem',position:'relative'}}>
                  {p.emoji||'🚀'}
                  <span style={{position:'absolute',bottom:'.5rem',right:'.5rem',background:'rgba(0,0,0,.6)',border:'1px solid rgba(255,255,255,.1)',borderRadius:4,padding:'.2rem .5rem',fontSize:'.6rem',fontFamily:'var(--mono)',color:'var(--muted)'}}>AI generated</span>
                </div>
                <div style={{padding:'1.5rem'}}>
                  <div style={{display:'flex',flexWrap:'wrap',gap:'.4rem',marginBottom:'.9rem'}}>
                    {(p.tech_stack||'').split(',').filter(Boolean).map((t:string)=>(
                      <span key={t} style={{background:'rgba(0,212,255,.06)',border:'1px solid rgba(0,212,255,.12)',borderRadius:3,padding:'.2rem .6rem',fontSize:'.7rem',color:'var(--accent)',fontFamily:'var(--mono)'}}>{t.trim()}</span>
                    ))}
                  </div>
                  <h3 style={{fontFamily:'var(--heading)',fontSize:'1.1rem',fontWeight:700,marginBottom:'.6rem'}}>{p.title}</h3>
                  <p style={{color:'var(--muted)',fontSize:'.85rem',lineHeight:1.7}}>{p.description}</p>
                  <div style={{display:'flex',gap:'.8rem',marginTop:'1.2rem',paddingTop:'1.2rem',borderTop:'1px solid rgba(255,255,255,.05)'}}>
                    {p.demo_url&&p.demo_url!=='#'&&<a href={p.demo_url} target="_blank" rel="noreferrer" style={{fontSize:'.78rem',color:'var(--accent)',textDecoration:'none'}}>🔗 Live Demo</a>}
                    {p.github_url&&p.github_url!=='#'&&<a href={p.github_url} target="_blank" rel="noreferrer" style={{fontSize:'.78rem',color:'var(--muted)',textDecoration:'none'}}>📂 GitHub</a>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* BLOG */}
      <div id="blog" style={{background:'var(--bg2)',position:'relative',zIndex:1}}>
        <div className="msec" style={{maxWidth:1200,margin:'0 auto',padding:'6rem 4rem'}}>
          <Reveal><div className="stag">04 — Blog</div><h2 className="stitle">My <span>Thoughts</span></h2><p className="ssub">Security insights, dev tips, and lessons from the field.</p></Reveal>
          <Reveal delay={100}>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))',gap:'1.5rem'}}>
              {blogs.map((b,i)=>(
                <Link key={b.id} href={`/blog/${b.slug}`} style={{background:'var(--card)',border:'1px solid var(--border)',borderRadius:12,overflow:'hidden',textDecoration:'none',display:'block',transition:'all .3s'}} onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.transform='translateY(-4px)';(e.currentTarget as HTMLElement).style.borderColor='rgba(0,212,255,.35)'}} onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.transform='';(e.currentTarget as HTMLElement).style.borderColor='rgba(0,212,255,.12)'}}>
                  <div style={{height:160,background:blogBgs[i%3],display:'flex',alignItems:'center',justifyContent:'center',fontSize:'2.5rem'}}>{b.emoji||'✍️'}</div>
                  <div style={{padding:'1.3rem'}}>
                    <div style={{display:'flex',gap:'.8rem',fontSize:'.72rem',color:'var(--muted)',fontFamily:'var(--mono)',marginBottom:'.8rem'}}>
                      <span style={{color:'var(--accent)'}}>{b.category}</span><span>·</span><span>{b.read_time}</span>
                    </div>
                    <h3 style={{fontWeight:600,fontSize:'.95rem',lineHeight:1.5,marginBottom:'.5rem',color:'var(--text)'}}>{b.title}</h3>
                    <p style={{fontSize:'.82rem',color:'var(--muted)',lineHeight:1.7}}>{b.summary}</p>
                    <span style={{display:'inline-flex',alignItems:'center',gap:'.3rem',fontSize:'.78rem',color:'var(--accent)',marginTop:'1rem'}}>Read More →</span>
                  </div>
                </Link>
              ))}
            </div>
          </Reveal>
        </div>
      </div>

      {/* CONTACT */}
      <section id="contact" className="msec" style={{padding:'6rem 4rem',maxWidth:1200,margin:'0 auto',position:'relative',zIndex:1}}>
        <Reveal><div className="stag">05 — Contact</div><h2 className="stitle">Let's <span>Connect</span></h2></Reveal>
        <Reveal delay={100}>
          <div className="cgrid" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'4rem'}}>
            <div>
              <h2 style={{fontFamily:'var(--heading)',fontSize:'2rem',fontWeight:800,marginBottom:'1rem'}}>Got a project or opportunity? Let's talk.</h2>
              <p style={{color:'var(--muted)',lineHeight:1.8,marginBottom:'2rem',fontSize:'.95rem'}}>Whether it's a security audit, a dev collaboration, or just wanting to connect — I'm always open to interesting conversations.</p>
              <div style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
                {[{i:'📧',l:'Email',v:'amirkazi84088@gmail.com',h:'mailto:amirkazi84088@gmail.com'},{i:'📱',l:'Phone',v:'+91 8408819938',h:'tel:+918408819938'},{i:'💼',l:'LinkedIn',v:'linkedin.com/in/amir-kazi',h:'https://www.linkedin.com/in/amir-kazi-bb320a363/'}].map(l=>(
                  <a key={l.l} href={l.h} target="_blank" rel="noreferrer" style={{display:'flex',alignItems:'center',gap:'1rem',padding:'1rem 1.2rem',background:'var(--card)',border:'1px solid var(--border)',borderRadius:10,textDecoration:'none',transition:'all .3s'}} onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.borderColor='rgba(0,212,255,.4)';(e.currentTarget as HTMLElement).style.transform='translateX(4px)'}} onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor='rgba(0,212,255,.12)';(e.currentTarget as HTMLElement).style.transform=''}}>
                    <div style={{width:40,height:40,borderRadius:8,background:'rgba(0,212,255,.08)',display:'flex',alignItems:'center',justifyContent:'center'}}>{l.i}</div>
                    <div><p style={{fontSize:'.7rem',color:'var(--muted)',textTransform:'uppercase',letterSpacing:'.1em',marginBottom:'.2rem'}}>{l.l}</p><p style={{fontSize:'.88rem',color:'var(--text)'}}>{l.v}</p></div>
                  </a>
                ))}
              </div>
            </div>
            <ContactForm/>
          </div>
        </Reveal>
      </section>

      {/* FOOTER */}
      <footer style={{borderTop:'1px solid var(--border)',padding:'2rem 4rem',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'1rem',position:'relative',zIndex:1}}>
        <div style={{fontFamily:'var(--heading)',fontSize:'1.1rem',background:'linear-gradient(135deg,var(--accent),var(--accent2))',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',fontWeight:800}}>Amir Kazi.</div>
        <p style={{fontSize:'.78rem',color:'var(--muted)'}}>© 2026 Amir Kazi — All rights reserved.</p>
        <div style={{display:'flex',gap:'1.5rem'}}>
          {[{l:'LinkedIn',h:'https://www.linkedin.com/in/amir-kazi-bb320a363/'},{l:'Email',h:'mailto:amirkazi84088@gmail.com'},{l:'Phone',h:'tel:+918408819938'}].map(l=>(
            <a key={l.l} href={l.h} style={{fontSize:'.78rem',color:'var(--muted)',textDecoration:'none',transition:'color .2s'}} onMouseEnter={e=>(e.currentTarget.style.color='var(--accent)')} onMouseLeave={e=>(e.currentTarget.style.color='var(--muted)')}>{l.l}</a>
          ))}
        </div>
      </footer>
    </>
  )
}
