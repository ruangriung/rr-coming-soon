import React from 'react';

const ButtonSpinner = ({ className = "" }: { className?: string }) => (
  <div className={`animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent ${className}`} />
);

export default ButtonSpinner;
