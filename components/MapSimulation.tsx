import React, { useEffect, useState } from 'react';
import { Ride, RideType, UserMode } from '../types';
import { Bus, Car, MapPin } from 'lucide-react';

interface MapSimulationProps {
  mode: UserMode;
  rides?: Ride[];
  onRideClick?: (ride: Ride) => void;
  selectedRideId?: string;
  onPickupClick?: (pickupId: string) => void;
}

// Coordinate Projection Configuration for Harare
// We map these Lat/Lng bounds to 0-100% of the screen container
const MAP_BOUNDS = {
  north: -17.70, // Top
  south: -18.05, // Bottom
  west: 30.85,   // Left
  east: 31.20    // Right
};

const MapSimulation: React.FC<MapSimulationProps> = ({ mode, rides = [], onRideClick, selectedRideId, onPickupClick }) => {
  const [userLocation, setUserLocation] = useState({ lat: -17.824858, lng: 31.053028 }); // Harare Center

  // Helper: Convert Lat/Lng to Percentage X/Y
  const project = (lat: number, lng: number) => {
    const latRange = MAP_BOUNDS.south - MAP_BOUNDS.north; // Negative number
    const lngRange = MAP_BOUNDS.east - MAP_BOUNDS.west;

    const y = ((lat - MAP_BOUNDS.north) / latRange) * 100;
    const x = ((lng - MAP_BOUNDS.west) / lngRange) * 100;

    return { x, y };
  };

  const getRideRoutePoints = (routeDesc: string): string => {
    // Simple mock path generator based on destination keywords
    const center = project(HARARE_CENTER.lat, HARARE_CENTER.lng);
    
    let dest = center;
    if (routeDesc.includes('Chitungwiza')) dest = project(-18.0125, 31.0754);
    else if (routeDesc.includes('Westgate')) dest = project(-17.7850, 30.9850);
    else if (routeDesc.includes('Avondale')) dest = project(-17.8050, 31.0350);
    else if (routeDesc.includes('Mbare')) dest = project(-17.8550, 31.0400);
    else if (routeDesc.includes('Borrowdale')) dest = project(-17.7550, 31.0950);
    else if (routeDesc.includes('Bulawayo')) dest = project(-17.8300, 30.9000);

    // Create a quadratic curve path (start -> control -> end)
    // We offset the control point slightly to make the path curved
    const cx = (center.x + dest.x) / 2 + (Math.random() > 0.5 ? 5 : -5);
    const cy = (center.y + dest.y) / 2 + (Math.random() > 0.5 ? 5 : -5);

    return `M ${center.x} ${center.y} Q ${cx} ${cy} ${dest.x} ${dest.y}`;
  };

  const HARARE_CENTER = { lat: -17.824858, lng: 31.053028 };
  const userPos = project(userLocation.lat, userLocation.lng);

  return (
    <div className="relative w-full h-full bg-zinc-900 overflow-hidden">
      {/* 0. CSS ANIMATIONS */}
      <style>{`
        @keyframes dash {
          to {
            stroke-dashoffset: 0;
          }
        }
      `}</style>

      {/* 1. MAP BACKGROUND LAYER (SVG Map) */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <svg className="w-full h-full">
           <defs>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                 <feGaussianBlur stdDeviation="2" result="blur" />
                 <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
           </defs>
           
           {/* Zones */}
           <path d="M 400 300 Q 500 250 600 350 T 400 300" fill="#3f3f46" opacity="0.5" /> {/* CBD Area */}
           <circle cx="70%" cy="80%" r="60" fill="#3f3f46" opacity="0.3" /> {/* Chitungwiza */}
           
           {/* Main Roads */}
           <line x1="0" y1="40%" x2="100%" y2="50%" stroke="#52525b" strokeWidth="4" /> {/* Samora */}
           <line x1="50%" y1="0" x2="45%" y2="100%" stroke="#52525b" strokeWidth="4" /> {/* Simon Maz */}
           <line x1="50%" y1="50%" x2="80%" y2="0" stroke="#52525b" strokeWidth="3" /> {/* Enterprise */}
           <line x1="50%" y1="50%" x2="20%" y2="0" stroke="#52525b" strokeWidth="3" /> {/* Lomagundi */}
           
           {/* Animated Traffic Particles */}
           <circle r="2" fill="#fbbf24">
             <animateMotion dur="4s" repeatCount="indefinite" path="M 0 40% L 100% 50%" />
           </circle>
           <circle r="2" fill="#ef4444">
             <animateMotion dur="3s" repeatCount="indefinite" path="M 100% 50% L 0 40%" />
           </circle>
           <circle r="2" fill="#3b82f6">
             <animateMotion dur="6s" repeatCount="indefinite" path="M 50% 0 L 45% 100%" />
           </circle>

           {/* Ride Routes (Only in Passenger Mode) */}
           {mode === UserMode.PASSENGER && rides.map(ride => {
             const isSelected = ride.id === selectedRideId;
             const routePath = getRideRoutePoints(ride.route);
             const color = ride.type === RideType.BUS ? '#2563eb' : ride.type === RideType.KOMBI ? '#ea580c' : '#eab308';
             
             return (
               <path 
                 key={`route-${ride.id}`}
                 d={routePath}
                 fill="none"
                 stroke={color}
                 strokeWidth={isSelected ? 3 : 1}
                 strokeDasharray="4,4"
                 strokeDashoffset="100"
                 strokeOpacity={isSelected ? 0.8 : 0.2}
                 style={{
                   animation: 'dash 20s linear infinite'
                 }}
               />
             );
           })}
           
           {/* Labels */}
           <text x="52%" y="48%" fill="#a1a1aa" fontSize="10" fontWeight="bold">CBD</text>
           <text x="30%" y="25%" fill="#a1a1aa" fontSize="10">Westgate</text>
           <text x="70%" y="82%" fill="#a1a1aa" fontSize="10">Chitungwiza</text>
           <text x="55%" y="70%" fill="#a1a1aa" fontSize="10">Mbare</text>
           <text x="60%" y="20%" fill="#a1a1aa" fontSize="10">Borrowdale</text>
        </svg>
      </div>

      {/* 2. USER LOCATION PULSE */}
      <div 
        className="absolute z-10 flex items-center justify-center -translate-x-1/2 -translate-y-1/2 transition-all duration-1000"
        style={{ top: `${userPos.y}%`, left: `${userPos.x}%` }}
      >
         <div className="w-4 h-4 bg-green-500 rounded-full shadow-[0_0_20px_rgba(34,197,94,0.6)] relative z-20" />
         <div className="absolute w-12 h-12 bg-green-500/30 rounded-full animate-ping z-10" />
         {/* Radar Scan Effect for Driver */}
         {mode === UserMode.DRIVER && (
            <div className="absolute w-64 h-64 border-2 border-green-500/20 rounded-full animate-[spin_4s_linear_infinite] border-t-green-500/80" />
         )}
      </div>

      {/* 3. RIDE PINS (Passenger Mode) */}
      {mode === UserMode.PASSENGER && rides.map((ride) => {
        const pos = project(ride.coordinates.lat, ride.coordinates.lng);
        const isSelected = ride.id === selectedRideId;
        const isSoldOut = ride.seatsLeft === 0;

        return (
          <button
            key={ride.id}
            onClick={() => onRideClick && onRideClick(ride)}
            className={`absolute z-20 -translate-x-1/2 -translate-y-1/2 transition-all duration-500 group ${
              selectedRideId && !isSelected ? 'opacity-30 scale-75 blur-[1px]' : 'opacity-100'
            }`}
            style={{ top: `${pos.y}%`, left: `${pos.x}%` }}
          >
            {/* Price Tag Badge - Always Visible */}
            <div className={`absolute -top-9 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded text-[10px] font-bold whitespace-nowrap mb-1 shadow-lg transition-all origin-bottom z-30 flex flex-col items-center ${
              isSelected ? 'scale-110 bg-white text-black ring-2 ring-black' : 'bg-black/80 text-white border border-white/20'
            }`}>
               <span>${ride.price.toFixed(2)}</span>
               <div className="w-1 h-1 bg-inherit rotate-45 -mb-3"></div>
            </div>

            {/* Icon Pin */}
            <div className={`relative flex items-center justify-center w-10 h-10 rounded-full shadow-2xl transition-transform ${
               isSelected ? 'scale-125 ring-4 ring-white z-40' : 'scale-100 hover:scale-110 z-20'
            } ${
               isSoldOut ? 'bg-zinc-600 grayscale' :
               ride.type === RideType.BUS ? 'bg-blue-600' :
               ride.type === RideType.KOMBI ? 'bg-orange-600' : 'bg-yellow-500'
            }`}>
               {ride.type === RideType.BUS && <Bus className="w-5 h-5 text-white" />}
               {ride.type === RideType.KOMBI && <Bus className="w-5 h-5 text-white" />} 
               {ride.type === RideType.TAXI && <Car className="w-5 h-5 text-black" />}
            </div>
            
            {/* ETA Label - Always visible but smaller unless selected */}
            <div className={`absolute top-full mt-1 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded-full text-[9px] font-bold text-white bg-black/60 backdrop-blur-sm border border-white/10 whitespace-nowrap transition-all ${isSelected ? 'scale-110 bg-green-600 border-green-400' : ''}`}>
               {ride.eta} min
            </div>
          </button>
        );
      })}

      {/* 4. PASSENGER REQUESTS (Driver Mode) */}
      {mode === UserMode.DRIVER && (
         <>
            {/* Mock Pickup 1 (Westgate) */}
            <button 
              onClick={() => onPickupClick && onPickupClick('pickup_westgate')}
              className="absolute top-[20%] left-[30%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center animate-bounce cursor-pointer group hover:scale-110 transition-transform"
            >
               <div className="px-2 py-1 bg-red-600 text-white text-xs font-bold rounded-lg mb-1 shadow-lg group-hover:bg-red-500">PICKUP</div>
               <MapPin className="w-8 h-8 text-red-600 fill-red-600 drop-shadow-lg" />
            </button>
            {/* Mock Pickup 2 (Avondale) */}
            <button 
              onClick={() => onPickupClick && onPickupClick('pickup_avondale')}
              className="absolute top-[45%] left-[60%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center animate-bounce delay-700 cursor-pointer group hover:scale-110 transition-transform"
            >
               <div className="px-2 py-1 bg-red-600 text-white text-xs font-bold rounded-lg mb-1 shadow-lg group-hover:bg-red-500">PICKUP</div>
               <MapPin className="w-8 h-8 text-red-600 fill-red-600 drop-shadow-lg" />
            </button>
         </>
      )}

      {/* Legend / Overlay Info */}
      <div className="absolute bottom-24 right-4 pointer-events-none opacity-50 text-[10px] text-gray-400 text-right">
         <p>Harare, ZWE</p>
         <p>Map Data © Takaenda</p>
      </div>
    </div>
  );
};

export default MapSimulation;