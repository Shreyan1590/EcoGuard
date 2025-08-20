
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
import { updateUser } from '@/app/actions';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import type { User, UserRole } from '@/lib/types';


const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  username: z.string().min(1, "Username is required."),
  role: z.enum(['ranger', 'administrator']),
  password: z.string().min(6, "Password must be at least 6 characters.").optional().or(z.literal('')),
});

interface AddUserDialogProps {
  user?: User;
}

export function AddUserDialog({ user }: AddUserDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const isEditMode = !!user;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      username: user?.username || "",
      role: user?.role || 'ranger',
      password: "",
    },
  });

  const { formState: { isSubmitting } } = form;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (isEditMode) {
        // In edit mode, we update the user details.
        // Note: Updating email/password in Firebase Auth is a sensitive operation
        // and typically requires re-authentication or admin SDK privileges.
        // This action only updates the Firestore record.
        const { password, ...updateData } = values;
        await updateUser(user.id, updateData);
        toast({ title: "User updated successfully!" });
      } else {
        if (!values.password) {
            form.setError("password", { message: "Password is required for new users."});
            return;
        }
        // 1. Create user in Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
        const authUser = userCredential.user;

        // 2. Create user document in Firestore
        const userDocRef = doc(db, "users", authUser.uid);
        await setDoc(userDocRef, {
            id: authUser.uid,
            name: values.name,
            email: values.email,
            role: values.role,
            username: values.username
        });

        toast({ title: "User created successfully!" });
      }
      setIsOpen(false);
      form.reset(isEditMode ? values : undefined);
    } catch (error: any) {
      console.error("Failed to save user:", error);
      toast({
        title: `Failed to ${isEditMode ? 'update' : 'create'} user.`,
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
                Add User <PlusCircle className="h-4 w-4" />
            </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit User' : 'Add New User'}</DialogTitle>
          <DialogDescription>
            {isEditMode ? "Update the user's details below." : "Fill in the personal information for the new user."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl><Input placeholder="John Doe" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl><Input placeholder="user@example.com" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl><Input placeholder="ranger123 or admin" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                  <FormItem>
                  <FormLabel>{isEditMode ? 'New Password (Optional)' : 'Password'}</FormLabel>
                  <FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl>
                  <FormMessage />
                  </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ranger">Ranger</SelectItem>
                      <SelectItem value="administrator">Administrator</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : (isEditMode ? "Save Changes" : "Create User")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
