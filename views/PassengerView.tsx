
import React, { useState, useEffect } from 'react';
import { Menu, Search, Navigation, Wallet, QrCode, Share2, Wifi, WifiOff, User, Users, CheckCircle, Clock, MapPin, AlertCircle, Play, PlayCircle, X, CloudOff, RefreshCw, ArrowLeft } from 'lucide-react';
import { MOCK_RIDES } from '../constants';
import { Ride, RideStatus, UserMode } from '../types';
import MapSimulation from '../components/MapSimulation';
import VideoStoryModal from '../components/VideoStoryModal';

interface PassengerViewProps {
  walletBalance: number;
  toggleMenu: () => void;
  userMode: UserMode;
}

const PassengerView: React.FC<PassengerViewProps> = ({ walletBalance, toggleMenu, userMode }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isOffline, setIsOffline] = useState(false);
  // Initialize rides from constants but keep them in state to allow simulation of seat updates
  const [availableRides, setAvailableRides] = useState<Ride[]>(MOCK_RIDES);
  const [selectedRide, setSelectedRide] = useState<Ride | null>(null);
  const [bookingStep, setBookingStep] = useState<'SEARCH' | 'DETAILS' | 'CONFIRMED'>('SEARCH');
  const [showVideoStory, setShowVideoStory] = useState(false);
  const [passengers, setPassengers] = useState(1);
  const [splitBill, setSplitBill] = useState(false);
  const [rideStatus, setRideStatus] = useState<RideStatus>(RideStatus.AVAILABLE);
  
  // New state for offline booking synchronization
  const [pendingSync, setPendingSync] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Filter rides based on search from availableRides state
  const filteredRides = searchQuery 
    ? availableRides.filter(r => r.route.toLowerCase().includes(searchQuery.toLowerCase()))
    : availableRides; 

  // Simulate ride status updates (ONLY if online and confirmed)
  useEffect(() => {
    if (bookingStep === 'CONFIRMED' && !pendingSync && !isSyncing) {
      setRideStatus(RideStatus.CONFIRMED);
      
      const t1 = setTimeout(() => setRideStatus(RideStatus.APPROACHING), 4000);
      const t2 = setTimeout(() => setRideStatus(RideStatus.ARRIVED), 10000);
      const t3 = setTimeout(() => setRideStatus(RideStatus.ON_TRIP), 15000);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    } else if (bookingStep !== 'CONFIRMED') {
      setRideStatus(RideStatus.AVAILABLE);
    }
  }, [bookingStep, pendingSync, isSyncing]);

  // Handle Offline Syncing Logic
  useEffect(() => {
    if (!isOffline && pendingSync) {
      // Network restored, trigger sync
      setIsSyncing(true);
      
      // Simulate API call to sync booking
      setTimeout(() => {
        setIsSyncing(false);
        setPendingSync(false);
        // Ride status effect will now pick up and start the "Approaching" simulation
      }, 2500);
    }
  }, [isOffline, pendingSync]);

  const handleRideSelect = (ride: Ride) => {
    if (ride.seatsLeft === 0) return; // Prevent selecting full rides
    setSelectedRide(ride);
    setPassengers(1); // Reset passenger count
    setSplitBill(false);
    setBookingStep('DETAILS');
  };

  const handleConfirmBooking = () => {
    if (selectedRide) {
      // Update available seats in the local state
      const updatedRides = availableRides.map(ride => {
        if (ride.id === selectedRide.id) {
          return {
            ...ride,
            seatsLeft: Math.max(0, ride.seatsLeft - passengers)
          };
        }
        return ride;
      });
      setAvailableRides(updatedRides);
      
      // Check offline status logic
      if (isOffline) {
        setPendingSync(true); // Flag as pending sync
      }
      
      setBookingStep('CONFIRMED');
    }
  };

  const handleBack = () => {
    if (bookingStep === 'DETAILS') {
      setSelectedRide(null);
      setBookingStep('SEARCH');
    } else if (bookingStep === 'CONFIRMED') {
       setBookingStep('SEARCH');
       setSelectedRide(null);
       setPendingSync(false); // Reset pending state on exit
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const renderStatusPill = () => {
    if (bookingStep !== 'CONFIRMED') return null;

    // 1. OFFLINE / PENDING SYNC STATE
    if (pendingSync) {
      return (
        <div className="absolute top-40 left-4 right-4 z-40 p-4 rounded-2xl shadow-2xl flex items-center justify-between text-white transition-all duration-500 border border-yellow-500/30 backdrop-blur-md bg-yellow-600/90 animate-in slide-in-from-top-4">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-black/20 rounded-full backdrop-blur-sm">
              <CloudOff className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-lg leading-none">Ticket Saved Offline</p>
              <p className="text-xs text-white/90 mt-1 font-medium">Will sync when online. Boarding valid.</p>
            </div>
          </div>
        </div>
      );
    }

    // 2. SYNCING STATE
    if (isSyncing) {
       return (
        <div className="absolute top-40 left-4 right-4 z-40 p-4 rounded-2xl shadow-2xl flex items-center justify-between text-white transition-all duration-500 border border-blue-500/30 backdrop-blur-md bg-blue-600/90 animate-in slide-in-from-top-4">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-black/20 rounded-full backdrop-blur-sm">
              <RefreshCw className="w-5 h-5 text-white animate-spin" />
            </div>
            <div>
              <p className="font-bold text-lg leading-none">Syncing Booking...</p>
              <p className="text-xs text-white/90 mt-1 font-medium">Updating driver with your details</p>
            </div>
          </div>
        </div>
      );
    }

    // 3. LIVE STATUS STATE (Standard)
    let text = '';
    let subtext = '';
    let colorClass = '';
    let icon = null;
    let progressWidth = '0%';

    switch (rideStatus) {
      case RideStatus.CONFIRMED:
        text = 'Driver Confirmed';
        subtext = 'Preparing to head your way';
        colorClass = 'bg-blue-600';
        icon = <CheckCircle className="w-5 h-5" />;
        progressWidth = '25%';
        break;
      case RideStatus.APPROACHING:
        text = 'Driver Approaching';
        subtext = 'Arriving in 2 mins';
        colorClass = 'bg-orange-500';
        icon = <Navigation className="w-5 h-5 animate-bounce" />;
        progressWidth = '50%';
        break;
      case RideStatus.ARRIVED:
        text = 'Driver Arrived';
        subtext = 'Meet at pickup point';
        colorClass = 'bg-green-600';
        icon = <MapPin className="w-5 h-5" />;
        progressWidth = '75%';
        break;
      case RideStatus.ON_TRIP:
        text = 'On Trip';
        subtext = 'Heading to destination';
        colorClass = 'bg-purple-600';
        icon = <Clock className="w-5 h-5 animate-spin" />;
        progressWidth = '100%';
        break;
      default:
        return null;
    }

    return (
      <div className={`absolute top-40 left-4 right-4 z-40 p-4 rounded-2xl shadow-2xl flex items-center justify-between text-white transition-all duration-500 border border-white/10 backdrop-blur-md ${colorClass} animate-in slide-in-from-top-4`}>
        <div className="flex items-center gap-4">
          <div className="p-2 bg-white/20 rounded-full backdrop-blur-sm">
            {icon}
          </div>
          <div>
            <p className="font-bold text-lg leading-none">{text}</p>
            <p className="text-xs text-white/80 mt-1 font-medium">{subtext}</p>
          </div>
        </div>
        
        {/* Visual Progress Ring */}
        <div className="w-12 h-12 relative flex items-center justify-center">
             <svg className="w-full h-full -rotate-90">
                <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeOpacity="0.2" strokeWidth="4" />
                <circle 
                  cx="24" cy="24" r="20" 
                  fill="none" stroke="white" strokeWidth="4" 
                  strokeDasharray="125" 
                  strokeDashoffset={125 - (parseInt(progressWidth) / 100 * 125)} 
                  className="transition-all duration-1000 ease-out"
                />
             </svg>
        </div>
      </div>
    );
  };

  return (
    <div className="relative h-full w-full bg-zinc-900 overflow-hidden">
      {/* Background Map */}
      <div className={`absolute inset-0 transition-opacity duration-500 ${isOffline ? 'opacity-50 grayscale' : 'opacity-100'}`}>
        <MapSimulation mode={userMode} rides={filteredRides} onRideClick={handleRideSelect} selectedRideId={selectedRide?.id} />
      </div>

      {/* --- UNIFIED HEADER & SEARCH BAR (Google Maps Style) --- */}
      <div className="absolute top-0 left-0 right-0 z-50 p-4 flex flex-col gap-3 pointer-events-none">
         
         {/* Row 1: Search Input Card */}
         {bookingStep === 'SEARCH' && (
           <div className="pointer-events-auto bg-white rounded-full shadow-2xl p-2 pl-3 flex items-center gap-3 animate-in slide-in-from-top duration-300 ring-1 ring-black/5">
              {/* Menu Button (Integrated) */}
              <button 
                onClick={toggleMenu} 
                className="p-2 hover:bg-gray-100 rounded-full transition-colors active:scale-95"
              >
                <Menu className="w-6 h-6 text-gray-700" />
              </button>
              
              {/* Input Field */}
              <div className="flex-1 flex items-center">
                 <div className={`w-2 h-2 rounded-full mr-3 ${isOffline ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`} />
                 <input 
                   type="text" 
                   placeholder={isOffline ? "Offline Mode - Search Routes..." : "Where to? (e.g. Westgate)"}
                   className="w-full bg-transparent outline-none text-gray-900 font-medium placeholder:text-gray-500 text-lg"
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                 />
              </div>

              {/* Clear/Search Action */}
              <div className="pr-2">
                 {searchQuery ? (
                    <button onClick={clearSearch} className="p-2 bg-gray-200 rounded-full hover:bg-gray-300">
                       <X className="w-4 h-4 text-gray-600" />
                    </button>
                 ) : (
                    <div className="p-2 bg-blue-600 rounded-full text-white shadow-md">
                       <Search className="w-4 h-4" />
                    </div>
                 )}
              </div>
           </div>
         )}

         {/* Row 2: Contextual Status Chips (Always Visible below search) */}
         <div className="pointer-events-auto flex items-center gap-2 overflow-x-auto hide-scrollbar px-1">
             {/* Mode Toggle */}
             <button 
               onClick={() => setIsOffline(!isOffline)}
               className={`flex-shrink-0 flex items-center gap-2 px-4 py-1.5 rounded-full shadow-lg border backdrop-blur-md transition-all active:scale-95 ${
                 isOffline 
                 ? 'bg-red-500 text-white border-red-400' 
                 : 'bg-white text-green-700 border-white/20'
               }`}
             >
               {isOffline ? <WifiOff className="w-3.5 h-3.5" /> : <Wifi className="w-3.5 h-3.5" />}
               <span className="text-xs font-bold tracking-wide">{isOffline ? 'OFFLINE' : 'ONLINE'}</span>
             </button>

             {/* Wallet Chip */}
             <div className="flex-shrink-0 bg-zinc-900/90 backdrop-blur-md text-white px-4 py-1.5 rounded-full shadow-lg border border-white/10 flex items-center gap-2">
                 <Wallet className="w-3.5 h-3.5 text-green-400" />
                 <span className="text-xs font-bold">${walletBalance.toFixed(2)}</span>
             </div>

             {/* Booking State Back Button (When not searching) */}
             {bookingStep !== 'SEARCH' && (
               <button 
                 onClick={handleBack}
                 className="flex-shrink-0 bg-white text-black px-4 py-1.5 rounded-full shadow-lg border border-white/20 flex items-center gap-2 font-bold text-xs"
               >
                 <ArrowLeft className="w-3.5 h-3.5" />
                 BACK TO MAP
               </button>
             )}
         </div>
      </div>


      {/* Ride Status Pill (Pushed down slightly to accommodate new header) */}
      {renderStatusPill()}

      {/* Bottom Sheet Container */}
      <div className="absolute inset-x-0 bottom-0 z-40 flex flex-col justify-end pointer-events-none">
        
        {/* STEP 1: RIDE RESULTS LIST (SEARCH) */}
        {bookingStep === 'SEARCH' && (
          <div className="w-full p-4 pointer-events-auto">
            {/* Results List */}
            <div className="bg-zinc-900/95 backdrop-blur-xl border border-white/10 rounded-3xl max-h-[50vh] overflow-y-auto hide-scrollbar shadow-2xl">
                {/* Handle / Header */}
                <div className="sticky top-0 bg-zinc-900/95 backdrop-blur-md p-4 border-b border-white/5 z-10">
                   <div className="w-12 h-1 bg-gray-700 rounded-full mx-auto mb-2" />
                   <div className="flex justify-between items-center">
                      <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider">
                        {isOffline ? 'Offline Results (Cached)' : (searchQuery ? 'Search Results' : 'Nearby Rides')}
                      </h3>
                      {isOffline && (
                        <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-1 rounded font-bold">
                          OFFLINE
                        </span>
                      )}
                   </div>
                </div>

                <div className="p-2 space-y-2 pb-4">
                  {filteredRides.length > 0 ? (
                    filteredRides.map(ride => (
                      <div 
                        key={ride.id} 
                        onClick={() => handleRideSelect(ride)}
                        className={`p-4 rounded-2xl border transition-all flex justify-between items-center group ${
                          ride.seatsLeft === 0 
                          ? 'bg-white/5 border-white/5 opacity-60 cursor-not-allowed' 
                          : 'bg-white/5 hover:bg-white/10 border-white/5 active:scale-98 cursor-pointer'
                        }`}
                      >
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                              ride.type === 'BUS' ? 'bg-blue-900/30 text-blue-400 group-hover:bg-blue-900/50' : 
                              ride.type === 'KOMBI' ? 'bg-orange-900/30 text-orange-400 group-hover:bg-orange-900/50' : 'bg-zinc-800 text-gray-400 group-hover:bg-zinc-700'
                            }`}>
                              {ride.type === 'BUS' ? <Users className="w-6 h-6"/> : <User className="w-6 h-6"/>}
                            </div>
                            <div>
                                <h3 className="font-bold text-white text-lg">{ride.route}</h3>
                                <p className="text-gray-400 text-sm flex items-center gap-1">
                                  <span className="capitalize">{ride.type.toLowerCase()}</span> • {ride.driver.vehicleModel} • <span className="text-green-400">{ride.eta} min</span>
                                </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-xl text-white">${ride.price.toFixed(2)}</p>
                            {ride.seatsLeft === 0 ? (
                              <p className="text-xs font-bold text-red-500 uppercase tracking-wider">Sold Out</p>
                            ) : (
                              <p className={`text-xs ${ride.seatsLeft < 3 ? 'text-orange-400 font-bold' : 'text-gray-500'}`}>
                                {ride.seatsLeft} seats left
                              </p>
                            )}
                          </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center p-8 text-gray-500">
                      No rides found matching "{searchQuery}".
                    </div>
                  )}
                </div>
            </div>
          </div>
        )}

        {/* STEP 2: RIDE DETAILS & CONFIRMATION */}
        {bookingStep === 'DETAILS' && selectedRide && (
          <div className="w-full bg-zinc-900/95 backdrop-blur-xl border-t border-white/10 rounded-t-3xl shadow-2xl animate-in slide-in-from-bottom duration-300 pointer-events-auto">
             <div className="p-6">
                {/* Drag Handle */}
                <div className="w-12 h-1 bg-gray-700 rounded-full mx-auto mb-6" />
                
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                   <div>
                      <h2 className="text-2xl font-bold text-white mb-1">{selectedRide.route}</h2>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 text-xs font-bold rounded uppercase ${
                          selectedRide.type === 'BUS' ? 'bg-blue-600/20 text-blue-400' :
                          selectedRide.type === 'KOMBI' ? 'bg-orange-600/20 text-orange-400' : 'bg-gray-600/20 text-gray-400'
                        }`}>
                          {selectedRide.type}
                        </span>
                        <span className="text-gray-400 text-sm">• {selectedRide.eta} min pickup</span>
                        {isOffline && <span className="text-red-400 text-xs font-bold border border-red-500/30 px-1 rounded">OFFLINE BOOKING</span>}
                      </div>
                   </div>
                   <div className="text-right">
                      {passengers > 1 && splitBill ? (
                          <>
                             <p className="text-3xl font-bold text-white">${selectedRide.price.toFixed(2)}</p>
                             <p className="text-xs text-green-400 font-bold">per person</p>
                             <p className="text-[10px] text-gray-500">Total: ${(selectedRide.price * passengers).toFixed(2)}</p>
                          </>
                      ) : (
                          <>
                             <p className="text-3xl font-bold text-white">${(selectedRide.price * passengers).toFixed(2)}</p>
                             {passengers > 1 && <p className="text-xs text-gray-500">${selectedRide.price.toFixed(2)} each</p>}
                          </>
                      )}
                   </div>
                </div>

                {/* Driver Info with Story Ring */}
                <div className="flex items-center gap-4 p-4 bg-black/40 rounded-xl border border-white/5 mb-6">
                   <button 
                    onClick={() => selectedRide.driver.hasVideoStory && setShowVideoStory(true)}
                    className="relative group cursor-pointer"
                   >
                     <div className={`w-14 h-14 rounded-full p-[2px] transition-transform group-active:scale-95 ${selectedRide.driver.hasVideoStory ? 'bg-gradient-to-tr from-green-400 to-blue-500 animate-pulse-slow' : 'bg-gray-600'}`}>
                        <img 
                          src={`https://ui-avatars.com/api/?name=${selectedRide.driver.name}&background=random`} 
                          alt="Driver" 
                          className="w-full h-full rounded-full border-2 border-black"
                        />
                     </div>
                     {selectedRide.driver.hasVideoStory && (
                        <>
                          {/* Play Icon Overlay */}
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-full">
                            <Play className="w-5 h-5 text-white fill-white drop-shadow-md" />
                          </div>
                          {/* Indicator Dot */}
                          <div className="absolute -bottom-1 -right-1 bg-blue-600 rounded-full p-1 border border-black">
                            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                          </div>
                        </>
                     )}
                   </button>
                   <div className="flex-1">
                      <div className="flex items-center justify-between">
                         <div className="flex items-center gap-2">
                           <h3 className="font-bold text-white">{selectedRide.driver.name}</h3>
                           <span className="text-xs bg-green-500/20 text-green-400 px-1 rounded flex items-center">
                              ★ {selectedRide.driver.rating}
                           </span>
                         </div>
                         {/* Explicit Link to View Story */}
                         {selectedRide.driver.hasVideoStory && (
                            <button 
                              onClick={() => setShowVideoStory(true)}
                              className="text-xs text-blue-400 flex items-center gap-1 hover:text-blue-300 transition-colors"
                            >
                              <PlayCircle className="w-3 h-3" />
                              View Condition
                            </button>
                         )}
                      </div>
                      <p className="text-sm text-gray-400 mt-0.5">{selectedRide.driver.vehicleModel} • {selectedRide.driver.vehiclePlate}</p>
                   </div>
                   <div className="flex flex-col gap-1 items-end">
                      {selectedRide.driver.acceptedPayments.map(p => (
                        <span key={p} className="text-[10px] px-1.5 py-0.5 border border-white/20 rounded text-gray-300">{p}</span>
                      ))}
                   </div>
                </div>

                {/* Options */}
                <div className="space-y-4 mb-6">
                   {/* Passenger Counter */}
                   <div className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/10">
                      <div>
                        <span className="text-white font-bold block">Passengers</span>
                        <div className="flex items-center gap-2">
                           <span className={`text-xs ${selectedRide.seatsLeft < 4 ? 'text-orange-400 font-bold' : 'text-gray-400'}`}>
                             {selectedRide.seatsLeft} seats remaining
                           </span>
                           {selectedRide.seatsLeft === 0 && <span className="text-xs bg-red-500 text-white px-1 rounded">FULL</span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                         <button 
                           onClick={() => setPassengers(Math.max(1, passengers - 1))} 
                           className={`w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white transition-colors ${passengers <= 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white/20'}`}
                           disabled={passengers <= 1}
                         >
                           -
                         </button>
                         <span className="font-bold text-white text-xl w-6 text-center">{passengers}</span>
                         <button 
                           onClick={() => setPassengers(Math.min(selectedRide.seatsLeft, passengers + 1))} 
                           className={`w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white transition-colors ${passengers >= selectedRide.seatsLeft ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white/20'}`}
                           disabled={passengers >= selectedRide.seatsLeft}
                         >
                           +
                         </button>
                      </div>
                   </div>
                   
                   {/* Split Bill Toggle */}
                   {passengers > 1 && (
                       <div className="flex items-center justify-between cursor-pointer group p-3 rounded-xl hover:bg-white/5 transition-colors" onClick={() => setSplitBill(!splitBill)}>
                          <div>
                             <div className="flex items-center gap-2">
                                <span className="text-gray-300 font-medium group-hover:text-white transition-colors">Split Fare</span>
                                <span className="bg-blue-500/20 text-blue-400 text-[10px] px-1.5 py-0.5 rounded uppercase font-bold">Group</span>
                             </div>
                             <p className="text-xs text-gray-500">{splitBill ? 'Each person pays their own fare' : 'You are paying for everyone'}</p>
                          </div>
                          <div className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${splitBill ? 'bg-green-500' : 'bg-gray-700'}`}>
                             <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-300 shadow-sm ${splitBill ? 'translate-x-6' : ''}`} />
                          </div>
                       </div>
                   )}
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                   <button 
                    onClick={handleBack}
                    className="flex-1 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-colors"
                   >
                     Cancel
                   </button>
                   <button 
                    onClick={handleConfirmBooking}
                    className="flex-[2] py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors shadow-lg active:scale-95 flex items-center justify-center gap-2"
                   >
                     {isOffline ? 'Book Offline' : 'Confirm Booking'}
                   </button>
                </div>
             </div>
          </div>
        )}

        {/* STEP 3: TICKET & LIVE TRACKING */}
        {bookingStep === 'CONFIRMED' && selectedRide && (
           <div className="w-full bg-zinc-900/95 backdrop-blur-xl border-t border-white/10 rounded-t-3xl shadow-2xl animate-in slide-in-from-bottom duration-300 pointer-events-auto">
              <div className="p-6">
                 {/* QR Boarding Pass Card */}
                 <div className="bg-white rounded-2xl overflow-hidden shadow-xl mb-6 relative">
                    <div className={`${pendingSync ? 'bg-yellow-600' : 'bg-green-600'} p-4 text-center transition-colors duration-300`}>
                       <h3 className="text-white font-bold tracking-widest text-sm">
                         {pendingSync ? 'OFFLINE TICKET' : 'BOARDING PASS'}
                       </h3>
                    </div>
                    <div className="p-6 flex flex-col items-center">
                       <div className="mb-4 relative">
                          <QrCode className={`w-32 h-32 ${pendingSync ? 'text-gray-800 opacity-80' : 'text-black'}`} />
                          {pendingSync && (
                             <div className="absolute inset-0 flex items-center justify-center">
                                <CloudOff className="w-12 h-12 text-yellow-600 bg-white/80 p-1 rounded-full backdrop-blur-sm" />
                             </div>
                          )}
                       </div>
                       <p className="text-black font-mono font-bold text-xl mb-1">{selectedRide.driver.vehiclePlate}</p>
                       <p className="text-gray-500 text-sm">Show to Conductor/Hwindi</p>
                       <div className="mt-2 text-center">
                          <p className="text-green-600 font-bold text-lg">{selectedRide.route}</p>
                          <p className="text-gray-400 text-sm font-medium">{passengers} Passenger{passengers > 1 ? 's' : ''}</p>
                          {passengers > 1 && (
                              <p className="text-xs text-gray-500 mt-1 bg-gray-100 px-2 py-1 rounded-full inline-block">
                                  {splitBill ? 'Fare Split' : 'Single Payer'}
                              </p>
                          )}
                       </div>
                       
                       {pendingSync && (
                         <div className="mt-4 w-full bg-yellow-50 p-2 rounded text-center border border-yellow-200">
                            <p className="text-yellow-700 text-xs font-bold flex items-center justify-center gap-1">
                               <WifiOff className="w-3 h-3" />
                               Pending Sync
                            </p>
                         </div>
                       )}
                    </div>
                    
                    {/* Tear line circles */}
                    <div className="absolute top-1/2 -left-3 w-6 h-6 bg-zinc-900 rounded-full" />
                    <div className="absolute top-1/2 -right-3 w-6 h-6 bg-zinc-900 rounded-full" />
                    <div className="absolute top-1/2 left-4 right-4 border-t-2 border-dashed border-gray-300" />
                 </div>

                 {/* Trip Actions */}
                 <div className="grid grid-cols-2 gap-4">
                    <button 
                      disabled={pendingSync}
                      className={`flex items-center justify-center gap-2 py-3 font-bold rounded-xl transition-colors ${pendingSync ? 'bg-white/5 text-gray-500 cursor-not-allowed' : 'bg-green-600/20 text-green-400 hover:bg-green-600/30'}`}
                    >
                       <Share2 className="w-5 h-5" />
                       {pendingSync ? 'Offline' : 'Share Trip'}
                    </button>
                    <button 
                      onClick={handleBack}
                      className="py-3 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20"
                    >
                       Close
                    </button>
                 </div>
              </div>
           </div>
        )}
      </div>

      {/* Driver Video Story Modal */}
      {showVideoStory && selectedRide && (
        <VideoStoryModal 
          driver={selectedRide.driver} 
          onClose={() => setShowVideoStory(false)}
          onVerified={() => {
            setShowVideoStory(false);
          }}
        />
      )}
    </div>
  );
};

export default PassengerView;
