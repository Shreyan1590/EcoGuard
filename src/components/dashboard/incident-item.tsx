"use client";

import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Incident } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';
import { ArrowRight, Check } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export function IncidentItem({ incident }: { incident: Incident }) {
  const { toast } = useToast();

  const handleAcknowledge = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const incidentRef = doc(db, 'incidents', incident.id);
    try {
      await updateDoc(incidentRef, {
        status: 'acknowledged'
      });
      toast({
          title: "Incident Acknowledged",
          description: `Incident for tree ${incident.treeId} has been acknowledged.`,
      });
    } catch (error) {
       console.error("Error acknowledging incident: ", error);
       toast({
          title: "Error",
          description: "Failed to acknowledge the incident.",
          variant: 'destructive'
      });
    }
  };

  const statusVariant = {
    new: 'destructive',
    acknowledged: 'outline',
    resolved: 'default',
  } as const;
  
  const statusColor = {
    new: 'bg-destructive',
    acknowledged: 'bg-accent',
    resolved: 'bg-primary',
  };

  return (
    <Link href={`/incidents/${incident.id}`} className="block">
      <Card className="hover:shadow-lg transition-shadow duration-300 overflow-hidden">
        <div className="flex items-stretch">
            <div className={`w-2 flex-shrink-0 ${statusColor[incident.status]}`}></div>
            <div className="flex-1 p-4">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="font-bold text-lg text-primary">{incident.treeId}</p>
                        <p className="text-sm text-muted-foreground">
                            {formatDistanceToNow(new Date(incident.timestamp as string), { addSuffix: true })}
                        </p>
                    </div>
                    <Badge variant={statusVariant[incident.status]} className="capitalize">{incident.status}</Badge>
                </div>
                <div className="flex justify-end items-center mt-2 space-x-2">
                    {incident.status === 'new' && (
                        <Button variant="outline" size="sm" onClick={handleAcknowledge}>
                            <Check className="mr-2 h-4 w-4" />
                            Acknowledge
                        </Button>
                    )}
                    <Button variant="ghost" size="sm">
                        Details
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
      </Card>
    </Link>
  );
}
