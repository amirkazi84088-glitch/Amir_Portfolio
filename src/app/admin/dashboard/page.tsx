'use client'
import { useEffect, useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type Tab = 'overview'|'projects'|'blogs'|'skills'|'visitors'|'messages'|'photo'

const S = {
  card: { background:'var(--card)',border:'1px solid var(--border)',borderRadius:12,padding:'1.5rem' } as React.CSSProperties,
  inp: { width:'100%',background:'rgba(255,255,255,.04)',border:'1px solid rgba(255,255,255,.1)',borderRadius:8,padding:'.75rem 1rem',color:'var(--text)',fontSize:'.88rem',outline:'none',marginBottom:'.9rem',fontFamily:'var(--font)' } as React.CSSProperties,
  lbl: { display:'block',fontSize:'.7rem',color:'var(--muted)',fontFamily:'var(--mono)',textTransform:'uppercase' as const,letterSpacing:'.1em',marginBottom:'.35rem' },
  btn: (c='var(--accent)')=>({ background:`linear-gradient(135deg,${c},var(--accent2))`,border:'none',borderRadius:6,padding:'.6rem 1.2rem',color:'#fff',fontWeight:600,fontSize:'.82rem',cursor:'pointer' }) as React.CSSProperties,
  tag: (c:string)=>({ background:`rgba(${c},.08)`,border:`1px solid rgba(${c},.2)`,borderRadius:4,padding:'.2rem .6rem',fontSize:'.7rem',fontFamily:'var(--mono)' }),
}

function Nav({tab,setTab,logout}:{tab:Tab,setTab:(t:Tab)=>void,logout:()=>void}) {
  const items:[Tab,string,string][] = [['overview','📊','Overview'],['projects','🚀','Projects'],['blogs','✍️','Blogs'],['skills','⚡','Skills'],['visitors','👁️','Visitors'],['messages','📬','Messages'],['photo','📸','My Photo']]
  return (
    <div style={{width:240,background:'var(--bg2)',borderRight:'1px solid var(--border)',padding:'2rem 1.2rem',display:'flex',flexDirection:'column',gap:'.3rem',flexShrink:0,minHeight:'100vh'}}>
      <div style={{fontFamily:'var(--heading)',fontSize:'1.3rem',fontWeight:800,background:'linear-gradient(135deg,var(--accent),var(--accent2))',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',marginBottom:'2rem',padding:'0 .5rem'}}>AK. Admin</div>
      {items.map(([key,icon,label])=>(
        <button key={key} onClick={()=>setTab(key)} style={{display:'flex',alignItems:'center',gap:'.7rem',padding:'.7rem 1rem',borderRadius:8,border:'none',background:tab===key?'rgba(0,212,255,.1)':'transparent',color:tab===key?'var(--accent)':'var(--muted)',fontSize:'.88rem',fontWeight:tab===key?600:400,cursor:'pointer',width:'100%',textAlign:'left',transition:'all .2s'}}>
          <span>{icon}</span>{label}
        </button>
      ))}
      <div style={{flex:1}}/>
      <Link href="/" style={{display:'flex',alignItems:'center',gap:'.7rem',padding:'.7rem 1rem',borderRadius:8,color:'var(--muted)',fontSize:'.85rem',textDecoration:'none',marginBottom:'.3rem'}}>🌐 View Site</Link>
      <button onClick={logout} style={{display:'flex',alignItems:'center',gap:'.7rem',padding:'.7rem 1rem',borderRadius:8,border:'none',background:'rgba(255,45,120,.08)',color:'#ff2d78',fontSize:'.85rem',cursor:'pointer',width:'100%',textAlign:'left'}}>🚪 Logout</button>
    </div>
  )
}

export default function AdminDashboard() {
  const router = useRouter()
  const [tab,setTab] = useState<Tab>('overview')
  const [admin,setAdmin] = useState<any>(null)
  const [loading,setLoading] = useState(true)

  useEffect(()=>{
    fetch('/api/auth/logout').then(r=>r.json()).then(d=>{
      if(!d.admin) router.replace('/admin/login')
      else { setAdmin(d); setLoading(false) }
    }).catch(()=>router.replace('/admin/login'))
  },[router])

  async function logout() { await fetch('/api/auth/logout',{method:'POST'}); router.replace('/admin/login') }

  if(loading) return <div style={{minHeight:'100vh',background:'var(--bg)',display:'flex',alignItems:'center',justifyContent:'center',color:'var(--accent)',fontFamily:'var(--mono)'}}>Loading...</div>

  return (
    <div style={{minHeight:'100vh',background:'var(--bg)',display:'flex'}}>
      <Nav tab={tab} setTab={setTab} logout={logout}/>
      <div style={{flex:1,padding:'2.5rem',overflowY:'auto'}}>
        <div style={{marginBottom:'2rem'}}>
          <h1 style={{fontFamily:'var(--heading)',fontSize:'1.8rem',fontWeight:800}}>
            {({overview:'📊 Dashboard',projects:'🚀 Projects',blogs:'✍️ Blogs',skills:'⚡ Skills',visitors:'👁️ Visitors',messages:'📬 Messages',photo:'📸 My Photo'} as any)[tab]}
          </h1>
          <p style={{color:'var(--muted)',fontSize:'.85rem',marginTop:'.3rem'}}>Welcome back, {admin?.email}</p>
        </div>
        {tab==='overview'&&<OverviewTab/>}
        {tab==='projects'&&<ProjectsTab/>}
        {tab==='blogs'&&<BlogsTab/>}
        {tab==='skills'&&<SkillsTab/>}
        {tab==='visitors'&&<VisitorsTab/>}
        {tab==='messages'&&<MessagesTab/>}
        {tab==='photo'&&<PhotoTab/>}
      </div>
    </div>
  )
}

function OverviewTab() {
  const [stats,setStats] = useState<any>(null)
  useEffect(()=>{
    Promise.all([
      fetch('/api/admin/projects').then(r=>r.json()),
      fetch('/api/admin/blogs').then(r=>r.json()),
      fetch('/api/admin/visitors').then(r=>r.json()),
      fetch('/api/contact').then(r=>r.json()),
    ]).then(([p,b,v,m])=>setStats({projects:Array.isArray(p)?p.length:0,blogs:Array.isArray(b)?b.length:0,visitors:v.total||0,today:v.unique_today||0,messages:Array.isArray(m)?m.filter((x:any)=>!x.is_read).length:0,topCountries:v.topCountries||[]}))
  },[])
  if(!stats) return <div style={{color:'var(--muted)',fontFamily:'var(--mono)'}}>Loading...</div>
  return (
    <div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(170px,1fr))',gap:'1rem',marginBottom:'2rem'}}>
        {[{l:'Projects',v:stats.projects,i:'🚀',c:'0,212,255'},{l:'Blogs',v:stats.blogs,i:'✍️',c:'123,47,255'},{l:'Total Visitors',v:stats.visitors,i:'👥',c:'0,212,255'},{l:'Visitors Today',v:stats.today,i:'📅',c:'255,45,120'},{l:'Unread Messages',v:stats.messages,i:'📬',c:'123,47,255'}].map(s=>(
          <div key={s.l} style={{...S.card,position:'relative',overflow:'hidden'}}>
            <div style={{position:'absolute',top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,rgb(${s.c}),var(--accent2))`}}/>
            <div style={{fontSize:'1.6rem',marginBottom:'.5rem'}}>{s.i}</div>
            <div style={{fontFamily:'var(--heading)',fontSize:'1.8rem',fontWeight:800,background:`linear-gradient(135deg,rgb(${s.c}),var(--accent2))`,WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>{s.v}</div>
            <div style={{color:'var(--muted)',fontSize:'.75rem',marginTop:'.3rem'}}>{s.l}</div>
          </div>
        ))}
      </div>
      {stats.topCountries.length>0&&(
        <div style={S.card}>
          <h3 style={{fontFamily:'var(--heading)',fontSize:'1rem',marginBottom:'1rem'}}>🌍 Top Visitor Countries</h3>
          {stats.topCountries.map((c:any)=>(
            <div key={c.country} style={{display:'flex',justifyContent:'space-between',padding:'.5rem 0',borderBottom:'1px solid rgba(255,255,255,.04)'}}>
              <span style={{fontSize:'.88rem'}}>{c.country||'Unknown'}</span>
              <span style={{fontFamily:'var(--mono)',fontSize:'.82rem',color:'var(--accent)'}}>{c.count}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function ProjectsTab() {
  const [projects,setProjects]=useState<any[]>([])
  const [form,setForm]=useState({title:'',description:'',tech_stack:'',demo_url:'',github_url:'',category:'Full Stack',emoji:'🚀',visible:1})
  const [editing,setEditing]=useState<number|null>(null)
  const [msg,setMsg]=useState('')
  const load=useCallback(()=>fetch('/api/admin/projects').then(r=>r.json()).then(d=>setProjects(Array.isArray(d)?d:[])),[])
  useEffect(()=>{load()},[load])
  async function save(){
    const method=editing?'PUT':'POST'; const body=editing?{...form,id:editing}:form
    const res=await fetch('/api/admin/projects',{method,headers:{'Content-Type':'application/json'},body:JSON.stringify(body)})
    if(res.ok){setMsg(editing?'Updated!':'Added!');setEditing(null);setForm({title:'',description:'',tech_stack:'',demo_url:'',github_url:'',category:'Full Stack',emoji:'🚀',visible:1});load()}else setMsg('Error')
    setTimeout(()=>setMsg(''),2500)
  }
  async function del(id:number){if(!confirm('Delete?'))return;await fetch('/api/admin/projects',{method:'DELETE',headers:{'Content-Type':'application/json'},body:JSON.stringify({id})});load()}
  function edit(p:any){setEditing(p.id);setForm({title:p.title,description:p.description,tech_stack:p.tech_stack||'',demo_url:p.demo_url||'',github_url:p.github_url||'',category:p.category||'Full Stack',emoji:p.emoji||'🚀',visible:p.visible})}
  return (
    <div style={{display:'grid',gridTemplateColumns:'1fr 1.4fr',gap:'1.5rem',alignItems:'start'}}>
      <div style={{...S.card,position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:0,left:0,right:0,height:2,background:'linear-gradient(90deg,var(--accent),var(--accent2))'}}/>
        <h3 style={{fontFamily:'var(--heading)',marginBottom:'1.5rem'}}>{editing?'✏️ Edit':'➕ Add'} Project</h3>
        {msg&&<div style={{background:'rgba(0,212,255,.1)',border:'1px solid rgba(0,212,255,.3)',borderRadius:6,padding:'.6rem 1rem',fontSize:'.82rem',color:'var(--accent)',marginBottom:'1rem'}}>{msg}</div>}
        <label style={S.lbl}>Title</label><input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="Project title" style={S.inp}/>
        <label style={S.lbl}>Description</label><textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="What does it do?" style={{...S.inp,minHeight:80,resize:'vertical'}}/>
        <label style={S.lbl}>Tech Stack (comma separated)</label><input value={form.tech_stack} onChange={e=>setForm({...form,tech_stack:e.target.value})} placeholder="Spring Boot, Angular, MySQL" style={S.inp}/>
        <label style={S.lbl}>Live Demo URL</label><input value={form.demo_url} onChange={e=>setForm({...form,demo_url:e.target.value})} placeholder="https://..." style={S.inp}/>
        <label style={S.lbl}>GitHub URL</label><input value={form.github_url} onChange={e=>setForm({...form,github_url:e.target.value})} placeholder="https://github.com/..." style={S.inp}/>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'.8rem'}}>
          <div><label style={S.lbl}>Category</label><select value={form.category} onChange={e=>setForm({...form,category:e.target.value})} style={{...S.inp,marginBottom:0}}>
            {['Full Stack','Security','Frontend','Backend','Other'].map(c=><option key={c}>{c}</option>)}</select></div>
          <div><label style={S.lbl}>Emoji</label><input value={form.emoji} onChange={e=>setForm({...form,emoji:e.target.value})} style={{...S.inp,marginBottom:0}}/></div>
        </div>
        <div style={{display:'flex',gap:'.8rem',marginTop:'1.2rem'}}>
          <button onClick={save} style={S.btn()}>{editing?'Update':'Add Project'}</button>
          {editing&&<button onClick={()=>{setEditing(null);setForm({title:'',description:'',tech_stack:'',demo_url:'',github_url:'',category:'Full Stack',emoji:'🚀',visible:1})}} style={{...S.btn(),'background':'rgba(255,255,255,.08)'}}>Cancel</button>}
        </div>
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
        {projects.map(p=>(
          <div key={p.id} style={{...S.card,display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:'1rem'}}>
            <div style={{flex:1}}>
              <div style={{display:'flex',alignItems:'center',gap:'.6rem',marginBottom:'.4rem',flexWrap:'wrap'}}>
                <span style={{fontSize:'1.2rem'}}>{p.emoji}</span><span style={{fontWeight:600}}>{p.title}</span>
                <span style={{...S.tag('0,212,255'),color:'var(--accent)'}}>{p.category}</span>
              </div>
              <p style={{color:'var(--muted)',fontSize:'.82rem',lineHeight:1.5}}>{p.description?.slice(0,90)}...</p>
            </div>
            <div style={{display:'flex',gap:'.5rem',flexShrink:0}}>
              <button onClick={()=>edit(p)} style={{background:'rgba(0,212,255,.1)',border:'1px solid rgba(0,212,255,.2)',borderRadius:6,padding:'.4rem .7rem',color:'var(--accent)',cursor:'pointer',fontSize:'.8rem'}}>Edit</button>
              <button onClick={()=>del(p.id)} style={{background:'rgba(255,45,120,.08)',border:'1px solid rgba(255,45,120,.2)',borderRadius:6,padding:'.4rem .7rem',color:'#ff2d78',cursor:'pointer',fontSize:'.8rem'}}>Del</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function BlogsTab() {
  const [blogs,setBlogs]=useState<any[]>([])
  const [form,setForm]=useState({title:'',summary:'',content:'',category:'Security',read_time:'5 min read',emoji:'✍️',visible:1})
  const [editing,setEditing]=useState<number|null>(null)
  const [msg,setMsg]=useState('')
  const load=useCallback(()=>fetch('/api/admin/blogs').then(r=>r.json()).then(d=>setBlogs(Array.isArray(d)?d:[])),[])
  useEffect(()=>{load()},[load])
  async function save(){
    const method=editing?'PUT':'POST'; const body=editing?{...form,id:editing}:form
    const res=await fetch('/api/admin/blogs',{method,headers:{'Content-Type':'application/json'},body:JSON.stringify(body)})
    if(res.ok){setMsg(editing?'Updated!':'Published!');setEditing(null);setForm({title:'',summary:'',content:'',category:'Security',read_time:'5 min read',emoji:'✍️',visible:1});load()}else setMsg('Error')
    setTimeout(()=>setMsg(''),2500)
  }
  async function del(id:number){if(!confirm('Delete?'))return;await fetch('/api/admin/blogs',{method:'DELETE',headers:{'Content-Type':'application/json'},body:JSON.stringify({id})});load()}
  function edit(b:any){setEditing(b.id);setForm({title:b.title,summary:b.summary||'',content:b.content,category:b.category,read_time:b.read_time,emoji:b.emoji,visible:b.visible})}
  return (
    <div style={{display:'grid',gridTemplateColumns:'1fr 1.2fr',gap:'1.5rem',alignItems:'start'}}>
      <div style={{...S.card,position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:0,left:0,right:0,height:2,background:'linear-gradient(90deg,var(--accent2),var(--accent3))'}}/>
        <h3 style={{fontFamily:'var(--heading)',marginBottom:'1.5rem'}}>{editing?'✏️ Edit':'✍️ Write'} Blog</h3>
        {msg&&<div style={{background:'rgba(0,212,255,.1)',border:'1px solid rgba(0,212,255,.3)',borderRadius:6,padding:'.6rem 1rem',fontSize:'.82rem',color:'var(--accent)',marginBottom:'1rem'}}>{msg}</div>}
        <label style={S.lbl}>Title</label><input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="Blog title" style={S.inp}/>
        <label style={S.lbl}>Summary</label><input value={form.summary} onChange={e=>setForm({...form,summary:e.target.value})} placeholder="Short preview" style={S.inp}/>
        <label style={S.lbl}>Content (HTML supported)</label>
        <textarea value={form.content} onChange={e=>setForm({...form,content:e.target.value})} placeholder="<h2>Intro</h2><p>Your content...</p>" style={{...S.inp,minHeight:180,resize:'vertical',fontFamily:'var(--mono)',fontSize:'.8rem'}}/>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'.8rem'}}>
          <div><label style={S.lbl}>Category</label><select value={form.category} onChange={e=>setForm({...form,category:e.target.value})} style={{...S.inp,marginBottom:0}}>{['Security','Development','CTF','Tutorial','Career'].map(c=><option key={c}>{c}</option>)}</select></div>
          <div><label style={S.lbl}>Read Time</label><input value={form.read_time} onChange={e=>setForm({...form,read_time:e.target.value})} style={{...S.inp,marginBottom:0}}/></div>
          <div><label style={S.lbl}>Emoji</label><input value={form.emoji} onChange={e=>setForm({...form,emoji:e.target.value})} style={{...S.inp,marginBottom:0}}/></div>
        </div>
        <div style={{display:'flex',gap:'.8rem',marginTop:'1.2rem'}}>
          <button onClick={save} style={S.btn('var(--accent2)')}>{editing?'Update':'Publish'}</button>
          {editing&&<button onClick={()=>{setEditing(null);setForm({title:'',summary:'',content:'',category:'Security',read_time:'5 min read',emoji:'✍️',visible:1})}} style={{...S.btn(),'background':'rgba(255,255,255,.08)'}}>Cancel</button>}
        </div>
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
        {blogs.map(b=>(
          <div key={b.id} style={{...S.card,display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:'1rem'}}>
            <div style={{flex:1}}>
              <div style={{display:'flex',alignItems:'center',gap:'.6rem',flexWrap:'wrap',marginBottom:'.4rem'}}>
                <span>{b.emoji}</span><span style={{fontWeight:600,fontSize:'.92rem'}}>{b.title}</span>
                <span style={{...S.tag('123,47,255'),color:'var(--accent2)'}}>{b.category}</span>
              </div>
              <p style={{color:'var(--muted)',fontSize:'.8rem'}}>{b.summary?.slice(0,80)}...</p>
              <p style={{color:'var(--muted)',fontSize:'.72rem',marginTop:'.3rem',fontFamily:'var(--mono)'}}>/blog/{b.slug}</p>
            </div>
            <div style={{display:'flex',gap:'.5rem',flexShrink:0}}>
              <button onClick={()=>edit(b)} style={{background:'rgba(123,47,255,.1)',border:'1px solid rgba(123,47,255,.2)',borderRadius:6,padding:'.4rem .7rem',color:'var(--accent2)',cursor:'pointer',fontSize:'.8rem'}}>Edit</button>
              <button onClick={()=>del(b.id)} style={{background:'rgba(255,45,120,.08)',border:'1px solid rgba(255,45,120,.2)',borderRadius:6,padding:'.4rem .7rem',color:'#ff2d78',cursor:'pointer',fontSize:'.8rem'}}>Del</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function SkillsTab() {
  const [skills,setSkills]=useState<any[]>([])
  const [form,setForm]=useState({name:'',category:'Security',percentage:80,sort_order:0})
  const [editing,setEditing]=useState<number|null>(null)
  const [msg,setMsg]=useState('')
  const load=useCallback(()=>fetch('/api/admin/skills').then(r=>r.json()).then(d=>setSkills(Array.isArray(d)?d:[])),[])
  useEffect(()=>{load()},[load])
  async function save(){
    const method=editing?'PUT':'POST'; const body=editing?{...form,id:editing}:form
    const res=await fetch('/api/admin/skills',{method,headers:{'Content-Type':'application/json'},body:JSON.stringify(body)})
    if(res.ok){setMsg(editing?'Updated!':'Added!');setEditing(null);setForm({name:'',category:'Security',percentage:80,sort_order:0});load()}else setMsg('Error')
    setTimeout(()=>setMsg(''),2500)
  }
  async function del(id:number){if(!confirm('Delete?'))return;await fetch('/api/admin/skills',{method:'DELETE',headers:{'Content-Type':'application/json'},body:JSON.stringify({id})});load()}
  function edit(s:any){setEditing(s.id);setForm({name:s.name,category:s.category,percentage:s.percentage,sort_order:s.sort_order||0})}
  return (
    <div style={{display:'grid',gridTemplateColumns:'1fr 1.4fr',gap:'1.5rem',alignItems:'start'}}>
      <div style={{...S.card,position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:0,left:0,right:0,height:2,background:'linear-gradient(90deg,var(--accent),var(--accent3))'}}/>
        <h3 style={{fontFamily:'var(--heading)',marginBottom:'1.5rem'}}>{editing?'✏️ Edit':'➕ Add'} Skill</h3>
        {msg&&<div style={{background:'rgba(0,212,255,.1)',border:'1px solid rgba(0,212,255,.3)',borderRadius:6,padding:'.6rem 1rem',fontSize:'.82rem',color:'var(--accent)',marginBottom:'1rem'}}>{msg}</div>}
        <label style={S.lbl}>Skill Name</label><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="e.g. Penetration Testing" style={S.inp}/>
        <label style={S.lbl}>Category</label>
        <select value={form.category} onChange={e=>setForm({...form,category:e.target.value})} style={S.inp}>
          {['Security','Backend','Frontend','Database','DevOps','Other'].map(c=><option key={c}>{c}</option>)}
        </select>
        <label style={S.lbl}>Percentage: {form.percentage}%</label>
        <input type="range" min={0} max={100} value={form.percentage} onChange={e=>setForm({...form,percentage:parseInt(e.target.value)})} style={{width:'100%',marginBottom:'1rem',accentColor:'var(--accent)'}}/>
        <label style={S.lbl}>Sort Order</label><input type="number" value={form.sort_order} onChange={e=>setForm({...form,sort_order:parseInt(e.target.value)||0})} style={S.inp}/>
        <div style={{display:'flex',gap:'.8rem'}}>
          <button onClick={save} style={S.btn('var(--accent3)')}>{editing?'Update':'Add Skill'}</button>
          {editing&&<button onClick={()=>{setEditing(null);setForm({name:'',category:'Security',percentage:80,sort_order:0})}} style={{...S.btn(),'background':'rgba(255,255,255,.08)'}}>Cancel</button>}
        </div>
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
        {skills.map(s=>(
          <div key={s.id} style={{...S.card,display:'flex',justifyContent:'space-between',alignItems:'center',gap:'1rem'}}>
            <div style={{flex:1}}>
              <div style={{display:'flex',alignItems:'center',gap:'.8rem',marginBottom:'.6rem'}}>
                <span style={{fontWeight:600}}>{s.name}</span>
                <span style={{...S.tag('0,212,255'),color:'var(--accent)'}}>{s.category}</span>
              </div>
              <div style={{height:4,background:'rgba(255,255,255,.06)',borderRadius:2,overflow:'hidden'}}>
                <div style={{height:'100%',width:`${s.percentage}%`,background:'linear-gradient(90deg,var(--accent),var(--accent2))',borderRadius:2}}/>
              </div>
              <div style={{fontSize:'.72rem',color:'var(--muted)',textAlign:'right',marginTop:'.3rem',fontFamily:'var(--mono)'}}>{s.percentage}%</div>
            </div>
            <div style={{display:'flex',gap:'.5rem',flexShrink:0}}>
              <button onClick={()=>edit(s)} style={{background:'rgba(0,212,255,.1)',border:'1px solid rgba(0,212,255,.2)',borderRadius:6,padding:'.4rem .7rem',color:'var(--accent)',cursor:'pointer',fontSize:'.8rem'}}>Edit</button>
              <button onClick={()=>del(s.id)} style={{background:'rgba(255,45,120,.08)',border:'1px solid rgba(255,45,120,.2)',borderRadius:6,padding:'.4rem .7rem',color:'#ff2d78',cursor:'pointer',fontSize:'.8rem'}}>Del</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function VisitorsTab() {
  const [data,setData]=useState<any>(null)
  useEffect(()=>{fetch('/api/admin/visitors').then(r=>r.json()).then(setData)},[])
  if(!data) return <div style={{color:'var(--muted)',fontFamily:'var(--mono)'}}>Loading...</div>
  return (
    <div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))',gap:'1rem',marginBottom:'2rem'}}>
        {[{l:'Total Unique',v:data.total,c:'0,212,255'},{l:'Unique Today',v:data.unique_today,c:'123,47,255'},{l:'Views Today',v:data.total_today,c:'255,45,120'}].map(s=>(
          <div key={s.l} style={{...S.card,textAlign:'center'}}>
            <div style={{fontFamily:'var(--heading)',fontSize:'2rem',fontWeight:800,background:`linear-gradient(135deg,rgb(${s.c}),var(--accent2))`,WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>{s.v||0}</div>
            <div style={{color:'var(--muted)',fontSize:'.75rem',marginTop:'.3rem'}}>{s.l}</div>
          </div>
        ))}
      </div>
      <div style={{...S.card,overflowX:'auto'}}>
        <h3 style={{fontFamily:'var(--heading)',fontSize:'1rem',marginBottom:'1.2rem'}}>Recent Visitors</h3>
        <table style={{width:'100%',borderCollapse:'collapse',fontSize:'.82rem'}}>
          <thead><tr style={{borderBottom:'1px solid rgba(255,255,255,.08)'}}>
            {['IP','Country','City','Browser','OS','Device','Page','Visits','Last Seen'].map(h=>(
              <th key={h} style={{padding:'.6rem .8rem',textAlign:'left',color:'var(--muted)',fontWeight:500,fontSize:'.7rem',textTransform:'uppercase',letterSpacing:'.08em',whiteSpace:'nowrap'}}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {data.visitors?.map((v:any)=>(
              <tr key={v.id} style={{borderBottom:'1px solid rgba(255,255,255,.04)'}}>
                <td style={{padding:'.6rem .8rem',fontFamily:'var(--mono)',color:'var(--accent)',fontSize:'.78rem'}}>{v.ip_address}</td>
                <td style={{padding:'.6rem .8rem'}}>{v.country||'—'}</td>
                <td style={{padding:'.6rem .8rem',color:'var(--muted)'}}>{v.city||'—'}</td>
                <td style={{padding:'.6rem .8rem',color:'var(--muted)'}}>{v.browser}</td>
                <td style={{padding:'.6rem .8rem',color:'var(--muted)'}}>{v.os}</td>
                <td style={{padding:'.6rem .8rem',color:'var(--muted)'}}>{v.device}</td>
                <td style={{padding:'.6rem .8rem',fontFamily:'var(--mono)',fontSize:'.75rem',color:'var(--accent2)'}}>{v.page_visited}</td>
                <td style={{padding:'.6rem .8rem',textAlign:'center'}}><span style={{background:'rgba(0,212,255,.08)',border:'1px solid rgba(0,212,255,.2)',borderRadius:4,padding:'.2rem .5rem',fontSize:'.75rem',color:'var(--accent)'}}>{v.visit_count}</span></td>
                <td style={{padding:'.6rem .8rem',color:'var(--muted)',fontSize:'.75rem',whiteSpace:'nowrap'}}>{new Date(v.last_seen).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!data.visitors||data.visitors.length===0)&&<p style={{color:'var(--muted)',textAlign:'center',padding:'2rem',fontFamily:'var(--mono)',fontSize:'.85rem'}}>No visitors yet. Share your portfolio!</p>}
      </div>
    </div>
  )
}

function MessagesTab() {
  const [msgs,setMsgs]=useState<any[]>([])
  const [selected,setSelected]=useState<any>(null)
  const load=useCallback(()=>fetch('/api/contact').then(r=>r.json()).then(d=>setMsgs(Array.isArray(d)?d:[])),[])
  useEffect(()=>{load()},[load])
  return (
    <div style={{display:'grid',gridTemplateColumns:'1fr 1.5fr',gap:'1.5rem',alignItems:'start'}}>
      <div style={{display:'flex',flexDirection:'column',gap:'.8rem'}}>
        <h3 style={{fontFamily:'var(--heading)',fontSize:'1rem',marginBottom:'.5rem'}}>📬 Inbox ({msgs.length})</h3>
        {msgs.length===0&&<div style={{...S.card,color:'var(--muted)',textAlign:'center',padding:'2rem',fontFamily:'var(--mono)',fontSize:'.85rem'}}>No messages yet</div>}
        {msgs.map(m=>(
          <div key={m.id} onClick={()=>setSelected(m)} style={{...S.card,cursor:'pointer',borderColor:selected?.id===m.id?'rgba(0,212,255,.5)':'var(--border)',transition:'all .2s'}} onMouseEnter={e=>(e.currentTarget.style.borderColor='rgba(0,212,255,.3)')} onMouseLeave={e=>(e.currentTarget.style.borderColor=selected?.id===m.id?'rgba(0,212,255,.5)':'rgba(0,212,255,.12)')}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'.4rem'}}>
              <span style={{fontWeight:600,fontSize:'.9rem'}}>{m.name}</span>
              {!m.is_read&&<span style={{width:8,height:8,background:'var(--accent)',borderRadius:'50%',display:'inline-block'}}/>}
            </div>
            <p style={{color:'var(--accent)',fontSize:'.78rem',marginBottom:'.3rem'}}>{m.subject||'No Subject'}</p>
            <p style={{color:'var(--muted)',fontSize:'.75rem'}}>{m.message?.slice(0,60)}...</p>
            <p style={{color:'var(--muted)',fontSize:'.7rem',marginTop:'.5rem',fontFamily:'var(--mono)'}}>{new Date(m.created_at).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
      {selected?(
        <div style={{...S.card,position:'relative',overflow:'hidden'}}>
          <div style={{position:'absolute',top:0,left:0,right:0,height:2,background:'linear-gradient(90deg,var(--accent),var(--accent2))'}}/>
          <h3 style={{fontFamily:'var(--heading)',fontSize:'1.1rem',marginBottom:'1.5rem'}}>{selected.subject||'No Subject'}</h3>
          <div style={{display:'flex',flexDirection:'column',gap:'.8rem',marginBottom:'1.5rem'}}>
            {[{l:'From',v:selected.name},{l:'Email',v:selected.email},{l:'Date',v:new Date(selected.created_at).toLocaleString()}].map(r=>(
              <div key={r.l} style={{display:'flex',gap:'1rem'}}>
                <span style={{color:'var(--muted)',fontSize:'.78rem',width:50,flexShrink:0,fontFamily:'var(--mono)',textTransform:'uppercase'}}>{r.l}</span>
                <span style={{fontSize:'.88rem'}}>{r.v}</span>
              </div>
            ))}
          </div>
          <div style={{background:'rgba(255,255,255,.03)',border:'1px solid rgba(255,255,255,.08)',borderRadius:8,padding:'1.2rem'}}>
            <p style={{color:'var(--muted)',lineHeight:1.8,fontSize:'.9rem'}}>{selected.message}</p>
          </div>
          <a href={`mailto:${selected.email}?subject=Re: ${selected.subject||'Your Inquiry'}`} style={{display:'inline-block',marginTop:'1.2rem',background:'linear-gradient(135deg,var(--accent),var(--accent2))',border:'none',borderRadius:6,padding:'.7rem 1.5rem',color:'#fff',fontWeight:600,fontSize:'.85rem',textDecoration:'none'}}>Reply via Email →</a>
        </div>
      ):(
        <div style={{...S.card,display:'flex',alignItems:'center',justifyContent:'center',minHeight:300,color:'var(--muted)',fontFamily:'var(--mono)',fontSize:'.85rem'}}>← Select a message to read</div>
      )}
    </div>
  )
}

function PhotoTab() {
  const [current,setCurrent]=useState<string|null>(null)
  const [msg,setMsg]=useState('')
  const [msgType,setMsgType]=useState<'ok'|'err'>('ok')
  const [uploading,setUploading]=useState(false)
  const [preview,setPreview]=useState<string|null>(null)
  const [selectedFile,setSelectedFile]=useState<File|null>(null)
  const fileRef=useRef<HTMLInputElement>(null)

  useEffect(()=>{
    fetch('/api/admin/photos').then(r=>r.json()).then(d=>{if(d.photo_url)setCurrent(d.photo_url)})
  },[])

  function onFileSelect(e:React.ChangeEvent<HTMLInputElement>){
    const file=e.target.files?.[0]; if(!file) return
    if(!['image/jpeg','image/jpg','image/png','image/webp'].includes(file.type)){
      setMsg('Only JPG, PNG, WEBP allowed!');setMsgType('err');return
    }
    if(file.size>5*1024*1024){setMsg('Max file size is 5MB!');setMsgType('err');return}
    setSelectedFile(file)
    const reader=new FileReader()
    reader.onload=e=>setPreview(e.target?.result as string)
    reader.readAsDataURL(file)
    setMsg('');
  }

  async function upload(){
    if(!selectedFile){setMsg('Please select a photo first!');setMsgType('err');return}
    setUploading(true); setMsg('')
    try {
      const fd=new FormData(); fd.append('file',selectedFile)
      const res=await fetch('/api/admin/photos',{method:'POST',body:fd})
      const data=await res.json()
      if(res.ok){setCurrent(data.photo_url);setMsg('✅ Photo uploaded successfully!');setMsgType('ok');setPreview(null);setSelectedFile(null);if(fileRef.current)fileRef.current.value=''}
      else{setMsg('❌ '+( data.error||'Upload failed'));setMsgType('err')}
    } catch {setMsg('❌ Upload failed — check Cloudinary settings');setMsgType('err')}
    setUploading(false); setTimeout(()=>setMsg(''),4000)
  }

  async function remove(){
    if(!confirm('Remove your photo? Initials will show instead.'))return
    const res=await fetch('/api/admin/photos',{method:'DELETE'})
    if(res.ok){setCurrent(null);setMsg('Photo removed');setMsgType('ok')}
    setTimeout(()=>setMsg(''),3000)
  }

  return (
    <div style={{maxWidth:600}}>
      {/* Current Photo */}
      <div style={{...S.card,marginBottom:'1.5rem',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:0,left:0,right:0,height:2,background:'linear-gradient(90deg,var(--accent),var(--accent2))'}}/>
        <h3 style={{fontFamily:'var(--heading)',fontSize:'1.1rem',marginBottom:'1.5rem'}}>📸 Current Photo</h3>
        {current?(
          <div style={{display:'flex',alignItems:'center',gap:'1.5rem',flexWrap:'wrap'}}>
            <img src={current} alt="Profile" style={{width:120,height:120,borderRadius:'50%',objectFit:'cover',border:'3px solid rgba(0,212,255,.4)',boxShadow:'0 0 30px rgba(0,212,255,.2)'}}/>
            <div>
              <p style={{color:'var(--muted)',fontSize:'.82rem',marginBottom:'.5rem'}}>✅ Photo is live on your portfolio</p>
              <p style={{color:'var(--muted)',fontSize:'.72rem',marginBottom:'1rem',wordBreak:'break-all',fontFamily:'var(--mono)',maxWidth:300}}>{current.slice(0,50)}...</p>
              <button onClick={remove} style={{background:'rgba(255,45,120,.1)',border:'1px solid rgba(255,45,120,.3)',borderRadius:6,padding:'.5rem 1.2rem',color:'#ff2d78',cursor:'pointer',fontSize:'.82rem',fontWeight:600}}>🗑️ Delete Photo</button>
            </div>
          </div>
        ):(
          <div style={{display:'flex',alignItems:'center',gap:'1.2rem',padding:'1.5rem',background:'rgba(255,255,255,.03)',borderRadius:8,border:'1px dashed rgba(255,255,255,.1)'}}>
            <div style={{width:80,height:80,borderRadius:'50%',background:'linear-gradient(135deg,var(--accent),var(--accent2))',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'var(--heading)',fontSize:'1.8rem',fontWeight:800,color:'#fff',flexShrink:0}}>AK</div>
            <div><p style={{fontWeight:600,marginBottom:'.3rem'}}>No photo uploaded yet</p><p style={{color:'var(--muted)',fontSize:'.82rem'}}>Upload your photo below — it will appear on your portfolio homepage.</p></div>
          </div>
        )}
      </div>

      {/* Upload New Photo */}
      <div style={{...S.card,position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:0,left:0,right:0,height:2,background:'linear-gradient(90deg,var(--accent2),var(--accent3))'}}/>
        <h3 style={{fontFamily:'var(--heading)',fontSize:'1.1rem',marginBottom:'1.5rem'}}>{current?'🔄 Change Photo':'📤 Upload Photo'}</h3>

        {msg&&<div style={{background:msgType==='ok'?'rgba(0,212,255,.1)':'rgba(255,45,120,.1)',border:`1px solid ${msgType==='ok'?'rgba(0,212,255,.3)':'rgba(255,45,120,.3)'}`,borderRadius:6,padding:'.7rem 1rem',fontSize:'.85rem',color:msgType==='ok'?'var(--accent)':'#ff2d78',marginBottom:'1.2rem'}}>{msg}</div>}

        {/* Drop Zone */}
        <div onClick={()=>fileRef.current?.click()} style={{border:'2px dashed rgba(0,212,255,.25)',borderRadius:12,padding:'2.5rem',textAlign:'center',cursor:'pointer',transition:'all .3s',marginBottom:'1.2rem',background:'rgba(0,212,255,.03)'}} onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.borderColor='rgba(0,212,255,.5)';(e.currentTarget as HTMLElement).style.background='rgba(0,212,255,.06)'}} onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor='rgba(0,212,255,.25)';(e.currentTarget as HTMLElement).style.background='rgba(0,212,255,.03)'}}>
          {preview?(
            <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'1rem'}}>
              <img src={preview} alt="Preview" style={{width:120,height:120,borderRadius:'50%',objectFit:'cover',border:'3px solid rgba(0,212,255,.4)',boxShadow:'0 0 20px rgba(0,212,255,.2)'}}/>
              <p style={{color:'var(--accent)',fontSize:'.85rem',fontWeight:600}}>✅ {selectedFile?.name}</p>
              <p style={{color:'var(--muted)',fontSize:'.75rem'}}>Click to change selection</p>
            </div>
          ):(
            <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'.8rem'}}>
              <div style={{fontSize:'3rem'}}>📸</div>
              <p style={{fontWeight:600,fontSize:'1rem'}}>Click to select your photo</p>
              <p style={{color:'var(--muted)',fontSize:'.82rem'}}>JPG, PNG, WEBP — Max 5MB</p>
            </div>
          )}
        </div>

        <input ref={fileRef} type="file" accept="image/jpeg,image/jpg,image/png,image/webp" onChange={onFileSelect} style={{display:'none'}}/>

        <button onClick={upload} disabled={!selectedFile||uploading} style={{...S.btn(),width:'100%',padding:'.9rem',fontSize:'.92rem',opacity:(!selectedFile||uploading)?.5:1,cursor:(!selectedFile||uploading)?'not-allowed':'pointer'}}>
          {uploading?'⏳ Uploading...':`📤 Upload ${selectedFile?selectedFile.name.slice(0,20)+'...':'Photo'}`}
        </button>

        {/* Cloudinary Setup Info */}
        <div style={{background:'rgba(123,47,255,.05)',border:'1px solid rgba(123,47,255,.15)',borderRadius:8,padding:'1rem',marginTop:'1.2rem',fontSize:'.8rem',color:'var(--muted)',lineHeight:1.8}}>
          <strong style={{color:'var(--accent2)'}}>⚙️ One-time Setup Required:</strong><br/>
          1. Go to <a href="https://cloudinary.com" target="_blank" style={{color:'var(--accent2)'}}>cloudinary.com</a> → Free account banao<br/>
          2. Dashboard pe <strong style={{color:'var(--text)'}}>Cloud Name, API Key, API Secret</strong> milega<br/>
          3. Vercel/Railway Variables mein add karo:<br/>
          <code style={{background:'rgba(255,255,255,.05)',padding:'.2rem .5rem',borderRadius:4,display:'inline-block',marginTop:'.3rem',fontFamily:'var(--mono)',color:'var(--accent)'}}>CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET</code>
        </div>
      </div>
    </div>
  )
}
