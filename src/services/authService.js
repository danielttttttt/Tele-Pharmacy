// src/services/authService.js

// Mock user database (in a real application, this would be server-side)
const mockUsers = new Map();

// Generate a unique ID
const generateId = () => Date.now().toString();

// Generate a mock token
const generateToken = () => `mock-token-${Date.now()}`;

// Register a new user
export const registerUser = async (email, password, name) => {
  // Check if user already exists
  if (mockUsers.has(email)) {
    throw new Error('auth/email-already-in-use');
  }

  // Create new user
  const user = {
    uid: generateId(),
    email,
    displayName: name || '',
    emailVerified: false,
    role: 'patient',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    password: password // In a real app, this would be hashed
  };

  mockUsers.set(email, user);
  
  // Return mock user credential
  return {
    user: {
      uid: user.uid,
      email: user.email,
      emailVerified: user.emailVerified,
      getIdToken: () => Promise.resolve(generateToken())
    }
  };
};

// Login user
export const loginUser = async (email, password) => {
  const user = mockUsers.get(email);
  
  if (!user) {
    throw new Error('auth/user-not-found');
  }
  
  if (user.password !== password) {
    throw new Error('auth/wrong-password');
  }

  // Return mock user credential
  return {
    user: {
      uid: user.uid,
      email: user.email,
      emailVerified: user.emailVerified,
      getIdToken: () => Promise.resolve(generateToken())
    }
  };
};

// Logout user
export const logoutUser = async () => {
  // In a real app, this would invalidate the token on the server
  return Promise.resolve();
};

// Send verification email
export const sendVerificationEmail = async (user) => {
 // In a real app, this would send an actual email
  return Promise.resolve();
};

// Reset password
export const resetPassword = async (email) => {
  // In a real app, this would send a password reset email
  return Promise.resolve();
};

// Update user email
export const updateUserEmail = async (user, newEmail) => {
 const existingUser = mockUsers.get(user.email);
  if (!existingUser) {
    throw new Error('User not found');
  }

  // Check if new email is already taken
  if (mockUsers.has(newEmail) && newEmail !== user.email) {
    throw new Error('auth/email-already-in-use');
  }

  // Update email in mock database
 const updatedUser = { ...existingUser, email: newEmail };
  mockUsers.delete(existingUser.email);
  mockUsers.set(newEmail, updatedUser);
  
  return Promise.resolve();
};

// Update user password
export const updateUserPassword = async (user, newPassword) => {
  const existingUser = mockUsers.get(user.email);
  if (!existingUser) {
    throw new Error('User not found');
  }

  // Update password in mock database
 mockUsers.set(user.email, { ...existingUser, password: newPassword });
  
  return Promise.resolve();
};

// Delete user account
export const deleteAccount = async (user) => {
  mockUsers.delete(user.email);
  return Promise.resolve();
};

// Reauthenticate user (for sensitive operations)
export const reauthenticateUser = async (user, currentPassword) => {
 const existingUser = mockUsers.get(user.email);
  if (!existingUser || existingUser.password !== currentPassword) {
    throw new Error('auth/wrong-password');
  }
  return Promise.resolve();
};

// Apply email verification code
export const applyEmailVerificationCode = async (code) => {
 // In a real app, this would verify the code and update email verification status
  return Promise.resolve();
};

// Confirm password reset
export const confirmPasswordReset = async (obCode, newPassword) => {
  // In a real app, this would verify the code and update the password
  return Promise.resolve();
};

// Get ID token
export const getIdToken = async () => {
  return generateToken();
};