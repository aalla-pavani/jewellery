import React, { useEffect } from 'react';

const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div 
      className={`
        fixed bottom-8 right-8 z-50
        px-6 py-3
        bg-white
        ${type === 'success' ? 'text-[#414141]' : 'text-red-500'}
        prata-regular text-base
        flex items-center gap-3
        border-l-2 ${type === 'success' ? 'border-l-[#414141]' : 'border-l-red-500'}
        shadow-[0_2px_10px_rgba(0,0,0,0.05)]
        animate-slide-up
      `}
    >
      <span>{message}</span>
    </div>
  );
};

export default Toast;

// Add this to your global CSS or tailwind.config.js
// @keyframes slideUp {
//   from {
//     transform: translateY(100%);
//     opacity: 0;
//   }
//   to {
//     transform: translateY(0);
//     opacity: 1;
//   }
// }
