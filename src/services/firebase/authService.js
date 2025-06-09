import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  onAuthStateChanged,
  updateProfile 
} from 'firebase/auth';
import { auth } from './config';  // Make sure this points to your config.js

export const signUp = async (email, password, firstName = '', lastName = '') => {
  try {
    // Create the user account (this automatically signs them in)
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update the user's profile with their name
    if (firstName || lastName) {
      await updateProfile(userCredential.user, {
        displayName: `${firstName} ${lastName}`.trim()
      });
    }
    
    // Immediately sign out the user before any auth state listeners can react
    await signOut(auth);
    
    return { success: true, message: 'Account created successfully' };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getCurrentUser = () => {
  return auth.currentUser;
};

export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};