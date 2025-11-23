# How to Get Your Firebase Web App Config

Your backend service account key is set up! ✅

Now you need to get the **Web App config** for your frontend.

## Steps:

1. **Go to Firebase Console**: https://console.firebase.google.com/
2. **Select your project**: `invest-d486b`
3. **Click the gear icon** (⚙️) next to "Project Overview"
4. **Click "Project Settings"**
5. **Scroll down to "Your apps"** section
6. **If you don't have a web app yet:**
   - Click the **Web icon** (`</>`)
   - Register your app (give it a nickname like "Financial Quiz App")
   - Click "Register app"
7. **Copy the config values** - You'll see something like:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSy...",
     authDomain: "invest-d486b.firebaseapp.com",
     projectId: "invest-d486b",
     storageBucket: "invest-d486b.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abc123"
   };
   ```
8. **Update your `.env` file** in `frontend/.env`:
   - Replace `REPLACE_WITH_YOUR_API_KEY` with the `apiKey` value
   - Replace `REPLACE_WITH_YOUR_SENDER_ID` with the `messagingSenderId` value
   - Replace `REPLACE_WITH_YOUR_APP_ID` with the `appId` value
   - The other values (authDomain, projectId, storageBucket) are already correct!

9. **Restart your dev server** after updating:
   ```bash
   # Stop the server (Ctrl+C) and restart:
   npm run dev
   ```

## Quick Check:

After updating, check your browser console. You should see:
- ✅ "✓ Firebase initialized successfully"

If you see:
- ⚠️ "⚠ Firebase not configured" - Check that all values in .env are filled in

## Your Project Info:

- **Project ID**: `invest-d486b`
- **Auth Domain**: `invest-d486b.firebaseapp.com`
- **Storage Bucket**: `invest-d486b.appspot.com`

You just need to get the `apiKey`, `messagingSenderId`, and `appId` from Firebase Console!

