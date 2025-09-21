# Complaint Management System

This is a comprehensive web portal for a complaint management system, designed for both administrators and users. Admins can view, assign, update, and analyze all user complaints in real-time. The system uses the Google Gemini API to automatically classify new complaints by urgency and category. Users can submit their own complaints and track their status.

---

## Features

### Admin Role
-   **Analytics Dashboard:** View key metrics like total complaints, open issues, and high-urgency tickets. Visualize data with charts for complaints by category and urgency.
-   **Real-Time Complaint List:** See all submitted complaints in a filterable and sortable table.
-   **Advanced Filtering:** Filter complaints by Status, Urgency, or Assigned Admin.
-   **Status & Assignment Management:** Update the status of a complaint or assign it to an admin directly from the list.
-   **Create Complaints:** Admins can submit new complaints on behalf of users.

### User Role
-   **Personal Dashboard:** View a clean list of all complaints you have submitted.
-   **Submit New Complaints:** Easily create a new complaint through a simple modal.
-   **Attach GPS Location:** Optionally add your current geographical location to a complaint for better context.
-   **Real-Time Status Tracking:** See the latest status of your complaints as they are processed by admins.

### Core Technology
-   **Real-Time Backend:** Uses Firebase (Firestore and Authentication) for a persistent, real-time backend.
-   **AI-Powered Classification:** New complaints are automatically analyzed by the Google Gemini API to determine their urgency and category, enabling faster routing.
-   **Role-Based Access Control:** A unified interface that intelligently presents different views and capabilities based on whether you are logged in as a User or an Admin.

---

## Tech Stack

-   **Frontend:** React 18, TypeScript, Vite
-   **Backend:** Firebase (Firestore, Authentication)
-   **Styling:** Tailwind CSS
-   **AI Model:** Google Gemini API (`@google/genai`)
-   **Charts:** Recharts
-   **Icons:** Heroicons
-   **Date Formatting:** date-fns

---

## Getting Started: Running Locally

Follow these instructions to get the project up and running on your local machine for development and testing purposes.

### 1. Prerequisites

Make sure you have the following software installed on your laptop:
-   [Node.js](https://nodejs.org/) (v18.x or later recommended)
-   [npm](https://www.npmjs.com/) (comes with Node.js)
-   [Git](https://git-scm.com/)

### 2. Clone the Repository

Open your terminal, navigate to where you want to store the project, and clone the repository.

```bash
# Replace YOUR_REPOSITORY_URL with the actual URL from GitHub
git clone YOUR_REPOSITORY_URL
cd name-of-the-project
```

### 3. Install Dependencies

Install all the necessary project dependencies using npm.

```bash
npm install
```

### 4. Set Up Environment Variables

The application requires API keys for both Google Gemini and Firebase.

1.  **Create an Environment File:** In the root directory of the project, create a new file named `.env`.

2.  **Add Your Keys:** Open the `.env` file and add the following lines, replacing the placeholder values with your actual credentials.

    ```env
    # Google Gemini API Key
    # Get one from Google AI Studio: https://aistudio.google.com/app/apikey
    VITE_API_KEY=YOUR_GEMINI_API_KEY_HERE

    # Firebase Project Configuration
    # Create a project at https://console.firebase.google.com/
    # Go to Project Settings > General > Your apps > Web app > SDK setup and configuration
    VITE_FIREBASE_API_KEY=YOUR_FIREBASE_API_KEY
    VITE_FIREBASE_AUTH_DOMAIN=YOUR_PROJECT_ID.firebaseapp.com
    VITE_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
    VITE_FIREBASE_STORAGE_BUCKET=YOUR_PROJECT_ID.appspot.com
    VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
    VITE_FIREBASE_APP_ID=YOUR_APP_ID
    ```
    **Note:** The `VITE_` prefix is required by the Vite build tool to expose these variables to the application.

### 5. Set Up Firebase

1.  **Enable Authentication:** In your Firebase project console, go to **Authentication** -> **Sign-in method** and enable the **Email/Password** provider.

2.  **Create Test Users:** Go to the **Users** tab in the Authentication section and add the following two users so you can log in:
    -   `admin@example.com` (password: `password`)
    -   `user@example.com` (password: `password`)

3.  **Set Up Firestore:** Go to **Firestore Database** and create a new database. Start in **test mode** for easy setup (you can secure it later with security rules).

### 6. Configure Firestore Security Rules

By default, your Firestore database is locked down to prevent unauthorized access. The error `Missing or insufficient permissions` indicates that your security rules are blocking the application from reading data.

For this application to work, you must update your rules to allow authenticated users to read and write data.

1.  Go to your **Firebase Project Console**.
2.  Navigate to **Firestore Database** from the left-hand menu.
3.  Click on the **Rules** tab at the top.
4.  Replace the entire content of the editor with the following rules:

    ```
    rules_version = '2';
    service cloud.firestore {
      match /databases/{database}/documents {
        // Allow read and write access only for authenticated users
        match /{document=**} {
          allow read, write: if request.auth != null;
        }
      }
    }
    ```

5.  Click **Publish**. The changes will take effect immediately.

**Security Note:** These rules are suitable for development. For a production application, you should implement more granular rules to restrict access further (e.g., users can only edit their own complaints, admins can edit any).

### 7. Firestore Data Model

The application uses a single top-level collection in Firestore called `complaints`.

#### `complaints` Collection

Each document in this collection represents a single complaint and has the following structure:

| Field         | Type                               | Description                                                                                             |
| ------------- | ---------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `text`        | `string`                           | The full text content of the complaint submitted by the user.                                           |
| `submittedBy` | `string`                           | The Firebase Authentication UID of the user who created the complaint.                                  |
| `timestamp`   | `Timestamp`                        | A server-generated timestamp indicating when the complaint was created. Used for sorting.                 |
| `status`      | `string`                           | The current status of the complaint (e.g., `Submitted`, `Classified`, `Resolved`).                      |
| `urgency`     | `string` / `null`                  | The AI-classified urgency of the complaint (e.g., `High`, `Medium`, `Low`). Initially `null`.           |
| `category`    | `string` / `null`                  | The AI-classified category (e.g., `Infrastructure`, `Service`). Initially `null`.                       |
| `assignedTo`  | `string` / `null`                  | The UID of the admin assigned to handle this complaint. `null` if unassigned.                           |
| `location`    | `Map` (optional)                   | An object containing the geographical coordinates. e.g., `{ lat: 34.05, lng: -118.24 }`                 |
| `auditLog`    | `Array` of `Map`                   | An array that tracks all changes made to the complaint. Each entry in the array is an object with:      |
|               |                                    | - `timestamp`: `Timestamp` of the event.                                                                |
|               |                                    | - `adminId`: `string` UID of the actor (`system`, `system-ai`, or an admin).                          |
|               |                                    | - `action`: `string` describing the action (e.g., `Submitted`, `Status changed`).                     |
|               |                                    | - `details`: `string` with more information about the change.                                           |

This structure allows for real-time querying and efficient updates, with a complete history of actions for each complaint.

### 8. Run the Application

You are all set! Start the local development server with the following command:

```bash
npm run dev
```

Your terminal will display a message indicating that the server is running, usually on `http://localhost:5173`. Open this URL in your web browser to see the application.