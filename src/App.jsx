import { useCallback, useEffect, useState } from 'react'
import StringLights from './components/StringLights.jsx'
import DiyaRow from './components/DiyaRow.jsx'
import WishForm from './components/WishForm.jsx'
import Embers from './components/Embers.jsx'
import SvgDefs from './components/SvgDefs.jsx'
import FireworkLoader from './components/FireworkLoader.jsx'
import AdminPanel from './pages/AdminPanel.jsx'

const currentPath = () => window.location.pathname.replace(/\/+$/, '').toLowerCase()

export default function App() {
  const [path, setPath] = useState(currentPath)
  const [loading, setLoading] = useState(true)
  const finishLoading = useCallback(() => setLoading(false), [])

  useEffect(() => {
    const onPop = () => setPath(currentPath())
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const isAdmin = path === '/admin'

  return (
    <div className={isAdmin ? 'page page--admin' : 'page'}>
      <SvgDefs />

      {isAdmin ? (
        <AdminPanel />
      ) : (
        <>
          <div className="night" aria-hidden="true" />
          {loading ? <FireworkLoader onDone={finishLoading} /> : null}
          <StringLights />
          <Embers />

          <main className="shell">
            <header className="hero">
              <p className="eyebrow">Festival of lights</p>
              <h1 className="title">
                Let there
                <br />
                be light.
              </h1>
              <p className="lede">
                A quiet little corner for this Deepavali. Leave a wish and a photo of your evening,
                and a diya stays burning here for someone else to find.
              </p>
            </header>

            <WishForm />

            <footer className="foot">
              <span>Shubh Deepavali</span>
              <span className="dot" aria-hidden="true" />
              <span>Made with light</span>
            </footer>
          </main>

          <DiyaRow />
        </>
      )}
    </div>
  )
}
