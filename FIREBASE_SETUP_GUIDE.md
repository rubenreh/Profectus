# Complete Firebase Setup Guide - Step by Step

Follow these instructions exactly to set up Firebase for your fitness app.

## STEP 1: Create a Firebase Account and Project

### 1.1 Go to Firebase Console
1. Open your web browser
2. Go to: **https://console.firebase.google.com/**
3. Sign in with your Google account (or create one if you don't have it)
   - You'll use this Google account to manage your Firebase project

### 1.2 Create a New Project
1. Click the **"Add project"** button (or "Create a project" if it's your first time)
2. **Project name**: Enter something like "fitness-app" or "fittrack" (you can use any name)
3. Click **"Continue"**
4. **Google Analytics**: You'll be asked if you want to enable Google Analytics
   - For this app, you can choose **"Not now"** or **"Disable"** - it's optional
   - Click **"Continue"** if you see this step
5. Review and click **"Create project"**
6. Wait about 30 seconds for Firebase to create your project
7. Click **"Continue"** when it says "Your project is ready"

---

## STEP 2: Enable Email/Password Authentication

### 2.1 Navigate to Authentication
1. In the left sidebar, look for **"Authentication"** (it has a key icon 🔑)
2. Click on **"Authentication"**
3. You'll see a screen that says "Get started" - click **"Get started"**

### 2.2 Enable Email/Password Sign-in
1. You'll see tabs at the top: **Users**, **Sign-in method**, etc.
2. Click on the **"Sign-in method"** tab
3. You'll see a list of sign-in providers. Look for **"Email/Password"**
4. Click on **"Email/Password"**
5. You'll see a toggle at the top - **turn it ON** (it should be blue/enabled)
6. Leave "Email link (passwordless sign-in)" **OFF** (not needed for this app)
7. Click **"Save"** at the bottom
8. You should see a green checkmark or confirmation message

---

## STEP 3: Create Firestore Database

### 3.1 Navigate to Firestore
1. In the left sidebar, look for **"Firestore Database"** (database icon)
2. Click on **"Firestore Database"**
3. Click **"Create database"** button

### 3.2 Choose Production or Test Mode
1. You'll see two options:
   - **"Start in production mode"** - More secure, but requires rules setup
   - **"Start in test mode"** - Less secure, but easier for development
2. For now, choose **"Start in test mode"** 
   - Click **"Next"**
   - **NOTE**: Test mode allows anyone to read/write your database. This is fine for personal use, but if you're sharing the app publicly, you'll need to set up security rules later.

### 3.3 Choose Database Location
1. Select a location close to you (or the default)
   - Examples: `us-central`, `europe-west`, etc.
   - This affects latency but doesn't matter much for personal use
2. Click **"Enable"**
3. Wait about 30-60 seconds for the database to be created

---

## STEP 4: Get Your Firebase Configuration Values

### 4.1 Go to Project Settings
1. Click the **gear icon** (⚙️) next to "Project Overview" in the left sidebar
2. Click **"Project settings"**

### 4.2 Find Your Web App Configuration
1. Scroll down on the settings page
2. Look for a section called **"Your apps"** 
3. You'll see different platform icons (Android, iOS, Web)
4. Click the **Web icon** (`</>`) - this represents a web application

### 4.3 Register Your Web App
1. A popup will appear asking you to register your app
2. **App nickname**: Enter something like "Profectus Web" or "Fitness App"
3. You can leave "Also set up Firebase Hosting" **unchecked** (we don't need that)
4. Click **"Register app"**

### 4.4 Copy Your Configuration
After registering, you'll see your Firebase configuration. It will look something like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC1234567890abcdefghijklmnopqrstuv",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};
```

**You need to copy these 6 values:**
1. `apiKey` - Starts with "AIza"
2. `authDomain` - Looks like "xxxxx.firebaseapp.com"
3. `projectId` - Your project name (or a unique ID)
4. `storageBucket` - Looks like "xxxxx.appspot.com"
5. `messagingSenderId` - A long number
6. `appId` - Looks like "1:123456:web:abcdef"

**IMPORTANT**: Keep this page open or copy these values - you'll need them next!

---

## STEP 5: Add Environment Variables to Your App

### 5.1 Create .env.local File
1. Open your project folder in your code editor
2. Navigate to: `/Users/rubenrehal/Documents/Personal/Projects/Fitness App/fitness-app/`
3. Look for a file called `.env.local.example` (I created this for you)
4. **Create a new file** called `.env.local` in the same directory
   - Make sure it's `.env.local` (starts with a dot)
   - If you can't see it, your editor might be hiding hidden files

### 5.2 Add Your Firebase Values
Open `.env.local` and paste this template, then replace each value with your actual Firebase values:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=PASTE_YOUR_API_KEY_HERE
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=PASTE_YOUR_AUTH_DOMAIN_HERE
NEXT_PUBLIC_FIREBASE_PROJECT_ID=PASTE_YOUR_PROJECT_ID_HERE
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=PASTE_YOUR_STORAGE_BUCKET_HERE
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=PASTE_YOUR_MESSAGING_SENDER_ID_HERE
NEXT_PUBLIC_FIREBASE_APP_ID=PASTE_YOUR_APP_ID_HERE
```

**Example** (yours will be different):
```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyC1234567890abcdefghijklmnopqrstuv
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=my-fitness-app.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=my-fitness-app
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=my-fitness-app.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890
```

**Important Notes:**
- No quotes needed around the values
- No spaces before or after the `=` sign
- Each value on its own line
- Make sure there are no typos

### 5.3 Save the File
1. Save the `.env.local` file
2. Make sure it's saved in the `fitness-app` folder (same folder as `package.json`)

---

## STEP 6: Verify Your Setup

### 6.1 Restart Your Development Server
1. If your development server is running, **stop it** (press `Ctrl+C` in the terminal)
2. Navigate to your project folder in terminal:
   ```bash
   cd "/Users/rubenrehal/Documents/Personal/Projects/Fitness App/fitness-app"
   ```
3. Start the server again:
   ```bash
   npm run dev
   ```

### 6.2 Test the App
1. Open your browser and go to: **http://localhost:3000**
2. You should be redirected to `/login` page
3. You should see a login form with:
   - Email field
   - Password field
   - Sign in button
   - Link to sign up

### 6.3 Create Your First Account
1. Click on "Don't have an account? Sign up" (or similar)
2. Enter an email address (can be a test email)
3. Enter a password (at least 6 characters)
4. Click "Sign Up"
5. If successful, you should be redirected to the dashboard
6. If you see any errors, check:
   - Are your environment variables correct?
   - Did you save `.env.local`?
   - Did you restart the server after adding the variables?

---

## STEP 7: Set Up Security Rules (IMPORTANT for Production)

Right now, your database is in "test mode" which means anyone with your project ID could potentially access it. For production or sharing, you need to add security rules.

### 7.1 Go to Firestore Rules
1. In Firebase Console, go to **Firestore Database**
2. Click on the **"Rules"** tab at the top
3. You'll see default test mode rules that look like:
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if request.time < timestamp.date(2024, 12, 31);
       }
     }
   }
   ```

### 7.2 Replace with Secure Rules
Replace everything in the rules editor with this:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Profile and targets - stored with userId as document ID
    match /profile/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /targets/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // All other collections - check userId field in document
    match /weights/{documentId} {
      allow read, write: if request.auth != null && 
        (request.auth.uid == resource.data.userId || 
         request.auth.uid == request.resource.data.userId);
    }
    match /foods/{documentId} {
      allow read, write: if request.auth != null && 
        (request.auth.uid == resource.data.userId || 
         request.auth.uid == request.resource.data.userId);
    }
    match /diary/{documentId} {
      allow read, write: if request.auth != null && 
        (request.auth.uid == resource.data.userId || 
         request.auth.uid == request.resource.data.userId);
    }
    match /workouts/{documentId} {
      allow read, write: if request.auth != null && 
        (request.auth.uid == resource.data.userId || 
         request.auth.uid == request.resource.data.userId);
    }
  }
}
```

### 7.3 Publish the Rules
1. Click **"Publish"** button
2. Wait for confirmation that rules are published

---

## Troubleshooting

### Problem: "Firebase: Error (auth/configuration-not-found)"
**Solution**: Your environment variables aren't loading. Check:
- Is `.env.local` in the correct folder? (same folder as `package.json`)
- Did you restart the server after creating `.env.local`?
- Are there any typos in the variable names? (they must start with `NEXT_PUBLIC_`)
- Make sure values don't have quotes around them

### Problem: "Firebase: Error (auth/email-already-in-use)"
**Solution**: This email is already registered. Either:
- Use a different email
- Or try logging in instead of signing up

### Problem: "Firebase: Error (auth/invalid-email)"
**Solution**: Make sure your email is formatted correctly (e.g., `user@example.com`)

### Problem: "Firebase: Error (auth/weak-password)"
**Solution**: Password must be at least 6 characters long

### Problem: Data not syncing across devices
**Solution**: 
- Make sure you're logged into the same Firebase account on both devices
- Wait a few seconds for sync (it happens automatically after changes)
- Refresh the page

---

## What Happens Next?

Once everything is set up:
1. ✅ You can sign up and log in
2. ✅ Your data automatically saves to Firebase
3. ✅ Your data syncs across all your devices
4. ✅ You can export your data to CSV files
5. ✅ Everything is backed up in the cloud

---

## Quick Checklist

Before you finish, make sure:
- [ ] Created Firebase project
- [ ] Enabled Email/Password authentication
- [ ] Created Firestore database
- [ ] Copied all 6 Firebase config values
- [ ] Created `.env.local` file with all values
- [ ] Restarted development server
- [ ] Successfully created an account
- [ ] Can log in and see the dashboard
- [ ] Updated Firestore security rules

---

## Need Help?

If you get stuck:
1. Double-check each step above
2. Make sure all environment variables are correct
3. Check the browser console for error messages (F12)
4. Verify your Firebase project is active in the console

Good luck! 🚀

