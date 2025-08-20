# **App Name**: EcoGuard Mobile

## Core Features:

- User Authentication: Role-based Authentication: Secure Firebase Authentication (email/password, social sign-in) with role validation using Cloud Functions and Firestore. App navigation and content are conditional based on the user's role (Ranger or Administrator).
- Incident Display: Incident Dashboard: Displays a real-time list of unauthorized cutting incidents with timestamp, treeID, and status (new, acknowledged, resolved). Utilizes Firestore listeners for instant updates.
- Interactive Map: Interactive Map: Google Maps integration with color-coded pins to mark incident locations based on status. Includes a 'Quick Acknowledge' button for new incidents.
- Admin Tools: Admin Dashboard: Enhanced dashboard with KPIs (total incidents, resolved vs. unresolved) and heatmap overlay showing high-risk areas. Includes user and device management sections.
- Incident Details: Incident Detail Screen: Displays full incident history with timestamp, location, sensor logs, and a comment/notes section where rangers can add textual logs of their investigation. Supports photo uploads.
- Push Notifications: Push Notifications: Real-time push notifications via FCM to ranger devices for high-confidence incidents. Notifications link directly to the incident detail screen.
- Data Validation: Data Ingest & Confidence Scoring: Cloud Function to validate sensor data, calculate a confidence score for the incident, and write new data to Firestore.  A tool is used to decide whether or not confidence scores warrant the creation of a notification.

## Style Guidelines:

- Primary color: Deep forest green (#228B22), symbolizing nature and environmental awareness.
- Background color: Light off-white (#F5F5DC), providing a clean and unobtrusive backdrop.
- Accent color: Warm orange (#FF8C00) for interactive elements, drawing user attention.
- Body and headline font: 'PT Sans', a humanist sans-serif offering a modern yet accessible feel for readability across different screen sizes.
- Use clear, recognizable icons related to monitoring, security, and forest elements.
- Clean, intuitive layouts optimized for mobile devices, ensuring ease of use for both Rangers and Administrators.
- Subtle transitions and animations to enhance user experience and provide feedback during interactions.