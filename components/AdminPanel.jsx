'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

const STATUSES = ['pending', 'approved', 'hidden']

const dateFmt = new Intl.DateTimeFormat(undefined, {
  dateStyle: 'medium',
  timeStyle: 'short',
})

const place = (row) =>
  [row.city, row.state, row.zip].filter(Boolean).join(' · ') || '—'

async function json(url, options) {
  const res = await fetch(url, options)
  const body = await res.json().catch(() => null)
  if (!res.ok) {
    const err = new Error(body?.message || body?.error || `Request failed (${res.status})`)
    err.status = res.status
    err.body = body
    throw err
  }
  return body
}

const localSession = (signedIn) => ({ signedIn, configured: true, missing: [] })

export default function AdminPanel() {
  const [session, setSession] = useState(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [loginFields, setLoginFields] = useState({})
  const [busy, setBusy] = useState(false)

  const [rows, setRows] = useState([])
  const [stats, setStats] = useState(null)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [per, setPer] = useState(25)

  const [search, setSearch] = useState('')
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('')
  const [listError, setListError] = useState('')
  const [listBusy, setListBusy] = useState(false)

  const [expanded, setExpanded] = useState(null)
  const [confirmId, setConfirmId] = useState(null)
  const [photoUrl, setPhotoUrl] = useState('')
  const confirmTimer = useRef(null)

  useEffect(() => {
    json('/api/admin/session')
      .then(setSession)
      .catch(() => setSession({ error: true, signedIn: false, configured: false, missing: [] }))
    return () => clearTimeout(confirmTimer.current)
  }, [])

  // Let typing settle before hitting the database.
  useEffect(() => {
    const t = setTimeout(() => {
      setQuery(search.trim())
      setPage(1)
    }, 320)
    return () => clearTimeout(t)
  }, [search])

  const load = useCallback(async () => {
    setListBusy(true)
    setListError('')
    try {
      const params = new URLSearchParams({ q: query, status, page: String(page) })
      const data = await json(`/api/admin/wishes?${params}`)
      setRows(data.rows)
      setStats(data.stats)
      setTotal(data.total)
      setPer(data.per)
    } catch (err) {
      if (err.status === 401) setSession(localSession(false))
      else setListError(err.message)
    } finally {
      setListBusy(false)
    }
  }, [query, status, page])

  useEffect(() => {
    if (session?.signedIn) load()
  }, [session, load])

  const signIn = async (e) => {
    e.preventDefault()

    const fields = {}
    if (!email.trim()) fields.email = 'Email is required.'
    if (!password) fields.password = 'Password is required.'
    if (Object.keys(fields).length) {
      setLoginFields(fields)
      return
    }

    setBusy(true)
    setLoginError('')
    setLoginFields({})
    try {
      await json('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      setSession(localSession(true))
      setPassword('')
    } catch (err) {
      if (err.status === 422 && err.body?.fields) setLoginFields(err.body.fields)
      else if (err.status === 401) setLoginError('That email and password do not match.')
      else if (err.status === 503)
        setLoginError('Set ADMIN_EMAIL, ADMIN_PASSWORD and ADMIN_SECRET in .env to switch the panel on.')
      else setLoginError(err.message)
    } finally {
      setBusy(false)
    }
  }

  const signOut = async () => {
    await json('/api/admin/logout', { method: 'POST' }).catch(() => {})
    setRows([])
    setStats(null)
    setSession(localSession(false))
  }

  const patch = async (id, body) => {
    setBusy(true)
    try {
      const updated = await json(`/api/admin/wishes/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      setRows((list) => list.map((r) => (r.id === id ? { ...r, ...updated } : r)))
    } catch (err) {
      setListError(err.message)
    } finally {
      setBusy(false)
    }
  }

  const destroy = async (id) => {
    setBusy(true)
    try {
      await json(`/api/admin/wishes/${id}`, { method: 'DELETE' })
      setRows((list) => list.filter((r) => r.id !== id))
      setTotal((t) => Math.max(0, t - 1))
      setConfirmId(null)
      setPhotoUrl('')
    } catch (err) {
      setListError(err.message)
    } finally {
      setBusy(false)
    }
  }

  const askDelete = (id) => {
    setConfirmId(id)
    clearTimeout(confirmTimer.current)
    confirmTimer.current = setTimeout(() => setConfirmId(null), 4000)
  }

  if (!session) return <div className="admin__boot">Checking the server…</div>

  if (session.error) {
    return (
      <div className="admin">
        <div className="notice">
          <h1 className="notice__title">The server did not answer</h1>
          <p>
            Nothing came back on <code>/api/admin/session</code>. Run the site with{' '}
            <code>npm run dev</code> and reload this page.
          </p>
        </div>
      </div>
    )
  }

  if (session.missing.length) {
    return (
      <div className="admin">
        <div className="notice">
          <h1 className="notice__title">Storage is not configured yet</h1>
          <p>These settings are still empty in <code>.env</code>:</p>
          <ul className="notice__list">
            {session.missing.map((key) => (
              <li key={key}>
                <code>{key}</code>
              </li>
            ))}
          </ul>
          <p>
            Add these to <code>.env</code> and restart the app. The <code>wishes</code> table lives
            in your TiDB Cloud database.
          </p>
        </div>
      </div>
    )
  }

  if (!session.configured) {
    return (
      <div className="admin">
        <div className="notice">
          <h1 className="notice__title">Admin sign-in is switched off</h1>
          <p>
            Set <code>ADMIN_EMAIL</code>, <code>ADMIN_PASSWORD</code> and a generated{' '}
            <code>ADMIN_SECRET</code> in <code>.env</code>, then restart the app.
          </p>
        </div>
      </div>
    )
  }

  if (!session.signedIn) {
    return (
      <div className="admin">
        <form className="login" onSubmit={signIn}>
          <h1 className="login__title">Wish admin</h1>
          <p className="login__sub">Sign in with the admin email and password.</p>
          <label className="field">
            <span className="field__label">Email</span>
            <input
              className="field__input"
              type="email"
              value={email}
              autoFocus
              autoComplete="username"
              placeholder="you@example.com"
              onChange={(e) => {
                setEmail(e.target.value)
                setLoginFields((f) => ({ ...f, email: '' }))
              }}
            />
            {loginFields.email ? <span className="field__error">{loginFields.email}</span> : null}
          </label>
          <label className="field">
            <span className="field__label">Password</span>
            <input
              className="field__input"
              type="password"
              value={password}
              autoComplete="current-password"
              placeholder="Admin password"
              onChange={(e) => {
                setPassword(e.target.value)
                setLoginFields((f) => ({ ...f, password: '' }))
              }}
            />
            {loginFields.password ? (
              <span className="field__error">{loginFields.password}</span>
            ) : null}
          </label>
          {loginError ? <p className="form__error">{loginError}</p> : null}
          <button className="submit" type="submit" disabled={busy}>
            {busy ? 'Checking…' : 'Sign in'}
          </button>
        </form>
      </div>
    )
  }

  const pages = Math.max(1, Math.ceil(total / per))

  return (
    <div className="admin">
      <header className="admin__head">
        <div>
          <h1 className="admin__title">Wishes</h1>
          <p className="admin__count">
            {total} total
            {listBusy ? ' · loading' : ''}
          </p>
        </div>
        <div className="admin__headactions">
          <a className="ghost" href="/api/admin/wishes/export" download>
            Export CSV
          </a>
          <button className="ghost" type="button" onClick={load}>
            Refresh
          </button>
          <button className="ghost" type="button" onClick={signOut}>
            Sign out
          </button>
        </div>
      </header>

      {stats ? (
        <div className="stats">
          <Stat label="Total" value={stats.total} />
          <Stat label="Pending" value={stats.pending} tone="pending" />
          <Stat label="Approved" value={stats.approved} tone="approved" />
          <Stat label="Hidden" value={stats.hidden} tone="hidden" />
        </div>
      ) : null}

      <div className="toolbar">
        <input
          className="field__input toolbar__search"
          type="search"
          value={search}
          placeholder="Search name, email, city or wish"
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="segmented" role="group" aria-label="Filter by status">
          <Segment active={status === ''} onClick={() => { setStatus(''); setPage(1) }}>
            All
          </Segment>
          {STATUSES.map((s) => (
            <Segment key={s} active={status === s} onClick={() => { setStatus(s); setPage(1) }}>
              {s}
            </Segment>
          ))}
        </div>
      </div>

      {listError ? (
        <p className="form__error" role="alert">
          {listError}
        </p>
      ) : null}

      <div className="atable">
        <div className="arow arow--head">
          <span>When</span>
          <span>Who</span>
          <span>From</span>
          <span>Wish</span>
          <span>Photo</span>
          <span>Status</span>
          <span />
        </div>

        {!rows.length && !listBusy ? (
          <div className="atable__empty">
            {query || status ? 'No wishes match this filter.' : 'No wishes saved yet.'}
          </div>
        ) : null}

        {rows.map((row) => (
          <div key={row.id} className={`arow${expanded === row.id ? ' arow--open' : ''}`}>
            <span className="acell acell--when" title={row.createdAt}>
              {dateFmt.format(new Date(row.createdAt))}
            </span>

            <span className="acell acell--who">
              <button
                type="button"
                className="aname"
                onClick={() => setExpanded(expanded === row.id ? null : row.id)}
              >
                {row.name}
              </button>
              <span className="asub">{row.email}</span>
              {row.phone ? <span className="asub">{row.phone}</span> : null}
            </span>

            <span className="acell acell--place">{place(row)}</span>

            <span
              className="acell acell--wish"
              onClick={() => setExpanded(expanded === row.id ? null : row.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter') setExpanded(expanded === row.id ? null : row.id)
              }}
            >
              {row.wish || <em className="muted">no wish text</em>}
            </span>

            <span className="acell acell--photo">
              {row.photoUrl ? (
                <button
                  type="button"
                  className="thumb"
                  onClick={() => setPhotoUrl(row.photoUrl)}
                  title="Open photo"
                >
                  <img src={row.photoUrl} alt="" loading="lazy" />
                </button>
              ) : (
                <span className="muted">—</span>
              )}
            </span>

            <span className="acell acell--status">
              <select
                className="pick"
                value={row.status}
                disabled={busy}
                onChange={(e) => patch(row.id, { status: e.target.value })}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </span>

            <span className="acell acell--act">
              {confirmId === row.id ? (
                <>
                  <button className="ghost ghost--warn" type="button" onClick={() => destroy(row.id)}>
                    Confirm
                  </button>
                  <button className="ghost" type="button" onClick={() => setConfirmId(null)}>
                    Keep
                  </button>
                </>
              ) : (
                <button className="ghost" type="button" onClick={() => askDelete(row.id)}>
                  Delete
                </button>
              )}
            </span>

            {expanded === row.id ? (
              <div className="adetail">
                <div>
                  <b>Wish #{row.id}</b> · saved {dateFmt.format(new Date(row.createdAt))}
                  {` · photo ${(row.photoBytes / 1024 / 1024).toFixed(1)} MB ${row.photoType}`}
                  <p className="adetail__wish">{row.wish || 'No wish text.'}</p>
                  <p className="adetail__url">
                    <a className="link" href={row.photoUrl} target="_blank" rel="noreferrer">
                      {row.photoUrl}
                    </a>
                  </p>
                </div>
                <label className="adetail__note">
                  <span className="field__label">Internal note</span>
                  <input
                    className="field__input"
                    defaultValue={row.note}
                    placeholder="Only visible here"
                    maxLength={240}
                    onBlur={(e) => {
                      if (e.target.value !== row.note) patch(row.id, { note: e.target.value })
                    }}
                  />
                </label>
              </div>
            ) : null}
          </div>
        ))}
      </div>

      {pages > 1 ? (
        <div className="pager">
          <button className="ghost" type="button" disabled={page <= 1} onClick={() => setPage(page - 1)}>
            Newer
          </button>
          <span>
            page {page} of {pages}
          </span>
          <button
            className="ghost"
            type="button"
            disabled={page >= pages}
            onClick={() => setPage(page + 1)}
          >
            Older
          </button>
        </div>
      ) : null}

      {photoUrl ? (
        <div className="modal" onClick={() => setPhotoUrl('')} role="presentation">
          <img
            className="modal__img"
            src={photoUrl}
            alt=""
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      ) : null}
    </div>
  )
}

function Stat({ label, value, tone }) {
  return (
    <div className={`stat${tone ? ` stat--${tone}` : ''}`}>
      <b>{Number(value)}</b>
      <span>{label}</span>
    </div>
  )
}

function Segment({ active, onClick, children }) {
  return (
    <button type="button" className={`seg${active ? ' seg--on' : ''}`} onClick={onClick}>
      {children}
    </button>
  )
}
