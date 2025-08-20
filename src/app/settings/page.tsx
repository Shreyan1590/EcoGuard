
"use client";

import { useEffect, useState } from 'react';
import { AppShell } from "@/components/shared/app-shell";
import { Settings } from "lucide-react";
import { useAuth, AuthProvider } from '@/hooks/use-auth';
import { Skeleton } from '@/components/ui/skeleton';
import { SettingsForm } from '@/components/settings/settings-form';
import type { User } from '@/lib/types';

export const dynamic = 'force-dynamic';

function SettingsPageContent() {
    const { user, loading } = useAuth();
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    useEffect(() => {
        if (user) {
            setCurrentUser(user);
        }
    }, [user]);

    if (loading || !currentUser) {
        return (
             <AppShell role="ranger">
                 <div className="max-w-4xl mx-auto space-y-6">
                    <div className="text-center">
                        <Settings className="mx-auto h-12 w-12 text-accent"/>
                        <h1 className="text-3xl font-bold font-headline mt-2">Settings</h1>
                        <p className="text-muted-foreground mt-2">
                            Loading your settings...
                        </p>
                    </div>
                    <Skeleton className="h-96 w-full" />
                </div>
            </AppShell>
        );
    }
    
    return (
        <AppShell role={currentUser.role}>
            <div className="max-w-4xl mx-auto space-y-6">
                 <div className="text-center">
                    <Settings className="mx-auto h-12 w-12 text-accent"/>
                    <h1 className="text-3xl font-bold font-headline mt-2">Settings</h1>
                    <p className="text-muted-foreground mt-2">
                        Manage your profile, preferences, and application settings.
                    </p>
                </div>
                <SettingsForm user={currentUser} />
            </div>
        </AppShell>
    );
}


export default function SettingsPage() {
    return (
        <AuthProvider>
            <SettingsPageContent />
        </AuthProvider>
    )
}
