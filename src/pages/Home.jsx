import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import SearchBar from '../components/SearchBar';
import PharmacyCard from '../components/PharmacyCard';
import MedicationCard from '../components/MedicationCard';
import { fetchPharmacies, fetchMedications } from '../utils/api';
import useTranslation from '../hooks/useTranslation';

const Home = () => {
  const { language } = useContext(AppContext);
  const { t } = useTranslation();
 const [pharmacies, setPharmacies] = useState([]);
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState({ pharmacies: true, medications: true });
  const [error, setError] = useState({ pharmacies: null, medications: null });

  useEffect(() => {
    // Default location (Addis Ababa coordinates)
    const defaultLat = 9.0300;
    const defaultLng = 38.740;

    const fetchNearbyPharmacies = async () => {
      try {
        // Use the new fetchPharmacies function with the Overpass API
        const data = await fetchPharmacies({
          lat: defaultLat,
          lng: defaultLng
        });
        // Limit to 6 nearby pharmacies for display
        setPharmacies(data.slice(0, 6));
      } catch (error) {
        console.error('Error fetching pharmacies:', error);
        setError(prev => ({ ...prev, pharmacies: error.message }));
      } finally {
        setLoading(prev => ({ ...prev, pharmacies: false }));
      }
    };

    const fetchFeaturedMedications = async () => {
      try {
        // Fetch medications from the API
        const data = await fetchMedications();
        // Limit to 6 featured medications for display
        setMedications(data.slice(0, 6));
      } catch (error) {
        console.error('Error fetching medications:', error);
        setError(prev => ({ ...prev, medications: error.message }));
      } finally {
        setLoading(prev => ({ ...prev, medications: false }));
      }
    };

    fetchNearbyPharmacies();
    fetchFeaturedMedications();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-primary-dark text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('home.title')}</h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-100">{t('home.subtitle')}</p>
          
          <div className="max-w-2xl mx-auto mb-8">
            <SearchBar />
          </div>
          
          <div className="flex justify-center gap-4">
            <Link 
              to="/pharmacies" 
              className="bg-white text-primary font-bold px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {t('home.browsePharmacies')}
            </Link>
            <Link 
              to="/tele-consult" 
              className="bg-transparent border-2 border-white text-white font-bold px-6 py-3 rounded-lg hover:bg-white hover:text-primary transition-colors"
            >
              {t('home.startTeleConsultation')}
            </Link>
          </div>
        </div>
      </div>

      {/* Featured Medications Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">{t('home.featuredMedications')}</h2>
            <Link 
              to="/search" 
              className="text-primary hover:underline font-medium"
            >
              {t('home.viewAll')}
            </Link>
          </div>
          
          {loading.medications ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : error.medications ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
              <p className="text-red-800 font-medium">{t('home.errorLoadingMedications')}: {error.medications}</p>
              <p className="text-red-600 mt-2">{t('home.tryAgainLater')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {medications.map(medication => (
                <MedicationCard key={medication.id} medication={medication} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Nearby Pharmacies Section */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">{t('home.nearbyPharmacies')}</h2>
            <Link 
              to="/pharmacies" 
              className="text-primary hover:underline font-medium"
            >
              {t('home.viewAll')}
            </Link>
          </div>
          
          {loading.pharmacies ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : error.pharmacies ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
              <p className="text-red-800 font-medium">{t('home.errorLoadingPharmacies')}: {error.pharmacies}</p>
              <p className="text-red-60 mt-2">{t('home.tryAgainLater')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {pharmacies.map(pharmacy => (
                <PharmacyCard key={pharmacy.id} pharmacy={pharmacy} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Tele-consultation CTA */}
      <div className="py-16 bg-gradient-to-r from-primary to-primary-dark text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">{t('home.needPrescription')}</h2>
          <p className="text-xl mb-8 text-gray-100 max-w-2xl mx-auto">
            {t('home.connectWithPharmacists')}
          </p>
          <Link 
            to="/tele-consult" 
            className="bg-white text-primary font-bold px-8 py-4 rounded-lg hover:bg-gray-10 transition-colors inline-block"
          >
            {t('home.startTeleConsultation')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;