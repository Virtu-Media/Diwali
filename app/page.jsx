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
          <img
            className="contest-logo"
            src="/image.png"
            alt="The Dream Wish Contest by Snowcem Paints"
            width="720"
            height="477"
          />
          <p className="eyebrow">A special Diwali contest</p>
          <h1 className="title">Share your dream wish.</h1>
          <p className="lede">
            This Diwali, tell us the wish you dream about and share a photo of your celebration.
            Enter your dream wish below.
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
              src="https://www.google.com/s2/favicons?domain=snowcempaints.com&sz=64"
              alt=""
              width="20"
              height="20"
            />
            <span>Snowcem</span>
          </a>
          <span className="foot__and" aria-hidden="true">
            &
          </span>
          <a className="foot__partner" href="https://virtumedia.in" target="_blank" rel="noreferrer">
            <img
              className="foot__favicon"
              src="https://www.google.com/s2/favicons?domain=virtumedia.in&sz=64"
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
