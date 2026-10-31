import { useEffect, useRef, useState } from 'react'
import { FIELDS } from './fields.js'

const MAX_BYTES = 8 * 1024 * 1024

const EMPTY = { name: '', email: '', phone: '', city: '', state: '', zip: '', wish: '' }

const byKey = Object.fromEntries(FIELDS.map((f) => [f.key, f]))

function toDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(new Error('read-failed'))
    reader.readAsDataURL(file)
  })
}

function failureFor(status, body) {
  if (body?.error === 'not-configured') {
    return `Storage is not set up on the server yet — missing ${(body.missing || []).join(', ')}.`
  }
  if (body?.error === 'too-many') {
    return body.message || 'Too many wishes from here. Try again in a few minutes.'
  }
  if (status === 500) return 'The server could not save this. Please try again.'
  return body?.message || 'Something went wrong. Please try again.'
}

export default function WishForm() {
  const [values, setValues] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [failure, setFailure] = useState('')
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [sent, setSent] = useState(null)
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
    setErrors((prev) => (prev[key] || failure ? { ...prev, [key]: undefined } : prev))
    if (failure) setFailure('')
  }

  const pick = (next) => {
    if (!next) return
    if (!next.type.startsWith('image/')) {
      setErrors({ photo: 'That file is not an image.' })
      return
    }
    if (next.size > MAX_BYTES) {
      setErrors({ photo: 'Please keep the photo under 8 MB.' })
      return
    }
    setErrors((prev) => ({ ...prev, photo: undefined }))
    setFile(next)
  }

  const clear = () => {
    setFile(null)
    setErrors((prev) => ({ ...prev, photo: undefined }))
    if (inputRef.current) inputRef.current.value = ''
  }

  const submit = async (e) => {
    e.preventDefault()
    if (submitting) return

    const missing = {}
    for (const f of FIELDS) if (!values[f.key].trim()) missing[f.key] = `${f.label} is required.`
    if (!file) missing.photo = 'Please add a photo — every wish needs one.'
    if (Object.keys(missing).length) {
      setErrors(missing)
      return
    }

    setSubmitting(true)
    setErrors({})
    setFailure('')

    try {
      const photo = await toDataUrl(file)
      const res = await fetch('/api/wishes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, photo }),
      })
      const body = await res.json().catch(() => null)

      if (!res.ok) {
        if (res.status === 422 && body?.fields) setErrors(body.fields)
        else setFailure(failureFor(res.status, body))
        return
      }
      setSent({ id: body.id, name: values.name.trim(), values })
    } catch {
      setFailure('Could not reach the server. Check that the API is running and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (sent) {
    const place = [sent.values.city, sent.values.state, sent.values.zip]
      .map((s) => s.trim())
      .join(', ')
    return (
      <section className="card card--done">
        <div className="done__mark" aria-hidden="true">
          <span className="done__flame" />
        </div>
        <h2 className="done__title">Your diya is lit.</h2>
        <p className="done__body">
          {preview ? <img className="done__photo" src={preview} alt="" /> : null}
          <span>
            Thanks {sent.name}, from {place} — {sent.values.wish.trim()} —
            kept here for anyone who passes by tonight.
          </span>
        </p>
        <p className="done__ref">Wish #{sent.id} · photo saved</p>
        <button
          type="button"
          className="link"
          onClick={() => {
            setSent(null)
            setValues(EMPTY)
            clear()
          }}
        >
          Light another
        </button>
      </section>
    )
  }

  const input = (key) => {
    const f = byKey[key]
    return (
      <Field key={key} field={f} error={errors[key]}>
        <input
          className="field__input"
          type={f.type}
          value={values[key]}
          maxLength={f.max}
          placeholder={f.placeholder}
          autoComplete={f.autoComplete}
          onChange={set(key)}
        />
      </Field>
    )
  }

  return (
    <section className="card" aria-labelledby="wish-heading">
      <h2 className="card__title" id="wish-heading">
        Leave a wish
      </h2>
      <p className="card__sub">
        Every field is needed — your name and email, where this light came from, your wish, and a
        photo to go with it.
      </p>

      <form className="form" onSubmit={submit}>
        <div className="grid grid--1">{input('name')}</div>

        <div className="grid grid--2">
          {input('email')}
          {input('phone')}
        </div>

        <div className="grid grid--3">
          {input('city')}
          {input('state')}
          {input('zip')}
        </div>

        <Field field={byKey.wish} error={errors.wish}>
          <textarea
            className="field__input field__input--area"
            value={values.wish}
            rows={3}
            maxLength={byKey.wish.max}
            placeholder={byKey.wish.placeholder}
            onChange={set('wish')}
          />
        </Field>

        <div className="field">
          <span className="field__label">Photo</span>
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
                  <button type="button" className="link" onClick={() => inputRef.current?.click()}>
                    Choose a photo
                  </button>
                  <span> or drop one here</span>
                </p>
                <p className="drop__hint">JPG, PNG, WebP or HEIC — up to 8 MB</p>
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
          {errors.photo ? <p className="field__error">{errors.photo}</p> : null}
        </div>

        {failure ? (
          <p className="form__error" role="alert">
            {failure}
          </p>
        ) : null}

        <button type="submit" className="submit" disabled={submitting}>
          {submitting ? 'Lighting…' : 'Light it'}
          {submitting ? null : <span className="submit__spark" aria-hidden="true" />}
        </button>
      </form>
    </section>
  )
}

function Field({ field, error, children }) {
  return (
    <label className="field">
      <span className="field__label">{field.label}</span>
      {children}
      {error ? <span className="field__error">{error}</span> : null}
    </label>
  )
}
