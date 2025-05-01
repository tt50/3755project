function initMap() {
    // Create the map instance
    const map = L.map('map', {
        center: [40.0369167, -75.0876667],
        zoom: 13,
        preferCanvas: true
    });

    // Add base layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Roosevelt Boulevard path
    const rooseveltBlvdPath = [
        [40.019780, -75.148948],
        [40.019446, -75.145905],
        [40.019672, -75.143728],
        [40.021606, -75.139786],
        [40.023239, -75.135829], 
        [40.025099, -75.127204],
        [40.027378, -75.111712],
        [40.029816, -75.103621],
        [40.026354, -75.096677],
        [40.026544, -75.094292],
        [40.031652, -75.084777],
        [40.036745, -75.063315],
        [40.047367, -75.051590],
        [40.052179, -75.050821],
        [40.059133, -75.044456],
        [40.068982, -75.039962],
        [40.080850, -75.028631],
        [40.094841, -75.015309],
        [40.114165, -74.987837],
        [40.126565, -74.970795],
        [40.141510, -74.958025]
    ];

    // Add Roosevelt Blvd to map
    L.polyline(rooseveltBlvdPath, {
        color: '#FF0000',
        weight: 5,
        opacity: 0.7,
        dashArray: '10, 10'
    }).addTo(map).bindPopup('Roosevelt Boulevard');

    // Dark mode handler
    document.getElementById('darkModeBtn').addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        document.getElementById('darkModeBtn').textContent = 
            document.body.classList.contains('dark-mode') ? 'Light Mode' : 'Dark Mode';
        setTimeout(() => map.invalidateSize(), 300);
    });

    window.addEventListener('resize', () => map.invalidateSize());
}

document.addEventListener('DOMContentLoaded', initMap);