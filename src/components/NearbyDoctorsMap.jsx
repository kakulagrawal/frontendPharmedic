import React, { useEffect, useState } from "react";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup
} from "react-leaflet";

const doctors = [
  {
    id: 1,
    name: "Dr. Sharma",
    speciality: "Cardiologist",
    position: [26.8467, 80.9462]
  },
  {
    id: 2,
    name: "Dr. Mehta",
    speciality: "Dermatologist",
    position: [26.8567, 80.9562]
  },
  {
    id: 3,
    name: "Dr. Khan",
    speciality: "Neurologist",
    position: [26.8410, 80.9490]
  }
];

const NearbyDoctorsMap = () => {

  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {

    navigator.geolocation.getCurrentPosition(

      (position) => {

        setUserLocation([
          position.coords.latitude,
          position.coords.longitude
        ]);

      },

      (error) => {
        console.log(error);
      }

    );

  }, []);

  if (!userLocation) {
    return (
      <div className="text-center text-gray-500 mt-10">
        Fetching your location...
      </div>
    );
  }

  return (

    <div className="mt-10">

      <h2 className="text-2xl font-semibold mb-4 text-gray-800">

        Nearby Doctors

      </h2>

      <MapContainer
        center={userLocation}
        zoom={13}
        style={{
          height: "500px",
          width: "100%",
          borderRadius: "20px"
        }}
      >

        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* USER LOCATION */}
        <Marker position={userLocation}>

          <Popup>
            You are here
          </Popup>

        </Marker>

        {/* DOCTOR LOCATIONS */}
        {doctors.map((doctor) => (

          <Marker
            key={doctor.id}
            position={doctor.position}
          >

            <Popup>

              <div className="text-center">

                <h3 className="font-semibold">
                  {doctor.name}
                </h3>

                <p className="text-sm text-gray-600">
                  {doctor.speciality}
                </p>

              </div>

            </Popup>

          </Marker>

        ))}

      </MapContainer>

    </div>

  );
};

export default NearbyDoctorsMap;