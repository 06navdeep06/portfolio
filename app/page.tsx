'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { FaGithub, FaInstagram, FaEnvelope, FaStar, FaCodeBranch, FaArrowDown } from 'react-icons/fa';
import { 
  Chart as ChartJS, 
  registerables, 
  ArcElement, 
  Tooltip, 
  Legend, 
  DoughnutController, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Filler,
  type Chart,
  type ChartOptions,
  type Plugin
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import type { DoughnutChartData, DoughnutChartOptions, ChartPlugin } from '@/types/chartjs';

import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { FadeIn, StaggeredContainer, StaggeredItem } from '../components/animations/ScrollAnimation';

// Register Chart.js components with all necessary plugins
ChartJS.register(
  ...registerables,
  ArcElement,
  Tooltip,
  Legend,
  DoughnutController,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Filler,
  ChartDataLabels
);

// Define our custom chart options type that extends Chart.js options
type CustomDoughnutChartOptions = Omit<ChartOptions<'doughnut'>, 'plugins'> & {
  cutout?: string | number;
  radius?: string | number;
  plugins?: {
    legend?: {
      display?: boolean;
      position?: 'top' | 'left' | 'right' | 'bottom' | 'chartArea' | 'center';
      labels?: {
        color?: string;
        font?: {
          size?: number;
          weight?: string | number;
          family?: string;
        };
        padding?: number;
        usePointStyle?: boolean;
        pointStyle?: string | CanvasImageSource;
        boxWidth?: number;
        boxHeight?: number;
        generateLabels?: (chart: ChartJS) => Array<{
          text: string;
          fillStyle: string;
          strokeStyle: string;
          lineWidth: number;
          hidden: boolean;
          index: number;
        }>;
      };
      onClick?: (e: MouseEvent, legendItem: any, legend: any) => void;
    };
    tooltip?: {
      enabled?: boolean;
      backgroundColor?: string;
      titleColor?: string;
      bodyColor?: string;
      bodyFont?: {
        size?: number;
        weight?: string | number;
        family?: string;
      };
      padding?: number;
      displayColors?: boolean;
      usePointStyle?: boolean;
      callbacks?: {
        label?: (context: any) => string | string[];
      };
    };
    datalabels?: {
      formatter?: (value: number, context: any) => string | null;
      color?: string | ((context: any) => string);
      font?: {
        weight?: string | number | ((context: any) => string | number);
        size?: number | ((context: any) => number);
        family?: string | ((context: any) => string);
      };
      textAlign?: CanvasTextAlign | ((context: any) => CanvasTextAlign);
      textStrokeColor?: string | ((context: any) => string);
      textStrokeWidth?: number | ((context: any) => number);
      textShadowBlur?: number | ((context: any) => number);
      textShadowColor?: string | ((context: any) => string);
      display?: boolean | ((context: any) => boolean);
    };
  };
      arc?: {
        borderWidth?: number;
      borderColor?: string;
      backgroundColor?: string;
    };
  // Remove the extra closing brace on this line
  animation?: {
    animateRotate?: boolean;
    animateScale?: boolean;
  };
  circumference?: number;
  rotation?: number;
  onHover?: (event: MouseEvent, elements: any[], chart: ChartJS) => void;
  onClick?: (event: MouseEvent, elements: any[], chart: ChartJS) => void;
  elements?: {
    arc?: {
      borderWidth?: number;
      borderColor?: string;
      backgroundColor?: string;
    }
  }
};    

// Define the 3D effect plugin
const threeDEffectPlugin = {
  id: '3d',
  beforeDraw: function(chart: ChartJS) {
    const { ctx, chartArea } = chart;
    if (!chartArea) return;
    
    const { top, bottom, left, right, width, height } = chartArea;
    
    // Draw 3D shadow effect
    const centerX = (left + right) / 2;
    const centerY = (top + bottom) / 2;
    const r = Math.min(width, height) * 0.4;
    
    // Shadow gradient
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, r);
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0.1)');
    gradient.addColorStop(0.7, 'rgba(0, 0, 0, 0)');
    
    ctx.save();
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY + 10, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
};

// Define the center text plugin
const centerTextPlugin = {
  id: 'centerText',
  afterDraw: function(chart: ChartJS) {
    const { ctx, chartArea } = chart;
    if (!chartArea) return;
    
    const { top, bottom, left, right } = chartArea;
    const centerX = (left + right) / 2;
    const centerY = (top + bottom) / 2;
    
    // Draw center text
    ctx.save();
    ctx.font = 'bold 16px Arial';
    ctx.fillStyle = '#4B5563';
    ctx.textAlign = 'center' as CanvasTextAlign;
    ctx.textBaseline = 'middle' as CanvasTextBaseline;
    ctx.fillText('Code', centerX, centerY - 10);
    ctx.font = '14px Arial';
    ctx.fillText('Distribution', centerX, centerY + 10);
    ctx.restore();
  }
};

// Inner glow plugin
const innerGlowPlugin = {
  id: 'innerGlow',
  beforeDraw: function(chart: ChartJS) {
    const { ctx, chartArea } = chart;
    if (!chartArea) return;
    
    const { top, bottom, left, right } = chartArea;
    const centerX = (left + right) / 2;
    const centerY = (top + bottom) / 2;
    const r = Math.min(chartArea.width, chartArea.height) * 0.4 * 0.7; // 70% of the chart radius
    
    // Draw inner glow
    ctx.save();
    ctx.shadowColor = 'rgba(255, 255, 255, 0.3)';
    ctx.shadowBlur = 20;
    ctx.shadowOffsetX = -5;
    ctx.shadowOffsetY = 5;
    ctx.beginPath();
    ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.fill();
    ctx.restore();
  }
};

const customPlugins: Plugin<'doughnut'>[] = [
  threeDEffectPlugin,
  centerTextPlugin,
  innerGlowPlugin
];

// Register custom plugins
function registerCustomPlugins() {
  customPlugins.forEach(plugin => {
    if (!ChartJS.registry.plugins.get(plugin.id)) {
      ChartJS.register({
        id: plugin.id,
        beforeDraw: plugin.beforeDraw,
        afterDraw: plugin.afterDraw
      });
    }
  });
}

registerCustomPlugins();

export default function Home() {
  // State hooks
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [repos, setRepos] = useState<any[]>([]);
  const [languages, setLanguages] = useState<{[key: string]: number}>({});
  const [loadingRepos, setLoadingRepos] = useState(false);
  const [errorRepos, setErrorRepos] = useState<string | null>(null);
  
  // Animation hooks - moved to top level to ensure consistent hook ordering
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.4], [1, 0.5, 0]);
  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };
  const ySpring = useSpring(y, springConfig);
  
  // Check authentication status on component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/status');
        if (response.ok) {
          const data = await response.json();
          setIsAuthenticated(data.authenticated || false);
        }
        setLoading(false);
      } catch (err) {
        console.error('Error checking auth status:', err);
        setError('Failed to check authentication status');
        setLoading(false);
      }
    };
    
    checkAuth();

    // Fetch pinned repositories using our API route
    const fetchPinnedRepos = async () => {
      setLoadingRepos(true);
      setErrorRepos(null);
      
      try {
        console.log('Fetching pinned repositories from our API...');
        const response = await fetch('/api/github');
        
        if (!response.ok) {
          const error = await response.json().catch(() => ({}));
          throw new Error(error.error || 'Failed to fetch repositories');
        }
        
        const result = await response.json();
        const repos = result.data?.user?.pinnedItems?.nodes || [];
        
        if (repos.length === 0) {
          console.log('No pinned repositories found. Make sure you have pinned repositories on your GitHub profile.');
          throw new Error('No pinned repositories found');
        }

        // Process the repositories
        const processedRepos = repos.map((repo: any) => ({
          id: repo.id,
          name: repo.name,
          description: repo.description,
          language: repo.primaryLanguage?.name,
          languageColor: repo.primaryLanguage?.color,
          stargazers_count: repo.stargazerCount,
          forks_count: repo.forkCount,
          html_url: repo.url.replace('api.github.com/repos', 'github.com')
        }));

        setRepos(processedRepos);
        
        // Process language data for the pie chart
        const langData: {[key: string]: number} = {};
        processedRepos.forEach((repo: any) => {
          if (repo.language) {
            langData[repo.language] = (langData[repo.language] || 0) + 1;
          }
        });
        
        setLanguages(langData);
        
      } catch (err) {
        console.error('Error fetching pinned repositories:', err);
        setErrorRepos('Using sample data - GitHub rate limit may be exceeded');
        useSampleData();
      } finally {
        setLoadingRepos(false);
      }
    };
    
    // Fallback to sample data if API calls fail
    const useSampleData = () => {
      console.log('Using sample repository data');
      const sampleRepos = [
        {
          id: 1,
          name: 'Portfolio Website',
          description: 'My personal portfolio website built with Next.js and Tailwind CSS',
          language: 'TypeScript',
          languageColor: '#3178c6',
          stargazers_count: 12,
          forks_count: 3,
          html_url: 'https://github.com/06navdeep06/portfolio'
        },
        {
          id: 2,
          name: 'E-commerce Platform',
          description: 'A full-stack e-commerce platform with React and Node.js',
          language: 'JavaScript',
          languageColor: '#f1e05a',
          stargazers_count: 8,
          forks_count: 2,
          html_url: '#'
        },
        {
          id: 3,
          name: 'Task Manager',
          description: 'A task management application with drag-and-drop functionality',
          language: 'TypeScript',
          languageColor: '#3178c6',
          stargazers_count: 5,
          forks_count: 1,
          html_url: '#'
        }
      ];
      
      setRepos(sampleRepos);
      setLanguages({
        'TypeScript': 2,
        'JavaScript': 1
      });
    };
    
    // Only try to fetch if we're in the browser
    if (typeof window !== 'undefined') {
      fetchPinnedRepos();
    }
  }, []);
  
  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', { method: 'POST' });
      if (response.ok) {
        setIsAuthenticated(false);
      }
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <main className="min-h-screen bg-gray-900 text-white overflow-x-hidden">
        {/* Scroll Progress Indicator */}
        <motion.div 
          className="fixed top-0 left-0 right-0 h-1 bg-blue-500 z-50" 
          style={{ scaleX: scrollYProgress, transformOrigin: '0%' }} 
        />
        
        {/* Hero Section */}
        <motion.section 
          className="relative h-screen flex items-center justify-center text-center px-4 overflow-hidden"
          style={{ scale }}
        >
          <motion.div 
            className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20"
            style={{ y: ySpring }}
          ></motion.div>
          <div className="relative z-10 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-red-500 mb-4">Error Loading Portfolio</h2>
            <p className="text-gray-300 mb-6">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white transition-colors"
            >
              Try Again
            </button>
          </div>
        </motion.section>
      </main>
    );
  }

  const socialLinks = [
    { name: 'GitHub', url: 'https://github.com/06navdeep06', icon: <FaGithub className="h-6 w-6" /> },
    { name: 'Instagram', url: 'https://www.instagram.com/06navdeep06/', icon: <FaInstagram className="h-6 w-6" /> },
    { name: 'Email', url: '#contact', icon: <FaEnvelope className="h-6 w-6" /> },
  ];
  
  // Import ContactForm component dynamically to avoid SSR issues with nodemailer
  const ContactForm = dynamic(
    () => import('../components/ContactForm'), 
    { 
      ssr: false,
      loading: () => <div className="text-center py-8">Loading contact form...</div>
    }
  );

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      {/* Navigation */}
      <nav className="fixed w-full bg-gray-900 bg-opacity-80 backdrop-blur-sm z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold text-blue-400">Navdeep</div>
            <div className="hidden md:flex space-x-8">
              <a href="#home" className="hover:text-blue-400 transition-colors">Home</a>
              <a href="#about" className="hover:text-blue-400 transition-colors">About</a>
              <a href="#projects" className="hover:text-blue-400 transition-colors">Projects</a>
              <a href="#contact" className="hover:text-blue-400 transition-colors">Contact</a>
            </div>
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md text-white text-sm font-medium transition-colors"
              >
                Logout
              </button>
            ) : (
              <Link href="/admin" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white text-sm font-medium transition-colors">
                Admin
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center pt-20">
        <div className="container mx-auto px-6 text-center">
          <FadeIn>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Hi, I'm <span className="text-blue-400">Navdeep</span>
              </h1>
            </motion.div>
          </FadeIn>
          
          <FadeIn delay={0.3}>
            <motion.p 
              className="text-xl md:text-2xl text-gray-300 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Full Stack Developer
            </motion.p>
          </FadeIn>
          <FadeIn delay={0.5}>
            <motion.p 
              className="text-lg text-gray-400 max-w-2xl mx-auto mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              I try to build exceptional applications with clean code .
            </motion.p>
          </FadeIn>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
            <a 
              href="#contact" 
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-md text-white font-medium transition-colors"
            >
              Contact Me
            </a>
            <FadeIn delay={0.6}>
            <motion.a
              href="#about"
              className="group inline-flex items-center bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-full font-medium hover:opacity-90 transition-all"
              whileHover={{ 
                scale: 1.05,
                boxShadow: '0 0 20px rgba(99, 102, 241, 0.5)'
              }}
              whileTap={{ scale: 0.98 }}
            >
              Explore My Work
              <motion.span 
                className="ml-2 group-hover:translate-y-1 transition-transform duration-300"
                animate={{
                  y: [0, 5, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: 'loop',
                }}
              >
                <FaArrowDown className="inline" />
              </motion.span>
            </motion.a>
          </FadeIn>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 relative overflow-hidden">
        <motion.div 
          className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-900/10 to-purple-900/10"
          initial={{ opacity: 0, scale: 1.2 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        />
        
        <div className="container mx-auto px-6 relative z-10">
          <FadeIn>
            <h2 className="text-3xl font-bold text-center mb-12">
              About <span className="text-blue-400">Me</span>
            </h2>
          </FadeIn>
          <div className="max-w-3xl mx-auto text-center">
            <FadeIn delay={0.2}>
            <motion.p 
              className="text-gray-300 mb-6 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              I'm a full stack developer focused on building practical, modern web applications. 
              I enjoy bringing ideas to life through clean code and thoughtful user interfaces.
              With experience in both frontend and backend development, I aim to create digital 
              solutions that are reliable, user-friendly, and efficient.
            </motion.p>
            </FadeIn>
            
            <div className="mt-8">
              <FadeIn delay={0.4}>
              <motion.h3 
                className="text-xl font-semibold mb-4 text-blue-400"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                Tech Stack
              </motion.h3>
              </FadeIn>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {/* Python */}
                <FadeIn delay={0.6}>
                <motion.div 
                  className="bg-gray-800 p-4 rounded-lg hover:bg-gray-750 transition-colors"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                >
                  <div className="flex items-center mb-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                    <span className="font-medium">Python</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '90%' }}></div>
                  </div>
                  <p className="text-sm text-gray-400 mt-2">Django, Flask, Data Analysis, Automation</p>
                </motion.div>
                </FadeIn>
                
                {/* JavaScript */}
                <FadeIn delay={0.8}>
                <motion.div 
                  className="bg-gray-800 p-4 rounded-lg hover:bg-gray-750 transition-colors"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1 }}
                >
                  <div className="flex items-center mb-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-400 mr-2"></div>
                    <span className="font-medium">JavaScript</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-yellow-400 h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                  <p className="text-sm text-gray-400 mt-2">ES6+, Node.js, Express, TypeScript</p>
                </motion.div>
                </FadeIn>
                
                {/* React */}
                <FadeIn delay={1}>
                <motion.div 
                  className="bg-gray-800 p-4 rounded-lg hover:bg-gray-750 transition-colors"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1.2 }}
                >
                  <div className="flex items-center mb-2">
                    <div className="w-3 h-3 rounded-full bg-cyan-400 mr-2"></div>
                    <span className="font-medium">React</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-cyan-400 h-2 rounded-full" style={{ width: '70%' }}></div>
                  </div>
                  <p className="text-sm text-gray-400 mt-2">Next.js, Hooks, Context, Redux</p>
                </motion.div>
                </FadeIn>
                
                {/* Database */}
                <FadeIn delay={1.2}>
                <motion.div 
                  className="bg-gray-800 p-4 rounded-lg hover:bg-gray-750 transition-colors"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1.4 }}
                >
                  <div className="flex items-center mb-2">
                    <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                    <span className="font-medium">Database</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '80%' }}></div>
                  </div>
                  <p className="text-sm text-gray-400 mt-2">PostgreSQL, MongoDB, SQLite</p>
                </motion.div>
                </FadeIn>
                
                {/* Tools */}
                <FadeIn delay={1.4}>
                <motion.div 
                  className="bg-gray-800 p-4 rounded-lg hover:bg-gray-750 transition-colors"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1.6 }}
                >
                  <div className="flex items-center mb-2">
                    <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                    <span className="font-medium">Tools & DevOps</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: '70%' }}></div>
                  </div>
                  <p className="text-sm text-gray-400 mt-2">Git, Docker, AWS, CI/CD</p>
                </motion.div>
                </FadeIn>
                
                {/* Other */}
                <FadeIn delay={1.6}>
                <motion.div 
                  className="bg-gray-800 p-4 rounded-lg hover:bg-gray-750 transition-colors"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1.8 }}
                >
                  <div className="flex items-center mb-2">
                    <div className="w-3 h-3 rounded-full bg-pink-500 mr-2"></div>
                    <span className="font-medium">Other Skills</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-pink-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                  <p className="text-sm text-gray-400 mt-2">REST APIs, GraphQL, Testing, Agile</p>
                </motion.div>
                </FadeIn>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 relative">
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-blue-900/5 to-purple-900/5"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        />
        
        <div className="container mx-auto px-6 relative z-10">
          <FadeIn>
            <h2 className="text-3xl font-bold text-center mb-12">
              My <span className="text-blue-400">Projects</span>
            </h2>
          </FadeIn>
          
          {/* Enhanced Code Distribution Section */}
          <div className="w-full p-4">
            <motion.div 
              className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 h-full transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/20 hover:-translate-y-1 border border-gray-700/50"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <div>
                  <FadeIn delay={0.2}>
                    <motion.h3 
                      className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                    >
                      Code Distribution
                    </motion.h3>
                    <motion.p 
                      className="text-sm text-gray-400 mt-1"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                    >
                      Language breakdown across my projects
                    </motion.p>
                  </FadeIn>
                </div>
                
                <FadeIn delay={0.4}>
                  <motion.div 
                    className="mt-4 md:mt-0 px-4 py-2 bg-gray-800/50 backdrop-blur-sm rounded-full border border-gray-700/50"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                  >
                    {Object.keys(languages).length > 0 && (
                      <span className="text-sm font-medium text-gray-300">
                        Total: <span className="text-blue-400">{Object.values(languages).reduce((a, b) => a + b, 0)}</span> files
                      </span>
                    )}
                  </motion.div>
                </FadeIn>
              </div>
              
              <div className="relative h-[400px] md:h-[450px]">
                {loadingRepos ? (
                  <div className="flex flex-col items-center justify-center h-full space-y-4">
                    <div className="animate-spin rounded-full h-14 w-14 border-t-2 border-b-2 border-blue-500"></div>
                    <p className="text-gray-400 text-sm">Analyzing codebase...</p>
                  </div>
                ) : errorRepos ? (
                  <div className="flex flex-col items-center justify-center h-full text-center p-6 bg-red-900/20 rounded-xl">
                    <div className="text-red-400 text-4xl mb-3">⚠️</div>
                    <p className="text-red-400 font-medium">Failed to load repository data</p>
                    <p className="text-red-300 text-sm mt-1">{errorRepos}</p>
                  </div>
                ) : Object.keys(languages).length > 0 ? (
                  <div className="w-full h-full relative group">
                    {/* Animated background gradient */}
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-700"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.1 }}
                      whileHover={{ opacity: 0.2 }}
                    />
                    
                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 to-purple-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* Main chart container */}
                    <div className="relative h-full w-full flex flex-col md:flex-row items-center justify-center gap-8 p-4">
                      {/* Chart */}
                      <div className="w-full md:w-1/2 h-64 md:h-full">
                        <Doughnut 
                          data={{
                            labels: Object.keys(languages),
                            datasets: [
                              {
                                data: Object.values(languages) as number[],
                                backgroundColor: [
                                  'rgba(255, 99, 132, 0.7)',
                                  'rgba(54, 162, 235, 0.7)',
                                  'rgba(255, 206, 86, 0.7)',
                                  'rgba(75, 192, 192, 0.7)',
                                  'rgba(153, 102, 255, 0.7)',
                                  'rgba(255, 159, 64, 0.7)'
                                ],
                                borderColor: [
                                  'rgba(255, 99, 132, 1)',
                                  'rgba(54, 162, 235, 1)',
                                  'rgba(255, 206, 86, 1)',
                                  'rgba(75, 192, 192, 1)',
                                  'rgba(153, 102, 255, 1)',
                                  'rgba(255, 159, 64, 1)'
                                ],
                                borderWidth: 1,
                                hoverOffset: 15
                              }
                            ]
                          }}
                          options={{
                            responsive: true,
                            maintainAspectRatio: true,
                            cutout: '70%',
                            plugins: {
                              legend: {
                                position: 'bottom',
                                labels: {
                                  color: '#4B5563',
                                  font: {
                                    size: 12,
                                    family: '"Inter", sans-serif',
                                    weight: 500
                                  },
                                  usePointStyle: true,
                                  padding: 20,
                                  pointStyle: 'circle',
                                  boxWidth: 8,
                                  boxHeight: 8,
                                  generateLabels: (chart) => {
                                    const data = chart.data;
                                    if (data.labels && data.datasets && data.datasets[0]) {
                                      return data.labels.map((label: string, i: number) => {
                                        const dataset = data.datasets[0];
                                        const backgroundColor = Array.isArray(dataset.backgroundColor)
                                          ? dataset.backgroundColor[i % dataset.backgroundColor.length]
                                          : dataset.backgroundColor || '#000000';
                                        const value = dataset.data[i] || 0;
                                        
                                        return {
                                          text: `${label} - ${value}%`,
                                          fillStyle: backgroundColor as string,
                                          strokeStyle: backgroundColor as string,
                                          lineWidth: 1,
                                          hidden: !chart.getDataVisibility(i),
                                          index: i,
                                          datasetIndex: 0
                                        };
                                      });
                                    }
                                    return [];
                                  }
                                },
                                onClick: (e: MouseEvent, legendItem: any, legend: any) => {
                                  const index = legendItem.datasetIndex;
                                  const chart = legend.chart;
                                  const meta = chart.getDatasetMeta(0);
                                  
                                  if (meta.data && index >= 0 && index < meta.data.length) {
                                    const item = meta.data[index];
                                    if (item) {
                                      item.hidden = !item.hidden;
                                      chart.update();
                                    }
                                  }
                                }
                              },
                              tooltip: {
                                enabled: true,
                                backgroundColor: 'rgba(31, 41, 55, 0.9)',
                                titleColor: '#F9FAFB',
                                bodyColor: '#E5E7EB',
                                borderColor: 'rgba(75, 85, 99, 0.5)',
                                borderWidth: 1,
                                padding: 12,
                                displayColors: true,
                                usePointStyle: true,
                                callbacks: {
                                  label: (context: any) => {
                                    const label = context.label || '';
                                    const value = context.raw as number;
                                    const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                                    const percentage = Math.round((value / total) * 100);
                                    return `${label}: ${value}% (${percentage}% of total)`;
                                  }
                                }
                              },
                              datalabels: {
                                color: '#1F2937',
                                font: {
                                  weight: 600,
                                  size: 12,
                                  family: '"Inter", sans-serif'
                                },
                                formatter: (value: number) => {
                                  return `${value}%`;
                                },
                                textAlign: 'center' as CanvasTextAlign,
                                textStrokeColor: 'white',
                                textStrokeWidth: 3,
                                textShadowBlur: 10,
                                textShadowColor: 'rgba(0, 0, 0, 0.5)'
                              }
                            },
                          },
                        },
                        cutout: '65%',
                        radius: '90%',
                        animation: {
                          animateScale: true,
                          animateRotate: true,
                          duration: 1800,
                          easing: 'easeOutQuart',
                        },
                        onHover: (event: ChartEvent, elements: any[], chart: ChartJS) => {
                          if (elements && elements.length > 0) {
                            const element = elements[0];
                            if (element) {
                              chart.canvas.style.cursor = 'pointer';
                              chart.setActiveElements([{ 
                                datasetIndex: element.datasetIndex, 
                                index: element.index 
                              }]);
                              chart.update();
                              return;
                            }
                          }
                          chart.canvas.style.cursor = 'default';
                          chart.setActiveElements([]);
                          chart.update();
                        },
                        plugins: {
                          legend: {
                            position: 'right' as const,
                            labels: {
                              color: '#E5E7EB',
                              padding: 16,
                              font: {
                                size: 14,
                                family: 'Inter, sans-serif',
                                weight: 'normal' as const,
                              },
                              usePointStyle: true,
                              pointStyle: 'circle' as const,
                              boxWidth: 8,
                              boxHeight: 8
                            },
                            onClick: (e: ChartEvent, legendItem: any, legend: any) => {
                              const index = legendItem?.datasetIndex ?? 0;
                              const chart = legend?.chart;
                              if (!chart) return;
                              
                              if (chart.isDatasetVisible(index)) {
                                chart.hide(index);
                                if (legendItem) legendItem.hidden = true;
                              } else {
                                chart.show(index);
                                if (legendItem) legendItem.hidden = false;
                              }
                              chart.update();
                            }
                          },
                          tooltip: {
                            backgroundColor: 'rgba(17, 24, 39, 0.95)',
                            titleColor: '#F3F4F6',
                            bodyColor: '#E5E7EB',
                            titleFont: {
                              size: 14,
                              weight: 'bold',
                              family: 'Inter, sans-serif',
                            },
                            bodyFont: {
                              size: 13,
                              family: 'Inter, sans-serif',
                            },
                            borderColor: 'rgba(75, 85, 99, 0.5)',
                            borderWidth: 1,
                            padding: 12,
                            displayColors: true,
                            usePointStyle: true,
                            callbacks: {
                              label: function(context: any) {
                                const label = context.label || '';
                                const value = context.raw || 0;
                                const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                                const percentage = Math.round((value / total) * 100);
                                return `${label}: ${value} files (${percentage}%)`;
                              },
                              labelColor: function(context: any) {
                                return {
                                  borderColor: 'transparent',
                                  backgroundColor: context.dataset.backgroundColor[context.dataIndex],
                                  borderRadius: 2,
                                };
                              },
                            },
                          },
                          datalabels: {
                            formatter: (value: number, context: any) => {
                              const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                              const percentage = Math.round((value / total) * 100);
                              return percentage >= 5 ? `${percentage}%` : '';
                            },
                            color: '#F9FAFB',
                            font: {
                              weight: 'bold',
                              size: 13,
                              family: 'Inter, sans-serif',
                            },
                            textAlign: 'center',
                            textShadowBlur: 8,
                            textShadowColor: 'rgba(0, 0, 0, 0.8)',
                            textStrokeColor: 'rgba(0, 0, 0, 0.5)',
                            textStrokeWidth: 1,
                          }
                        }
                      }}
                      plugins={[{
                        id: 'doughnutLabel',
                        afterDraw: (chart: ChartJS) => {
                          const { ctx, chartArea } = chart;
                          if (!chartArea) return;
                          
                          const { top, bottom, left, right } = chartArea;
                          
                          // Draw total in center
                          const total = chart.data.datasets[0]?.data?.reduce<number>((a: number, b: number) => a + b, 0) || 0;
                          const centerX = (left + right) / 2;
                          const centerY = (top + bottom) / 2;
                          
                          // Draw outer circle
                          ctx.save();
                          ctx.beginPath();
                          ctx.arc(centerX, centerY, 50, 0, Math.PI * 2);
                          ctx.fillStyle = 'rgba(30, 41, 59, 0.9)';
                          ctx.fill();
                          
                          // Add inner glow
                          const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 50);
                          gradient.addColorStop(0, 'rgba(59, 130, 246, 0.3)');
                          gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');
                          
                          ctx.beginPath();
                          ctx.arc(centerX, centerY, 50, 0, Math.PI * 2);
                          ctx.fillStyle = gradient;
                          ctx.fill();
                          
                          // Draw total text
                          ctx.font = 'bold 16px "Inter", sans-serif';
                          ctx.fillStyle = '#E5E7EB';
                          ctx.textAlign = 'center' as CanvasTextAlign;
                          ctx.textBaseline = 'middle' as CanvasTextBaseline;
                          ctx.fillText('Total', centerX, centerY - 15);
                          
                          ctx.font = 'bold 24px "Inter", sans-serif';
                          ctx.fillStyle = '#3B82F6';
                          ctx.textBaseline = 'middle' as CanvasTextBaseline;
                          ctx.fillText(total.toString(), centerX, centerY + 15);
                          ctx.restore();
                        }
                      }]}
                    />
                    <div className="absolute inset-0 pointer-events-none">
                      {/* Empty div to maintain layout */}
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-400 text-center py-8">No language data available</div>
                )}
              </div>
              
              <FadeIn delay={0.8}>
              <motion.div 
                className="mt-4 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1 }}
              >
                <p className="text-sm text-gray-400">
                 
                </p>
              </motion.div>
              </FadeIn>
            </div>
          </div>

          {/* Repositories */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {loadingRepos ? (
              <div className="col-span-3 text-center text-gray-400 py-8">
                Loading repositories...
              </div>
            ) : errorRepos ? (
              <div className="col-span-3 text-center text-red-500 py-8">
                {errorRepos}
              </div>
            ) : repos.length > 0 ? (
              repos.map((repo) => (
                <FadeIn key={repo.id} delay={0.2}>
                <motion.div 
                  className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  <h3 className="text-xl font-semibold mb-2 text-blue-400">
                    <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      {repo.name}
                    </a>
                  </h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                    {repo.description || 'No description available'}
                  </p>
                  <div className="flex items-center text-sm text-gray-400 mt-4">
                    {repo.language && (
                      <div className="flex items-center mr-4">
                        <span 
                          className="w-3 h-3 rounded-full mr-1"
                          style={{
                            backgroundColor: 
                              repo.language === 'JavaScript' ? '#F7DF1E' :
                              repo.language === 'TypeScript' ? '#3178C6' :
                              repo.language === 'HTML' ? '#E34F26' :
                              repo.language === 'CSS' ? '#1572B6' :
                              repo.language === 'Python' ? '#3776AB' : '#9CA3AF'
                          }}
                        ></span>
                        <span>{repo.language}</span>
                      </div>
                    )}
                    <div className="flex items-center mr-4">
                      <FaStar className="mr-1 text-yellow-400" />
                      <span>{repo.stargazers_count || 0}</span>
                    </div>
                    <div className="flex items-center">
                      <FaCodeBranch className="mr-1 text-purple-400" />
                      <span>{repo.forks_count || 0}</span>
                    </div>
                  </div>
                </motion.div>
                </FadeIn>
              ))
            ) : (
              <div className="col-span-3 text-center text-gray-400 py-8">
                No repositories found
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-8">
        <div className="container mx-auto px-6 text-center">
          <p className="text-gray-400">
            &copy; {new Date().getFullYear()} Navdeep. All rights reserved.
          </p>
          <StaggeredContainer className="flex justify-center gap-6 mb-12">
            {socialLinks.map((link, index) => (
              <StaggeredItem key={index}>
                <motion.a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors duration-300 text-2xl block"
                  aria-label={link.name}
                  whileHover={{ y: -5, scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {link.icon}
                </motion.a>
              </StaggeredItem>
            ))}
          </StaggeredContainer>
        </div>
      </footer>
      
      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <FadeIn>
            <h2 className="text-3xl font-bold text-center mb-12">
              Get In <span className="text-blue-400">Touch</span>
            </h2>
          </FadeIn>
          
          <motion.div 
            className="bg-gray-800 rounded-lg shadow-xl max-w-4xl mx-auto p-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="grid md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <h3 className="text-2xl font-semibold mb-6 text-blue-400">Let's Connect</h3>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  I'm currently looking for new opportunities. Whether you have a question or just want to say hi, 
                  I'll get back to you as soon as possible!
                </p>
                
                <div className="space-y-4">
                  <motion.a 
                    href="mailto:nepal00909@gmail.com"
                    className="flex items-center text-gray-300 hover:text-white transition-colors w-fit"
                    whileHover={{ x: 5 }}
                  >
                    <FaEnvelope className="mr-3 text-blue-400" size={20} />
                    nepal00909@gmail.com
                  </motion.a>
                  
                  <div className="flex space-x-6 mt-8">
                    {socialLinks.map((link, index) => (
                      <motion.a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-white transition-colors text-2xl block"
                        aria-label={link.name}
                        whileHover={{ 
                          y: -5,
                          scale: 1.1,
                          color: '#3B82F6'
                        }}
                        whileTap={{ scale: 0.9 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                      >
                        {link.icon}
                      </motion.a>
                    ))}
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <h3 className="text-2xl font-semibold mb-6 text-blue-400">Send me a message</h3>
                <ContactForm />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
