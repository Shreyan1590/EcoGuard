
"use client";

import { AppShell } from '@/components/shared/app-shell';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import { format } from 'date-fns';
import { MapPin, Clock, Shield, Paperclip, Camera, Send } from 'lucide-react';
import { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc, collection, addDoc, serverTimestamp, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db, storage } from '@/lib/firebase';
import type { Incident, IncidentStatus } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { AuthProvider } from '@/hooks/use-auth';

type Note = {
  id: string;
  user: string;
  note: string;
  timestamp: any;
};

export const dynamic = 'force-dynamic';

function IncidentDetailContent({ params }: { params: { id: string } }) {
  const [incident, setIncident] = useState<Incident | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [isNoteSubmitting, setIsNoteSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchIncident = async () => {
      const docRef = doc(db, 'incidents', params.id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setIncident({ 
          id: docSnap.id,
           ...data,
           timestamp: (data.timestamp as any).toDate().toISOString(),
        } as Incident);
      } else {
        notFound();
      }
      setLoading(false);
    };

    fetchIncident();

    // Listen for notes
    const notesQuery = query(collection(db, 'incidents', params.id, 'notes'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(notesQuery, (snapshot) => {
        const notesData = snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}) as Note);
        setNotes(notesData);
    });
    
    return () => unsubscribe();

  }, [params.id]);

  const handleNoteSubmit = async () => {
    if (!newNote.trim()) return;
    setIsNoteSubmitting(true);
    try {
        await addDoc(collection(db, "incidents", params.id, "notes"), {
            note: newNote,
            user: "Ranger Smith", // Placeholder for authenticated user
            timestamp: serverTimestamp(),
        });
        setNewNote("");
        toast({ title: "Note added successfully." });
    } catch (error) {
        console.error("Error adding note: ", error);
        toast({ title: "Failed to add note.", variant: "destructive" });
    } finally {
        setIsNoteSubmitting(false);
    }
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !incident) return;

    toast({ title: 'Uploading photo...' });
    try {
        const storageRef = ref(storage, `incidents/${incident.id}/${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);

        const updatedPhotos = [...incident.photos, downloadURL];
        await updateDoc(doc(db, 'incidents', incident.id), { photos: updatedPhotos });
        
        setIncident(prev => prev ? {...prev, photos: updatedPhotos} : null);

        toast({ title: "Photo uploaded successfully!" });
    } catch (error) {
        console.error("Error uploading photo:", error);
        toast({ title: "Photo upload failed.", variant: "destructive" });
    }
  };
  
  if (loading) {
    return (
        <AppShell role="ranger">
            <div className="space-y-6">
                <Skeleton className="h-12 w-3/4" />
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-6">
                        <Skeleton className="h-48 w-full" />
                        <Skeleton className="h-64 w-full" />
                        <Skeleton className="h-48 w-full" />
                    </div>
                    <div className="space-y-6">
                        <Skeleton className="h-80 w-full" />
                        <Skeleton className="h-48 w-full" />
                    </div>
                </div>
            </div>
        </AppShell>
    );
  }

  if (!incident) {
    notFound();
  }

  const statusVariant = {
    new: 'destructive',
    acknowledged: 'outline',
    resolved: 'default',
  } as const;

  return (
    <AppShell role="ranger">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold font-headline">Incident: {incident.treeId}</h1>
            <p className="text-muted-foreground">Details and history for incident {incident.id}</p>
          </div>
          <Badge variant={statusVariant[incident.status]} className="text-base capitalize px-4 py-2 w-fit">{incident.status}</Badge>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Incident Details</CardTitle>
              </CardHeader>
              <CardContent className="grid sm:grid-cols-2 gap-6">
                <div className="flex items-start space-x-3">
                  <Clock className="h-5 w-5 mt-1 text-primary"/>
                  <div>
                    <p className="font-semibold">Timestamp</p>
                    <p>{format(new Date(incident.timestamp as string), "PPP p")}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 mt-1 text-primary"/>
                  <div>
                    <p className="font-semibold">Location</p>
                    <p>{incident.location.lat}, {incident.location.lng}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Shield className="h-5 w-5 mt-1 text-primary"/>
                  <div>
                    <p className="font-semibold">Confidence Score</p>
                    <p>{(incident.confidence * 100).toFixed(0)}%</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Paperclip className="h-5 w-5 mt-1 text-primary"/>
                  <div>
                    <p className="font-semibold">Sensors Triggered</p>
                    <p className="capitalize">{incident.sensorsTriggered.join(', ')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Investigation Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {notes.length > 0 ? notes.map((note) => (
                    <div key={note.id} className="flex space-x-3">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center font-bold text-secondary-foreground">{note.user.charAt(0)}</div>
                      </div>
                      <div>
                        <p className="font-semibold">{note.user} <span className="font-normal text-sm text-muted-foreground">- {note.timestamp ? format(note.timestamp.toDate(), 'PP p') : 'Just now'}</span></p>
                        <p className="text-card-foreground/80">{note.note}</p>
                      </div>
                    </div>
                  )) : <p className="text-muted-foreground">No notes added yet.</p>}
                </div>
                <div className="mt-6 space-y-2">
                    <Label htmlFor="new-note" className="font-semibold">Add a note</Label>
                    <div className="flex gap-2">
                        <Textarea id="new-note" placeholder="Type your note here..." value={newNote} onChange={(e) => setNewNote(e.target.value)} disabled={isNoteSubmitting}/>
                        <Button size="icon" aria-label="Send note" onClick={handleNoteSubmit} disabled={isNoteSubmitting}>
                            <Send className="h-4 w-4"/>
                        </Button>
                    </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Photos</CardTitle>
              </CardHeader>
              <CardContent>
                 <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {incident.photos.map((photo, index) => (
                        <div key={index} className="aspect-video relative overflow-hidden rounded-lg">
                            <Image src={photo} alt={`Incident photo ${index + 1}`} layout="fill" className="object-cover" data-ai-hint="forest trees"/>
                        </div>
                    ))}
                 </div>
                 <Button asChild className="mt-4 bg-accent hover:bg-accent/90">
                    <Label htmlFor="photo-upload" className="cursor-pointer">
                        <Camera className="mr-2 h-4 w-4"/> Upload Photo
                        <input id="photo-upload" type="file" className="sr-only" accept="image/*" onChange={handlePhotoUpload}/>
                    </Label>
                 </Button>
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Location</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 rounded-lg overflow-hidden relative border">
                   <Image src="https://placehold.co/400x300.png" alt="Map snippet" layout="fill" objectFit="cover" data-ai-hint="map forest" />
                   <MapPin className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-destructive drop-shadow-lg" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Event History</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {incident.history.map((event, index) => (
                    <li key={index} className="flex space-x-3 relative pl-5">
                      <div className="absolute left-0 top-1.5 h-full border-l-2 border-border"></div>
                      <div className="absolute left-0 top-1.5 h-2.5 w-2.5 rounded-full bg-primary -translate-x-[5px]"></div>
                      <div>
                        <p className="text-sm font-medium">{event.event}</p>
                        <p className="text-xs text-muted-foreground">{format(new Date(event.timestamp), "p, PP")}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  );
}


export default function IncidentDetailPage({ params }: { params: { id: string } }) {
    return (
        <AuthProvider>
            <IncidentDetailContent params={params} />
        </AuthProvider>
    );
}
