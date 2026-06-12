import React from 'react';
import { ExternalLink } from 'lucide-react';

export default function ProjectCard({ project }) {
  const { title, description, category, imageUrl, tags, githubUrl, liveUrl } = project;

  return (
    <div className="project-card glow-card">
      <div className="project-image-wrapper">
        <img src={imageUrl || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c'} alt={title} className="project-image" />
      </div>
      <div className="project-content">
        <span className="project-category">{category}</span>
        <h3 className="project-title">{title}</h3>
        <p className="project-desc">{description}</p>
        <div className="project-tags">
          {tags.map((tag, idx) => (
            <span key={idx} className="project-tag">{tag}</span>
          ))}
        </div>
        <div className="project-links">
          {githubUrl && (
            <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="project-link">
              <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-github">
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                <path d="M9 18c-4.51 2-5-2-7-2" />
              </svg> Code
            </a>
          )}
          {liveUrl && (
            <a href={liveUrl} target="_blank" rel="noopener noreferrer" className="project-link">
              <ExternalLink size={18} /> Live Demo
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
