# Complaint Management System v2.0

This is a comprehensive, real-time portal for a complaint management system, now fully powered by **Firebase** and enhanced with intelligent classification via the **Google Gemini API**. The application serves three distinct roles with tailored user experiences.

1.  **Admin Portal (Web):** A powerful, desktop-first interface for administrators to manage, track, and analyze all user-submitted complaints across all departments.
2.  **Department Head Portal (Web):** A scoped-down desktop view for department managers to handle complaints relevant only to their specific department (e.g., Public Works, Utilities).
3.  **User Portal (Mobile):** A streamlined, mobile-first experience for users to submit new complaints and track the status of their submissions.

---

## Access & Roles

The application is designed with a clear separation of concerns based on user roles.

### 👑 Admin Portal
-   **Intended Device:** Desktop or tablet browsers.
-   **Access:** `admin@example.com`
-   **Purpose:** Provides a full suite of tools for complaint management, including an analytics dashboard, a filterable list of *all* complaints, and the ability to assign tasks and update statuses.

### 👔 Department Head Portal
-   **Intended Device:** Desktop or tablet browsers.
-   **Access:** `manager@publicworks.com` or `manager@utilities.com`
-   **Purpose:** A focused dashboard for department leaders. They can view analytics and manage complaints that have been automatically assigned to their department by the AI.

### 👤 User Portal
-   **Intended Device:** Mobile phones.
-   **Access:** `user@example.com` on a mobile device or by using browser developer tools to simulate one.
-   **Purpose:** Offers a focused experience for end-users. They can quickly submit a new complaint and view the status of their past submissions. Access from a desktop browser is intentionally blocked.

---

## Features

### Admin & Department Head Roles (Web)
-   **Real-Time Analytics Dashboard:** View key metrics like total complaints, open issues, and high-urgency tickets. Visualize data with charts for complaints by category and department.
-   **Live Complaint List:** See submitted complaints appear in real-time in a filterable and sortable table.
-   **Advanced Filtering:** Filter complaints by Status, Urgency, Department (Admins only), or Assigned Admin.
-   **Direct Management:** Update the status of a complaint or assign it to a specific team member directly from the list.
-   **Notifications:** Admins receive real-time notifications when new complaints are classified and assigned to a department.
-   **Create Complaints:** Admins can submit new complaints on behalf of users.

### User Role (Mobile)
-   **Personal Dashboard:** View a clean list of all complaints you have submitted.
-   **Submit New Complaints:** Easily create a new complaint through a simple modal.
-   **Attach GPS Location:** Optionally add your current geographical location to a complaint for better context.
-   **Real-Time Status Tracking:** See the latest status of your complaints as they are processed by admins.

### Core Technology
-   **Real-Time Backend:** Uses **Firebase (Firestore and Authentication)** for a persistent, live-updating backend.
-   **AI-Powered Classification:** New complaints are automatically analyzed by the **Google Gemini API** to determine their urgency, category, and the correct **department** for assignment.
-   **Role-Based Access Control (RBAC):** A unified application that intelligently presents different views and capabilities based on user role.

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

Follow these instructions to get the project up and running on your local machine.

### 1. Prerequisites

-   [Node.js](https://nodejs.org/) (v18.x or later)
-   [npm](https://www.npmjs.com/)
-   A Google account for Firebase and Google AI Studio.

### 2. Clone & Install

```bash
# Clone the repository
git clone YOUR_REPOSITORY_URL
cd name-of-the-project

# Install dependencies
npm install
```

### 3. Set Up Environment Variables

1.  **Create `.env` file:** In the project root, create a file named `.env`.
2.  **Add Your Keys:** Populate the `.env` file with your credentials from Google AI Studio and your Firebase project.

    ```env
    # Google Gemini API Key
    # Get one from Google AI Studio: https://aistudio.google.com/app/apikey
    VITE_API_KEY=YOUR_GEMINI_API_KEY_HERE

    # Firebase Project Configuration
    # From Project Settings > General > Your apps > Web app > SDK setup
    VITE_FIREBASE_API_KEY=YOUR_FIREBASE_API_KEY
    VITE_FIREBASE_AUTH_DOMAIN=YOUR_PROJECT_ID.firebaseapp.com
    VITE_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
    VITE_FIREBASE_STORAGE_BUCKET=YOUR_PROJECT_ID.appspot.com
    VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
    VITE_FIREBASE_APP_ID=YOUR_APP_ID
    ```
    **Note:** The `VITE_` prefix is required by Vite to expose these variables to the application.

### 4. Set Up Firebase

1.  **Create a Firebase Project:** Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.

2.  **Enable Authentication:** In your new project, go to **Authentication** > **Sign-in method** and enable **Email/Password**.

3.  **Create Test Users:** Go to the **Users** tab and add the following users (the password for all is `password`):
    -   `admin@example.com`
    -   `manager@publicworks.com`
    -   `manager@utilities.com`
    -   `user@example.com`

4.  **Set Up Firestore:** Go to **Firestore Database**, create a new database, and start in **test mode** (this allows initial access).

5.  **Configure Firestore Security Rules:** Your database is insecure in test mode. Go to the **Rules** tab in Firestore and replace the contents with the following to allow access only for authenticated users:

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
    Click **Publish**. For a production app, you would implement more granular security rules.

### 5. Run the Application

Start the local development server. **Important:** If the server was already running when you created the `.env` file, you must stop it (`Ctrl+C`) and restart it.

```bash
npm run dev
```

Open `http://localhost:5173` (or the URL provided) in your browser. If you see a configuration error screen, double-check your `.env` file and restart the server.

---

## How to Test

### Testing the Admin Portal
1.  Open the application in a desktop browser.
2.  Log in with **Email:** `admin@example.com`, **Password:** `password`.
3.  You should see the full-featured admin dashboard with data for all departments.

### Testing the Department Head Portal
1.  Open the application in a desktop browser.
2.  Log in with **Email:** `manager@publicworks.com`, **Password:** `password`.
3.  You should see a dashboard scoped to the "Public Works" department. Create a new complaint as an admin or user with text like "There is a huge pothole on Elm Street" and it should appear here after being classified by the AI.

### Testing the User Portal
1.  Open the application in a desktop browser.
2.  **Open Developer Tools:** Press `F12` or `Ctrl+Shift+I`.
3.  **Enable Device Simulation:** Click the "Toggle device toolbar" icon (looks like a phone and tablet). Select a device like "iPhone 12 Pro".
4.  **Refresh the page** while in device simulation mode.
5.  Log in with **Email:** `user@example.com`, **Password:** `password`.
6.  You should see the mobile-optimized user dashboard. If you toggle device simulation off and refresh, you will see the "Mobile Experience Recommended" screen.
