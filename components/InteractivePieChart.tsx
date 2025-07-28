'use client';

import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartData, ChartOptions } from 'chart.js';
import { motion } from 'framer-motion';
import { useState } from 'react';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

interface SkillData {
  label: string;
  value: number;
  color: string;
}

interface InteractivePieChartProps {
  data: SkillData[];
  className?: string;
}

export default function InteractivePieChart({ data, className = '' }: InteractivePieChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Transform the data into Chart.js format
  const chartData: ChartData<'pie', number[], string> = {
    labels: data.map(item => item.label),
    datasets: [
      {
        data: data.map(item => item.value),
        backgroundColor: data.map(item => `${item.color}80`), // 50% opacity
        borderColor: 'rgba(30, 41, 59, 0.9)',
        borderWidth: 2,
        hoverBackgroundColor: data.map(item => item.color),
        hoverBorderColor: '#ffffff',
        hoverOffset: 15,
        borderRadius: 8,
        spacing: 1,
      },
    ],
  };

  const chartOptions: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#e2e8f0',
          font: {
            size: 12,
            family: 'Inter',
          },
          padding: 16,
          usePointStyle: true,
          generateLabels(chart) {
            const data = chart.data;
            if (!data.labels || !data.datasets) return [];
            
            return data.labels.map((label, i) => {
              const dataset = data.datasets?.[0];
              const value = dataset?.data?.[i] || 0;
              const total = dataset?.data?.reduce((a: number, b: number) => a + b, 0) || 0;
              const percentage = Math.round((Number(value) / total) * 100);
              const isActive = activeIndex === i || activeIndex === null;
              
              return {
                text: `${label}: ${percentage}%`,
                fillStyle: isActive ? dataset.backgroundColor?.[i] : 'transparent',
                strokeStyle: isActive ? dataset.backgroundColor?.[i] : '#4b5563',
                lineWidth: isActive ? 2 : 1,
                hidden: false,
                lineCap: 'round',
                lineJoin: 'round',
                pointStyle: 'circle',
                rotation: 0,
              };
            });
          },
        },
        onClick: (_, legendItem, legend) => {
          const index = legendItem.datasetIndex;
          setActiveIndex(prev => (prev === index ? null : index));
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
          label: (context) => {
            const label = context.label || '';
            const value = Number(context.raw) || 0;
            const total = (context.dataset.data as number[]).reduce((a, b) => a + b, 0);
            const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
            return `${label}: ${percentage}% (${value} projects)`;
          },
        },
      },
    },
    onClick: (_, elements) => {
      if (elements.length > 0) {
        const clickedIndex = elements[0].index;
        setActiveIndex(prev => (prev === clickedIndex ? null : clickedIndex));
      } else {
        setActiveIndex(null);
      }
    },
    onHover: (event, elements) => {
      const target = event.native?.target as HTMLElement;
      if (target) {
        target.style.cursor = elements.length ? 'pointer' : 'default';
      }
    },
    elements: {
      arc: {
        borderWidth: 2,
        borderColor: 'rgba(30, 41, 59, 0.9)',
        hoverOffset: 15,
        borderRadius: 8,
        offset: (context) => {
          return activeIndex === context.dataIndex ? 10 : 0;
        },
      },
    },
    cutout: '65%',
    rotation: -90,
    circumference: 360,
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 1000,
      easing: 'easeOutQuart',
    },
  };

  return (
    <div className={`relative w-full h-full flex items-center justify-center ${className}`}>
      <motion.div
        className="relative w-full h-full max-w-full max-h-full aspect-square"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative w-full h-full">
          <Pie
            data={chartData}
            options={chartOptions}
            className="w-full h-full transition-all duration-300 hover:scale-105"
            style={{
              width: '100%',
              height: '100%',
            }}
          />
        
          {activeIndex !== null && (
            <motion.div 
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center">
                <p className="text-2xl font-bold text-white">
                  {data[activeIndex]?.label}
                </p>
                <p className="text-cyan-200 mt-1 text-lg">
                  {data[activeIndex]?.value}%
                </p>
              </div>
            </motion.div>
          )}
            

        </div>
      </motion.div>
    </div>
  );
}
