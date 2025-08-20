
import { AppShell } from "@/components/shared/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings } from "lucide-react";

export default function SettingsPage() {
    // In a real app, you would fetch user data to determine the role.
    // For this prototype, we'll just pass a role to AppShell.
    // This could be improved with a proper auth context.
    const userRole = "administrator"; 

    return (
        <AppShell role={userRole}>
            <div className="max-w-2xl mx-auto space-y-6">
                 <div className="text-center">
                    <Settings className="mx-auto h-12 w-12 text-accent"/>
                    <h1 className="text-3xl font-bold font-headline mt-2">Settings</h1>
                    <p className="text-muted-foreground mt-2">
                        Manage your application settings here.
                    </p>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Application Settings</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">
                            Settings page is under construction. More options will be available soon.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </AppShell>
    );
}
