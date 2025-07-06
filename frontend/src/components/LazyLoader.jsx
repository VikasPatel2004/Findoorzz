import React, { Suspense } from 'react';

const LazyLoader = ({ children, fallback = null }) => {
  return (
    <Suspense fallback={fallback || (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
      </div>
    )}>
      {children}
    </Suspense>
  );
};

export default LazyLoader; 