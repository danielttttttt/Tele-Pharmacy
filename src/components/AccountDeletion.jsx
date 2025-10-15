// src/components/AccountDeletion.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { deleteAccount } from '../services/authService';
import { deleteUserProfile } from '../services/profileService';

const AccountDeletion = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');
  const [confirmationText, setConfirmationText] = useState('');

  const handleDeleteAccount = async () => {
    if (confirmationText !== 'DELETE MY ACCOUNT') {
      setError('Please type "DELETE MY ACCOUNT" to confirm.');
      return;
    }

    setIsDeleting(true);
    setError('');

    try {
      await deleteUserProfile(user.uid);
      await deleteAccount(user);
      logout();
      navigate('/', { state: { message: 'Your account has been successfully deleted.' } });
    } catch (err) {
      console.error('Account deletion error:', err);
      setError('Failed to delete account. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg
            className="h-5 w-5 text-red-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 0 0-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-lg font-medium text-red-800">Delete Account</h3>
          <div className="mt-2 text-sm text-red-700">
            <p>Once you delete your account, there is no going back. Please be certain.</p>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <h4 className="text-sm font-medium text-red-800">What will be deleted:</h4>
        <ul className="mt-2 list-disc list-inside text-sm text-red-700">
          <li>Your user profile and personal information</li>
          <li>Your order history and cart contents</li>
          <li>All associated data in our system</li>
        </ul>
      </div>

      <div className="mt-6">
        <label htmlFor="confirmation" className="block text-sm font-medium text-gray-700">
          To confirm, type "DELETE MY ACCOUNT" in the box below
        </label>
        <div className="mt-1">
          <input
            id="confirmation"
            name="confirmation"
            type="text"
            value={confirmationText}
            onChange={(e) => setConfirmationText(e.target.value)}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
          />
        </div>
      </div>

      {error && (
        <div className="mt-4 rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 01.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{error}</h3>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6">
        <button
          onClick={handleDeleteAccount}
          disabled={isDeleting || confirmationText !== 'DELETE MY ACCOUNT'}
          className={`inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${
            isDeleting || confirmationText !== 'DELETE MY ACCOUNT' ? 'opacity-75 cursor-not-allowed' : ''
          }`}
        >
          {isDeleting ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Deleting...
            </>
          ) : (
            'Delete Account'
          )}
        </button>
      </div>
    </div>
  );
};

export default AccountDeletion;
