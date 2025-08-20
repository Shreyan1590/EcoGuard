import type { Incident, User, Device } from './types';

export const mockIncidents: Incident[] = [
  {
    id: 'inc-001',
    timestamp: '2024-07-29T10:30:00Z',
    treeId: 'T-Alpha-123',
    status: 'new',
    location: { lat: 34.0522, lng: -118.2437 },
    confidence: 0.95,
    sensorsTriggered: ['vibration', 'sound'],
    history: [
      { event: 'High-confidence incident detected', timestamp: '2024-07-29T10:30:00Z' },
    ],
    notes: [],
    photos: ['https://placehold.co/600x400.png', 'https://placehold.co/600x400.png'],
  },
  {
    id: 'inc-002',
    timestamp: '2024-07-29T08:15:00Z',
    treeId: 'T-Beta-456',
    status: 'acknowledged',
    location: { lat: 34.055, lng: -118.25 },
    confidence: 0.82,
    sensorsTriggered: ['vibration'],
    history: [
        { event: 'Incident detected', timestamp: '2024-07-29T08:15:00Z' },
        { event: 'Acknowledged by Ranger Smith', timestamp: '2024-07-29T08:20:00Z' },
    ],
    notes: [{user: 'Ranger Smith', note: 'On my way to check.', timestamp: '2024-07-29T08:21:00Z'}],
    photos: [],
  },
  {
    id: 'inc-003',
    timestamp: '2024-07-28T22:00:00Z',
    treeId: 'T-Gamma-789',
    status: 'resolved',
    location: { lat: 34.049, lng: -118.24 },
    confidence: 0.76,
    sensorsTriggered: ['sound'],
    history: [
        { event: 'Incident detected', timestamp: '2024-07-28T22:00:00Z' },
        { event: 'Acknowledged by Ranger Doe', timestamp: '2024-07-28T22:10:00Z' },
        { event: 'Resolved by Ranger Doe', timestamp: '2024-07-29T09:00:00Z' },
    ],
    notes: [
        {user: 'Ranger Doe', note: 'Investigated. Was a large animal.', timestamp: '2024-07-29T08:55:00Z'},
        {user: 'Ranger Doe', note: 'Marked as resolved. False alarm.', timestamp: '2024-07-29T09:00:00Z'},
    ],
    photos: ['https://placehold.co/600x400.png'],
  },
];

export const mockUsers: User[] = [
  { id: 'usr-01', name: 'Admin User', email: 'admin@ecoguard.com', role: 'administrator' },
  { id: 'usr-02', name: 'Jane Smith', email: 'jane.smith@ecoguard.com', role: 'ranger' },
  { id: 'usr-03', name: 'John Doe', email: 'john.doe@ecoguard.com', role: 'ranger' },
];

export const mockDevices: Device[] = [
  { id: 'dev-01', status: 'online', lastReported: '2024-07-29T10:30:00Z', battery: 98, location: { lat: 34.0522, lng: -118.2437 } },
  { id: 'dev-02', status: 'online', lastReported: '2024-07-29T10:28:00Z', battery: 76, location: { lat: 34.055, lng: -118.25 } },
  { id: 'dev-03', status: 'offline', lastReported: '2024-07-28T18:00:00Z', battery: 23, location: { lat: 34.049, lng: -118.24 } },
];
