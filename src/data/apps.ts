export interface App {
  id: string;
  title: string;
  description: string;
  tags: string[];
  href: string;
  status: "live" | "wip";
}

const apps: App[] = [
  {
    id: "notes",
    title: "Notes",
    description: "A minimal note-taking app with localStorage persistence.",
    tags: ["react", "productivity"],
    href: "/apps/notes",
    status: "live",
  },
];

export default apps;
