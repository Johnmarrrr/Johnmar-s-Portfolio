import React, { useState, useEffect } from 'react';

export default function ProjectForm({ project, token, onSuccess, onCancel }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [tags, setTags] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [featured, setFeatured] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (project) {
      setTitle(project.title || '');
      setDescription(project.description || '');
      setCategory(project.category || '');
      setImageUrl(project.imageUrl || '');
      setTags(project.tags ? project.tags.join(', ') : '');
      setGithubUrl(project.githubUrl || '');
      setLiveUrl(project.liveUrl || '');
      setFeatured(project.featured || false);
    } else {
      setTitle('');
      setDescription('');
      setCategory('');
      setImageUrl('');
      setTags('');
      setGithubUrl('');
      setLiveUrl('');
      setFeatured(false);
    }
  }, [project]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const projectData = {
      title,
      description,
      category,
      imageUrl,
      tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
      githubUrl,
      liveUrl,
      featured,
    };

    const url = project
      ? `http://localhost:5000/api/projects/${project._id}`
      : 'http://localhost:5000/api/projects';

    const method = project ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(projectData),
      });

      const data = await res.json();
      if (res.ok) {
        onSuccess();
      } else {
        setError(data.message || 'Operation failed');
      }
    } catch (err) {
      setError('Failed to communicate with server');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="alert alert-error">{error}</div>}
      <div className="form-group">
        <label className="form-label" htmlFor="project-title">Title</label>
        <input
          id="project-title"
          type="text"
          className="form-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label className="form-label" htmlFor="project-desc">Description</label>
        <textarea
          id="project-desc"
          className="form-input"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label className="form-label" htmlFor="project-cat">Category</label>
        <input
          id="project-cat"
          type="text"
          className="form-input"
          value={category}
          placeholder="e.g. Frontend, Backend, UI/UX"
          onChange={(e) => setCategory(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label className="form-label" htmlFor="project-img">Image URL</label>
        <input
          id="project-img"
          type="text"
          className="form-input"
          value={imageUrl}
          placeholder="https://example.com/image.jpg"
          onChange={(e) => setImageUrl(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label className="form-label" htmlFor="project-tags">Tags / Tech Stack (comma separated)</label>
        <input
          id="project-tags"
          type="text"
          className="form-input"
          value={tags}
          placeholder="React, Express, Node"
          onChange={(e) => setTags(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label className="form-label" htmlFor="project-git">GitHub URL</label>
        <input
          id="project-git"
          type="text"
          className="form-input"
          value={githubUrl}
          onChange={(e) => setGithubUrl(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label className="form-label" htmlFor="project-live">Live URL</label>
        <input
          id="project-live"
          type="text"
          className="form-input"
          value={liveUrl}
          onChange={(e) => setLiveUrl(e.target.value)}
        />
      </div>
      <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <input
          id="project-feat"
          type="checkbox"
          checked={featured}
          onChange={(e) => setFeatured(e.target.checked)}
        />
        <label className="form-label" htmlFor="project-feat" style={{ marginBottom: 0 }}>Featured Project</label>
      </div>

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2rem' }}>
        <button type="button" className="btn-secondary" onClick={onCancel} style={{ padding: '0.6rem 1.2rem', borderRadius: '8px' }}>
          Cancel
        </button>
        <button type="submit" className="btn-primary" style={{ padding: '0.6rem 1.2rem', borderRadius: '8px', border: 'none' }}>
          {project ? 'Update' : 'Create'} Project
        </button>
      </div>
    </form>
  );
}
