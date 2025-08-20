"use client";

import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { BarChart, Settings, LogOut, Trees, Bell, Map, ClipboardList, Wrench, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { UserRole } from '@/lib/types';

const rangerNav = [
  { name: 'Dashboard', href: '/ranger/dashboard', icon: ClipboardList },
  { name: 'Map', href: '/ranger/dashboard', icon: Map },
  { name: 'Alerts', href: '#', icon: Bell },
  { name: 'Settings', href: '#', icon: Settings },
];

const adminNav = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: BarChart },
  { name: 'Users', href: '#', icon: Users },
  { name: 'AI Tool', href: '/admin/confidence-tool', icon: Wrench },
  { name: 'Settings', href: '#', icon: Settings },
];

export function AppShell({ children, role }: { children: ReactNode; role: UserRole }) {
  const pathname = usePathname();
  const router = useRouter();
  const navigation = role === 'administrator' ? adminNav : rangerNav;

  const handleLogout = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen flex flex-col bg-secondary/50">
      <header className="bg-card text-card-foreground shadow-md sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Trees className="h-8 w-8 text-primary" />
              <h1 className="text-xl font-bold font-headline text-primary">EcoGuard</h1>
            </div>
            <div className="flex items-center space-x-2">
              <span className="hidden sm:inline capitalize font-semibold">{role}</span>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-20 md:pb-8">
          {children}
        </main>
      </div>
      
      <nav className="md:hidden fixed bottom-0 bg-card border-t z-10 w-full">
        <div className="flex justify-around items-center h-16">
          {navigation.map((item) => (
            <Link key={item.name} href={item.href} className={`flex flex-col items-center justify-center space-y-1 w-full h-full ${pathname === item.href ? 'text-primary' : 'text-muted-foreground'}`}>
                <item.icon className="h-6 w-6" />
                <span className="text-xs font-medium">{item.name}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
