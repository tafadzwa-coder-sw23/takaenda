
import { Ride, RideType, Alert } from './types';

// Harare Center (Approx)
const HARARE_CENTER = { lat: -17.824858, lng: 31.053028 };

export const MOCK_RIDES: Ride[] = [
  // ==========================================
  // ROUTE: CHITUNGWIZA (High Density / Commuter)
  // ==========================================
  {
    id: 'k_chi_1',
    type: RideType.KOMBI,
    driver: {
      id: 'd_chi_1',
      name: 'Panashe (Makoni)',
      rating: 4.6,
      trips: 2100,
      vehiclePlate: 'AEG-9988',
      vehicleModel: 'Toyota Hiace (Baby Quantum)',
      hasVideoStory: true,
      acceptedPayments: ['USD', 'EcoCash'],
    },
    price: 2.00,
    eta: 4,
    seatsLeft: 2,
    route: 'CBD to Chitungwiza (Makoni)',
    coordinates: { lat: -18.0125, lng: 31.0754 }, // Near Makoni
  },
  {
    id: 'b_chi_1',
    type: RideType.BUS,
    driver: {
      id: 'd_chi_2',
      name: 'ZUPCO 104',
      rating: 3.9,
      trips: 5400,
      vehiclePlate: 'ZUP-104',
      vehicleModel: 'Golden Dragon Bus',
      hasVideoStory: false,
      acceptedPayments: ['TapCard', 'ZWG'],
    },
    price: 0.75,
    eta: 15,
    seatsLeft: 32,
    route: 'CBD to Chitungwiza (Unit L)',
    coordinates: { lat: -18.0050, lng: 31.0850 },
  },
  {
    id: 't_chi_1',
    type: RideType.TAXI,
    driver: {
      id: 'd_chi_3',
      name: 'Tonderai (Mushikashika)',
      rating: 4.2,
      trips: 890,
      vehiclePlate: 'AFD-2211',
      vehicleModel: 'Honda Fit (Blue)',
      hasVideoStory: false,
      acceptedPayments: ['USD'],
    },
    price: 3.00,
    eta: 1,
    seatsLeft: 1,
    route: 'CBD to Chitungwiza (Express)',
    coordinates: { lat: -17.9900, lng: 31.0600 },
  },

  // ==========================================
  // ROUTE: WESTGATE / BLUFFHILL (Northern Subs)
  // ==========================================
  {
    id: 'k_west_1',
    type: RideType.KOMBI,
    driver: {
      id: 'd_west_1',
      name: 'Tinashe M.',
      rating: 4.8,
      trips: 1240,
      vehiclePlate: 'ABZ-1234',
      vehicleModel: 'Toyota Hiace',
      hasVideoStory: true,
      acceptedPayments: ['USD', 'EcoCash'],
    },
    price: 1.50,
    eta: 3,
    seatsLeft: 3,
    route: 'City to Westgate (via Lomagundi)',
    coordinates: { lat: -17.7850, lng: 30.9850 }, // Westgate
  },
  {
    id: 't_west_1',
    type: RideType.TAXI,
    driver: {
      id: 'd_west_2',
      name: 'Private Taxi (Vaya)',
      rating: 5.0,
      trips: 400,
      vehiclePlate: 'AFK-9090',
      vehicleModel: 'Toyota Corolla',
      hasVideoStory: true,
      acceptedPayments: ['USD', 'Visa'],
    },
    price: 8.00,
    eta: 8,
    seatsLeft: 3,
    route: 'Ride to Westgate Mall',
    coordinates: { lat: -17.7820, lng: 30.9800 },
  },

  // ==========================================
  // ROUTE: AVONDALE / PARIRENYATWA
  // ==========================================
  {
    id: 'k_avo_1',
    type: RideType.KOMBI,
    driver: {
      id: 'd_avo_1',
      name: 'Simba',
      rating: 4.4,
      trips: 900,
      vehiclePlate: 'ACY-5512',
      vehicleModel: 'Nissan Caravan',
      hasVideoStory: false,
      acceptedPayments: ['USD'],
    },
    price: 1.00,
    eta: 2,
    seatsLeft: 1,
    route: 'CBD to Avondale Shops',
    coordinates: { lat: -17.8050, lng: 31.0350 }, // Avondale
  },
  {
    id: 't_avo_1',
    type: RideType.TAXI,
    driver: {
      id: 'd_avo_2',
      name: 'Blessing (Mshika)',
      rating: 4.7,
      trips: 1500,
      vehiclePlate: 'AEF-5555',
      vehicleModel: 'Honda Fit (Silver)',
      hasVideoStory: true,
      acceptedPayments: ['USD'],
    },
    price: 2.00,
    eta: 1,
    seatsLeft: 2,
    route: 'CBD to Parirenyatwa Hospital',
    coordinates: { lat: -17.8150, lng: 31.0450 },
  },

  // ==========================================
  // ROUTE: BORROWDALE (Premium)
  // ==========================================
  {
    id: 'k_bor_1',
    type: RideType.KOMBI,
    driver: {
      id: 'd_bor_1',
      name: 'Farai',
      rating: 4.5,
      trips: 890,
      vehiclePlate: 'ACD-4321',
      vehicleModel: 'Toyota Quantum',
      hasVideoStory: false,
      acceptedPayments: ['USD', 'Bond'],
    },
    price: 1.50,
    eta: 6,
    seatsLeft: 4,
    route: 'CBD to Sam Levy Village',
    coordinates: { lat: -17.7550, lng: 31.0950 }, // Borrowdale
  },
  {
    id: 't_bor_1',
    type: RideType.TAXI,
    driver: {
      id: 'd_bor_2',
      name: 'Prestige Cabs',
      rating: 4.9,
      trips: 200,
      vehiclePlate: 'PRE-001',
      vehicleModel: 'Mercedes C-Class',
      hasVideoStory: true,
      acceptedPayments: ['USD', 'Swipe'],
    },
    price: 12.00,
    eta: 10,
    seatsLeft: 3,
    route: 'Ride to Borrowdale Brooke',
    coordinates: { lat: -17.7400, lng: 31.1100 },
  },

  // ==========================================
  // ROUTE: MBARE (Transport Hub)
  // ==========================================
  {
    id: 'k_mba_1',
    type: RideType.KOMBI,
    driver: {
      id: 'd_mba_1',
      name: 'Godknows',
      rating: 4.1,
      trips: 3000,
      vehiclePlate: 'AFP-1122',
      vehicleModel: 'Toyota Hiace (Old)',
      hasVideoStory: false,
      acceptedPayments: ['USD', 'ZiG'],
    },
    price: 0.50,
    eta: 2,
    seatsLeft: 2,
    route: 'City to Mbare Musika',
    coordinates: { lat: -17.8550, lng: 31.0400 }, // Mbare
  },

  // ==========================================
  // ROUTE: INTER-CITY (Bulawayo / Mutare)
  // ==========================================
  {
    id: 'b_bul_1',
    type: RideType.BUS,
    driver: {
      id: 'd_bul_1',
      name: 'InterCape Pathfinder',
      rating: 4.9,
      trips: 120,
      vehiclePlate: 'SA-ZIM-01',
      vehicleModel: 'Luxury Coach (Double Decker)',
      hasVideoStory: true,
      acceptedPayments: ['USD', 'Visa'],
    },
    price: 25.00,
    eta: 60,
    seatsLeft: 12,
    route: 'Harare to Bulawayo',
    coordinates: { lat: -17.8300, lng: 30.9000 }, // Heading out on Bulawayo Rd
  },
  {
    id: 'b_mut_1',
    type: RideType.BUS,
    driver: {
      id: 'd_mut_1',
      name: 'Smart Express',
      rating: 4.3,
      trips: 800,
      vehiclePlate: 'SMA-2020',
      vehicleModel: 'Scania Marcopolo',
      hasVideoStory: true,
      acceptedPayments: ['USD', 'EcoCash'],
    },
    price: 15.00,
    eta: 45,
    seatsLeft: 8,
    route: 'Harare to Mutare',
    coordinates: { lat: -17.8350, lng: 31.1500 }, // Heading out on Mutare Rd
  },
];

export const MOCK_ALERTS: Alert[] = [
  { id: 'a1', type: 'POLICE', location: 'Samora Machel Ave (Showgrounds)', time: '2 min ago' },
  { id: 'a2', type: 'TRAFFIC', location: 'Julius Nyerere Way', time: '5 min ago' },
  { id: 'a3', type: 'ACCIDENT', location: 'Seke Road Flyover', time: '12 min ago' },
  { id: 'a4', type: 'POLICE', location: 'Enterprise Rd (Newlands)', time: '20 min ago' },
];