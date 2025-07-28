'use client';

import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartData, ChartOptions, Plugin, ArcElement as ArcElementType, ArcOptions, ChartType, ChartTypeRegistry } from 'chart.js';
import { Pie, getElementAtEvent } from 'react-chartjs-2';
import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

interface HolographicPieChartProps {
  data: {
    labels: string[];
    values: number[];
    descriptions?: string[];
  };
}

const HolographicPieChart = ({ data }: HolographicPieChartProps) => {
  const chartRef = useRef<ChartJS<'pie'>>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isExploded, setIsExploded] = useState(false);

  // Holographic color scheme with hover states
  const baseColors = [
    'rgba(138, 43, 226, 0.8)',  // BlueViolet
    'rgba(75, 0, 130, 0.8)',    // Indigo
    'rgba(0, 191, 255, 0.8)',   // DeepSkyBlue
    'rgba(0, 255, 255, 0.8)',   // Cyan
    'rgba(0, 250, 154, 0.8)'    // MediumSpringGreen
  ];

  const hoverColors = [
    'rgba(155, 89, 255, 0.9)',
    'rgba(106, 90, 205, 0.9)',
    'rgba(30, 144, 255, 0.9)',
    'rgba(0, 255, 255, 0.9)',
    'rgba(50, 255, 164, 0.9)'
  ];

  const generateGradient = (ctx: CanvasRenderingContext2D, chartArea: any, colors: string[]) => {
    const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
    gradient.addColorStop(0, colors[0]);
    gradient.addColorStop(0.25, colors[1]);
    gradient.addColorStop(0.5, colors[2]);
    gradient.addColorStop(0.75, colors[3]);
    gradient.addColorStop(1, colors[4]);
    return gradient;
  };

  const chartData: ChartData<'pie'> = {
    labels: data.labels,
    datasets: [
      {
        data: data.values,
        backgroundColor: (context) => {
          const chart = chartRef.current;
          if (!chart) return 'rgba(0, 0, 0, 0.1)';
          
          const { ctx, chartArea } = chart;
          if (!chartArea) return 'rgba(0, 0, 0, 0.1)';
          
          return generateGradient(ctx, chartArea, baseColors);
        },
        hoverBackgroundColor: (context) => {
          const chart = chartRef.current;
          if (!chart) return 'rgba(0, 0, 0, 0.1)';
          
          const { ctx, chartArea } = chart;
          if (!chartArea) return 'rgba(0, 0, 0, 0.1)';
          
          return generateGradient(ctx, chartArea, hoverColors);
        },
        borderColor: 'rgba(255, 255, 255, 0.5)',
        borderWidth: 1,
        hoverBorderColor: 'rgba(255, 255, 255, 0.9)',
        hoverBorderWidth: 2,
        hoverOffset: 10,
      }
    ]
  };

  const handleHover = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!chartRef.current) return;
    
    const element = getElementAtEvent(chartRef.current, event)[0];
    setHoveredIndex(element?.index ?? null);
  };

  const handleClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!chartRef.current) return;
    
    const element = getElementAtEvent(chartRef.current, event)[0];
    if (element) {
      setSelectedIndex(element.index === selectedIndex ? null : element.index);
      
      // Trigger confetti on click
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#8a2be2', '#00bfff', '#00ff9c', '#4b0082', '#00ffff']
      });

      // Toggle explode effect with type safety
      setIsExploded(true);
      setTimeout(() => setIsExploded(false), 1000);
    }
  };

  const options: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    onHover: (event, chartElements) => {
      const target = event.native?.target as HTMLElement;
      if (target) {
        target.style.cursor = chartElements[0] ? 'pointer' : 'default';
      }
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#fff',
          font: {
            size: 14,
            family: 'sans-serif',
            weight: 500
          },
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',
          generateLabels: (chart) => {
            const data = chart.data;
            if (data.labels?.length && data.datasets[0].data) {
              return data.labels.map((label, i) => ({
                text: `${label} (${data.datasets[0].data[i]}%)`,
                fillStyle: Array.isArray(data.datasets[0].backgroundColor) 
                  ? data.datasets[0].backgroundColor[i] 
                  : 'rgba(0,0,0,0.1)',
                strokeStyle: 'rgba(255, 255, 255, 0.5)',
                lineWidth: 1,
                hidden: false,
                index: i
              }));
            }
            return [];
          }
        },
        onClick: (e, legendItem, legend) => {
          const index = legendItem.datasetIndex ?? 0;
          const ci = legend.chart;
          const meta = ci.getDatasetMeta(0);
          const item = meta.data[index];
          
          // Toggle visibility
          item.hidden = !item.hidden;
          ci.update();
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw as number;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = Math.round((value / Number(total)) * 100);
            
            // Add description if available
            const description = data.descriptions?.[context.dataIndex] || '';
            const descriptionLine = description ? `\n${description}` : '';
            
            return `${label}: ${value}% (${percentage} of total)${descriptionLine}`;
          }
        }
      },
    },
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 1000,
      easing: 'easeOutQuart',
      onProgress: function(animation) {
        if (isExploded && this.data.datasets) {
          const meta = this.getDatasetMeta(0);
          (meta as unknown as CustomChartMeta).data.forEach((element, index) => {
            if (index === selectedIndex) {
              // Add explosion effect to selected segment
              element.hidden = false;
              element.transition(0).tooltipPosition = () => {
                const model = element;
                return {
                  x: model.x + Math.random() * 20 - 10,
                  y: model.y + Math.random() * 20 - 10
                };
              };
            }
          });
        }
      }
    },
    elements: {
      arc: {
        borderWidth: 0,
        offset: (context) => {
          if (isExploded && context.dataIndex === selectedIndex) {
            return 20; // Explode the selected segment
          }
          return hoveredIndex === context.dataIndex ? 10 : 0;
        }
      }
    }
  };

  // Add custom plugin for hover effect
  // Extend the ArcElement type to include our custom properties
  interface CustomArcElement extends ArcElementType {
    x: number;
    y: number;
    outerRadius: number;
    innerRadius: number;
    startAngle: number;
    endAngle: number;
    hidden?: boolean;
    transition: (duration: number) => any;
    tooltipPosition: () => { x: number; y: number };
  }
  
  // Extend the meta type to include our custom element type
  interface CustomChartMeta {
    data: CustomArcElement[];
  }

  const hoverPlugin: Plugin<keyof ChartTypeRegistry> = {
    id: 'hoverEffect',
    beforeDraw: (chart) => {
      const ctx = chart.ctx;
      const chartArea = chart.chartArea;
      
      if (hoveredIndex !== null) {
        const meta = chart.getDatasetMeta(0);
        const element = meta.data[hoveredIndex] as unknown as CustomArcElement;
        
        if (element) {
          // Draw glow effect
          ctx.save();
          ctx.beginPath();
          ctx.arc(
            element.x,
            element.y,
            element.outerRadius + 15,
            element.startAngle,
            element.endAngle
          );
          
          const gradient = ctx.createRadialGradient(
            element.x,
            element.y,
            element.innerRadius,
            element.x,
            element.y,
            element.outerRadius + 15
          );
          
          gradient.addColorStop(0, 'rgba(138, 43, 226, 0.2)');
          gradient.addColorStop(1, 'rgba(0, 191, 255, 0)');
          
          ctx.fillStyle = gradient;
          ctx.fill();
          ctx.restore();
        }
      }
    }
  };

  // Register the plugin
  ChartJS.register(hoverPlugin);

  return (
    <div className="relative w-full h-[500px] md:h-[600px] transition-all duration-300">
      {/* Background glow effect */}
      <div className="absolute inset-0 rounded-2xl opacity-30 blur-xl" 
           style={{
             background: 'radial-gradient(circle, rgba(138,43,226,0.3) 0%, rgba(0,191,255,0.3) 50%, rgba(0,250,154,0.3) 100%)',
             transition: 'all 0.3s ease'
           }} />
      
      {/* Main chart container */}
      <div className="relative z-10 w-full h-full p-4">
        <div className="holographic-container w-full h-full rounded-2xl p-4 md:p-6">
          <Pie 
            ref={chartRef}
            data={chartData} 
            options={options}
            onMouseMove={handleHover}
            onMouseLeave={() => setHoveredIndex(null)}
            onClick={handleClick}
            className="chart-glow"
          />
          
          {/* Selected segment info */}
          <AnimatePresence>
            {selectedIndex !== null && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-6 p-4 bg-black/30 backdrop-blur-sm rounded-lg border border-white/10"
              >
                <h3 className="text-xl font-bold text-white mb-2">
                  {data.labels[selectedIndex]}
                  <span className="ml-2 text-cyan-400">{data.values[selectedIndex]}%</span>
                </h3>
                {data.descriptions?.[selectedIndex] && (
                  <p className="text-white/80">{data.descriptions[selectedIndex]}</p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      {/* Interactive hint */}
      <div className="absolute bottom-4 left-0 right-0 text-center text-xs text-white/50">
        Click on segments for details | Hover for effects
      </div>
    </div>
  );
};

export default HolographicPieChart;
