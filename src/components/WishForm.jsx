import { useEffect, useRef, useState } from 'react'

const MAX_BYTES = 8 * 1024 * 1024

const EMPTY = {
  name: '',
  email: '',
  phone: '',
  city: '',
  state: '',
  zip: '',
  wish: '',
}

function validate(v) {
  if (!v.name.trim()) return 'Add your name so we know who lit this.'
  if (!v.email.trim()) return 'Add an email so we can send the wish back to you.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim())) return 'That email looks off.'
  if (v.phone.trim() && !/^[+\d][\d\s-]{6,18}$/.test(v.phone.trim()))
    return 'Use digits, spaces or dashes for the phone number.'
  if (v.zip.trim() && !/^[A-Za-z0-9][A-Za-z0-9\s-]{2,9}$/.test(v.zip.trim()))
    return 'That zip code looks off.'
  return ''
}

export default function WishForm() {
  const [values, setValues] = useState(EMPTY)
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState('')
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    if (!file) {
      setPreview('')
      return
    }
    const url = URL.createObjectURL(file)
    setPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  const set = (key) => (e) => {
    setValues((v) => ({ ...v, [key]: e.target.value }))
    if (error) setError('')
  }

  const pick = (next) => {
    if (!next) return
    if (!next.type.startsWith('image/')) {
      setError('That file is not an image.')
      return
    }
    if (next.size > MAX_BYTES) {
      setError('Please keep the photo under 8 MB.')
      return
    }
    setError('')
    setFile(next)
  }

  const clear = () => {
    setFile(null)
    setError('')
    if (inputRef.current) inputRef.current.value = ''
  }

  const place = [values.city.trim(), values.state.trim(), values.zip.trim()]
    .filter(Boolean)
    .join(', ')

  if (sent) {
    return (
      <section className="card card--done">
        <div className="done__mark" aria-hidden="true">
          <span className="done__flame" />
        </div>
        <h2 className="done__title">Your diya is lit.</h2>
        <p className="done__body">
          {preview ? <img className="done__photo" src={preview} alt="" /> : null}
          <span>
            Thanks {values.name.trim()}
            {place ? `, from ${place}` : ''} — {values.wish.trim() || 'a quiet wish for the year'} —
            kept here for anyone who passes by tonight.
          </span>
        </p>
        <button
          type="button"
          className="link"
          onClick={() => {
            setSent(false)
            setValues(EMPTY)
            clear()
          }}
        >
          Light another
        </button>
      </section>
    )
  }

  return (
    <section className="card" aria-labelledby="wish-heading">
      <h2 className="card__title" id="wish-heading">
        Leave a wish
      </h2>
      <p className="card__sub">
        Two things are needed — your name and an email. The rest is so we know where this light came
        from.
      </p>

      <form
        className="form"
        onSubmit={(e) => {
          e.preventDefault()
          const message = validate(values)
          if (message) {
            setError(message)
            return
          }
          setSent(true)
        }}
      >
        <Field label="Name">
          <input
            className="field__input"
            type="text"
            value={values.name}
            maxLength={40}
            placeholder="Your name"
            onChange={set('name')}
          />
        </Field>

        <div className="grid grid--2">
          <Field label="Email">
            <input
              className="field__input"
              type="email"
              value={values.email}
              placeholder="you@example.com"
              onChange={set('email')}
            />
          </Field>
          <Field label="Phone" optional>
            <input
              className="field__input"
              type="tel"
              value={values.phone}
              maxLength={18}
              placeholder="+91 90000 00000"
              onChange={set('phone')}
            />
          </Field>
        </div>

        <div className="grid grid--3">
          <Field label="City" optional>
            <input
              className="field__input"
              type="text"
              value={values.city}
              maxLength={40}
              placeholder="City"
              onChange={set('city')}
            />
          </Field>
          <Field label="State" optional>
            <input
              className="field__input"
              type="text"
              value={values.state}
              maxLength={40}
              placeholder="State"
              onChange={set('state')}
            />
          </Field>
          <Field label="Zip" optional>
            <input
              className="field__input"
              type="text"
              value={values.zip}
              maxLength={10}
              placeholder="560001"
              onChange={set('zip')}
            />
          </Field>
        </div>

        <Field label="Wish" optional>
          <textarea
            className="field__input field__input--area"
            value={values.wish}
            rows={3}
            maxLength={240}
            placeholder="Health, light, and a good year ahead."
            onChange={set('wish')}
          />
        </Field>

        <div className="field">
          <span className="field__label">
            Photo<em className="field__optional">optional</em>
          </span>
          <div
            className={`drop${dragging ? ' drop--over' : ''}${file ? ' drop--filled' : ''}`}
            onDragOver={(e) => {
              e.preventDefault()
              setDragging(true)
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault()
              setDragging(false)
              pick(e.dataTransfer.files?.[0])
            }}
          >
            {file && preview ? (
              <>
                <img className="drop__thumb" src={preview} alt={file.name} />
                <div className="drop__meta">
                  <span className="drop__name">{file.name}</span>
                  <span className="drop__size">{(file.size / 1024 / 1024).toFixed(1)} MB</span>
                </div>
                <button type="button" className="link drop__remove" onClick={clear}>
                  Remove
                </button>
              </>
            ) : (
              <>
                <svg className="drop__icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M12 16V4m0 0L8 8m4-4 4 4"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
                <p className="drop__text">
                  <button
                    type="button"
                    className="link"
                    onClick={() => inputRef.current?.click()}
                  >
                    Choose a photo
                  </button>
                  <span> or drop one here</span>
                </p>
                <p className="drop__hint">JPG, PNG or HEIC — up to 8 MB</p>
              </>
            )}
            <input
              ref={inputRef}
              className="drop__input"
              type="file"
              accept="image/*"
              onChange={(e) => pick(e.target.files?.[0])}
            />
          </div>
        </div>

        {error ? (
          <p className="form__error" role="alert">
            {error}
          </p>
        ) : null}

        <button type="submit" className="submit">
          Light it
          <span className="submit__spark" aria-hidden="true" />
        </button>
      </form>
    </section>
  )
}

function Field({ label, optional, children }) {
  return (
    <label className="field">
      <span className="field__label">
        {label}
        {optional ? <em className="field__optional">optional</em> : null}
      </span>
      {children}
    </label>
  )
}
