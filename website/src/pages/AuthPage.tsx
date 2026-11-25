import { useState, type FormEvent, type ReactNode } from "react";
import { login, register } from "../api";
import { IconDoc, IconEye, IconEyeOff, IconLock, IconMail, IconUser } from "../Icons";

function Field({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return <div className="field">{icon}{children}</div>;
}

export default function AuthPage({ onAuth }: { onAuth: () => void }) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const isLogin = mode === "login";
  const switchMode = () => { setMode(isLogin ? "register" : "login"); setError(""); };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      if (isLogin) await login(email, password);
      else await register(name, email, password);
      onAuth();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-bg">
      <div className="auth-card">
        <section className="auth-brand">
          <span className="brand-icon big"><IconDoc width={38} height={38} /></span>
          <h1>Note<b>Flow</b></h1>
          <hr />
          <p>Capture your thoughts,<br />organize your ideas,<br />be more productive.</p>
        </section>

        <section className="auth-form">
          <h2>{isLogin ? "Welcome Back!" : "Create Account"}</h2>
          <p className="sub">{isLogin ? "Sign in to access your notes" : "Start your note journey today"}</p>

          <form onSubmit={submit}>
            {!isLogin && (
              <Field icon={<IconUser />}>
                <input placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)}
                  required autoComplete="name" aria-label="Full name" />
              </Field>
            )}
            <Field icon={<IconMail />}>
              <input type="email" placeholder="Email Address" value={email}
                onChange={(e) => setEmail(e.target.value)} required autoComplete="email" aria-label="Email address" />
            </Field>
            <Field icon={<IconLock />}>
              <input type={show ? "text" : "password"} placeholder="Password" value={password}
                onChange={(e) => setPassword(e.target.value)} required minLength={6}
                autoComplete={isLogin ? "current-password" : "new-password"} aria-label="Password" />
              <button type="button" className="eye" onClick={() => setShow(!show)}
                aria-label={show ? "Hide password" : "Show password"}>
                {show ? <IconEye /> : <IconEyeOff />}
              </button>
            </Field>

            {error && <p className="form-error" role="alert">{error}</p>}
            <button className="primary" disabled={busy}>
              {busy ? "Please wait…" : isLogin ? "Login" : "Register"}
            </button>
          </form>

          {isLogin && <div className="or"><span>OR</span></div>}
          <p className="switch">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button type="button" onClick={switchMode}>{isLogin ? "Register" : "Login"}</button>
          </p>
        </section>
      </div>
    </div>
  );
}
