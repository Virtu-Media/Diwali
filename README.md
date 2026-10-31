
```
Diwali
├─ AGENTS.md                    rules for anyone working on this project
├─ app                          Next.js App Router: every page and API handler
│  ├─ admin                     the /admin route
│  │  └─ page.jsx               page shell that mounts the panel
│  ├─ api                       server route handlers
│  │  ├─ admin                  the endpoints the panel calls
│  │  │  ├─ login
│  │  │  │  └─ route.js         email + password check, sets the session cookie
│  │  │  ├─ session
│  │  │  │  └─ route.js         tells the panel if it is signed in and configured
│  │  │  └─ wishes
│  │  │     ├─ export
│  │  │     │  └─ route.js      the filtered list as a CSV download
│  │  │     ├─ route.js         paged wish list with search, filters and counts
│  │  │     └─ [id]
│  │  │        └─ route.js      approve, hide, note or delete one wish
│  │  └─ wishes
│  │     └─ route.js            public submit: rate limit, validate, upload, insert
│  ├─ globals.css               one stylesheet: theme tokens, night sky, form, panel
│  ├─ layout.jsx                html shell, fonts, page metadata
│  └─ page.jsx                  the landing page: hero, wish form, footer
├─ components                   the client pieces the pages compose
│  ├─ AdminPanel.jsx            whole panel: login, filters, table, photo, actions
│  ├─ DiyaRow.jsx               the two oil lamps, one in each bottom corner
│  ├─ Embers.jsx                drifting embers behind the content
│  ├─ fields.js                 the wish form's field definitions and limits
│  ├─ FireworkLoader.jsx        opening firework burst, unmounts itself
│  ├─ StringLights.jsx          two draped bulb strands, rebuilt on resize
│  ├─ SvgDefs.jsx               gradients shared by the SVG art
│  └─ WishForm.jsx              form, photo drop zone, submit, thank-you state
├─ hooks                        browser-only hooks
│  └─ useViewportWidth.js       window width for the art that rescales
├─ jsconfig.json                defines the import alias for app, lib and components
├─ lib                          server-side logic, plain JS, no framework
│  ├─ config.js                 .env values in one object, plus what is missing
│  ├─ db.js                     every SQL statement, on one mysql2 pool
│  ├─ http.js                   shared config gate, error response, client IP
│  ├─ session.js                the stateless sealed admin cookie: seal, read, verify
│  ├─ storage.js                R2 upload with a random word name, delete, URL
│  └─ validate.js               field rules for the wish form and admin sign-in
├─ next.config.js               keeps mysql2 and the S3 client out of the bundle
├─ package-lock.json            locked dependency versions
├─ package.json                 three scripts: dev, build, start
└─ README.md                    this tree

```
