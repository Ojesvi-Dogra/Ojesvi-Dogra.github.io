import { useState } from "react";
import type { Project } from "../data/resume";
export default function Projects({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState("All");
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
              onClick={() => setFilter(category)}
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
      <div className="project-categories">
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
                      {project.href ? (
                        <a href={project.href} target="_blank" rel="noreferrer">
                          View project <span aria-hidden="true">↗</span>
                        </a>
                      ) : (
                        <span className="placeholder-note">
                          Project details coming soon
                        </span>
                      )}
                    </article>
                  ))}
              </div>
            </section>
          ))}
      </div>
    </>
  );
}
