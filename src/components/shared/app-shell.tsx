
"use client";

import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { BarChart, Settings, LogOut, Trees, Bell, Map, ClipboardList, Wrench, Users, PanelLeft, Menu, Battery, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import type { UserRole } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';


const rangerNav = [
  { name: 'Dashboard', href: '/ranger/dashboard?view=list', icon: ClipboardList, view: 'list' },
  { name: 'Map', href: '/ranger/dashboard?view=map', icon: Map, view: 'map' },
  { name: 'Alerts', href: '#', icon: Bell },
  { name: 'Settings', href: '/settings', icon: Settings },
];

const adminNav = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: BarChart },
  { name: 'Users', href: '/admin/dashboard', icon: Users },
  { name: 'AI Tool', href: '/admin/confidence-tool', icon: Wrench },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function AppShell({ children, role }: { children: ReactNode; role: UserRole }) {
  const router = useRouter();
  const navigation = role === 'administrator' ? adminNav : rangerNav;

  const handleLogout = () => {
    // Here you would also sign out from Firebase
    router.push('/');
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <DesktopSidebar navigation={navigation} role={role} handleLogout={handleLogout} />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <MobileHeader navigation={navigation} role={role} handleLogout={handleLogout} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-20 md:pb-8">
          {children}
        </main>
        <footer className="text-center p-4 text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} Designed and Developed by{' '}
            <a href="https://www.shreyan.site" target="_blank" rel="noopener noreferrer" className="font-semibold text-primary hover:underline">
                Shreyan
            </a>
        </footer>
      </div>
       {/* Bottom Nav for Mobile */}
       <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t z-10">
        <div className="grid h-16 grid-cols-4">
           {rangerNav.map((item) => (
             <MobileNavLink key={item.name} href={item.href} icon={item.icon} name={item.name} view={item.view} />
           ))}
        </div>
      </nav>
    </div>
  );
}

function DesktopSidebar({ navigation, role, handleLogout }: { navigation: any[], role: UserRole, handleLogout: () => void }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentView = searchParams.get('view');
  
  const isRangerDashboard = pathname.startsWith('/ranger/dashboard');

  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
      <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
        <Link
          href="#"
          className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
        >
          <Trees className="h-5 w-5 transition-all group-hover:scale-110" />
          <span className="sr-only">EcoGuard</span>
        </Link>
        {navigation.map((item) => {
          const isActive = item.view
            ? isRangerDashboard && (currentView === item.view || (!currentView && item.view === 'list'))
            : pathname.startsWith(item.href) && item.href !== '#';
            
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-lg transition-colors md:h-8 md:w-8",
                isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="sr-only">{item.name}</span>
            </Link>
          );
        })}
      </nav>
      <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
        <button onClick={handleLogout} className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8">
          <LogOut className="h-5 w-5" />
          <span className="sr-only">Logout</span>
        </button>
      </nav>
    </aside>
  );
}

function MobileHeader({ navigation, role, handleLogout }: { navigation: any[], role: UserRole, handleLogout: () => void }) {
  const [time, setTime] = useState<Date | null>(null);
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);

  useEffect(() => {
    // Set initial time on client mount
    setTime(new Date());
    const timer = setInterval(() => setTime(new Date()), 1000);
    
    // Battery API is client-side only
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        setBatteryLevel(Math.floor(battery.level * 100));
        battery.addEventListener('levelchange', () => {
          setBatteryLevel(Math.floor(battery.level * 100));
        });
      });
    }

    return () => clearInterval(timer);
  }, []);

  return (
     <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="sm:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="sm:max-w-xs">
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              href="#"
              className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
            >
              <Trees className="h-5 w-5 transition-all group-hover:scale-110" />
              <span className="sr-only">EcoGuard</span>
            </Link>
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            ))}
             <button onClick={handleLogout} className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground">
                <LogOut className="h-5 w-5" />
                Logout
            </button>
          </nav>
        </SheetContent>
      </Sheet>
       <div className="flex items-center gap-2 sm:hidden">
         <Trees className="h-6 w-6 text-primary"/>
         <span className="font-bold">EcoGuard</span>
       </div>

      <div className="ml-auto flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-4 font-code text-base text-primary font-bold">
            {batteryLevel !== null && (
                <div className="flex items-center gap-2">
                    <Battery className="h-5 w-5"/>
                    <span>{batteryLevel}%</span>
                </div>
            )}
            {time !== null && (
                <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    <span>{time.toLocaleTimeString('en-IN', { hour12: false, timeZone: 'Asia/Kolkata' })}</span>
                </div>
            )}
        </div>
        <span className="hidden sm:inline capitalize font-semibold">{role}</span>
        <Button variant="outline" size="icon" className="hidden sm:inline-flex" onClick={handleLogout}>
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
    </header>
  )
}

function MobileNavLink({ href, icon: Icon, name, view }: { href: string, icon: React.ElementType, name: string, view?: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentView = searchParams.get('view');

  const isRangerDashboard = pathname.startsWith('/ranger/dashboard');
  const isActive = view
      ? isRangerDashboard && (currentView === view || (!currentView && view === 'list'))
      : pathname.startsWith(href) && href !== '#';

  return (
    <Link href={href} className={cn(
      "flex flex-col items-center justify-center gap-1 text-xs font-medium",
      isActive ? 'text-primary' : 'text-muted-foreground'
    )}>
      <Icon className="h-6 w-6" />
      <span>{name}</span>
    </Link>
  );
}
