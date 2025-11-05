# Firebase Setup Instructions

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Follow the setup wizard (you can skip Google Analytics for now if you want)

## Step 2: Enable Authentication

1. In your Firebase project, go to **Authentication** in the left sidebar
2. Click **Get Started** if this is your first time
3. Go to the **Sign-in method** tab
4. Click on **Email/Password**
5. Enable it and click **Save**

## Step 3: Create Firestore Database

1. In your Firebase project, go to **Firestore Database** in the left sidebar
2. Click **Create database**
3. Choose **Start in test mode** (for development)
4. Select a location for your database
5. Click **Enable**

### Important: Set up Security Rules

For production, you should set up proper security rules. Go to the **Rules** tab and use:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /{collection}/{document} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    // Profile and targets are stored with userId as document ID
    match /profile/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /targets/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Step 4: Get Your Firebase Config

1. In your Firebase project, click the gear icon next to "Project Overview"
2. Click **Project settings**
3. Scroll down to **Your apps** section
4. Click the **Web** icon (`</>`) to add a web app if you haven't already
5. Register your app with a nickname (e.g., "FitTrack Web")
6. Copy the Firebase config values from the SDK setup section

## Step 5: Add Environment Variables

1. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Open `.env.local` and replace the placeholder values with your actual Firebase config:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
   NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
   ```

## Step 6: Restart Your Development Server

After adding the environment variables, restart your Next.js dev server:

```bash
npm run dev
```

## Testing

1. Go to `http://localhost:3000`
2. You should be redirected to `/login`
3. Create an account with email/password
4. Once logged in, your data will sync to Firestore automatically
5. Log in from another device/browser with the same credentials to verify sync

## Data Collections

Your data will be stored in these Firestore collections:
- `profile` - User profile and settings
- `targets` - Macro targets
- `weights` - Weight tracking entries
- `foods` - Food library
- `diary` - Daily food diary entries
- `workouts` - Workout sessions

Each document (except profile/targets) includes a `userId` field to associate it with the logged-in user.

