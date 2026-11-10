
"use client";

import { useEffect, useRef, useState } from "react";
import { FIELDS } from "./fields.js";

const MAX_BYTES = 8 * 1024 * 1024;

const EMPTY = {
  name: "",
  email: "",
  phone: "",
  city: "",
  state: "",
  zip: "",
  wish: "",
};

const byKey = Object.fromEntries(
  FIELDS.map((field) => [field.key, field])
);

function toDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("read-failed"));

    reader.readAsDataURL(file);
  });
}

function failureFor(status, body) {
  if (body?.error === "not-configured") {
    return `Storage is not set up on the server yet — missing ${(body.missing || []).join(", ")}.`;
  }

  if (body?.error === "too-many") {
    return body.message ||
      "Too many wishes from here. Try again in a few minutes.";
  }

  if (status === 500) {
    return "The server could not save this. Please try again.";
  }

  return body?.message || "Something went wrong. Please try again.";
}

export default function WishForm() {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [failure, setFailure] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [sent, setSent] = useState(null);

  const inputRef = useRef(null);

  useEffect(() => {
    if (!file) {
      setPreview("");
      return undefined;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  const set = (key) => (event) => {
    setValues((current) => ({
      ...current,
      [key]: event.target.value,
    }));

    setErrors((current) =>
      current[key] || failure
        ? { ...current, [key]: undefined }
        : current
    );

    if (failure) setFailure("");
  };

  const pick = (nextFile) => {
    if (!nextFile) return;

    if (!nextFile.type.startsWith("image/")) {
      setErrors((current) => ({
        ...current,
        photo: "That file is not an image.",
      }));
      return;
    }

    if (nextFile.size > MAX_BYTES) {
      setErrors((current) => ({
        ...current,
        photo: "Please keep the photo under 8 MB.",
      }));
      return;
    }

    setErrors((current) => ({
      ...current,
      photo: undefined,
    }));

    setFile(nextFile);
  };

  const clear = () => {
    setFile(null);

    setErrors((current) => ({
      ...current,
      photo: undefined,
    }));

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const submit = async (event) => {
    event.preventDefault();

    if (submitting) return;

    const missing = {};

    for (const field of FIELDS) {
      if (!values[field.key].trim()) {
        missing[field.key] = `${field.label} is required.`;
      }
    }

    if (!file) {
      missing.photo =
        "Please add a photo — every Christmas wish needs one.";
    }

    if (Object.keys(missing).length) {
      setErrors(missing);
      return;
    }

    setSubmitting(true);
    setErrors({});
    setFailure("");

    try {
      const photo = await toDataUrl(file);

      const response = await fetch("/api/wishes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          photo,
        }),
      });

      const body = await response.json().catch(() => null);

      if (!response.ok) {
        if (response.status === 422 && body?.fields) {
          setErrors(body.fields);
        } else {
          setFailure(failureFor(response.status, body));
        }

        return;
      }

      setSent({
        id: body.id,
        name: values.name.trim(),
        values,
      });
    } catch {
      setFailure(
        "Could not reach the server. Check your connection and try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* ================= SUCCESS SCREEN ================= */

  if (sent) {
    const place = [
      sent.values.city,
      sent.values.state,
      sent.values.zip,
    ]
      .map((value) => value.trim())
      .filter(Boolean)
      .join(", ");

    return (
      <section
        className="card card--christmas card--done"
        id="wish-form"
        aria-live="polite"
      >
        <div className="done__mark" aria-hidden="true">
          <span className="done__snowflake">✦</span>
        </div>

        <h2 className="done__title">
          Your Christmas wish is shared.
        </h2>

        <p className="done__body">
          {preview ? (
            <img
              className="done__photo"
              src={preview}
              alt="Your submitted Christmas photograph"
            />
          ) : null}

          <span>
            Thank you, {sent.name}
            {place ? ` from ${place}` : ""}.
            Your wish — {sent.values.wish.trim()} —
            is now part of the Snowcem Dream Wish Contest.
          </span>
        </p>

        <p className="done__ref">
          ENTRY #{sent.id} · PHOTO SAVED
        </p>

        <button
          type="button"
          className="link done__again"
          onClick={() => {
            setSent(null);
            setValues(EMPTY);
            clear();
          }}
        >
          Share another wish
        </button>
      </section>
    );
  }

  /* ================= FORM INPUT ================= */

  const input = (key) => {
    const field = byKey[key];

    return (
      <Field
        key={key}
        field={field}
        error={errors[key]}
      >
        <input
          className="field__input"
          type={field.type}
          value={values[key]}
          maxLength={field.max}
          placeholder={field.placeholder}
          autoComplete={field.autoComplete}
          required
          onChange={set(key)}
        />
      </Field>
    );
  };

  /* ================= MAIN FORM ================= */

  return (
    <section
      className="card card--christmas"
      id="wish-form"
      aria-labelledby="wish-heading"
    >
      <div className="card__topline">
        <span className="card__kicker">
          A NOTE TO THE SEASON
        </span>

        <span className="card__sparkle" aria-hidden="true">
          ✧
        </span>
      </div>

      <h2 className="card__title" id="wish-heading">
        Share your wish
      </h2>

      <p className="card__sub">
        Tell us a little about yourself, write your Christmas wish
        and add a photograph that means something to you.
      </p>

      <form
        className="form"
        onSubmit={submit}
        noValidate
      >
        <div className="grid grid--1">
          {input("name")}
        </div>

        <div className="grid grid--2">
          {input("email")}
          {input("phone")}
        </div>

        <div className="grid grid--3">
          {input("city")}
          {input("state")}
          {input("zip")}
        </div>

        <Field
          field={byKey.wish}
          error={errors.wish}
        >
          <textarea
            className="field__input field__input--area"
            value={values.wish}
            rows={4}
            maxLength={byKey.wish.max}
            placeholder={byKey.wish.placeholder}
            required
            onChange={set("wish")}
          />

          <span className="field__counter">
            {values.wish.length}/{byKey.wish.max}
          </span>
        </Field>

        {/* PHOTO UPLOAD */}

        <div className="field">
          <span className="field__label">
            Christmas photo{" "}
            <span className="field__required">*</span>
          </span>

          <div
            className={`drop${dragging ? " drop--over" : ""}${file ? " drop--filled" : ""}`}
            onDragOver={(event) => {
              event.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(event) => {
              event.preventDefault();
              setDragging(false);
              pick(event.dataTransfer.files?.[0]);
            }}
          >
            {file && preview ? (
              <>
                <img
                  className="drop__thumb"
                  src={preview}
                  alt={file.name}
                />

                <div className="drop__meta">
                  <span className="drop__name">
                    {file.name}
                  </span>

                  <span className="drop__size">
                    {(file.size / 1024 / 1024).toFixed(1)} MB
                  </span>
                </div>

                <button
                  type="button"
                  className="link drop__remove"
                  onClick={clear}
                >
                  Remove
                </button>
              </>
            ) : (
              <>
                <svg
                  className="drop__icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
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

                  <span> or drop it here</span>
                </p>

                <p className="drop__hint">
                  JPG, PNG, WebP or HEIC · Up to 8 MB
                </p>
              </>
            )}

            <input
              ref={inputRef}
              className="drop__input"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif,image/heic,image/heif,image/gif"
              required={!file}
              onChange={(event) => pick(event.target.files?.[0])}
            />
          </div>

          {errors.photo ? (
            <p className="field__error">
              {errors.photo}
            </p>
          ) : null}
        </div>

        {failure ? (
          <p className="form__error" role="alert">
            {failure}
          </p>
        ) : null}

        <button
          type="submit"
          className="submit submit--christmas"
          disabled={submitting}
        >
          <span>
            {submitting
              ? "Sending your wish…"
              : "Send my Christmas wish"}
          </span>

          {submitting ? null : (
            <span
              className="submit__spark"
              aria-hidden="true"
            />
          )}
        </button>

        <p className="form__privacy">
          Your details are submitted securely with your contest entry.
        </p>
      </form>
    </section>
  );
}

function Field({ field, error, children }) {
  return (
    <label className="field">
      <span className="field__label">
        {field.label}{" "}
        <span className="field__required">*</span>
      </span>

      {children}

      {error ? (
        <span className="field__error">
          {error}
        </span>
      ) : null}
    </label>
  );
}
