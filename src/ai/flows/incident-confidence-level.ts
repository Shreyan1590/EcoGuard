'use server';

/**
 * @fileOverview This file defines a Genkit flow for analyzing the confidence level of
 *   new incidents based on sensor data and historical incident data.
 *
 * - analyzeIncidentConfidenceLevel - A function that analyzes incident confidence level.
 * - AnalyzeIncidentConfidenceLevelInput - The input type for the analyzeIncidentConfidenceLevel function.
 * - AnalyzeIncidentConfidenceLevelOutput - The return type for the analyzeIncidentConfidenceLevel function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeIncidentConfidenceLevelInputSchema = z.object({
  sensorData: z.string().describe('The raw sensor data from the EcoGuard device.'),
  historicalIncidentData: z
    .string()
    .describe('Historical data about similar incidents in the area.'),
});
export type AnalyzeIncidentConfidenceLevelInput = z.infer<
  typeof AnalyzeIncidentConfidenceLevelInputSchema
>;

const AnalyzeIncidentConfidenceLevelOutputSchema = z.object({
  confidenceScore: z
    .number()
    .describe(
      'A score between 0 and 1 representing the confidence level of the incident.'
    ),
  shouldNotifyRangers: z
    .boolean()
    .describe(
      'Whether or not rangers should be notified based on the confidence score.'
    ),
});
export type AnalyzeIncidentConfidenceLevelOutput = z.infer<
  typeof AnalyzeIncidentConfidenceLevelOutputSchema
>;

export async function analyzeIncidentConfidenceLevel(
  input: AnalyzeIncidentConfidenceLevelInput
): Promise<AnalyzeIncidentConfidenceLevelOutput> {
  return analyzeIncidentConfidenceLevelFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeIncidentConfidenceLevelPrompt',
  input: {schema: AnalyzeIncidentConfidenceLevelInputSchema},
  output: {schema: AnalyzeIncidentConfidenceLevelOutputSchema},
  prompt: `You are an expert system designed to analyze the confidence level of new forest incidents reported by EcoGuard devices.

You will receive raw sensor data and historical incident data. Your goal is to determine a confidence score (between 0 and 1) indicating the likelihood that the incident is a serious illegal logging event.

Based on the confidence score, you will also determine whether rangers should be notified. Notify rangers only if the incident is likely to be serious to avoid false alarms.

Sensor Data: {{{sensorData}}}
Historical Incident Data: {{{historicalIncidentData}}}

Consider the following factors when determining the confidence score and notification decision:

- Number and type of triggered sensors
- Similarity to past illegal logging incidents in the area
- Time of day
- Weather conditions
- Proximity to known logging hotspots

Output a JSON object containing the confidenceScore and shouldNotifyRangers fields.
`,
});

const analyzeIncidentConfidenceLevelFlow = ai.defineFlow(
  {
    name: 'analyzeIncidentConfidenceLevelFlow',
    inputSchema: AnalyzeIncidentConfidenceLevelInputSchema,
    outputSchema: AnalyzeIncidentConfidenceLevelOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
