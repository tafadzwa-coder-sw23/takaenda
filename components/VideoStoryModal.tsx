import React, { useEffect, useState } from 'react';
import { X, CheckCircle } from 'lucide-react';
import { Driver } from '../types';

interface VideoStoryModalProps {
  driver: Driver;
  onClose: () => void;
  onVerified: () => void;
}

const VideoStoryModal: React.FC<VideoStoryModalProps> = ({ driver, onClose, onVerified }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 50); // 2.5 seconds duration
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      {/* Progress Bar */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gray-800 z-20">
        <div 
          className="h-full bg-white transition-all duration-75 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Header */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden border-2 border-green-500">
            <img src={`https://ui-avatars.com/api/?name=${driver.name}&background=random`} alt="Driver" />
          </div>
          <div>
            <p className="text-white font-bold text-sm">{driver.name}</p>
            <p className="text-gray-300 text-xs">{driver.vehiclePlate} • Today 06:30 AM</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 bg-black/20 rounded-full backdrop-blur-md">
          <X className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* "Video" Content (Simulated) */}
      <div className="flex-1 relative bg-zinc-900 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/40 z-10"></div>
        {/* Simulated Vehicle Interior */}
        <div className="w-full h-full bg-gray-800 relative animate-pulse">
          <div className="absolute inset-0 flex items-center justify-center text-white/20 font-bold text-4xl rotate-12">
            VIDEO FEED
          </div>
           <img 
            src="https://picsum.photos/600/900?grayscale" 
            className="w-full h-full object-cover opacity-60"
            alt="Vehicle Interior"
          />
        </div>
        
        <div className="absolute bottom-24 left-6 z-20">
          <div className="bg-green-600/80 backdrop-blur-md px-4 py-2 rounded-xl border border-green-400/30 flex items-center gap-2">
             <CheckCircle className="w-5 h-5 text-white" />
             <span className="text-white font-medium text-sm">Vehicle Condition Verified</span>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-6 bg-black z-20 pb-8">
        <button 
          onClick={onVerified}
          className="w-full py-4 bg-white text-black font-bold rounded-xl active:scale-95 transition-transform"
        >
          Confirm & Book Ride
        </button>
      </div>
    </div>
  );
};

export default VideoStoryModal;