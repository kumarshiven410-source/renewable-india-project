/* ==========================================================================
   Renewable India - Project Core Logic
   Academic Task CA1 | Lovely Professional University | CHE110
   Interactive Leaflet Map, Intelligent AI Chatbot, Solar Calculator & Analytics
   ========================================================================== */

// --- Global State & Configuration ---
let mapInstance = null;
let mapMarkers = [];
let selectedProject = null;
let currentFilter = 'all';

// Audio Context for subtle UI chimes
let audioCtx = null;
function playSoftChime(frequency = 520, duration = 0.08) {
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(frequency, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {
    // Ignore audio errors on restricted devices
  }
}

// --- India Renewable Energy Map Dataset ---
const renewableProjects = [
  {
    id: 'bhadla',
    name: 'Bhadla Solar Park',
    category: 'solar',
    lat: 27.5398,
    lng: 71.9160,
    state: 'Rajasthan',
    location: 'Phalodi, Jodhpur District',
    capacityMW: 2245,
    annualGenGWh: 4800,
    area: '14,000 Acres',
    co2OffsetMt: 4.0,
    developer: 'RSDCL / Saurya Urja / Adani',
    description: 'One of the world\'s largest single-location photovoltaic installations, situated in Thar Desert with extreme temperatures and automated robotic dry-cleaning.'
  },
  {
    id: 'pavagada',
    name: 'Pavagada Solar Park (Shakti Sthala)',
    category: 'solar',
    lat: 14.2810,
    lng: 77.2750,
    state: 'Karnataka',
    location: 'Tumakuru District',
    capacityMW: 2050,
    annualGenGWh: 4400,
    area: '13,000 Acres',
    co2OffsetMt: 3.6,
    developer: 'KREDL / NTPC / SECI',
    description: 'Constructed on drought-prone agricultural land where farmers receive annual land-lease rentals, pioneering land-owner partnership models in India.'
  },
  {
    id: 'khavda',
    name: 'Khavda Renewable Energy Mega Park',
    category: 'hybrid',
    lat: 23.8500,
    lng: 69.7500,
    state: 'Gujarat',
    location: 'Rann of Kutch',
    capacityMW: 30000,
    annualGenGWh: 81000,
    area: '538 sq. km',
    co2OffsetMt: 58.0,
    developer: 'Adani Green / NTPC / GIPCL',
    description: 'The world\'s largest hybrid renewable power park currently under phased commissioning; planned capacity of 30 GW visible from outer space.'
  },
  {
    id: 'muppandal',
    name: 'Muppandal Wind Farm',
    category: 'wind',
    lat: 8.2611,
    lng: 77.5458,
    state: 'Tamil Nadu',
    location: 'Kanyakumari District',
    capacityMW: 1500,
    annualGenGWh: 3200,
    area: 'Mountain Pass Corridor',
    co2OffsetMt: 2.7,
    developer: 'TEDA / Multiple Private Operators',
    description: 'Asia\'s largest operational onshore wind power cluster, capturing perennial seasonal winds blowing through the Palakkad / Aralvaimozhi mountain pass.'
  },
  {
    id: 'jaisalmer',
    name: 'Jaisalmer Wind Park',
    category: 'wind',
    lat: 26.9157,
    lng: 70.9083,
    state: 'Rajasthan',
    location: 'Amar Sagar, Jaisalmer',
    capacityMW: 1064,
    annualGenGWh: 2150,
    area: 'Desert Ridge',
    co2OffsetMt: 1.8,
    developer: 'Suzlon Energy',
    description: 'India\'s prominent desert wind installation, combining utility wind turbines with high-speed desert convection winds.'
  },
  {
    id: 'rewa',
    name: 'Rewa Ultra Mega Solar',
    category: 'solar',
    lat: 24.4795,
    lng: 81.5772,
    state: 'Madhya Pradesh',
    location: 'Gurh Tehsil, Rewa',
    capacityMW: 750,
    annualGenGWh: 1500,
    area: '1,590 Hectares',
    co2OffsetMt: 1.5,
    developer: 'RUMSL / Mahindra / ACME',
    description: 'Pioneered zero-subsidy solar power in India and was the first to supply clean power directly to an institutional client: Delhi Metro Rail Corporation (DMRC).'
  },
  {
    id: 'kurnool',
    name: 'Kurnool Ultra Mega Solar Park',
    category: 'solar',
    lat: 15.6815,
    lng: 78.2825,
    state: 'Andhra Pradesh',
    location: 'Gani & Sakunala, Kurnool',
    capacityMW: 1000,
    annualGenGWh: 2100,
    area: '5,932 Acres',
    co2OffsetMt: 1.9,
    developer: 'APSPCL / SoftBank / Azure',
    description: 'Constructed within 500 days with over ₹7,000 Crore investment, transforming arid scrubland into a clean electricity generator.'
  },
  {
    id: 'kamuthi',
    name: 'Kamuthi Solar Power Project',
    category: 'solar',
    lat: 9.3560,
    lng: 78.3970,
    state: 'Tamil Nadu',
    location: 'Ramanathapuram District',
    capacityMW: 648,
    annualGenGWh: 1200,
    area: '2,500 Acres',
    co2OffsetMt: 1.1,
    developer: 'Adani Green Energy',
    description: 'Commissioned in a record duration of 8 months using 2.5 million solar modules connected via 570 km of cabling.'
  },
  {
    id: 'tehri',
    name: 'Tehri Hydroelectric & Pumped Storage Plant',
    category: 'hydro',
    lat: 30.3780,
    lng: 78.4800,
    state: 'Uttarakhand',
    location: 'Bhagirathi River, Tehri',
    capacityMW: 2400,
    annualGenGWh: 4200,
    area: 'Rockfill Reservoir',
    co2OffsetMt: 3.5,
    developer: 'THDC India Limited',
    description: 'India\'s tallest dam and key grid balancing facility featuring a 1,000 MW variable speed Pumped Storage Plant acting as a high-capacity clean water battery.'
  },
  {
    id: 'koyna',
    name: 'Koyna Hydroelectric Project',
    category: 'hydro',
    lat: 17.4000,
    lng: 73.7500,
    state: 'Maharashtra',
    location: 'Shivajisagar Lake, Satara',
    capacityMW: 1960,
    annualGenGWh: 3500,
    area: 'Western Ghats',
    co2OffsetMt: 2.9,
    developer: 'Mahagenco',
    description: 'The largest completed hydroelectric power facility in India, utilizing the natural steep escarpment of the Western Ghats for flexible peak generation.'
  },
  {
    id: 'ramagundam',
    name: 'Ramagundam Floating Solar Project',
    category: 'hybrid',
    lat: 18.7560,
    lng: 79.5160,
    state: 'Telangana',
    location: 'Peddapalli Reservoir',
    capacityMW: 100,
    annualGenGWh: 210,
    area: '500 Acres Water Surface',
    co2OffsetMt: 0.18,
    developer: 'NTPC Limited',
    description: 'India\'s landmark reservoir floating solar system. Floating photovoltaic modules reduce water evaporation by 3.25 million cubic meters every year.'
  },
  {
    id: 'omkareshwar',
    name: 'Omkareshwar Floating Solar Project',
    category: 'hybrid',
    lat: 22.2450,
    lng: 76.1500,
    state: 'Madhya Pradesh',
    location: 'Narmada River Reservoir',
    capacityMW: 600,
    annualGenGWh: 1200,
    area: 'Multi-reservoir Floating',
    co2OffsetMt: 1.0,
    developer: 'RUMSL / SJVN / NHDC',
    description: 'One of the world\'s largest planned floating solar installations, designed with special wave dampeners and self-adjusting moorings to survive reservoir fluctuations.'
  },
  {
    id: 'charanka',
    name: 'Charanka Solar Park',
    category: 'solar',
    lat: 23.9000,
    lng: 71.2000,
    state: 'Gujarat',
    location: 'Patan District',
    capacityMW: 790,
    annualGenGWh: 1450,
    area: '5,385 Acres',
    co2OffsetMt: 1.2,
    developer: 'GPCL / Multiple Developers',
    description: 'Inaugurated in 2012 as India\'s pioneer ultra-mega solar hub that set the national precedent for dedicated solar infrastructure parks.'
  },
  {
    id: 'sardarsarovar',
    name: 'Sardar Sarovar Hydro Project',
    category: 'hydro',
    lat: 21.8290,
    lng: 73.7480,
    state: 'Gujarat',
    location: 'Narmada River, Kevadia',
    capacityMW: 1450,
    annualGenGWh: 3000,
    area: 'Interstate Project',
    co2OffsetMt: 2.4,
    developer: 'SSNNL / Narmada Basin',
    description: 'Terminal dam of the Narmada Valley Project providing irrigation to arid regions and generating clean electricity shared among Gujarat, MP, and Maharashtra.'
  },
  {
    id: 'paradeep_hydrogen',
    name: 'Paradip Green Hydrogen & Ammonia Hub',
    category: 'hydrogen',
    lat: 20.3160,
    lng: 86.6110,
    state: 'Odisha',
    location: 'Paradip Port Coastal Corridor',
    capacityMW: 1200,
    annualGenGWh: 0,
    area: 'Port Industrial Complex',
    co2OffsetMt: 2.1,
    developer: 'IOCL / Acme / AM Green',
    description: 'Designated strategic port bunker under the National Green Hydrogen Mission, producing 500,000 tonnes of zero-carbon green ammonia for export and fertilizer.'
  },
  {
    id: 'tuticorin_hub',
    name: 'Tuticorin Green Port & Offshore Hub',
    category: 'hydrogen',
    lat: 8.7642,
    lng: 78.1348,
    state: 'Tamil Nadu',
    location: 'V.O. Chidambaranar Port',
    capacityMW: 800,
    annualGenGWh: 0,
    area: 'Coastal Wind & Hydrogen',
    co2OffsetMt: 1.4,
    developer: 'VOCPA / Greenko',
    description: 'India\'s first integrated green hydrogen coastal ecosystem combining 500 MW offshore wind studies with maritime green bunkering capabilities.'
  },
  {
    id: 'sangrur_cbg',
    name: 'Sangrur Bio-CNG Facility',
    category: 'biomass',
    lat: 30.2458,
    lng: 75.8421,
    state: 'Punjab',
    location: 'Lehragaga, Sangrur',
    capacityMW: 33,
    annualGenGWh: 85,
    area: '20 Acres Plant Area',
    co2OffsetMt: 0.15,
    developer: 'Verbio India / SATAT Scheme',
    description: 'Asia\'s premier agricultural residue-based Compressed Bio-Gas (CBG) facility under the SATAT scheme, consuming 100,000 tonnes of paddy stubble annually to eliminate stubble-burning air pollution.'
  },
  {
    id: 'fazilka_biomass',
    name: 'Fazilka Biomass Power Project',
    category: 'biomass',
    lat: 30.4037,
    lng: 74.0254,
    state: 'Punjab',
    location: 'Fazilka District',
    capacityMW: 15,
    annualGenGWh: 95,
    area: 'Rural Agro-Basin',
    co2OffsetMt: 0.12,
    developer: 'PEDA / Universal Biomass',
    description: 'Generates grid-connected clean power by directly co-firing agricultural crop residues, cotton stalks, and mustard husk procured from local agrarian cooperatives.'
  },
  {
    id: 'bengaluru_wte',
    name: 'Bidadi Waste-to-Energy Biomass Plant',
    category: 'biomass',
    lat: 12.7984,
    lng: 77.3874,
    state: 'Karnataka',
    location: 'Bidadi, Ramanagara',
    capacityMW: 14,
    annualGenGWh: 80,
    area: '15 Acres Industrial',
    co2OffsetMt: 0.10,
    developer: 'KPCL / BBMP',
    description: 'Processes 600 tonnes per day of segregated municipal organic waste, transforming urban bio-waste into clean baseline electricity for Bengaluru.'
  }
];

// --- Map Initialization ---
function initIndiaMap() {
  const mapElement = document.getElementById('indiaMap');
  if (!mapElement) return;

  // Center on Central India [22.8, 79.5]
  mapInstance = L.map('indiaMap', {
    center: [22.8, 79.5],
    zoom: 5,
    minZoom: 4,
    maxZoom: 14,
    scrollWheelZoom: false
  });

  // Enable scroll zoom on user click
  mapInstance.on('focus', () => mapInstance.scrollWheelZoom.enable());
  mapInstance.on('blur', () => mapInstance.scrollWheelZoom.disable());

  // High-legibility base map tiles
  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19
  }).addTo(mapInstance);

  // State Renewable Energy Capacities (MNRE 2024-26 Data in GW)
  const stateInfoMap = {
    'RJ': { name: 'Rajasthan', totalGW: 28.6, solarGW: 22.8, windGW: 5.2, hydroGW: 0.5, keyProject: 'Bhadla Solar Park (2,245 MW)' },
    'GJ': { name: 'Gujarat', totalGW: 27.1, solarGW: 14.5, windGW: 11.2, hydroGW: 1.3, keyProject: 'Khavda Mega Hybrid Park (30,000 MW)' },
    'TN': { name: 'Tamil Nadu', totalGW: 22.5, solarGW: 8.8, windGW: 10.4, hydroGW: 2.3, keyProject: 'Muppandal Wind Farm (1,500 MW)' },
    'KA': { name: 'Karnataka', totalGW: 18.4, solarGW: 9.8, windGW: 5.6, hydroGW: 1.8, keyProject: 'Pavagada Solar Park (2,050 MW)' },
    'MH': { name: 'Maharashtra', totalGW: 15.8, solarGW: 6.8, windGW: 5.1, hydroGW: 2.5, keyProject: 'Koyna Hydroelectric (1,960 MW)' },
    'AP': { name: 'Andhra Pradesh', totalGW: 12.5, solarGW: 5.2, windGW: 4.1, hydroGW: 2.8, keyProject: 'Kurnool Solar Park (1,000 MW)' },
    'HP': { name: 'Himachal Pradesh', totalGW: 11.2, solarGW: 0.3, windGW: 0.0, hydroGW: 10.9, keyProject: 'Nathpa Jhakri Hydro (1,500 MW)' },
    'MP': { name: 'Madhya Pradesh', totalGW: 7.2, solarGW: 3.8, windGW: 2.5, hydroGW: 0.8, keyProject: 'Rewa Ultra Mega Solar (750 MW)' },
    'TS': { name: 'Telangana', totalGW: 5.6, solarGW: 4.7, windGW: 0.1, hydroGW: 0.7, keyProject: 'Ramagundam Floating Solar (100 MW)' },
    'UP': { name: 'Uttar Pradesh', totalGW: 5.4, solarGW: 3.1, windGW: 0.0, hydroGW: 0.2, keyProject: 'Bundelkhand Solar Corridors' },
    'UK': { name: 'Uttarakhand', totalGW: 4.2, solarGW: 0.3, windGW: 0.0, hydroGW: 3.9, keyProject: 'Tehri Dam PSP (2,400 MW)' },
    'JK': { name: 'Jammu and Kashmir', totalGW: 4.1, solarGW: 0.3, windGW: 0.0, hydroGW: 3.8, keyProject: 'Kishanganga Hydro Complex' },
    'PB': { name: 'Punjab', totalGW: 3.8, solarGW: 1.6, windGW: 0.0, hydroGW: 1.5, keyProject: 'Canal-Top Solar & Agri-Biomass CBG' },
    'HR': { name: 'Haryana', totalGW: 3.2, solarGW: 1.8, windGW: 0.0, hydroGW: 1.1, keyProject: 'PM-KUSUM Agri-Solar Grid' },
    'OD': { name: 'Odisha', totalGW: 3.1, solarGW: 0.8, windGW: 0.0, hydroGW: 2.2, keyProject: 'Paradip Green Hydrogen Port' },
    'KL': { name: 'Kerala', totalGW: 2.3, solarGW: 0.4, windGW: 0.0, hydroGW: 1.9, keyProject: 'Banasura Sagar Floating Solar' },
    'WB': { name: 'West Bengal', totalGW: 2.1, solarGW: 0.5, windGW: 0.0, hydroGW: 1.5, keyProject: 'Purulia Pumped Storage (900 MW)' },
    'CT': { name: 'Chhattisgarh', totalGW: 1.4, solarGW: 1.0, windGW: 0.0, hydroGW: 0.1, keyProject: 'Bhilai Captive Solar Plants' },
    'BR': { name: 'Bihar', totalGW: 0.9, solarGW: 0.5, windGW: 0.0, hydroGW: 0.1, keyProject: 'Kajra Solar Project' },
    'JH': { name: 'Jharkhand', totalGW: 0.5, solarGW: 0.3, windGW: 0.0, hydroGW: 0.2, keyProject: 'Damodar Valley Floating Solar' },
    'AS': { name: 'Assam', totalGW: 0.6, solarGW: 0.4, windGW: 0.0, hydroGW: 0.2, keyProject: 'Lower Subansiri Hydro Basin' },
    'GA': { name: 'Goa', totalGW: 0.1, solarGW: 0.08, windGW: 0.0, hydroGW: 0.0, keyProject: 'Rooftop Solar & Eco-Tourism' }
  };

  function getStateColor(gw) {
    if (gw >= 20) return '#065f46'; // Dark Emerald (Leader)
    if (gw >= 10) return '#059669'; // Emerald
    if (gw >= 5)  return '#10b981'; // Mint Green
    if (gw >= 2)  return '#6ee7b7'; // Light Green
    return '#d1fae5';               // Subtle Green
  }

  // Add Real Indian State Boundaries if GeoJSON is loaded
  let geoLayer = null;
  if (typeof indiaStatesGeoData !== 'undefined' && indiaStatesGeoData) {
    geoLayer = L.geoJSON(indiaStatesGeoData, {
      style: function(feature) {
        const code = feature.properties.code || feature.id;
        const info = stateInfoMap[code];
        const cap = info ? info.totalGW : 0.5;
        return {
          fillColor: getStateColor(cap),
          weight: 1.5,
          opacity: 1,
          color: '#1b5e37',
          fillOpacity: 0.55
        };
      },
      onEachFeature: function(feature, layer) {
        const code = feature.properties.code || feature.id;
        const name = feature.properties.name || (stateInfoMap[code] ? stateInfoMap[code].name : code);
        const info = stateInfoMap[code] || { totalGW: '0.5+', solarGW: '0.3', windGW: '0.0', keyProject: 'Decentralized Clean Energy' };

        layer.bindTooltip(`
          <div style="font-family:inherit; padding:3px 6px;">
            <strong style="color:#0f3d23; font-size:13px;">🇮🇳 ${name}</strong><br>
            <span style="color:#059669; font-weight:700;">Renewable Capacity: ${info.totalGW} GW</span><br>
            <small style="color:#333;">☀️ Solar: ${info.solarGW} GW | 🌬️ Wind: ${info.windGW} GW</small><br>
            <em style="font-size:10px; color:#555;">📍 ${info.keyProject}</em><br>
            <span style="font-size:10px; color:#10b981; font-weight:700;">👆 Click for full state profile</span>
          </div>
        `, { sticky: true });

        layer.on({
          mouseover: function(e) {
            const l = e.target;
            l.setStyle({ weight: 3, color: '#f59e0b', fillOpacity: 0.8 });
            l.bringToFront();
          },
          mouseout: function(e) {
            geoLayer.resetStyle(e.target);
          },
          click: function(e) {
            mapInstance.fitBounds(e.target.getBounds());
            playSoftChime(640);
            displayStateInSidebar(name, info);
            openStateDetailModal(code || name);
            showToast(`📍 Selected ${name} (${info.totalGW} GW Renewable Capacity)`);
          }
        });
      }
    }).addTo(mapInstance);
  }

  // Render project markers on top of states
  renderMapMarkers('all');

  // Select initial project (Bhadla)
  selectProject(renewableProjects[0]);

  // Ensure map tiles resize correctly
  setTimeout(() => { mapInstance.invalidateSize(); }, 250);
  window.addEventListener('resize', () => { mapInstance.invalidateSize(); });
}

// Marker Pin Icons Generator
function getMarkerIcon(category) {
  let color = '#10b981';
  let symbol = '⚡';
  
  if (category === 'solar') { color = '#f59e0b'; symbol = '☀️'; }
  else if (category === 'wind') { color = '#0891b2'; symbol = '🌬️'; }
  else if (category === 'hydro') { color = '#2563eb'; symbol = '💧'; }
  else if (category === 'hybrid') { color = '#059669'; symbol = '⚡'; }
  else if (category === 'hydrogen') { color = '#7c3aed'; symbol = '🧪'; }
  else if (category === 'biomass') { color = '#15803d'; symbol = '🌱'; }

  const html = `
    <div style="
      background: ${color};
      color: white;
      width: 32px;
      height: 32px;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      display: grid;
      place-items: center;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      border: 2px solid white;
      cursor: pointer;
    ">
      <span style="transform: rotate(45deg); font-size: 14px;">${symbol}</span>
    </div>
  `;

  return L.divIcon({
    className: 'custom-map-pin',
    html: html,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });
}

// Render Markers with Filtering
function renderMapMarkers(categoryFilter = 'all', searchQuery = '') {
  // Clear existing markers
  mapMarkers.forEach(m => mapInstance.removeLayer(m));
  mapMarkers = [];

  const query = searchQuery.trim().toLowerCase();

  renewableProjects.forEach(proj => {
    // Check Category Match
    if (categoryFilter !== 'all' && proj.category !== categoryFilter) return;

    // Check Search Query Match
    if (query) {
      const match = proj.name.toLowerCase().includes(query) ||
                    proj.state.toLowerCase().includes(query) ||
                    proj.location.toLowerCase().includes(query) ||
                    proj.developer.toLowerCase().includes(query);
      if (!match) return;
    }

    const icon = getMarkerIcon(proj.category);
    const marker = L.marker([proj.lat, proj.lng], { icon: icon }).addTo(mapInstance);

    // Popup Card
    const popupContent = `
      <div class="popup-card">
        <h4>${proj.name}</h4>
        <p>${proj.location}, <strong>${proj.state}</strong></p>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:6px;">
          <span class="capacity-tag">${proj.capacityMW} MW</span>
          <button onclick="inspectProjectById('${proj.id}')" style="background:#10b981; color:white; border:none; padding:4px 8px; border-radius:4px; font-size:0.75rem; cursor:pointer;">Inspect</button>
        </div>
      </div>
    `;

    marker.bindPopup(popupContent);

    // On Marker Click
    marker.on('click', () => {
      playSoftChime(660);
      selectProject(proj);
    });

    mapMarkers.push(marker);
  });
}

// Filter Map by Category
function filterMap(cat, buttonElement) {
  playSoftChime(500);
  currentFilter = cat;
  
  // Update button active state
  document.querySelectorAll('.map-filter-btn').forEach(btn => btn.classList.remove('active'));
  if (buttonElement) buttonElement.classList.add('active');

  const searchVal = document.getElementById('mapSearchInput') ? document.getElementById('mapSearchInput').value : '';
  renderMapMarkers(currentFilter, searchVal);
}

// Search Map
function handleMapSearch(val) {
  renderMapMarkers(currentFilter, val);
}

// Select and Display Project in Sidebar
function selectProject(proj) {
  selectedProject = proj;

  const badge = document.getElementById('selectedBadge');
  const title = document.getElementById('selectedTitle');
  const loc = document.getElementById('selectedLoc');
  const cap = document.getElementById('selectedCap');
  const gen = document.getElementById('selectedGen');
  const area = document.getElementById('selectedArea');
  const co2 = document.getElementById('selectedCO2');
  const desc = document.getElementById('selectedDesc');

  if (!title) return;

  title.textContent = proj.name;
  loc.textContent = `${proj.location}, ${proj.state}`;
  cap.textContent = `${proj.capacityMW.toLocaleString()} MW`;
  gen.textContent = proj.annualGenGWh ? `~${proj.annualGenGWh.toLocaleString()} GWh` : 'Green Fuels';
  area.textContent = proj.area;
  co2.textContent = proj.co2OffsetMt ? `${proj.co2OffsetMt} Mt/yr` : 'Strategic Hub';
  desc.textContent = `${proj.description} Developed by: ${proj.developer}.`;

  // Set category pill style
  badge.className = `type-pill type-${proj.category}`;
  badge.textContent = proj.category.toUpperCase();
}

function displayStateInSidebar(name, info) {
  const badge = document.getElementById('selectedBadge');
  const title = document.getElementById('selectedTitle');
  const loc = document.getElementById('selectedLoc');
  const cap = document.getElementById('selectedCap');
  const gen = document.getElementById('selectedGen');
  const area = document.getElementById('selectedArea');
  const co2 = document.getElementById('selectedCO2');
  const desc = document.getElementById('selectedDesc');

  if (!title) return;

  title.textContent = `State: ${name}`;
  loc.textContent = `India Renewable Energy State Profile`;
  cap.textContent = `${info.totalGW} GW`;
  gen.textContent = `☀️ ${info.solarGW} GW Solar`;
  area.textContent = `🌬️ ${info.windGW} GW Wind`;
  co2.textContent = `💧 ${info.hydroGW || 0} GW Hydro`;
  desc.textContent = `${name} is one of India's prominent clean energy states. Flagship regional project: ${info.keyProject}. Actively contributing towards the national 500 GW non-fossil capacity target by 2030.`;

  badge.className = 'type-pill type-hybrid';
  badge.textContent = 'INDIAN STATE';
}

function inspectProjectById(id) {
  const p = renewableProjects.find(item => item.id === id);
  if (p) {
    selectProject(p);
    zoomToSelectedProject();
  }
}

function zoomToSelectedProject() {
  if (selectedProject && mapInstance) {
    playSoftChime(750);
    mapInstance.flyTo([selectedProject.lat, selectedProject.lng], 9, {
      duration: 1.2
    });
  }
}

// State Leaderboard Fly-To
const stateCoordinates = {
  'Rajasthan': [26.8, 73.8],
  'Gujarat': [22.8, 71.5],
  'Tamil Nadu': [10.8, 78.7],
  'Karnataka': [14.8, 75.8],
  'Maharashtra': [19.2, 75.5]
};

function flyToState(stateName) {
  playSoftChime(620);
  const coords = stateCoordinates[stateName];
  if (coords && mapInstance) {
    mapInstance.flyTo(coords, 7, { duration: 1.2 });
    showToast(`📍 Centered map on ${stateName} Renewable Corridor`);
  }
}

// --- Rooftop Solar & Clean Energy Savings Calculator ---
function calculateSolar() {
  const billSlider = document.getElementById('billSlider');
  const stateTariff = document.getElementById('stateTariff');
  const areaSlider = document.getElementById('areaSlider');

  if (!billSlider || !stateTariff || !areaSlider) return;

  const bill = parseFloat(billSlider.value);
  const tariff = parseFloat(stateTariff.value);
  const roofArea = parseFloat(areaSlider.value);

  // Update UI Labels
  document.getElementById('billDisplay').textContent = `₹${bill.toLocaleString()}`;
  document.getElementById('areaDisplay').textContent = `${roofArea.toLocaleString()} sq.ft`;

  // Consumption estimation: monthly units = bill / tariff
  const monthlyUnits = bill / tariff;
  
  // Daily generation per kWp in India ~ 4 units => Monthly per kWp ~ 120 units
  let idealKw = monthlyUnits / 120;
  
  // Max size constrained by roof area (1 kWp needs ~100 sq.ft)
  const maxKwByArea = roofArea / 100;
  let recommendedKw = Math.min(idealKw, maxKwByArea);
  
  // Round to nearest 0.5 kW (minimum 1 kW)
  recommendedKw = Math.max(1, Math.round(recommendedKw * 2) / 2);

  // PM Surya Ghar Subsidy Guidelines:
  // 1 kW: ₹30,000 | 2 kW: ₹60,000 | 3 kW and above: ₹78,000 (flat max)
  let subsidy = 0;
  if (recommendedKw >= 3) {
    subsidy = 78000;
  } else if (recommendedKw >= 2) {
    subsidy = 60000;
  } else {
    subsidy = 30000;
  }

  // Cost estimates: Benchmark ~ ₹60,000 per kWp for quality DCR panels
  const grossCost = recommendedKw * 60000;
  const netCost = Math.max(0, grossCost - subsidy);

  // Annual Generation = kW * 4 units/day * 365 days
  const annualGenUnits = recommendedKw * 4 * 365;
  const annualSavings = Math.round(annualGenUnits * tariff);
  const paybackYears = annualSavings > 0 ? (netCost / annualSavings).toFixed(1) : 0;

  // 25-Year Cumulative Savings: (Annual Savings * 25 years) - Net initial investment
  const lifetimeSavingsLakhs = (((annualSavings * 25) - netCost) / 100000).toFixed(2);

  // Environmental Metrics: 0.82 kg CO2 avoided per kWh in Indian grid
  const co2TonnesAnnual = ((annualGenUnits * 0.82) / 1000).toFixed(1);
  const treesEquiv = Math.round((co2TonnesAnnual * 1000) / 22); // 1 mature tree absorbs ~22kg CO2/year

  // Update DOM Outputs
  document.getElementById('resSystemSize').textContent = `${recommendedKw.toFixed(1)} kWp`;
  document.getElementById('resGrossCost').textContent = `₹${grossCost.toLocaleString()}`;
  document.getElementById('resSubsidy').textContent = `- ₹${subsidy.toLocaleString()}`;
  document.getElementById('resNetCost').textContent = `₹${netCost.toLocaleString()}`;
  document.getElementById('resAnnualSavings').textContent = `₹${annualSavings.toLocaleString()} / yr`;
  document.getElementById('resPayback').textContent = `${paybackYears} Years`;
  document.getElementById('resLifetimeSavings').textContent = `₹${lifetimeSavingsLakhs} Lakhs`;
  document.getElementById('resCO2Info').innerHTML = `
    Mitigates <strong>${co2TonnesAnnual} tonnes of CO₂</strong> annually, equivalent to planting <strong>${treesEquiv} mature trees</strong> every year!
  `;
}

// --- Video Player Controller ---
function switchVideoSource(mode, buttonElement) {
  playSoftChime(550);
  document.querySelectorAll('.btn-video-tab').forEach(b => b.classList.remove('active'));
  if (buttonElement) buttonElement.classList.add('active');

  const wrapper = document.getElementById('videoWrapper');
  if (!wrapper) return;

  if (mode === 'embed') {
    wrapper.innerHTML = `
      <iframe id="projectVideoFrame" src="https://www.youtube.com/embed/1kUE0BZtTRc?rel=0&autoplay=1" title="India's Clean Renewable Energy Revolution Documentary" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
    `;
    showToast('▶️ Loaded 5-minute Renewable India Documentary');
  } else if (mode === 'youtube') {
    const customId = prompt('Enter YouTube Video ID (e.g., dQw4w9WgXcQ) or full YouTube Link:', '1kUE0BZtTRc');
    if (customId) {
      let finalId = customId.trim();
      if (finalId.includes('v=')) finalId = finalId.split('v=')[1].split('&')[0];
      else if (finalId.includes('youtu.be/')) finalId = finalId.split('youtu.be/')[1].split('?')[0];

      wrapper.innerHTML = `
        <iframe id="projectVideoFrame" src="https://www.youtube.com/embed/${finalId}?autoplay=1" title="Custom Project Video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
      `;
      showToast('✅ Updated project video source');
    }
  } else if (mode === 'local') {
    wrapper.innerHTML = `
      <div style="position:absolute; top:0; left:0; width:100%; height:100%; display:grid; place-items:center; background:#112a1c; color:white; padding:20px; text-align:center;">
        <div>
          <p style="margin-bottom:14px; font-size:1rem;">Upload your group's local 5-minute video file (.mp4, .webm):</p>
          <input type="file" accept="video/mp4,video/webm" id="localVideoPicker" onchange="handleLocalVideo(event)" style="background:white; color:black; padding:8px; border-radius:8px;">
        </div>
      </div>
    `;
  }
}

function handleLocalVideo(event) {
  const file = event.target.files[0];
  if (!file) return;
  const url = URL.createObjectURL(file);
  const wrapper = document.getElementById('videoWrapper');
  wrapper.innerHTML = `
    <video controls autoplay style="position:absolute; top:0; left:0; width:100%; height:100%;">
      <source src="${url}" type="${file.type}">
      Your browser does not support HTML5 video.
    </video>
  `;
  showToast('📹 Playing local project video file');
}

// --- Social Media Engagement Tracker & Share Functions ---
let socialMetrics = {
  ytViews: 14200,
  instaReels: 28500,
  liImpressions: 4800,
  totalEngagement: 2480
};

function openMetricsUpdateModal() {
  const newYt = prompt('Enter verified YouTube video views count:', socialMetrics.ytViews);
  if (newYt !== null && !isNaN(newYt)) socialMetrics.ytViews = parseInt(newYt);

  const newInsta = prompt('Enter verified Instagram reel plays count:', socialMetrics.instaReels);
  if (newInsta !== null && !isNaN(newInsta)) socialMetrics.instaReels = parseInt(newInsta);

  const newLi = prompt('Enter verified LinkedIn post impressions count:', socialMetrics.liImpressions);
  if (newLi !== null && !isNaN(newLi)) socialMetrics.liImpressions = parseInt(newLi);

  const newEng = prompt('Enter total likes, shares and comments count:', socialMetrics.totalEngagement);
  if (newEng !== null && !isNaN(newEng)) socialMetrics.totalEngagement = parseInt(newEng);

  updateSocialMetricsDisplay();
  showToast('📊 Social Media Metrics updated for CA1 Report!');
}

function updateSocialMetricsDisplay() {
  const formatNum = (num) => num >= 1000 ? `${(num / 1000).toFixed(1)}K` : num.toLocaleString();
  document.getElementById('ytViewsDisplay').textContent = formatNum(socialMetrics.ytViews);
  document.getElementById('instaReelsDisplay').textContent = formatNum(socialMetrics.instaReels);
  document.getElementById('liImpressionsDisplay').textContent = formatNum(socialMetrics.liImpressions);
  document.getElementById('totalEngagementDisplay').textContent = socialMetrics.totalEngagement.toLocaleString();
}

function shareOnWhatsApp() {
  const text = encodeURIComponent("Check out our academic project on 'Renewable Energy for Sustainable Development: India's Progress and Future Challenges' (LPU CHE110 CA1) by Shiven Kumar, Akshay Shukla & Aayush Aryan. Explore the interactive India Real Map & Solar Calculator! https://renewableindia.ac.in");
  window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
}

function shareOnX() {
  const text = encodeURIComponent("Explore India's Renewable Energy Revolution: 500 GW target by 2030, real solar/wind map & solar roof calculator. Academic task for #CHE110 at @LPUUniversity by Shiven, Akshay & Aayush! #RenewableIndia #Sustainability");
  window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
}

function shareOnLinkedIn() {
  const url = encodeURIComponent(window.location.href);
  window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
}

function copyProjectLink() {
  navigator.clipboard.writeText(window.location.href).then(() => {
    showToast('🔗 Project link copied to clipboard!');
  }).catch(() => {
    showToast('Link: ' + window.location.href);
  });
}

// --- Intelligent Dual-Engine AI Chatbot (EcoAI) ---
const knowledgeBase = [
  {
    triggers: ['pm surya ghar', 'surya ghar', 'muft bijli', 'rooftop solar', 'subsidy', 'solar scheme', 'bijli scheme'],
    response: `<strong>PM Surya Ghar: Muft Bijli Yojana</strong> is India's flagship rooftop solar initiative approved with a ₹75,021 Crore outlay.<br><br>
    <strong>Key Benefits:</strong><br>
    • Up to <strong>300 units of free solar electricity</strong> monthly for 1 Crore households.<br>
    • <strong>Central Government Subsidies:</strong><br>
      - 1 kW system: ₹30,000<br>
      - 2 kW system: ₹60,000<br>
      - 3 kW system and above: Flat ₹78,000<br>
    • Applications are submitted online via the national portal <code>pmsuryaghar.gov.in</code> with collateral-free low-interest bank loans (~7%).`
  },
  {
    triggers: ['bhadla', 'bhadla solar', 'jodhpur solar', 'rajasthan solar'],
    response: `<strong>Bhadla Solar Park</strong> is located in Phalodi, Jodhpur district, Rajasthan.<br><br>
    • <strong>Capacity:</strong> 2,245 MW across 14,000 acres.<br>
    • <strong>Significance:</strong> One of the world's largest single-site solar installations.<br>
    • <strong>Innovation:</strong> Operates in high-temperature desert conditions where robotic dry-cleaning machines conserve precious water while cleaning dust off solar panels daily.`
  },
  {
    triggers: ['khavda', 'rann of kutch', 'largest park', '30000 mw', '30 gw'],
    response: `<strong>Khavda Renewable Energy Park</strong> in the Rann of Kutch, Gujarat, is currently the <strong>largest renewable energy installation in the world</strong> under phased development.<br><br>
    • <strong>Total Capacity:</strong> 30,000 MW (30 GW: 26 GW Solar + 4 GW Wind).<br>
    • <strong>Scale:</strong> Spreads over 538 sq. km—5 times larger than Paris and visible from space!<br>
    • <strong>Annual Clean Power:</strong> Will generate ~81 billion units, powering over 16 million homes.`
  },
  {
    triggers: ['pavagada', 'shakti sthala', 'karnataka solar'],
    response: `<strong>Pavagada Solar Park (Shakti Sthala)</strong> in Tumakuru district, Karnataka:<br><br>
    • <strong>Capacity:</strong> 2,050 MW across 13,000 acres.<br>
    • <strong>Unique Land Model:</strong> Built on drought-prone semi-arid farmland where farmers retain land ownership and receive annual inflation-linked lease payments, preventing farmer displacement.`
  },
  {
    triggers: ['muppandal', 'wind farm', 'tamil nadu wind', 'kanyakumari wind'],
    response: `<strong>Muppandal Wind Farm</strong> in Kanyakumari, Tamil Nadu, is Asia's largest operational onshore wind power facility with over <strong>1,500 MW</strong> capacity.<br><br>
    It harnesses high-velocity winds funneling through the Western Ghats (Aralvaimozhi mountain gap), powering thousands of spinning wind turbines.`
  },
  {
    triggers: ['target', '2030', '500 gw', 'panchamrit', 'cop26', 'net zero', 'pledge'],
    response: `India's 5 Climate Commitments (<strong>Panchamrit</strong> announced at COP26 / COP28):<br><br>
    1. Reach <strong>500 GW Non-Fossil Electricity Capacity</strong> by 2030 (currently at ~194.6+ GW).<br>
    2. Meet <strong>50% of energy requirements</strong> from renewables by 2030.<br>
    3. Reduce total projected carbon emissions by <strong>1 Billion Tonnes</strong> by 2030.<br>
    4. Reduce the carbon intensity of the economy by <strong>45%</strong> below 2005 levels by 2030.<br>
    5. Achieve <strong>Net-Zero Carbon Emissions by 2070</strong>.`
  },
  {
    triggers: ['top states', 'state ranking', 'leading state', 'which state'],
    response: `<strong>Top 5 Renewable Energy States in India (MNRE 2024-26):</strong><br><br>
    1. <strong>Rajasthan:</strong> ~28.6 GW (Dominates utility-scale solar).<br>
    2. <strong>Gujarat:</strong> ~27.1 GW (Leader in wind, hybrid parks & residential solar).<br>
    3. <strong>Tamil Nadu:</strong> ~22.5 GW (Pioneer in onshore wind power).<br>
    4. <strong>Karnataka:</strong> ~18.4 GW (Home to Pavagada Solar Park).<br>
    5. <strong>Maharashtra:</strong> ~15.8 GW (Strong commercial rooftop solar and hydro).`
  },
  {
    triggers: ['green hydrogen', 'hydrogen mission', 'electrolyzer', 'green ammonia'],
    response: `<strong>National Green Hydrogen Mission:</strong><br><br>
    • Approved with an outlay of <strong>₹19,744 Crore</strong>.<br>
    • <strong>Target:</strong> 5 Million Metric Tonnes (MMT) of green hydrogen per annum by 2030.<br>
    • Supports domestic manufacturing of electrolyzers (SIGHT program) and transforms key ports (Paradip, Deendayal/Kandla, Tuticorin) into green shipping and bunkering hubs.`
  },
  {
    triggers: ['ca1', 'report', '7 sections', 'annexure', 'assignment', 'format'],
    response: `<strong>LPU CHE110 CA1 Handwritten Report Format (Annexure I):</strong><br><br>
    1. <strong>Introduction:</strong> Problem statement, fossil reliance, environmental impact, transition need.<br>
    2. <strong>Review of Literature:</strong> MNRE, CEA, IEA, NITI Aayog research papers.<br>
    3. <strong>Description of Product:</strong> Interactive website, real India map, solar calculator, AI assistant.<br>
    4. <strong>Significance:</strong> Citizen decision support, awareness, educational impact.<br>
    5. <strong>Social Media Coverage:</strong> Facts on views, likes, shares, comments with screenshots.<br>
    6. <strong>Conclusion:</strong> Summary, future grid & policy recommendations.<br>
    7. <strong>Bibliography:</strong> Academic references in APA format.<br><br>
    <em>Click the "CA1 Report Guide" button in the top bar to inspect the complete pre-drafted dossier!</em>`
  },
  {
    triggers: ['team', 'members', 'shiven', 'akshay', 'aayush', 'group'],
    response: `<strong>Project Student Group (CHE110 CA1 - LPU):</strong><br><br>
    • <strong>Shiven Kumar:</strong> Reg. No: 12612486 | Roll No: RK4P26YMA34<br>
    • <strong>Akshay Shukla:</strong> Reg. No: 12612434 | Roll No: RK4P26YMA32<br>
    • <strong>Aayush Aryan:</strong> Reg. No: 12612237 | Roll No: RK4P26YMA33<br><br>
    Course: <strong>CHE110 (Environmental Studies)</strong>, Lovely Professional University.`
  },
  {
    triggers: ['challenges', 'problems', 'hurdles', 'storage', 'duck curve', 'grid'],
    response: `<strong>Key Challenges Facing India's Renewable Sector:</strong><br><br>
    1. <strong>Grid Intermittency:</strong> Solar only generates in day, wind is seasonal. Solution: 47 GW Pumped Storage Hydro (PSP) and Battery Storage (BESS).<br>
    2. <strong>Land Conflicts:</strong> 4-5 acres needed per MW of solar. Solution: Floating solar & Agri-PV.<br>
    3. <strong>DISCOM Losses:</strong> Delays in developer payments. Solution: RDSS and smart metering.<br>
    4. <strong>Solar E-Waste:</strong> End-of-life solar panels. Solution: Mandatory Extended Producer Responsibility (EPR) under E-Waste Rules 2022.`
  },
  {
    triggers: ['hindi', 'kaise', 'kya hai', 'bijli', 'suraj', 'pawan', 'hawa', 'pani'],
    response: `<strong>भारत में नवीकरणीय ऊर्जा (Renewable Energy):</strong><br><br>
    भारत प्राकृतिक स्रोतों जैसे सूर्य (Solar), हवा (Wind), और बहते पानी (Hydropower) से स्वच्छ बिजली पैदा करने में दुनिया के शीर्ष 4 देशों में शामिल है।<br><br>
    • <strong>2030 का लक्ष्य:</strong> 500 गीगावाट (GW) गैर-जीवाश्म बिजली क्षमता।<br>
    • <strong>पीएम सूर्य घर योजना:</strong> 1 करोड़ परिवारों को 300 यूनिट मुफ्त बिजली और ₹78,000 तक की सरकारी सब्सिडी।<br>
    • <strong>पर्यावरणीय लाभ:</strong> कोयले के धुएं और प्रदूषण में कमी, तथा 2070 तक नेट-ज़ीरो कार्बन उत्सर्जन का संकल्प।`
  }
];

// Fallback Smart Answer Generator with dynamic calculations
function generateSmartReply(userQuery) {
  const q = userQuery.toLowerCase().trim();

  // 1. Check if user asked to calculate savings or bill
  if (q.includes('calculate') || q.includes('savings') || q.includes('bill') || q.includes('kharcha')) {
    const numMatch = q.match(/\d+/);
    const val = numMatch ? parseInt(numMatch[0]) : 4000;
    
    let size = 3;
    let subsidy = 78000;
    if (val < 2000) { size = 1; subsidy = 30000; }
    else if (val < 3500) { size = 2; subsidy = 60000; }
    
    const gross = size * 60000;
    const net = gross - subsidy;
    const annSav = Math.round(size * 4 * 365 * 7.0);
    const payback = (net / annSav).toFixed(1);

    return `<strong>⚡ Instant Rooftop Solar Calculation:</strong><br><br>
    For a monthly electricity bill of approx. <strong>₹${val.toLocaleString()}</strong>:<br>
    • <strong>Recommended System Size:</strong> ${size} kWp (needs ~${size * 100} sq.ft roof)<br>
    • <strong>Estimated Total Cost:</strong> ₹${gross.toLocaleString()}<br>
    • <strong>Central Subsidy (PM Surya Ghar):</strong> ₹${subsidy.toLocaleString()}<br>
    • <strong>Net Investment:</strong> ₹${net.toLocaleString()}<br>
    • <strong>Annual Savings:</strong> ~₹${annSav.toLocaleString()} / year<br>
    • <strong>Payback Time:</strong> ~${payback} Years (followed by 20+ years of free electricity!)<br><br>
    <em>Try our interactive slider calculator on the website for fine-tuned state tariff adjustments.</em>`;
  }

  // 2. Scan Knowledge Base
  for (const item of knowledgeBase) {
    if (item.triggers.some(t => q.includes(t))) {
      return item.response;
    }
  }

  // 3. Fallback response with helpful guide
  return `I can help you explore India's clean energy transition! You can ask me about:<br><br>
  • <strong>Solar & Wind Hubs:</strong> Bhadla, Pavagada, Khavda, Muppandal<br>
  • <strong>Govt. Schemes:</strong> PM Surya Ghar Muft Bijli Yojana, Green Hydrogen Mission<br>
  • <strong>National Targets:</strong> 500 GW by 2030, Panchamrit COP26 pledges<br>
  • <strong>Solar Roof Calculations:</strong> e.g. "Calculate savings for ₹3500 bill"<br>
  • <strong>LPU CHE110 CA1:</strong> Student team, 5-minute video, Annexure I 7-section report format.<br><br>
  <em>What would you like to explore next?</em>`;
}

// Live Gemini API Calling (Optional User Key)
async function callLiveGeminiAPI(apiKey, prompt) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
  const systemInstruction = `You are EcoAI, an expert environmental science AI assistant for an academic project at Lovely Professional University (LPU), Course: CHE110 Environmental Studies. The topic is "Renewable Energy for Sustainable Development: India's Progress and Future Challenges" by students Shiven Kumar, Akshay Shukla, and Aayush Aryan. Keep answers concise, accurate, inspiring, and formatted with clean HTML tags (strong, br, ul, li). Emphasize facts from MNRE, CEA, Panchamrit 2030 targets (500 GW), and PM Surya Ghar.`;

  const payload = {
    contents: [
      {
        role: 'user',
        parts: [{ text: `${systemInstruction}\n\nUser Question: ${prompt}` }]
      }
    ]
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`Gemini API returned status ${response.status}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  return text ? text.replace(/\n/g, '<br>') : null;
}

// Handle Chat Submission
async function handleChatSubmit(event) {
  event.preventDefault();
  const input = document.getElementById('chatInput');
  const query = input.value.trim();
  if (!query) return;

  playSoftChime(600);
  addChatMessage(query, 'user');
  input.value = '';

  // Show typing bubble
  const typingBubble = addChatMessage('<em>EcoAI is thinking... 🌱</em>', 'bot typing');

  const storedKey = localStorage.getItem('gemini_api_key');

  if (storedKey) {
    try {
      const liveReply = await callLiveGeminiAPI(storedKey, query);
      typingBubble.remove();
      addChatMessage(liveReply, 'bot');
      playSoftChime(720);
      return;
    } catch (err) {
      console.warn('Gemini live API failed, falling back to local NLP engine:', err);
    }
  }

  // Local Offline NLP Response
  setTimeout(() => {
    typingBubble.remove();
    const reply = generateSmartReply(query);
    addChatMessage(reply, 'bot');
    playSoftChime(720);
  }, 450);
}

function quickAsk(promptText) {
  const input = document.getElementById('chatInput');
  if (input) {
    input.value = promptText;
    const form = document.querySelector('.chat-input-bar');
    if (form) form.dispatchEvent(new Event('submit'));
  }
}

function addChatMessage(content, type) {
  const container = document.getElementById('chatMessages');
  if (!container) return null;

  const bubble = document.createElement('div');
  bubble.className = `chat-bubble ${type}`;
  bubble.innerHTML = content;

  if (type === 'bot') {
    const actionRow = document.createElement('div');
    actionRow.className = 'bot-actions-row';
    actionRow.innerHTML = `
      <button class="btn-bubble-tool" onclick="speakText(this.parentElement.parentElement)">🔊 Read aloud</button>
      <button class="btn-bubble-tool" onclick="copyBubbleText(this.parentElement.parentElement)">📋 Copy</button>
    `;
    bubble.appendChild(actionRow);
  }

  container.appendChild(bubble);
  container.scrollTop = container.scrollHeight;
  return bubble;
}

function clearChatHistory() {
  const container = document.getElementById('chatMessages');
  if (container) {
    container.innerHTML = `
      <div class="chat-bubble bot">
        Chat history cleared! 👋 Ask me anything about India's renewable energy, solar calculator, or CA1 report requirements.
        <div class="bot-actions-row">
          <button class="btn-bubble-tool" onclick="speakText(this.parentElement.parentElement)">🔊 Read aloud</button>
          <button class="btn-bubble-tool" onclick="copyBubbleText(this.parentElement.parentElement)">📋 Copy</button>
        </div>
      </div>
    `;
    showToast('Chat history reset');
  }
}

// Text-to-Speech Web Speech API
function speakText(bubbleElement) {
  if (!window.speechSynthesis) {
    showToast('Speech synthesis not supported in this browser');
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  // Extract clean text without buttons
  const clone = bubbleElement.cloneNode(true);
  const actionRow = clone.querySelector('.bot-actions-row');
  if (actionRow) actionRow.remove();
  const text = clone.innerText || clone.textContent;

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1.0;
  utterance.pitch = 1.0;
  window.speechSynthesis.speak(utterance);
  showToast('🔊 Reading response aloud...');
}

function copyBubbleText(bubbleElement) {
  const clone = bubbleElement.cloneNode(true);
  const actionRow = clone.querySelector('.bot-actions-row');
  if (actionRow) actionRow.remove();
  const text = clone.innerText || clone.textContent;

  navigator.clipboard.writeText(text).then(() => {
    showToast('📋 Copied answer to clipboard!');
  });
}

function toggleChat() {
  playSoftChime(480);
  const win = document.getElementById('chatbot');
  if (win) {
    win.classList.toggle('open');
    if (win.classList.contains('open')) {
      document.getElementById('chatInput').focus();
    }
  }
}

function toggleChatSettings() {
  const panel = document.getElementById('chatSettingsPanel');
  if (panel) panel.classList.toggle('open');
}

function saveGeminiKey() {
  const input = document.getElementById('geminiApiKeyInput');
  const val = input.value.trim();
  if (val) {
    localStorage.setItem('gemini_api_key', val);
    showToast('🔑 Gemini API Key saved! Live AI enabled.');
    toggleChatSettings();
  } else {
    localStorage.removeItem('gemini_api_key');
    showToast('ℹ️ API Key cleared. Using built-in EcoAI.');
    toggleChatSettings();
  }
}

// --- Report Modal & Print Controller ---
function openReportModal() {
  playSoftChime(580);
  const modal = document.getElementById('reportModal');
  if (modal) modal.classList.add('open');
}

function closeReportModal() {
  const modal = document.getElementById('reportModal');
  if (modal) modal.classList.remove('open');
}

function printReport() {
  window.print();
}

function toggleAccordion(headerElement) {
  playSoftChime(450);
  const item = headerElement.parentElement;
  item.classList.toggle('open');
}

// --- Navigation & UI Utilities ---
function toggleMenu() {
  const nav = document.getElementById('navLinks');
  if (nav) nav.classList.toggle('mobile');
}

function showToast(message) {
  const toast = document.getElementById('toastMsg');
  const toastText = document.getElementById('toastText');
  if (!toast || !toastText) return;

  toastText.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3200);
}

// --- Initialize Page on DOM Loaded ---
document.addEventListener('DOMContentLoaded', () => {
  // Initialize Leaflet Map
  initIndiaMap();

  // Run initial calculator evaluation
  calculateSolar();

  // Pre-load saved Gemini key if existing
  const savedKey = localStorage.getItem('gemini_api_key');
  if (savedKey && document.getElementById('geminiApiKeyInput')) {
    document.getElementById('geminiApiKeyInput').value = savedKey;
  }

  // Close modals on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeReportModal();
      const chatWin = document.getElementById('chatbot');
      if (chatWin && chatWin.classList.contains('open')) chatWin.classList.remove('open');
    }
  });

  console.log('Renewable India Project initialized successfully. CA1 Lovely Professional University CHE110.');
});
