import { readdir, stat } from 'fs/promises'
import path from 'path'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const INSTALLER_DIR = path.join(process.cwd(), 'public', 'installer')
const PUBLIC_DIR = path.join(process.cwd(), 'public')

export async function GET(request: Request) {
  try {
    let entries: string[] = []
    let baseDir = INSTALLER_DIR
    try {
      entries = await readdir(INSTALLER_DIR)
    } catch {
      entries = []
    }
    // fallback: si public/installer está vacío, buscar en public/ directamente (compatibilidad si pegaste en public/)
    let candidatesInInstaller = entries.filter(n => n !== '.gitkeep' && n !== 'README.md' && !n.startsWith('.'))
    if (candidatesInInstaller.length === 0) {
      try {
        const publicEntries = await readdir(PUBLIC_DIR)
        const msiInPublic = publicEntries.filter(n => n.toLowerCase().endsWith('.msi') || n.toLowerCase().endsWith('.exe'))
        if (msiInPublic.length > 0) {
          entries = msiInPublic
          baseDir = PUBLIC_DIR
        }
      } catch {}
    } else {
      entries = candidatesInInstaller
    }
    // filtrar .gitkeep, README y ocultos, quedarse solo con archivos reales
    const candidates = []
    for (const name of entries) {
      if (name === '.gitkeep' || name === 'README.md' || name.startsWith('.')) continue
      const full = path.join(baseDir, name)
      try {
        const s = await stat(full)
        if (s.isFile()) candidates.push({ name, mtime: s.mtimeMs })
      } catch {
        // ignorar
      }
    }

    if (candidates.length === 0) {
      return NextResponse.json(
        { error: 'No hay instalador disponible aún. Pega un archivo en public/installer/' },
        { status: 404 }
      )
    }

    // Si hay más de uno, tomar el más reciente (sería el único según spec)
    candidates.sort((a, b) => b.mtime - a.mtime)
    const file = candidates[0].name

    // Redirige al archivo estático → fuerza descarga con attachment
    const prefix = baseDir === PUBLIC_DIR ? '' : '/installer'
    const url = `${prefix}/${encodeURIComponent(file)}`
    const origin = new URL(request.url).origin
    return NextResponse.redirect(new URL(url, origin), 302)
  } catch (e) {
    return NextResponse.json({ error: 'No se pudo leer la carpeta del instalador', details: String(e) }, { status: 500 })
  }
}
