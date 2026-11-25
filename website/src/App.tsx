import { useState } from "react";
import { session } from "./api";
import AuthPage from "./pages/AuthPage";
import NotesPage from "./pages/NotesPage";
import { IconDoc, IconHome, IconLogout } from "./Icons";

type View = "dashboard" | "notes";

export default function App() {
  const [authed, setAuthed] = useState(!!session.token);
  const [view, setView] = useState<View>("dashboard");

  // Not logged in -> only the login/register screen is reachable.
  if (!authed) return <AuthPage onAuth={() => setAuthed(true)} />;

  const name = session.name || "there";
  const logout = () => {
    session.clear();
    setView("dashboard");
    setAuthed(false);
  };

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-icon"><IconDoc /></span>
          <span className="brand-text">Note<b>Flow</b></span>
        </div>
        <nav>
          <button className={view === "dashboard" ? "active" : ""} onClick={() => setView("dashboard")}>
            <IconHome /> Dashboard
          </button>
          <button className={view === "notes" ? "active" : ""} onClick={() => setView("notes")}>
            <IconDoc /> My Notes
          </button>
        </nav>
        <div className="nav-foot">
          <button onClick={logout}><IconLogout /> Logout</button>
        </div>
      </aside>

      <main className="main">
        <div className="topbar">
          <span className="avatar">{name[0].toUpperCase()}</span>
          <span className="user-name">{name}</span>
        </div>
        <NotesPage key={view} name={name} overview={view === "dashboard"} />
      </main>
    </div>
  );
}
