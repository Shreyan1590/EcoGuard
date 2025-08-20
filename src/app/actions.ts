"use server";
import { analyzeIncidentConfidenceLevel as analyze } from "@/ai/flows/incident-confidence-level";
import type { AnalyzeIncidentConfidenceLevelInput } from "@/ai/flows/incident-confidence-level";

export async function analyzeIncidentConfidenceLevel(input: AnalyzeIncidentConfidenceLevelInput) {
  // In a real app, you could add server-side validation or further logic here
  const result = await analyze(input);
  return result;
}
