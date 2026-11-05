import { useRef, useState } from "react";
import { flushSync } from "react-dom";
import ProjectDetails from "./ProjectDetails";
import type { Project } from "../data/resume";
export default function Projects({ projects }: { projects: Project[] }) {
  const [selected, setSelected] = useState<Project | null>(null);
  const [filter, setFilter] = useState("All");
  const transition = useRef<ViewTransition | null>(null);
  function selectCategory(category: string) {
    if (category === filter) return;
    transition.current?.skipTransition();
    if (document.startViewTransition && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      transition.current = document.startViewTransition(() => {
        flushSync(() => setFilter(category));
      });
    } else {
      setFilter(category);
    }
  }
  const visible = projects.filter(
    (project) => filter === "All" || project.category === filter,
  );
  return (
    <>
      <div className="project-toolbar">
        <div className="filter-group" role="group" aria-label="Filter projects">
          {["All", "Personal", "Academic"].map((category) => (
            <button
              key={category}
              type="button"
              aria-pressed={filter === category}
              onClick={() => selectCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
        <p className="muted small" role="status">
          {visible.length} {visible.length === 1 ? "project" : "projects"} ·
          Template content
        </p>
      </div>
      <div className="project-categories" key={filter}>
        {(["Personal", "Academic"] as const)
          .filter((category) => filter === "All" || filter === category)
          .map((category) => (
            <section key={category} aria-label={`${category} projects`}>
              <h3>{category} projects</h3>
              <p className="muted small">
                {category === "Personal"
                  ? "Independent ideas and creative experiments."
                  : "Coursework, research, and applied learning."}
              </p>
              <div className="project-grid">
                {visible
                  .filter((project) => project.category === category)
                  .map((project) => (
                    <article className="project-card" key={project.id}>
                      <span className="eyebrow">{project.category}</span>
                      <h4>{project.title}</h4>
                      <p>{project.description}</p>
                      <button className="project-details-button" type="button" onClick={() => setSelected(project)} aria-haspopup="dialog" aria-label={`Explore project: ${project.title}`}>
                        Explore project <span aria-hidden="true">↗</span>
                      </button>
                      {project.isPlaceholder && <span className="placeholder-note">Template project</span>}
                    </article>
                  ))}
              </div>
            </section>
          ))}
      </div>
      <ProjectDetails project={selected} onClose={() => setSelected(null)} />
    </>
  );
}
