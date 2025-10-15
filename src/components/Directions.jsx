import React, { useState, useEffect } from 'react';
import useTranslation from '../hooks/useTranslation';

const Directions = ({ destination, onClose, onRouteCalculated }) => {
  const { t } = useTranslation();
  const [userLocation, setUserLocation] = useState(null);
  const [route, setRoute] = useState(null);
  const [routeSummary, setRouteSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get user's current location
  useEffect(() => {
    const getUserLocation = () => {
      if (!navigator.geolocation) {
        setError('Geolocation is not supported by your browser');
        return;
      }

      setIsLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setIsLoading(false);
        },
        (err) => {
          setError('Unable to retrieve your location. Please enable location services.');
          setIsLoading(false);
          console.error('Geolocation error:', err);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    };

    getUserLocation();
  }, []);

  // Calculate route when user location and destination are available
  useEffect(() => {
    if (userLocation && destination) {
      calculateRoute();
    }
  }, [userLocation, destination]);

  const calculateRoute = async () => {
    if (!userLocation || !destination) return;

    setIsLoading(true);
    setError(null);

    try {
      // In a real implementation, this would call a routing API like OSRM, GraphHopper, or Google Maps
      // For this demo, we'll simulate a route calculation
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call delay
      
      // Calculate distance and time (simulated)
      const distance = calculateDistance(userLocation.lat, userLocation.lng, destination.latitude, destination.longitude);
      const time = Math.round(distance * 2.5); // Rough estimation: 2.5 minutes per km
      
      // Generate simulated route steps
      const steps = generateRouteSteps(userLocation, destination);
      
      setRoute({
        steps: steps,
        coordinates: generateRouteCoordinates(userLocation, destination)
      });
      
      setRouteSummary({
        distance: distance.toFixed(2),
        time: time
      });

      // Call the callback with route data if provided
      if (onRouteCalculated && userLocation && destination) {
        onRouteCalculated({
          coordinates: generateRouteCoordinates(userLocation, destination),
          summary: {
            distance: distance.toFixed(2),
            time: time
          },
          steps: steps
        });
      }
      
    } catch (err) {
      setError('Failed to calculate route. Please try again later.');
      console.error('Route calculation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Simple distance calculation using Haversine formula
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    return R * c; // Distance in km
  };

  // Generate simulated route steps
  const generateRouteSteps = (start, end) => {
    return [
      {
        instruction: "Head northeast on Main Street",
        distance: 0.5,
        time: 2
      },
      {
        instruction: "Turn right onto 2nd Avenue",
        distance: 1.2,
        time: 3
      },
      {
        instruction: "Continue straight for 800m",
        distance: 0.8,
        time: 2
      },
      {
        instruction: "Turn left onto Market Street",
        distance: 0.3,
        time: 1
      },
      {
        instruction: `Arrive at ${end.name || 'destination'}`,
        distance: 0,
        time: 0
      }
    ];
  };

  // Generate simulated route coordinates
 const generateRouteCoordinates = (start, end) => {
    const coords = [];
    const steps = 20; // Number of points to generate
    
    for (let i = 0; i <= steps; i++) {
      const lat = start.lat + (end.latitude - start.lat) * (i / steps);
      const lng = start.lng + (end.longitude - start.lng) * (i / steps);
      coords.push([lat, lng]);
    }
    
    return coords;
 };

  // Format time in minutes to human readable format
  const formatTime = (minutes) => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 
      ? `${hours} hr ${remainingMinutes} min` 
      : `${hours} hr`;
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Navigation</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Navigation</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="text-red-600 mb-4">{error}</div>
        <button 
          onClick={calculateRoute}
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Navigation</h3>
        <button 
          onClick={onClose}
          className="text-gray-500 hover:text-gray-70"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {routeSummary && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex justify-between text-sm">
            <div className="flex items-center">
              <svg className="w-4 h-4 text-primary mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="font-medium">{routeSummary.distance} km</span>
            </div>
            <div className="flex items-center">
              <svg className="w-4 h-4 text-primary mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">{formatTime(routeSummary.time)}</span>
            </div>
          </div>
        </div>
      )}

      <div className="mb-4">
        <h4 className="font-medium text-gray-700 mb-2">Turn-by-turn directions:</h4>
        <div className="space-y-3">
          {route?.steps?.map((step, index) => (
            <div key={index} className="flex items-start">
              <div className="flex-shrink-0 mt-1 mr-3">
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white text-xs">
                  {index + 1}
                </div>
              </div>
              <div className="flex-1">
                <div className="font-medium">{step.instruction}</div>
                {step.distance > 0 && (
                  <div className="text-sm text-gray-500">{step.distance} km ({step.time} min)</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex space-x-3">
        <button className="flex-1 bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark transition-colors">
          Start Navigation
        </button>
        <button 
          onClick={calculateRoute}
          className="px-4 py-2 border border-gray-30 rounded-md text-gray-700 hover:bg-gray-50"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Directions;