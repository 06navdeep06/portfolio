'use client';

import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { motion } from 'framer-motion';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

interface SkillData {
  label: string;
  value: number;
  color: string;
}

interface SimplePieChartProps {
  data: SkillData[];
  className?: string;
}

export default function SimplePieChart({ data, className = '' }: SimplePieChartProps) {
  // Calculate total for percentage
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  // Prepare chart data
  const chartData = {
    labels: data.map(item => item.label),
    datasets: [
      {
        data: data.map(item => item.value),
        backgroundColor: data.map(item => item.color),
        borderColor: 'rgba(30, 41, 59, 0.9)',
        borderWidth: 1,
        hoverOffset: 10,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#e2e8f0',
          font: {
            size: 12,
            family: 'Inter',
          },
          padding: 20,
          usePointStyle: true,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: '#6ee7ff',
        bodyColor: '#e2e8f0',
        borderColor: '#6ee7ff',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
        usePointStyle: true,
        callbacks: {
          label: (context: any) => {
            const label = context.label || '';
            const value = Number(context.raw) || 0;
            const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
            return `${label}: ${percentage}%`;
          },
        },
      },
    },
    cutout: '60%',
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 1000,
      easing: 'easeOutQuart' as const,
    },
  };

  return (
    <div className={`w-full h-full ${className}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full h-full"
      >
        <Pie
          data={chartData}
          options={chartOptions}
          className="w-full h-full"
        />
      </motion.div>
    </div>
  );
}
