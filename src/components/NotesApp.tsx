import { useState, useEffect, useRef } from "react";

// --- Types ---

interface Note {
  id: string;
  title: string;
  body: string;
  updatedAt: number;
}

// --- Persistence ---

const STORAGE_KEY = "portfolio-notes";

function loadNotes(): Note[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveNotes(notes: Note[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

function newNote(): Note {
  return { id: crypto.randomUUID(), title: "Untitled", body: "", updatedAt: Date.now() };
}

// --- Sub-components ---

function Sidebar({
  notes,
  activeId,
  onSelect,
  onNew,
  onDelete,
}: {
  notes: Note[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
}) {
  return (
    <aside style={styles.sidebar}>
      <div style={styles.sidebarHeader}>
        <span style={{ fontWeight: 700, fontSize: "0.95rem" }}>Notes</span>
        <button onClick={onNew} style={styles.newBtn} title="New note">+</button>
      </div>
      <div style={styles.noteList}>
        {notes.length === 0 && (
          <p style={{ color: "var(--muted)", fontSize: "0.85rem", padding: "1rem" }}>
            No notes yet.
          </p>
        )}
        {notes.map((note) => (
          <div
            key={note.id}
            onClick={() => onSelect(note.id)}
            style={{
              ...styles.noteItem,
              ...(note.id === activeId ? styles.noteItemActive : {}),
            }}
          >
            <div style={{ fontWeight: 500, fontSize: "0.9rem", marginBottom: "0.2rem" }}>
              {note.title || "Untitled"}
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--muted)" }}>
              {new Date(note.updatedAt).toLocaleDateString()}
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(note.id); }}
              style={styles.deleteBtn}
              title="Delete note"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </aside>
  );
}

function Editor({
  note,
  onChange,
}: {
  note: Note;
  onChange: (updated: Partial<Note>) => void;
}) {
  const bodyRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [note.body]);

  return (
    <div style={styles.editor}>
      <input
        style={styles.titleInput}
        value={note.title}
        onChange={(e) => onChange({ title: e.target.value })}
        placeholder="Note title"
      />
      <div style={{ fontSize: "0.75rem", color: "var(--muted)", marginBottom: "1rem" }}>
        Last edited {new Date(note.updatedAt).toLocaleString()}
      </div>
      <textarea
        ref={bodyRef}
        style={styles.bodyInput}
        value={note.body}
        onChange={(e) => onChange({ body: e.target.value })}
        placeholder="Start writing..."
      />
    </div>
  );
}

function EmptyState({ onNew }: { onNew: () => void }) {
  return (
    <div style={styles.emptyState}>
      <p style={{ color: "var(--muted)", marginBottom: "1rem" }}>Select a note or create a new one.</p>
      <button onClick={onNew} style={styles.emptyBtn}>New note</button>
    </div>
  );
}

// --- Root app ---

export default function NotesApp() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  // Load from localStorage on mount (client-only)
  useEffect(() => {
    const saved = loadNotes();
    setNotes(saved);
    if (saved.length > 0) setActiveId(saved[0].id);
  }, []);

  // Persist whenever notes change
  useEffect(() => {
    saveNotes(notes);
  }, [notes]);

  function handleNew() {
    const note = newNote();
    setNotes((prev) => [note, ...prev]);
    setActiveId(note.id);
  }

  function handleSelect(id: string) {
    setActiveId(id);
  }

  function handleDelete(id: string) {
    setNotes((prev) => {
      const next = prev.filter((n) => n.id !== id);
      if (activeId === id) setActiveId(next[0]?.id ?? null);
      return next;
    });
  }

  function handleChange(updated: Partial<Note>) {
    setNotes((prev) =>
      prev.map((n) =>
        n.id === activeId ? { ...n, ...updated, updatedAt: Date.now() } : n
      )
    );
  }

  const activeNote = notes.find((n) => n.id === activeId) ?? null;

  return (
    <div style={styles.root}>
      <Sidebar
        notes={notes}
        activeId={activeId}
        onSelect={handleSelect}
        onNew={handleNew}
        onDelete={handleDelete}
      />
      <main style={styles.main}>
        {activeNote ? (
          <Editor note={activeNote} onChange={handleChange} />
        ) : (
          <EmptyState onNew={handleNew} />
        )}
      </main>
    </div>
  );
}

// --- Styles ---

const styles: Record<string, React.CSSProperties> = {
  root: {
    display: "flex",
    height: "calc(100vh - 120px)",
    background: "var(--bg)",
    border: "1px solid var(--border)",
    borderRadius: "10px",
    overflow: "hidden",
  },
  sidebar: {
    width: "220px",
    flexShrink: 0,
    borderRight: "1px solid var(--border)",
    display: "flex",
    flexDirection: "column",
  },
  sidebarHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem",
    borderBottom: "1px solid var(--border)",
  },
  newBtn: {
    background: "var(--accent)",
    color: "white",
    border: "none",
    borderRadius: "50%",
    width: "26px",
    height: "26px",
    fontSize: "1.2rem",
    lineHeight: 1,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  noteList: {
    flex: 1,
    overflowY: "auto",
  },
  noteItem: {
    position: "relative",
    padding: "0.75rem 1rem",
    borderBottom: "1px solid var(--border)",
    cursor: "pointer",
    transition: "background 0.1s",
  },
  noteItemActive: {
    background: "var(--surface)",
    borderLeft: "2px solid var(--accent)",
  },
  deleteBtn: {
    position: "absolute",
    top: "0.5rem",
    right: "0.5rem",
    background: "transparent",
    border: "none",
    color: "var(--muted)",
    cursor: "pointer",
    fontSize: "1.1rem",
    lineHeight: 1,
    padding: "0 0.2rem",
    opacity: 0.6,
  },
  editor: {
    flex: 1,
    padding: "2rem",
    display: "flex",
    flexDirection: "column",
    overflowY: "auto",
  },
  titleInput: {
    background: "transparent",
    border: "none",
    color: "var(--text)",
    fontSize: "1.6rem",
    fontWeight: 700,
    outline: "none",
    marginBottom: "0.5rem",
    fontFamily: "inherit",
    width: "100%",
  },
  bodyInput: {
    background: "transparent",
    border: "none",
    color: "var(--muted)",
    fontSize: "0.95rem",
    lineHeight: 1.75,
    outline: "none",
    resize: "none",
    fontFamily: "inherit",
    flex: 1,
    minHeight: "200px",
    width: "100%",
    overflow: "hidden",
  },
  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  emptyState: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  emptyBtn: {
    padding: "0.5rem 1.25rem",
    background: "var(--accent)",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.9rem",
  },
};
