// src/firebase/firestore.js
import {
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  getDocs
} from 'firebase/firestore';
import { db } from './firebase';

// Check if Firebase Firestore is properly initialized
const isFirestoreInitialized = () => {
  return db !== null;
};

// Create user profile in Firestore
export const createUserProfile = async (user, additionalData = {}) => {
  if (!isFirestoreInitialized()) {
    console.warn('Firebase Firestore is not initialized. Using mock profile creation.');
    // Return mock data for development without Firebase
    return {
      id: `mock-${Date.now()}`,
      uid: user.uid,
      email: user.email,
      displayName: additionalData.displayName || '',
      phoneNumber: additionalData.phoneNumber || '',
      photoURL: user.photoURL || '',
      emailVerified: user.emailVerified || false,
      emailVerifiedAt: user.emailVerified ? new Date() : null,
      createdAt: new Date(),
      updatedAt: new Date(),
      role: additionalData.role || 'patient', // Default role
      isActive: true,
      ...additionalData
    };
  }

  try {
    const userRef = doc(db, 'users', user.uid);
    const userData = {
      uid: user.uid,
      email: user.email,
      displayName: additionalData.displayName || '',
      phoneNumber: additionalData.phoneNumber || '',
      photoURL: user.photoURL || '',
      emailVerified: user.emailVerified || false,
      emailVerifiedAt: user.emailVerified ? new Date() : null,
      createdAt: new Date(),
      updatedAt: new Date(),
      role: additionalData.role || 'patient', // Default role
      isActive: true,
      ...additionalData
    };
    
    await setDoc(userRef, userData);
    return { id: userRef.id, ...userData };
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
};

// Get user profile from Firestore
export const getUserProfile = async (uid) => {
  if (!isFirestoreInitialized()) {
    console.warn('Firebase Firestore is not initialized. Using mock profile retrieval.');
    // Return mock user profile for development without Firebase
    if (uid) {
      return {
        uid: uid,
        email: `user${uid}@example.com`,
        displayName: `User ${uid}`,
        role: 'patient',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    }
    return null;
  }

  try {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return { id: userSnap.id, ...userSnap.data() };
    } else {
      console.warn(`User profile not found for UID: ${uid}`);
      return null; // Return null instead of throwing an error
    }
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

// Update user profile in Firestore
export const updateUserProfile = async (uid, updateData) => {
  if (!isFirestoreInitialized()) {
    console.warn('Firebase Firestore is not initialized. Using mock profile update.');
    return Promise.resolve(); // Mock update
  }

  try {
    const userRef = doc(db, 'users', uid);
    const updatedData = {
      ...updateData,
      updatedAt: new Date()
    };
    await updateDoc(userRef, updatedData);
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

// Delete user profile from Firestore
export const deleteUserProfile = async (uid) => {
  if (!isFirestoreInitialized()) {
    console.warn('Firebase Firestore is not initialized. Using mock profile deletion.');
    return Promise.resolve(); // Mock deletion
  }

  try {
    const userRef = doc(db, 'users', uid);
    await deleteDoc(userRef);
  } catch (error) {
    console.error('Error deleting user profile:', error);
    throw error;
  }
};