
"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { updateUser } from "@/app/actions";
import type { User } from "@/lib/types";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Paintbrush, User as UserIcon, Bell } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email(),
  username: z.string().min(1, "Username is required."),
  notifications: z.object({
    push: z.boolean(),
    email: z.boolean(),
  }),
  theme: z.object({
      primary: z.string(),
      accent: z.string(),
      background: z.string(),
  }).optional(),
});

interface SettingsFormProps {
    user: User;
}

export function SettingsForm({ user }: SettingsFormProps) {
    const { toast } = useToast();
    const isAdministrator = user.role === 'administrator';

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: user.name,
            email: user.email,
            username: user.username,
            notifications: {
                push: true,
                email: false,
            },
            theme: {
                primary: "120 61% 34%",
                accent: "33 100% 50%",
                background: "60 56% 91%",
            }
        },
    });

    const { formState: { isSubmitting }, control } = form;

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            const { notifications, theme, ...userData } = values;
            await updateUser(user.id, userData);
            
            if (isAdministrator && theme) {
                updateTheme(theme.primary, theme.accent, theme.background);
            }

            toast({ title: "Settings updated successfully!" });
        } catch (error: any) {
            toast({ title: "Failed to update settings", description: error.message, variant: "destructive" });
        }
    }

    function updateTheme(primary: string, accent: string, background: string) {
        document.documentElement.style.setProperty('--primary', primary);
        document.documentElement.style.setProperty('--accent', accent);
        document.documentElement.style.setProperty('--background', background);
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)}>
             <Card>
                <CardContent className="p-6">
                    <Accordion type="single" collapsible className="w-full" defaultValue="item-1">
                        <AccordionItem value="item-1">
                            <AccordionTrigger>
                                <div className="flex items-center gap-3">
                                    <UserIcon className="h-5 w-5 text-primary" />
                                    <h3 className="font-semibold text-lg">Profile</h3>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="pt-4 space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Full Name</Label>
                                        <Input id="name" {...form.register("name")} />
                                        {form.formState.errors.name && <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="username">Username</Label>
                                        <Input id="username" {...form.register("username")} />
                                         {form.formState.errors.username && <p className="text-sm text-destructive">{form.formState.errors.username.message}</p>}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" type="email" {...form.register("email")} disabled />
                                    <p className="text-xs text-muted-foreground">Email address cannot be changed.</p>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                        
                        <AccordionItem value="item-2">
                             <AccordionTrigger>
                                <div className="flex items-center gap-3">
                                    <Bell className="h-5 w-5 text-primary" />
                                    <h3 className="font-semibold text-lg">Notifications</h3>
                                </div>
                            </AccordionTrigger>
                             <AccordionContent className="pt-4 space-y-4">
                                <Controller
                                    control={control}
                                    name="notifications.push"
                                    render={({ field }) => (
                                        <div className="flex items-center justify-between rounded-lg border p-4">
                                            <div>
                                                <Label htmlFor="push-notifications">Push Notifications</Label>
                                                <p className="text-sm text-muted-foreground">Receive alerts on your device.</p>
                                            </div>
                                            <Switch id="push-notifications" checked={field.value} onCheckedChange={field.onChange} />
                                        </div>
                                    )}
                                />
                                <Controller
                                    control={control}
                                    name="notifications.email"
                                    render={({ field }) => (
                                         <div className="flex items-center justify-between rounded-lg border p-4">
                                            <div>
                                                <Label htmlFor="email-notifications">Email Notifications</Label>
                                                <p className="text-sm text-muted-foreground">Get weekly summaries via email.</p>
                                            </div>
                                            <Switch id="email-notifications" checked={field.value} onCheckedChange={field.onChange} />
                                        </div>
                                    )}
                                />
                            </AccordionContent>
                        </AccordionItem>
                        
                        {isAdministrator && (
                            <AccordionItem value="item-3">
                                <AccordionTrigger>
                                     <div className="flex items-center gap-3">
                                        <Paintbrush className="h-5 w-5 text-primary" />
                                        <h3 className="font-semibold text-lg">Theme</h3>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="pt-4 space-y-4">
                                    <p className="text-sm text-muted-foreground">Customize the look and feel of the application. Provide HSL values.</p>
                                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="theme-primary">Primary Color</Label>
                                            <Input id="theme-primary" {...form.register("theme.primary")} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="theme-accent">Accent Color</Label>
                                            <Input id="theme-accent" {...form.register("theme.accent")} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="theme-background">Background Color</Label>
                                            <Input id="theme-background" {...form.register("theme.background")} />
                                        </div>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        )}
                    </Accordion>
                     <div className="mt-6 flex justify-end">
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </form>
    );
}

