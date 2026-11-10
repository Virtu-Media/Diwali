
export const FIELDS = [
  {
    key: "name",
    label: "Name",
    type: "text",
    max: 60,
    placeholder: "Your name",
    autoComplete: "name",
  },
  {
    key: "email",
    label: "Email",
    type: "email",
    max: 160,
    placeholder: "you@example.com",
    autoComplete: "email",
  },
  {
    key: "phone",
    label: "Phone",
    type: "tel",
    max: 24,
    placeholder: "+91 90000 00000",
    autoComplete: "tel",
  },
  {
    key: "city",
    label: "City",
    type: "text",
    max: 60,
    placeholder: "Your city",
    autoComplete: "address-level2",
  },
  {
    key: "state",
    label: "State",
    type: "text",
    max: 60,
    placeholder: "Your state",
    autoComplete: "address-level1",
  },
  {
    key: "zip",
    label: "ZIP / PIN code",
    type: "text",
    max: 12,
    placeholder: "400001",
    autoComplete: "postal-code",
  },
  {
    key: "wish",
    label: "Your Christmas wish",
    type: "textarea",
    max: 240,
    placeholder:
      "Share the Christmas wish closest to your heart...",
  },
];
