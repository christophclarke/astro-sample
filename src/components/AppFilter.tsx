import { useState } from "react";
import type { App } from "../data/apps";

interface Props {
  apps: App[];
  allTags: string[];
}

export default function AppFilter({ apps, allTags }: Props) {
  const [active, setActive] = useState<string | null>(null);

  const visible = active ? apps.filter((a) => a.tags.includes(active)) : apps;

  return (
    <div>
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "2rem" }}>
        <button onClick={() => setActive(null)} style={chipStyle(!active)}>
          All
        </button>
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setActive(active === tag ? null : tag)}
            style={chipStyle(active === tag)}
          >
            {tag}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
        {visible.map((app) => (
          <a
            key={app.id}
            href={app.href}
            style={cardStyle}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
              <span style={{ fontWeight: 600 }}>{app.title}</span>
              <span style={statusStyle(app.status)}>{app.status}</span>
            </div>
            <p style={{ fontSize: "0.85rem", color: "var(--muted)", marginBottom: "0.75rem", lineHeight: 1.5 }}>
              {app.description}
            </p>
            <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
              {app.tags.map((tag) => (
                <span key={tag} style={tagStyle(tag === active)}>
                  {tag}
                </span>
              ))}
            </div>
          </a>
        ))}
      </div>

      {visible.length === 0 && (
        <p style={{ color: "var(--muted)", textAlign: "center", padding: "2rem" }}>
          No apps with tag "{active}".
        </p>
      )}
    </div>
  );
}

const cardStyle: React.CSSProperties = {
  display: "block",
  padding: "1.25rem 1.5rem",
  background: "var(--surface)",
  border: "1px solid var(--border)",
  borderRadius: "8px",
  textDecoration: "none",
  color: "inherit",
  transition: "border-color 0.15s",
};

function chipStyle(active: boolean): React.CSSProperties {
  return {
    padding: "0.3rem 0.85rem",
    borderRadius: "999px",
    border: `1px solid ${active ? "var(--accent)" : "var(--border)"}`,
    background: active ? "var(--accent-dim)" : "transparent",
    color: active ? "var(--text)" : "var(--muted)",
    cursor: "pointer",
    fontSize: "0.8rem",
    transition: "all 0.15s",
  };
}

function tagStyle(highlighted: boolean): React.CSSProperties {
  return {
    fontSize: "0.75rem",
    padding: "0.15rem 0.5rem",
    borderRadius: "4px",
    background: highlighted ? "var(--accent-dim)" : "var(--border)",
    color: highlighted ? "var(--text)" : "var(--muted)",
  };
}

function statusStyle(status: App["status"]): React.CSSProperties {
  return {
    fontSize: "0.7rem",
    padding: "0.15rem 0.5rem",
    borderRadius: "4px",
    background: status === "live" ? "#1a3a2a" : "#2a2a1a",
    color: status === "live" ? "#4ade80" : "#facc15",
    fontWeight: 600,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
  };
}
