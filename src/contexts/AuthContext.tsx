import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut as firebaseSignOut,
  RecaptchaVerifier,
  PhoneAuthProvider,
  signInWithPhoneNumber,
  signInWithCredential
} from 'firebase/auth';
import type { User as FirebaseUser } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, googleProvider, firestore } from '../lib/firebase';
import type { User } from '../types';
import { userConverter } from '../types';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './authContext';
import type { AuthContextType } from './authContext';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        try {
          // Get or create user profile
          const userRef = doc(firestore, 'users', user.uid).withConverter(userConverter);
          const docSnap = await getDoc(userRef);
          
          if (docSnap.exists()) {
            setUserProfile(docSnap.data());
          } else {
            // Create new user profile
            const newUser: User = {
              uid: user.uid,
              displayName: user.displayName,
              email: user.email,
              photoURL: user.photoURL,
              phoneNumber: user.phoneNumber,
              totalRounds: 0,
              totalCourses: 0,
            };
            
            await setDoc(userRef, newUser);
            setUserProfile(newUser);
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      } else {
        setUserProfile(null);
      }
      
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/dashboard');
    } catch (error) {
      console.error("Error signing in with Google:", error);
      throw error;
    }
  };

  const signInWithPhone = async (phoneNumber: string) => {
    try {
      // Setup recaptcha verifier properly with invisible mode
      const recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
      });
      
      // Send verification code
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
      return confirmationResult;
    } catch (error) {
      console.error("Error during phone authentication:", error);
      throw error;
    }
  };

  const confirmPhoneCode = async (verificationId: string, code: string) => {
    try {
      const credential = PhoneAuthProvider.credential(verificationId, code);
      await signInWithCredential(auth, credential);
      navigate('/dashboard');
    } catch (error) {
      console.error("Error confirming verification code:", error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      navigate('/login');
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  };

  const updateUserProfile = async (data: Partial<User>) => {
    if (!currentUser) return;
    
    try {
      const userRef = doc(firestore, 'users', currentUser.uid).withConverter(userConverter);
      await setDoc(userRef, { ...userProfile, ...data }, { merge: true });
      
      // Update local state
      setUserProfile(prev => prev ? { ...prev, ...data } : null);
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw error;
    }
  };

  const value = {
    currentUser,
    userProfile,
    isLoading,
    signInWithGoogle,
    signInWithPhone,
    confirmPhoneCode,
    signOut,
    updateUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
