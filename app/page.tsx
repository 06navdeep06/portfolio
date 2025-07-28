'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Head from 'next/head';
import SimplePieChart from '@/components/SimplePieChart';
import { StaggeredContainer } from '@/components/StaggeredContainer';
import { ScrollAnimation, StaggeredItem, FadeIn } from '@/components/animations/ScrollAnimation';
import ContactForm from '@/components/ContactForm';
import { FiGithub, FiExternalLink, FiStar, FiGitBranch, FiMail, FiArrowRight } from 'react-icons/fi';
import { FaInstagram } from 'react-icons/fa';
import dynamic from 'next/dynamic';

// Dynamically import with no SSR
const CherryBlossom = dynamic(() => import('@/components/CherryBlossom'), { ssr: false });
const ParallaxSection = dynamic(() => import('@/components/ParallaxSection'), { ssr: false });

// Japanese decorative elements
const SakuraBlossom = ({ className = '' }) => (
  <motion.div 
    className={`absolute text-sakura-pink/30 text-4xl ${className}`}
    initial={{ opacity: 0, y: -20 }}
    animate={{ 
      opacity: [0, 0.5, 0],
      y: [0, -100],
      x: [0, (Math.random() * 100) - 50],
      rotate: [0, Math.random() * 360]
    }}
    transition={{
      duration: 5 + Math.random() * 10,
      repeat: Infinity,
      ease: 'linear'
    }}
  >
    ❀
  </motion.div>
);

const JapanesePattern = () => (
  <div className="absolute inset-0 opacity-5 pointer-events-none">
    <div className="absolute inset-0" style={{
      backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-7c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%23ff0000\' fill-opacity=\'0.2\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")',
      backgroundSize: '200px 200px'
    }} />
  </div>
);

type Repository = {
  id: string;
  name: string;
  description: string | null;
  url: string;
  homepageUrl?: string;
  primaryLanguage: {
    name: string;
    color: string;
  } | null;
  stargazerCount: number;
  forkCount: number;
};

type GitHubResponse = {
  data?: {
    user?: {
      pinnedItems?: {
        nodes?: Repository[];
      };
    };
  };
};

const skills = [
  { name: 'JavaScript', level: 90, color: '#F7DF1E' },
  { name: 'TypeScript', level: 85, color: '#3178C6' },
  { name: 'React', level: 88, color: '#61DAFB' },
  { name: 'Next.js', level: 82, color: '#000000' },
  { name: 'Node.js', level: 80, color: '#339933' },
  { name: 'Python', level: 75, color: '#3776AB' },
  { name: 'MongoDB', level: 70, color: '#47A248' },
  { name: 'PostgreSQL', level: 72, color: '#336791' },
];

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '#about' },
    { name: 'Projects', href: '#projects' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-primary-black/90 backdrop-blur-md py-2' : 'py-4'}`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <a href="/" className="flex items-center space-x-2 group">
            <span className="text-2xl font-japanese font-bold text-primary-gold group-hover:text-primary-red transition-colors duration-300">ナブディープ</span>
            <span className="text-xl font-bold text-white hidden sm:inline-block">- Navdeep</span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-gray-300 hover:text-primary-gold transition-colors duration-200 relative group"
                data-cursor="special"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-gold transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-300 hover:text-primary-gold focus:outline-none"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div 
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-96 mt-4' : 'max-h-0'}`}
        >
          <div className="flex flex-col space-y-4 py-4">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-gray-300 hover:text-primary-gold px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};

export default function Home() {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  // Generate random sakura blossoms
  const sakuraBlossoms = Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: Math.random() * 5,
    size: Math.random() * 2 + 1,
    duration: 10 + Math.random() * 20
  }));
  const [showFallback, setShowFallback] = useState(false);
  const [lastFetched, setLastFetched] = useState<Date | null>(null);

  const fetchRepositories = useCallback(async (force = false) => {
    try {
      setLoading(true);
      setError(null);
      
      // Only fetch if we don't have data or if forced
      if (!force && repositories.length > 0) {
        setLoading(false);
        return;
      }

      console.log('Fetching pinned repositories...');
      const response = await fetch('/api/pinned-repos', {
        next: { revalidate: 3600 } // Revalidate every hour
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch repositories: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      console.log('Fetched repositories:', data);
      // Update to handle the correct response structure
      const repos = data?.data?.user?.pinnedItems?.nodes || [];
      console.log('Processed repositories:', repos);
      setRepositories(repos);
      setLastFetched(new Date());
      
    } catch (err) {
      console.error('Error fetching repositories:', err);
      setError(err instanceof Error ? err.message : 'Failed to load repositories');
      // Don't show fallback, just log the error and show empty state
    } finally {
      setLoading(false);
    }
  }, [repositories.length]);

  useEffect(() => {
    fetchRepositories();
    
    const interval = setInterval(() => {
      fetchRepositories(true);
    }, 5 * 60 * 1000); // 5 minutes
    
    return () => clearInterval(interval);
  }, [fetchRepositories]);

  // Skills data for the pie chart - Python is set to be the dominant skill
  // The values are set to make Python's percentage significantly larger than others
  const skillsData = [
    { label: 'Python', value: 90, color: 'rgba(110, 231, 255, 0.8)' },
    { label: 'JavaScript', value: 3, color: 'rgba(167, 139, 250, 0.8)' },
    { label: 'TypeScript', value: 2, color: 'rgba(244, 114, 182, 0.8)' },
    { label: 'React', value: 2, color: 'rgba(99, 102, 241, 0.8)' },
    { label: 'Node.js', value: 2, color: 'rgba(59, 130, 246, 0.8)' },
    { label: 'CSS/HTML', value: 1, color: 'rgba(139, 92, 246, 0.8)' }
  ];

  // Main component return
  return (
    <div className="min-h-screen bg-primary-black text-white">
      <Head>
        <title>Navdeep's Portfolio | Full Stack Developer</title>
        <meta name="description" content="Portfolio" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Sakura Blossoms Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <JapanesePattern />
        {sakuraBlossoms.map((blossom) => (
          <motion.div
            key={blossom.id}
            className="absolute text-sakura-pink/30 text-4xl"
            style={{
              left: blossom.left,
              top: '-50px',
              fontSize: `${blossom.size}rem`,
            }}
            animate={{
              y: [0, '100vh'],
              x: [0, (Math.random() * 200) - 100],
              rotate: [0, 360],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: blossom.duration,
              repeat: Infinity,
              delay: blossom.delay,
              ease: 'linear',
            }}
          >
            ❀
          </motion.div>
        ))}
      </div>

      {/* Navigation */}
      <Navigation />
      
      <main className="relative z-10 pt-20 md:pt-24">
        {/* Hero Section with Parallax */}
        <ParallaxSection className="min-h-screen flex items-center justify-center relative overflow-hidden" offset={30}>
          <div className="absolute inset-0 bg-gradient-to-b from-primary-black/80 to-primary-black/30 z-0" />
          
          <div className="container mx-auto px-6 z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary-gold to-primary-red">
                  信頼
                </h1>
              </motion.div>
              
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <h2 className="text-2xl md:text-4xl font-medium text-primary-gold mb-6">
                  Full Stack Developer
                </h2>
              </motion.div>
              
              <motion.p 
                className="text-lg md:text-xl text-primary-white/80 max-w-2xl mx-auto mb-8"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                Specializing in AI/ML and Full Stack Development.
              </motion.p>
              
              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <motion.a
                  href="#projects"
                  className="btn-primary inline-flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  View My Work <FiArrowRight />
                </motion.a>
                <motion.a
                  href="#contact"
                  className="btn-secondary inline-flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FiMail className="text-lg" /> Contact Me
                </motion.a>
              </motion.div>
            </motion.div>
          </div>
        </ParallaxSection>

        {/* About Section */}
        <section id="about" className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <ScrollAnimation>
              <h2 className="text-4xl md:text-5xl font-bold text-center text-white mb-16">
                About Me
              </h2>
            </ScrollAnimation>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <ScrollAnimation delay={0.2}>
                  <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
                    <h3 className="text-2xl font-bold text-primary-gold mb-4">Who I Am</h3>
                    <p className="text-gray-300 leading-relaxed mb-6">
                      I'm a passionate Full Stack Developer with expertise in modern web technologies.
                      I love building beautiful, responsive, and performant web applications that
                      provide great user experiences.
                    </p>
                    <p className="text-gray-300 leading-relaxed">
                      With a strong foundation in both frontend and backend development,
                      I enjoy turning complex problems into simple, elegant solutions.
                    </p>
                  </div>
                </ScrollAnimation>
              </div>
              
              <div className="h-full">
                <ScrollAnimation delay={0.4}>
                  <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 h-full">
                    <h3 className="text-2xl font-bold text-primary-gold mb-8 text-center">My Skills</h3>
                    <div className="h-64 md:h-80 w-full">
                      <SimplePieChart 
                        data={[
                          { label: 'Python', value: 90, color: 'rgba(55, 118, 171, 0.8)' },
                          { label: 'JavaScript', value: 10, color: 'rgba(247, 223, 30, 0.8)' },
                          { label: 'TypeScript', value: 5, color: 'rgba(49, 120, 198, 0.8)' },
                          { label: 'React', value: 5, color: 'rgba(97, 218, 251, 0.8)' },
                          { label: 'Next.js', value: 5, color: 'rgba(0, 0, 0, 0.8)' },
                          { label: 'Node.js', value: 5, color: 'rgba(51, 153, 51, 0.8)' },
                          { label: 'MongoDB', value: 5, color: 'rgba(71, 162, 72, 0.8)' },
                          { label: 'PostgreSQL', value: 5, color: 'rgba(51, 103, 145, 0.8)' },
                        ]} 
                        className="w-full h-full"
                      />
                    </div>
                  </div>
                </ScrollAnimation>
              </div>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/50">
          <div className="max-w-6xl mx-auto">
            <ScrollAnimation>
              <h2 className="text-4xl md:text-5xl font-bold text-center text-white mb-16">
                Featured Projects
              </h2>
            </ScrollAnimation>

            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-gold"></div>
                <p className="mt-4 text-gray-300">Loading projects...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-400">{error}</p>
                <button 
                  onClick={() => fetchRepositories(true)}
                  className="mt-4 px-6 py-2 bg-primary-red/10 text-primary-red border border-primary-red/30 rounded-lg hover:bg-primary-red/20 transition-colors"
                >
                  Retry
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {repositories.map((repo) => (
                  <motion.div
                    key={repo.id}
                    className="group relative bg-gray-800/80 backdrop-blur-sm rounded-2xl overflow-hidden border-2 border-gray-700 hover:border-primary-gold/70 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg hover:shadow-primary-gold/10"
                    whileHover={{ y: -5, scale: 1.02 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                  >
                    {/* Japanese pattern overlay */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                      <div className="absolute top-0 right-0 w-24 h-24 -mr-6 -mt-6 bg-primary-red/5 rounded-full"></div>
                      <div className="absolute bottom-0 left-0 w-32 h-32 -ml-12 -mb-12 bg-primary-gold/5 rounded-full"></div>
                    </div>
                    
                    {/* Project content */}
                    <div className="relative z-10 p-6 h-full flex flex-col">
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-xl font-bold text-white group-hover:text-primary-gold transition-colors duration-300">
                            {repo.name}
                          </h3>
                          <div className="flex space-x-2">
                            <a 
                              href={repo.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-gray-400 hover:text-primary-gold transition-colors duration-200 hover:scale-110 transform"
                              aria-label="View on GitHub"
                              data-cursor="special"
                            >
                              <FiGithub className="text-xl" />
                            </a>
                            {repo.homepageUrl && (
                              <a 
                                href={repo.homepageUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-primary-gold transition-colors duration-200 hover:scale-110 transform"
                                aria-label="View Live Demo"
                                data-cursor="special"
                              >
                                <FiExternalLink className="text-xl" />
                              </a>
                            )}
                          </div>
                        </div>
                        
                        <p className="text-gray-300 mb-4 mt-4">
                          {repo.description || 'No description provided.'}
                        </p>
                        
                        {repo.primaryLanguage && (
                          <div className="flex items-center text-sm text-gray-400 mb-4">
                            <span 
                              className="w-3 h-3 rounded-full mr-2 border border-white/20"
                              style={{ backgroundColor: repo.primaryLanguage.color }}
                            ></span>
                            <span className="font-medium">{repo.primaryLanguage.name}</span>
                          </div>
                        )}
                        
                        <div className="mt-auto pt-4 border-t border-gray-700/50 group-hover:border-gray-600 transition-colors duration-300">
                          <div className="flex items-center text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                            <div className="flex items-center mr-4">
                              <FiStar className="mr-1 text-yellow-400" />
                              <span>{repo.stargazerCount}</span>
                            </div>
                            <div className="flex items-center">
                              <FiGitBranch className="mr-1 text-blue-400" />
                              <span>{repo.forkCount}</span>
                            </div>
                            
                            {/* Japanese style decoration */}
                            <div className="ml-auto flex items-center">
                              <span className="text-xs font-medium bg-primary-red/10 text-primary-red px-2 py-0.5 rounded-full border border-primary-red/20">
                                Project
                              </span>
                            </div>
                          </div>
                        </div>
                      </div> {/* Close flex-1 */}
                    </div> {/* Close relative z-10 p-6 h-full flex flex-col */}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <ScrollAnimation>
              <h2 className="text-4xl md:text-5xl font-bold text-center text-white mb-16">
                Get In Touch
              </h2>
            </ScrollAnimation>

            <ScrollAnimation delay={0.2}>
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
                <div className="text-center mb-8">
                  <p className="text-lg text-gray-300 leading-relaxed">
                    I'm always interested in hearing about new opportunities and interesting projects. 
                    Whether you have a question or just want to say hi, feel free to reach out!
                  </p>
                </div>

                <ContactForm />

                <div className="mt-8 pt-8 border-t border-gray-700">
                  <div className="flex justify-center space-x-6">
                    <motion.a
                      href="https://github.com/06navdeep06"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-white transition-colors"
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      aria-label="GitHub"
                    >
                      <FiGithub className="text-2xl" />
                    </motion.a>
                    <motion.a
                      href="https://www.instagram.com/06navdeep06/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-pink-400 transition-colors"
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      aria-label="Instagram"
                    >
                      <FaInstagram className="text-2xl" />
                    </motion.a>
                    <motion.a
                      href="mailto:nepal00909@gmail.com"
                      className="text-gray-400 hover:text-blue-400 transition-colors"
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      aria-label="Email"
                    >
                      <FiMail className="text-2xl" />
                    </motion.a>
                  </div>
                </div>
              </div>
            </ScrollAnimation>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t border-gray-800">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} Navdeep. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
