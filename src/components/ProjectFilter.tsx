import { useState } from "react";

interface Project {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  year: number;
  url?: string;
}

interface Props {
  projects: Project[];
  allTags: string[];
}

export default function ProjectFilter({ projects, allTags }: Props) {
  const [active, setActive] = useState<string | null>(null);

  const visible = active
    ? projects.filter((p) => p.tags.includes(active))
    : projects;

  return (
    <div>
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "2rem" }}>
        <button
          onClick={() => setActive(null)}
          style={chipStyle(!active)}
        >
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

      <div style={{ display: "grid", gap: "1rem" }}>
        {visible.map((project) => (
          <a
            key={project.slug}
            href={`/projects/${project.slug}`}
            style={{
              display: "block",
              padding: "1.25rem 1.5rem",
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              textDecoration: "none",
              color: "inherit",
              transition: "border-color 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.4rem" }}>
              <span style={{ fontWeight: 600 }}>{project.title}</span>
              <span style={{ fontSize: "0.8rem", color: "var(--muted)" }}>{project.year}</span>
            </div>
            <p style={{ fontSize: "0.9rem", color: "var(--muted)", marginBottom: "0.75rem" }}>
              {project.description}
            </p>
            <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
              {project.tags.map((tag) => (
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
          No projects with tag "{active}".
        </p>
      )}
    </div>
  );
}

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
