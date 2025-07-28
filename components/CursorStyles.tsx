'use client';

import { useEffect } from 'react';

export default function CursorStyles() {
  useEffect(() => {
    // Hide default cursor
    document.body.style.cursor = 'none';
    
    return () => {
      // Restore default cursor on unmount
      document.body.style.cursor = 'auto';
    };
  }, []);

  return (
    <style jsx global>{`
      a, button, [role="button"] {
        cursor: none !important;
      }
      
      /* Add subtle hover effects for interactive elements */
      .btn-primary, .btn-secondary {
        position: relative;
        overflow: hidden;
        transition: all 0.3s ease;
      }
      
      .btn-primary:hover, .btn-secondary:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      }
      
      .btn-primary:active, .btn-secondary:active {
        transform: translateY(0);
      }
      
      /* Custom cursor class for special elements */
      [data-cursor="special"] {
        position: relative;
        z-index: 10;
      }
    `}</style>
  );
}
