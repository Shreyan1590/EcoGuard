
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Edit } from 'lucide-react';
import { addIncident, updateIncident } from '@/app/actions';
import type { Incident } from '@/lib/types';
import { Textarea } from '@/components/ui/textarea';

const formSchema = z.object({
  treeId: z.string().min(1, "Tree ID is required."),
  status: z.enum(['new', 'acknowledged', 'resolved']),
  confidence: z.coerce.number().min(0).max(1),
  location: z.object({
      lat: z.coerce.number(),
      lng: z.coerce.number(),
  }),
  sensorsTriggered: z.string().min(1, "At least one sensor must be specified."),
});

interface AddIncidentDialogProps {
  incident?: Incident;
}

export function AddIncidentDialog({ incident }: AddIncidentDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const isEditMode = !!incident;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      treeId: incident?.treeId || "",
      status: incident?.status || 'new',
      confidence: incident?.confidence || 0,
      location: {
          lat: incident?.location?.lat || 0,
          lng: incident?.location?.lng || 0,
      },
      sensorsTriggered: incident?.sensorsTriggered?.join(', ') || ""
    },
  });
  
  const { formState: { isSubmitting } } = form;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
        const sensors = values.sensorsTriggered.split(',').map(s => s.trim());
        const data = {
            ...values,
            sensorsTriggered: sensors
        };

        if (isEditMode) {
            await updateIncident(incident.id, data);
            toast({ title: "Incident updated successfully!" });
        } else {
            await addIncident(data);
            toast({ title: "Incident added successfully!" });
        }
      setIsOpen(false);
      form.reset();
    } catch (error: any) {
      console.error("Failed to save incident:", error);
      toast({
        title: `Failed to ${isEditMode ? 'update' : 'add'} incident.`,
        description: error.message || "An unknown error occurred.",
        variant: "destructive",
      });
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
         {isEditMode ? (
            <Button variant="ghost" size="icon"><Edit className="h-4 w-4"/></Button>
        ) : (
            <Button size="sm" className="ml-auto gap-1">
                Add Incident <PlusCircle className="h-4 w-4" />
            </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Incident' : 'Add New Incident'}</DialogTitle>
          <DialogDescription>
            {isEditMode ? "Update the incident's details below." : "Fill in the details for the new incident."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="treeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tree ID</FormLabel>
                  <FormControl><Input placeholder="T-12345" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="acknowledged">Acknowledged</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="confidence"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confidence Score</FormLabel>
                  <FormControl><Input type="number" step="0.01" min="0" max="1" placeholder="0.85" {...field} /></FormControl>
                   <FormDescription>A value between 0 and 1.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
                 <FormField
                  control={form.control}
                  name="location.lat"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Latitude</FormLabel>
                      <FormControl><Input type="number" step="any" placeholder="34.0522" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="location.lng"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Longitude</FormLabel>
                      <FormControl><Input type="number" step="any" placeholder="-118.2437" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>
            <FormField
              control={form.control}
              name="sensorsTriggered"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sensors Triggered</FormLabel>
                  <FormControl><Textarea placeholder="vibration, sound, thermal" {...field} /></FormControl>
                  <FormDescription>Comma-separated list of sensors.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Incident"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
