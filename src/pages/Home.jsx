import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import SearchBar from '../components/SearchBar';
import PharmacyCard from '../components/PharmacyCard';
import MedicationCard from '../components/MedicationCard';
import { fetchPharmacies } from '../utils/api';
import useTranslation from '../hooks/useTranslation';

const Home = () => {
  const { language } = useContext(AppContext);
  const { t } = useTranslation();
 const [pharmacies, setPharmacies] = useState([]);
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState({ pharmacies: true, medications: true });
  const [error, setError] = useState({ pharmacies: null });

  useEffect(() => {
    // Default location (Addis Ababa coordinates)
    const defaultLat = 9.0300;
    const defaultLng = 38.740;
  
    const fetchNearbyPharmacies = async () => {
      try {
        let lat = defaultLat;
        let lng = defaultLng;
  
        // Try to get user's current location
        if (navigator.geolocation) {
          try {
            const position = await new Promise((resolve, reject) => {
              navigator.geolocation.getCurrentPosition(resolve, reject, {
                timeout: 5000,
                enableHighAccuracy: false
              });
            });
            lat = position.coords.latitude;
            lng = position.coords.longitude;
          } catch (geoError) {
            console.warn('Geolocation not available or denied, using default location:', geoError);
            // Use default location if geolocation fails
          }
        }
  
        // Use the new fetchPharmacies function with the Overpass API
        const data = await fetchPharmacies({
          lat: lat,
          lng: lng
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
  
    const initializeFeaturedMedications = () => {
          // Static mock data for featured medications
          const mockMedications = [
            {
              id: 1,
              name: "Paracetamol",
              genericName: "Acetaminophen",
              description: "Pain reliever and fever reducer",
              price: 5.9,
              expiryDate: "2025-12-31",
              stockStatus: "in_stock",
              featured: true
            },
            {
              id: 2,
              name: "Ibuprofen",
              genericName: "Ibuprofen",
              description: "Nonsteroidal anti-inflammatory drug",
              price: 7.49,
              expiryDate: "2025-11-30",
              stockStatus: "in_stock",
              featured: true
            },
            {
              id: 4,
              name: "Lisinopril",
              genericName: "Lisinopril",
              description: "ACE inhibitor used to treat high blood pressure",
              price: 15.99,
              expiryDate: "2026-01-20",
              stockStatus: "in_stock",
              featured: true
            },
            {
              id: 6,
              name: "Atorvastatin",
              genericName: "Atorvastatin",
              description: "Statin used to prevent cardiovascular disease",
              price: 18.99,
              expiryDate: "2025-08-31",
              stockStatus: "in_stock",
              featured: true
            },
            {
              id: 8,
              name: "Levothyroxine",
              genericName: "Levothyroxine",
              description: "Thyroid hormone replacement",
              price: 11.9,
              expiryDate: "2026-02-28",
              stockStatus: "in_stock",
              featured: true
            },
            {
              id: 9,
              name: "Aspirin",
              genericName: "Acetylsalicylic acid",
              description: "Common pain reliever and anti-inflammatory",
              price: 4.99,
              expiryDate: "2025-10-30",
              stockStatus: "in_stock",
              featured: true
            }
          ];
          
          // Simulate loading delay for better UX
          setTimeout(() => {
            setMedications(mockMedications);
            setLoading(prev => ({ ...prev, medications: false }));
          }, 500);
        };
  
    fetchNearbyPharmacies();
    initializeFeaturedMedications();
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
                    ) : medications.length === 0 ? (
                      <div className="text-center py-12">
                        <p className="text-gray-50 text-lg">{t('home.noMedicationsFound')}</p>
                      </div>
                    ) : (
            <div className="relative">
              {/* Medication Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {medications.map(medication => (
                  <MedicationCard key={medication.id} medication={medication} />
                ))}
              </div>
              
              {/* Additional UI elements for featured medications */}
              <div className="mt-8 text-center">
                <div className="inline-flex items-center px-4 py-2 bg-blue-50 rounded-full">
                  <svg className="w-5 h-5 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 13.047 14.01c-.04.3-.06.6-.06.9a3 3 0 11-5.999 0c0-.3-.02-.6-.06-.9L5.854 7.2 7.033 2.744A1 1 0 018 2h4zm-1 14a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                  <span className="text-blue-700 font-medium">{t('home.featuredMedications')}</span>
                </div>
              </div>
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
          ) : pharmacies.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 text-lg">{t('home.noPharmaciesFound')}</p>
              <p className="text-gray-500 mt-2">{t('home.tryDifferentLocation')}</p>
              <Link
                to="/pharmacies"
                className="mt-4 inline-block bg-primary text-white font-medium px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors"
              >
                {t('home.browseAllPharmacies')}
              </Link>
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