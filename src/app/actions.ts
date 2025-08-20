
"use server";
import { analyzeIncidentConfidenceLevel as analyze } from "@/ai/flows/incident-confidence-level";
import type { AnalyzeIncidentConfidenceLevelInput } from "@/ai/flows/incident-confidence-level";
import { db } from "@/lib/firebase";
import { collection, addDoc, doc, updateDoc, deleteDoc } from "firebase/firestore";
import type { Device, User } from "@/lib/types";

// Since we can't easily interact with Firebase Auth on the server-side in this environment without a custom setup,
// we will focus on Firestore CRUD operations. User creation in Auth will still be handled on the client
// for simplicity in this prototype. Deleting a user will only delete their Firestore record.

export async function analyzeIncidentConfidenceLevel(input: AnalyzeIncidentConfidenceLevelInput) {
  const result = await analyze(input);
  return result;
}

// User Actions
export async function addUser(user: Omit<User, 'id'>) {
    // This is a placeholder for adding the user to Firestore.
    // In a real app, you would also handle the Firebase Auth user creation here.
    const docRef = await addDoc(collection(db, "users"), user);
    return { id: docRef.id, ...user };
}

export async function updateUser(userId: string, userData: Partial<User>) {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, userData);
}

export async function deleteUser(userId: string) {
    const userRef = doc(db, "users", userId);
    await deleteDoc(userRef);
    // Note: This does not delete the user from Firebase Auth.
    // A more complete solution would use a Cloud Function to handle this.
}

// Device Actions
export async function addDevice(device: Omit<Device, 'id' | 'lastReported'>) {
    const newDevice = {
        ...device,
        lastReported: new Date().toISOString(),
    };
    const docRef = await addDoc(collection(db, "devices"), newDevice);
    return { id: docRef.id, ...newDevice };
}

export async function updateDevice(deviceId: string, deviceData: Partial<Device>) {
    const deviceRef = doc(db, "devices", deviceId);
    await updateDoc(deviceRef, deviceData);
}

export async function deleteDevice(deviceId: string) {
    const deviceRef = doc(db, "devices", deviceId);
    await deleteDoc(deviceRef);
}
