"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArtistProfile,
  createArtistId,
  DEFAULT_ARTISTS,
  getArtistsFromStorage,
  saveArtistsToStorage,
} from "@/lib/artists";

type ArtistForm = {
  name: string;
  image: string;
  style: string;
  descKey: string;
};

const emptyForm: ArtistForm = {
  name: "",
  image: "",
  style: "",
  descKey: "",
};

export default function ArtistAdminClient() {
  const [artists, setArtists] = useState<ArtistProfile[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ArtistForm>(emptyForm);

  useEffect(() => {
    const current = getArtistsFromStorage();
    setArtists(current.length > 0 ? current : DEFAULT_ARTISTS);
  }, []);

  const submitLabel = useMemo(() => (editingId ? "Update Artist" : "Add Artist"), [editingId]);

  const handleInput = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      setForm((prev) => ({ ...prev, image: result }));
    };
    reader.readAsDataURL(file);
  };

  const resetEditor = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const persistArtists = (nextArtists: ArtistProfile[]) => {
    setArtists(nextArtists);
    saveArtistsToStorage(nextArtists);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload: ArtistForm = {
      name: form.name.trim(),
      image: form.image.trim(),
      style: form.style.trim(),
      descKey: form.descKey.trim(),
    };

    if (!payload.name || !payload.image || !payload.style || !payload.descKey) {
      return;
    }

    if (editingId) {
      const updated = artists.map((artist) =>
        artist.id === editingId ? { ...artist, ...payload } : artist
      );
      persistArtists(updated);
      resetEditor();
      return;
    }

    const next: ArtistProfile = {
      id: createArtistId(payload.name),
      ...payload,
    };

    persistArtists([...artists, next]);
    resetEditor();
  };

  const startEdit = (artist: ArtistProfile) => {
    setEditingId(artist.id);
    setForm({
      name: artist.name,
      image: artist.image,
      style: artist.style,
      descKey: artist.descKey,
    });
  };

  const removeArtist = (id: string) => {
    const nextArtists = artists.filter((artist) => artist.id !== id);
    persistArtists(nextArtists);

    if (editingId === id) {
      resetEditor();
    }
  };

  return (
    <>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
        <p style={{ margin: 0, opacity: 0.75 }}>
          Add, edit, or remove artist profiles shown on the homepage.
        </p>
        <div style={{ display: "flex", gap: "0.7rem", flexWrap: "wrap" }}>
          <Link
            href="/admin/content"
            style={{
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: "999px",
              padding: "0.55rem 0.9rem",
              textDecoration: "none",
              color: "#fff",
              background: "linear-gradient(135deg, #5c0000 0%, #a30015 55%, #ff4d4d 100%)",
              boxShadow: "0 8px 22px rgba(109, 6, 17, 0.28)",
            }}
          >
            Content Admin
          </Link>
          <Link
            href="/"
            style={{
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: "999px",
              padding: "0.55rem 0.9rem",
              textDecoration: "none",
              color: "#fff",
              background: "linear-gradient(135deg, #2f2f2f 0%, #111 100%)",
            }}
          >
            Back to Site
          </Link>
        </div>
      </header>

      <section style={{ border: "1px solid rgba(0,0,0,0.12)", borderRadius: "18px", padding: "1.2rem", background: "linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(248,248,248,0.96) 100%)", boxShadow: "0 12px 32px rgba(0,0,0,0.08)" }}>
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: "0.9rem" }}>
          <div style={{ display: "grid", gap: "0.8rem", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))" }}>
            <input
              name="name"
              value={form.name}
              onChange={handleInput}
              placeholder="Name"
              style={{ padding: "0.8rem 0.9rem", borderRadius: "12px", border: "1px solid rgba(0,0,0,0.16)", background: "#fff" }}
            />
            <input
              name="style"
              value={form.style}
              onChange={handleInput}
              placeholder="Style"
              style={{ padding: "0.8rem 0.9rem", borderRadius: "12px", border: "1px solid rgba(0,0,0,0.16)", background: "#fff" }}
            />
          </div>

          <input
            name="image"
            value={form.image}
            onChange={handleInput}
            placeholder="Image URL or /artists/file.jpg"
            style={{ padding: "0.8rem 0.9rem", borderRadius: "12px", border: "1px solid rgba(0,0,0,0.16)", background: "#fff" }}
          />
          <input type="file" accept="image/*" onChange={handleImageUpload} />

          <textarea
            name="descKey"
            value={form.descKey}
            onChange={handleInput}
            placeholder="descKey (translation key) or plain description"
            rows={3}
            style={{ padding: "0.8rem 0.9rem", borderRadius: "12px", border: "1px solid rgba(0,0,0,0.16)", resize: "vertical", background: "#fff" }}
          />

          <div style={{ display: "flex", gap: "0.7rem", flexWrap: "wrap" }}>
            <button
              type="submit"
              style={{
                border: 0,
                borderRadius: "999px",
                padding: "0.7rem 1.1rem",
                background: "linear-gradient(135deg, #6f0000 0%, #b2001a 55%, #ff4d4d 100%)",
                color: "#fff",
                cursor: "pointer",
                fontWeight: 700,
                boxShadow: "0 10px 24px rgba(109, 6, 17, 0.28)",
              }}
            >
              {submitLabel}
            </button>
            {editingId ? (
              <button
                type="button"
                onClick={resetEditor}
                style={{
                  border: "1px solid rgba(0,0,0,0.25)",
                  borderRadius: "999px",
                  padding: "0.7rem 1.1rem",
                  background: "linear-gradient(135deg, #2f2f2f 0%, #111 100%)",
                  color: "#fff",
                  cursor: "pointer",
                }}
              >
                Cancel Edit
              </button>
            ) : null}
          </div>
        </form>
      </section>

      <section style={{ display: "grid", gap: "0.8rem" }}>
        {artists.map((artist) => (
          <article
            key={artist.id}
            style={{
              border: "1px solid rgba(0,0,0,0.12)",
              borderRadius: "16px",
              padding: "0.9rem",
              display: "grid",
              gridTemplateColumns: "96px 1fr auto",
              gap: "0.9rem",
              alignItems: "center",
              background: "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(248,248,248,0.98) 100%)",
            }}
          >
            <div style={{ width: "96px", height: "96px", borderRadius: "10px", overflow: "hidden", background: "rgba(0,0,0,0.08)" }}>
              <img src={artist.image} alt={artist.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div style={{ minWidth: 0 }}>
              <h2 style={{ margin: 0, fontSize: "1rem" }}>{artist.name}</h2>
              <p style={{ margin: "0.2rem 0", opacity: 0.75 }}>{artist.style}</p>
              <p style={{ margin: 0, opacity: 0.6, fontSize: "0.92rem", overflowWrap: "anywhere" }}>
                {artist.descKey}
              </p>
            </div>
            <div style={{ display: "flex", gap: "0.45rem", flexWrap: "wrap", justifyContent: "flex-end" }}>
              <button
                type="button"
                onClick={() => startEdit(artist)}
                style={{
                  border: "1px solid rgba(0,0,0,0.22)",
                  borderRadius: "999px",
                  padding: "0.45rem 0.8rem",
                  background: "linear-gradient(135deg, #2f2f2f 0%, #111 100%)",
                  color: "#fff",
                  cursor: "pointer",
                }}
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => removeArtist(artist.id)}
                style={{
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: "999px",
                  padding: "0.45rem 0.8rem",
                  background: "linear-gradient(135deg, #7a0012 0%, #b2001a 60%, #f14b61 100%)",
                  color: "#fff",
                  cursor: "pointer",
                }}
              >
                Remove
              </button>
            </div>
          </article>
        ))}
      </section>
    </>
  );
}
