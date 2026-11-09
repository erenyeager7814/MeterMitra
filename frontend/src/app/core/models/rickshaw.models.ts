export interface DashboardSummary {
  totalDrivers: number;
  availableDrivers: number;
  activeRides: number;
  availableRickshaws: number;
  sampleFiveKmFare: number;
}

export interface Driver {
  id: number;
  name: string;
  phone: string;
  rating: number;
  status: 'AVAILABLE' | 'ON_RIDE' | 'OFFLINE';
}

export interface Rickshaw {
  id: number;
  registrationNumber: string;
  area: string;
  status: 'AVAILABLE' | 'ASSIGNED' | 'MAINTENANCE';
  batteryPercent: number;
}

export interface Ride {
  id: number;
  passengerName: string;
  pickupLocation: string;
  dropLocation: string;
  distanceKm: number;
  estimatedFare: number;
  status: 'REQUESTED' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  requestedAt: string;
  driverName: string;
  rickshawRegistrationNumber: string;
}

export interface CreateRideRequest {
  passengerName: string;
  pickupLocation: string;
  dropLocation: string;
  distanceKm: number;
}

export interface FareEstimateResponse {
  distanceKm: number;
  fare: number;
  formula: string;
}

export interface SqlAnalysisResponse {
  summary: string;
  statementType: string;
  tables: Array<{ name: string; alias: string }>;
  columns: string[];
  parameters: string[];
  findings: Array<{ severity: string; title: string; detail: string; suggestion: string; confidence: string }>;
  rationalizations: Array<{ currentName: string; proposedName: string; reason: string; confidence: string }>;
  rewrittenSql: string;
}

