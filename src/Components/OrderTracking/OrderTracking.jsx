// 'use client';
// import { useEffect, useRef, useState } from "react";
// import Script from "next/script";

// export default function OrderTracking() {
//   const mapRef = useRef(null);
//   const [map, setMap] = useState(null);
//   const [directionsRenderer, setDirectionsRenderer] = useState(null);

//   const [start, setStart] = useState("");
//   const [end, setEnd] = useState("");
//   const [routeInfo, setRouteInfo] = useState(null);

//   // Initialize Map
//   const initMap = () => {
//     const mapInstance = new google.maps.Map(mapRef.current, {
//       center: { lat: 28.6139, lng: 77.209 }, // Delhi
//       zoom: 6,
//     });

//     const renderer = new google.maps.DirectionsRenderer({ map: mapInstance });

//     setMap(mapInstance);
//     setDirectionsRenderer(renderer);
//   };

//   // Calculate Route
//   const calculateRoute = () => {
//     if (!start || !end || !map) return;

//     const directionsService = new google.maps.DirectionsService();

//     directionsService.route(
//       {
//         origin: start,
//         destination: end,
//         travelMode: google.maps.TravelMode.DRIVING,
//         drivingOptions: {
//           departureTime: new Date(),
//           trafficModel: "bestguess",
//         },
//       },
//       (result, status) => {
//         if (status === "OK") {
//           directionsRenderer.setDirections(result);

//           const leg = result.routes[0].legs[0];

//           const distanceKm = (leg.distance.value / 1000).toFixed(2);
//           const baseTime = leg.duration.value / 60;

//           setRouteInfo({
//             distance: distanceKm,
//             car: baseTime.toFixed(0),
//             bike: (baseTime * 0.9).toFixed(0),
//             truck: (baseTime * 1.3).toFixed(0),
//             traffic: leg.duration_in_traffic
//               ? "🚦 Traffic Possible"
//               : "✅ Normal",
//           });
//         } else {
//           alert("Route not found");
//         }
//       }
//     );
//   };

//   return (
//     <>
//       {/* Google Maps Script */}
//       <Script
//         src={`https://maps.googleapis.com/maps/api/js?key=$https://console.cloud.google.com/&libraries=places`}
//         strategy="afterInteractive"
//         onLoad={initMap}
//       />

//       <div style={{ padding: 20 }}>
//         <h2 style={{ fontSize: 24, fontWeight: "bold" }}>
//           🗺 Route Tracking System
//         </h2>

//         {/* Inputs */}
//         <div style={{ display: "flex", gap: 10, margin: "10px 0" }}>
//           <input
//             value={start}
//             onChange={(e) => setStart(e.target.value)}
//             placeholder="Start Location"
//             style={inputStyle}
//           />
//           <input
//             value={end}
//             onChange={(e) => setEnd(e.target.value)}
//             placeholder="End Location"
//             style={inputStyle}
//           />
//           <button onClick={calculateRoute} style={btnStyle}>
//             Track
//           </button>
//         </div>

//         {/* Map */}
//         <div
//           ref={mapRef}
//           style={{
//             width: "100%",
//             height: "400px",
//             borderRadius: 10,
//             border: "1px solid #ddd",
//           }}
//         />

//         {/* Table */}
//         {routeInfo && (
//           <table style={tableStyle}>
//             <thead>
//               <tr>
//                 <th>Vehicle</th>
//                 <th>Estimated Time (min)</th>
//               </tr>
//             </thead>
//             <tbody>
//               <tr>
//                 <td>🚗 Car</td>
//                 <td>{routeInfo.car}</td>
//               </tr>
//               <tr>
//                 <td>🏍 Bike</td>
//                 <td>{routeInfo.bike}</td>
//               </tr>
//               <tr>
//                 <td>🚚 Truck</td>
//                 <td>{routeInfo.truck}</td>
//               </tr>
//               <tr>
//                 <td>📏 Distance</td>
//                 <td>{routeInfo.distance} KM</td>
//               </tr>
//               <tr>
//                 <td>🚦 Traffic</td>
//                 <td>{routeInfo.traffic}</td>
//               </tr>
//             </tbody>
//           </table>
//         )}
//       </div>
//     </>
//   );
// }

// /* ---------------- STYLES ---------------- */

// const inputStyle = {
//   padding: 10,
//   borderRadius: 6,
//   border: "1px solid #ccc",
//   flex: 1,
// };

// const btnStyle = {
//   padding: "10px 20px",
//   background: "#2563eb",
//   color: "#fff",
//   border: "none",
//   borderRadius: 6,
//   cursor: "pointer",
// };

// const tableStyle = {
//   width: "100%",
//   marginTop: 20,
//   borderCollapse: "collapse",
//   border: "1px solid #ddd",
// };


import { useEffect, useRef, useState } from "react";

export default function OrderTracking() {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const routeLayer = useRef(null);
  const startMarker = useRef(null);
  const endMarker = useRef(null);
  const driverMarker = useRef(null);

  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [routeInfo, setRouteInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isTracking, setIsTracking] = useState(false);
  const [progress, setProgress] = useState(0);

  // Load Leaflet dynamically
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Load Leaflet CSS
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(link);

    // Load Leaflet JS
    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.onload = initMap;
    document.body.appendChild(script);

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
      }
    };
  }, []);

  const initMap = () => {
    if (!mapInstance.current && window.L) {
      mapInstance.current = window.L.map(mapRef.current).setView(
        [22.9734, 78.6569],
        5
      );

      window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap",
        maxZoom: 19,
      }).addTo(mapInstance.current);
    }
  };

  const geocodeLocation = async (place) => {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        place
      )}`
    );
    const data = await res.json();

    if (!data || data.length === 0) {
      throw new Error(`Location "${place}" not found`);
    }

    return {
      coords: [parseFloat(data[0].lat), parseFloat(data[0].lon)],
      name: data[0].display_name,
    };
  };

  const createCustomIcon = (color) => {
    if (!window.L) return null;
    return window.L.divIcon({
      html: `<div style="background-color: ${color}; width: 30px; height: 30px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>`,
      className: "",
      iconSize: [30, 30],
      iconAnchor: [15, 30],
    });
  };

  const calculateRoute = async () => {
    if (!start || !end) {
      setError("Please enter both start and end locations");
      return;
    }

    if (!window.L) {
      setError("Map is still loading. Please wait...");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setRouteInfo(null);
      setProgress(0);
      setIsTracking(false);

      const startData = await geocodeLocation(start);
      const endData = await geocodeLocation(end);

      const routeRes = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${startData.coords[1]},${startData.coords[0]};${endData.coords[1]},${endData.coords[0]}?overview=full&geometries=geojson&steps=true`
      );

      if (!routeRes.ok) throw new Error("Route calculation failed");

      const routeData = await routeRes.json();

      if (!routeData.routes || routeData.routes.length === 0) {
        throw new Error("No route found between these locations");
      }

      const route = routeData.routes[0];
      const distanceKm = (route.distance / 1000).toFixed(2);
      const durationMin = (route.duration / 60).toFixed(0);

      // Clear old markers and route
      if (routeLayer.current)
        mapInstance.current.removeLayer(routeLayer.current);
      if (startMarker.current)
        mapInstance.current.removeLayer(startMarker.current);
      if (endMarker.current) mapInstance.current.removeLayer(endMarker.current);
      if (driverMarker.current)
        mapInstance.current.removeLayer(driverMarker.current);

      // Draw route
      routeLayer.current = window.L.geoJSON(route.geometry, {
        style: { color: "#2563eb", weight: 6, opacity: 0.7 },
      }).addTo(mapInstance.current);

      // Add markers
      startMarker.current = window.L.marker(startData.coords, {
        icon: createCustomIcon("#10b981"),
      })
        .addTo(mapInstance.current)
        .bindPopup(`<b>Start:</b> ${startData.name}`);

      endMarker.current = window.L.marker(endData.coords, {
        icon: createCustomIcon("#ef4444"),
      })
        .addTo(mapInstance.current)
        .bindPopup(`<b>Destination:</b> ${endData.name}`);

      mapInstance.current.fitBounds(routeLayer.current.getBounds(), {
        padding: [50, 50],
      });

      const currentTime = new Date();
      const estimatedArrival = new Date(
        currentTime.getTime() + durationMin * 60000
      );

      setRouteInfo({
        distance: distanceKm,
        car: durationMin,
        bike: (durationMin * 0.85).toFixed(0),
        truck: (durationMin * 1.3).toFixed(0),
        startName: startData.name.split(",")[0],
        endName: endData.name.split(",")[0],
        estimatedArrival: estimatedArrival.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        routeCoords: route.geometry.coordinates,
      });
    } catch (err) {
      setError(err.message || "Unable to calculate route. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const startLiveTracking = () => {
    if (!routeInfo || !window.L) return;

    setIsTracking(true);
    setProgress(0);

    const coords = routeInfo.routeCoords;
    const totalSteps = 100;
    let step = 0;

    const interval = setInterval(() => {
      if (step >= totalSteps) {
        clearInterval(interval);
        setIsTracking(false);
        setProgress(100);
        return;
      }

      const index = Math.floor((step / totalSteps) * coords.length);
      const coord = coords[Math.min(index, coords.length - 1)];

      if (driverMarker.current) {
        mapInstance.current.removeLayer(driverMarker.current);
      }

      driverMarker.current = window.L.marker([coord[1], coord[0]], {
        icon: window.L.divIcon({
          html: `<div style="font-size: 30px;">🚚</div>`,
          className: "",
          iconSize: [30, 30],
          iconAnchor: [15, 15],
        }),
      }).addTo(mapInstance.current);

      setProgress(step);
      step++;
    }, 100);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen">
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-4xl">🗺️</span>
          <h2 className="text-3xl font-bold text-gray-800">
            Live Order Tracking System
          </h2>
        </div>

        {/* Input Section */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <input
            value={start}
            onChange={(e) => setStart(e.target.value)}
            placeholder="📍 Start Location (e.g., Delhi)"
            className="px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none transition-colors"
            disabled={loading}
          />
          <input
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            placeholder="🎯 End Location (e.g., Jaipur)"
            className="px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none transition-colors"
            disabled={loading}
          />
          <button
            onClick={calculateRoute}
            disabled={loading}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "🔄 Calculating..." : "🚀 Track Route"}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
            <p className="font-semibold">⚠️ {error}</p>
          </div>
        )}

        {/* Map */}
        <div className="relative mb-6">
          <div
            ref={mapRef}
            className="w-full h-96 rounded-xl border-4 border-gray-200 shadow-lg"
          />
          {loading && (
            <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-xl">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="mt-2 text-gray-700 font-semibold">
                  Loading route...
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Route Info */}
        {routeInfo && (
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  📦 Delivery Details
                </h3>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">From:</span>{" "}
                  {routeInfo.startName}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">To:</span> {routeInfo.endName}
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  <span className="font-semibold">📏 Distance:</span>{" "}
                  {routeInfo.distance} km
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">🕐 ETA:</span>{" "}
                  {routeInfo.estimatedArrival}
                </p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  ⏱️ Travel Time by Vehicle
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">🚗 Car</span>
                    <span className="font-semibold text-blue-600">
                      {routeInfo.car} min
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">🏍️ Bike</span>
                    <span className="font-semibold text-green-600">
                      {routeInfo.bike} min
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">🚚 Truck</span>
                    <span className="font-semibold text-orange-600">
                      {routeInfo.truck} min
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Tracking Button */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-gray-800">
                  🚚 Live Tracking Simulation
                </h3>
                <button
                  onClick={startLiveTracking}
                  disabled={isTracking}
                  className="px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isTracking ? "🔴 Tracking..." : "▶️ Start Tracking"}
                </button>
              </div>

              {progress > 0 && (
                <div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-green-500 to-blue-500 h-3 transition-all duration-100"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <p className="text-center mt-2 text-sm font-semibold text-gray-700">
                    {progress}% Complete
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
