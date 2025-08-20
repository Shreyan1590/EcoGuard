
"use client";

import { AppShell } from '@/components/shared/app-shell';
import { IncidentList } from '@/components/dashboard/incident-list';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { db } from '@/lib/firebase';
import type { Incident } from '@/lib/types';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { Bell } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function AlertsPage() {
    const [newIncidents, setNewIncidents] = useState<Incident[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, 'incidents'), where('status', '==', 'new'));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const incidentsData: Incident[] = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                incidentsData.push({
                    id: doc.id,
                    ...data,
                    timestamp: (data.timestamp as any).toDate().toISOString(),
                } as Incident);
            });
            setNewIncidents(incidentsData);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <AppShell role="ranger">
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Bell className="h-8 w-8 text-accent" />
                    <div>
                        <h1 className="text-3xl font-bold font-headline">Alerts & Notifications</h1>
                        <p className="text-muted-foreground">All new incidents requiring acknowledgement are shown here.</p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>New Incidents ({newIncidents.length})</CardTitle>
                        <CardDescription>These incidents have been automatically detected and need to be acknowledged.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="space-y-4">
                                <Skeleton className="h-24 w-full" />
                                <Skeleton className="h-24 w-full" />
                                <Skeleton className="h-24 w-full" />
                            </div>
                        ) : (
                            <IncidentList incidents={newIncidents} />
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppShell>
    );
}
