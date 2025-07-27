import 'chart.js';
import { Chart, ChartTypeRegistry, Plugin } from 'chart.js';

declare module 'chart.js' {
  export interface PluginOptionsByType<TType extends keyof ChartTypeRegistry> {
    datalabels?: {
      display?: boolean | ((context: any) => boolean);
      color?: string | ((context: any) => string);
      font?: {
        size?: number | ((context: any) => number);
        weight?: string | number | ((context: any) => string | number);
        family?: string | ((context: any) => string);
      };
      formatter?: (value: number, context: any) => string | null;
      textAlign?: CanvasTextAlign | ((context: any) => CanvasTextAlign);
      textStrokeColor?: string | ((context: any) => string);
      textStrokeWidth?: number | ((context: any) => number);
      textShadowBlur?: number | ((context: any) => number);
      textShadowColor?: string | ((context: any) => string);
    };
  }

  export interface ChartTypeRegistry {
    doughnut: {
      chartOptions: any;
      datasetOptions: any;
      defaultDataPoint: number | [number, number];
      parsedDataType: { r: number };
      metaExtensions: Record<string, unknown>;
      metaAdditionalOpts: Record<string, unknown>;
    };
  }
}

export interface DoughnutChartData {
  labels: string[];
  datasets: Array<{
    data: number[];
    backgroundColor: string[];
    borderColor: string | string[];
    borderWidth?: number;
    hoverBackgroundColor?: string[];
    hoverBorderColor?: string[];
    hoverBorderWidth?: number;
    hoverOffset?: number;
  }>;
}

export interface DoughnutChartOptions {
  responsive: boolean;
  maintainAspectRatio: boolean;
  cutout: string | number;
  radius?: string | number;
  plugins: {
    legend: {
      position: 'top' | 'left' | 'bottom' | 'right' | 'chartArea' | 'center';
      labels: {
        color: string;
        font: {
          size: number;
          family: string;
          weight?: string | number;
        };
        usePointStyle: boolean;
        padding: number;
        pointStyle?: string | CanvasImageSource;
        boxWidth?: number;
        boxHeight?: number;
        generateLabels?: (chart: Chart) => any[];
      };
      onClick?: (e: MouseEvent, legendItem: any, legend: any) => void;
    };
    tooltip: {
      backgroundColor: string;
      titleColor: string;
      bodyColor: string;
      titleFont: {
        size: number;
        family: string;
        weight?: string | number;
      };
      bodyFont: {
        size: number;
        family: string;
      };
      displayColors: boolean;
      borderColor: string;
      borderWidth: number;
      padding: number | { x: number; y: number };
      callbacks: {
        label: (context: any) => string | string[];
        title?: (context: any) => string | string[];
        afterLabel?: (context: any) => string | string[];
        labelColor?: (context: any) => { borderColor: string; backgroundColor: string };
      };
    };
    datalabels: {
      formatter: (value: number, context: any) => string | null;
      color: string;
      font: {
        weight: string | number;
        size: number;
        family: string;
      };
      textAlign: CanvasTextAlign;
      textStrokeColor?: string;
      textStrokeWidth?: number;
      textShadowBlur?: number;
      textShadowColor?: string;
      display: boolean | ((context: any) => boolean);
    };
  };
  animation: {
    animateScale: boolean;
    animateRotate: boolean;
    duration: number;
    easing: string;
    onComplete?: () => void;
    onProgress?: (animation: any) => void;
  };
  circumference?: number;
  rotation?: number;
  spacing?: number;
  cutoutPercentage?: number;
}

export interface ChartPlugin extends Plugin<'doughnut'> {
  id: string;
  beforeDraw?: (chart: Chart) => void;
  datalabels?: {
    display?: boolean | ((context: any) => boolean);
    color?: string | ((context: any) => string);
    font?: {
      size?: number | ((context: any) => number);
      weight?: string | number | ((context: any) => string | number);
      family?: string | ((context: any) => string);
    };
    formatter?: (value: number, context: any) => string | null;
    textAlign?: CanvasTextAlign | ((context: any) => CanvasTextAlign);
    textStrokeColor?: string | ((context: any) => string);
    textStrokeWidth?: number | ((context: any) => number);
    textShadowBlur?: number | ((context: any) => number);
    textShadowColor?: string | ((context: any) => string);
  };
}
