import React, { useState } from 'react';
import { UserMode } from './types';
import PassengerView from './views/PassengerView';
import DriverView from './views/DriverView';
import EmergencySOS from './components/EmergencySOS';
import { Bus, Car, Truck, ChevronRight } from 'lucide-react';

const App: React.FC = () => {
  const [userMode, setUserMode] = useState<UserMode>(UserMode.LANDING);
  const [walletBalance, setWalletBalance] = useState(5.00); // Global simulated wallet
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleModeSelect = (mode: UserMode) => {
    setUserMode(mode);
  };

  const handleLogout = () => {
    setUserMode(UserMode.LANDING);
    setIsMenuOpen(false);
  };

  return (
    <div className="relative w-full h-screen bg-zinc-900 text-white overflow-hidden font-sans">
      {/* Global Emergency Button (Always available) */}
      <EmergencySOS />

      {/* VIEW: LANDING PAGE */}
      {userMode === UserMode.LANDING && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-gradient-to-br from-green-900 via-black to-zinc-900 animate-in fade-in">
          <div className="w-full max-w-md space-y-8 text-center">
            <div className="space-y-2">
              <h1 className="text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">
                TAKAENDA
              </h1>
              <p className="text-gray-400 text-lg">Move freely. Safe & Reliable.</p>
            </div>

            <div className="grid gap-4 mt-12">
              <button
                onClick={() => handleModeSelect(UserMode.PASSENGER)}
                className="group relative overflow-hidden p-6 bg-white rounded-2xl shadow-2xl transition-all hover:scale-[1.02] text-left"
              >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                   <Bus className="w-24 h-24 text-black" />
                </div>
                <h3 className="text-2xl font-bold text-black mb-1">Passenger</h3>
                <p className="text-gray-600 font-medium">Book a Kombi, Bus or Taxi</p>
                <div className="mt-4 flex items-center gap-2 text-black font-bold text-sm">
                  START RIDING <ChevronRight className="w-4 h-4" />
                </div>
              </button>

              <button
                onClick={() => handleModeSelect(UserMode.DRIVER)}
                className="group relative overflow-hidden p-6 bg-zinc-800 rounded-2xl shadow-2xl transition-all hover:scale-[1.02] text-left border border-white/10"
              >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                   <Car className="w-24 h-24 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-1">Driver</h3>
                <p className="text-gray-400 font-medium">Find passengers & Earn</p>
                <div className="mt-4 flex items-center gap-2 text-green-400 font-bold text-sm">
                  GO ONLINE <ChevronRight className="w-4 h-4" />
                </div>
              </button>
            </div>
          </div>
          
          <div className="absolute bottom-6 text-gray-600 text-xs">
            Powered by Zimbabwe Innovation
          </div>
        </div>
      )}

      {/* VIEW: PASSENGER MODE */}
      {userMode === UserMode.PASSENGER && (
        <PassengerView 
          walletBalance={walletBalance} 
          toggleMenu={toggleMenu} 
          userMode={userMode}
        />
      )}

      {/* VIEW: DRIVER MODE */}
      {userMode === UserMode.DRIVER && (
        <DriverView 
          walletBalance={walletBalance} 
          setWalletBalance={setWalletBalance}
          toggleMenu={toggleMenu}
          userMode={userMode}
        />
      )}

      {/* SHARED: SIDE MENU */}
      {isMenuOpen && (
        <div className="absolute inset-0 z-50 flex">
          <div className="w-3/4 max-w-xs bg-zinc-900 h-full shadow-2xl border-r border-white/10 p-6 flex flex-col animate-in slide-in-from-left duration-300">
             <h2 className="text-2xl font-bold mb-8 text-green-400">Takaenda</h2>
             
             <div className="space-y-6 flex-1">
                <div className="flex items-center gap-3 text-white/80">
                   <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                     <span className="font-bold">ME</span>
                   </div>
                   <div>
                      <p className="font-bold">{userMode === UserMode.PASSENGER ? 'My Profile' : 'Driver Profile'}</p>
                      <p className="text-xs text-gray-400">+263 77 123 4567</p>
                   </div>
                </div>
                
                <hr className="border-white/10" />
                
                <button className="w-full text-left py-2 text-gray-300 hover:text-white">Trip History</button>
                <button className="w-full text-left py-2 text-gray-300 hover:text-white">Payment Methods</button>
                <button className="w-full text-left py-2 text-gray-300 hover:text-white">Support</button>
             </div>

             <button 
              onClick={handleLogout}
              className="mt-auto py-3 px-4 bg-red-600/20 text-red-400 rounded-xl font-bold text-center hover:bg-red-600/30"
             >
               Exit Mode
             </button>
          </div>
          <div className="flex-1 bg-black/50 backdrop-blur-sm" onClick={toggleMenu} />
        </div>
      )}
    </div>
  );
};

export default App;