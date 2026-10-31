// Single source of truth for the wish form fields. Every field is required.
// Limits match lib/validate.js.
export const FIELDS = [
  {
    key: 'name',
    label: 'Name',
    type: 'text',
    max: 60,
    placeholder: 'Your name',
    autoComplete: 'name',
  },
  {
    key: 'email',
    label: 'Email',
    type: 'email',
    max: 160,
    placeholder: 'you@example.com',
    autoComplete: 'email',
  },
  {
    key: 'phone',
    label: 'Phone',
    type: 'tel',
    max: 24,
    placeholder: '+91 90000 00000',
    autoComplete: 'tel',
  },
  {
    key: 'city',
    label: 'City',
    type: 'text',
    max: 60,
    placeholder: 'City',
    autoComplete: 'address-level2',
  },
  {
    key: 'state',
    label: 'State',
    type: 'text',
    max: 60,
    placeholder: 'State',
    autoComplete: 'address-level1',
  },
  {
    key: 'zip',
    label: 'Zip',
    type: 'text',
    max: 12,
    placeholder: '560001',
    autoComplete: 'postal-code',
  },
  {
    key: 'wish',
    label: 'Wish',
    type: 'textarea',
    max: 240,
    placeholder: 'Health, light, and a good year ahead.',
  },
]
