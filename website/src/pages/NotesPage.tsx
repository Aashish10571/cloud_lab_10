import { useEffect, useMemo, useState } from "react";
import { createNote, deleteNote, getNotes, updateNote } from "../api";
import { CATEGORIES, type Note, type NoteInput } from "../types";
import NoteModal from "../NoteModal";
import { IconCalendar, IconCheck, IconDoc, IconPencil, IconPlus, IconSearch, IconStar, IconTrash } from "../Icons";

const fmt = (iso: string) => {
  const d = new Date(iso);
  const date = d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const time = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  return `${date} • ${time}`;
};

export default function NotesPage({ name, overview }: { name: string; overview: boolean }) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [editing, setEditing] = useState<Note | "new" | null>(null);

  const load = () => {
    setLoading(true);
    setError("");
    getNotes()
      .then(setNotes)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const visible = useMemo(() => {
    const q = query.toLowerCase();
    return notes.filter(
      (n) =>
        (filter === "All" || n.category === filter) &&
        (n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q))
    );
  }, [notes, query, filter]);

  const save = async (input: NoteInput) => {
    if (editing && editing !== "new") await updateNote(editing._id, input);
    else await createNote(input);
    setEditing(null);
    load();
  };

  const remove = async (n: Note) => {
    if (!window.confirm(`Delete "${n.title}"?`)) return;
    try {
      await deleteNote(n._id);
      setNotes((prev) => prev.filter((x) => x._id !== n._id));
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const stats = [
    { label: "Total Notes", value: notes.length, cls: "doc", icon: <IconDoc width={26} height={26} /> },
    { label: "Completed", value: notes.filter((n) => n.completed).length, cls: "done", icon: <IconCheck width={30} height={30} strokeWidth={3} /> },
    { label: "Favorites", value: notes.filter((n) => n.favorite).length, cls: "fav", icon: <IconStar width={26} height={26} fill="currentColor" /> },
  ];

  return (
    <>
      <header className="page-head">
        <div>
          <h1>{overview ? `Welcome back, ${name}!` : "My Notes"}</h1>
          <p>{overview ? "Keep your ideas organized and never forget anything important." : "Every note you've written, in one place."}</p>
        </div>
        <button className="primary new" onClick={() => setEditing("new")}><IconPlus /> New Note</button>
      </header>

      {overview && (
        <div className="stats">
          {stats.map((s) => (
            <div className="stat" key={s.label}>
              <span className={`stat-icon ${s.cls}`}>{s.icon}</span>
              <div><span>{s.label}</span><strong>{s.value}</strong></div>
            </div>
          ))}
        </div>
      )}

      <div className="toolbar">
        <label className="search">
          <IconSearch />
          <input placeholder="Search notes..." value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search notes" />
        </label>
        <div className="chips">
          {["All", ...CATEGORIES].map((c) => (
            <button key={c} className={filter === c ? "active" : ""} onClick={() => setFilter(c)}>{c}</button>
          ))}
        </div>
      </div>

      {error && <p className="form-error">{error} <button className="link" onClick={load}>Try again</button></p>}
      {loading && <p className="muted">Loading notes…</p>}
      {!loading && !error && !visible.length && (
        <p className="muted">{notes.length ? "No notes match your search." : "No notes yet. Create your first note."}</p>
      )}

      <div className="cards">
        {visible.map((n) => (
          <article key={n._id} className={`note cat-${n.category.toLowerCase()}${n.completed ? " is-done" : ""}`}>
            <div className="note-top">
              <h3>{n.title}{n.favorite && <IconStar className="fav-mark" width={16} height={16} fill="currentColor" />}</h3>
              <span className="tag">{n.category}</span>
            </div>
            <p className="note-body">{n.content}</p>
            <div className="note-foot">
              <span className="date"><IconCalendar width={18} height={18} /> {fmt(n.updatedAt ?? n.createdAt)}</span>
              <span className="actions">
                <button onClick={() => setEditing(n)} aria-label={`Edit ${n.title}`}><IconPencil width={18} height={18} /></button>
                <button onClick={() => remove(n)} aria-label={`Delete ${n.title}`}><IconTrash width={18} height={18} /></button>
              </span>
            </div>
          </article>
        ))}
        <button className="add-card" onClick={() => setEditing("new")}>
          <IconDoc width={44} height={44} strokeWidth={1.6} />
          <strong>Add a new note</strong>
          <span>Capture your thoughts, ideas and tasks.</span>
        </button>
      </div>

      {editing && (
        <NoteModal note={editing === "new" ? null : editing} onClose={() => setEditing(null)} onSave={save} />
      )}
    </>
  );
}
