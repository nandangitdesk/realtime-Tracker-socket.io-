const socket = io();

if (navigator.geolocation) {
  navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      socket.emit("sendLocation", { latitude, longitude }, () => {
        console.log("Location shared");
      });
    },
    (error) => {
      console.log("Error retrieving location:", error.message);
      if (error.code === error.TIMEOUT) {
        console.log("Retrying location fetch after delay...");
        // Retry logic or prompt user for action
      }
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,  // Increased timeout
      maximumAge: 5000 // Allows cached location data
    }
  );
}

const map = L.map("map").setView([0, 0], 16);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: 'Real-time tracker',
}).addTo(map);

const markers = {};

socket.on("receiveLocation", (data) => {
  const { id, latitude, longitude } = data;
  map.setView([latitude, longitude]);
  if (markers[id]) {
    markers[id].setLatLng([latitude, longitude]);
  } else {
    markers[id] = L.marker([latitude, longitude]).addTo(map);
  }
});

socket.on("user-disconnected", (id) => {
  if (markers[id]) {
    map.removeLayer(markers[id]);
    delete markers[id];
  }
})