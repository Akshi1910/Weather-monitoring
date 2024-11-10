import React, { useEffect, useState } from 'react';

const GoogleMapComponent = () => {
  const [location, setLocation] = useState({ lat: null, lng: null });

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const response = await fetch('https://google-map-places.p.rapidapi.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&language=en&region=en&result_type=administrative_area_level_1&location_type=APPROXIMATE', {
          method: 'GET',
          headers: {
            'X-RapidAPI-Key': 'e73911fd89mshb2e892ec135c9e6p10f41fjsnbae769610e8d',
            'X-RapidAPI-Host': 'google-map-places.p.rapidapi.com'
          }
        });

        const data = await response.json();
        const locationData = data.results[0].geometry.location;
        setLocation({ lat: locationData.lat, lng: locationData.lng });
      } catch (error) {
        console.error('Error fetching location:', error);
      }
    };

    fetchLocation();
  }, []);

  useEffect(() => {
    if (location.lat && location.lng) {
      // Initialize Google Map once location data is available
      const map = new window.google.maps.Map(document.getElementById('map'), {
        center: { lat: location.lat, lng: location.lng },
        zoom: 12
      });

      new window.google.maps.Marker({
        position: { lat: location.lat, lng: location.lng },
        map: map
      });
    }
  }, [location]);

  return (
    <div>
      <h3>Google Map with Fetched Location</h3>
      <div id="map" style={{ height: '500px', width: '100%' }}></div>
    </div>
  );
};

export default GoogleMapComponent;
