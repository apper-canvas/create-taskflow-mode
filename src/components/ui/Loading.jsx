import React from "react";

const Loading = () => {
  return (
    <div className="flex-1 p-6 space-y-4">
      {/* Search bar skeleton */}
      <div className="w-full h-10 bg-gray-200 rounded-lg animate-pulse"></div>
      
      {/* Filter buttons skeleton */}
      <div className="flex gap-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="w-20 h-8 bg-gray-200 rounded-full animate-pulse"></div>
        ))}
      </div>
      
      {/* Task cards skeleton */}
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="bg-surface rounded-lg border border-gray-200 p-4 animate-pulse">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 bg-gray-200 rounded"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-5 bg-gray-200 rounded-full"></div>
                  <div className="w-20 h-5 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Loading;