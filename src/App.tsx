import { FormEvent, useEffect, useRef, useState } from 'react'
import { supabase, isSupabaseConfigured } from './lib/supabase'
import { Globe2, MessageCircle, Moon, Sun, Users, Heart, LogOut, Send, Languages, ShieldCheck, Radio } from 'lucide-react'

type Message = { id: string; user_id: string; username: string; content: string; created_at: string }
type Profile = { id: string; username: string | null; display_name: string | null; avatar_url: string | null }

const words = {
  en: { tagline: 'One world. Everyone connected.', home: 'Community', chat: 'Global chat', people: 'People', donate: 'Donations', login: 'Sign in / Create account', email: 'Email', password: 'Password', username: 'Username', signIn: 'Sign in', signUp: 'Create account', google: 'Continue with Google', signOut: 'Sign out', send: 'Send', message: 'Write a message to everyone…', welcome: 'Welcome to SuperBase', setup: 'Connect your database to bring SuperBase online.', setupHelp: 'Add your Supabase project URL and publishable/anon key in the .env file, then run the SQL setup script.', onlineChat: 'Real-time community chat', chatHelp: 'Messages are stored in the shared database and update live for connected users.', noMessages: 'No messages yet. Say hello!', profile: 'Your profile', donateHelp: 'Donations and money transfers require a verified payment provider and server-side integration. No money is moved by this demo.', language: 'Language', theme: 'Theme', dark: 'Dark mode', light: 'Light mode', secured: 'Protected by database access policies', config: 'Database not configured', connecting: 'Connected app preview', usernameHelp: 'Choose a username after signing in.', loginFirst: 'Sign in to send messages.', empty: 'Please enter your message.', error: 'Something went wrong: ', sent: 'Message sent', googleNote: 'Google login must be enabled in Supabase Auth settings.', feed: 'Social feed', coming: 'Coming in the next build', call: 'Voice & video calls', callHelp: 'Calling needs a signaling service and WebRTC setup; it is not enabled in this starter.', money: 'Real money', demo: 'Not activated', feedHelp: 'Posts, likes, follows and comments will be added after accounts and chat are verified.' },
  zh: { tagline: '连接世界，人人相连。', home: '社区', chat: '全球聊天', people: '用户', donate: '捐款', login: '登录 / 创建账号', email: '电子邮件', password: '密码', username: '用户名', signIn: '登录', signUp: '创建账号', google: '使用 Google 继续', signOut: '退出登录', send: '发送', message: '给大家写一条消息…', welcome: '欢迎来到 SuperBase', setup: '连接数据库，让 SuperBase 上线。', setupHelp: '在 .env 文件中填写 Supabase 项目网址和公开密钥，然后运行 SQL 设置脚本。', onlineChat: '实时社区聊天', chatHelp: '消息会保存在共享数据库中，并实时更新。', noMessages: '还没有消息，打个招呼吧！', profile: '你的个人资料', donateHelp: '捐款和转账需要经过验证的支付服务商及服务器端集成。本演示不会转移资金。', language: '语言', theme: '主题', dark: '深色模式', light: '浅色模式', secured: '数据库访问策略保护', config: '尚未配置数据库', connecting: '应用预览', usernameHelp: '登录后可以选择用户名。', loginFirst: '请先登录再发送消息。', empty: '请输入消息。', error: '发生错误：', sent: '消息已发送', googleNote: '需要在 Supabase Auth 设置中启用 Google 登录。', feed: '社交动态', coming: '将在后续版本中加入', call: '语音和视频通话', callHelp: '通话需要信令服务和 WebRTC 设置；此初始版本尚未启用。', money: '真实资金', demo: '尚未启用', feedHelp: '完成账号和聊天验证后，将继续加入帖子、点赞、关注和评论。' },
  ms: { tagline: 'Satu dunia. Semua berhubung.', home: 'Komuniti', chat: 'Sembang global', people: 'Pengguna', donate: 'Derma', login: 'Log masuk / Cipta akaun', email: 'E-mel', password: 'Kata laluan', username: 'Nama pengguna', signIn: 'Log masuk', signUp: 'Cipta akaun', google: 'Teruskan dengan Google', signOut: 'Log keluar', send: 'Hantar', message: 'Tulis mesej untuk semua…', welcome: 'Selamat datang ke SuperBase', setup: 'Sambungkan pangkalan data untuk mengaktifkan SuperBase.', setupHelp: 'Masukkan URL projek Supabase dan kunci awam/anon dalam fail .env, kemudian jalankan skrip SQL.', onlineChat: 'Sembang komuniti masa nyata', chatHelp: 'Mesej disimpan dalam pangkalan data bersama dan dikemas kini secara langsung.', noMessages: 'Belum ada mesej. Sapa semua!', profile: 'Profil anda', donateHelp: 'Derma dan pemindahan wang memerlukan penyedia pembayaran yang disahkan serta integrasi bahagian pelayan. Demo ini tidak memindahkan wang.', language: 'Bahasa', theme: 'Tema', dark: 'Mod gelap', light: 'Mod cerah', secured: 'Dilindungi oleh polisi akses pangkalan data', config: 'Pangkalan data belum dikonfigurasi', connecting: 'Pratonton aplikasi', usernameHelp: 'Pilih nama pengguna selepas log masuk.', loginFirst: 'Log masuk untuk menghantar mesej.', empty: 'Sila masukkan mesej.', error: 'Ralat: ', sent: 'Mesej dihantar', googleNote: 'Log masuk Google perlu diaktifkan dalam tetapan Supabase Auth.', feed: 'Suapan sosial', coming: 'Akan ditambah dalam binaan seterusnya', call: 'Panggilan suara & video', callHelp: 'Panggilan memerlukan servis isyarat dan konfigurasi WebRTC; ia belum diaktifkan dalam versi permulaan ini.', money: 'Wang sebenar', demo: 'Belum diaktifkan', feedHelp: 'Catatan, suka, ikuti dan komen akan ditambah selepas akaun dan sembang disahkan.' }
}
type Lang = keyof typeof words

export default function App() {
  const [lang, setLang] = useState<Lang>('en')
  const [dark, setDark] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [draft, setDraft] = useState('')
  const [notice, setNotice] = useState('')
  const [busy, setBusy] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const t = words[lang]

  useEffect(() => {
    if (!supabase) return
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null))
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user ?? null))
    return () => listener.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!supabase || !user) { setProfile(null); return }
    let active = true
    supabase.from('profiles').select('*').eq('id', user.id).maybeSingle().then(async ({ data }) => {
      if (!active) return
      if (data?.username) setProfile(data)
      else {
        const proposed = (user.email?.split('@')[0] || 'member').replace(/[^a-zA-Z0-9_]/g, '').slice(0, 20) || 'member'
        setUsername(proposed)
      }
    })
    return () => { active = false }
  }, [user])

  useEffect(() => {
    if (!supabase) return
    let active = true
    const load = async () => {
      const { data, error } = await supabase!.from('messages').select('*').order('created_at', { ascending: true }).limit(100)
      if (active && !error && data) setMessages(data as Message[])
    }
    load()
    const channel = supabase.channel('public-chat')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, payload => {
        const m = payload.new as Message
        setMessages(old => old.some(x => x.id === m.id) ? old : [...old, m].slice(-100))
      }).subscribe()
    return () => { active = false; supabase!.removeChannel(channel) }
  }, [])

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  async function auth(mode: 'in' | 'up', e: FormEvent) {
    e.preventDefault()
    if (!supabase) return
    setBusy(true); setNotice('')
    const result = mode === 'in'
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password })
    setBusy(false)
    if (result.error) setNotice(result.error.message)
    else setNotice(mode === 'up' ? 'Account request sent. Check your email if confirmation is enabled.' : 'Signed in.')
  }
  async function googleLogin() {
    if (!supabase) return
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } })
    if (error) setNotice(error.message)
  }
  async function saveProfile(e: FormEvent) {
    e.preventDefault()
    if (!supabase || !user) return
    const clean = username.trim().toLowerCase().replace(/[^a-z0-9_]/g, '').slice(0, 24)
    if (clean.length < 3) { setNotice('Username must have at least 3 letters or numbers.'); return }
    const { data, error } = await supabase.from('profiles').upsert({ id: user.id, username: clean, display_name: clean }, { onConflict: 'id' }).select().single()
    if (error) setNotice(error.message)
    else { setProfile(data); setNotice('Profile saved.') }
  }
  async function sendMessage(e: FormEvent) {
    e.preventDefault()
    if (!supabase || !user) { setNotice(t.loginFirst); return }
    const content = draft.trim()
    if (!content) { setNotice(t.empty); return }
    if (content.length > 2000) { setNotice('Messages must be 2,000 characters or fewer.'); return }
    const name = profile?.username || user.email?.split('@')[0] || 'member'
    const { error } = await supabase.from('messages').insert({ user_id: user.id, username: name, content })
    if (error) setNotice(t.error + error.message)
    else { setDraft(''); setNotice('') }
  }
  async function signOut() { if (supabase) await supabase.auth.signOut() }

  return <div className={dark ? 'app dark' : 'app light'}>
    <header className="topbar">
      <a className="brand" href="#"><span className="brand-mark"><MessageCircle size={23}/><span className="spark">✦</span></span><span>Super<span className="gradient">Base</span><small>{t.tagline}</small></span></a>
      <div className="top-actions">
        <label className="select-wrap"><Languages size={16}/><select value={lang} onChange={e => setLang(e.target.value as Lang)} aria-label={t.language}><option value="en">English</option><option value="zh">简体中文</option><option value="ms">Bahasa Melayu</option></select></label>
        <button className="icon-btn" onClick={() => setDark(!dark)} title={t.theme}>{dark ? <Sun size={18}/> : <Moon size={18}/>}</button>
        {user && <button className="ghost-btn" onClick={signOut}><LogOut size={16}/><span>{t.signOut}</span></button>}
      </div>
    </header>

    {!isSupabaseConfigured && <div className="setup-banner"><ShieldCheck size={19}/><div><b>{t.config}</b><p>{t.setupHelp}</p></div></div>}
    <main className="layout">
      <aside className="sidebar panel">
        <div className="eyebrow">SUPERBASE NETWORK</div>
        <a className="nav-item active"><Globe2 size={18}/>{t.home}<span className="nav-dot"/></a>
        <a className="nav-item" href="#chat"><MessageCircle size={18}/>{t.chat}<span className="mini-pill">LIVE</span></a>
        <a className="nav-item" href="#people"><Users size={18}/>{t.people}</a>
        <a className="nav-item" href="#donations"><Heart size={18}/>{t.donate}</a>
        <div className="side-bottom"><span className="status-dot"/><span>{isSupabaseConfigured ? 'Database configured' : 'Preview mode'}</span></div>
      </aside>

      <section className="main-column">
        <div className="hero panel">
          <div className="hero-orb orb-one"/><div className="hero-orb orb-two"/>
          <div className="hero-content"><div className="eyebrow">YOUR WORLD, CONNECTED</div><h1>{t.welcome}</h1><p>{t.tagline} Meet people, share ideas and talk in one place.</p><div className="hero-tags"><span><span className="status-dot"/> Live community</span><span><ShieldCheck size={14}/> Secure sign-in</span></div></div>
          <div className="hero-symbol"><MessageCircle size={62}/><span>✦</span></div>
        </div>

        {!user ? <section className="panel auth-panel" id="people">
          <div className="section-head"><div><div className="eyebrow">JOIN THE NETWORK</div><h2>{t.login}</h2></div><span className="secure-tag"><ShieldCheck size={14}/> Secure auth</span></div>
          <form onSubmit={e => auth('in', e)} className="auth-form">
            <label>{t.email}<input type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com"/></label>
            <label>{t.password}<input type="password" autoComplete="current-password" minLength={8} required value={password} onChange={e => setPassword(e.target.value)} placeholder="At least 8 characters"/></label>
            <button className="primary-btn" disabled={!isSupabaseConfigured || busy}>{busy ? 'Please wait…' : t.signIn}</button>
            <button type="button" className="secondary-btn" disabled={!isSupabaseConfigured} onClick={e => { const form = (e.currentTarget as HTMLButtonElement).form; if (form) auth('up', { preventDefault: () => {}, currentTarget: form } as any) }}>{t.signUp}</button>
          </form>
          <div className="or-line"><span>OR</span></div>
          <button className="google-btn" disabled={!isSupabaseConfigured} onClick={googleLogin}><span className="google-g">G</span>{t.google}</button>
          <p className="muted small">{t.googleNote}</p>
          {notice && <p className="notice">{notice}</p>}
        </section> : <section className="panel profile-panel" id="people">
          <div className="section-head"><div><div className="eyebrow">YOUR ACCOUNT</div><h2>{t.profile}</h2></div><span className="secure-tag"><span className="status-dot"/> Signed in</span></div>
          {profile ? <div className="profile-chip"><div className="avatar">{(profile.username || 'S')[0].toUpperCase()}</div><div><b>@{profile.username}</b><p className="muted">{user.email}</p></div></div> :
            <form onSubmit={saveProfile} className="profile-form"><p>{t.usernameHelp}</p><label>{t.username}<input required minLength={3} maxLength={24} value={username} onChange={e => setUsername(e.target.value)} placeholder="your_username"/></label><button className="primary-btn">Save username</button></form>}
          {notice && <p className="notice">{notice}</p>}
        </section>}

        <section className="panel chat-panel" id="chat">
          <div className="section-head"><div><div className="eyebrow">COMMUNITY SPACE</div><h2><span className="live-dot"/> {t.onlineChat}</h2><p className="muted">{t.chatHelp}</p></div><span className="mini-pill">REALTIME</span></div>
          <div className="messages">
            {messages.length === 0 ? <div className="empty-state"><div className="empty-icon"><MessageCircle size={28}/></div><b>{t.noMessages}</b><p>Be the first to start the conversation.</p></div> : messages.map(m => <article className={`message ${user?.id === m.user_id ? 'mine' : ''}`} key={m.id}><div className="avatar">{(m.username || 'U')[0].toUpperCase()}</div><div className="message-body"><div className="message-meta"><b>{m.username}</b><time>{new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</time></div><p>{m.content}</p></div></article>)}
            <div ref={bottomRef}/>
          </div>
          <form className="composer" onSubmit={sendMessage}><input value={draft} onChange={e => setDraft(e.target.value)} maxLength={2000} placeholder={t.message} disabled={!user}/><button className="send-btn" disabled={!user || !draft.trim()} aria-label={t.send}><Send size={18}/></button></form>
          {!user && <p className="muted small login-hint">{t.loginFirst}</p>}
          {notice && user && <p className="notice">{notice}</p>}
        </section>

        <div className="feature-grid">
          <section className="panel feature-card"><div className="feature-icon purple"><Radio size={21}/></div><h3>{t.call}</h3><p>{t.callHelp}</p><span className="coming-pill">{t.coming}</span></section>
          <section className="panel feature-card" id="donations"><div className="feature-icon pink"><Heart size={21}/></div><h3>{t.donate} · {t.money}</h3><p>{t.donateHelp}</p><span className="coming-pill">{t.demo}</span></section>
        </div>
        <section className="panel feed-placeholder"><div className="feature-icon blue"><Users size={21}/></div><div><h3>{t.feed}</h3><p>{t.feedHelp}</p><span className="coming-pill">{t.coming}</span></div></section>
      </section>
      <aside className="right-column">
        <section className="panel mini-card"><div className="eyebrow">SUPERBASE STATUS</div><div className="status-row"><span className={isSupabaseConfigured ? 'status-dot' : 'status-dot offline'}/><b>{isSupabaseConfigured ? 'Database configured' : t.connecting}</b></div><p className="muted small">{isSupabaseConfigured ? 'Check auth and SQL policies in your Supabase dashboard.' : t.setup}</p></section>
        <section className="panel mini-card"><div className="eyebrow">{t.theme.toUpperCase()}</div><div className="theme-switch"><button className={dark ? 'chosen' : ''} onClick={() => setDark(true)}><Moon size={15}/>{t.dark}</button><button className={!dark ? 'chosen' : ''} onClick={() => setDark(false)}><Sun size={15}/>{t.light}</button></div></section>
        <section className="panel mini-card"><div className="eyebrow">NEXT FEATURES</div><div className="todo"><span>01</span><div><b>Social feed</b><p>Posts, likes and comments</p></div></div><div className="todo"><span>02</span><div><b>Voice & video</b><p>WebRTC calling</p></div></div><div className="todo"><span>03</span><div><b>Payments</b><p>Approved provider integration</p></div></div></section>
        <div className="footer-note">© 2026 SuperBase · Built for everyone<br/><span>Be kind. Keep your account safe.</span></div>
      </aside>
    </main>
  </div>
}