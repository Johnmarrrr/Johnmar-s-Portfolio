const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/User');
const Skill = require('../models/Skill');
const Project = require('../models/Project');

// Load environment variables from backend/.env
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const MOCK_PROJECTS = [
  {
    title: 'Kabisado Educational Game',
    description: 'An interactive HTML5 educational platformer designed to make learning engaging and digital workflows accessible to students and developers.',
    category: 'Fullstack',
    imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800',
    tags: ['GDevelop', 'Pixi.js', 'HTML5', 'JavaScript'],
    githubUrl: 'https://github.com',
    liveUrl: 'https://kabisado.top/',
    featured: true
  },
  {
    title: 'Cognitive Web Engine',
    description: 'A high-performance rendering engine built with React, WebGL, and custom Web Workers to process complex visual data pipelines in real time.',
    category: 'Frontend',
    imageUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=800',
    tags: ['React', 'WebGL', 'Web Workers', 'CSS3'],
    githubUrl: 'https://github.com',
    liveUrl: 'https://google.com',
    featured: true
  },
  {
    title: 'Distributed Analytics API',
    description: 'An Express and Node microservice orchestrating sub-second query telemetry across fragmented databases, processing over 10M messages daily.',
    category: 'Backend',
    imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=800',
    tags: ['Node.js', 'Express', 'MongoDB', 'Redis'],
    githubUrl: 'https://github.com',
    liveUrl: 'https://google.com',
    featured: false
  },
  {
    title: 'Aesthetic Interface Canvas',
    description: 'A glassmorphic, micro-interactive portal exploring custom physics engines and particle interactions inside modern web layout schemas.',
    category: 'Design',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
    tags: ['JavaScript', 'HTML5', 'Vanilla CSS', 'Figma'],
    githubUrl: 'https://github.com',
    liveUrl: 'https://google.com',
    featured: false
  }
];

const MOCK_SKILLS = [
  { name: 'JavaScript / Vue.js', category: 'Frontend', level: 90 },
  { name: 'HTML5 / CSS3 / Bootstrap', category: 'Frontend', level: 95 },
  { name: 'Responsive Design & JQuery', category: 'Frontend', level: 88 },
  { name: 'Node.js & PHP', category: 'Backend', level: 85 },
  { name: 'Python & C# / .NET', category: 'Backend', level: 80 },
  { name: 'MongoDB & MySQL / Firebase', category: 'Backend', level: 87 },
  { name: 'Git & VS Code / Vite', category: 'Tools', level: 90 },
  { name: 'Figma / Canva / 3D Modelling', category: 'Tools', level: 82 },
];

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/portfolio';
    console.log(`Connecting to MongoDB at: ${mongoUri}...`);
    await mongoose.connect(mongoUri);
    console.log('Database connected successfully.');

    // 1. Seed admin user
    const username = process.env.ADMIN_USERNAME || 'admin';
    const password = process.env.ADMIN_PASSWORD || 'admin123';
    
    console.log('Seeding administrative user...');
    await User.deleteMany({});
    const adminUser = new User({ username, password });
    await adminUser.save();
    console.log(`Admin user seeded: Username = "${username}", Password = "${password}"`);

    // 2. Seed skills
    console.log('Seeding skills database...');
    await Skill.deleteMany({});
    await Skill.insertMany(MOCK_SKILLS);
    console.log(`Successfully seeded ${MOCK_SKILLS.length} skills.`);

    // 3. Seed projects
    console.log('Seeding projects database...');
    await Project.deleteMany({});
    await Project.insertMany(MOCK_PROJECTS);
    console.log(`Successfully seeded ${MOCK_PROJECTS.length} projects.`);

    console.log('Seeding operation completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from database.');
    process.exit(0);
  }
};

seedDatabase();
