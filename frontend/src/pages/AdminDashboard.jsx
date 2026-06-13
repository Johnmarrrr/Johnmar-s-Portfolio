import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Plus, Edit3, Trash2, X } from 'lucide-react';
import ProjectForm from '../components/Admin/ProjectForm';
import MessageList from '../components/Admin/MessageList';

export default function AdminDashboard() {
  const { token, user, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('projects');
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState(null); // For editing

  // Skills state
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState('Frontend');
  const [newSkillLevel, setNewSkillLevel] = useState(80);
  const [skillsError, setSkillsError] = useState('');

  const fetchProjects = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/projects');
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSkills = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/skills');
      if (res.ok) {
        const data = await res.json();
        setSkills(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!loading && !user) {
      navigate('/admin/login');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (token) {
      fetchProjects();
      fetchSkills();
    }
  }, [token]);

  const handleDeleteProject = async (id) => {
    if (!window.confirm('Delete this project?')) return;

    try {
      const res = await fetch(`http://localhost:5000/api/projects/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setProjects(projects.filter((p) => p._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddSkill = async (e) => {
    e.preventDefault();
    setSkillsError('');

    try {
      const res = await fetch('http://localhost:5000/api/skills', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newSkillName,
          category: newSkillCategory,
          level: newSkillLevel,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSkills([...skills, data]);
        setNewSkillName('');
        setNewSkillLevel(80);
      } else {
        setSkillsError(data.message || 'Failed to add skill');
      }
    } catch (err) {
      setSkillsError('Network connection error');
    }
  };

  const handleDeleteSkill = async (id) => {
    if (!window.confirm('Delete this skill?')) return;

    try {
      const res = await fetch(`http://localhost:5000/api/skills/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setSkills(skills.filter((s) => s._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading || !user) {
    return <div className="container" style={{ paddingTop: '120px', color: 'var(--text-secondary)' }}>Verifying credentials...</div>;
  }

  return (
    <div className="admin-dashboard-container">
      <div className="container">
        <div className="admin-header">
          <div>
            <h1 style={{ fontSize: '2.25rem', fontWeight: 800, margin: 0 }}>
              Dashboard
            </h1>
            <p style={{ color: 'var(--text-secondary)', margin: '0.25rem 0 0 0' }}>
              Welcome back, <span className="gradient-text" style={{ fontWeight: 600 }}>{user.username}</span>.
            </p>
          </div>
        </div>

        <div className="admin-tabs">
          <button
            className={`admin-tab ${activeTab === 'projects' ? 'active' : ''}`}
            onClick={() => setActiveTab('projects')}
          >
            Projects
          </button>
          <button
            className={`admin-tab ${activeTab === 'skills' ? 'active' : ''}`}
            onClick={() => setActiveTab('skills')}
          >
            Skills
          </button>
          <button
            className={`admin-tab ${activeTab === 'messages' ? 'active' : ''}`}
            onClick={() => setActiveTab('messages')}
          >
            Messages
          </button>
        </div>

        {/* PROJECTS TAB */}
        {activeTab === 'projects' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Manage Projects</h3>
              <button
                className="btn-primary"
                style={{ padding: '0.6rem 1.2rem', borderRadius: '8px', border: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                onClick={() => {
                  setCurrentProject(null);
                  setIsProjectModalOpen(true);
                }}
              >
                <Plus size={18} /> Add Project
              </button>
            </div>

            {projects.length === 0 ? (
              <div style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '3rem' }}>
                No projects found. Add your first creation!
              </div>
            ) : (
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Category</th>
                      <th>Featured</th>
                      <th>Tags</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map((project) => (
                      <tr key={project._id}>
                        <td style={{ fontWeight: 600 }}>{project.title}</td>
                        <td>{project.category}</td>
                        <td>{project.featured ? 'Yes' : 'No'}</td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                            {project.tags.map((t, i) => (
                              <span key={i} className="project-tag" style={{ fontSize: '0.75rem' }}>{t}</span>
                            ))}
                          </div>
                        </td>
                        <td>
                          <div className="admin-btn-group">
                            <button
                              className="admin-btn-edit"
                              style={{ border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                              onClick={() => {
                                setCurrentProject(project);
                                setIsProjectModalOpen(true);
                              }}
                            >
                              <Edit3 size={16} />
                            </button>
                            <button
                              className="admin-btn-delete"
                              style={{ border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                              onClick={() => handleDeleteProject(project._id)}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* SKILLS TAB */}
        {activeTab === 'skills' && (
          <div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '2rem' }}>Manage Skills</h3>

            <div className="admin-skills-grid">
              {/* Add Skill Form */}
              <form onSubmit={handleAddSkill} className="glow-card" style={{ padding: '2rem' }}>
                <h4 style={{ fontWeight: 700, marginBottom: '1.5rem' }}>Add New Skill</h4>
                {skillsError && <div className="alert alert-error">{skillsError}</div>}

                <div className="form-group">
                  <label className="form-label" htmlFor="skill-name">Skill Name</label>
                  <input
                    id="skill-name"
                    type="text"
                    className="form-input"
                    value={newSkillName}
                    onChange={(e) => setNewSkillName(e.target.value)}
                    placeholder="e.g. React, Node, WebGL"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="skill-cat">Category</label>
                  <select
                    id="skill-cat"
                    className="form-input"
                    value={newSkillCategory}
                    onChange={(e) => setNewSkillCategory(e.target.value)}
                    style={{ background: 'var(--bg-color)', border: '1px solid var(--card-border)' }}
                  >
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                    <option value="Tools">Tools</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="skill-lvl">Proficiency Level ({newSkillLevel}%)</label>
                  <input
                    id="skill-lvl"
                    type="range"
                    min="0"
                    max="100"
                    className="form-input"
                    style={{ padding: 0 }}
                    value={newSkillLevel}
                    onChange={(e) => setNewSkillLevel(Number(e.target.value))}
                  />
                </div>

                <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', border: 'none', fontFamily: 'inherit' }}>
                  <Plus size={16} /> Add Skill
                </button>
              </form>

              {/* Skills List */}
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Category</th>
                      <th>Level</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {skills.map((skill) => (
                      <tr key={skill._id}>
                        <td style={{ fontWeight: 600 }}>{skill.name}</td>
                        <td>{skill.category}</td>
                        <td>{skill.level}%</td>
                        <td>
                          <button
                            className="admin-btn-delete"
                            style={{ border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            onClick={() => handleDeleteSkill(skill._id)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* MESSAGES TAB */}
        {activeTab === 'messages' && (
          <MessageList token={token} />
        )}
      </div>

      {/* PROJECT MODAL */}
      {isProjectModalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal glow-card">
            <div className="modal-header">
              <h3 className="modal-title">{currentProject ? 'Edit Project' : 'New Project'}</h3>
              <button className="modal-close" onClick={() => setIsProjectModalOpen(false)}>
                <X size={24} />
              </button>
            </div>
            <ProjectForm
              project={currentProject}
              token={token}
              onSuccess={() => {
                setIsProjectModalOpen(false);
                fetchProjects();
              }}
              onCancel={() => setIsProjectModalOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
