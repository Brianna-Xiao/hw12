from firebase_config import db
from firebase_admin import firestore
from typing import Optional, List, Dict, Any
from datetime import datetime

# Import db and check if it's available
if db is None:
    print("Warning: Firebase not initialized. Firebase service functions will not work.")

def save_quiz_result(
    user_id: str,
    role: str,
    quiz_answers: List[Dict[str, Any]],  # Not stored, only used for calculation
    personality_scores: Dict[str, float],  # Not stored
    personality_type: Dict[str, str]
) -> Optional[str]:
    """
    Save MBTI result to Firestore (only the 4-letter code and related info, not quiz answers)
    
    Args:
        user_id: Unique user identifier
        role: "investor" or "advisor"
        quiz_answers: List of quiz answers (not stored, only used for calculation)
        personality_scores: Personality scores dictionary (not stored)
        personality_type: Personality type dictionary (code, name, description, color)
    
    Returns:
        Document ID if successful, None if failed
    """
    if db is None:
        print("Warning: Firebase not initialized. Cannot save MBTI result.")
        return None
    
    try:
        # Only save the MBTI result (4-letter code and related info)
        mbti_result_data = {
            "userId": user_id,
            "role": role,
            "personalityType": personality_type,  # Contains the 4-letter MBTI code
            "createdAt": firestore.SERVER_TIMESTAMP,
            "updatedAt": firestore.SERVER_TIMESTAMP
        }
        
        doc_ref = db.collection("quizResults").document()
        doc_ref.set(mbti_result_data)
        
        print(f"MBTI result saved to Firebase with ID: {doc_ref.id}")
        return doc_ref.id
    except Exception as e:
        print(f"Error saving MBTI result to Firebase: {e}")
        return None

def get_user_quiz_results(user_id: str) -> List[Dict[str, Any]]:
    """
    Get all quiz results for a user
    
    Args:
        user_id: Unique user identifier
    
    Returns:
        List of quiz result documents
    """
    if db is None:
        print("Warning: Firebase not initialized. Cannot get quiz results.")
        return []
    
    try:
        results = db.collection("quizResults").where("userId", "==", user_id).stream()
        quiz_results = []
        
        for doc in results:
            data = doc.to_dict()
            data["id"] = doc.id
            quiz_results.append(data)
        
        # Sort by most recent first
        quiz_results.sort(key=lambda x: x.get("createdAt", datetime.min), reverse=True)
        
        return quiz_results
    except Exception as e:
        print(f"Error getting quiz results: {e}")
        return []

def get_latest_quiz_result(user_id: str) -> Optional[Dict[str, Any]]:
    """
    Get the most recent quiz result for a user
    
    Args:
        user_id: Unique user identifier
    
    Returns:
        Most recent quiz result document or None
    """
    results = get_user_quiz_results(user_id)
    return results[0] if results else None

