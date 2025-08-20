
"use client";
import { AppShell } from '@/components/shared/app-shell';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { IncidentList } from '@/components/dashboard/incident-list';
import Image from 'next/image';
import { MapPin } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { useEffect, useState } from 'react';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Incident } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function RangerDashboard() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'incidents'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const incidentsData: Incident[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        incidentsData.push({ 
          id: doc.id, 
          ...data,
          // Convert Firestore Timestamp to string for client-side rendering
          timestamp: (data.timestamp as any).toDate().toISOString(), 
        } as Incident);
      });
      setIncidents(incidentsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);
  
  const newIncidents = incidents.filter(i => i.status === 'new');
  const ackIncidents = incidents.filter(i => i.status === 'acknowledged');
  const resolvedIncidents = incidents.filter(i => i.status === 'resolved');
  
  const statusColor : {[key: string]: string} = {
    new: 'text-destructive',
    acknowledged: 'text-accent',
    resolved: 'text-primary',
  };


  return (
    <AppShell role="ranger">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold font-headline">Ranger Dashboard</h1>
        <Tabs defaultValue="list" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="list">Incident List</TabsTrigger>
            <TabsTrigger value="map">Map View</TabsTrigger>
          </TabsList>
          <TabsContent value="list">
            <Card>
              <CardHeader>
                <CardTitle>Recent Incidents</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                  </div>
                ) : (
                <Tabs defaultValue="new" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="new">New ({newIncidents.length})</TabsTrigger>
                    <TabsTrigger value="acknowledged">Acknowledged ({ackIncidents.length})</TabsTrigger>
                    <TabsTrigger value="resolved">Resolved ({resolvedIncidents.length})</TabsTrigger>
                  </TabsList>
                  <TabsContent value="new" className="mt-4">
                    <IncidentList incidents={newIncidents} />
                  </TabsContent>
                  <TabsContent value="acknowledged" className="mt-4">
                    <IncidentList incidents={ackIncidents} />
                  </TabsContent>
                  <TabsContent value="resolved" className="mt-4">
                    <IncidentList incidents={resolvedIncidents} />
                  </TabsContent>
                </Tabs>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="map">
            <Card>
              <CardHeader>
                <CardTitle>Incident Map</CardTitle>
              </CardHeader>
              <CardContent>
                 {loading ? <Skeleton className="h-[60vh] w-full" /> : (
                <div className="relative h-[60vh] rounded-lg overflow-hidden border">
                  <Image src="https://placehold.co/1200x800.png" alt="Map of incidents" layout="fill" objectFit="cover" data-ai-hint="map forest" />
                  <TooltipProvider>
                    {incidents.map(incident => (
                      <Tooltip key={incident.id}>
                        <TooltipTrigger asChild>
                          <div className="absolute" style={{ top: `${(incident.location.lat - 34.04) * 2000}%`, left: `${(-118.26 - incident.location.lng) * -2000}%`, transform: 'translate(-50%, -50%)'}}>
                            <MapPin className={`w-8 h-8 ${statusColor[incident.status]} drop-shadow-lg`} strokeWidth={2.5}/>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{incident.treeId}</p>
                          <p className="capitalize">Status: {incident.status}</p>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </TooltipProvider>
                </div>
                 )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}
