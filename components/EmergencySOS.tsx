import React, { useState, useEffect } from 'react';
import { ShieldAlert, X } from 'lucide-react';

const EmergencySOS: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [notified, setNotified] = useState(false);

  useEffect(() => {
    let interval: any;
    if (isActive && countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (isActive && countdown === 0) {
      setNotified(true);
    }
    return () => clearInterval(interval);
  }, [isActive, countdown]);

  const handleTrigger = () => {
    setIsActive(true);
    setCountdown(5);
    setNotified(false);
  };

  const handleCancel = () => {
    setIsActive(false);
    setCountdown(5);
    setNotified(false);
  };

  return (
    <>
      {/* Trigger Button - Always visible */}
      <button
        onClick={handleTrigger}
        className="fixed top-4 right-4 z-50 p-2 bg-red-600 rounded-full shadow-lg hover:bg-red-700 transition-colors border-2 border-white/20"
      >
        <ShieldAlert className="w-6 h-6 text-white" />
      </button>

      {/* SOS Overlay */}
      {isActive && (
        <div className="fixed inset-0 z-[100] bg-red-900/95 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-200">
          {!notified ? (
            <>
              <div className="w-32 h-32 rounded-full border-4 border-white flex items-center justify-center mb-8 animate-pulse">
                <span className="text-6xl font-bold text-white">{countdown}</span>
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">SENDING SOS</h2>
              <p className="text-white/80 mb-8 text-lg">
                Notifying Police and Emergency Contacts in simulated Zimbabwe Network...
              </p>
              <button
                onClick={handleCancel}
                className="px-8 py-4 bg-white text-red-900 font-bold rounded-full text-xl shadow-xl hover:scale-105 transition-transform"
              >
                CANCEL
              </button>
            </>
          ) : (
            <>
              <ShieldAlert className="w-24 h-24 text-white mb-6" />
              <h2 className="text-3xl font-bold text-white mb-4">HELP IS ON THE WAY</h2>
              <p className="text-white/80 mb-8">
                Location shared with ZRP & Trusted Contacts.
                <br />
                Stay calm. Do not exit the vehicle if unsafe.
              </p>
              <button
                onClick={handleCancel}
                className="px-6 py-2 border border-white/30 text-white rounded-full hover:bg-white/10"
              >
                Close
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default EmergencySOS;