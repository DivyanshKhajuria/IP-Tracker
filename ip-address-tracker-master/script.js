let map;

document.addEventListener('DOMContentLoaded', async() => {
    const ipAddressElement = document.getElementById('ipAddress');
    const locationElement = document.getElementById('location');
    const ispElement = document.getElementById('isp');

    // Fetch user's IP address information
    async function fetchUserIP() {
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            const userIP = data.ip;

            // Update card contents with user's IP address
            ipAddressElement.textContent = userIP;

            // Track user's IP
            await trackIP(userIP);
        } catch (error) {
            console.log('Error:', error);
        }
    }

    // Call fetchUserIP to display user's IP address and track IP on page load
    await fetchUserIP();

    const ipForm = document.getElementById('ipForm');
    const ipInput = document.getElementById('ipInput');

    ipForm.addEventListener('submit', async(event) => {
        event.preventDefault();
        const ipAddress = ipInput.value;
        await trackIP(ipAddress);
    });
});

async function initMap(lat, lng) {
    // Check if map is already initialized
    if (map) {
        map.setView([lat, lng], 10);
        return;
    }

    // Initialize map
    map = L.map('map').setView([lat, lng], 10);

    // Add tile layer (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
        maxZoom: 18,
    }).addTo(map);

    // Add marker
    L.marker([lat, lng]).addTo(map);
}

async function trackIP(ipAddress) {
    const apiKey = 'at_kEsByfkTuu10MxerYUw70YEMcS9Xm';
    const url = `https://geo.ipify.org/api/v1?apiKey=${apiKey}&ipAddress=${ipAddress}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        const { ip, location, isp } = data;

        // Update card contents
        document.getElementById('ipAddress').textContent = ip;
        document.getElementById('location').textContent = `${location.city}, ${location.region}, ${location.country} ${location.postalCode}`;
        document.getElementById('isp').textContent = isp;

        // Update map with new coordinates
        initMap(location.lat, location.lng);
    } catch (error) {
        console.log('Error:', error);
    }
}