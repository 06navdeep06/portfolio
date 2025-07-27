'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiGithub, FiLinkedin, FiMail, FiExternalLink, FiStar, FiGitBranch } from 'react-icons/fi';
import { FaInstagram } from 'react-icons/fa';
import ContactForm from '@/components/ContactForm';
import { ScrollAnimation, FadeIn, StaggeredContainer, StaggeredItem } from '@/components/animations/ScrollAnimation';

interface Repository {
  id: string;
  name: string;
  description: string;
  url: string;
  primaryLanguage?: {
    name: string;
    color: string;
  };
  stargazerCount: number;
  forkCount: number;
}

interface GitHubResponse {
  data: {
    user: {
      pinnedItems: {
        nodes: Repository[];
      };
    };
  };
}

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

export default function Home() {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRepositories = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/github');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data: GitHubResponse = await response.json();
        
        if (data.data?.user?.pinnedItems?.nodes) {
          setRepositories(data.data.user.pinnedItems.nodes);
        } else {
          // Fallback data if API fails
          setRepositories([
            {
              id: '1',
              name: 'portfolio',
              description: 'My personal portfolio website built with Next.js and TypeScript',
              url: 'https://github.com/06navdeep06/portfolio',
              primaryLanguage: { name: 'TypeScript', color: '#3178C6' },
              stargazerCount: 5,
              forkCount: 2
            },
            {
              id: '2',
              name: 'react-todo-app',
              description: 'A modern todo application built with React and local storage',
              url: 'https://github.com/06navdeep06/react-todo-app',
              primaryLanguage: { name: 'JavaScript', color: '#F7DF1E' },
              stargazerCount: 3,
              forkCount: 1
            }
          ]);
        }
      } catch (err) {
        console.error('Error fetching repositories:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch repositories');
        // Set fallback data on error
        setRepositories([
          {
            id: '1',
            name: 'portfolio',
            description: 'My personal portfolio website built with Next.js and TypeScript',
            url: 'https://github.com/06navdeep06/portfolio',
            primaryLanguage: { name: 'TypeScript', color: '#3178C6' },
            stargazerCount: 5,
            forkCount: 2
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchRepositories();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <FadeIn>
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="mb-8"
            >
              <div className="w-32 h-32 mx-auto mb-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 p-1">
                <div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center">
                  <span className="text-4xl font-bold text-white">N</span>
                </div>
              </div>
            </motion.div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Hi, I'm{' '}
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Navdeep
              </span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.4}>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
              Full Stack Developer passionate about creating beautiful, functional web applications
            </p>
          </FadeIn>

          <FadeIn delay={0.6}>
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <motion.a
                href="https://github.com/06navdeep06"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-all duration-300 hover:scale-105"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiGithub className="text-xl" />
                GitHub
              </motion.a>
              <motion.a
                href="https://www.instagram.com/06navdeep06/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-lg transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaInstagram className="text-xl" />
                Instagram
              </motion.a>
              <motion.a
                href="mailto:nepal00909@gmail.com"
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiMail className="text-xl" />
                Contact Me
              </motion.a>
            </div>
          </FadeIn>

          <FadeIn delay={0.8}>
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="text-gray-400"
            >
              <div className="w-6 h-10 border-2 border-gray-400 rounded-full mx-auto flex justify-center">
                <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-pulse"></div>
              </div>
              <p className="mt-2 text-sm">Scroll to explore</p>
            </motion.div>
          </FadeIn>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <ScrollAnimation>
            <h2 className="text-4xl md:text-5xl font-bold text-center text-white mb-16">
              About Me
            </h2>
          </ScrollAnimation>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <ScrollAnimation direction="left">
              <div className="space-y-6">
                <p className="text-lg text-gray-300 leading-relaxed">
                  I'm a passionate full-stack developer with a love for creating innovative web solutions. 
                  With expertise in modern JavaScript frameworks and backend technologies, I enjoy turning 
                  complex problems into simple, beautiful designs.
                </p>
                <p className="text-lg text-gray-300 leading-relaxed">
                  When I'm not coding, you can find me exploring new technologies, contributing to open-source 
                  projects, or sharing my knowledge with the developer community.
                </p>
                <div className="flex flex-wrap gap-3">
                  {['React', 'Next.js', 'TypeScript', 'Node.js', 'MongoDB', 'PostgreSQL'].map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-gray-800 text-blue-400 rounded-full text-sm font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </ScrollAnimation>

            <ScrollAnimation direction="right">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
                <h3 className="text-2xl font-bold text-white mb-6">Skills & Expertise</h3>
                <div className="space-y-4">
                  {skills.map((skill) => (
                    <div key={skill.name} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300 font-medium">{skill.name}</span>
                        <span className="text-gray-400 text-sm">{skill.level}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <motion.div
                          className="h-2 rounded-full"
                          style={{ backgroundColor: skill.color }}
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: 0.2 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-800/30">
        <div className="max-w-6xl mx-auto">
          <ScrollAnimation>
            <h2 className="text-4xl md:text-5xl font-bold text-center text-white mb-16">
              Featured Projects
            </h2>
          </ScrollAnimation>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-red-400 mb-4">Error loading projects: {error}</p>
              <p className="text-gray-400">Showing fallback projects below</p>
            </div>
          ) : null}

          <StaggeredContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {repositories.map((repo) => (
              <StaggeredItem key={repo.id}>
                <motion.div
                  className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-blue-500/50 transition-all duration-300 group"
                  whileHover={{ y: -5, scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                      {repo.name}
                    </h3>
                    <motion.a
                      href={repo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-white transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <FiExternalLink className="text-lg" />
                    </motion.a>
                  </div>

                  <p className="text-gray-300 mb-4 line-clamp-3">
                    {repo.description || 'No description available'}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      {repo.primaryLanguage && (
                        <div className="flex items-center gap-1">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: repo.primaryLanguage.color }}
                          />
                          <span>{repo.primaryLanguage.name}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <FiStar className="text-xs" />
                        <span>{repo.stargazerCount}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FiGitBranch className="text-xs" />
                        <span>{repo.forkCount}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </StaggeredItem>
            ))}
          </StaggeredContainer>

          <ScrollAnimation delay={0.4}>
            <div className="text-center mt-12">
              <motion.a
                href="https://github.com/06navdeep06"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiGithub className="text-lg" />
                View All Projects
              </motion.a>
            </div>
          </ScrollAnimation>
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
                  >
                    <FaInstagram className="text-2xl" />
                  </motion.a>
                  <motion.a
                    href="mailto:nepal00909@gmail.com"
                    className="text-gray-400 hover:text-blue-400 transition-colors"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <FiMail className="text-2xl" />
                  </motion.a>
                </div>
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t border-gray-800">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-400">
            © 2024 Navdeep. Built with Next.js and Tailwind CSS.
          </p>
        </div>
      </footer>
    </div>
  );
}