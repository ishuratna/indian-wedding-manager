export type Side = 'Bride' | 'Groom' | 'Common';
export type Group = 'Family' | 'Friend' | 'Colleague' | 'Other';
export type Gender = 'Male' | 'Female' | 'Other';
export type AgeGroup = 'Adult' | 'Child' | 'Infant';
export type RSVPStatus = 'Confirmed' | 'Tentative' | 'Declined' | 'Pending';
export type Dietary = 'Veg' | 'Non-Veg' | 'Jain' | 'Vegan' | 'Eggetarian';

export interface Guest {
  id?: string;
  weddingId: string;
  
  // Basic Info
  fullName: string;
  gender?: Gender;
  ageGroup: AgeGroup;
  side: Side;
  group: Group;
  relationship?: string;
  
  // Contact
  phone: string;
  email?: string;
  whatsappOptIn: boolean;
  
  // Attendance
  rsvpStatus: RSVPStatus;
  events: string[]; // Array of event names they are attending
  
  // Dietary & Logistics
  dietaryRestrictions: Dietary[];
  allergies?: string;
  
  // Travel - Arrival field is optional because it might not be known yet
  arrival?: {
    date: string;
    time: string;
    mode: 'Flight' | 'Train' | 'Car' | 'Bus' | 'Other';
    flightNumber?: string;
    pickupRequired: boolean;
  };
  
  // Travel - Departure
  departure?: {
    date: string;
    time: string;
    mode: 'Flight' | 'Train' | 'Car' | 'Bus' | 'Other';
    dropoffRequired: boolean;
  };
  
  // Accommodation
  accommodation?: {
    isRequired: boolean;
    roomsNeeded: number;
    hotelAllocated?: string;
  };

  createdAt?: any;
}
