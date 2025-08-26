import React from 'react';
import loadable from '@loadable/component';
import { LoaderIcon } from 'lucide-react';

// Loading component with theme styling
const LoadingComponent: React.FC = () => (
  <div className="flex items-center justify-center min-h-[200px]">
    <div className="flex flex-col items-center gap-4">
      <LoaderIcon className="w-8 h-8 text-[#0077B6] animate-spin" />
      <span className="text-[#1E3E72] font-subtitles">Loading...</span>
    </div>
  </div>
);

// Enhanced loadable function with consistent loading and error states
export const createLoadableComponent = (importFunc: () => Promise<{ default: React.ComponentType<any> }>) => {
  return loadable(importFunc, {
    fallback: <LoadingComponent />,
  });
};

// Specific loadable components for different page types
export const LoadablePage = (importFunc: () => Promise<{ default: React.ComponentType<any> }>) =>
  createLoadableComponent(importFunc);

export const LoadableModal = (importFunc: () => Promise<{ default: React.ComponentType<any> }>) =>
  loadable(importFunc, {
    fallback: (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-8 border border-[#90E0EF]/30 shadow-lg">
          <LoadingComponent />
        </div>
      </div>
    ),
  });

export default createLoadableComponent; 