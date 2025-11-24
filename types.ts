export enum UserMode {
  LANDING = 'LANDING',
  PASSENGER = 'PASSENGER',
  DRIVER = 'DRIVER',
}

export enum RideType {
  KOMBI = 'KOMBI',
  BUS = 'BUS',
  TAXI = 'TAXI',
}

export enum RideStatus {
  AVAILABLE = 'AVAILABLE',
  CONFIRMED = 'CONFIRMED',
  APPROACHING = 'APPROACHING',
  ARRIVED = 'ARRIVED',
  ON_TRIP = 'ON_TRIP',
}

export interface Driver {
  id: string;
  name: string;
  rating: number;
  trips: number;
  vehiclePlate: string;
  vehicleModel: string;
  hasVideoStory: boolean;
  acceptedPayments: string[];
}

export interface Ride {
  id: string;
  type: RideType;
  driver: Driver;
  price: number;
  eta: number; // minutes
  seatsLeft: number;
  route: string;
  coordinates: { lat: number; lng: number }; // Real GPS coordinates
}

export interface Alert {
  id: string;
  type: 'POLICE' | 'TRAFFIC' | 'ACCIDENT';
  location: string;
  time: string;
}