import type { Timestamp } from 'firebase/firestore';

export type IncidentStatus = 'new' | 'acknowledged' | 'resolved';

export type Incident = {
  id: string;
  timestamp: Timestamp | string; // Allow for Firestore Timestamp and string
  treeId: string;
  status: IncidentStatus;
  location: {
    lat: number;
    lng: number;
  };
  confidence: number;
  sensorsTriggered: string[];
  history: { event: string; timestamp: string }[];
  notes: { user: string; note: string; timestamp: string }[];
  photos: string[];
};

export type UserRole = 'ranger' | 'administrator';

export type User = {
  id: string; // This will be the Firebase Auth UID
  name: string;
  email: string;
  role: UserRole;
};

export type DeviceStatus = 'online' | 'offline';

export type Device = {
  id: string;
  status: DeviceStatus;
  lastReported: Timestamp | string;
  battery: number;
  location: {
    lat: number;
    lng: number;
  };
};
