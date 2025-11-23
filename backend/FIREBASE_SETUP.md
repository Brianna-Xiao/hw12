# Firebase Admin SDK Setup for Python Backend

## Step 1: Get Service Account Key

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click the **gear icon** (⚙️) → **Project Settings**
4. Go to the **"Service Accounts"** tab
5. Click **"Generate new private key"**
6. Click **"Generate key"** in the dialog
7. A JSON file will download - this is your service account key
8. **Rename it to `serviceAccountKey.json`**
9. **Move it to the `backend/` directory**

⚠️ **IMPORTANT**: Never commit this file to Git! It's already in `.gitignore`.

## Step 2: Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

This will install `firebase-admin` along with other dependencies.

## Step 3: Verify Setup

The Firebase Admin SDK will automatically initialize when you import it:

```python
from firebase_config import db

if db:
    print("Firebase initialized successfully!")
else:
    print("Firebase not initialized - check service account key")
```

## Step 4: Test the Endpoint

Start your FastAPI server:

```bash
cd backend
uvicorn main:app --reload
```

Test the save endpoint:

```bash
curl -X POST http://localhost:8000/save_quiz_result \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test_user_123",
    "role": "investor",
    "quizAnswers": [{"questionIndex": 0, "value": 5}],
    "personalityScores": {
      "shortTermVsLongTerm": 2.0,
      "highRiskVsLowRisk": -1.0,
      "clarityVsComplexity": 0.0,
      "consistentVsLumpSum": 1.0
    },
    "personalityType": {
      "code": "SLCH",
      "name": "Test Type",
      "description": "Test description"
    }
  }'
```

## File Structure

```
backend/
├── main.py                    # FastAPI app with endpoints
├── firebase_config.py         # Firebase initialization
├── firebase_service.py        # Firebase service functions
├── serviceAccountKey.json     # Your service account key (NOT in Git)
├── requirements.txt           # Includes firebase-admin
└── .gitignore                # Excludes service account keys
```

## Available Endpoints

### POST `/save_quiz_result`
Saves quiz results to Firebase Firestore.

**Request Body:**
```json
{
  "userId": "user_123",
  "role": "investor",
  "quizAnswers": [
    {"questionIndex": 0, "value": 5},
    {"questionIndex": 1, "value": 3}
  ],
  "personalityScores": {
    "shortTermVsLongTerm": 2.0,
    "highRiskVsLowRisk": -1.0,
    "clarityVsComplexity": 0.0,
    "consistentVsLumpSum": 1.0
  },
  "personalityType": {
    "code": "SLCH",
    "name": "Strategic Long-Term Conservative",
    "description": "...",
    "color": "#4398b4"
  }
}
```

**Response:**
```json
{
  "success": true,
  "documentId": "abc123..."
}
```

## Troubleshooting

### "Firebase not initialized"
- Check that `serviceAccountKey.json` exists in the `backend/` directory
- Verify the file is valid JSON
- Check the file path in `firebase_config.py`

### "Permission denied"
- Make sure Firestore is enabled in Firebase Console
- Check Firestore security rules (should allow writes for development)

### "Module not found: firebase_admin"
- Run `pip install firebase-admin`
- Or `pip install -r requirements.txt`

## Security Notes

1. **Never commit `serviceAccountKey.json`** - It's in `.gitignore`
2. **Use environment variables in production**:
   ```bash
   export GOOGLE_APPLICATION_CREDENTIALS="/path/to/serviceAccountKey.json"
   ```
3. **Rotate keys periodically** - Generate new keys if compromised
4. **Limit service account permissions** - Only grant necessary Firestore permissions

