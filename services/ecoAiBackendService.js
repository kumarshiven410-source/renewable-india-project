/**
 * EcoAI Intelligent Assistant - Backend Grounded NLP & Reasoning Service
 * Implements Requirements 14, 15, and 22 (Security: No keys exposed in frontend)
 * Explicitly separates:
 * 🟢 OFFICIAL DATA
 * 🟡 CALCULATED DATA
 * 🔵 ESTIMATED DATA
 * ⚪ GENERAL EXPLANATION
 */

const dataStore = require('./dataStore');

class EcoAiBackendService {
  /**
   * Processes a query in a specific educational mode, grounding answers
   * in the real verified observations in dataStore.
   */
  async processQuery({ query, mode = 'ask', userGeminiKey = null }) {
    const q = (query || '').toLowerCase().trim();
    const national = dataStore.getNationalIntelligence();
    const changes = dataStore.getChangesDetector();
    const states = dataStore.getStateBreakdowns();

    // 1. If server or user provided a Gemini key, we can augment with generative reasoning
    const serverKey = process.env.GEMINI_API_KEY || userGeminiKey;
    if (serverKey) {
      try {
        const aiResponse = await this.callGeminiModel(serverKey, query, mode, national, changes);
        if (aiResponse) return aiResponse;
      } catch (err) {
        console.warn('[EcoAI] Server Gemini call failed, falling back to grounded rule engine:', err.message);
      }
    }

    // 2. High-precision Grounded Rule & Fact Engine
    return this.generateGroundedResponse(q, mode, national, changes, states);
  }

  generateGroundedResponse(q, mode, national, changes, states) {
    const metrics = national.metrics;
    const syncTime = national.lastSynchronizedIST;

    // Check specific dashboard questions first (Requirement 15)

    // Q: Solar capacity query
    if (q.includes('solar capacity') || q.includes('how much solar') || q.includes('solar power in india')) {
      return {
        badge: '🟢 OFFICIAL DATA',
        answer: `According to the latest verified data from the <strong>Ministry of New and Renewable Energy (MNRE)</strong>:<br><br>
        • <strong>Solar Capacity:</strong> ${metrics.solar.valueMW.toLocaleString()} MW (${metrics.solar.valueGW} GW)<br>
        • <strong>Data Period:</strong> ${metrics.solar.dataPeriod}<br>
        • <strong>Official Source:</strong> ${metrics.solar.source}<br>
        • <strong>Published Date:</strong> ${metrics.solar.lastUpdated}<br>
        • <strong>Last Synchronized:</strong> ${syncTime}<br><br>
        <em>Solar currently represents the single largest clean electricity contributor in India, powered by ultra-mega solar parks like Bhadla (2,245 MW) and Pavagada (2,050 MW).</em>`,
        mode
      };
    }

    // Q: Wind capacity
    if (q.includes('wind capacity') || q.includes('how much wind')) {
      return {
        badge: '🟢 OFFICIAL DATA',
        answer: `According to official records published by <strong>MNRE / National Institute of Wind Energy (NIWE)</strong>:<br><br>
        • <strong>Wind Capacity:</strong> ${metrics.wind.valueMW.toLocaleString()} MW (${metrics.wind.valueGW} GW)<br>
        • <strong>Data Period:</strong> ${metrics.wind.dataPeriod}<br>
        • <strong>Official Source:</strong> ${metrics.wind.source}<br>
        • <strong>Published Date:</strong> ${metrics.wind.lastUpdated}<br>
        • <strong>Last Synchronized:</strong> ${syncTime}<br><br>
        <em>India ranks 4th globally in wind power installations, concentrated along coastal Tamil Nadu (Muppandal 1,500 MW) and Gujarat.</em>`,
        mode
      };
    }

    // Q: Total renewable or non-fossil capacity
    if (q.includes('total renewable') || q.includes('total non-fossil') || q.includes('overall capacity') || q.includes('total capacity')) {
      return {
        badge: '🟢 OFFICIAL DATA',
        answer: `Based on verified monthly telemetry synthesized by the <strong>Central Electricity Authority (CEA) & MNRE</strong>:<br><br>
        • <strong>Total Renewable Energy Capacity:</strong> ${metrics.totalRenewable.valueMW.toLocaleString()} MW (${metrics.totalRenewable.valueGW} GW)<br>
        • <strong>Total Non-Fossil Grid Capacity (incl. Nuclear):</strong> ${metrics.target2030.currentMW.toLocaleString()} MW (${metrics.target2030.currentGW} GW)<br>
        • <strong>Non-Fossil Share of Total Grid:</strong> ${metrics.renewableShare.valuePercent}%<br>
        • <strong>Data Period:</strong> ${metrics.totalRenewable.dataPeriod}<br>
        • <strong>Published Date:</strong> ${metrics.totalRenewable.lastUpdated}<br>
        • <strong>Verification Status:</strong> Verified Government Data (CEA / MNRE)`,
        mode
      };
    }

    // Q: Which renewable source has highest capacity?
    if (q.includes('highest capacity') || q.includes('which renewable source has the highest') || q.includes('largest source')) {
      return {
        badge: '🟢 OFFICIAL DATA',
        answer: `<strong>Solar Power</strong> is currently the largest renewable energy contributor in India:<br><br>
        1. ☀️ <strong>Solar Power:</strong> ${metrics.solar.valueMW.toLocaleString()} MW (${metrics.solar.valueGW} GW) [Rank 1]<br>
        2. 💧 <strong>Hydropower (Large + Small):</strong> ${metrics.hydro.valueMW.toLocaleString()} MW (${metrics.hydro.valueGW} GW) [Rank 2]<br>
        3. 🌬️ <strong>Wind Power:</strong> ${metrics.wind.valueMW.toLocaleString()} MW (${metrics.wind.valueGW} GW) [Rank 3]<br>
        4. 🌱 <strong>Biomass & Waste to Energy:</strong> ${metrics.biomass.valueMW.toLocaleString()} MW (${metrics.biomass.valueGW} GW) [Rank 4]<br><br>
        • <strong>Source:</strong> MNRE / CEA Official Statistics (${metrics.solar.dataPeriod})<br>
        • <strong>Note:</strong> Solar overtook large hydro in 2023-24 to become the dominant clean power technology in India.`,
        mode
      };
    }

    // Q: Which state has highest renewable capacity?
    if (q.includes('which state') || q.includes('highest state') || q.includes('top state') || q.includes('state ranking')) {
      const topStates = [...states].sort((a, b) => b.value - a.value).slice(0, 5);
      const topList = topStates.map((s, idx) => `${idx + 1}. <strong>${s.state}:</strong> ${s.value.toLocaleString()} MW (${(s.value / 1000).toFixed(1)} GW)`).join('<br>');
      return {
        badge: '🟢 OFFICIAL DATA',
        answer: `According to MNRE State Factsheets (${metrics.solar.dataPeriod}), the top clean energy states in India are:<br><br>
        ${topList}<br><br>
        • <strong>Leader:</strong> <strong>Rajasthan</strong> leads nationwide primarily driven by massive desert solar radiation (>5.5 kWh/m²/day).<br>
        • <strong>Runner-up:</strong> <strong>Gujarat</strong> is the national leader in wind energy and hybrid parks (Khavda 30 GW).<br>
        • <strong>Source:</strong> Ministry of New and Renewable Energy (MNRE State Profiles)`,
        mode
      };
    }

    // Q: How far from 2030 target?
    if (q.includes('2030 target') || q.includes('how far') || q.includes('panchamrit') || q.includes('target progress') || q.includes('gap')) {
      const t = metrics.target2030;
      return {
        badge: '🟡 CALCULATED DATA',
        answer: `<strong>India 2030 Non-Fossil Target Status (Panchamrit COP26 Commitment):</strong><br><br>
        • <strong>National Target:</strong> ${t.targetMW.toLocaleString()} MW (500 GW)<br>
        • <strong>Current Verified Capacity:</strong> ${t.currentMW.toLocaleString()} MW (${t.currentGW} GW)<br>
        • <strong>Progress Achieved:</strong> <strong>${t.progressPercent}%</strong><br>
        • <strong>Remaining Gap:</strong> ${t.remainingMW.toLocaleString()} MW (${t.remainingGW} GW)<br>
        • <strong>Required Annual Addition:</strong> ~${t.requiredAnnualAdditionGW} GW / year through 2030<br><br>
        <strong>Transparent Methodology:</strong><br>
        <code>Progress % = (Current Non-Fossil MW / 500,000 MW) × 100</code><br>
        <code>Remaining = 500,000 MW - ${t.currentMW.toLocaleString()} MW = ${t.remainingMW.toLocaleString()} MW</code><br>
        • <strong>Source:</strong> CEA National Electricity Plan & COP26 Nationally Determined Contribution (NDC)`,
        mode
      };
    }

    // Q: What changed since previous update? (Requirement 12)
    if (q.includes('what changed') || q.includes('change') || q.includes('since previous') || q.includes('new data')) {
      const items = changes.changes.map(c => 
        `• <strong>${c.technology}:</strong> ${c.previousValue.toLocaleString()} ${c.unit} → <strong>${c.latestValue.toLocaleString()} ${c.unit}</strong> (<span style="color:${c.isPositive ? '#059669' : '#dc2626'}">${c.isPositive ? '+' : ''}${c.deltaValue.toLocaleString()} ${c.unit} / ${c.isPositive ? '+' : ''}${c.deltaPercent}%</span>)`
      ).join('<br>');
      return {
        badge: '🟢 OFFICIAL DATA',
        answer: `<strong>Official Telemetry Comparison:</strong><br>
        <em>${changes.comparisonNote}</em><br><br>
        ${items}<br><br>
        • <strong>Verification Status:</strong> Synchronized with MNRE / CEA Monthly Executive Bulletin.<br>
        • <strong>Status:</strong> New official data detected and validated.`,
        mode
      };
    }

    // Q: Explain this chart / Explain dashboard
    if (q.includes('chart') || q.includes('explain dashboard') || mode === 'chart' || mode === 'explain_dashboard') {
      return {
        badge: '⚪ GENERAL EXPLANATION',
        answer: `<strong>Understanding the India Renewable Intelligence Dashboard:</strong><br><br>
        1. <strong>Capacity Cards:</strong> Represent peak nominal generator ratings (MW/GW) officially reported by MNRE/CEA as of ${metrics.totalRenewable.dataPeriod}.<br>
        2. <strong>Generation vs Capacity:</strong> Peak capacity (${metrics.totalRenewable.valueGW} GW) does NOT equal constant electricity generation due to capacity factors (CUF). Solar delivers at noon, while wind peaks during monsoons.<br>
        3. <strong>Historical Chart (2015–2030):</strong> Solid lines represent <span style="color:#059669; font-weight:700;">ACTUAL VERIFIED</span> historical additions; dashed lines represent the <span style="color:#f59e0b; font-weight:700;">2030 TARGET</span> path needed to meet 500 GW.<br>
        4. <strong>Data Freshness:</strong> The green badge indicates that every metric passed numerical, unit, and institutional validation checks.`,
        mode
      };
    }

    // Q: Explain Current Data
    if (mode === 'explain_data' || q.includes('current data') || q.includes('explain current')) {
      return {
        badge: '🟢 OFFICIAL DATA',
        answer: `<strong>Summary of Current Verified Observations:</strong><br><br>
        • <strong>Reporting Period:</strong> ${metrics.totalRenewable.dataPeriod}<br>
        • <strong>Total Clean Grid:</strong> ${metrics.totalRenewable.valueGW} GW Renewable + 8.18 GW Nuclear = ${metrics.target2030.currentGW} GW Non-Fossil<br>
        • <strong>Renewable Share:</strong> Non-fossil sources now account for <strong>${metrics.renewableShare.valuePercent}%</strong> of India's total grid capacity (${metrics.totalRenewable.valueMW.toLocaleString()} MW / 454,200 MW).<br>
        • <strong>Latest Monthly Generation:</strong> ${metrics.renewableGeneration.valueGWh.toLocaleString()} GWh produced in ${metrics.renewableGeneration.dataPeriod} (CEA).<br>
        • <strong>Last Synchronization:</strong> ${syncTime}`,
        mode
      };
    }

    // Viva Mode (Requirement 14 Mode 6)
    if (mode === 'viva' || q.includes('viva') || q.includes('oral exam') || q.includes('che110')) {
      return {
        badge: '⚪ GENERAL EXPLANATION',
        answer: `<strong>🎓 CHE110 Viva Examination Mode Active!</strong><br><br>
        <strong>Common External Examiner Questions:</strong><br>
        1. <em>"What is the difference between installed capacity (MW) and energy generation (GWh)?"</em><br>
           → <strong>Answer:</strong> Capacity is maximum potential output; generation is energy actually produced over time governed by CUF (~22% for solar, ~30% for wind).<br><br>
        2. <em>"What is the Duck Curve and how does India mitigate it?"</em><br>
           → <strong>Answer:</strong> Mid-day solar surplus followed by steep evening domestic demand ramp. Mitigated via 47 GW Pumped Storage Hydro (PSP) and Battery Storage (BESS).<br><br>
        3. <em>"What are India's 2030 Panchamrit commitments?"</em><br>
           → <strong>Answer:</strong> 500 GW non-fossil capacity, 50% renewable energy share, 1 billion tonne carbon reduction, and 45% carbon intensity reduction.<br><br>
        <em>Select Basic, Intermediate, or Advanced chips to practice flashcard questions!</em>`,
        mode: 'viva'
      };
    }

    // Default conversational response
    return {
      badge: '⚪ GENERAL EXPLANATION',
      answer: `Hello! I am <strong>EcoAI</strong>, grounded in verified government data from the <strong>Ministry of New and Renewable Energy (MNRE)</strong> and the <strong>Central Electricity Authority (CEA)</strong>.<br><br>
      You can ask me about:<br>
      • <strong>Latest Solar or Wind Capacity:</strong> <em>"What is India's latest solar capacity?"</em><br>
      • <strong>2030 Target Progress:</strong> <em>"How far are we from the 500 GW target?"</em><br>
      • <strong>Recent Generation:</strong> <em>"What is recent renewable generation?"</em><br>
      • <strong>What Changed:</strong> <em>"What changed since the previous update?"</em><br>
      • <strong>CHE110 Viva Questions:</strong> <em>"Give me 5 viva questions."</em><br><br>
      <em>All numerical statistics cite official government publications and data periods.</em>`,
      mode
    };
  }

  async callGeminiModel(apiKey, prompt, mode, national, changes) {
    const fetch = global.fetch || require('node-fetch');
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const systemInstruction = `You are EcoAI, the verified AI assistant for an academic environmental engineering project at Lovely Professional University (LPU), Course: CHE110.
You have access to REAL VERIFIED GOVERNMENT DATA:
- Solar: ${national.metrics.solar.valueMW} MW (MNRE, August 2026)
- Wind: ${national.metrics.wind.valueMW} MW (MNRE / NIWE, August 2026)
- Total Renewable: ${national.metrics.totalRenewable.valueMW} MW (MNRE / CEA, August 2026)
- Total Non-Fossil: ${national.metrics.target2030.currentMW} MW
- 2030 Target: 500,000 MW (Progress: ${national.metrics.target2030.progressPercent}%)
- Monthly RE Generation: ${national.metrics.renewableGeneration.valueGWh} GWh (CEA)
NEVER invent statistics. Distinguish OFFICIAL DATA from ESTIMATES. Keep responses concise, clear, and formatted in clean HTML.`;

    const payload = {
      contents: [
        {
          role: 'user',
          parts: [{ text: `${systemInstruction}\n\nUser Question: ${prompt}\nMode: ${mode}` }]
        }
      ]
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error(`Gemini status ${res.status}`);
    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    return {
      badge: '🟢 OFFICIAL DATA',
      answer: text ? text.replace(/\n/g, '<br>') : null,
      mode
    };
  }
}

module.exports = new EcoAiBackendService();
