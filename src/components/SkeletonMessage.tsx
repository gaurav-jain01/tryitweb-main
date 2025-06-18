import React from 'react';
import { ThreeDots } from 'react-loader-spinner';

const SkeletonMessage: React.FC = () => {
  return (
    <div className="flex mb-6 animate-fade-in justify-start">
      <div className="flex-1 max-w-4xl">
        <div className="flex items-start gap-4 p-4 bg-bg-secondary rounded-lg border border-border-color shadow-sm">
          <div className="flex-shrink-0 w-8 h-8 bg-accent-primary rounded-full flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.11 3.89 23 5 23H19C20.11 23 21 22.11 21 21V9ZM19 9H14V4H5V21H19V9Z" fill="currentColor"/>
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <div className="font-semibold text-text-primary">Tryit</div>
              <div className="text-text-muted">
                <ThreeDots 
                  height="12" 
                  width="12" 
                  radius="6"
                  color="currentColor" 
                  ariaLabel="thinking"
                  visible={true}
                />
              </div>
            </div>
            <div className="text-text-primary">
              <div className="flex items-center gap-1 py-2">
                <div className="w-2 h-2 bg-text-muted rounded-full animate-typing"></div>
                <div className="w-2 h-2 bg-text-muted rounded-full animate-typing" style={{ animationDelay: '-0.16s' }}></div>
                <div className="w-2 h-2 bg-text-muted rounded-full animate-typing" style={{ animationDelay: '-0.32s' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonMessage; 