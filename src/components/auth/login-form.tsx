
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
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
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
            const userData = userDoc.data();
            emailToLogin = userData.email;
            userRole = userData.role;
        } else {
            toast({
              title: "Login Failed",
              description: `User with username '${username}' not found.`,
              variant: "destructive",
            });
            setIsLoading(false);
            return;
        }
      }
      
      let userCredential;
      try {
        userCredential = await signInWithEmailAndPassword(auth, emailToLogin, password);
      } catch (error: any) {
        if (isAdminLogin && (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential')) {
          try {
            userCredential = await createUserWithEmailAndPassword(auth, adminEmail, password);
            await createUserInFirestore(userCredential.user.uid, 'Administrator', adminEmail, 'administrator', 'admin');
          } catch(creationError: any) {
            // If admin already exists in auth but sign-in failed, try sign-in again
            if (creationError.code === 'auth/email-already-in-use') {
              userCredential = await signInWithEmailAndPassword(auth, adminEmail, password);
            } else {
              throw creationError; // Re-throw other creation errors
            }
          }
        } else if (error.code === 'auth/invalid-credential') {
           toast({
            title: "Login Failed",
            description: "The password for this user is incorrect. Please try again.",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        } else {
          throw error;
        }
      }
      
      if (!userCredential) {
          throw new Error("Could not sign in or create user.");
      }

      const user = userCredential.user;
      
      // Ensure Firestore document exists
      const userDocRef = doc(db, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);
      let firestoreUserRole = userDocSnap.data()?.role;

      if (!userDocSnap.exists()) {
          const name = userRole === 'administrator' ? 'Administrator' : 'Ranger';
          await createUserInFirestore(user.uid, name, emailToLogin, userRole, username);
          firestoreUserRole = userRole;
      }
      
      if (firestoreUserRole === 'administrator') {
        router.push('/admin/dashboard');
      } else {
        router.push('/ranger/dashboard');
      }

    } catch (error: any) {
      console.error(error);
      toast({
        title: "Login Failed",
        description: error.message || "An unknown error occurred. Please try again.",
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
        <CardTitle className="text-3xl font-headline text-primary">EcoGuard</CardTitle>
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
            <Input id="password" type="password" placeholder="Enter your password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
