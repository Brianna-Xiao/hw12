# Firebase Setup Instructions

## Step 1: Get Your Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (or create a new one)
3. Click the **gear icon** (⚙️) next to "Project Overview" → **Project Settings**
4. Scroll down to **"Your apps"** section
5. If you don't have a web app yet:
   - Click the **Web icon** (`</>`)
   - Register your app (give it a nickname like "Financial Quiz App")
   - Click "Register app"
6. Copy the `firebaseConfig` object values

## Step 2: Create Environment File

1. In the `frontend` directory, create a file named `.env`
2. Add your Firebase configuration:

```env
VITE_FIREBASE_API_KEY=your-api-key-here
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=your-app-id
```

3. Replace the placeholder values with your actual Firebase config values

## Step 3: Set Up Firestore Database

1. In Firebase Console, go to **Firestore Database** in the left sidebar
2. Click **"Create database"** (if you haven't already)
3. Choose **"Start in test mode"** (for development)
4. Select a location for your database
5. Click **"Enable"**

## Step 4: Set Up Security Rules (Important!)

1. In Firestore Database, go to the **"Rules"** tab
2. For development, you can use:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

⚠️ **Warning**: This allows anyone to read/write. For production, implement proper authentication and rules.

3. Click **"Publish"**

## Step 5: Restart Your Dev Server

After creating the `.env` file, restart your development server:

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

## How It Works

When a user completes the quiz:

1. A unique user ID is generated and stored in `localStorage`
2. The quiz results are automatically saved to Firebase Firestore in the `quizResults` collection
3. The data saved includes:
   - User ID
   - Role (investor/advisor)
   - All quiz answers
   - Personality scores
   - Personality type (MBTI code, name, description, color)
   - Timestamp

## Data Structure in Firebase

Each quiz result is stored as a document in the `quizResults` collection with this structure:

```javascript
{
  userId: "user_1234567890_abc123",
  role: "investor",
  quizAnswers: [
    { questionIndex: 0, value: 5 },
    { questionIndex: 1, value: 3 },
    // ... more answers
  ],
  personalityScores: {
    shortTermVsLongTerm: 2,
    highRiskVsLowRisk: -1,
    clarityVsComplexity: 0,
    consistentVsLumpSum: 1
  },
  personalityType: {
    code: "SLCH",
    name: "Strategic Long-Term Conservative",
    description: "...",
    color: "#4398b4"
  },
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

## Testing

1. Complete the quiz
2. Check the browser console - you should see: "Quiz results saved to Firebase with ID: ..."
3. Go to Firebase Console → Firestore Database
4. You should see a new document in the `quizResults` collection

## Troubleshooting

### "Firebase: Error (auth/configuration-not-found)"
- Make sure your `.env` file exists in the `frontend` directory
- Check that all environment variables start with `VITE_`
- Restart your dev server after creating/updating `.env`

### "Permission denied"
- Check your Firestore security rules
- Make sure you've published the rules

### Data not saving
- Check browser console for errors
- Verify Firebase config values in `.env` are correct
- Make sure Firestore is enabled in Firebase Console

## Next Steps

- Add Firebase Authentication for user login
- Update security rules for production
- Add ability to view quiz history
- Add user profiles

