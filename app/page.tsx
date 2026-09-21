import { ArrowRight, Check, Circle, Code2, LockKeyhole, Monitor, ShieldCheck, Sparkles, Zap } from 'lucide-react'
import { readdir, stat } from 'fs/promises'
import path from 'path'

const GITHUB_URL = 'https://github.com/mateodevcode/rockasus-passkey'

async function getInstallerFile(): Promise<string | null> {
  try {
    const installerDir = path.join(process.cwd(), 'public', 'installer')
    const publicDir = path.join(process.cwd(), 'public')
    let files: string[] = []
    try {
      const entries = await readdir(installerDir)
      for (const name of entries) {
        if (name === '.gitkeep' || name === 'README.md' || name.startsWith('.')) continue
        try {
          const s = await stat(path.join(installerDir, name))
          if (s.isFile()) files.push(name)
        } catch {}
      }
    } catch {}
    if (files.length > 0) {
      files.sort()
      return files[0]
    }
    // fallback: busca .msi/.exe directamente en public/ (si lo pegaste ahí)
    try {
      const entries = await readdir(publicDir)
      for (const name of entries) {
        if (name.toLowerCase().endsWith('.msi') || name.toLowerCase().endsWith('.exe')) {
          try {
            const s = await stat(path.join(publicDir, name))
            if (s.isFile()) return name
          } catch {}
        }
      }
    } catch {}
    return null
  } catch {
    return null
  }
}

const features = [
  { icon: LockKeyhole, title: 'Cifrado local', text: 'Tus credenciales permanecen cifradas en tu dispositivo.' },
  { icon: ShieldCheck, title: 'Seguridad real', text: 'Argon2id, ChaCha20-Poly1305 y autenticación TOTP.' },
  { icon: Zap, title: 'Sin complicaciones', text: 'Busca, organiza y copia tus claves en segundos.' },
]

const comparison = [
  ['Tus datos', 'Localmente en tu dispositivo', 'En la nube'],
  ['Sincronización', 'Bajo tu control', 'Incluida, depende del servicio'],
  ['Código', 'Abierto y auditable', 'Código parcialmente abierto'],
  ['Experiencia', 'Directa y sin extras', 'Muchas funciones y planes'],
]

export default async function Page() {
  const installerFile = await getInstallerFile()
  // link directo al archivo estático (más fiable que redirect en local)
  let directHref: string | null = null
  if (installerFile) {
    const { existsSync } = await import('fs')
    const path2 = await import('path')
    const inInstaller = existsSync(path2.join(process.cwd(), 'public', 'installer', installerFile))
    directHref = inInstaller ? `/installer/${encodeURIComponent(installerFile)}` : `/${encodeURIComponent(installerFile)}`
  }
  const downloadHref = directHref ?? '#'
  const downloadDownload = installerFile ? installerFile : undefined
  return (
    <main className="min-h-screen overflow-hidden bg-[#f7f9f8] text-[#10211e]">
      <div className="pointer-events-none fixed inset-0 -z-0 opacity-60" aria-hidden="true">
        <div className="absolute left-[-12rem] top-[-10rem] h-[30rem] w-[30rem] rounded-full bg-[#cceee1] blur-3xl" />
        <div className="absolute right-[-10rem] top-[25rem] h-[28rem] w-[28rem] rounded-full bg-[#dce8ff] blur-3xl" />
      </div>
      <nav className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-6 lg:px-8">
        <a href="#inicio" className="flex items-center gap-2.5 font-semibold tracking-tight">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#123e35] text-[#baf4d9]"><LockKeyhole size={18} /></span>
          <span className="text-lg">rockasus</span>
        </a>
        <div className="hidden items-center gap-8 text-sm text-[#5c6d68] md:flex">
          <a href="#caracteristicas" className="transition hover:text-[#123e35]">Características</a>
          <a href="#comparativa" className="transition hover:text-[#123e35]">Comparativa</a>
          <a href={GITHUB_URL} target="_blank" rel="noreferrer" className="flex items-center gap-2 transition hover:text-[#123e35]"><Code2 size={16} /> GitHub</a>
        </div>
        <a href={downloadHref} className="rounded-full bg-[#123e35] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#1b594c]">Descargar</a>
      </nav>

      <section id="inicio" className="relative z-10 mx-auto grid max-w-6xl items-center gap-14 px-6 pb-24 pt-16 lg:grid-cols-[1.05fr_.95fr] lg:px-8 lg:pb-32 lg:pt-24">
        <div>
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#b8ded0] bg-white/70 px-3.5 py-2 text-xs font-medium text-[#286252]"><Sparkles size={14} /> Tu bóveda, en tus manos</div>
          <h1 className="max-w-2xl text-5xl font-semibold leading-[1.04] tracking-[-0.05em] text-[#10211e] sm:text-6xl lg:text-[5.1rem]">Contraseñas seguras.<br /><span className="text-[#2f806b]">Sin complicaciones.</span></h1>
          <p className="mt-7 max-w-xl text-lg leading-8 text-[#5c6d68]">Rockasus es una alternativa directa, sencilla y local a Bitwarden. Protege tus credenciales sin servidores, suscripciones ni ruido.</p>
          <div id="descargar" className="mt-9 flex flex-col gap-3 sm:flex-row">
            {installerFile ? (
              <a href={downloadHref} download={downloadDownload} className="inline-flex items-center justify-center gap-2 rounded-full bg-[#123e35] px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#123e35]/15 transition hover:-translate-y-0.5 hover:bg-[#1b594c]">Descargar Rockasus <ArrowRight size={17} /></a>
            ) : (
              <span className="inline-flex items-center justify-center gap-2 rounded-full bg-[#9bb7af] px-6 py-3.5 text-sm font-semibold text-white cursor-not-allowed" title="Pega el instalador en public/installer/">Próximamente</span>
            )}
            <a href={GITHUB_URL} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full border border-[#b8cfc7] bg-white/70 px-6 py-3.5 text-sm font-semibold text-[#123e35] transition hover:bg-white"><Code2 size={17} /> Ver en GitHub</a>
          </div>
          {installerFile && <p className="mt-3 text-xs text-[#70807b]">Archivo: {installerFile}</p>}
          <div className="mt-5 flex items-center gap-2 text-xs text-[#70807b]"><Monitor size={14} /> Aplicación de escritorio · Rust + React · Licencia MIT</div>
        </div>
        <div className="relative mx-auto w-full max-w-[29rem]">
          <div className="absolute -inset-5 rounded-[2.5rem] bg-[#bfe8d7]/40 blur-2xl" />
          <div className="relative overflow-hidden rounded-[1.6rem] border border-white/80 bg-[#173c35] p-3 shadow-2xl shadow-[#123e35]/20">
            <div className="flex items-center justify-between border-b border-white/10 px-3 pb-3 text-white/60"><div className="flex gap-1.5"><Circle size={8} fill="currentColor" /><Circle size={8} fill="currentColor" /><Circle size={8} fill="currentColor" /></div><span className="text-[10px] tracking-[.2em]">ROCKASUS</span><span className="text-xs">•••</span></div>
            <div className="grid grid-cols-[5rem_1fr] gap-4 p-4"><div className="space-y-2 text-[10px] text-white/50"><div className="rounded-lg bg-[#baf4d9] px-2 py-2 font-semibold text-[#173c35]">Todas</div><div className="px-2 py-2">Favoritos</div><div className="px-2 py-2">Colecciones</div><div className="mt-5 px-2 py-2">Ajustes</div></div><div><div className="mb-4 flex items-center justify-between rounded-lg bg-white/10 px-3 py-2 text-[10px] text-white/40">Buscar credenciales <span>⌘ K</span></div><div className="space-y-2"><div className="rounded-xl bg-white p-3"><div className="flex items-center justify-between"><div className="flex items-center gap-2"><span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#e7f7ef] text-[#2f806b]"><LockKeyhole size={13} /></span><div><p className="text-[11px] font-semibold text-[#173c35]">GitHub</p><p className="text-[9px] text-[#8a9994]">usuario@rockasus.dev</p></div></div><span className="text-[#2f806b]">★</span></div></div><div className="rounded-xl bg-white/10 p-3 text-white"><p className="text-[11px] font-semibold">Correo personal</p><p className="mt-1 text-[9px] text-white/40">••••••••••••</p></div><div className="rounded-xl bg-white/10 p-3 text-white"><p className="text-[11px] font-semibold">Servidor local</p><p className="mt-1 text-[9px] text-white/40">••••••••••••</p></div></div></div></div>
          </div>
        </div>
      </section>

      <section id="caracteristicas" className="relative z-10 border-y border-[#dce8e2] bg-white/60"><div className="mx-auto grid max-w-6xl gap-0 px-6 lg:grid-cols-3 lg:px-8">{features.map(({ icon: Icon, title, text }) => <div key={title} className="flex gap-4 border-b border-[#e4ede9] py-7 lg:border-b-0 lg:border-r lg:px-8 lg:first:pl-0 lg:last:border-0"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e6f7ef] text-[#2f806b]"><Icon size={19} /></span><div><h2 className="font-semibold">{title}</h2><p className="mt-1 text-sm leading-6 text-[#71817c]">{text}</p></div></div>)}</div></section>

      <section id="comparativa" className="relative z-10 mx-auto max-w-6xl px-6 py-24 lg:px-8 lg:py-32"><div className="mb-12 max-w-2xl"><p className="mb-3 text-sm font-semibold uppercase tracking-[.18em] text-[#2f806b]">La diferencia</p><h2 className="text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">Lo esencial, sin el exceso.</h2><p className="mt-5 text-lg leading-8 text-[#71817c]">No necesitas una plataforma compleja para mantener tus contraseñas seguras. Rockasus hace una cosa y la hace bien.</p></div><div className="overflow-hidden rounded-2xl border border-[#d9e6e0] bg-white shadow-sm"><div className="grid grid-cols-[1.1fr_1fr_1fr] border-b border-[#d9e6e0] bg-[#f4f8f6] px-5 py-4 text-xs font-semibold uppercase tracking-[.12em] text-[#71817c] sm:px-8"><span> </span><span className="text-[#2f806b]">Rockasus</span><span>Bitwarden</span></div>{comparison.map(([label, rockasus, bitwarden]) => <div key={label} className="grid grid-cols-[1.1fr_1fr_1fr] items-center border-b border-[#e7efeb] px-5 py-5 last:border-0 sm:px-8"><span className="text-sm font-medium text-[#42534e]">{label}</span><span className="flex items-center gap-2 text-sm font-medium text-[#286252]"><Check size={16} />{rockasus}</span><span className="text-sm text-[#7d8b87]">{bitwarden}</span></div>)}</div></section>

      <footer className="relative z-10 border-t border-[#dce8e2] px-6 py-8"><div className="mx-auto flex max-w-6xl flex-col justify-between gap-4 text-sm text-[#71817c] sm:flex-row sm:items-center lg:px-8"><span>© 2026 Rockasus. Hecho para mantenerte seguro.</span><a href={GITHUB_URL} target="_blank" rel="noreferrer" className="flex items-center gap-2 font-medium text-[#286252] hover:text-[#123e35]"><Code2 size={16} /> Código abierto en GitHub</a></div></footer>
    </main>
  )
}
