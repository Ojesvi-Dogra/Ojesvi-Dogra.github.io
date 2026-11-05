import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import type { Project } from '../data/resume';

export default function ProjectDetails({ project, onClose }: { project: Project | null; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const overflow = useRef('');
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closingRef = useRef(false);
  const [closing, setClosing] = useState(false);
  useEffect(() => {
    if (!project) return;
    const element = dialog.current!;
    opener.current = document.activeElement as HTMLElement;
    overflow.current = document.body.style.overflow;
    element.showModal();
    document.body.style.overflow = 'hidden';
    return () => {
      if (timer.current) clearTimeout(timer.current);
      document.body.style.overflow = overflow.current;
    };
  }, [project]);
  function finish() { dialog.current?.close(); }
  function close() {
    if (closingRef.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { finish(); return; }
    closingRef.current = true;
    setClosing(true);
    timer.current = setTimeout(finish, 240);
  }
  function handleKeys(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key !== 'Tab') return;
    const controls = event.currentTarget.querySelectorAll<HTMLElement>('button, a[href]');
    const first = controls[0], last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
  }
  return <dialog ref={dialog} className={`project-dialog${closing ? ' is-closing' : ''}`} aria-labelledby="project-detail-title"
    onCancel={event => { event.preventDefault(); close(); }}
    onClick={event => { if (event.target === event.currentTarget) close(); }}
    onKeyDown={handleKeys}
    onClose={() => {
      if (timer.current) clearTimeout(timer.current);
      document.body.style.overflow = overflow.current;
      closingRef.current = false;
      setClosing(false);
      onClose();
      opener.current?.focus();
    }}>
    <div className="project-dialog-content" onAnimationEnd={event => { if (event.target === event.currentTarget && closingRef.current) finish(); }}>
      <button className="project-dialog-close" type="button" aria-label="Close project details" onClick={close} autoFocus>×</button>
      {project && <>
        <p className="eyebrow">{project.category} project</p>
        <h2 id="project-detail-title">{project.title}</h2>
        {project.isPlaceholder && <p className="project-template-note">Template project · Replace these prompts with verified project details.</p>}
        <p className="section-description">{project.description}</p>
        <section><h3>The problem</h3><p>{project.details?.problem ?? '[Describe the problem, who it affected, and why it mattered.]'}</p></section>
        <section><h3>My approach</h3><p>{project.details?.approach ?? '[Explain your contribution, technical decisions, and tradeoffs.]'}</p></section>
        <section><h3>The outcome</h3><p>{project.details?.outcome ?? '[Share the result, evidence, and what you learned.]'}</p></section>
        {!!project.details?.technologies.length && <section><h3>Technologies</h3><ul className="chips">{project.details.technologies.map(technology => <li key={technology}>{technology}</li>)}</ul></section>}
        {project.href && <a className="button primary" href={project.href} target="_blank" rel="noreferrer">Visit project <span aria-hidden="true">↗</span></a>}
      </>}
    </div>
  </dialog>;
}
