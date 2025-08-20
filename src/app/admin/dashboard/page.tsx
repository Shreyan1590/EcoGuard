
"use client";

import { AppShell } from '@/components/shared/app-shell';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PlusCircle, CheckCircle, AlertTriangle, Wifi, WifiOff, Trash2, Edit } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Incident, User, Device } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { AddUserDialog } from '@/components/admin/add-user-dialog';
import { AddDeviceDialog } from '@/components/admin/add-device-dialog';
import { AddIncidentDialog } from '@/components/admin/add-incident-dialog';
import { deleteUser, deleteDevice, deleteIncident } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { format } from 'date-fns';
import Link from 'next/link';
import { AuthProvider } from '@/hooks/use-auth';

export const dynamic = 'force-dynamic';

type NoteWithIncidentId = {
    id: string;
    user: string;
    note: string;
    timestamp: any;
    incidentId: string;
}

function AdminDashboardContent() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [recentNotes, setRecentNotes] = useState<NoteWithIncidentId[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    setLoading(true);

    const fetchInitialData = async () => {
        try {
            // Incidents
            const unsubIncidents = onSnapshot(query(collection(db, "incidents")), (snapshot) => {
              const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Incident));
              setIncidents(data);
              fetchRecentNotes(data); 
            });

            // Users
            const unsubUsers = onSnapshot(query(collection(db, "users")), (snapshot) => {
              const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
              setUsers(data);
            });

            // Devices
            const unsubDevices = onSnapshot(query(collection(db, "devices")), (snapshot) => {
              const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Device));
              setDevices(data);
            });

            setLoading(false);

            return () => {
              unsubIncidents();
              unsubUsers();
              unsubDevices();
            };
        } catch (error) {
            console.error("Error fetching initial data:", error);
            setLoading(false);
        }
    };
    
    const fetchRecentNotes = async (incidentsData: Incident[]) => {
        let allNotes: NoteWithIncidentId[] = [];
        for (const incident of incidentsData) {
            const notesQuery = query(collection(db, 'incidents', incident.id, 'notes'));
            const notesSnapshot = await getDocs(notesQuery);
            notesSnapshot.forEach(doc => {
                allNotes.push({
                    id: doc.id,
                    incidentId: incident.id,
                    ...doc.data()
                } as NoteWithIncidentId);
            });
        }
        
        allNotes.sort((a, b) => {
            const dateA = a.timestamp?.toDate() || 0;
            const dateB = b.timestamp?.toDate() || 0;
            return dateB - dateA;
        });

        setRecentNotes(allNotes);
    };

    fetchInitialData();

  }, []);

  const handleDeleteUser = async (userId: string) => {
    try {
        await deleteUser(userId);
        toast({ title: "User deleted successfully." });
    } catch (error) {
        toast({ title: "Failed to delete user.", variant: 'destructive' });
        console.error("Error deleting user:", error);
    }
  };

  const handleDeleteDevice = async (deviceId: string) => {
      try {
          await deleteDevice(deviceId);
          toast({ title: "Device deleted successfully." });
      } catch (error) {
          toast({ title: "Failed to delete device.", variant: 'destructive' });
          console.error("Error deleting device:", error);
      }
  };
  
  const handleDeleteIncident = async (incidentId: string) => {
      try {
          await deleteIncident(incidentId);
          toast({ title: "Incident deleted successfully." });
      } catch (error) {
          toast({ title: "Failed to delete incident.", variant: 'destructive' });
          console.error("Error deleting incident:", error);
      }
  };


  const totalIncidents = incidents.length;
  const resolvedIncidents = incidents.filter(i => i.status === 'resolved').length;
  const unresolvedIncidents = totalIncidents - resolvedIncidents;
  const onlineDevices = devices.filter(d => d.status === 'online').length;

  return (
    <AppShell role="administrator">
      <div className="space-y-8">
        <div>
            <h1 className="text-3xl font-bold font-headline">Administrator Dashboard</h1>
            <p className="text-muted-foreground">Overview of forest monitoring activity.</p>
        </div>
        
        {loading ? <DashboardSkeleton /> : (
          <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Incidents</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalIncidents}</div>
                <p className="text-xs text-muted-foreground">+5 since last week</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Resolved Incidents</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{resolvedIncidents}</div>
                <p className="text-xs text-muted-foreground">{unresolvedIncidents} unresolved</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Devices Online</CardTitle>
                <Wifi className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{onlineDevices} / {devices.length}</div>
                <p className="text-xs text-muted-foreground">{devices.length - onlineDevices} offline</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">High-Risk Areas</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                  <div className="relative h-24 overflow-hidden rounded-b-lg">
                    <Image src="https://placehold.co/400x200.png" layout="fill" objectFit="cover" alt="Heatmap of high-risk areas" data-ai-hint="map heatmap" />
                  </div>
              </CardContent>
            </Card>
          </div>
          
          <Card id="incidents">
              <CardHeader className="flex flex-row items-center">
                <div className="grid gap-2">
                  <CardTitle>Incident Management</CardTitle>
                  <CardDescription>Add, edit, or remove incidents.</CardDescription>
                </div>
                <AddIncidentDialog />
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tree ID</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Confidence</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {incidents.map(incident => (
                      <TableRow key={incident.id}>
                        <TableCell>
                          <div className="font-medium">{incident.treeId}</div>
                          <div className="text-sm text-muted-foreground">{incident.id}</div>
                        </TableCell>
                         <TableCell>
                          <Badge variant={incident.status === 'new' ? 'destructive' : (incident.status === 'resolved' ? 'default' : 'secondary')} className="capitalize">{incident.status}</Badge>
                        </TableCell>
                        <TableCell>{(incident.confidence * 100).toFixed(0)}%</TableCell>
                        <TableCell className="text-right space-x-2">
                            <AddIncidentDialog incident={incident} />
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive"/></Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the incident.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDeleteIncident(incident.id)}>Delete</AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            
          <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2">
            <Card id="user-management">
              <CardHeader className="flex flex-row items-center">
                <div className="grid gap-2">
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>Add, edit, or remove user accounts.</CardDescription>
                </div>
                <AddUserDialog />
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map(user => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.role === 'administrator' ? 'default' : 'secondary'} className="capitalize">{user.role}</Badge>
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                            <AddUserDialog user={user} />
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive"/></Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the user account.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDeleteUser(user.id)}>Delete</AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center">
                <div className="grid gap-2">
                  <CardTitle>Device Management</CardTitle>
                  <CardDescription>View status of deployed EcoGuard devices.</CardDescription>
                </div>
                <AddDeviceDialog />
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Device ID</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {devices.map(device => (
                      <TableRow key={device.id}>
                        <TableCell className="font-medium">{device.id}</TableCell>
                        <TableCell>
                            <Badge variant={device.status === 'online' ? 'default' : 'destructive'} className="capitalize flex items-center gap-1 w-fit">
                              {device.status === 'online' ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
                              {device.status}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <AddDeviceDialog device={device} />
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive"/></Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete the device.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteDevice(device.id)}>Delete</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
           <Card>
              <CardHeader>
                <CardTitle>Recent Ranger Activity</CardTitle>
                <CardDescription>A log of the latest notes added by rangers to incidents.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ranger</TableHead>
                      <TableHead>Note</TableHead>
                      <TableHead>Incident</TableHead>
                      <TableHead>Timestamp</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentNotes.slice(0, 5).map((note) => (
                      <TableRow key={note.id}>
                        <TableCell>{note.user}</TableCell>
                        <TableCell className="max-w-xs truncate">{note.note}</TableCell>
                        <TableCell>
                          <Button variant="link" asChild size="sm" className="p-0 h-auto">
                             <Link href={`/incidents/${note.incidentId}`}>
                                View Incident
                            </Link>
                          </Button>
                        </TableCell>
                        <TableCell>{note.timestamp ? format(note.timestamp.toDate(), 'PP p') : 'Just now'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </AppShell>
  );
}

export default function AdminDashboard() {
    return (
        <AuthProvider>
            <AdminDashboardContent />
        </AuthProvider>
    );
}


function DashboardSkeleton() {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Skeleton className="h-28" />
        <Skeleton className="h-28" />
        <Skeleton className="h-28" />
        <Skeleton className="h-28" />
      </div>
       <Skeleton className="h-72 w-full" />
      <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2">
        <Skeleton className="h-72" />
        <Skeleton className="h-72" />
      </div>
      <Skeleton className="h-72 w-full" />
    </>
  )
}
