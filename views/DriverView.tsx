import React, { useState } from 'react';
import { Menu, Wallet, MapPin, Navigation, Bell, TriangleAlert, DollarSign, Send, Shield, CheckCircle, User, X } from 'lucide-react';
import { UserMode, Alert } from '../types';
import { MOCK_ALERTS } from '../constants';
import MapSimulation from '../components/MapSimulation';

interface DriverViewProps {
  walletBalance: number;
  setWalletBalance: (amount: number) => void;
  toggleMenu: () => void;
  userMode: UserMode;
}

interface Trip {
  id: string;
  passengerName: string;
  location: string;
  distance: string;
  fare: number;
  status: 'ACCEPTED' | 'ARRIVED' | 'COMPLETED';
}

const DriverView: React.FC<DriverViewProps> = ({ walletBalance, setWalletBalance, toggleMenu, userMode }) => {
  const [activeTab, setActiveTab] = useState<'RADAR' | 'WALLET' | 'ALERTS'>('RADAR');
  const [changeAmount, setChangeAmount] = useState('');
  const [alerts, setAlerts] = useState<Alert[]>(MOCK_ALERTS);
  const [currentTrip, setCurrentTrip] = useState<Trip | null>(null);

  const handleIssueChange = () => {
    const amount = parseFloat(changeAmount);
    if (!isNaN(amount) && amount > 0) {
      setWalletBalance(walletBalance + amount);
      setChangeAmount('');
      alert(`Sent $${amount.toFixed(2)} change to passenger!`);
    }
  };

  const reportAlert = (type: 'POLICE' | 'TRAFFIC' | 'ACCIDENT') => {
    const newAlert: Alert = {
      id: Date.now().toString(),
      type,
      location: 'Current Location',
      time: 'Just now'
    };
    setAlerts([newAlert, ...alerts]);
  };

  const handleAcceptRide = (pickupId: string) => {
    // Mock passenger data based on which pin was clicked
    const isWestgate = pickupId === 'pickup_westgate';
    setCurrentTrip({
      id: pickupId,
      passengerName: isWestgate ? 'Tendai M.' : 'Grace K.',
      location: isWestgate ? 'Westgate Roundabout' : 'Avondale Shops',
      distance: isWestgate ? '2.4 km' : '1.1 km',
      fare: isWestgate ? 4.00 : 2.50,
      status: 'ACCEPTED'
    });
  };

  const handleCompleteTrip = () => {
    if (currentTrip) {
      // Logic to add fare to wallet could go here
      setCurrentTrip(null);
    }
  };

  return (
    <div className="relative h-full w-full bg-zinc-900 overflow-hidden flex flex-col">
      {/* Background Map (Always Visible for Radar) */}
      <div className="absolute inset-0">
        <MapSimulation 
          mode={userMode} 
          onPickupClick={handleAcceptRide}
        />
      </div>

      {/* Top Header */}
      <div className="absolute top-0 left-0 right-0 p-4 z-30 flex justify-between items-center pointer-events-none">
        <button onClick={toggleMenu} className="p-3 bg-black/80 backdrop-blur-md rounded-full text-white shadow-lg pointer-events-auto hover:bg-black">
          <Menu className="w-6 h-6" />
        </button>
        <div className={`px-4 py-2 backdrop-blur-md rounded-full border shadow-lg flex items-center gap-2 pointer-events-auto transition-colors ${currentTrip ? 'bg-blue-600/90 border-blue-400' : 'bg-black/80 border-green-500/30'}`}>
           <div className={`w-2 h-2 rounded-full ${currentTrip ? 'bg-white animate-ping' : 'bg-green-500 animate-pulse'}`} />
           <span className={`${currentTrip ? 'text-white' : 'text-green-500'} font-bold text-sm`}>
             {currentTrip ? 'BUSY' : 'ONLINE'}
           </span>
        </div>
      </div>

      {/* Main Content Area - changes based on Tab */}
      <div className="flex-1 relative z-20 pointer-events-none">
        
        {/* RADAR / NAVIGATION OVERLAY */}
        {activeTab === 'RADAR' && (
           <div className="absolute bottom-24 left-4 right-4 pointer-events-auto">
              {currentTrip ? (
                // ACTIVE TRIP CARD
                <div className="bg-zinc-900/95 backdrop-blur-xl p-0 rounded-2xl border border-blue-500/30 shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300">
                   {/* Trip Header */}
                   <div className="bg-blue-600 p-4 flex justify-between items-center">
                      <div className="flex items-center gap-2 text-white">
                         <Navigation className="w-5 h-5 animate-pulse" />
                         <span className="font-bold uppercase tracking-wider text-sm">Navigating to Pickup</span>
                      </div>
                      <span className="text-white font-bold">{currentTrip.distance}</span>
                   </div>
                   
                   <div className="p-4">
                      {/* Passenger Details */}
                      <div className="flex items-center gap-4 mb-6">
                         <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center border-2 border-white/20">
                            <User className="w-6 h-6 text-gray-300" />
                         </div>
                         <div>
                            <h3 className="text-xl font-bold text-white">{currentTrip.passengerName}</h3>
                            <p className="text-gray-400 text-sm flex items-center gap-1">
                               <MapPin className="w-3 h-3" /> {currentTrip.location}
                            </p>
                         </div>
                         <div className="ml-auto text-right">
                            <span className="block text-green-400 font-bold text-xl">${currentTrip.fare.toFixed(2)}</span>
                            <span className="text-xs text-gray-500">Est. Fare</span>
                         </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                         <button 
                           onClick={() => setCurrentTrip(null)}
                           className="px-4 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold transition-colors"
                         >
                            <X className="w-5 h-5" />
                         </button>
                         <button 
                           onClick={handleCompleteTrip}
                           className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
                         >
                            <CheckCircle className="w-5 h-5" />
                            Arrived / Complete
                         </button>
                      </div>
                   </div>
                </div>
              ) : (
                // SCANNING CARD
                <div className="bg-black/80 backdrop-blur-md p-4 rounded-xl border border-white/10 shadow-2xl flex items-center justify-between animate-pulse">
                   <div>
                      <h3 className="text-white font-bold">Scanning Area...</h3>
                      <p className="text-gray-400 text-sm">Tap a red pin to accept ride</p>
                   </div>
                   <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center">
                      <Navigation className="w-6 h-6 text-orange-500 animate-[spin_3s_linear_infinite]" />
                   </div>
                </div>
              )}
           </div>
        )}

        {activeTab === 'WALLET' && (
           <div className="absolute inset-0 bg-black/90 backdrop-blur-xl p-6 pt-24 pointer-events-auto animate-in fade-in">
              <h2 className="text-2xl font-bold text-white mb-6">Digital Change Wallet</h2>
              
              <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 p-6 rounded-2xl border border-white/10 mb-8">
                 <p className="text-gray-400 mb-1">Current App Balance</p>
                 <div className="flex items-start gap-1">
                   <span className="text-2xl font-bold text-green-500">$</span>
                   <span className="text-5xl font-bold text-white">{walletBalance.toFixed(2)}</span>
                 </div>
              </div>

              <div className="space-y-4">
                 <label className="text-gray-300 font-medium">Issue Change to Passenger</label>
                 <div className="flex gap-2">
                    <div className="relative flex-1">
                       <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                       <input 
                         type="number" 
                         value={changeAmount}
                         onChange={(e) => setChangeAmount(e.target.value)}
                         placeholder="0.00"
                         className="w-full bg-zinc-800 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white text-lg focus:ring-2 focus:ring-green-500 outline-none"
                       />
                    </div>
                    <button 
                      onClick={handleIssueChange}
                      className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-xl flex items-center justify-center transition-colors"
                    >
                       <Send className="w-6 h-6" />
                    </button>
                 </div>
                 <p className="text-xs text-gray-500">
                    Entering an amount here will deduct from your earnings and instantly credit the passenger's app for their next ride.
                 </p>
              </div>
           </div>
        )}

        {activeTab === 'ALERTS' && (
           <div className="absolute inset-0 bg-black/90 backdrop-blur-xl p-6 pt-24 pointer-events-auto animate-in fade-in overflow-y-auto">
              <h2 className="text-2xl font-bold text-white mb-6">Road Alerts</h2>
              
              <div className="grid grid-cols-3 gap-3 mb-8">
                 <button onClick={() => reportAlert('POLICE')} className="flex flex-col items-center gap-2 p-4 bg-blue-900/30 border border-blue-500/30 rounded-xl hover:bg-blue-900/50">
                    <Shield className="w-8 h-8 text-blue-400" />
                    <span className="text-xs font-bold text-blue-400">POLICE</span>
                 </button>
                 <button onClick={() => reportAlert('TRAFFIC')} className="flex flex-col items-center gap-2 p-4 bg-orange-900/30 border border-orange-500/30 rounded-xl hover:bg-orange-900/50">
                    <TriangleAlert className="w-8 h-8 text-orange-400" />
                    <span className="text-xs font-bold text-orange-400">TRAFFIC</span>
                 </button>
                 <button onClick={() => reportAlert('ACCIDENT')} className="flex flex-col items-center gap-2 p-4 bg-red-900/30 border border-red-500/30 rounded-xl hover:bg-red-900/50">
                    <TriangleAlert className="w-8 h-8 text-red-400" />
                    <span className="text-xs font-bold text-red-400">ACCIDENT</span>
                 </button>
              </div>

              <h3 className="text-lg font-bold text-gray-300 mb-4">Recent Reports</h3>
              <div className="space-y-3">
                 {alerts.map(alert => (
                    <div key={alert.id} className="flex items-start gap-4 p-4 bg-white/5 rounded-xl border border-white/5">
                       <div className={`p-2 rounded-full ${
                          alert.type === 'POLICE' ? 'bg-blue-500/20 text-blue-400' :
                          alert.type === 'TRAFFIC' ? 'bg-orange-500/20 text-orange-400' :
                          'bg-red-500/20 text-red-400'
                       }`}>
                          <TriangleAlert className="w-5 h-5" />
                       </div>
                       <div>
                          <p className="font-bold text-white">{alert.type} REPORTED</p>
                          <p className="text-sm text-gray-400">{alert.location}</p>
                          <p className="text-xs text-gray-600 mt-1">{alert.time}</p>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        )}
      </div>

      {/* Bottom Navigation Tabs - HIDDEN WHEN TRIP IS ACTIVE */}
      {!currentTrip && (
        <div className="absolute bottom-0 left-0 right-0 bg-black/90 backdrop-blur-md border-t border-white/10 p-2 z-30 flex justify-around items-center pb-6">
          <button 
            onClick={() => setActiveTab('RADAR')}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-colors ${activeTab === 'RADAR' ? 'text-green-500 bg-white/10' : 'text-gray-500 hover:text-white'}`}
          >
              <Navigation className="w-6 h-6" />
              <span className="text-[10px] font-bold">RADAR</span>
          </button>

          <button 
            onClick={() => setActiveTab('WALLET')}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-colors ${activeTab === 'WALLET' ? 'text-green-500 bg-white/10' : 'text-gray-500 hover:text-white'}`}
          >
              <Wallet className="w-6 h-6" />
              <span className="text-[10px] font-bold">WALLET</span>
          </button>

          <button 
            onClick={() => setActiveTab('ALERTS')}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-colors ${activeTab === 'ALERTS' ? 'text-green-500 bg-white/10' : 'text-gray-500 hover:text-white'}`}
          >
              <Bell className="w-6 h-6" />
              <span className="text-[10px] font-bold">ALERTS</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default DriverView;