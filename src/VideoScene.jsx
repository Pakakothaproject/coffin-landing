import { useEffect, useRef } from 'react'

/**
 * The engraving. One mp4, the same file everywhere it appears.
 *
 * Three things about it are deliberate and cost us an afternoon to find:
 *
 *  1. The original was HEVC Main 10. Chrome on Windows refused it — error 4,
 *     "no supported source" — while Chrome for Testing played it, so every
 *     automated check passed and the browser a person uses did not. It is H.264
 *     8-bit now. Do not put a 10-bit file back in here.
 *  2. It is fetched as a whole file and played from a blob, because the
 *     streaming path stalled after `loadedmetadata` in a real browser. No range
 *     requests, no half-loaded video element.
 *  3. The frame is pure white and the page is sage, so the only thing that makes
 *     the drawing sit *on* the paper instead of on top of it is
 *     mix-blend-mode: multiply. That is a layout decision, so it stays in the
 *     caller's class, not here.
 */
const SRC = '/viaduct.mp4'

export default function VideoScene({ className, position = '50% 50%' }) {
  const ref = useRef(null)

  useEffect(() => {
    const video = ref.current
    if (!video) return

    const log = (...args) => console.info('[video]', ...args)
    let dead = false
    let objectUrl = null
    let watchdog = null

    const events = ['loadstart', 'loadedmetadata', 'loadeddata', 'canplay', 'playing', 'waiting', 'error']
    const onEvent = (e) =>
      log(e.type, { readyState: video.readyState, networkState: video.networkState, error: video.error?.code ?? null })
    events.forEach((t) => video.addEventListener(t, onEvent))

    const tryPlay = (why) => {
      if (!video.currentSrc && !video.src) return
      video.muted = true
      video.defaultMuted = true
      const p = video.play()
      if (p && typeof p.catch === 'function') {
        p.then(() => log('playing (' + why + ')')).catch((err) => log('play() rejected:', err.name, err.message))
      }
    }

    video.addEventListener('loadeddata', () => tryPlay('loadeddata'), { once: true })

    const start = async () => {
      try {
        const res = await fetch(SRC)
        if (!res.ok) throw new Error('HTTP ' + res.status)
        const blob = await res.blob()
        if (dead) return
        objectUrl = URL.createObjectURL(blob)
        video.src = objectUrl
        log('blob ready', (blob.size / 1048576).toFixed(1) + ' MB')
      } catch (err) {
        if (dead) return
        log('blob path failed, using direct src:', err.message)
        video.src = SRC
      }
      video.load()
      tryPlay('src-set')
      clearTimeout(watchdog)
      watchdog = setTimeout(() => {
        if (!dead && video.readyState < 2) log('STALLED at readyState', video.readyState)
      }, 8000)
    }
    start()

    return () => {
      dead = true
      clearTimeout(watchdog)
      video.pause()
      events.forEach((t) => video.removeEventListener(t, onEvent))
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [])

  return (
    <video
      ref={ref}
      className={className}
      style={{ objectPosition: position }}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      aria-hidden="true"
      tabIndex={-1}
      disablePictureInPicture
    />
  )
}