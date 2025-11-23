import firebase_admin
from firebase_admin import credentials, firestore
import os
from pathlib import Path

# Initialize Firebase Admin SDK
# Make sure you have downloaded the service account key from Firebase Console
# and placed it in the backend directory as "serviceAccountKey.json"

def initialize_firebase():
    """Initialize Firebase Admin SDK if not already initialized"""
    if not firebase_admin._apps:
        # Try to find the service account key
        service_account_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
        
        if not service_account_path:
            # Look for common filenames in the backend directory
            backend_dir = Path(__file__).parent
            possible_paths = [
                "serviceAccountKey.json",
                os.path.join(backend_dir, "serviceAccountKey.json"),
                "firebase-service-account.json",
            ]
            
            for path in possible_paths:
                if os.path.exists(path):
                    service_account_path = path
                    break
        
        if not service_account_path or not os.path.exists(service_account_path):
            print(f"Warning: Firebase service account key not found.")
            print(f"Please download it from Firebase Console and save it as 'serviceAccountKey.json'")
            print(f"in the backend directory, or set GOOGLE_APPLICATION_CREDENTIALS environment variable.")
            return None
        
        cred = credentials.Certificate(service_account_path)
        firebase_admin.initialize_app(cred)
        print(f"✓ Firebase Admin SDK initialized with: {service_account_path}")
    
    return firestore.client()

# Initialize and export db
db = initialize_firebase()

