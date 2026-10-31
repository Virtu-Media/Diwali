import DiyaRow from '@/components/DiyaRow.jsx'
import Embers from '@/components/Embers.jsx'
import FireworkLoader from '@/components/FireworkLoader.jsx'
import StringLights from '@/components/StringLights.jsx'
import SvgDefs from '@/components/SvgDefs.jsx'
import WishForm from '@/components/WishForm.jsx'

export default function Home() {
  return (
    <div className="page">
      <SvgDefs />

      <div className="night" aria-hidden="true" />
      <FireworkLoader />
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
            A quiet little corner for this Deepavali. Leave a wish and a photo of your evening, and
            a diya stays burning here for someone else to find.
          </p>
        </header>

        <WishForm />

        <footer className="foot">
          <span className="foot__copy">In collaboration with</span>
          <a
            className="foot__partner"
            href="https://snowcempaints.com"
            target="_blank"
            rel="noreferrer"
          >
            <img
              className="foot__favicon"
              src="https://snowcempaints.com/favicon.ico"
              alt=""
              width="20"
              height="20"
            />
            <span>Snowcem</span>
          </a>
          <span className="foot__times" aria-hidden="true">
            ×
          </span>
          <a className="foot__partner" href="https://virtumedia.in" target="_blank" rel="noreferrer">
            <img
              className="foot__favicon"
              src="https://virtumedia.in/favicon.ico"
              alt=""
              width="20"
              height="20"
            />
            <span>VirtuMedia</span>
          </a>
        </footer>
      </main>

      <DiyaRow />
    </div>
  )
}
