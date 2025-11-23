# Firebase Admin SDK Setup for Python Backend
# This is an ALTERNATIVE to frontend Firebase - you typically don't need both

# Step 1: Install Firebase Admin SDK
# Run: pip install firebase-admin

# Step 2: Download service account key from Firebase Console:
# 1. Go to Firebase Console > Project Settings > Service Accounts
# 2. Click "Generate new private key"
# 3. Save the JSON file (e.g., as "serviceAccountKey.json")
# 4. Add "serviceAccountKey.json" to .gitignore (NEVER commit this file!)

# Step 3: Use in your Python code:

"""
import firebase_admin
from firebase_admin import credentials, firestore
import os

# Initialize Firebase Admin SDK
# Option A: Using service account file
if not firebase_admin._apps:
    cred = credentials.Certificate("serviceAccountKey.json")
    firebase_admin.initialize_app(cred)

# Option B: Using environment variable (more secure)
# Set GOOGLE_APPLICATION_CREDENTIALS environment variable to path of service account key
# if not firebase_admin._apps:
#     cred_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
#     cred = credentials.Certificate(cred_path)
#     firebase_admin.initialize_app(cred)

# Get Firestore client
db = firestore.client()

# Example: Save quiz results from backend
def save_quiz_result_backend(user_id: str, quiz_data: dict):
    doc_ref = db.collection('quizResults').document()
    doc_ref.set({
        'userId': user_id,
        **quiz_data,
        'createdAt': firestore.SERVER_TIMESTAMP,
        'updatedAt': firestore.SERVER_TIMESTAMP
    })
    return doc_ref.id

# Example: Get user's quiz results
def get_user_results(user_id: str):
    results = db.collection('quizResults').where('userId', '==', user_id).stream()
    return [doc.to_dict() for doc in results]
"""

