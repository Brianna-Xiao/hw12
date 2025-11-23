import { 
  collection, 
  addDoc, 
  doc, 
  setDoc,
  getDoc,
  deleteDoc,
  query,
  where,
  getDocs,
  Timestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { QuizAnswer, PersonalityScores, PersonalityType, Role } from '@/types/personality';

// Collection names
const QUIZ_RESULTS_COLLECTION = 'quizResults';
const USER_PROFILES_COLLECTION = 'userProfiles';

// Interface for MBTI result data stored in Firebase
// Only stores the final MBTI result, not individual quiz answers
export interface QuizResultData {
  userId: string;
  role: Role;
  personalityType: {
    code: string; // The 4-letter MBTI code (e.g., "SLCH")
    name: string;
    description: string;
    color: string;
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/**
 * Generate or retrieve a user ID from localStorage
 */
export function getUserId(): string {
  let userId = localStorage.getItem('userId');
  if (!userId) {
    // Generate a simple user ID (you can replace this with Firebase Auth later)
    userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('userId', userId);
  }
  return userId;
}

/**
 * Save MBTI result to Firebase (only the 4-letter code and related info, not quiz answers)
 */
export async function saveQuizResults(
  userId: string,
  role: Role,
  quizAnswers: QuizAnswer[], // Not stored, only used for calculation
  personalityScores: PersonalityScores, // Not stored
  personalityType: PersonalityType
): Promise<string> {
  try {
    // Only save the MBTI result (4-letter code and related info)
    const mbtiResultData: Omit<QuizResultData, 'createdAt' | 'updatedAt'> = {
      userId,
      role,
      personalityType: {
        code: personalityType.code, // The 4-letter MBTI code
        name: personalityType.name,
        description: personalityType.description,
        color: personalityType.color,
      },
    };

    const docRef = await addDoc(collection(db, QUIZ_RESULTS_COLLECTION), {
      ...mbtiResultData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    console.log('MBTI result saved to Firebase with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error saving MBTI result to Firebase:', error);
    throw error;
  }
}

/**
 * Get all quiz results for a user
 */
export async function getUserQuizResults(userId: string): Promise<QuizResultData[]> {
  try {
    const q = query(
      collection(db, QUIZ_RESULTS_COLLECTION),
      where('userId', '==', userId)
    );
    
    const querySnapshot = await getDocs(q);
    const results: QuizResultData[] = [];
    
    querySnapshot.forEach((doc) => {
      results.push({
        id: doc.id,
        ...doc.data()
      } as QuizResultData & { id: string });
    });

    // Sort by most recent first
    return results.sort((a, b) => 
      b.createdAt.toMillis() - a.createdAt.toMillis()
    );
  } catch (error) {
    console.error('Error getting user quiz results:', error);
    throw error;
  }
}

/**
 * Get the latest quiz result for a user
 */
export async function getLatestQuizResult(userId: string): Promise<QuizResultData | null> {
  try {
    const results = await getUserQuizResults(userId);
    return results.length > 0 ? results[0] : null;
  } catch (error) {
    console.error('Error getting latest quiz result:', error);
    throw error;
  }
}

// ==================== User Profile Operations ====================

/**
 * Interface for user profile data stored in Firebase
 */
export interface UserProfileData {
  userId: string;
  name: string;
  pronouns?: string;
  role: Role;
  bio?: string;
  avatar?: string;
  personalityType?: {
    code: string;
    name: string;
    description: string;
    color: string;
  };
  personalityScores?: PersonalityScores;
  updatedAt: Timestamp;
  createdAt?: Timestamp;
}

/**
 * Save or update user profile in Firebase
 */
export async function saveUserProfile(
  userId: string,
  profileData: {
    name: string;
    pronouns?: string;
    role: Role;
    bio?: string;
    avatar?: string;
    personalityType?: PersonalityType;
    personalityScores?: PersonalityScores;
  }
): Promise<void> {
  try {
    // Check if Firebase is initialized
    if (!db) {
      throw new Error('Firebase is not initialized. Please check your Firebase configuration.');
    }

    const userProfileRef = doc(db, USER_PROFILES_COLLECTION, userId);
    
    const profileToSave: Omit<UserProfileData, 'createdAt'> = {
      userId,
      name: profileData.name,
      pronouns: profileData.pronouns,
      role: profileData.role,
      bio: profileData.bio,
      avatar: profileData.avatar,
      updatedAt: Timestamp.now(),
    };

    // Add personality data if provided
    if (profileData.personalityType) {
      profileToSave.personalityType = {
        code: profileData.personalityType.code,
        name: profileData.personalityType.name,
        description: profileData.personalityType.description,
        color: profileData.personalityType.color,
      };
    }

    if (profileData.personalityScores) {
      profileToSave.personalityScores = profileData.personalityScores;
    }

    console.log('Saving profile to Firebase:', {
      userId,
      collection: USER_PROFILES_COLLECTION,
      data: { ...profileToSave, avatar: profileToSave.avatar ? '[image data]' : undefined }
    });

    // Use setDoc with merge to update or create
    await setDoc(userProfileRef, profileToSave, { merge: true });
    
    console.log('✓ User profile saved to Firebase successfully for user:', userId);
  } catch (error: any) {
    console.error('✗ Error saving user profile to Firebase:', error);
    console.error('Error details:', {
      code: error?.code,
      message: error?.message,
      stack: error?.stack
    });
    
    // Provide more helpful error messages
    if (error?.code === 'permission-denied') {
      throw new Error('Permission denied. Please check your Firestore security rules.');
    } else if (error?.code === 'unavailable') {
      throw new Error('Firebase service is unavailable. Please check your internet connection.');
    } else if (error?.message?.includes('Firebase is not initialized')) {
      throw new Error('Firebase is not configured. Please check your .env file.');
    } else {
      throw new Error(error?.message || 'Failed to save profile to Firebase');
    }
  }
}

/**
 * Get user profile from Firebase
 */
export async function getUserProfile(userId: string): Promise<UserProfileData | null> {
  try {
    const userProfileRef = doc(db, USER_PROFILES_COLLECTION, userId);
    const docSnap = await getDoc(userProfileRef);
    
    if (docSnap.exists()) {
      return docSnap.data() as UserProfileData;
    }
    return null;
  } catch (error) {
    console.error('Error getting user profile from Firebase:', error);
    throw error;
  }
}

/**
 * Delete user profile from Firebase
 */
export async function deleteUserProfile(userId: string): Promise<void> {
  try {
    const userProfileRef = doc(db, USER_PROFILES_COLLECTION, userId);
    await deleteDoc(userProfileRef);
    console.log('User profile deleted from Firebase for user:', userId);
  } catch (error) {
    console.error('Error deleting user profile from Firebase:', error);
    throw error;
  }
}

