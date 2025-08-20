
"use client";

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Trees } from 'lucide-react';
import { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, query, where, getDocs, doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import type { UserRole } from '@/lib/types';

// Helper function to create user in Firestore
async function createUserInFirestore(uid: string, name: string, email: string, role: UserRole, username: string) {
    const userDocRef = doc(db, "users", uid);
    await setDoc(userDocRef, {
        id: uid,
        name,
        email,
        role,
        username
    });
}

export function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const isAdminLogin = username.toLowerCase() === 'admin' && password === 'admin123';
    const adminEmail = 'admin@ecoguard.com';

    try {
      let emailToLogin: string | null = null;
      let userRole: UserRole = 'ranger';

      if (isAdminLogin) {
        emailToLogin = adminEmail;
        userRole = 'administrator';
      } else {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where("username", "==", username));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0];
            emailToLogin = userDoc.data().email;
        }
      }

      if (!emailToLogin) {
        throw new Error("Invalid username or password.");
      }

      try {
        const userCredential = await signInWithEmailAndPassword(auth, emailToLogin, password);
        const user = userCredential.user;
        
        // Redirect based on role
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          if (userData.role === 'administrator') {
            router.push('/admin/dashboard');
          } else {
            router.push('/ranger/dashboard');
          }
        } else {
           throw new Error("User role not found.");
        }

      } catch (error: any) {
        // If admin login fails because the user does not exist, create it.
        if (isAdminLogin && error.code === 'auth/user-not-found') {
          console.log('Admin user not found. Creating a new admin user...');
          const newUserCredential = await createUserWithEmailAndPassword(auth, adminEmail, password);
          const newUser = newUserCredential.user;
          await createUserInFirestore(newUser.uid, 'Administrator', adminEmail, 'administrator', 'admin');
          router.push('/admin/dashboard');
        } else {
          // For other errors, just re-throw
          throw error;
        }
      }

    } catch (error) {
      console.error(error);
      toast({
        title: "Login Failed",
        description: "Invalid username or password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md shadow-2xl border-2">
      <CardHeader className="text-center">
        <div className="mx-auto bg-primary rounded-full p-3 w-fit mb-4">
          <Trees className="h-10 w-10 text-primary-foreground" />
        </div>
        <CardTitle className="text-3xl font-headline text-primary">EcoGuard Mobile</CardTitle>
        <CardDescription>Login to monitor forest activity</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input id="username" type="text" placeholder="Enter your username" required value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
