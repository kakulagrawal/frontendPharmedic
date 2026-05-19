import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import NearbyDoctorsMap from "../components/NearbyDoctorsMap";

const Doctors = () => {

  const { speciality } = useParams();

  const [filterDoc, setFilterDoc] = useState([]);
  const [search, setSearch] = useState("");
  const [availability, setAvailability] = useState(false);
  const [selectedSpeciality, setSelectedSpeciality] = useState("");

  const [userLocation, setUserLocation] = useState(null);
  const [nearbyOnly, setNearbyOnly] = useState(false);

  const navigate = useNavigate();

  const { doctors } = useContext(AppContext);

  const categories = [
    "General physician",
    "Gynecologist",
    "Dermatologist",
    "Pediatricians",
    "Neurologist",
    "Gastroenterologist",
  ];

  // GET USER LOCATION
  useEffect(() => {

    navigator.geolocation.getCurrentPosition(

      (position) => {

        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });

      },

      (error) => {
        console.log(error);
      }

    );

  }, []);

  // DISTANCE CALCULATION
  const calculateDistance = (lat1, lon1, lat2, lon2) => {

    const R = 6371;

    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  const applyFilter = () => {

    // FAKE LOCATION DATA FOR DEMO
    let filtered = doctors.map((doc, index) => {

      let latitude;
      let longitude;

      // Nearby doctors
      if (index < 3) {

        latitude = userLocation
          ? userLocation.latitude + (Math.random() * 0.01)
          : 26.8467;

        longitude = userLocation
          ? userLocation.longitude + (Math.random() * 0.01)
          : 80.9462;

      }

      // Medium distance doctors
      else if (index < 6) {

        latitude = userLocation
          ? userLocation.latitude + 0.08
          : 26.9267;

        longitude = userLocation
          ? userLocation.longitude + 0.08
          : 81.0262;

      }

      // Far doctors
      else {

        latitude = userLocation
          ? userLocation.latitude + 0.2
          : 27.0467;

        longitude = userLocation
          ? userLocation.longitude + 0.2
          : 81.1462;

      }

      return {
        ...doc,
        latitude,
        longitude,
      };

    });

    // Sidebar speciality filter
    if (speciality) {
      filtered = filtered.filter(
        (doc) => doc.speciality === speciality
      );
    }

    // Search filter
    if (search) {
      filtered = filtered.filter((doc) =>
        doc.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Availability filter
    if (availability) {
      filtered = filtered.filter((doc) => doc.available);
    }

    // Dropdown speciality filter
    if (selectedSpeciality) {
      filtered = filtered.filter(
        (doc) => doc.speciality === selectedSpeciality
      );
    }

    // Nearby doctors filter
    if (nearbyOnly && userLocation) {

      filtered = filtered.filter((doc) => {

        const distance = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          doc.latitude,
          doc.longitude
        );

        return distance <= 5;
      });

    }

    setFilterDoc(filtered);
  };

  useEffect(() => {

    applyFilter();

  }, [
    doctors,
    speciality,
    search,
    availability,
    selectedSpeciality,
    nearbyOnly,
    userLocation
  ]);

  return (

    <div className="p-5 max-w-7xl mx-auto">

      <p className="text-gray-600 text-lg">
        Browse through the doctors by speciality.
      </p>

      {/* FILTER SECTION */}
      <div className="flex flex-col sm:flex-row gap-4 mt-5 mb-6">

        {/* SEARCH */}
        <input
          type="text"
          placeholder="Search doctor..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-72 outline-none"
        />

        {/* AVAILABILITY */}
        <label className="flex items-center gap-2 text-gray-700">

          <input
            type="checkbox"
            checked={availability}
            onChange={() => setAvailability(!availability)}
          />

          Available Only

        </label>

        {/* SPECIALITY DROPDOWN */}
        <select
          value={selectedSpeciality}
          onChange={(e) => setSelectedSpeciality(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 outline-none"
        >

          <option value="">All Specialities</option>

          {categories.map((cat, i) => (

            <option key={i} value={cat}>
              {cat}
            </option>

          ))}

        </select>

        {/* NEARBY BUTTON */}
        <button
          onClick={() => setNearbyOnly(!nearbyOnly)}
          className={`px-4 py-2 rounded-lg text-white transition-all ${
            nearbyOnly
              ? "bg-green-600"
              : "bg-indigo-600"
          }`}
        >

          {nearbyOnly
            ? "Showing Nearby Doctors"
            : "Find Nearby Doctors"}

        </button>

      </div>

      <div className="flex flex-col sm:flex-row items-start gap-5 mt-5">

        {/* SIDEBAR */}
        <div className="flex flex-col gap-4 text-sm text-gray-600 w-full sm:w-60">

          {categories.map((cat, i) => (

            <p
              key={i}
              onClick={() =>
                speciality === cat
                  ? navigate("/doctors")
                  : navigate(`/doctors/${cat}`)
              }
              className={`w-full pl-3 py-2 border border-gray-300 rounded cursor-pointer transition-all text-center ${
                speciality === cat
                  ? "bg-indigo-100 text-black font-semibold"
                  : "hover:bg-gray-100"
              }`}
            >

              {cat}

            </p>

          ))}

        </div>

        {/* DOCTOR CARDS */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

          {filterDoc.map((item, index) => (

            <div
              key={index}
              onClick={() =>
                item.available && navigate(`/appointment/${item._id}`)
              }
              className={`border border-blue-200 rounded-xl overflow-hidden shadow transition-all duration-300 ${
                item.available
                  ? "cursor-pointer hover:shadow-lg hover:-translate-y-1"
                  : "cursor-not-allowed opacity-50"
              }`}
            >

              <img
                className="w-full h-48 object-cover bg-blue-50"
                src={item.image || "/placeholder.png"}
                alt={item.name}
              />

              <div className="p-4">

                <div className="flex items-center gap-2 mb-2">

                  <span
                    className={`w-3 h-3 rounded-full ${
                      item.available ? "bg-green-500" : "bg-red-500"
                    }`}
                  ></span>

                  <p
                    className={`${
                      item.available ? "text-green-500" : "text-red-500"
                    } text-sm font-medium`}
                  >

                    {item.available ? "Available" : "Not Available"}

                  </p>

                </div>

                <p className="text-gray-900 text-lg font-medium">
                  {item.name}
                </p>

                <p className="text-gray-600 text-sm">
                  {item.speciality}
                </p>

              </div>

            </div>

          ))}

          {filterDoc.length === 0 && (

            <p className="text-gray-500 col-span-full text-center mt-10">

              No nearby doctors found.

            </p>

          )}

        </div>

      </div>

      {/* MAP */}
      <NearbyDoctorsMap />

    </div>

  );
};

export default Doctors;