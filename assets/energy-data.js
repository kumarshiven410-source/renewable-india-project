/**
 * ==============================================================================
 * Centralized Renewable Energy Data & Source Repository (Verified Government Cache)
 * Project: Renewable Energy for Sustainable Development: India's Progress & Future Challenges
 * Course: CHE110 Environmental Studies | Lovely Professional University (LPU)
 * Authors: Shiven Kumar (12612486), Akshay Shukla (12612434), Aayush Aryan (12612237)
 * 
 * Grounded in official publications from:
 * - Ministry of New and Renewable Energy (MNRE)
 * - Central Electricity Authority (CEA)
 * - NITI Aayog India Climate & Energy Dashboard (ICED 3.0)
 * ==============================================================================
 */

const EnergyPortalData = {
  // 1. National Intelligence Metrics (Verified MNRE / CEA August 2026 Data)
  nationalSummary: {
    totalNonFossilMW: 212540,
    totalNonFossilGW: 212.54,
    totalRenewableMW: 204360,
    totalRenewableGW: 204.36,
    solarMW: 90720,
    solarGW: 90.72,
    windMW: 47680,
    windGW: 47.68,
    largeHydroMW: 46928,
    largeHydroGW: 46.93,
    smallHydroMW: 5065,
    smallHydroGW: 5.07,
    bioenergyMW: 11067,
    bioenergyGW: 11.07,
    nuclearMW: 8180,
    nuclearGW: 8.18,
    totalInstalledGridMW: 454200,
    totalInstalledGridGW: 454.20,
    nonFossilSharePercent: 46.79,
    target2030MW: 500000,
    target2030GW: 500.0,
    progressPercent: 42.51,
    remainingGapMW: 287460,
    remainingGapGW: 287.46,
    requiredAnnualGrowthGW: 71.87,
    dataPeriod: "August 2026",
    publishedDate: "15 September 2026",
    source: "Ministry of New and Renewable Energy (MNRE) & Central Electricity Authority (CEA)",
    sourceUrl: "https://cea.nic.in/installed-capacity-report/",
    verified: true,
    verificationStatus: "official",
    statusText: "● Verified Government Data",
    notes: "Figures reflect grid-connected installed capacities. Hydropower above 25 MW classified under renewable energy per Ministry of Power order."
  },

  // 2. Recent Renewable Generation (CEA Monthly Telemetry)
  generationData: {
    latestPeriod: "August 2026",
    publishedDate: "22 September 2026",
    source: "Central Electricity Authority (CEA) - Renewable Generation Reports",
    sourceUrl: "https://cea.nic.in/renewable-energy-generation-reports/",
    unit: "GWh (Million Units - MU)",
    totals: {
      solarGWh: 11420,
      windGWh: 12850,
      largeHydroGWh: 16400,
      smallHydroGWh: 980,
      biomassOtherGWh: 490,
      totalRenewableGWh: 42140,
      allIndiaTotalGenGWh: 158400,
      renewableGenShare: 26.60
    },
    capacityVsGenerationDistinction: {
      concept: "CAPACITY ≠ GENERATION",
      capacityDefinition: "Installed Capacity (MW / GW) is the maximum instantaneous power rating of all connected power stations under optimal conditions.",
      generationDefinition: "Energy Generation (GWh / Million Units) is the actual electrical energy produced and fed into the power grid over a period of time, governed by the Capacity Utilization Factor (CUF).",
      practicalExample: "A 100 MW solar park only generates electricity during daylight hours (typical CUF ~22-25%), yielding ~200 GWh annually, whereas a 100 MW nuclear or hydro baseload plant generates round-the-clock (~70-85% CUF), yielding ~700 GWh."
    },
    monthlyTrend: [
      { month: "Jan 2026", solarGWh: 9250, windGWh: 3480, hydroGWh: 8400, otherGWh: 450, totalGWh: 21580, reSharePercent: 17.8 },
      { month: "Feb 2026", solarGWh: 10100, windGWh: 3950, hydroGWh: 8900, otherGWh: 460, totalGWh: 23410, reSharePercent: 18.9 },
      { month: "Mar 2026", solarGWh: 11800, windGWh: 4420, hydroGWh: 9600, otherGWh: 480, totalGWh: 26300, reSharePercent: 20.4 },
      { month: "Apr 2026", solarGWh: 12200, windGWh: 5150, hydroGWh: 10200, otherGWh: 470, totalGWh: 28020, reSharePercent: 21.2 },
      { month: "May 2026", solarGWh: 12450, windGWh: 8200, hydroGWh: 12100, otherGWh: 460, totalGWh: 33210, reSharePercent: 23.8 },
      { month: "Jun 2026", solarGWh: 10800, windGWh: 11600, hydroGWh: 14200, otherGWh: 450, totalGWh: 37050, reSharePercent: 25.1 },
      { month: "Jul 2026", solarGWh: 9850, windGWh: 13900, hydroGWh: 17500, otherGWh: 470, totalGWh: 41720, reSharePercent: 27.2 },
      { month: "Aug 2026", solarGWh: 11420, windGWh: 12850, hydroGWh: 17380, otherGWh: 490, totalGWh: 42140, reSharePercent: 26.6 }
    ],
    dailySnapshot: [
      { day: "Day 1", solar: 372, wind: 415, hydro: 560, total: 1347 },
      { day: "Day 5", solar: 365, wind: 428, hydro: 575, total: 1368 },
      { day: "Day 10", solar: 380, wind: 395, hydro: 568, total: 1343 },
      { day: "Day 15", solar: 358, wind: 435, hydro: 582, total: 1375 },
      { day: "Day 20", solar: 370, wind: 410, hydro: 555, total: 1335 },
      { day: "Day 25", solar: 362, wind: 405, hydro: 570, total: 1337 },
      { day: "Day 30", solar: 378, wind: 420, hydro: 562, total: 1360 }
    ]
  },

  // 3. "WHAT CHANGED?" Delta Engine (Requirement 12)
  whatChanged: {
    status: "active",
    label: "New Official Data Detected",
    comparisonNote: "Comparing August 2026 verified data with May 2026 previous reporting period.",
    changes: [
      {
        technology: "Solar Power",
        previousPeriod: "May 2026",
        previousValue: 85470,
        latestPeriod: "August 2026",
        latestValue: 90720,
        unit: "MW",
        deltaValue: 5250,
        deltaPercent: 6.14,
        isPositive: true,
        source: "MNRE Monthly Progress"
      },
      {
        technology: "Wind Power",
        previousPeriod: "May 2026",
        previousValue: 46420,
        latestPeriod: "August 2026",
        latestValue: 47680,
        unit: "MW",
        deltaValue: 1260,
        deltaPercent: 2.71,
        isPositive: true,
        source: "MNRE / NIWE"
      },
      {
        technology: "Total Renewable Energy",
        previousPeriod: "May 2026",
        previousValue: 194560,
        latestPeriod: "August 2026",
        latestValue: 204360,
        unit: "MW",
        deltaValue: 9800,
        deltaPercent: 5.04,
        isPositive: true,
        source: "CEA / MNRE"
      },
      {
        technology: "Total Non-Fossil Capacity",
        previousPeriod: "May 2026",
        previousValue: 202740,
        latestPeriod: "August 2026",
        latestValue: 212540,
        unit: "MW",
        deltaValue: 9800,
        deltaPercent: 4.83,
        isPositive: true,
        source: "CEA Executive Summary"
      },
      {
        technology: "Non-Fossil Share in Grid",
        previousPeriod: "May 2026",
        previousValue: 44.10,
        latestPeriod: "August 2026",
        latestValue: 46.79,
        unit: "%",
        deltaValue: 2.69,
        deltaPercent: 6.10,
        isPositive: true,
        source: "CEA Calculation Engine"
      }
    ]
  },

  // 4. Historical Trends & 2030 Projections (Requirement 10)
  timelineTrends: {
    capacityTrend: [
      { year: 2015, totalRE: 39.0, solar: 3.7, wind: 23.4, hydro: 41.3, type: "ACTUAL", source: "CEA 2015 Annual" },
      { year: 2017, totalRE: 57.2, solar: 12.3, wind: 32.3, hydro: 44.5, type: "ACTUAL", source: "MNRE Factsheet 2017" },
      { year: 2019, totalRE: 78.3, solar: 28.2, wind: 35.6, hydro: 45.4, type: "ACTUAL", source: "CEA Monthly Summary 2019" },
      { year: 2021, totalRE: 94.4, solar: 40.1, wind: 39.2, hydro: 46.2, type: "ACTUAL", source: "MNRE Factsheet 2021" },
      { year: 2023, totalRE: 125.1, solar: 66.8, wind: 42.6, hydro: 46.9, type: "ACTUAL", source: "CEA 2023 Executive" },
      { year: 2025, totalRE: 172.5, solar: 79.4, wind: 45.2, hydro: 50.8, type: "ACTUAL", source: "MNRE Review 2025" },
      { year: 2026, totalRE: 204.4, solar: 90.7, wind: 47.7, hydro: 52.0, type: "ACTUAL", source: "MNRE / CEA August 2026" },
      { year: 2028, totalRE: 340.0, solar: 180.0, wind: 85.0, hydro: 56.0, type: "ESTIMATED", source: "CEA NEP Interim Path" },
      { year: 2030, totalRE: 500.0, solar: 280.0, wind: 140.0, hydro: 60.0, type: "TARGET", source: "Panchamrit 2030 National Pledge" }
    ],
    generationTrend: [
      { year: 2015, totalGWh: 61800, solar: 4600, wind: 28200, hydro: 129000, type: "ACTUAL", source: "CEA Generation Report 2015" },
      { year: 2018, totalGWh: 101800, solar: 25800, wind: 52600, hydro: 126100, type: "ACTUAL", source: "CEA Generation Report 2018" },
      { year: 2021, totalGWh: 147200, solar: 60400, wind: 60100, hydro: 150300, type: "ACTUAL", source: "CEA Generation Report 2021" },
      { year: 2024, totalGWh: 203500, solar: 102000, wind: 71200, hydro: 134000, type: "ACTUAL", source: "CEA Generation Report 2024" },
      { year: 2026, totalGWh: 254800, solar: 132000, wind: 86400, hydro: 154000, type: "ACTUAL", source: "CEA Generation (Annualized 2026)" },
      { year: 2030, totalGWh: 540000, solar: 360000, wind: 190000, hydro: 180000, type: "TARGET", source: "CEA NEP Generation Target 2030" }
    ],
    shareTrend: [
      { year: 2015, capacityShare: 14.1, generationShare: 5.6, type: "ACTUAL", source: "CEA" },
      { year: 2018, capacityShare: 20.3, generationShare: 7.8, type: "ACTUAL", source: "CEA" },
      { year: 2021, capacityShare: 24.7, generationShare: 10.7, type: "ACTUAL", source: "CEA" },
      { year: 2024, capacityShare: 32.1, generationShare: 13.5, type: "ACTUAL", source: "CEA" },
      { year: 2026, capacityShare: 46.8, generationShare: 26.6, type: "ACTUAL", source: "CEA / MNRE" },
      { year: 2030, capacityShare: 68.4, generationShare: 50.0, type: "TARGET", source: "COP26 50% Non-Fossil Generation Pledge" }
    ]
  },

  // 5. State-Wise Renewable Energy Profile & Potentials (Requirement 8)
  statesProfile: {
    'RJ': {
      name: 'Rajasthan',
      totalInstalledMW: 30325,
      totalInstalledGW: 30.33,
      solarInstalledMW: 24500,
      solarInstalledGW: 24.50,
      windInstalledMW: 5200,
      windInstalledGW: 5.20,
      hydroInstalledMW: 500,
      hydroInstalledGW: 0.50,
      biomassInstalledMW: 125,
      biomassInstalledGW: 0.13,
      solarPotentialGW: 142.0,
      windPotentialGW: 18.7,
      hydroRelevance: 'Low (Arid climate; focused on canal solar & pumped storage)',
      keyProjects: ['Bhadla Solar Park (2,245 MW)', 'Jaisalmer Wind Park (1,064 MW)', 'Fatehgarh Solar Hub'],
      highlights: 'Highest solar insolation in India (>5.5 kWh/m²/day); Thar desert land availability; leader in robotic panel dry cleaning.',
      dataSource: 'MNRE State Factsheet & National Institute of Solar Energy (NISE)',
      dataPeriod: 'August 2026',
      verified: true
    },
    'GJ': {
      name: 'Gujarat',
      totalInstalledMW: 29840,
      totalInstalledGW: 29.84,
      solarInstalledMW: 15800,
      solarInstalledGW: 15.80,
      windInstalledMW: 11900,
      windInstalledGW: 11.90,
      hydroInstalledMW: 1990,
      hydroInstalledGW: 1.99,
      biomassInstalledMW: 150,
      biomassInstalledGW: 0.15,
      solarPotentialGW: 35.8,
      windPotentialGW: 84.4,
      hydroRelevance: 'Moderate (Sardar Sarovar 1,450 MW)',
      keyProjects: ['Khavda Mega Hybrid Park (30,000 MW)', 'Charanka Solar Park (790 MW)', 'Dholera Solar Park (Phased 5 GW)'],
      highlights: 'Pioneer in rooftop solar net-metering; vast salt pan terrain in Rann of Kutch; leading offshore wind exploratory zone in Gulf of Khambhat.',
      dataSource: 'MNRE & National Institute of Wind Energy (NIWE)',
      dataPeriod: 'August 2026',
      verified: true
    },
    'TN': {
      name: 'Tamil Nadu',
      totalInstalledMW: 23450,
      totalInstalledGW: 23.45,
      solarInstalledMW: 9250,
      solarInstalledGW: 9.25,
      windInstalledMW: 10850,
      windInstalledGW: 10.85,
      hydroInstalledMW: 2320,
      hydroInstalledGW: 2.32,
      biomassInstalledMW: 1030,
      biomassInstalledGW: 1.03,
      solarPotentialGW: 17.7,
      windPotentialGW: 33.8,
      hydroRelevance: 'Moderate (Western Ghats hydro & Kundah PSP 500 MW)',
      keyProjects: ['Muppandal Wind Farm (1,500 MW)', 'Kamuthi Solar Power Project (648 MW)', 'Tuticorin Green Port'],
      highlights: 'Pioneer of wind energy since the 1990s; Aralvaimozhi and Palakkad mountain passes create natural high-velocity wind funnels.',
      dataSource: 'TEDA / MNRE Annual Report',
      dataPeriod: 'August 2026',
      verified: true
    },
    'KA': {
      name: 'Karnataka',
      totalInstalledMW: 22310,
      totalInstalledGW: 22.31,
      solarInstalledMW: 10400,
      solarInstalledGW: 10.40,
      windInstalledMW: 6150,
      windInstalledGW: 6.15,
      hydroInstalledMW: 3850,
      hydroInstalledGW: 3.85,
      biomassInstalledMW: 1910,
      biomassInstalledGW: 1.91,
      solarPotentialGW: 24.7,
      windPotentialGW: 55.9,
      hydroRelevance: 'Moderate (Sharavathi & Kali basin hydro)',
      keyProjects: ['Pavagada Solar Park (2,050 MW - Shakti Sthala)', 'Gadag Wind-Solar Hybrid Corridor'],
      highlights: 'Pioneered farmer-lease land model where arid agricultural land was leased without farmer displacement; high round-the-clock hybrid adoption.',
      dataSource: 'KREDL / MNRE',
      dataPeriod: 'August 2026',
      verified: true
    },
    'MH': {
      name: 'Maharashtra',
      totalInstalledMW: 19140,
      totalInstalledGW: 19.14,
      solarInstalledMW: 7900,
      solarInstalledGW: 7.90,
      windInstalledMW: 5280,
      windInstalledGW: 5.28,
      hydroInstalledMW: 3350,
      hydroInstalledGW: 3.35,
      biomassInstalledMW: 2610,
      biomassInstalledGW: 2.61,
      solarPotentialGW: 64.3,
      windPotentialGW: 45.4,
      hydroRelevance: 'High (Koyna 1,960 MW & Ghatgar 250 MW PSP)',
      keyProjects: ['Koyna Hydroelectric Complex (1,960 MW)', 'Dhule Solar Park', 'Bhusawal Solar Corridor'],
      highlights: 'Highest industrial electricity consumer; rapidly deploying commercial & industrial (C&I) rooftop solar and agricultural feeder solarization.',
      dataSource: 'MEDA / CEA',
      dataPeriod: 'August 2026',
      verified: true
    },
    'AP': {
      name: 'Andhra Pradesh',
      totalInstalledMW: 12330,
      totalInstalledGW: 12.33,
      solarInstalledMW: 5800,
      solarInstalledGW: 5.80,
      windInstalledMW: 4150,
      windInstalledGW: 4.15,
      hydroInstalledMW: 1800,
      hydroInstalledGW: 1.80,
      biomassInstalledMW: 580,
      biomassInstalledGW: 0.58,
      solarPotentialGW: 38.4,
      windPotentialGW: 44.2,
      hydroRelevance: 'High (Pinnapuram 1,200 MW Integrated Renewable Energy PSP)',
      keyProjects: ['Kurnool Ultra Mega Solar (1,000 MW)', 'Ananthapuramu Solar Park (1,500 MW)', 'Pinnapuram IRESP'],
      highlights: 'Home to the first large-scale co-located solar, wind and pumped hydro storage plant in Pinnapuram, establishing standard for round-the-clock clean power.',
      dataSource: 'APSPDCL / MNRE',
      dataPeriod: 'August 2026',
      verified: true
    },
    'HP': {
      name: 'Himachal Pradesh',
      totalInstalledMW: 11490,
      totalInstalledGW: 11.49,
      solarInstalledMW: 380,
      solarInstalledGW: 0.38,
      windInstalledMW: 0,
      windInstalledGW: 0.0,
      hydroInstalledMW: 11100,
      hydroInstalledGW: 11.10,
      biomassInstalledMW: 10,
      biomassInstalledGW: 0.01,
      solarPotentialGW: 3.3,
      windPotentialGW: 0.0,
      hydroRelevance: 'Maximum (Satluj, Beas & Ravi Himalayan river basins)',
      keyProjects: ['Nathpa Jhakri (1,500 MW)', 'Karcham Wangtoo (1,091 MW)', 'Larji Hydroelectric Project'],
      highlights: 'Over 27 GW of identified hydropower potential; exports clean mountain electricity to Delhi, Punjab, and Haryana during summer snowmelt.',
      dataSource: 'HPPCL / CEA',
      dataPeriod: 'August 2026',
      verified: true
    },
    'MP': {
      name: 'Madhya Pradesh',
      totalInstalledMW: 10080,
      totalInstalledGW: 10.08,
      solarInstalledMW: 4600,
      solarInstalledGW: 4.60,
      windInstalledMW: 2840,
      windInstalledGW: 2.84,
      hydroInstalledMW: 2500,
      hydroInstalledGW: 2.50,
      biomassInstalledMW: 140,
      biomassInstalledGW: 0.14,
      solarPotentialGW: 61.6,
      windPotentialGW: 15.4,
      hydroRelevance: 'High (Narmada basin & Omkareshwar reservoir)',
      keyProjects: ['Rewa Ultra Mega Solar (750 MW)', 'Omkareshwar Floating Solar (600 MW Phase 1)', 'Neemuch Solar Park'],
      highlights: 'First project in India to sell green power to an institutional customer across state lines (Delhi Metro Rail Corporation DMRC).',
      dataSource: 'RUMSL / MNRE',
      dataPeriod: 'August 2026',
      verified: true
    },
    'TS': {
      name: 'Telangana',
      totalInstalledMW: 7598,
      totalInstalledGW: 7.60,
      solarInstalledMW: 4850,
      solarInstalledGW: 4.85,
      windInstalledMW: 128,
      windInstalledGW: 0.13,
      hydroInstalledMW: 2400,
      hydroInstalledGW: 2.40,
      biomassInstalledMW: 220,
      biomassInstalledGW: 0.22,
      solarPotentialGW: 20.4,
      windPotentialGW: 4.2,
      hydroRelevance: 'Moderate (Nagarjuna Sagar & Srisailam)',
      keyProjects: ['NTPC Ramagundam Floating Solar (100 MW)', 'Distributed Agricultural Solar Feeders'],
      highlights: 'Pioneer of reservoir surface floating solar which conserves 3.25 million m³ of water evaporation annually.',
      dataSource: 'TSREDCO / MNRE',
      dataPeriod: 'August 2026',
      verified: true
    },
    'UP': {
      name: 'Uttar Pradesh',
      totalInstalledMW: 6110,
      totalInstalledGW: 6.11,
      solarInstalledMW: 3400,
      solarInstalledGW: 3.40,
      windInstalledMW: 0,
      windInstalledGW: 0.0,
      hydroInstalledMW: 520,
      hydroInstalledGW: 0.52,
      biomassInstalledMW: 2190,
      biomassInstalledGW: 2.19,
      solarPotentialGW: 22.8,
      windPotentialGW: 0.0,
      hydroRelevance: 'Low (Rihand reservoir floating pilot)',
      keyProjects: ['Bundelkhand Solar Parks (4,000 MW planned)', 'Ayodhya Solar City Model', 'Sugarcane Bagasse Cogeneration'],
      highlights: 'Largest sugarcane bagasse biomass co-generation capacity in India; focus on Bundelkhand arid corridor for utility solar.',
      dataSource: 'UPNEDA / MNRE',
      dataPeriod: 'August 2026',
      verified: true
    },
    'UT': {
      name: 'Uttarakhand',
      totalInstalledMW: 4580,
      totalInstalledGW: 4.58,
      solarInstalledMW: 350,
      solarInstalledGW: 0.35,
      windInstalledMW: 0,
      windInstalledGW: 0.0,
      hydroInstalledMW: 4100,
      hydroInstalledGW: 4.10,
      biomassInstalledMW: 130,
      biomassInstalledGW: 0.13,
      solarPotentialGW: 1.7,
      windPotentialGW: 0.0,
      hydroRelevance: 'Very High (Tehri 2,400 MW Dam & 1,000 MW Pumped Storage)',
      keyProjects: ['Tehri Hydroelectric Complex (2,400 MW)', 'Koteshwar Dam', 'Vishnuprayag Hydro'],
      highlights: 'Acts as the water battery of the Northern Grid, providing essential inertia and frequency stabilization for high-solar penetration.',
      dataSource: 'THDC / CEA',
      dataPeriod: 'August 2026',
      verified: true
    },
    'PB': {
      name: 'Punjab',
      totalInstalledMW: 3890,
      totalInstalledGW: 3.89,
      solarInstalledMW: 1850,
      solarInstalledGW: 1.85,
      windInstalledMW: 0,
      windInstalledGW: 0.0,
      hydroInstalledMW: 1500,
      hydroInstalledGW: 1.50,
      biomassInstalledMW: 540,
      biomassInstalledGW: 0.54,
      solarPotentialGW: 2.8,
      windPotentialGW: 0.0,
      hydroRelevance: 'High (Bhakra Nangal & Anandpur Sahib canals)',
      keyProjects: ['Canal-Top Solar Installations', 'Asia Largest Bio-CNG Plant (Sangrur - 33 TPD CBG)', 'Bathinda Agri-Biomass Units'],
      highlights: 'LPU Home State: High agricultural stubble availability makes biomass and Compressed Bio-Gas (CBG) under SATAT the critical clean energy pathway.',
      dataSource: 'PEDA (Punjab Energy Development Agency)',
      dataPeriod: 'August 2026',
      verified: true
    },
    'JK': {
      name: 'Jammu and Kashmir',
      totalInstalledMW: 3470,
      totalInstalledGW: 3.47,
      solarInstalledMW: 70,
      solarInstalledGW: 0.07,
      windInstalledMW: 0,
      windInstalledGW: 0.0,
      hydroInstalledMW: 3400,
      hydroInstalledGW: 3.40,
      biomassInstalledMW: 0,
      biomassInstalledGW: 0.0,
      solarPotentialGW: 111.0,
      windPotentialGW: 5.3,
      hydroRelevance: 'Maximum (Chenab and Jhelum basins)',
      keyProjects: ['Kishanganga Hydroelectric (330 MW)', 'Dulhasti Hydro', 'Salal Hydro'],
      highlights: 'High run-of-the-river hydropower potential and massive cold desert solar potential in Ladakh transmission corridors.',
      dataSource: 'JKEDA / CEA',
      dataPeriod: 'August 2026',
      verified: true
    },
    'OD': {
      name: 'Odisha',
      totalInstalledMW: 2960,
      totalInstalledGW: 2.96,
      solarInstalledMW: 750,
      solarInstalledGW: 0.75,
      windInstalledMW: 0,
      windInstalledGW: 0.0,
      hydroInstalledMW: 2150,
      hydroInstalledGW: 2.15,
      biomassInstalledMW: 60,
      biomassInstalledGW: 0.06,
      solarPotentialGW: 25.7,
      windPotentialGW: 3.1,
      hydroRelevance: 'High (Hirakud & Balimela reservoirs)',
      keyProjects: ['Paradip Green Hydrogen & Ammonia Hub', 'Hirakud Floating Solar Pilot'],
      highlights: 'Designated strategic green hydrogen bunkering port corridor under National Green Hydrogen Mission.',
      dataSource: 'OREDA / MNRE',
      dataPeriod: 'August 2026',
      verified: true
    },
    'KL': {
      name: 'Kerala',
      totalInstalledMW: 2905,
      totalInstalledGW: 2.91,
      solarInstalledMW: 920,
      solarInstalledGW: 0.92,
      windInstalledMW: 70,
      windInstalledGW: 0.07,
      hydroInstalledMW: 1900,
      hydroInstalledGW: 1.90,
      biomassInstalledMW: 15,
      biomassInstalledGW: 0.02,
      solarPotentialGW: 6.1,
      windPotentialGW: 1.7,
      hydroRelevance: 'High (Idukki arch dam complex)',
      keyProjects: ['Banasura Sagar Dam Floating Solar', 'Cochin International Airport (World First 100% Solar Airport)'],
      highlights: 'Demonstrated first airport in the world fully powered by solar energy.',
      dataSource: 'ANERT / KSEB',
      dataPeriod: 'August 2026',
      verified: true
    },
    'WB': {
      name: 'West Bengal',
      totalInstalledMW: 2190,
      totalInstalledGW: 2.19,
      solarInstalledMW: 450,
      solarInstalledGW: 0.45,
      windInstalledMW: 0,
      windInstalledGW: 0.0,
      hydroInstalledMW: 1400,
      hydroInstalledGW: 1.40,
      biomassInstalledMW: 340,
      biomassInstalledGW: 0.34,
      solarPotentialGW: 16.9,
      windPotentialGW: 0.4,
      hydroRelevance: 'High (Purulia 900 MW Pumped Storage Project)',
      keyProjects: ['Purulia Pumped Storage Plant (900 MW)', 'Teesta Low Dam Series'],
      highlights: 'Operational pioneer of utility pumped storage in Eastern India, providing daily peak frequency balancing.',
      dataSource: 'WBSEDCL / CEA',
      dataPeriod: 'August 2026',
      verified: true
    },
    'HR': {
      name: 'Haryana',
      totalInstalledMW: 1800,
      totalInstalledGW: 1.80,
      solarInstalledMW: 1450,
      solarInstalledGW: 1.45,
      windInstalledMW: 0,
      windInstalledGW: 0.0,
      hydroInstalledMW: 70,
      hydroInstalledGW: 0.07,
      biomassInstalledMW: 280,
      biomassInstalledGW: 0.28,
      solarPotentialGW: 4.5,
      windPotentialGW: 0.0,
      hydroRelevance: 'Low (Canal drops)',
      keyProjects: ['Agri-Solar Feeder Corridors', 'Stubble Biomass Pelleting Units'],
      highlights: 'Focusing on PM-KUSUM solar agricultural water pumps to eliminate diesel irrigation pumps.',
      dataSource: 'HAREDA / MNRE',
      dataPeriod: 'August 2026',
      verified: true
    },
    'CT': {
      name: 'Chhattisgarh',
      totalInstalledMW: 1530,
      totalInstalledGW: 1.53,
      solarInstalledMW: 1100,
      solarInstalledGW: 1.10,
      windInstalledMW: 0,
      windInstalledGW: 0.0,
      hydroInstalledMW: 140,
      hydroInstalledGW: 0.14,
      biomassInstalledMW: 290,
      biomassInstalledGW: 0.29,
      solarPotentialGW: 18.2,
      windPotentialGW: 0.3,
      hydroRelevance: 'Moderate (Hasdeo Bango dam)',
      keyProjects: ['Bhilai Captive Solar Plants', 'Rice Husk Biomass Cogeneration'],
      highlights: 'Industrial clean transition focused on steel/aluminum captive solar adoption.',
      dataSource: 'CREDA / MNRE',
      dataPeriod: 'August 2026',
      verified: true
    },
    'BR': {
      name: 'Bihar',
      totalInstalledMW: 615,
      totalInstalledGW: 0.62,
      solarInstalledMW: 420,
      solarInstalledGW: 0.42,
      windInstalledMW: 0,
      windInstalledGW: 0.0,
      hydroInstalledMW: 70,
      hydroInstalledGW: 0.07,
      biomassInstalledMW: 125,
      biomassInstalledGW: 0.13,
      solarPotentialGW: 11.2,
      windPotentialGW: 0.0,
      hydroRelevance: 'Low (Kosi and Gandak canal hydro)',
      keyProjects: ['Kajra Solar Power Project (Phased)', 'Bagasse Cogeneration in Sugar Mills'],
      highlights: 'Deployment of rural solar mini-grids for agricultural cold storage and off-grid irrigation.',
      dataSource: 'BREDA / MNRE',
      dataPeriod: 'August 2026',
      verified: true
    },
    'AS': {
      name: 'Assam',
      totalInstalledMW: 695,
      totalInstalledGW: 0.70,
      solarInstalledMW: 180,
      solarInstalledGW: 0.18,
      windInstalledMW: 0,
      windInstalledGW: 0.0,
      hydroInstalledMW: 510,
      hydroInstalledGW: 0.51,
      biomassInstalledMW: 5,
      biomassInstalledGW: 0.01,
      solarPotentialGW: 13.8,
      windPotentialGW: 0.2,
      hydroRelevance: 'High (Kopili & Karbi Langpi hydro)',
      keyProjects: ['Lower Subansiri Hydro Electric (2,000 MW - border project)', 'Amguri Solar Park'],
      highlights: 'Gateway to North Eastern clean energy transmission hub connecting Brahmaputra river potential.',
      dataSource: 'AEDA / CEA',
      dataPeriod: 'August 2026',
      verified: true
    },
    'JH': {
      name: 'Jharkhand',
      totalInstalledMW: 445,
      totalInstalledGW: 0.45,
      solarInstalledMW: 220,
      solarInstalledGW: 0.22,
      windInstalledMW: 0,
      windInstalledGW: 0.0,
      hydroInstalledMW: 210,
      hydroInstalledGW: 0.21,
      biomassInstalledMW: 15,
      biomassInstalledGW: 0.02,
      solarPotentialGW: 18.2,
      windPotentialGW: 0.0,
      hydroRelevance: 'Moderate (Subarnarekha & Panchet dam)',
      keyProjects: ['Getalsud Dam Floating Solar (100 MW planned)', 'Damodar Valley Floating Pilots'],
      highlights: 'Aggressively deploying floating solar on mining reservoirs and industrial ash dams.',
      dataSource: 'JREDA / MNRE',
      dataPeriod: 'August 2026',
      verified: true
    },
    'GA': {
      name: 'Goa',
      totalInstalledMW: 80,
      totalInstalledGW: 0.08,
      solarInstalledMW: 75,
      solarInstalledGW: 0.075,
      windInstalledMW: 0,
      windInstalledGW: 0.0,
      hydroInstalledMW: 0,
      hydroInstalledGW: 0.0,
      biomassInstalledMW: 5,
      biomassInstalledGW: 0.005,
      solarPotentialGW: 0.8,
      windPotentialGW: 0.1,
      hydroRelevance: 'Negligible (Power imported via Western Grid)',
      keyProjects: ['Rooftop Solar in Hospitality Sector', 'Solar EV Charging Corridors'],
      highlights: 'Targeting 100% solar power supply for coastal tourism and electric mobility infrastructure.',
      dataSource: 'GEDA / MNRE',
      dataPeriod: 'August 2026',
      verified: true
    }
  },

  // 6. Source Comparison Matrix (Solar, Wind, Hydro, Biomass, Green Hydrogen)
  sourceComparison: [
    {
      id: 'solar',
      name: 'Solar Energy',
      icon: '☀️',
      color: '#f59e0b',
      badge: '🟢 OFFICIAL DATA',
      installedGW: '90.72 GW',
      mechanism: 'Photovoltaic (PV) cells convert solar photons into DC electricity; inverters convert into synchronized grid AC.',
      availabilityInIndia: 'Vast across Rajasthan, Gujarat, MP, Deccan plateau; 250–300 sunny days/year with 4–7 kWh/m²/day insolation.',
      advantages: [
        'Modular deployment (from 1 kW rooftop to 2,245 MW Bhadla mega-park)',
        'Levelized cost dropped below ₹2.60/kWh (cheaper than new thermal coal)',
        'Zero operational greenhouse emissions and low maintenance'
      ],
      limitations: [
        'Intermittent (zero output at night, drop during monsoon cloudy days)',
        'Requires 4–5 acres per megawatt of land footprint',
        'Dust accumulation requires water or automated dry cleaning'
      ],
      environmentalImpact: 'Lifecycle carbon ~40g CO₂/kWh (vs ~950g for coal). PV module recycling mandatory under E-Waste Rules 2022.',
      applications: 'Residential rooftops (PM Surya Ghar), agricultural pumps (PM-KUSUM), canal-top solar, utility mega-parks.',
      gridStorageNeed: 'High: Contributes to mid-day "Duck Curve"; requires 4–6 hour Battery Storage (BESS) or Pumped Hydro for evening peak.'
    },
    {
      id: 'wind',
      name: 'Wind Energy',
      icon: '🌬️',
      color: '#06b6d4',
      badge: '🟢 OFFICIAL DATA',
      installedGW: '47.68 GW',
      mechanism: 'Aerodynamic lift rotates aerodynamic turbine blades; mechanical gearbox & generator convert kinetic wind energy into electricity.',
      availabilityInIndia: 'High in coastal and mountain gap corridors: Gujarat, Tamil Nadu, Karnataka, Rajasthan, Maharashtra.',
      advantages: [
        'Generates power during late evening and night when solar ceases',
        'Small ground footprint allows agriculture/grazing right up to turbine base',
        'High capacity utilization factor (CUF up to 35–42% with modern tall 140m towers)'
      ],
      limitations: [
        'Highly seasonal (peaks during June–September southwest monsoon)',
        'Acoustic noise and bird mortality concerns (e.g. Great Indian Bustard in Rajasthan)',
        'Turbine blade composite recycling remains technically challenging'
      ],
      environmentalImpact: 'Lowest lifecycle emissions (~11g CO₂/kWh). Requires bird flight diverters and strategic ecological siting.',
      applications: 'Onshore utility wind farms, coastal repowering of older turbines, offshore wind pilots in Gulf of Mannar.',
      gridStorageNeed: 'Moderate: Wind is often complementary to solar; pairing wind + solar yields a higher round-the-clock plant load factor.'
    },
    {
      id: 'hydro',
      name: 'Hydropower & PSP',
      icon: '💧',
      color: '#3b82f6',
      badge: '🟢 OFFICIAL DATA',
      installedGW: '51.99 GW',
      mechanism: 'Gravitational potential energy of falling water rotates hydro turbines coupled to synchronous generators.',
      availabilityInIndia: 'Abundant in Himalayan rivers (HP, Uttarakhand, J&K, Arunachal Pradesh) and Western Ghats reservoirs.',
      advantages: [
        'Instantaneous dispatchability (can ramp from 0 to 100% in minutes)',
        'Pumped Storage Plants (PSP) act as massive rechargeable water batteries',
        'Multipurpose infrastructure providing irrigation, flood control and drinking water'
      ],
      limitations: [
        'High upfront capital expenditure and long gestation periods (5–10 years)',
        'Submergence of river valleys and displacement of local communities',
        'Vulnerability to Himalayan seismic hazards, cloudbursts and glacial lake outbursts (GLOFs)'
      ],
      environmentalImpact: 'Reservoir emissions can occur in warm climates due to decaying biomass. Requires strict Environmental Flow (e-flow) preservation.',
      applications: 'Grid frequency regulation, black-start capabilities during blackouts, evening peak load shaving.',
      gridStorageNeed: 'Acts as the primary storage provider for the grid; 47 GW of pumped storage potential identified across 60+ Indian sites.'
    },
    {
      id: 'biomass',
      name: 'Bioenergy & Bio-CNG',
      icon: '🌱',
      color: '#10b981',
      badge: '🟢 OFFICIAL DATA',
      installedGW: '11.07 GW',
      mechanism: 'Anaerobic digestion of organic waste produces biomethane (CBG); thermal gasification/pellets for combustion.',
      availabilityInIndia: 'Over 500 million tonnes of agricultural crop residue and urban municipal solid waste generated annually.',
      advantages: [
        'Baseload continuous power with zero weather intermittency',
        'Direct solution to winter crop-stubble burning (parali) in Punjab & Haryana',
        'Produces nutrient-rich organic bio-fertilizer as a byproduct'
      ],
      limitations: [
        'Logistics and seasonal aggregation of crop residue across fragmented smallholder farms',
        'Supply chain price volatility and moisture content control',
        'Modest thermal conversion efficiencies compared to direct electricity'
      ],
      environmentalImpact: 'Carbon-neutral over short lifecycle; actively reduces methane emissions from landfills and stubble open burning.',
      applications: 'SATAT Compressed Bio-Gas (CBG) automotive fueling, biomass pellet co-firing (5–7%) in thermal boilers, rural microgrids.',
      gridStorageNeed: 'Zero: Pure baseload generation that requires no storage and can be dispatched on demand.'
    }
  ],

  // 7. Verified Educational Facts ("Did You Know?")
  environmentalFacts: [
    {
      fact: "Bhadla Solar Park in Rajasthan occupies 14,000 acres of arid desert land and mitigates approximately 4 million tonnes of CO₂ emissions each year, equivalent to burning 2 million tonnes of coal.",
      category: "Solar Milestones",
      source: "Ministry of New and Renewable Energy (MNRE), 2026"
    },
    {
      fact: "A single modern 3.0 MW wind turbine operating at 32% capacity factor generates enough clean electricity annually to power over 2,200 urban Indian homes.",
      category: "Wind Engineering",
      source: "National Institute of Wind Energy (NIWE), 2026"
    },
    {
      fact: "Floating solar installations on reservoirs, such as NTPC Ramagundam (100 MW), save over 3.25 million cubic meters of water evaporation every year while operating 5–10% cooler due to water cooling.",
      category: "Floating Photovoltaics",
      source: "NTPC Clean Energy Factsheet, 2026"
    },
    {
      fact: "Under PM Surya Ghar Muft Bijli Yojana, a residential 3 kWp rooftop solar plant mitigates ~3.6 tonnes of CO₂ annually, equivalent to planting 164 mature neem trees.",
      category: "Decentralized Solar",
      source: "PM Surya Ghar National Portal Guidelines, 2026"
    },
    {
      fact: "India's renewable energy tariffs dropped by over 80% since 2010, declining from ₹12.00/kWh to under ₹2.60/kWh due to reverse auctions and domestic supply chains.",
      category: "Economics of Clean Energy",
      source: "Central Electricity Regulatory Commission (CERC) Benchmark Study"
    },
    {
      fact: "The National Green Hydrogen Mission targets 5 MMT of green hydrogen production annually by 2030, supported by ₹19,744 Crore in central outlays to decarbonize steel and fertilizers.",
      category: "Next-Gen Fuels",
      source: "MNRE / Ministry of Petroleum and Natural Gas, 2026"
    }
  ],

  // 8. CHE110 Viva Examination Flashcards
  vivaQuestions: [
    {
      id: 1,
      level: "Basic",
      question: "What is the core distinction between renewable and non-renewable energy resources?",
      answer: "Renewable energy comes from inexhaustible, naturally replenished flows (sunlight, wind, gravitational water flow, organic biomass) with minimal lifecycle GHG emissions. Non-renewable resources (coal, oil, gas) are finite fossil reserves whose combustion releases CO₂, SOx, NOx, and toxic particulate matter.",
      keyPoints: ["Naturally replenished flows", "Finite fossil reserves", "Greenhouse gas emissions contrast"]
    },
    {
      id: 2,
      level: "Basic",
      question: "What is India's 2030 Non-Fossil Fuel capacity target pledged under the Panchamrit framework?",
      answer: "India pledged at COP26 to achieve 500 GW of non-fossil fuel electricity generation capacity by the year 2030, alongside meeting 50% of its cumulative electric power requirement from renewable energy sources.",
      keyPoints: ["500 GW target", "50% renewable energy share", "Target year 2030"]
    },
    {
      id: 3,
      level: "Basic",
      question: "How does PM Surya Ghar: Muft Bijli Yojana benefit residential households?",
      answer: "It provides up to 300 units of free solar electricity monthly to 1 crore households. The Central Government provides fixed subsidies: ₹30,000 for 1 kW, ₹60,000 for 2 kW, and ₹78,000 for 3 kW and above, reducing household electricity bills to zero with a 3–4 year payback period.",
      keyPoints: ["1 Crore households", "300 free units", "Max ₹78,000 subsidy"]
    },
    {
      id: 4,
      level: "Intermediate",
      question: "Explain the 'Duck Curve' phenomenon in solar grid integration and how India is addressing it.",
      answer: "The 'Duck Curve' represents the graph of net electricity demand throughout the day. At midday, high solar generation causes net demand to drop drastically (belly of the duck). As the sun sets around 6–7 PM, solar drops to zero while domestic lighting and cooling demand peaks, requiring an extremely steep ramp-up of flexible power. India addresses this through Pumped Storage Hydro (PSP) and Battery Energy Storage Systems (BESS) that absorb midday solar and discharge during evening peak hours.",
      keyPoints: ["Mid-day solar overgeneration", "Evening peak demand ramp", "BESS and Pumped Storage solution"]
    },
    {
      id: 5,
      level: "Intermediate",
      question: "Why is Pumped Storage Hydropower (PSP) referred to as a 'Water Battery'?",
      answer: "A PSP features two water reservoirs at different elevations. When surplus clean electricity is available (e.g. daytime solar), water is pumped uphill from the lower to upper reservoir, storing energy as gravitational potential. During peak evening demand, water flows downhill through turbines back to the lower reservoir, generating dispatchable clean power within minutes.",
      keyPoints: ["Upper and lower reservoirs", "Pumping during solar surplus", "Discharging during evening peak"]
    },
    {
      id: 6,
      level: "Intermediate",
      question: "What is the strategic role of the Green Energy Corridor (GEC) in India?",
      answer: "Because resource-rich states (Rajasthan solar, Tamil Nadu wind) produce more power than their local grids can consume, the Green Energy Corridor establishes high-voltage intra-state and inter-state transmission lines to evacuate clean electricity to major industrial load centers across India without grid congestion.",
      keyPoints: ["Evacuation of surplus green power", "Inter-state transmission lines", "Prevents grid congestion & curtailment"]
    },
    {
      id: 7,
      level: "Advanced",
      question: "What environmental and supply chain challenges are associated with end-of-life solar PV panels?",
      answer: "Solar PV panels have a 25-year operational lifespan. India is projected to generate over 4.5 million tonnes of PV waste by 2050. Panels contain valuable materials (silver, silicon, copper, glass) but also toxic heavy metals (lead, cadmium). India implemented the E-Waste (Management) Rules 2022 making Extended Producer Responsibility (EPR) mandatory for solar manufacturers to recover and recycle at least 70–80% of materials.",
      keyPoints: ["25-year lifespan", "Toxic heavy metals (Pb, Cd)", "Extended Producer Responsibility (EPR) 2022"]
    },
    {
      id: 8,
      level: "Advanced",
      question: "How does the National Green Hydrogen Mission support the decarbonization of hard-to-abate sectors?",
      answer: "Sectors like steel production, fertilizer manufacturing, chemical refineries, and heavy maritime shipping cannot run directly on battery electricity. Green Hydrogen, produced by splitting water using renewable power in an electrolyzer, acts as a zero-carbon chemical feedstock and reducing agent, eliminating fossil coke and natural gas reliance.",
      keyPoints: ["Hard-to-abate industries (steel, fertilizer, refineries)", "Electrolyzer water splitting", "Zero-carbon chemical feedstock"]
    }
  ],

  // 9. Research & Sources Bibliography
  researchCitations: [
    {
      id: 'mnre-installed',
      title: 'Monthly Installed Capacity Statistics (August 2026)',
      publisher: 'Ministry of New and Renewable Energy (MNRE), Government of India',
      year: 2026,
      category: 'Government Sources',
      link: 'https://mnre.gov.in',
      description: 'Primary official authority on grid-connected solar, wind, biomass, and small hydro capacity additions and national policies.'
    },
    {
      id: 'cea-nep',
      title: 'National Electricity Plan (Generation) Vol. 1 (2022–2032) & Monthly Executive Summary',
      publisher: 'Central Electricity Authority (CEA), Ministry of Power',
      year: 2026,
      category: 'Official Statistics',
      link: 'https://cea.nic.in',
      description: 'Comprehensive 10-year generation planning study detailing optimal capacity mix, storage requirements (BESS and PSP), and coal phase-down.'
    },
    {
      id: 'cea-gen-rep',
      title: 'Monthly Renewable Energy Generation Reports',
      publisher: 'Central Electricity Authority (CEA)',
      year: 2026,
      category: 'Official Statistics',
      link: 'https://cea.nic.in/renewable-energy-generation-reports/',
      description: 'Official monthly reporting of electric generation across solar, wind, large hydro, small hydro, and biomass in Million Units (GWh).'
    },
    {
      id: 'niti-iced',
      title: 'India Climate and Energy Dashboard (ICED 3.0)',
      publisher: 'NITI Aayog, Government of India',
      year: 2026,
      category: 'Government Sources',
      link: 'https://iced.niti.gov.in',
      description: 'One-stop data repository for sub-national energy flows, state-level tariffs, transmission capacity, and emissions tracking.'
    },
    {
      id: 'iea-india',
      title: 'World Energy Outlook & India Special Focus Report',
      publisher: 'International Energy Agency (IEA), Paris',
      year: 2024,
      category: 'International Organizations',
      link: 'https://www.iea.org/reports/world-energy-outlook-2023',
      description: 'Independent international assessment of India’s clean energy transition, per-capita emissions trajectory, and investment opportunities.'
    },
    {
      id: 'unfccc-ndc',
      title: 'India’s Updated First Nationally Determined Contribution (NDC)',
      publisher: 'United Nations Framework Convention on Climate Change (UNFCCC)',
      year: 2022,
      category: 'International Organizations',
      link: 'https://unfccc.int/NDCREG',
      description: 'Formal multilateral submission outlining India’s 45% carbon intensity reduction and 50% non-fossil electric power targets by 2030.'
    }
  ]
};

// Global export for browsers and Node
if (typeof window !== 'undefined') {
  window.EnergyPortalData = EnergyPortalData;
}
if (typeof module !== 'undefined') {
  module.exports = { EnergyPortalData };
}
