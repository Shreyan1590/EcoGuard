"use client";

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Trees } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useState } from 'react';
import type { UserRole } from '@/lib/types';

export function LoginForm() {
  const router = useRouter();
  const [role, setRole] = useState<UserRole>('ranger');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (role === 'administrator') {
      router.push('/admin/dashboard');
    } else {
      router.push('/ranger/dashboard');
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
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="user@ecoguard.com" required defaultValue="ranger@ecoguard.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required defaultValue="password" />
          </div>
          <div className="space-y-3">
            <Label>Select Role (for prototype)</Label>
            <RadioGroup defaultValue="ranger" value={role} onValueChange={(value: UserRole) => setRole(value)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="ranger" id="r1" />
                <Label htmlFor="r1">Ranger</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="administrator" id="r2" />
                <Label htmlFor="r2">Administrator</Label>
              </div>
            </RadioGroup>
          </div>
          <Button type="submit" className="w-full bg-accent hover:bg-accent/90">
            Login
          </Button>
          <Button variant="outline" className="w-full" type="button">
            Sign in with Google
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
