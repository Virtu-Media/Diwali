import { useEffect, useState } from 'react'

export default function useViewportWidth() {
  const [width, setWidth] = useState(1200)

  useEffect(() => {
    let frame
    setWidth(window.innerWidth)
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
