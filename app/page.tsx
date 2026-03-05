"use client";

import { useState, useEffect } from "react";

interface Game {
  id: number;
  title: string;
  description: string;
  price: number;
  tags: string[];
  rating: number;
}

export default function AdminPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [tags, setTags] = useState("");

  async function loadGames() {
    const res = await fetch("http://localhost:3001/games");
    const data = await res.json();
    setGames(data);
  }

  async function addGame() {
    if (!title) return;
    await fetch("http://localhost:3001/games", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description,
        price: Number(price),
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      }),
    });
    setTitle("");
    setDescription("");
    setPrice("");
    setTags("");
    loadGames();
  }

  async function deleteGame(id: number) {
    await fetch(`http://localhost:3001/games/${id}`, { method: "DELETE" });
    loadGames();
  }

  useEffect(() => {
    loadGames();
  }, []);

  return (
    <main
      style={{
        fontFamily: "sans-serif",
        maxWidth: "800px",
        margin: "0 auto",
        padding: "2rem",
      }}
    >
      <h1>⚙️ Admin Panel</h1>
      <p style={{ color: "#888" }}>
        Manage games — writes to PostgreSQL + MongoDB
      </p>

      <div
        style={{
          background: "#1a1a1a",
          padding: "1.5rem",
          borderRadius: "8px",
          marginBottom: "2rem",
        }}
      >
        <h2 style={{ color: "#fff", marginTop: 0 }}>Add Game</h2>
        <div style={{ display: "grid", gap: "0.75rem" }}>
          <input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={inputStyle}
          />
          <input
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={inputStyle}
          />
          <input
            placeholder="Price"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            style={inputStyle}
          />
          <input
            placeholder="Tags (comma separated: action, rpg)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            style={inputStyle}
          />
          <button onClick={addGame} style={buttonStyle}>
            Add Game
          </button>
        </div>
      </div>

      <h2>Games ({games.length})</h2>
      {games.length === 0 ? (
        <p style={{ color: "#888" }}>No games yet.</p>
      ) : (
        <div style={{ display: "grid", gap: "0.75rem" }}>
          {games.map((game) => (
            <div
              key={game.id}
              style={{
                border: "1px solid #333",
                borderRadius: "8px",
                padding: "1rem",
                background: "#1a1a1a",
                color: "#fff",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <strong>{game.title}</strong>
                <span style={{ color: "#4ade80", marginLeft: "1rem" }}>
                  ${game.price}
                </span>
                <div style={{ marginTop: "0.25rem" }}>
                  {game.tags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        background: "#7c3aed",
                        color: "#fff",
                        padding: "2px 8px",
                        borderRadius: "4px",
                        fontSize: "0.75rem",
                        marginRight: "4px",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <button
                onClick={() => deleteGame(game.id)}
                style={{
                  background: "#ef4444",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  padding: "0.5rem 1rem",
                  cursor: "pointer",
                }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

const inputStyle = {
  padding: "0.6rem",
  borderRadius: "6px",
  border: "1px solid #444",
  background: "#111",
  color: "#fff",
  fontSize: "1rem",
  width: "100%",
  boxSizing: "border-box" as const,
};

const buttonStyle = {
  padding: "0.75rem",
  borderRadius: "6px",
  border: "none",
  background: "#7c3aed",
  color: "#fff",
  fontSize: "1rem",
  cursor: "pointer",
  fontWeight: "bold",
};
