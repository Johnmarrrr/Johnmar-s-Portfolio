import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ArrowRight, Send, Mail, MapPin, Phone, Code2, Database, Wrench } from 'lucide-react';
import ProjectCard from '../components/ProjectCard';

// Fallback Mock Data
const MOCK_PROJECTS = [
  {
    _id: 'mock1',
    title: 'Cognitive Web Engine',
    description: 'A high-performance rendering engine built with React, WebGL, and custom Web Workers to process complex visual data pipelines in real time.',
    category: 'Frontend',
    imageUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=800',
    tags: ['React', 'WebGL', 'Web Workers', 'CSS3'],
    githubUrl: 'https://github.com',
    liveUrl: 'https://google.com',
  },
  {
    _id: 'mock2',
    title: 'Distributed Analytics API',
    description: 'An Express and Node microservice orchestrating sub-second query telemetry across fragmented databases, processing over 10M messages daily.',
    category: 'Backend',
    imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=800',
    tags: ['Node.js', 'Express', 'MongoDB', 'Redis'],
    githubUrl: 'https://github.com',
    liveUrl: 'https://google.com',
  },
  {
    _id: 'mock3',
    title: 'Aesthetic Interface Canvas',
    description: 'A glassmorphic, micro-interactive portal exploring custom physics engines and particle interactions inside modern web layout schemas.',
    category: 'Design',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
    tags: ['JavaScript', 'HTML5', 'Vanilla CSS', 'Figma'],
    githubUrl: 'https://github.com',
    liveUrl: 'https://google.com',
  }
];

const MOCK_SKILLS = [
  { _id: 's1', name: 'JavaScript / Vue.js', category: 'Frontend', level: 90 },
  { _id: 's2', name: 'HTML5 / CSS3 / Bootstrap', category: 'Frontend', level: 95 },
  { _id: 's3', name: 'Responsive Design & JQuery', category: 'Frontend', level: 88 },
  { _id: 's4', name: 'Node.js & PHP', category: 'Backend', level: 85 },
  { _id: 's5', name: 'Python & C# / .NET', category: 'Backend', level: 80 },
  { _id: 's6', name: 'MongoDB & MySQL / Firebase', category: 'Backend', level: 87 },
  { _id: 's7', name: 'Git & VS Code / Vite', category: 'Tools', level: 90 },
  { _id: 's8', name: 'Figma / Canva / 3D Modelling', category: 'Tools', level: 82 },
];

const TIMELINE = [
  {
    date: '2024 - PRESENT',
    title: 'JavaScript & Java Developer',
    company: 'Freelance / Open Source',
    desc: 'Contributed to developing JavaScript libraries and enhancing framework functionalities.'
  },
  {
    date: '2023 - 2025',
    title: 'Freelance Developer',
    company: 'Self-Employed',
    desc: 'Assisted in building and optimizing user interfaces with a focus on responsive and interactive designs.'
  },
  {
    date: '2023 - 2024',
    title: 'Beginner Developer (Vb.net & C#)',
    company: 'School Projects',
    desc: 'Worked on developing and customizing desktop applications for school purposes.'
  }
];

const EDUCATION = [
  {
    date: '2022 - PRESENT',
    title: 'BS in Computer Science',
    school: 'Kolehiyo ng Lungsod ng Lipa (KLL)',
    desc: 'Pursuing a degree in Computer Science, focusing on programming, algorithms, and software development principles.',
    achievements: ['GPA: 1.685', 'Specialization: Programming, Hardware, Logic, Algorithms']
  },
  {
    date: '2020 - 2022',
    title: 'Higher Secondary Certificate (HSC)',
    school: 'Lipa City Senior High School',
    desc: 'Developed strong analytical and critical thinking skills through comprehensive study of Accountancy, Business, and Management.',
    achievements: ['GPA: 96', 'Key Subjects: Philosophy, Literature, Social Studies, Economics, History']
  },
  {
    date: '2016 - 2020',
    title: 'Secondary School Certificate (SSC)',
    school: 'Lipa City National High School',
    desc: 'Focused on core math subjects, developing strong problem-solving and analytical skills.',
    achievements: ['GPA: 91', 'Key Subjects: Mathematics, Science, English, History']
  }
];

export default function Home() {
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [filter, setFilter] = useState('All');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const location = useLocation();

  useEffect(() => {
    // Fetch Projects
    const fetchProjects = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/projects');
        if (res.ok) {
          const data = await res.json();
          setProjects(data.length > 0 ? data : MOCK_PROJECTS);
        } else {
          setProjects(MOCK_PROJECTS);
        }
      } catch (err) {
        setProjects(MOCK_PROJECTS);
      }
    };

    // Fetch Skills
    const fetchSkills = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/skills');
        if (res.ok) {
          const data = await res.json();
          setSkills(data.length > 0 ? data : MOCK_SKILLS);
        } else {
          setSkills(MOCK_SKILLS);
        }
      } catch (err) {
        setSkills(MOCK_SKILLS);
      }
    };

    fetchProjects();
    fetchSkills();
  }, []);

  useEffect(() => {
    // Handle scrolling if navigated from another page
    if (location.state && location.state.scrollTo) {
      const element = document.getElementById(location.state.scrollTo);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [location]);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMsg({ type: '', text: '' });

    try {
      const res = await fetch('http://localhost:5000/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, subject, message }),
      });

      if (res.ok) {
        setStatusMsg({ type: 'success', text: 'Thank you! Your message has been received successfully.' });
        setName('');
        setEmail('');
        setSubject('');
        setMessage('');
      } else {
        const data = await res.json();
        setStatusMsg({ type: 'error', text: data.message || 'Something went wrong. Please try again.' });
      }
    } catch (err) {
      setStatusMsg({ type: 'error', text: 'Server is currently unreachable. Please try again later.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = ['All', ...new Set(projects.map(p => p.category))];
  const filteredProjects = filter === 'All'
    ? projects
    : projects.filter(p => p.category === filter);

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section id="hero" className="hero">
        <div className="container">
          <div className="hero-grid">
            <div className="hero-content">
              <span className="hero-tag">WELCOME TO MY UNIVERSE</span>
              <span className="hero-tag" style={{ marginLeft: '0.5rem', background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.2)', color: '#10b981' }}>AVAILABLE FOR HIRE</span>
              <p style={{ fontSize: '1.25rem', color: 'var(--primary-color)', fontWeight: '600', marginBottom: '0.5rem' }}>Hello</p>
              <h1 className="hero-title" style={{ marginBottom: '1rem' }}>
                I'm <span className="gradient-text">Johnmar Cordeño</span>
              </h1>
              <h2 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '1rem', color: '#e2e8f0' }}>
                JavaScript Developer & Creator of Kabisado
              </h2>
              <p style={{ fontSize: '1.05rem', color: '#a7f3d0', fontWeight: '500', marginBottom: '1.5rem', fontStyle: 'italic' }}>
                JavaScript lover 🚀 | Kabisado creator 🔧 | Python Enjoyer and coding the future 💻✨
              </p>
              <p className="hero-desc" style={{ fontSize: '1.05rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                Hello! I'm Johnmar Cordeño, a passionate JavaScript developer specializing in creating innovative web solutions and user-friendly interfaces. As the creator of the Kabisado Educational Game, I'm dedicated to simplifying development workflows.
              </p>
              <p className="hero-desc" style={{ fontSize: '1.05rem', lineHeight: '1.6', marginBottom: '2rem' }}>
                My focus is on making web development faster, easier, and accessible to all developers. Currently, I'm expanding into backend development to grow as a full-stack developer and create seamless, robust web applications.
              </p>
              <div className="hero-buttons">
                <a href="#projects" className="btn-primary">
                  Learn More <ArrowRight size={18} />
                </a>
                <a href="#contact" className="btn-secondary">
                  Get Resume
                </a>
              </div>
            </div>

            <div className="hero-visual">
              <div className="hero-image-container">
                <img src="/hero/hero.png" alt="Johnmar Cordeño" onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400';
                }} />
              </div>

              <div className="code-window">
                <div className="code-header">
                  <div className="code-dots">
                    <span className="code-dot red"></span>
                    <span className="code-dot yellow"></span>
                    <span className="code-dot green"></span>
                  </div>
                  <span className="code-tab">profile.js</span>
                </div>
                <div className="code-content">
                  <div><span className="code-keyword">const</span> <span className="code-variable">profile</span> = &#123;</div>
                  <div>  name: <span className="code-string">'Johnmar Cordeño'</span>,</div>
                  <div>  title: <span className="code-string">'Full-Stack Developer | Problem Solver'</span>,</div>
                  <div>  skills: [</div>
                  <div>    <span className="code-string">'React'</span>, <span className="code-string">'NextJS'</span>, <span className="code-string">'Java'</span>, <span className="code-string">'Express'</span>,</div>
                  <div>    <span className="code-string">'MySQL'</span>, <span className="code-string">'MongoDB'</span>, <span className="code-string">'Docker'</span>, <span className="code-string">'AWS'</span>,</div>
                  <div>    <span className="code-string">'TypeScript'</span>, <span className="code-string">'Git'</span>, <span className="code-string">'C#'</span>, <span className="code-string">'Gdevelop'</span></div>
                  <div>  ],</div>
                  <div>  hardWorker: <span className="code-boolean">true</span>,</div>
                  <div>  quickLearner: <span className="code-boolean">true</span>,</div>
                  <div>  problemSolver: <span className="code-boolean">true</span>,</div>
                  <div>  yearsOfExperience: <span className="code-number">4</span>,</div>
                  <div>  <span className="code-method">hireable</span>: <span className="code-keyword">function</span>() &#123;</div>
                  <div>    <span className="code-keyword">return</span> (</div>
                  <div>      <span className="code-variable">this</span>.hardWorker &&</div>
                  <div>      <span className="code-variable">this</span>.problemSolver &&</div>
                  <div>      <span className="code-variable">this</span>.skills.length &gt;= <span className="code-number">5</span> &&</div>
                  <div>      <span className="code-variable">this</span>.yearsOfExperience &gt;= <span className="code-number">3</span></div>
                  <div>    );</div>
                  <div>  &#125;</div>
                  <div>&#125;;</div>
                  <div className="code-result">
                    <span className="code-result-label">// Interactive Check</span>
                    <span className="code-result-val">
                      profile.hireable() =&gt; true ✅
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Selected Creations</h2>
            <p className="section-subtitle">A curated preview of web architectures, system APIs, and interfaces.</p>
          </div>

          <div className="filter-tabs">
            {categories.map((cat, idx) => (
              <button
                key={idx}
                className={`filter-tab ${filter === cat ? 'active' : ''}`}
                onClick={() => setFilter(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="projects-grid">
            {filteredProjects.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Technical Matrix</h2>
            <p className="section-subtitle">Proficiencies and core libraries supporting my full-stack workflow.</p>
          </div>

          <div className="skills-container">
            {/* Frontend */}
            <div className="skills-category-card glow-card">
              <h3 className="skills-category-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Code2 size={20} className="gradient-text" /> Frontend
              </h3>
              {skills.filter(s => s.category === 'Frontend').map(skill => (
                <div key={skill._id} className="skill-item">
                  <div className="skill-info">
                    <span className="skill-name">{skill.name}</span>
                    <span className="skill-percentage">{skill.level}%</span>
                  </div>
                  <div className="skill-bar-bg">
                    <div className="skill-bar-fill" style={{ width: `${skill.level}%` }}></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Backend */}
            <div className="skills-category-card glow-card">
              <h3 className="skills-category-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Database size={20} className="gradient-text" /> Backend
              </h3>
              {skills.filter(s => s.category === 'Backend').map(skill => (
                <div key={skill._id} className="skill-item">
                  <div className="skill-info">
                    <span className="skill-name">{skill.name}</span>
                    <span className="skill-percentage">{skill.level}%</span>
                  </div>
                  <div className="skill-bar-bg">
                    <div className="skill-bar-fill" style={{ width: `${skill.level}%` }}></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Tools & Workflow */}
            <div className="skills-category-card glow-card">
              <h3 className="skills-category-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Wrench size={20} className="gradient-text" /> Tools & Workflow
              </h3>
              {skills.filter(s => s.category !== 'Frontend' && s.category !== 'Backend').map(skill => (
                <div key={skill._id} className="skill-item">
                  <div className="skill-info">
                    <span className="skill-name">{skill.name}</span>
                    <span className="skill-percentage">{skill.level}%</span>
                  </div>
                  <div className="skill-bar-bg">
                    <div className="skill-bar-fill" style={{ width: `${skill.level}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Journey Section */}
      <section id="experience">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">My Journey</h2>
            <p className="section-subtitle">A chronological record of my professional experience and academic background.</p>
          </div>

          <div className="journey-grid">
            {/* Experience */}
            <div className="journey-column">
              <h3 className="journey-column-title">Work Experience</h3>
              <div className="timeline">
                {TIMELINE.map((item, idx) => (
                  <div key={idx} className="timeline-item">
                    <div className="timeline-dot"></div>
                    <div className="timeline-date">{item.date}</div>
                    <h3 className="timeline-title">{item.title}</h3>
                    <div className="timeline-company">{item.company}</div>
                    <p className="timeline-desc">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Education */}
            <div className="journey-column">
              <h3 className="journey-column-title">Education</h3>
              <div className="timeline">
                {EDUCATION.map((item, idx) => (
                  <div key={idx} className="timeline-item">
                    <div className="timeline-dot"></div>
                    <div className="timeline-date">{item.date}</div>
                    <h3 className="timeline-title">{item.title}</h3>
                    <div className="timeline-company">{item.school}</div>
                    <p className="timeline-desc">{item.desc}</p>
                    {item.achievements && item.achievements.length > 0 && (
                      <div className="timeline-achievements">
                        <strong>Key Achievements:</strong>
                        <ul>
                          {item.achievements.map((ach, aIdx) => (
                            <li key={aIdx}>{ach}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact">
        <div className="container">
          <div className="contact-grid">
            <div className="contact-info">
              <div>
                <h2 className="contact-info-title">Let's create something extraordinary.</h2>
                <p className="contact-info-desc">
                  Have an exciting project, full-time opening, or general inquiry? Drop me a message and I'll respond within 24 hours.
                </p>
              </div>

              <div className="contact-details">
                <div className="contact-detail-item">
                  <div className="contact-icon-wrapper">
                    <Mail size={20} />
                  </div>
                  <div className="contact-detail-content">
                    <span className="contact-detail-label">Email</span>
                    <span className="contact-detail-value">johnmarcordeno@gmail.com</span>
                  </div>
                </div>

                <div className="contact-detail-item">
                  <div className="contact-icon-wrapper">
                    <MapPin size={20} />
                  </div>
                  <div className="contact-detail-content">
                    <span className="contact-detail-label">Location</span>
                    <span className="contact-detail-value">Lipa City, Batangas, Philippines</span>
                  </div>
                </div>

                <div className="contact-detail-item">
                  <div className="contact-icon-wrapper">
                    <Phone size={20} />
                  </div>
                  <div className="contact-detail-content">
                    <span className="contact-detail-label">Availability</span>
                    <span className="contact-detail-value">Open to Freelance & Full-Time</span>
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={handleContactSubmit} className="contact-form glow-card">
              {statusMsg.text && (
                <div className={`alert alert-${statusMsg.type}`}>
                  {statusMsg.text}
                </div>
              )}

              <div className="form-group">
                <label className="form-label" htmlFor="user-name">Name</label>
                <input
                  id="user-name"
                  type="text"
                  className="form-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="user-email">Email</label>
                <input
                  id="user-email"
                  type="email"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="user-subject">Subject</label>
                <input
                  id="user-subject"
                  type="text"
                  className="form-input"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="user-msg">Message</label>
                <textarea
                  id="user-msg"
                  className="form-input"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center', cursor: isSubmitting ? 'not-allowed' : 'pointer', border: 'none', fontFamily: 'inherit' }}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'} <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
