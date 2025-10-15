// src/services/profileService.js

// Mock user profiles database (in a real application, this would be server-side)
const mockUserProfiles = new Map();

// Create user profile
export const createUserProfile = async (user, additionalData = {}) => {
  const profile = {
    uid: user.uid,
    email: user.email,
    displayName: additionalData.displayName || user.displayName || '',
    phoneNumber: additionalData.phoneNumber || '',
    photoURL: user.photoURL || '',
    emailVerified: user.emailVerified || false,
    emailVerifiedAt: user.emailVerified ? new Date() : null,
    createdAt: new Date(),
    updatedAt: new Date(),
    role: additionalData.role || 'patient',
    isActive: true,
    ...additionalData
  };

  mockUserProfiles.set(user.uid, profile);
  return { id: user.uid, ...profile };
};

// Get user profile
export const getUserProfile = async (uid) => {
  const profile = mockUserProfiles.get(uid);
  if (profile) {
    return profile;
  }
  return null;
};

// Update user profile
export const updateUserProfile = async (uid, updateData) => {
  const existingProfile = mockUserProfiles.get(uid);
  if (!existingProfile) {
    throw new Error('Profile not found');
  }

  const updatedProfile = {
    ...existingProfile,
    ...updateData,
    updatedAt: new Date()
  };

  mockUserProfiles.set(uid, updatedProfile);
  return updatedProfile;
};

// Delete user profile
export const deleteUserProfile = async (uid) => {
  mockUserProfiles.delete(uid);
  return Promise.resolve();
};