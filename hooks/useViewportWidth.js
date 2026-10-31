import { useEffect, useState } from 'react'

export default function useViewportWidth() {
  const [width, setWidth] = useState(() =>
    typeof window === 'undefined' ? 1200 : window.innerWidth,
  )

  useEffect(() => {
    let frame
    const onResize = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => setWidth(window.innerWidth))
    }
    window.addEventListener('resize', onResize)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return width
}
