import React, { useEffect, useRef, useState } from 'react'

const Map = ({ center, markers, route }) => {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const [mapLoaded, setMapLoaded] = useState(false)

  // Helper function to escape HTML characters
  const escapeHtml = (text) => {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  };

  // Load Leaflet CSS and JS dynamically
  useEffect(() => {
    // Check if Leaflet is already loaded
    if (window.L) {
      setMapLoaded(true)
      return
    }

    // Load Leaflet CSS
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
    document.head.appendChild(link)

    // Load Leaflet JS
    const script = document.createElement('script')
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
    script.async = true
    script.onload = () => {
      setMapLoaded(true)
    }
    document.head.appendChild(script)

    return () => {
      document.head.removeChild(link)
      document.head.removeChild(script)
    }
  }, [])

  // Initialize map when Leaflet is loaded
  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return

    // Clean up existing map instance if any
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove()
    }

    // Initialize map
    const map = window.L.map(mapRef.current).setView(center || [9.03, 38.74], 13)
    mapInstanceRef.current = map

    // Add OpenStreetMap tiles (no API key required)
    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map)

    // Add markers
    if (markers && markers.length > 0) {
      markers.forEach(markerData => {
        const marker = window.L.marker(markerData.position).addTo(map)
        if (markerData.popup) {
          // If popup is a string, use it directly
          if (typeof markerData.popup === 'string') {
            marker.bindPopup(markerData.popup)
          }
          // If popup is an object, create a formatted popup
          else if (typeof markerData.popup === 'object') {
            const popupContent = `
              <div class="p-2">
                <h3 class="font-bold text-lg">${escapeHtml(markerData.popup.title || 'Pharmacy')}</h3>
                ${markerData.popup.address ? `<p class="text-gray-600">${escapeHtml(markerData.popup.address)}</p>` : ''}
                ${markerData.popup.rating ? `<p class="text-primary font-medium">★ ${escapeHtml(markerData.popup.rating)}</p>` : ''}
                ${markerData.popup.phone ? `<p class="text-gray-600">📞 ${escapeHtml(markerData.popup.phone)}</p>` : ''}
                ${markerData.popup.distance ? `<p class="text-gray-600">📍 ${escapeHtml(markerData.popup.distance)}</p>` : ''}
              </div>
            `
            marker.bindPopup(popupContent)
          }
        }
      })
    }

    // Add route if provided
    if (route && route.length > 0) {
      const polyline = window.L.polyline(route, { color: '#3b82f6' }).addTo(map)
      map.fitBounds(polyline.getBounds())
    }

    // Clean up on unmount
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
      }
    }
  }, [mapLoaded, center, markers, route])

  return (
    <div className="w-full h-96 rounded-lg overflow-hidden">
      <div ref={mapRef} className="w-full h-full"></div>
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading map...</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default Map