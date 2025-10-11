// src/firebase/auth.js
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  updateEmail,
  updatePassword,
  deleteUser,
  reauthenticateWithCredential,
  EmailAuthProvider,
  applyActionCode,
  confirmPasswordReset as _confirmPasswordReset
} from 'firebase/auth';
import { auth } from './firebase';

// Check if Firebase auth is properly initialized
const isAuthInitialized = () => {
  return auth !== null;
};

// Register a new user with email and password
export const registerUser = async (email, password) => {
  if (!isAuthInitialized()) {
    console.warn('Firebase Auth is not initialized. Using mock registration.');
    // Return a mock user credential for development without Firebase
    return {
      user: {
        uid: `mock-${Date.now()}`,
        email,
        getIdToken: () => Promise.resolve('mock-token'),
      }
    };
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

// Login user with email and password
export const loginUser = async (email, password) => {
  if (!isAuthInitialized()) {
    console.warn('Firebase Auth is not initialized. Using mock login.');
    // Return a mock user credential for development without Firebase
    return {
      user: {
        uid: `mock-${Date.now()}`,
        email,
        emailVerified: true,
        getIdToken: () => Promise.resolve('mock-token'),
      }
    };
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

// Logout user
export const logoutUser = async () => {
  if (!isAuthInitialized()) {
    console.warn('Firebase Auth is not initialized. Using mock logout.');
    return Promise.resolve();
  }

  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error logging out:', error);
    throw error;
  }
};

// Send email verification
export const sendVerificationEmail = async (user) => {
  if (!isAuthInitialized()) {
    console.warn('Firebase Auth is not initialized. Using mock verification.');
    return Promise.resolve();
  }

  try {
    await sendEmailVerification(user);
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw error;
  }
};

// Send password reset email
export const resetPassword = async (email) => {
  if (!isAuthInitialized()) {
    console.warn('Firebase Auth is not initialized. Using mock password reset.');
    return Promise.resolve();
  }

  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error('Error resetting password:', error);
    throw error;
  }
};

// Update user email
export const updateUserEmail = async (user, newEmail) => {
  if (!isAuthInitialized()) {
    console.warn('Firebase Auth is not initialized. Using mock email update.');
    return Promise.resolve();
  }

  try {
    await updateEmail(user, newEmail);
  } catch (error) {
    console.error('Error updating email:', error);
    throw error;
  }
};

// Update user password
export const updateUserPassword = async (user, newPassword) => {
  if (!isAuthInitialized()) {
    console.warn('Firebase Auth is not initialized. Using mock password update.');
    return Promise.resolve();
  }

  try {
    await updatePassword(user, newPassword);
  } catch (error) {
    console.error('Error updating password:', error);
    throw error;
  }
};

// Delete user account
export const deleteAccount = async (user) => {
  if (!isAuthInitialized()) {
    console.warn('Firebase Auth is not initialized. Using mock account deletion.');
    return Promise.resolve();
  }

  try {
    await deleteUser(user);
  } catch (error) {
    console.error('Error deleting account:', error);
    throw error;
  }
};

// Reauthenticate user
export const reauthenticateUser = async (user, currentPassword) => {
  if (!isAuthInitialized()) {
    console.warn('Firebase Auth is not initialized. Using mock reauthentication.');
    return Promise.resolve();
  }

  try {
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);
  } catch (error) {
    console.error('Error reauthenticating user:', error);
    throw error;
  }
};

// Apply email verification code
export const applyEmailVerificationCode = async (code) => {
  if (!isAuthInitialized()) {
    console.warn('Firebase Auth is not initialized. Using mock verification code application.');
    return Promise.resolve();
  }

  try {
    await applyActionCode(auth, code);
  } catch (error) {
    console.error('Error applying verification code:', error);
    throw error;
  }
};

// Confirm password reset
export const confirmPasswordReset = async (oobCode, newPassword) => {
  if (!isAuthInitialized()) {
    console.warn('Firebase Auth is not initialized. Using mock password reset confirmation.');
    return Promise.resolve();
  }

  try {
    await _confirmPasswordReset(auth, oobCode, newPassword);
  } catch (error) {
    console.error('Error confirming password reset:', error);
    throw error;
  }
};

// Get Firebase ID token for API requests
export const getIdToken = async () => {
  if (!isAuthInitialized()) {
    console.warn('Firebase Auth is not initialized. Returning mock token.');
    return 'mock-token';
  }

  const user = auth.currentUser;
  
  if (user) {
    return await user.getIdToken();
  }
  
  throw new Error('No authenticated user');
};