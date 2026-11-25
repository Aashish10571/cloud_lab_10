import { useState, type FormEvent } from "react";
import { CATEGORIES, type Note, type NoteInput } from "./types";

interface Props {
  note: Note | null;
  onClose: () => void;
  onSave: (input: NoteInput) => Promise<void>;
}

export default function NoteModal({ note, onClose, onSave }: Props) {
  const [form, setForm] = useState<NoteInput>({
    title: note?.title ?? "",
    content: note?.content ?? "",
    category: note?.category ?? "Personal",
    completed: note?.completed ?? false,
    favorite: note?.favorite ?? false,
  });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const set = <K extends keyof NoteInput>(k: K, v: NoteInput[K]) => setForm({ ...form, [k]: v });

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await onSave(form);
    } catch (err) {
      setError((err as Error).message);
      setBusy(false);
    }
  };

  return (
    <div className="backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <form className="modal" onSubmit={submit} role="dialog" aria-label={note ? "Edit note" : "New note"}>
        <h3>{note ? "Edit note" : "New note"}</h3>
        <input placeholder="Title" value={form.title} onChange={(e) => set("title", e.target.value)} required autoFocus />
        <textarea placeholder="Write your note…" rows={5} value={form.content}
          onChange={(e) => set("content", e.target.value)} />
        <select value={form.category} onChange={(e) => set("category", e.target.value)} aria-label="Category">
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
        <div className="checks">
          <label><input type="checkbox" checked={form.completed} onChange={(e) => set("completed", e.target.checked)} /> Completed</label>
          <label><input type="checkbox" checked={form.favorite} onChange={(e) => set("favorite", e.target.checked)} /> Favorite</label>
        </div>
        {error && <p className="form-error" role="alert">{error}</p>}
        <div className="modal-actions">
          <button type="button" className="ghost" onClick={onClose}>Cancel</button>
          <button className="primary" disabled={busy}>{busy ? "Saving…" : "Save note"}</button>
        </div>
      </form>
    </div>
  );
}
