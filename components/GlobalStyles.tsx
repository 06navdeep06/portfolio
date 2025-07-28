"use client";

export default function GlobalStyles() {
  return (
    <style jsx global>{`
      html {
        scroll-behavior: smooth;
      }
      
      /* Better text rendering */
      body {
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-rendering: optimizeLegibility;
      }
      
      /* Custom scrollbar */
      ::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }
      
      ::-webkit-scrollbar-track {
        background: rgba(255, 255, 255, 0.05);
      }
      
      ::-webkit-scrollbar-thumb {
        background: rgba(255, 215, 0, 0.3);
        border-radius: 4px;
      }
      
      ::-webkit-scrollbar-thumb:hover {
        background: rgba(255, 215, 0, 0.5);
      }
    `}</style>
  );
}
