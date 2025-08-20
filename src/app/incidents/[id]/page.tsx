import { AppShell } from '@/components/shared/app-shell';
import { mockIncidents } from '@/lib/mock-data';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import { format } from 'date-fns';
import { MapPin, Clock, Shield, Paperclip, Camera, Send } from 'lucide-react';

export default function IncidentDetailPage({ params }: { params: { id: string } }) {
  const incident = mockIncidents.find(inc => inc.id === params.id);

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
                    <p>{format(new Date(incident.timestamp), "PPP p")}</p>
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
                  {incident.notes.length > 0 ? incident.notes.map((note, index) => (
                    <div key={index} className="flex space-x-3">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center font-bold text-secondary-foreground">{note.user.charAt(0)}</div>
                      </div>
                      <div>
                        <p className="font-semibold">{note.user} <span className="font-normal text-sm text-muted-foreground">- {format(new Date(note.timestamp), 'PP p')}</span></p>
                        <p className="text-card-foreground/80">{note.note}</p>
                      </div>
                    </div>
                  )) : <p className="text-muted-foreground">No notes added yet.</p>}
                </div>
                <div className="mt-6 space-y-2">
                    <Label htmlFor="new-note" className="font-semibold">Add a note</Label>
                    <div className="flex gap-2">
                        <Textarea id="new-note" placeholder="Type your note here..."/>
                        <Button size="icon" aria-label="Send note"><Send className="h-4 w-4"/></Button>
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
                 <Button className="mt-4 bg-accent hover:bg-accent/90"><Camera className="mr-2 h-4 w-4"/> Upload Photo</Button>
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
