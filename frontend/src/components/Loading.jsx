import React from 'react';

function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
      <div className="relative">
        {/* Outer circle */}
        <div className="w-16 h-16 border-4 border-indigo-200 rounded-full animate-spin">
        </div>
        {/* Inner circle */}
        <div className="w-16 h-16 border-4 border-t-indigo-600 rounded-full animate-spin absolute top-0 left-0">
        </div>
        {/* Loading text */}
        <div className="mt-4 text-center">
          <span className="text-indigo-600 font-semibold">
            Loading
            <span className="animate-pulse">...</span>
          </span>
        </div>
      </div>
    </div>
  );
}

export default Loading;