import { createContext } from 'react';
import type { User as FirebaseUser } from 'firebase/auth';
import type { User } from '../types';

export interface AuthContextType {
  currentUser: FirebaseUser | null;
  userProfile: User | null;
  isLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithPhone: (phoneNumber: string) => Promise<unknown>;
  confirmPhoneCode: (verificationId: string, code: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUserProfile: (data: Partial<User>) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);
