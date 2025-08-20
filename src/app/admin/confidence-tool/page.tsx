import { AppShell } from "@/components/shared/app-shell";
import { ConfidenceForm } from "@/components/admin/confidence-form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";
import { AuthProvider } from "@/hooks/use-auth";

export const dynamic = 'force-dynamic';

export default function ConfidenceToolPage() {
    return (
        <AuthProvider>
            <AppShell role="administrator">
                <div className="max-w-2xl mx-auto space-y-6">
                    <div className="text-center">
                        <Lightbulb className="mx-auto h-12 w-12 text-accent"/>
                        <h1 className="text-3xl font-bold font-headline mt-2">Incident Confidence Analysis</h1>
                        <p className="text-muted-foreground mt-2">
                            Use our AI-powered tool to analyze the confidence level of new incidents based on sensor data and historical context.
                        </p>
                    </div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Analysis Input</CardTitle>
                            <CardDescription>
                                Provide the necessary data to begin analysis.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ConfidenceForm />
                        </CardContent>
                    </Card>
                </div>
            </AppShell>
        </AuthProvider>
    );
}
