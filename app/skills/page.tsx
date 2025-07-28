'use client';

import { useState, useEffect } from 'react';
import HolographicPieChart from '@/components/HolographicPieChart';
import { motion } from 'framer-motion';

const skillsData = {
  labels: [
    'Backend', 
    'Frontend', 
    'DevOps', 
    'UI/UX', 
    'Other'
  ],
  values: [50, 25, 15, 7, 3],
  descriptions: [
    'Python, Node.js, Express, REST APIs, GraphQL',
    'React, Next.js, TypeScript, Tailwind CSS, Redux',
    'Docker, AWS, CI/CD, GitHub Actions, Vercel',
    'Figma, Framer Motion, Responsive Design, Accessibility',
    'Project Management, Agile, Git, Testing'
  ]
};

const skillCategories = [
  {
    name: 'Frontend',
    skills: [
      { name: 'React', level: 95 },
      { name: 'Next.js', level: 90 },
      { name: 'TypeScript', level: 88 },
      { name: 'Tailwind CSS', level: 92 },
      { name: 'Redux', level: 85 },
    ]
  },
  {
    name: 'Backend',
    skills: [
      { name: 'Python', level: 95 },
      { name: 'Node.js', level: 90 },
      { name: 'Express', level: 85 },
      { name: 'REST APIs', level: 92 },
      { name: 'GraphQL', level: 78 },
    ]
  },
  {
    name: 'DevOps',
    skills: [
      { name: 'Docker', level: 85 },
      { name: 'AWS', level: 75 },
      { name: 'CI/CD', level: 80 },
      { name: 'GitHub Actions', level: 82 },
      { name: 'Vercel', level: 88 },
    ]
  },
  {
    name: 'UI/UX',
    skills: [
      { name: 'Figma', level: 78 },
      { name: 'Framer Motion', level: 85 },
      { name: 'Responsive Design', level: 90 },
      { name: 'Accessibility', level: 82 },
      { name: 'Prototyping', level: 75 },
    ]
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5
    }
  }
};

export default function SkillsPage() {
  const [activeCategory, setActiveCategory] = useState(0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-blue-400 to-teal-400">
            My Skills
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Interactive visualization of my technical expertise. Hover over the chart segments or click for more details!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="holographic-container bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-white/5">
              {isClient && <HolographicPieChart data={skillsData} />}
            </div>
          </motion.div>

          <motion.div 
            className="lg:col-span-1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <div className="h-full bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-white/5">
              <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
                {skillCategories.map((category, index) => (
                  <button
                    key={category.name}
                    onClick={() => setActiveCategory(index)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                      activeCategory === index
                        ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                        : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700/80'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>

              <motion.div
                key={activeCategory}
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="space-y-4"
              >
                <h3 className="text-xl font-bold text-white mb-4">
                  {skillCategories[activeCategory].name} Skills
                </h3>
                
                {skillCategories[activeCategory].skills.map((skill) => (
                  <motion.div 
                    key={skill.name}
                    variants={itemVariants}
                    className="group relative"
                  >
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
                        {skill.name}
                      </span>
                      <span className="text-xs font-medium text-blue-400">
                        {skill.level}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.level}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="h-full rounded-full bg-gradient-to-r from-blue-400 to-purple-500"
                      />
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div 
                className="mt-8 pt-6 border-t border-white/10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <h4 className="text-sm font-semibold text-gray-400 mb-3">
                  Pro Tip
                </h4>
                <p className="text-sm text-gray-300">
                  Click on any segment in the chart to see more details and trigger a fun confetti effect!
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
