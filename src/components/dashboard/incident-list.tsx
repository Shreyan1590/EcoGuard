import { IncidentItem } from './incident-item';
import type { Incident } from '@/lib/types';

export function IncidentList({ incidents }: { incidents: Incident[] }) {
  if (incidents.length === 0) {
    return <div className="text-center text-muted-foreground py-8">No incidents to display.</div>;
  }
  return (
    <div className="space-y-4">
      {incidents.map((incident) => (
        <IncidentItem key={incident.id} incident={incident} />
      ))}
    </div>
  );
}
