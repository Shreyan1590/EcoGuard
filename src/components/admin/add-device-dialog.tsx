
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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Edit } from 'lucide-react';
import { addDevice, updateDevice } from '@/app/actions';
import type { Device, DeviceStatus } from '@/lib/types';

const formSchema = z.object({
  id: z.string().min(6, "Device ID must be at least 6 characters."),
  status: z.enum(['online', 'offline']),
  battery: z.coerce.number().min(0).max(100),
  location: z.object({
      lat: z.coerce.number(),
      lng: z.coerce.number(),
  })
});

interface AddDeviceDialogProps {
  device?: Device;
}

export function AddDeviceDialog({ device }: AddDeviceDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const isEditMode = !!device;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: device?.id || "",
      status: device?.status || 'online',
      battery: device?.battery || 100,
      location: {
          lat: device?.location?.lat || 0,
          lng: device?.location?.lng || 0,
      }
    },
  });
  
  const { formState: { isSubmitting } } = form;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
        if (isEditMode) {
            // Can't change ID in edit mode.
            const { id, ...updateData } = values;
            await updateDevice(device.id, updateData);
            toast({ title: "Device updated successfully!" });
        } else {
            const { id, ...createData } = values;
            await addDevice({ id: values.id, ...createData });
            toast({ title: "Device added successfully!" });
      }
      setIsOpen(false);
      form.reset();
    } catch (error: any) {
      console.error("Failed to save device:", error);
      toast({
        title: `Failed to ${isEditMode ? 'update' : 'add'} device.`,
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
                Add Device <PlusCircle className="h-4 w-4" />
            </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Device' : 'Add New Device'}</DialogTitle>
          <DialogDescription>
            {isEditMode ? "Update the device's details below." : "Fill in the details for the new device."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Device ID</FormLabel>
                  <FormControl><Input placeholder="EcoGuard-001" {...field} disabled={isEditMode} /></FormControl>
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
                      <SelectItem value="online">Online</SelectItem>
                      <SelectItem value="offline">Offline</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="battery"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Battery Level (%)</FormLabel>
                  <FormControl><Input type="number" placeholder="100" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Device"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
