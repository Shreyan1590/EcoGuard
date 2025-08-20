"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Lightbulb, ShieldCheck, Zap } from 'lucide-react';
import { analyzeIncidentConfidenceLevel } from '@/app/actions';
import type { AnalyzeIncidentConfidenceLevelOutput } from '@/ai/flows/incident-confidence-level';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const formSchema = z.object({
  sensorData: z.string().min(10, "Please provide more detailed sensor data."),
  historicalIncidentData: z.string().min(10, "Please provide more detailed historical data."),
});

export function ConfidenceForm() {
  const [result, setResult] = useState<AnalyzeIncidentConfidenceLevelOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sensorData: "Vibration sensor triggered at 85% intensity, acoustic sensor detected chainsaw sounds at 2:15 AM.",
      historicalIncidentData: "Two similar incidents occurred in this sector last month; both were confirmed illegal logging. Weather is clear.",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const analysisResult = await analyzeIncidentConfidenceLevel(values);
      setResult(analysisResult);
      if(analysisResult.shouldNotifyRangers){
        toast({
          title: "High Confidence Alert!",
          description: "Rangers should be notified about this incident.",
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Analysis Failed",
        description: "Could not analyze the incident. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="sensorData"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Raw Sensor Data</FormLabel>
                <FormControl>
                  <Textarea placeholder="e.g., 'vibration: high, sound: chainsaw detected, time: 2AM'" {...field} rows={4} />
                </FormControl>
                <FormDescription>Describe the data from the EcoGuard device sensors.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="historicalIncidentData"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Historical & Contextual Data</FormLabel>
                <FormControl>
                  <Textarea placeholder="e.g., '3 similar incidents in this area in the last month...'" {...field} rows={4} />
                </FormControl>
                <FormDescription>Provide context like past events, time, and weather.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
            {isLoading ? "Analyzing..." : <><Zap className="mr-2 h-4 w-4" /> Analyze Confidence</>}
          </Button>
        </form>
      </Form>
      
      {isLoading && (
         <div className="flex items-center justify-center p-8">
            <div className="text-center space-y-2">
                <p className="text-muted-foreground">AI is analyzing the data...</p>
                <Progress value={50} className="w-full animate-pulse" />
            </div>
         </div>
      )}

      {result && (
        <Card className="bg-secondary mt-6 border-primary border-l-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><ShieldCheck className="text-primary"/> Analysis Result</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Confidence Score</Label>
              <div className="flex items-center gap-4 mt-1">
                <Progress value={result.confidenceScore * 100} className="w-full h-3" />
                <span className="font-bold text-lg text-primary">{(result.confidenceScore * 100).toFixed(0)}%</span>
              </div>
            </div>
             <Alert variant={result.shouldNotifyRangers ? 'destructive' : 'default'}>
                <Lightbulb className="h-4 w-4" />
                <AlertTitle>Recommendation</AlertTitle>
                <AlertDescription>
                 {result.shouldNotifyRangers ? 'Notify Rangers Immediately' : 'Continue monitoring, no immediate notification required.'}
                </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
