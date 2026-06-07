/* ═══════════════════════════════════════════════════════════════
   F1 MUN — RACE CONTROL SYSTEM · app.js v3
   v3: Aero is per-race choice · Strategy weighted more · TD bigger
       · Crisis mechanic · Spectator URL · Admin-only console
═══════════════════════════════════════════════════════════════ */
'use strict';

/* ─── 1. CONSTANTS ─────────────────────────────────────────── */
const TRACKS = [
  { id:'t1',  name:'Monaco',            flag:'🇲🇨', country:'Monaco',       type:'Street',       baseLap:74.2,  laps:78, ch:{ overtaking:10, tyre_deg:40, power_dep:45, downforce_dep:95, sc_base:55, wet_sens:60 } },
  { id:'t2',  name:'Monza',             flag:'🇮🇹', country:'Italy',        type:'Power',        baseLap:79.3,  laps:53, ch:{ overtaking:85, tyre_deg:50, power_dep:95, downforce_dep:30, sc_base:40, wet_sens:65 } },
  { id:'t3',  name:'Spa-Francorchamps', flag:'🇧🇪', country:'Belgium',      type:'Mixed',        baseLap:105.7, laps:44, ch:{ overtaking:70, tyre_deg:70, power_dep:75, downforce_dep:65, sc_base:50, wet_sens:95 } },
  { id:'t4',  name:'Suzuka',            flag:'🇯🇵', country:'Japan',        type:'Technical',    baseLap:90.5,  laps:53, ch:{ overtaking:45, tyre_deg:80, power_dep:65, downforce_dep:85, sc_base:35, wet_sens:75 } },
  { id:'t5',  name:'Silverstone',       flag:'🇬🇧', country:'UK',           type:'High-Speed',   baseLap:86.1,  laps:52, ch:{ overtaking:60, tyre_deg:85, power_dep:70, downforce_dep:75, sc_base:30, wet_sens:90 } },
  { id:'t6',  name:'Bahrain',           flag:'🇧🇭', country:'Bahrain',      type:'Balanced',     baseLap:89.5,  laps:57, ch:{ overtaking:65, tyre_deg:90, power_dep:65, downforce_dep:65, sc_base:25, wet_sens:20 } },
  { id:'t7',  name:'Singapore',         flag:'🇸🇬', country:'Singapore',    type:'Street',       baseLap:101.2, laps:62, ch:{ overtaking:20, tyre_deg:55, power_dep:50, downforce_dep:90, sc_base:70, wet_sens:80 } },
  { id:'t8',  name:'Mexico City',       flag:'🇲🇽', country:'Mexico',       type:'Altitude',     baseLap:77.6,  laps:71, ch:{ overtaking:55, tyre_deg:60, power_dep:85, downforce_dep:60, sc_base:30, wet_sens:40 } },
  { id:'t9',  name:'Interlagos',        flag:'🇧🇷', country:'Brazil',       type:'Mixed',        baseLap:68.5,  laps:71, ch:{ overtaking:75, tyre_deg:65, power_dep:70, downforce_dep:68, sc_base:45, wet_sens:88 } },
  { id:'t10', name:'Abu Dhabi',         flag:'🇦🇪', country:'UAE',          type:'Technical',    baseLap:82.4,  laps:58, ch:{ overtaking:50, tyre_deg:55, power_dep:70, downforce_dep:75, sc_base:25, wet_sens:15 } },
  { id:'t11', name:'Jeddah',            flag:'🇸🇦', country:'Saudi Arabia', type:'Street/Power', baseLap:87.5,  laps:50, ch:{ overtaking:50, tyre_deg:45, power_dep:80, downforce_dep:70, sc_base:65, wet_sens:30 } },
  { id:'t12', name:'Zandvoort',         flag:'🇳🇱', country:'Netherlands',  type:'Banked',       baseLap:70.2,  laps:72, ch:{ overtaking:35, tyre_deg:80, power_dep:65, downforce_dep:85, sc_base:30, wet_sens:75 } },
  { id:'t13', name:'Melbourne',         flag:'🇦🇺', country:'Australia',    type:'Street',       baseLap:79.8,  laps:58, ch:{ overtaking:40, tyre_deg:55, power_dep:60, downforce_dep:80, sc_base:50, wet_sens:70 } },
  { id:'t14', name:'Shanghai',          flag:'🇨🇳', country:'China',        type:'Technical',    baseLap:94.7,  laps:56, ch:{ overtaking:55, tyre_deg:70, power_dep:68, downforce_dep:75, sc_base:35, wet_sens:70 } },
  { id:'t15', name:'Baku',              flag:'🇦🇿', country:'Azerbaijan',   type:'Street/Power', baseLap:101.8, laps:51, ch:{ overtaking:65, tyre_deg:50, power_dep:78, downforce_dep:72, sc_base:60, wet_sens:55 } },
  { id:'t16', name:'Miami',             flag:'🇺🇸', country:'USA',          type:'Street/Power', baseLap:90.3,  laps:57, ch:{ overtaking:55, tyre_deg:65, power_dep:75, downforce_dep:70, sc_base:45, wet_sens:60 } },
  { id:'t17', name:'Imola',             flag:'🇮🇹', country:'Italy',        type:'Technical',    baseLap:76.5,  laps:63, ch:{ overtaking:25, tyre_deg:60, power_dep:55, downforce_dep:82, sc_base:45, wet_sens:85 } },
  { id:'t18', name:'Montréal',          flag:'🇨🇦', country:'Canada',       type:'Street/Power', baseLap:73.0,  laps:70, ch:{ overtaking:65, tyre_deg:50, power_dep:82, downforce_dep:55, sc_base:55, wet_sens:75 } },
  { id:'t19', name:'Barcelona',         flag:'🇪🇸', country:'Spain',        type:'Balanced',     baseLap:82.0,  laps:66, ch:{ overtaking:40, tyre_deg:82, power_dep:68, downforce_dep:82, sc_base:20, wet_sens:70 } },
  { id:'t20', name:'Red Bull Ring',     flag:'🇦🇹', country:'Austria',      type:'Power',        baseLap:65.2,  laps:71, ch:{ overtaking:60, tyre_deg:60, power_dep:88, downforce_dep:62, sc_base:28, wet_sens:85 } },
  { id:'t21', name:'Hungaroring',       flag:'🇭🇺', country:'Hungary',      type:'Technical',    baseLap:79.2,  laps:70, ch:{ overtaking:22, tyre_deg:75, power_dep:52, downforce_dep:92, sc_base:20, wet_sens:72 } },
  { id:'t22', name:'Austin (COTA)',     flag:'🇺🇸', country:'USA',          type:'Mixed',        baseLap:96.5,  laps:56, ch:{ overtaking:68, tyre_deg:78, power_dep:68, downforce_dep:72, sc_base:28, wet_sens:72 } },
  { id:'t23', name:'Las Vegas',         flag:'🇺🇸', country:'USA',          type:'Street/Power', baseLap:95.2,  laps:50, ch:{ overtaking:62, tyre_deg:38, power_dep:88, downforce_dep:58, sc_base:52, wet_sens:30 } },
  { id:'t24', name:'Lusail',            flag:'🇶🇦', country:'Qatar',        type:'High-Speed',   baseLap:84.0,  laps:57, ch:{ overtaking:38, tyre_deg:88, power_dep:72, downforce_dep:78, sc_base:22, wet_sens:18 } },
];

const WEATHER_OPTIONS = [
  { id:'dry',      emoji:'☀️', label:'Dry',      mods:{ power:1.00, reliability:1.00, wet:0.0, tyre:1.00, sc:1.0  } },
  { id:'overcast', emoji:'☁️', label:'Overcast', mods:{ power:0.99, reliability:0.99, wet:0.2, tyre:1.01, sc:1.10 } },
  { id:'wet',      emoji:'🌧️', label:'Wet',      mods:{ power:0.88, reliability:0.91, wet:1.0, tyre:0.82, sc:1.60 } },
  { id:'mixed',    emoji:'⛈️', label:'Mixed',    mods:{ power:0.93, reliability:0.93, wet:0.6, tyre:0.87, sc:1.35 } },
];

const POINTS_SYS = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1];
const FL_BONUS   = 1;

const TYRE_STRATEGIES = [
  { id:'auto',     name:'Auto',             desc:'Sim decides',         icon:'🤖', compounds:null,              stops:null, style:'auto'         },
  { id:'s_m_h',    name:'2-Stop Attack',    desc:'S → M → H',           icon:'🔴', compounds:['S','M','H'],      stops:2,    style:'aggressive'   },
  { id:'m_h',      name:'1-Stop Standard',  desc:'M → H',               icon:'🟡', compounds:['M','H'],          stops:1,    style:'conservative' },
  { id:'s_h',      name:'1-Stop Gamble',    desc:'S → H',               icon:'🎲', compounds:['S','H'],          stops:1,    style:'gamble'       },
  { id:'h_h',      name:'1-Stop Endurance', desc:'H → H',               icon:'⚪', compounds:['H','H'],          stops:1,    style:'endurance'    },
  { id:'m_m_h',    name:'2-Stop Balanced',  desc:'M → M → H',           icon:'🟡', compounds:['M','M','H'],      stops:2,    style:'balanced'     },
  { id:'s_s_m_h',  name:'3-Stop Sprint',    desc:'S → S → M → H',       icon:'🔥', compounds:['S','S','M','H'],  stops:3,    style:'ultra'        },
];

const WET_TYRE_STRATEGIES = [
  { id:'wet_auto', name:'Auto',         desc:'Weather auto',  icon:'🤖', compounds:null,            stops:null, style:'auto'       },
  { id:'w_w',      name:'Full Wet',     desc:'W → W',         icon:'💧', compounds:['W','W'],       stops:1,    style:'wet'        },
  { id:'w_i_m',    name:'Transition',   desc:'W → I → M',     icon:'⛈️', compounds:['W','I','M'],   stops:2,    style:'transition' },
  { id:'i_m',      name:'Intermediate', desc:'I → M',         icon:'🌧️', compounds:['I','M'],       stops:1,    style:'inter'      },
];

/* ── AERO PACKAGES — per-race strategic choice ─────────────── */
const AERO_PACKAGES = [
  { id:'low_drag',   name:'Low-Drag',       icon:'🪶', desc:'Top speed king',
    favorsTypes:['Power','Street/Power','High-Speed','Mixed'],
    hurtsTypes: ['Street','Technical','Banked'] },
  { id:'balanced',   name:'Balanced',       icon:'⚖️', desc:'Safe all-rounder',
    favorsTypes:['Balanced','Mixed'], hurtsTypes:[] },
  { id:'high_df',    name:'High-Downforce', icon:'🏎️', desc:'Cornering monster',
    favorsTypes:['Street','Technical','Banked','Street/Power'],
    hurtsTypes: ['Power','High-Speed'] },
  { id:'wet_spec',   name:'Wet Spec',       icon:'💧', desc:'Built for rain',
    favorsTypes:[], hurtsTypes:[],
    favorsWeather:['wet','mixed'], hurtsWeather:['dry','overcast'] },
  { id:'aggressive', name:'Aggressive',     icon:'🔥', desc:'Pace + tyre cost',
    favorsTypes:['Power','Street/Power','High-Speed'], hurtsTypes:[],
    paceBonus: 0.18, extraDegMult: 1.45 },
];

const TYPE_COLORS = {
  engines:'#29b6f6', principals:'#e8002d', drivers:'#00e676',
  strategists:'#ab47bc', pitstops:'#ff7043', technicalDirectors:'#26c6da',
};
const TYPE_LABELS = {
  engines:'Engine', principals:'Team Principal', drivers:'Driver',
  strategists:'Strategist', pitstops:'Pit Crew', technicalDirectors:'Technical Director',
};
const TYPE_TO_SLOT = {
  engines:'engine', principals:'principal', drivers:['driver1','driver2','reserve'],
  strategists:'strategist', pitstops:'pitcrew', technicalDirectors:'techDir',
};
const SLOT_LABELS = {
  engine:'Engine', principal:'Principal',
  driver1:'Driver 1', driver2:'Driver 2', reserve:'Reserve',
  strategist:'Strategist', pitcrew:'Pit Crew', techDir:'Tech Director',
};
const SLOT_ORDER = ['engine','principal','driver1','driver2','reserve','strategist','pitcrew','techDir'];
const SLOT_TO_TYPE = {
  engine:'engines', principal:'principals',
  driver1:'drivers', driver2:'drivers', reserve:'drivers',
  strategist:'strategists', pitcrew:'pitstops', techDir:'technicalDirectors',
};

const TIRE_COMPOUNDS = {
  S: { name:'Soft',   pace:0.0,  cliff:22, deg:0.045, css:'tire-soft'   },
  M: { name:'Medium', pace:0.55, cliff:34, deg:0.030, css:'tire-medium' },
  H: { name:'Hard',   pace:1.10, cliff:46, deg:0.020, css:'tire-hard'   },
  I: { name:'Inter',  pace:0.80, cliff:30, deg:0.035, css:'tire-inter'  },
  W: { name:'Wet',    pace:1.60, cliff:35, deg:0.030, css:'tire-wet'    },
};

const RACE_SPEEDS = { '0.25x':2400, '1x':600, '4x':150 };

/* ─── 2. ASSET DB & STATE ──────────────────────────────────── */
let ASSET_DB = {
  engines:[], principals:[], drivers:[],
  strategists:[], pitstops:[], technicalDirectors:[],
};

const APP = {
  auth: { adminPw:'ADMIN2025' },
  session: { role:null },
  season: {
    name: 'F1 MUN Grand Prix Championship',
    started: false, fpDone: false, currentRound: 0,
    calendar: [], selectedTrackIds: [],
    teamStrategies: {}, teamAero: {}, roundCrises: {},
  },
  champ: { drivers:{}, constructors:{} },
  teams: [],
  prices: {},
  fpData: null,
  ui: {
    filterType: 'all',
    selectedAnalyticsTeam: null,
    qualWeather: 'dry',
    tradeA: null, tradeB: null, tradeASelected: [], tradeBSelected: [],
    selectedStrategyRound: null,
    selectedResult: null,
    specPage: 'overview', specTeam: null,
  },
  race: { running:false, paused:false, speedKey:'1x', interval:null, state:null },
};

const LS_KEY = 'f1mun_v3';

function saveState() {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify({
      auth: APP.auth, session: APP.session,
      season: APP.season, champ: APP.champ,
      teams: APP.teams, prices: APP.prices,
      fpData: APP.fpData, ASSET_DB,
    }));
  } catch(e) { console.warn('Save failed:', e); }
}

function loadState() {
  let src = null;
  try { const s = localStorage.getItem(LS_KEY); if (s) src = JSON.parse(s); } catch(e){}
  if (!src) return;
  if (src.auth)   APP.auth   = { ...APP.auth, ...src.auth };
  if (src.season) {
    APP.season = { ...APP.season, ...src.season };
    if (!APP.season.teamStrategies) APP.season.teamStrategies = {};
    if (!APP.season.teamAero)       APP.season.teamAero = {};
    if (!APP.season.roundCrises)    APP.season.roundCrises = {};
  }
  if (src.champ)  APP.champ  = src.champ;
  if (src.teams)  APP.teams  = src.teams;
  if (src.prices) APP.prices = src.prices;
  if (src.fpData) APP.fpData = src.fpData;
  if (src.ASSET_DB && Object.values(src.ASSET_DB).some(a => Array.isArray(a) && a.length)) {
    ASSET_DB = { engines:[], principals:[], drivers:[], strategists:[], pitstops:[], technicalDirectors:[], ...src.ASSET_DB };
    delete ASSET_DB.aero; /* migrate away from old aero asset */
    if (!ASSET_DB.technicalDirectors) ASSET_DB.technicalDirectors = [];
  }
  APP.teams.forEach(t => {
    if (!t.assets) t.assets = blankSlots();
    delete t.assets.aero;
    SLOT_ORDER.forEach(s => {
      if (!(s in t.assets)) t.assets[s] = null;
      if (t.assets[s] && typeof t.assets[s] === 'object') t.assets[s] = t.assets[s].id;
    });
  });
}

/* ─── 3. UTILITIES ─────────────────────────────────────────── */
function rand(a, b)  { return Math.random() * (b - a) + a; }
function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
function gaussRand(mean = 0, sigma = 1) {
  let u, v;
  do { u = Math.random(); } while (u === 0);
  do { v = Math.random(); } while (v === 0);
  return mean + sigma * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}
function fmtTime(secs) {
  if (!isFinite(secs) || secs < 0) return '—';
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${s.toFixed(3).padStart(6,'0')}`;
}
function escHtml(s) {
  return String(s ?? '').replace(/[&<>"']/g,
    c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
}
function blankSlots() {
  return {
    engine:null, principal:null,
    driver1:null, driver2:null, reserve:null,
    strategist:null, pitcrew:null, techDir:null,
  };
}
function uid(prefix='id') { return prefix + '_' + Math.random().toString(36).slice(2,10); }
function getAsset(id) {
  if (!id) return null;
  for (const cat of Object.values(ASSET_DB)) {
    if (!Array.isArray(cat)) continue;
    const a = cat.find(x => x.id === id);
    if (a) return a;
  }
  return null;
}
function assetCategory(id) {
  for (const [k, arr] of Object.entries(ASSET_DB)) {
    if (!Array.isArray(arr)) continue;
    if (arr.some(a => a.id === id)) return k;
  }
  return null;
}
function allAssets() { return Object.values(ASSET_DB).filter(Array.isArray).flat(); }
function ovr(asset) {
  if (!asset?.ratings) return 0;
  const v = Object.values(asset.ratings).filter(n => typeof n === 'number');
  if (!v.length) return 0;
  return Math.round(v.reduce((a,b) => a+b, 0) / v.length);
}
function priceOf(assetId) {
  if (assetId == null) return 0;
  if (assetId in APP.prices) return APP.prices[assetId];
  return getAsset(assetId)?.price ?? 0;
}
function teamSpent(team) {
  if (!team) return 0;
  return SLOT_ORDER.reduce((sum, s) => sum + (team.assets[s] ? priceOf(team.assets[s]) : 0), 0);
}
function teamComplete(team) {
  const a = team.assets;
  const hasTDs = ASSET_DB.technicalDirectors?.length > 0;
  return !!(a.engine && a.principal && a.driver1 && a.driver2 && a.strategist && a.pitcrew && (hasTDs ? a.techDir : true));
}
function teamOvr(team) {
  const ids = SLOT_ORDER.filter(s => s !== 'reserve').map(s => team.assets[s]).filter(Boolean);
  if (!ids.length) return null;
  const all = ids.flatMap(id => {
    const a = getAsset(id);
    return a ? Object.values(a.ratings).filter(n => typeof n === 'number') : [];
  });
  if (!all.length) return null;
  return Math.round(all.reduce((a,b) => a+b, 0) / all.length);
}
function gradeFromScore(score) {
  if (score >= 95) return { g:'S', css:'grade-s' };
  if (score >= 85) return { g:'A', css:'grade-a' };
  if (score >= 75) return { g:'B', css:'grade-b' };
  if (score >= 65) return { g:'C', css:'grade-c' };
  return { g:'D', css:'grade-d' };
}
function driverKey(teamId, slot) { return `${teamId}__${slot}`; }
function isAssigned(assetId) {
  if (!assetId) return false;
  return APP.teams.some(t => SLOT_ORDER.some(s => t.assets[s] === assetId));
}
function teamOf(assetId) {
  return APP.teams.find(t => SLOT_ORDER.some(s => t.assets[s] === assetId));
}

/* Strategy/Aero helpers */
function getAvailableStrategies(weatherId) {
  return (weatherId === 'wet' || weatherId === 'mixed') ? WET_TYRE_STRATEGIES : TYRE_STRATEGIES;
}
function getStrategyInfo(key) {
  return [...TYRE_STRATEGIES, ...WET_TYRE_STRATEGIES].find(s => s.id === key) || null;
}
function getTeamStrategy(teamId, roundIdx) {
  return APP.season.teamStrategies?.[roundIdx]?.[teamId] || 'auto';
}
function setTeamStrategy(teamId, roundIdx, key) {
  if (!APP.season.teamStrategies) APP.season.teamStrategies = {};
  if (!APP.season.teamStrategies[roundIdx]) APP.season.teamStrategies[roundIdx] = {};
  APP.season.teamStrategies[roundIdx][teamId] = key;
  saveState();
  const info = getStrategyInfo(key);
  notify(info ? `Tyres: ${info.name}` : 'Strategy updated', 'success');
}
function getAeroInfo(key) { return AERO_PACKAGES.find(p => p.id === key) || AERO_PACKAGES[1]; }
function getTeamAero(teamId, roundIdx) {
  return APP.season.teamAero?.[roundIdx]?.[teamId] || 'balanced';
}
function setTeamAero(teamId, roundIdx, key) {
  if (!APP.season.teamAero) APP.season.teamAero = {};
  if (!APP.season.teamAero[roundIdx]) APP.season.teamAero[roundIdx] = {};
  APP.season.teamAero[roundIdx][teamId] = key;
  saveState();
  notify(`Aero: ${getAeroInfo(key).name}`, 'success');
}

function strategyTrackFit(stratKey, track) {
  const info = getStrategyInfo(stratKey);
  if (!info || info.compounds === null) return { rating:'neutral', mod:0, label:'Auto' };
  const deg   = track.ch.tyre_deg;
  const stops = info.stops || 1;
  if (deg >= 75 && stops >= 2) return { rating:'good', mod:-0.30, label:'Great fit' };
  if (deg >= 75 && stops === 1) return { rating:'bad',  mod:+0.45, label:'Risky 1-stop' };
  if (deg <= 55 && stops === 1) return { rating:'good', mod:-0.28, label:'Great fit' };
  if (deg <= 55 && stops >= 3) return { rating:'bad',  mod:+0.50, label:'Too many stops' };
  if (stops === 2) return { rating:'good', mod:-0.10, label:'Solid choice' };
  return { rating:'neutral', mod:0, label:'OK' };
}

function aeroTrackFit(aeroKey, track, weather) {
  const aero = getAeroInfo(aeroKey);
  if (!aero) return { rating:'neutral', mod:0, label:'?' };
  if (aero.id === 'wet_spec') {
    if (weather.id === 'wet')   return { rating:'good', mod:-0.55, label:'Rain master' };
    if (weather.id === 'mixed') return { rating:'good', mod:-0.30, label:'Wet helps' };
    if (weather.id === 'dry')   return { rating:'bad',  mod:+0.55, label:'Wasted in dry' };
    return { rating:'bad', mod:+0.30, label:'Dry hurts' };
  }
  if (aero.id === 'aggressive') {
    const matches = (aero.favorsTypes || []).some(t => track.type.includes(t));
    return matches
      ? { rating:'good', mod:-0.35, label:'Aggressive pace' }
      : { rating:'neutral', mod:-0.10, label:'Pace + deg cost' };
  }
  if ((aero.favorsTypes || []).some(t => track.type.includes(t))) {
    return { rating:'good', mod:-0.42, label:'Perfect fit' };
  }
  if ((aero.hurtsTypes || []).some(t => track.type.includes(t))) {
    return { rating:'bad', mod:+0.50, label:'Wrong package' };
  }
  return { rating:'neutral', mod:0, label:'Neutral' };
}

function recommendedAero(track, weather) {
  if (weather.id === 'wet') return 'wet_spec';
  const scores = AERO_PACKAGES.map(p => ({ p, fit: aeroTrackFit(p.id, track, weather) }));
  scores.sort((a,b) => a.fit.mod - b.fit.mod);
  return scores[0].p.id;
}
function recommendedStrategy(track, weather) {
  if (weather.id === 'wet')   return 'w_w';
  if (weather.id === 'mixed') return 'w_i_m';
  const deg = track.ch.tyre_deg;
  if (deg >= 80) return 's_m_h';
  if (deg >= 65) return 'm_m_h';
  if (deg >= 50) return 'm_h';
  return 'h_h';
}

function isDriverInjured(teamId, slot, roundIdx) {
  const crisis = APP.season.roundCrises?.[roundIdx];
  if (!crisis?.injured) return false;
  return crisis.injured.some(inj => inj.teamId === teamId && inj.slot === slot);
}
function getEffectiveDriver(team, slot, roundIdx) {
  if (!isDriverInjured(team.id, slot, roundIdx)) return getAsset(team.assets[slot]);
  const crisis = APP.season.roundCrises?.[roundIdx];
  const promotion = crisis?.promotions?.find(p => p.teamId === team.id && p.injuredSlot === slot);
  return promotion?.replacementId ? getAsset(promotion.replacementId) : null;
}
/* ─── END PART 1 ──────────────────────────────────────────── */

/* ═══════════════════════════════════════════════════════════════
   PART 2 — Auth · Nav · CSV · Dashboard · Assets · Teams · Trade
═══════════════════════════════════════════════════════════════ */

function attemptLogin() {
  const pw = document.getElementById('login-pw').value.trim();
  if (!pw) { showLoginError('Enter your access code'); return; }
  if (pw === APP.auth.adminPw) { APP.session = { role:'admin' }; enterApp(); return; }
  showLoginError('Incorrect access code');
}
function showLoginError(msg) {
  const err = document.getElementById('login-error');
  err.textContent = '⚠ ' + msg;
  err.classList.add('show');
  setTimeout(() => err.classList.remove('show'), 3200);
  const card = document.getElementById('login-card');
  card.classList.add('shake');
  setTimeout(() => card.classList.remove('shake'), 480);
}
function enterApp() {
  document.getElementById('screen-login').hidden = true;
  document.getElementById('screen-app').hidden   = false;
  buildNav();
  wireStaticAppHandlers();
  showPage('dashboard');
  updateSidebar();
}
function logout() {
  if (APP.race.running && APP.race.interval) { clearTimeout(APP.race.interval); APP.race.running = false; }
  APP.session = { role:null };
  document.getElementById('screen-app').hidden   = true;
  document.getElementById('screen-login').hidden = false;
  document.getElementById('login-pw').value = '';
  document.getElementById('login-error').classList.remove('show');
}

const ADMIN_TABS = [
  { id:'dashboard',    label:'Dashboard'     },
  { id:'assets',       label:'Assets'        },
  { id:'teams',        label:'Teams'         },
  { id:'season',       label:'Season'        },
  { id:'strategy',     label:'Strategy 🏁'   },
  { id:'fp',           label:'Practice'      },
  { id:'qualifying',   label:'Qualifying'    },
  { id:'race',         label:'Race'          },
  { id:'results',      label:'Results'       },
  { id:'championship', label:'Championship'  },
  { id:'analytics',    label:'Analytics'     },
  { id:'trade',        label:'Trade Desk'    },
  { id:'admin',        label:'Admin ⚙'       },
  { id:'guide',        label:'Guide 📖'      },
];

function buildNav() {
  const nav = document.getElementById('nav-tabs');
  nav.innerHTML = ADMIN_TABS.map(t =>
    `<button class="nav-tab" data-page="${t.id}">${t.label}</button>`).join('');
  nav.querySelectorAll('.nav-tab').forEach(btn =>
    btn.addEventListener('click', () => showPage(btn.dataset.page)));
  document.getElementById('nav-user-info').innerHTML = `<span class="nav-user-admin">EXECUTIVE BOARD</span>`;
  updateRoundBadge();
}

const PAGE_RENDERERS = {
  dashboard: renderDashboard, assets: renderAssets, teams: renderTeams,
  season: renderSeason, strategy: renderStrategy, fp: renderFP,
  qualifying: renderQual, race: renderRace, results: renderResults,
  championship: renderChampionship, analytics: renderAnalytics,
  trade: renderTrade, admin: renderAdmin, guide: renderGuide,
};

function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
  const page = document.getElementById('page-' + name);
  const tab  = document.querySelector(`.nav-tab[data-page="${name}"]`);
  if (page) page.classList.add('active');
  if (tab)  tab.classList.add('active');
  PAGE_RENDERERS[name]?.();
}

function updateRoundBadge() {
  const el = document.getElementById('nav-round-badge');
  if (!el) return;
  if (!APP.season.started) { el.textContent = 'Pre-Season'; el.classList.remove('finale-round'); return; }
  const total = APP.season.calendar.length;
  const done  = APP.season.calendar.filter(r => r.completed).length;
  const isFinale = APP.season.currentRound === total && !APP.season.calendar[total - 1]?.completed;
  el.textContent = done >= total
    ? `Season Complete · ${total}/${total}`
    : isFinale ? `FINALE · Round ${APP.season.currentRound} / ${total}`
               : `Round ${APP.season.currentRound} / ${total}`;
  el.classList.toggle('finale-round', isFinale);
}

function updateSidebar() {
  const sorted = [...APP.teams].sort((a, b) => {
    const pa = APP.champ.constructors[a.id]?.points || 0;
    const pb = APP.champ.constructors[b.id]?.points || 0;
    return pb - pa;
  });
  const leaderPts = APP.champ.constructors[sorted[0]?.id]?.points || 0;
  const lbHtml = sorted.length ? sorted.map((t, i) => {
    const pts = APP.champ.constructors[t.id]?.points || 0;
    const gap = i > 0 ? `<span class="lb-gap">−${leaderPts - pts}</span>` : '';
    return `<div class="lb-row" style="--row-color:${escHtml(t.color)}">
      <span class="lb-pos">${i+1}</span><span class="lb-dot"></span>
      <span class="lb-name">${escHtml(t.name)}</span>
      <span class="lb-pts">${pts}</span>${gap}
    </div>`;
  }).join('') : '<div class="sb-empty">No teams yet</div>';
  const lbEl = document.getElementById('lb-constructors');
  if (lbEl) lbEl.innerHTML = lbHtml;

  const completed = APP.season.calendar.filter(r => r.completed);
  const histHtml = completed.length ? completed.map((r, i) => {
    const t = TRACKS.find(x => x.id === r.trackId);
    const top3 = (r.raceResults?.classification || []).filter(c => !c.injured && !c.dnf).slice(0,3);
    return `<div class="sb-history-block">
      <div class="sb-history-title">R${i+1} ${t?.flag||''} ${escHtml(t?.name||'')}</div>
      ${top3.map((c,j) => `<div class="sb-history-row">
        <span class="pos">${j+1}.</span>
        <span class="dot" style="background:${escHtml(c.teamColor)}"></span>
        <span class="truncate">${escHtml(c.driverName)}</span>
        <span class="pts">+${c.points||0}</span>
      </div>`).join('')}
    </div>`;
  }).join('') : '<div class="sb-empty">No races yet</div>';
  const histEl = document.getElementById('lb-history');
  if (histEl) histEl.innerHTML = histHtml;
}

/* CSV import — skips "Aero" rows */
function parseCSV(text) {
  const lines = text.replace(/\r\n?/g,'\n').trim().split('\n').filter(l => l.trim());
  if (!lines.length) return [];
  const headers = splitCSVLine(lines[0]);
  return lines.slice(1).map(line => {
    const vals = splitCSVLine(line);
    const obj  = {};
    headers.forEach((h,i) => { obj[h.trim()] = (vals[i]??'').trim(); });
    return obj;
  });
}
function splitCSVLine(line) {
  const out = [];
  let cur = '', inQ = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (inQ) {
      if (c==='"' && line[i+1]==='"') { cur+='"'; i++; }
      else if (c==='"') inQ = false;
      else cur += c;
    } else {
      if (c===',') { out.push(cur); cur=''; }
      else if (c==='"') inQ = true;
      else cur += c;
    }
  }
  out.push(cur);
  return out.map(s => s.trim());
}
function applyCSVRows(rows) {
  const typeMap = {
    Engine:'engines', Principal:'principals', Driver:'drivers',
    Strategist:'strategists', PitCrew:'pitstops',
    TechnicalDirector:'technicalDirectors',
  };
  const newDB = { engines:[], principals:[], drivers:[], strategists:[], pitstops:[], technicalDirectors:[] };
  let skippedAero = 0;
  rows.forEach(r => {
    if (r.Type === 'Aero') { skippedAero++; return; }
    const cat = typeMap[r.Type];
    if (!cat || !r.ID || !r.Name) return;
    const ratings = {};
    for (let i = 1; i <= 6; i++) {
      const sn = r[`S${i}`], sv = parseFloat(r[`V${i}`]);
      if (sn && !isNaN(sv)) ratings[sn] = sv;
    }
    newDB[cat].push({ id:r.ID, name:r.Name, nat:r.Nationality||'', ratings, price:parseFloat(r.Price)||0, desc:r.Description||'' });
  });
  Object.keys(newDB).forEach(k => { if (newDB[k].length) ASSET_DB[k] = newDB[k]; });
  APP.teams.forEach(t => { t.assets = blankSlots(); });
  APP.prices = {};
  saveState();
  if (document.getElementById('page-assets')?.classList.contains('active')) renderAssets();
  let msg = `✓ Imported ${rows.length - skippedAero} assets`;
  if (skippedAero) msg += ` · skipped ${skippedAero} Aero rows (aero is now a per-race choice)`;
  notify(msg, 'success');
}
function importCSVFile(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    try { applyCSVRows(parseCSV(e.target.result)); }
    catch(err) { notify('CSV parse failed: ' + err.message, 'error'); }
  };
  reader.readAsText(file);
}
async function importFromSheets() {
  let url = document.getElementById('sheets-url').value.trim();
  if (!url) { notify('Enter a Google Sheets CSV URL', 'warn'); return; }
  if (url.includes('/edit') && !url.includes('/export'))
    url = url.replace(/\/edit.*$/, '/export?format=csv');
  try {
    notify('Fetching CSV…','blue');
    const r = await fetch(url);
    if (!r.ok) throw new Error('HTTP ' + r.status);
    applyCSVRows(parseCSV(await r.text()));
  } catch(err) { notify('Could not fetch URL. Try file import instead.', 'error'); }
}
function resetAssets() {
  openModal({
    title:'Reset Assets?',
    body:'<div class="text-sm">This clears ALL imported assets and team assignments. Continue?</div>',
    actions:[
      { label:'Cancel', cls:'btn-ghost', onClick:closeModal },
      { label:'Reset',  cls:'btn-red',   onClick:() => {
        ASSET_DB = { engines:[], principals:[], drivers:[], strategists:[], pitstops:[], technicalDirectors:[] };
        APP.teams.forEach(t => { t.assets = blankSlots(); });
        APP.prices = {};
        saveState(); closeModal(); renderAssets(); notify('Assets cleared','warn');
      }},
    ],
  });
}

function renderDashboard() {
  const completeTeams = APP.teams.filter(teamComplete);
  const nextRace  = APP.season.calendar.find(r => !r.completed);
  const nextTrack = nextRace ? TRACKS.find(t => t.id === nextRace.trackId) : null;
  const sortedC   = Object.entries(APP.champ.constructors).sort((a,b) => b[1].points - a[1].points);
  const sortedD   = Object.entries(APP.champ.drivers).sort((a,b) => b[1].points - a[1].points);
  const constLeader = sortedC[0]?.[1];
  const drvLeader   = sortedD[0]?.[1];
  const totalAssets = allAssets().length;
  const hasTDs      = ASSET_DB.technicalDirectors.length > 0;

  const condCards = nextTrack ? `
    <div class="card">
      <div class="card-title">Next Race — ${nextTrack.flag} ${escHtml(nextTrack.name)} GP</div>
      <div class="cond-grid">
        <div class="cond-card"><div class="cond-val">${nextTrack.ch.overtaking}%</div><div class="cond-lbl">Overtaking</div></div>
        <div class="cond-card"><div class="cond-val">${nextTrack.ch.tyre_deg}%</div><div class="cond-lbl">Tyre Deg</div></div>
        <div class="cond-card"><div class="cond-val">${nextTrack.ch.power_dep}%</div><div class="cond-lbl">Power Dep</div></div>
        <div class="cond-card"><div class="cond-val">${nextTrack.ch.downforce_dep}%</div><div class="cond-lbl">Downforce</div></div>
        <div class="cond-card"><div class="cond-val">${nextTrack.ch.sc_base}%</div><div class="cond-lbl">SC Chance</div></div>
        <div class="cond-card"><div class="cond-val">${nextTrack.laps}</div><div class="cond-lbl">Race Laps</div></div>
      </div>
    </div>` : '';

  const adminGuide = !APP.season.started ? `
    <div class="card" style="border-color:var(--accent);background:rgba(232,0,45,0.04);">
      <div class="card-title text-accent">⚡ Getting Started</div>
      <div class="flex gap-12 flex-wrap">
        <button class="btn btn-ghost" data-go="assets">1. Configure Assets</button>
        <button class="btn btn-ghost" data-go="teams">2. Create Teams</button>
        <button class="btn btn-ghost" data-go="season">3. Set Calendar</button>
        <button class="btn btn-ghost" data-go="fp">4. Run Practice</button>
        <button class="btn btn-red"   data-go="qualifying">5. Start Qualifying →</button>
      </div>
    </div>` : '';

  document.getElementById('dashboard-content').innerHTML = `
    <div class="dashboard-hero">
      <div class="hero-round">${APP.season.started ? `ROUND ${APP.season.currentRound} / ${APP.season.calendar.length}` : 'PRE-SEASON'}</div>
      <div class="hero-title">${escHtml(APP.season.name)}</div>
      <div class="hero-sub">${nextTrack ? `Next race: ${nextTrack.flag} ${escHtml(nextTrack.name)} Grand Prix` : (APP.season.started ? 'Season complete' : 'Configure season to begin')}</div>
    </div>
    <div class="stat-overview-grid">
      <div class="stat-overview-card"><div class="stat-overview-label">Teams</div><div class="stat-overview-val">${completeTeams.length}</div><div class="stat-overview-sub">${APP.teams.length} total · ${completeTeams.length} ready</div></div>
      <div class="stat-overview-card"><div class="stat-overview-label">Races Done</div><div class="stat-overview-val">${APP.season.calendar.filter(r=>r.completed).length}</div><div class="stat-overview-sub">of ${APP.season.calendar.length} scheduled</div></div>
      <div class="stat-overview-card"><div class="stat-overview-label">Constructors Leader</div><div class="stat-overview-val" style="font-size:16px;color:var(--gold)">${constLeader?escHtml(constLeader.name):'—'}</div><div class="stat-overview-sub">${constLeader?constLeader.points+' pts':'No data'}</div></div>
      <div class="stat-overview-card"><div class="stat-overview-label">Drivers Leader</div><div class="stat-overview-val" style="font-size:16px;color:var(--green)">${drvLeader?escHtml(drvLeader.name):'—'}</div><div class="stat-overview-sub">${drvLeader?drvLeader.points+' pts':'No data'}</div></div>
      <div class="stat-overview-card"><div class="stat-overview-label">Practice</div><div class="stat-overview-val" style="font-size:16px">${APP.fpData?'✅ Done':'⏳ Pending'}</div><div class="stat-overview-sub">${APP.fpData?'Report ready':'Run before quali'}</div></div>
      <div class="stat-overview-card"><div class="stat-overview-label">Assets</div><div class="stat-overview-val" style="font-size:16px">${totalAssets}</div><div class="stat-overview-sub">${hasTDs?'TD loaded':'Import CSV'}</div></div>
    </div>
    ${condCards}${adminGuide}`;
  document.querySelectorAll('[data-go]').forEach(b => b.addEventListener('click', () => showPage(b.dataset.go)));
}

function renderAssets() {
  const types  = ['all','engines','principals','drivers','strategists','pitstops','technicalDirectors'];
  const labels = { all:'All', engines:'Engines', principals:'Principals', drivers:'Drivers', strategists:'Strategists', pitstops:'Pit Crews', technicalDirectors:'Tech Directors' };
  const counts = Object.fromEntries(Object.entries(ASSET_DB).filter(([k,v]) => Array.isArray(v)).map(([k,v]) => [k,v.length]));

  document.getElementById('asset-filter-bar').innerHTML = types.map(t => {
    const count = t === 'all' ? allAssets().length : (counts[t]||0);
    return `<button class="filter-pill ${APP.ui.filterType===t?'active':''}" data-filter="${t}">${labels[t]} ${count?`· ${count}`:''}</button>`;
  }).join('');
  document.querySelectorAll('#asset-filter-bar .filter-pill').forEach(b =>
    b.addEventListener('click', () => { APP.ui.filterType = b.dataset.filter; renderAssets(); }));

  const grid = document.getElementById('asset-grid');
  const list = APP.ui.filterType === 'all' ? allAssets() : (ASSET_DB[APP.ui.filterType]||[]);

  if (!list.length) {
    grid.innerHTML = `<div class="card" style="grid-column:1/-1;text-align:center;padding:40px;">
      <div class="card-title">No assets loaded</div>
      <div class="text-sm text-muted">Import your CSV to populate the asset registry. Aero rows in the CSV will be skipped — aero is now a per-race choice.</div>
    </div>`;
    return;
  }
  grid.innerHTML = list.map(a => {
    const cat      = assetCategory(a.id);
    const tc       = TYPE_COLORS[cat] || '#888';
    const assigned = isAssigned(a.id);
    const owner    = assigned ? teamOf(a.id) : null;
    return `<div class="asset-card ${assigned?'assigned':''}" style="--tc:${tc}">
      <div class="asset-type-tag">${TYPE_LABELS[cat]||cat}</div>
      <div class="asset-name">${escHtml(a.name)}</div>
      <div class="asset-nat">${escHtml(a.nat||'')}</div>
      <div class="asset-ovr"><span class="ovr-num">${ovr(a)}</span><span class="ovr-lbl">OVR</span></div>
      <div class="asset-price">
        <span class="text-xs text-muted">Price:</span>
        <input type="number" class="price-input" value="${priceOf(a.id)}" data-asset-id="${a.id}" />
      </div>
      ${assigned ? `<div class="asset-assigned-badge">→ ${escHtml(owner?.name||'Assigned')}</div>` : ''}
      ${a.desc ? `<div class="asset-desc">${escHtml(a.desc)}</div>` : ''}
    </div>`;
  }).join('');
  grid.querySelectorAll('.price-input').forEach(inp => {
    inp.addEventListener('change', () => {
      const v = parseFloat(inp.value);
      if (!isNaN(v) && v >= 0) { APP.prices[inp.dataset.assetId] = v; saveState(); notify(`Price: $${v}M`,'success'); }
    });
  });
}

function createTeam() {
  const name  = document.getElementById('new-team-name').value.trim();
  const color = document.getElementById('new-team-color').value;
  if (!name) { notify('Enter a team name','warn'); return; }
  if (APP.season.started) { notify('Season locked — cannot add teams','error'); return; }
  APP.teams.push({ id:uid('team'), name, color, assets:blankSlots() });
  document.getElementById('new-team-name').value = '';
  saveState(); renderTeams(); updateSidebar();
  notify(`Team "${name}" created`,'success');
}
function deleteTeam(teamId) {
  const t = APP.teams.find(x => x.id === teamId);
  if (!t) return;
  if (APP.season.started) { notify('Season locked','error'); return; }
  openModal({
    title:`Delete "${t.name}"?`,
    body:`<div class="text-sm">This will release all of their assets back to the pool.</div>`,
    actions:[
      { label:'Cancel', cls:'btn-ghost', onClick:closeModal },
      { label:'Delete', cls:'btn-red',   onClick:() => {
        APP.teams = APP.teams.filter(x => x.id !== teamId);
        saveState(); closeModal(); renderTeams(); updateSidebar(); notify('Team deleted','warn');
      }},
    ],
  });
}
function renderTeams() {
  const grid = document.getElementById('teams-grid');
  if (!APP.teams.length) {
    grid.innerHTML = `<div class="card" style="grid-column:1/-1;text-align:center;padding:32px;">
      <div class="card-title">No teams yet</div>
      <div class="text-sm text-muted">Use the form above to create your first team.</div>
    </div>`;
    return;
  }
  const hasTDs = ASSET_DB.technicalDirectors.length > 0;
  grid.innerHTML = APP.teams.map(t => {
    const tovr  = teamOvr(t);
    const spent = teamSpent(t);
    const ready = teamComplete(t);
    const slotsHtml = SLOT_ORDER.map(slot => {
      const assetId = t.assets[slot];
      const a       = getAsset(assetId);
      const isRes   = slot === 'reserve';
      const isTD    = slot === 'techDir';
      if (isTD && !hasTDs) return '';
      const rowCls  = isRes ? 'slot-reserve' : isTD ? 'slot-techdir' : '';
      return `<div class="slot-row ${rowCls}">
        <span class="slot-label">${SLOT_LABELS[slot]}</span>
        ${a
          ? `<span class="slot-fill">${escHtml(a.name)}</span>
             <span class="slot-ovr">OVR ${ovr(a)}</span>
             <button class="slot-remove" data-team="${t.id}" data-slot="${slot}">×</button>`
          : `<span class="slot-empty">— empty —</span>
             <button class="slot-assign" data-team="${t.id}" data-slot="${slot}">+ assign</button>`}
      </div>`;
    }).join('');
    return `<div class="team-card" style="--tc:${escHtml(t.color)}">
      <div class="team-head">
        <span class="team-dot"></span>
        <span class="team-name">${escHtml(t.name)}</span>
        ${tovr!=null?`<span class="team-ovr">OVR ${tovr}</span>`:''}
        <span class="team-spent">$${spent}M</span>
        ${ready?'<span class="tag tag-ready">Ready</span>':'<span class="tag tag-incomplete">Incomplete</span>'}
        ${!APP.season.started?`<div class="team-actions"><button class="btn btn-ghost btn-xs" data-del-team="${t.id}">Delete</button></div>`:''}
      </div>
      <div class="slot-grid">${slotsHtml}</div>
    </div>`;
  }).join('');
  grid.querySelectorAll('.slot-assign').forEach(b => b.addEventListener('click', () => openAssignModal(b.dataset.team, b.dataset.slot)));
  grid.querySelectorAll('.slot-remove').forEach(b => b.addEventListener('click', () => removeFromSlot(b.dataset.team, b.dataset.slot)));
  grid.querySelectorAll('[data-del-team]').forEach(b => b.addEventListener('click', () => deleteTeam(b.dataset.delTeam)));
}
function openAssignModal(teamId, slot) {
  const team = APP.teams.find(t => t.id === teamId);
  if (!team) return;
  const cat  = SLOT_TO_TYPE[slot];
  const pool = ASSET_DB[cat] || [];
  const available = pool.filter(a => !isAssigned(a.id));
  if (!available.length) { notify(`No ${TYPE_LABELS[cat]||cat} available`,'warn'); return; }
  const sorted = [...available].sort((a,b) => ovr(b) - ovr(a));
  openModal({
    title:`Assign ${SLOT_LABELS[slot]} → ${team.name}`,
    body:`<div class="modal-list">
      ${sorted.map(a => `<div class="modal-list-item" data-assign="${a.id}">
        <div class="flex-1">
          <div class="fw-700 text-sm">${escHtml(a.name)}</div>
          <div class="text-xs text-muted">${escHtml(a.nat||'')}</div>
        </div>
        <div class="mono text-xs"><span class="text-gold">$${priceOf(a.id)}M</span> · OVR ${ovr(a)}</div>
      </div>`).join('')}
    </div>`,
    actions:[{ label:'Cancel', cls:'btn-ghost', onClick:closeModal }],
  });
  document.querySelectorAll('[data-assign]').forEach(it =>
    it.addEventListener('click', () => doAssignAsset(teamId, slot, it.dataset.assign)));
}
function doAssignAsset(teamId, slot, assetId) {
  const team = APP.teams.find(t => t.id === teamId);
  if (!team || !getAsset(assetId)) return;
  team.assets[slot] = assetId;
  saveState(); closeModal(); renderTeams(); updateSidebar();
  notify('Assigned','success');
}
function removeFromSlot(teamId, slot) {
  if (APP.season.started) { notify('Season locked — use Admin → Driver Swap','warn'); return; }
  const team = APP.teams.find(t => t.id === teamId);
  if (!team) return;
  team.assets[slot] = null;
  saveState(); renderTeams(); updateSidebar();
}

/* ═══════════════════════════════════════════════════════════════
   PART 3 — Season · Strategy (Tyre + Aero) · Free Practice · Scoring
═══════════════════════════════════════════════════════════════ */

function renderSeason() {
  document.getElementById('season-name-input').value = APP.season.name;
  const rounds = APP.season.started ? APP.season.calendar.length : (APP.season.selectedTrackIds.length || 5);
  document.getElementById('season-rounds').value = rounds;
  document.getElementById('lock-season-btn').hidden   = APP.season.started;
  document.getElementById('unlock-season-btn').hidden = !APP.season.started;

  const trackCard = document.getElementById('season-track-grid')?.closest('.card');
  if (trackCard && !document.getElementById('track-search-input')) {
    const uniqueTypes = [...new Set(TRACKS.map(t => t.type))].sort();
    const typeOpts    = uniqueTypes.map(tp => `<option value="${escHtml(tp)}">${escHtml(tp)}</option>`).join('');
    trackCard.innerHTML = `
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px">
        <span class="card-title" style="margin-bottom:0">Assign Circuits</span>
        <span id="track-count-badge" class="track-count-badge">0 / ${TRACKS.length} selected</span>
      </div>
      <div class="track-controls">
        <input type="text" id="track-search-input" class="track-search" placeholder="🔍 Search…" autocomplete="off" />
        <select id="track-type-filter" class="track-type-sel">
          <option value="all">All types</option>${typeOpts}
        </select>
        <button class="btn btn-ghost btn-xs" id="track-clear-btn">Clear all</button>
      </div>
      <div class="track-grid-scroll"><div id="season-track-grid" class="track-grid"></div></div>`;
    document.getElementById('track-search-input').addEventListener('input', renderTrackGrid);
    document.getElementById('track-type-filter').addEventListener('change', renderTrackGrid);
    document.getElementById('track-clear-btn').addEventListener('click', () => {
      APP.season.selectedTrackIds = [];
      document.getElementById('season-rounds').value = 0;
      renderTrackGrid(); updateCalendarPreview();
    });
  }
  renderTrackGrid();
  updateCalendarPreview();
}
function renderTrackGrid() {
  const grid       = document.getElementById('season-track-grid');
  const search     = (document.getElementById('track-search-input')?.value || '').toLowerCase();
  const typeFilter = document.getElementById('track-type-filter')?.value || 'all';
  const filtered = TRACKS.filter(t => {
    const matchesText = !search || t.name.toLowerCase().includes(search) || t.country.toLowerCase().includes(search) || t.type.toLowerCase().includes(search);
    const matchesType = typeFilter === 'all' || t.type.toLowerCase().includes(typeFilter.toLowerCase());
    return matchesText && matchesType;
  });
  const selectedCount = APP.season.selectedTrackIds.length;
  grid.innerHTML = filtered.length ? filtered.map(t => {
    const active = APP.season.selectedTrackIds.includes(t.id);
    return `<div class="track-card ${active?'active':''}" data-track="${t.id}" title="${escHtml(t.country)} · ${escHtml(t.type)} · ${t.laps} laps">
      <div class="track-flag">${t.flag}</div>
      <div class="track-name">${escHtml(t.name)}</div>
      <div class="track-type">${escHtml(t.type)}</div>
      ${active?'<div class="track-selected-tick">✓</div>':''}
    </div>`;
  }).join('') : `<div class="text-dim text-sm" style="grid-column:1/-1;padding:12px">No circuits match.</div>`;
  const badge = document.getElementById('track-count-badge');
  if (badge) badge.textContent = `${selectedCount} / ${TRACKS.length} selected`;
  grid.querySelectorAll('[data-track]').forEach(c => c.addEventListener('click', () => toggleTrackInCalendar(c.dataset.track)));
}
function toggleTrackInCalendar(trackId) {
  if (APP.season.started) { notify('Season locked','warn'); return; }
  const idx = APP.season.selectedTrackIds.indexOf(trackId);
  if (idx >= 0) APP.season.selectedTrackIds.splice(idx,1);
  else APP.season.selectedTrackIds.push(trackId);
  document.getElementById('season-rounds').value = APP.season.selectedTrackIds.length || 1;
  renderTrackGrid(); updateCalendarPreview();
}
function updateCalendarPreview() {
  const target = parseInt(document.getElementById('season-rounds').value,10) || 0;
  let chosen = [...APP.season.selectedTrackIds];
  if (chosen.length < target) TRACKS.forEach(t => { if (!chosen.includes(t.id) && chosen.length < target) chosen.push(t.id); });
  if (chosen.length > target) chosen = chosen.slice(0, target);
  const preview = document.getElementById('calendar-preview');
  preview.innerHTML = chosen.map((trackId,i) => {
    const t = TRACKS.find(x => x.id === trackId); if (!t) return '';
    const r = APP.season.calendar[i];
    const status = r?.completed ? 'cal-done' : (APP.season.currentRound===i+1?'cal-current':'cal-pending');
    const statusText = r?.completed ? 'Complete' : (APP.season.currentRound===i+1?'Current':'Pending');
    return `<div class="calendar-race">
      <span class="cal-round">R${i+1}</span><span class="cal-flag">${t.flag}</span>
      <span class="cal-name">${escHtml(t.name)}</span>
      <span class="cal-status ${status}">${statusText}</span>
    </div>`;
  }).join('') || '<div class="text-sm text-dim">No tracks selected</div>';
}
function lockSeason() {
  const completeTeams = APP.teams.filter(teamComplete);
  if (completeTeams.length < 2) { notify('Need at least 2 complete teams','error'); return; }
  const target = parseInt(document.getElementById('season-rounds').value,10) || 0;
  if (target < 1) { notify('Select at least 1 race','error'); return; }
  let chosen = [...APP.season.selectedTrackIds];
  if (chosen.length < target) TRACKS.forEach(t => { if (!chosen.includes(t.id) && chosen.length < target) chosen.push(t.id); });
  chosen = chosen.slice(0, target);
  APP.season.name = document.getElementById('season-name-input').value.trim() || APP.season.name;
  APP.season.calendar = chosen.map(tid => ({ trackId:tid, weatherId:'dry', qualResults:null, raceResults:null, completed:false }));
  APP.season.selectedTrackIds = chosen;
  APP.season.started = true;
  APP.season.currentRound = 1;
  APP.season.teamStrategies = {};
  APP.season.teamAero = {};
  APP.season.roundCrises = {};
  initChampionship();
  saveState(); renderSeason(); updateSidebar(); updateRoundBadge();
  notify('🔒 Season locked. Run Free Practice next.','success');
}
function unlockSeason() {
  if (APP.season.calendar.some(r => r.completed)) { notify('Cannot unlock — races already completed.','error'); return; }
  openModal({
    title:'Unlock season?',
    body:'<div class="text-sm">Allows team and asset edits. Calendar will be preserved.</div>',
    actions:[
      { label:'Cancel', cls:'btn-ghost', onClick:closeModal },
      { label:'Unlock', cls:'btn-red',   onClick:() => {
        APP.season.started = false; APP.season.currentRound = 0;
        saveState(); closeModal(); renderSeason(); updateRoundBadge(); notify('Season unlocked','warn');
      }},
    ],
  });
}
function initChampionship() {
  APP.champ = { drivers:{}, constructors:{} };
  APP.teams.filter(teamComplete).forEach(t => {
    APP.champ.constructors[t.id] = { name:t.name, color:t.color, points:0, wins:0, podiums:0, history:[] };
    ['driver1','driver2'].forEach(slot => {
      const d = getAsset(t.assets[slot]); if (!d) return;
      APP.champ.drivers[driverKey(t.id,slot)] = {
        name:d.name, teamId:t.id, teamName:t.name, teamColor:t.color,
        slot, driverId:d.id, points:0, wins:0, podiums:0, poles:0, fl:0, dnfs:0, history:[],
      };
    });
  });
}

/* ─── STRATEGY PAGE (Tyre + Aero combined) ─────────────────── */
function renderStrategy() {
  const root = document.getElementById('strategy-content');
  if (!APP.season.started) {
    root.innerHTML = `<div class="card"><div class="text-sm text-muted">Lock the season first to set race strategies.</div></div>`;
    return;
  }
  const upcoming = APP.season.calendar.map((r,i) => ({ r,i })).filter(({r}) => !r.completed);
  if (!upcoming.length) {
    root.innerHTML = `<div class="card"><div class="text-sm text-muted">Season complete — all races have been run.</div></div>`;
    return;
  }
  const firstUpcoming = upcoming[0].i + 1;
  if (APP.ui.selectedStrategyRound == null || APP.season.calendar[APP.ui.selectedStrategyRound - 1]?.completed) {
    APP.ui.selectedStrategyRound = firstUpcoming;
  }
  const roundIdx     = APP.ui.selectedStrategyRound - 1;
  const round        = APP.season.calendar[roundIdx];
  const track        = TRACKS.find(t => t.id === round.trackId);
  const isRaceLocked = !!(round.raceResults);
  const weatherId    = round.qualResults?.weatherId || round.weatherId || 'dry';
  const weather      = WEATHER_OPTIONS.find(w => w.id === weatherId) || WEATHER_OPTIONS[0];
  const strategies   = getAvailableStrategies(weatherId);

  const tabsHtml = APP.season.calendar.map((r,i) => {
    const t = TRACKS.find(x => x.id === r.trackId);
    const active = APP.ui.selectedStrategyRound === i+1;
    return `<button class="strat-round-tab ${active?'active':''} ${r.completed?'done':''}" data-strat-round="${i+1}">
      <span class="round-flag">${t?.flag||''}</span>R${i+1} ${escHtml(t?.name||'')} ${r.completed?'✓':''}
    </button>`;
  }).join('');

  const lockedNotice = isRaceLocked
    ? `<div class="strategy-locked-notice"><span class="lock-icon">🔒</span><span>Race has started — strategies locked in.</span></div>` : '';

  const visibleTeams = APP.teams.filter(teamComplete);
  const recStrat = recommendedStrategy(track, weather);
  const recAero  = recommendedAero(track, weather);
  const recStratInfo = getStrategyInfo(recStrat);
  const recAeroInfo  = getAeroInfo(recAero);

  const trackInfo = `
    <div class="card mb-16" style="padding:14px 18px;">
      <div class="flex gap-12 flex-wrap" style="align-items:flex-start">
        <div class="flex-1">
          <div class="card-title">R${roundIdx+1} · ${track.flag} ${escHtml(track.name)} · ${weather.emoji} ${weather.label}</div>
          <div class="text-xs text-muted">
            ${track.type} · Tyre deg ${track.ch.tyre_deg}% · Power ${track.ch.power_dep}% · Downforce ${track.ch.downforce_dep}% · Overtaking ${track.ch.overtaking}%
          </div>
          <div class="text-xs mt-8" style="color:var(--green)">
            💡 Recommended: <strong>${recAeroInfo.icon} ${recAeroInfo.name}</strong> aero + <strong>${recStratInfo?.icon||''} ${recStratInfo?.name||'Auto'}</strong>
          </div>
        </div>
        <button class="btn btn-ghost btn-sm" id="strat-set-all-rec-btn">Set All to Recommended</button>
      </div>
    </div>`;

  root.innerHTML = `
    <div class="strategy-round-tabs" id="strat-round-tabs">${tabsHtml}</div>
    ${lockedNotice}
    ${trackInfo}
    <div class="strategy-teams-grid" id="strategy-teams-grid">
      ${visibleTeams.map(team => buildStrategyTeamCard(team, roundIdx, strategies, isRaceLocked, track, weather)).join('') || '<div class="card text-dim text-sm">No complete teams.</div>'}
    </div>`;

  document.querySelectorAll('[data-strat-round]').forEach(btn =>
    btn.addEventListener('click', () => { APP.ui.selectedStrategyRound = parseInt(btn.dataset.stratRound,10); renderStrategy(); }));
  document.querySelectorAll('[data-strat-key]').forEach(btn =>
    btn.addEventListener('click', () => { setTeamStrategy(btn.dataset.stratTid, parseInt(btn.dataset.stratRi,10), btn.dataset.stratKey); renderStrategy(); }));
  document.querySelectorAll('[data-aero-key]').forEach(btn =>
    btn.addEventListener('click', () => { setTeamAero(btn.dataset.aeroTid, parseInt(btn.dataset.aeroRi,10), btn.dataset.aeroKey); renderStrategy(); }));
  document.getElementById('strat-set-all-rec-btn')?.addEventListener('click', () => {
    APP.teams.filter(teamComplete).forEach(t => {
      setTeamStrategy(t.id, roundIdx, recStrat);
      setTeamAero(t.id, roundIdx, recAero);
    });
    renderStrategy();
  });
}

function buildStrategyTeamCard(team, roundIdx, strategies, isLocked, track, weather) {
  const currentStratKey = getTeamStrategy(team.id, roundIdx);
  const currentAeroKey  = getTeamAero(team.id, roundIdx);
  const stratInfo       = getStrategyInfo(currentStratKey) || strategies[0];
  const stratFit        = strategyTrackFit(currentStratKey, track);
  const aeroFit         = aeroTrackFit(currentAeroKey, track, weather);
  const recAero         = recommendedAero(track, weather);

  const aeroHtml = AERO_PACKAGES.map(p => {
    const isSel = currentAeroKey === p.id;
    const isRec = p.id === recAero;
    return `<div class="aero-package-card ${isSel?'selected':''} ${isLocked?'locked':''} ${isRec?'recommended':''}"
      data-aero-key="${p.id}" data-aero-tid="${team.id}" data-aero-ri="${roundIdx}"
      ${isSel?`style="--tc:${escHtml(team.color)}"`:''} title="${escHtml(p.desc)}">
      <div class="aero-icon">${p.icon}</div>
      <div class="aero-name">${escHtml(p.name)}</div>
      <div class="aero-desc">${escHtml(p.desc)}</div>
    </div>`;
  }).join('');

  const stratHtml = strategies.map(s => {
    const isSel = currentStratKey === s.id;
    const seqHtml = (s.compounds||[]).map((c,ci) =>
      `${ci>0?'<span class="compound-arrow">→</span>':''}<span class="compound-chip chip-${c}">${c}</span>`).join('');
    return `<div class="strategy-preset-card ${isSel?'selected':''} ${isLocked?'locked':''}"
      data-strat-key="${s.id}" data-strat-tid="${team.id}" data-strat-ri="${roundIdx}"
      ${isSel?`style="--tc:${escHtml(team.color)}"`:''}>
      <div class="preset-icon">${s.icon}</div>
      <div class="preset-name">${escHtml(s.name)}</div>
      <div class="compound-sequence">${seqHtml||'<span class="text-dim text-xs">Auto</span>'}</div>
      ${s.stops!=null?`<span class="preset-stops">${s.stops}-stop</span>`:''}
    </div>`;
  }).join('');

  const fitBadge = (fit) => {
    const cls = fit.rating === 'good' ? 'strat-set' : fit.rating === 'bad' ? 'strat-bad' : 'strat-auto';
    return `<span class="strategy-status-badge ${cls}">${fit.label}</span>`;
  };

  return `<div class="strategy-team-card" style="--tc:${escHtml(team.color)}">
    <div class="strategy-team-head">
      <div class="strategy-team-dot"></div>
      <div class="strategy-team-name">${escHtml(team.name)}</div>
      ${isLocked ? '<span class="strategy-status-badge strat-locked">🔒 Locked</span>' : ''}
    </div>
    <div class="strat-section-label">Aero Package ${fitBadge(aeroFit)}</div>
    <div class="aero-package-grid">${aeroHtml}</div>
    <div class="strat-section-label" style="margin-top:14px">Tyre Strategy ${fitBadge(stratFit)}</div>
    <div class="strategy-preset-grid">${stratHtml}</div>
  </div>`;
}

/* ─── FREE PRACTICE ──────────────────────────────────────── */
function renderFP() {
  const root = document.getElementById('fp-content');
  if (!APP.season.started) {
    root.innerHTML = `<div class="card"><div class="text-sm text-muted">Lock the season first.</div></div>`; return;
  }
  if (!APP.fpData) {
    root.innerHTML = `<div class="card">
      <div class="card-title">Pre-Season Free Practice</div>
      <div class="text-sm text-muted mb-12">One session · 3 stints (S/M/H) per driver · balanced reference circuit.</div>
      <button class="btn btn-red" id="fp-run-btn">▶ Run Free Practice Session</button>
    </div>`;
    document.getElementById('fp-run-btn').addEventListener('click', runFP); return;
  }
  renderFPReport();
}
function runFP() {
  const completeTeams = APP.teams.filter(teamComplete);
  if (!completeTeams.length) { notify('No complete teams','error'); return; }
  const refTrack = TRACKS.find(t => t.type==='Balanced') || TRACKS[5];
  const weather  = WEATHER_OPTIONS[0];
  const byDriver = [];
  completeTeams.forEach(team => {
    ['driver1','driver2'].forEach(slot => {
      const driverAsset = getAsset(team.assets[slot]); if (!driverAsset) return;
      const drvScore   = computeDriverScore(driverAsset, refTrack, weather);
      const carScore   = computeCarScore(team, refTrack, weather, 'balanced'); // FP uses balanced aero
      const totalScore = drvScore * 0.42 + carScore * 0.58;
      const baseLap    = refTrack.baseLap + (95 - totalScore) * 0.18;
      const consistency = driverAsset.ratings.Consistency || 80;
      const sigma      = (100 - consistency) / 70;
      const stints = [];
      [['S',5],['M',8],['H',10]].forEach(([compound, laps]) => {
        const tire = TIRE_COMPOUNDS[compound];
        const stint = { compound, name:tire.name, laps, lapTimes:[] };
        for (let i = 0; i < laps; i++) {
          stint.lapTimes.push(baseLap + tire.pace + Math.max(0, i-2) * tire.deg + gaussRand(0, sigma));
        }
        stint.avg  = stint.lapTimes.reduce((a,b) => a+b, 0) / stint.lapTimes.length;
        stint.best = Math.min(...stint.lapTimes);
        const mean = stint.avg;
        stint.std  = Math.sqrt(stint.lapTimes.reduce((s,t) => s+(t-mean)**2, 0) / stint.lapTimes.length);
        stint.deg  = stint.lapTimes.length >= 2 ? (stint.lapTimes[stint.lapTimes.length-1] - stint.lapTimes[0]) / (stint.lapTimes.length-1) : 0;
        stints.push(stint);
      });
      byDriver.push({
        teamId:team.id, teamName:team.name, teamColor:team.color,
        slot, driverId:driverAsset.id, driverName:driverAsset.name,
        carScore, drvScore, totalScore, consistency, stints,
      });
    });
  });
  APP.fpData = { weatherId:weather.id, refTrackId:refTrack.id, byDriver, generatedAt:new Date().toISOString() };
  APP.season.fpDone = true;
  saveState(); renderFPReport(); notify('Free Practice complete — report ready','success');
}
function renderFPReport() {
  const data     = APP.fpData;
  const refTrack = TRACKS.find(t => t.id === data.refTrackId) || TRACKS[5];
  const sorted   = [...data.byDriver].sort((a,b) => Math.min(...a.stints.flatMap(s=>s.lapTimes)) - Math.min(...b.stints.flatMap(s=>s.lapTimes)));
  const fastestOverall = Math.min(...sorted.flatMap(d => d.stints.flatMap(s => s.lapTimes)));
  const paceRows = sorted.map((d,i) => {
    const best  = Math.min(...d.stints.flatMap(s => s.lapTimes));
    const gap   = best - fastestOverall;
    const grade = gradeFromScore(d.totalScore);
    return `<tr>
      <td class="champ-pos">${i+1}</td>
      <td><span class="champ-dot" style="background:${escHtml(d.teamColor)}"></span>${escHtml(d.driverName)}</td>
      <td class="text-muted">${escHtml(d.teamName)}</td>
      <td class="mono">${fmtTime(best)}</td>
      <td class="mono text-dim">${i===0?'—':'+'+gap.toFixed(3)}</td>
      <td><span class="perf-grade ${grade.css}">${grade.g}</span></td>
    </tr>`;
  }).join('');
  const tyreSummary = ['S','M','H'].map(c => {
    const stints = data.byDriver.flatMap(d => d.stints.filter(s => s.compound===c));
    if (!stints.length) return '';
    const avg  = stints.reduce((a,s) => a+s.avg, 0) / stints.length;
    const deg  = stints.reduce((a,s) => a+s.deg, 0) / stints.length;
    const best = Math.min(...stints.map(s => s.best));
    const tire = TIRE_COMPOUNDS[c];
    return `<div class="card-sm card">
      <div class="card-title"><span class="tire-badge ${tire.css}">${c}</span> &nbsp; ${tire.name}</div>
      <div class="stat-row"><span class="stat-label">Best Lap</span><span class="stat-val mono">${fmtTime(best)}</span></div>
      <div class="stat-row"><span class="stat-label">Avg Pace</span><span class="stat-val mono">${fmtTime(avg)}</span></div>
      <div class="stat-row"><span class="stat-label">Degradation</span><span class="stat-val mono">${(deg*1000).toFixed(0)} ms/lap</span></div>
    </div>`;
  }).join('');
  document.getElementById('fp-content').innerHTML = `
    <div class="flex gap-12 mb-16 flex-wrap">
      <button class="btn btn-ghost" id="fp-rerun-btn">⟳ Re-run Practice</button>
      <span class="ml-auto text-xs text-muted">Reference track: ${refTrack.flag} ${escHtml(refTrack.name)} · ${new Date(data.generatedAt).toLocaleString()}</span>
    </div>
    <div class="card">
      <div class="card-title">Pace Ranking</div>
      <table class="champ-table">
        <thead><tr><th>Pos</th><th>Driver</th><th>Team</th><th>Best</th><th>Gap</th><th>Grade</th></tr></thead>
        <tbody>${paceRows}</tbody>
      </table>
    </div>
    <div class="card">
      <div class="card-title">Tyre Performance Summary</div>
      <div class="grid-3">${tyreSummary}</div>
    </div>`;
  document.getElementById('fp-rerun-btn').addEventListener('click', () => { if (confirm('Re-run Free Practice?')) runFP(); });
}

/* ─── SCORING ENGINE (v3) ────────────────────────────────────
   Key changes from v2:
   - Aero asset removed; aero comes from per-race AERO_PACKAGES choice
   - Strategy + Aero fit can swing pace ~1.0s/lap good vs bad
   - TD has BIGGER effects: setup_mastery → real pace bonus
   - Reliability_Focus → real DNF reduction (was tiny, now meaningful)
   - More variance: race-day form wobble per car
═══════════════════════════════════════════════════════════ */
function computeCarScore(team, track, weather, aeroPkgKey) {
  const eng   = getAsset(team.assets.engine);
  const strat = getAsset(team.assets.strategist);
  const pit   = getAsset(team.assets.pitcrew);
  const prin  = getAsset(team.assets.principal);
  const td    = getAsset(team.assets.techDir);
  if (!eng || !strat || !pit || !prin) return 60;
  const ch = track.ch, w = weather.mods;
  const isHighSpeed = ch.power_dep > 65;

  const engScore = clamp(
      (eng.ratings.Power      || 80) * (0.35 * ch.power_dep / 100 + 0.15) * w.power
    + (eng.ratings.Reliability|| 80) * 0.20 * w.reliability
    + (eng.ratings.Deployment || 80) * 0.15
    + (eng.ratings.Fuel_Eff   || 80) * 0.10
    + (eng.ratings.Thermal    || 80) * 0.05,
    0, 100);

  /* AERO PACKAGE — replaces aero asset.
     Each package gives a flat aero score modifier based on its
     fit with the track + weather. Range ~50-100. */
  const aeroFit  = aeroTrackFit(aeroPkgKey || 'balanced', track, weather);
  const aeroBase = aeroPkgKey === 'aggressive' ? 84
                 : aeroPkgKey === 'balanced'   ? 78
                 : 80;
  /* aeroFit.mod is in lap-time seconds: negative = good, positive = bad
     translate to score: -0.5s ≈ +18 score; +0.5s ≈ -18 score */
  const aeroScore = clamp(aeroBase + (-aeroFit.mod * 35), 35, 100);

  const stratScore = (
      (strat.ratings.Undercut       || 80)
    + (strat.ratings.Overcut        || 80)
    + (strat.ratings.Safety_Car     || 80) * w.sc
    + (strat.ratings.Tyre_Choice    || 80)
    + (strat.ratings.Pitstop_Timing || 80)
  ) / 5;
  const pitScore = (
      (pit.ratings.Stop_Time          || 80)
    + (pit.ratings.Reliability        || 80) * w.reliability
    + (pit.ratings.Undercut_Exec      || 80)
    + (pit.ratings.Pressure_Handling  || 80)
    + (pit.ratings.Multi_Stop         || 80)
  ) / 5;
  const prinScore = (
      (prin.ratings.Strategy    || 80)
    + (prin.ratings.Morale      || 80)
    + (prin.ratings.Budget_Mgmt || 80)
    + (prin.ratings.Driver_Mgmt || 80)
  ) / 4;

  const hasTDs = ASSET_DB.technicalDirectors?.length > 0;
  if (hasTDs && td) {
    /* TD now has BIGGER influence — bumped from 12% to 16% */
    const tdScore = clamp(
        (td.ratings.Technical_Knowledge || 80) * 0.26
      + (td.ratings.Dev_Speed           || 80) * 0.18
      + (td.ratings.Reliability_Focus   || 80) * 0.22
      + (td.ratings.Innovation          || 80) * 0.16
      + (td.ratings.Setup_Mastery       || 80) * 0.14
      + (td.ratings.Race_Engineering    || 80) * 0.04,
      20, 100);
    return clamp(
        engScore  * 0.26   // 26% engine
      + aeroScore * 0.24   // 24% aero (now per-race choice)
      + tdScore   * 0.16   // 16% TD (was 12%)
      + stratScore* 0.14   // 14% strategist
      + pitScore  * 0.13   // 13% pit
      + prinScore * 0.07,  // 7% principal
      20, 100);
  }
  /* Without TD: 30/28/16/16/10 = 100 */
  return clamp(
      engScore  * 0.30
    + aeroScore * 0.28
    + stratScore* 0.16
    + pitScore  * 0.16
    + prinScore * 0.10,
    20, 100);
}

function computeDriverScore(driver, track, weather) {
  if (!driver?.ratings) return 70;
  const r = driver.ratings, ch = track.ch, wetMix = weather.mods.wet;
  return clamp(
      (r.Pace        || 80) * 0.30
    + (r.Racecraft   || 80) * (0.18 + 0.10 * ch.overtaking / 100)
    + (r.Wet_Weather || 80) * (0.05 + 0.20 * wetMix * ch.wet_sens / 100)
    + (r.Tyre_Mgmt   || 80) * (0.08 + 0.10 * ch.tyre_deg / 100)
    + (r.Consistency || 80) * 0.12
    + (r.Qualifying  || 80) * 0.07,
    20, 100);
}

function activeDriversForTeam(team, roundIdx) {
  /* Honours injury crisis: swaps injured drivers with reserve */
  return ['driver1','driver2'].map(slot => {
    const asset = getEffectiveDriver(team, slot, roundIdx);
    return asset ? { slot, asset, injured: isDriverInjured(team.id, slot, roundIdx) } : null;
  }).filter(Boolean);
}

/* ═══════════════════════════════════════════════════════════════
   PART 4 — Qualifying · Crisis · Race Simulation (v3)
═══════════════════════════════════════════════════════════════ */

function renderQual() {
  const root = document.getElementById('qualifying-content');
  if (!APP.season.started) { root.innerHTML = `<div class="card"><div class="text-sm text-muted">Lock the season first.</div></div>`; return; }
  if (!APP.season.fpDone)  {
    root.innerHTML = `<div class="card">
      <div class="card-title">Free Practice required</div>
      <div class="text-sm text-muted">Run the pre-season Free Practice before qualifying.</div>
      <button class="btn btn-red mt-12" onclick="document.querySelector('.nav-tab[data-page=fp]').click()">Go to Practice →</button>
    </div>`; return;
  }
  const round = APP.season.calendar[APP.season.currentRound - 1];
  if (!round) { root.innerHTML = `<div class="card"><div class="text-sm">Season complete.</div></div>`; return; }
  const track = TRACKS.find(t => t.id === round.trackId);
  if (round.qualResults) { renderQualResults(round, track); return; }
  const weatherSelectors = WEATHER_OPTIONS.map(w =>
    `<button class="w-pill ${APP.ui.qualWeather===w.id?'active':''}" data-weather="${w.id}">${w.emoji} ${w.label}</button>`).join('');
  root.innerHTML = `
    <div class="card">
      <div class="card-title">Round ${APP.season.currentRound} — ${track.flag} ${escHtml(track.name)} GP</div>
      <div class="cond-grid mb-16">
        <div class="cond-card"><div class="cond-val">${track.ch.overtaking}%</div><div class="cond-lbl">Overtaking</div></div>
        <div class="cond-card"><div class="cond-val">${track.ch.tyre_deg}%</div><div class="cond-lbl">Tyre Deg</div></div>
        <div class="cond-card"><div class="cond-val">${track.ch.power_dep}%</div><div class="cond-lbl">Power Dep</div></div>
        <div class="cond-card"><div class="cond-val">${track.ch.downforce_dep}%</div><div class="cond-lbl">Downforce</div></div>
        <div class="cond-card"><div class="cond-val">${track.ch.sc_base}%</div><div class="cond-lbl">SC Risk</div></div>
        <div class="cond-card"><div class="cond-val">${track.laps}</div><div class="cond-lbl">Race Laps</div></div>
      </div>
      <div class="card-title">Weather (applies to both qualifying AND race)</div>
      <div class="weather-row mb-16" id="qual-weather-row">${weatherSelectors}</div>
      <button class="btn btn-red" id="qual-run-btn">▶ Run Qualifying</button>
    </div>`;
  document.querySelectorAll('#qual-weather-row .w-pill').forEach(b =>
    b.addEventListener('click', () => { APP.ui.qualWeather = b.dataset.weather; renderQual(); }));
  document.getElementById('qual-run-btn').addEventListener('click', runQualifying);
}
function runQualifying() {
  const round   = APP.season.calendar[APP.season.currentRound - 1];
  const track   = TRACKS.find(t => t.id === round.trackId);
  const weather = WEATHER_OPTIONS.find(w => w.id === APP.ui.qualWeather);
  const roundIdx = APP.season.currentRound - 1;
  round.weatherId = weather.id;
  const entries = [];
  APP.teams.filter(teamComplete).forEach(team => {
    const aeroKey = getTeamAero(team.id, roundIdx);
    activeDriversForTeam(team, roundIdx).forEach(({ slot, asset, injured }) => {
      const carScore = computeCarScore(team, track, weather, aeroKey);
      const drvScore = computeDriverScore(asset, track, weather);
      const qualBoost = ((asset.ratings.Qualifying || 80) - 80) * 0.04;
      const totalScore = carScore * 0.50 + drvScore * 0.50;
      const sigma = (100 - (asset.ratings.Consistency||80)) / 60; // bumped variance slightly
      let lapTime = track.baseLap + (95 - totalScore) * 0.18 - qualBoost + gaussRand(0, sigma);
      let note = injured ? 'Reserve driver' : null;
      if (Math.random() < 0.04) { lapTime += rand(0.8,2.0); note = note ? note+' · Lock-up' : 'Lock-up'; }
      if (weather.id==='wet'||weather.id==='mixed') lapTime += (90-(asset.ratings.Wet_Weather||80)) * 0.04;
      entries.push({ teamId:team.id, teamName:team.name, teamColor:team.color, slot, driverId:asset.id, driverName:asset.name, lapTime, note, carScore, drvScore, injured });
    });
  });
  entries.sort((a,b) => a.lapTime - b.lapTime);
  const pole = entries[0]?.lapTime || 0;
  entries.forEach((e,i) => { e.position = i+1; e.gap = i===0 ? 0 : e.lapTime - pole; });
  round.qualResults = { weatherId:weather.id, entries, generatedAt:new Date().toISOString() };
  const poleEntry = entries[0];
  if (poleEntry && !poleEntry.injured) { const dk = driverKey(poleEntry.teamId, poleEntry.slot); if (APP.champ.drivers[dk]) APP.champ.drivers[dk].poles++; }
  saveState(); renderQualResults(round, track);
}
function renderQualResults(round, track) {
  const weather = WEATHER_OPTIONS.find(w => w.id === round.weatherId) || WEATHER_OPTIONS[0];
  const root = document.getElementById('qualifying-content');
  root.innerHTML = `
    <div class="card">
      <div class="flex gap-12 mb-12 flex-wrap">
        <div>
          <div class="card-title" style="margin-bottom:4px;">Round ${APP.season.currentRound} — ${track.flag} ${escHtml(track.name)}</div>
          <div class="text-sm text-muted">${weather.emoji} ${weather.label} · Pole: <span class="text-gold fw-700">${escHtml(round.qualResults.entries[0].driverName)}</span> · ${fmtTime(round.qualResults.entries[0].lapTime)}</div>
        </div>
        <div class="ml-auto flex gap-8">
          <button class="btn btn-red" id="qual-to-race-btn">Go to Race →</button>
          <button class="btn btn-ghost" id="qual-rerun-btn">⟳ Re-run</button>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="card-title">Starting Grid</div>
      <div class="qual-result-list" id="qual-list"></div>
    </div>`;
  const list = document.getElementById('qual-list');
  list.innerHTML = round.qualResults.entries.map((e,i) => {
    const pCls = i===0?'q1':i===1?'q2':i===2?'q3':'';
    return `<div class="qual-row" style="--qc:${escHtml(e.teamColor)}" data-idx="${i}">
      <div class="q-pos ${pCls}">${e.position}</div>
      <div class="q-name">
        <div class="q-driver-name">${escHtml(e.driverName)} ${i===0?'<span class="q-pole-badge">POLE</span>':''} ${e.injured?'<span class="q-pole-badge" style="background:rgba(171,71,188,0.2);color:var(--purple);border-color:rgba(171,71,188,0.4)">RES</span>':''}</div>
        <div class="q-team-name">${escHtml(e.teamName)}${e.note?` · ${e.note}`:''}</div>
      </div>
      <div class="q-time">${fmtTime(e.lapTime)}</div>
      <div class="q-gap">${i===0?'—':'+'+e.gap.toFixed(3)}</div>
    </div>`;
  }).join('');
  const rows = [...list.querySelectorAll('.qual-row')];
  [...rows].reverse().forEach((row,i) => setTimeout(() => row.classList.add('revealed'), 80*i));
  document.getElementById('qual-to-race-btn').addEventListener('click', () => showPage('race'));
  document.getElementById('qual-rerun-btn').addEventListener('click', () => {
    if (confirm('Re-run qualifying for this round?')) { round.qualResults=null; saveState(); renderQual(); }
  });
}

/* ─── CRISIS MECHANIC ───────────────────────────────────────
   At the 50% mark of the season, the Driver 2s of the current
   constructors' P1 and P2 are involved in a single crash and
   both miss that race. Their reserves take over for one race.
   Standings are taken from points BEFORE the crisis race.
═══════════════════════════════════════════════════════════ */
function rollInjuryCrisis(roundIdx) {
  if (APP.season.roundCrises[roundIdx]) return APP.season.roundCrises[roundIdx]; // already rolled

  const total = APP.season.calendar.length;
  /* Fire on the race at the 50% midpoint of the season (1-indexed).
     5 races → R3, 6 → R3, 10 → R5, 8 → R4. */
  const crisisRound = Math.max(1, Math.ceil(total / 2));
  const currentRound = roundIdx + 1;
  if (currentRound !== crisisRound) {
    APP.season.roundCrises[roundIdx] = { rolled: true, injured: [], promotions: [] };
    return APP.season.roundCrises[roundIdx];
  }

  /* Rank constructors by championship points right now */
  const ranked = APP.teams
    .filter(t => teamComplete(t))
    .map(t => ({ team: t, pts: APP.champ.constructors[t.id]?.points || 0 }))
    .sort((a, b) => {
      if (b.pts !== a.pts) return b.pts - a.pts;
      /* Tiebreaker: higher team OVR first, then stable by id */
      return (teamOvr(b.team) || 0) - (teamOvr(a.team) || 0);
    });

  if (ranked.length < 2) {
    APP.season.roundCrises[roundIdx] = { rolled: true, injured: [], promotions: [] };
    return APP.season.roundCrises[roundIdx];
  }

  const [first, second] = ranked;
  const injured = [], promotions = [];
  [first, second].forEach(({ team }) => {
    const driver = getAsset(team.assets.driver2);
    const reserve = getAsset(team.assets.reserve);
    if (!driver) return; /* no D2 at all → skip this team silently */
    injured.push({
      teamId: team.id, teamName: team.name, teamColor: team.color,
      slot: 'driver2', driverName: driver.name,
    });
    if (reserve) {
      promotions.push({
        teamId: team.id, injuredSlot: 'driver2',
        replacementId: reserve.id, replacementName: reserve.name,
      });
    }
    /* If no reserve, the seat is empty for the race — handled by
       getEffectiveDriver returning null & activeDriversForTeam filtering. */
  });

  const crisis = {
    rolled: true, injured, promotions,
    headline: pickCrisisHeadline(first.team, second.team),
    isMidseasonCrash: true,
  };
  APP.season.roundCrises[roundIdx] = crisis;
  saveState();
  return crisis;
}
function pickCrisisHeadline(t1, t2) {
  const a = t1?.name || 'Leader';
  const b = t2?.name || 'P2';
  const headlines = [
    `MID-SEASON CHAOS — ${a.toUpperCase()} & ${b.toUpperCase()} #2 DRIVERS COLLIDE IN PADDOCK`,
    `TITLE FIGHT TURNS UGLY — ${a.toUpperCase()} VS ${b.toUpperCase()} CRASH SIDELINES BOTH SECOND DRIVERS`,
    `BREAKING — ${a.toUpperCase()} & ${b.toUpperCase()} #2 SEATS DOWN AFTER FREAK COLLISION`,
    `PADDOCK PILE-UP — ${a.toUpperCase()} AND ${b.toUpperCase()} SECOND DRIVERS HOSPITALISED`,
    `SEASON-DEFINING INCIDENT — ${a.toUpperCase()} & ${b.toUpperCase()} #2s INJURED IN PRE-RACE CRASH`,
  ];
  return headlines[Math.floor(Math.random() * headlines.length)];
}

function showCrisisPopup(crisis, onContinue) {
  if (!crisis.injured.length) { onContinue?.(); return; }
  const popup = document.getElementById('crisis-popup');
  const card  = document.getElementById('crisis-card');
  card.innerHTML = `
    <div class="crisis-flash-bar">🚨 RACE WEEK CRISIS 🚨</div>
    <div class="crisis-title">${escHtml(crisis.headline)}</div>
    <div class="crisis-incident">A mid-season collision between the championship leader and the closest challenger has taken out both of their Driver 2s. Both miss this Grand Prix only — reserves are activated for this race.</div>
    <div class="crisis-injured">
      ${crisis.injured.map(inj => {
        const promo = crisis.promotions.find(p => p.teamId === inj.teamId && p.injuredSlot === inj.slot);
        return `<div class="crisis-injured-card" style="border-left:3px solid ${escHtml(inj.teamColor)}">
          <div class="crisis-injured-driver">🤕 ${escHtml(inj.driverName)}</div>
          <div class="crisis-injured-team">${escHtml(inj.teamName)} · ${inj.slot === 'driver1' ? 'Driver 1' : 'Driver 2'}</div>
          ${promo ? `<div class="crisis-injured-replacement">↪ Reserve: <strong>${escHtml(promo.replacementName)}</strong></div>` : `<div class="crisis-injured-no-replacement">No reserve available — car will not start</div>`}
        </div>`;
      }).join('')}
    </div>
    <button class="btn btn-red crisis-dismiss-btn" id="crisis-dismiss-btn">Acknowledge — Continue to Lights Out</button>`;
  popup.hidden = false;
  document.getElementById('crisis-dismiss-btn').addEventListener('click', () => {
    popup.hidden = true;
    onContinue?.();
  });
}

/* ─── RACE SIMULATION ─────────────────────────────────────── */
function renderRace() {
  const root = document.getElementById('race-content');
  if (!APP.season.started) { root.innerHTML=`<div class="card"><div class="text-sm text-muted">Lock the season first.</div></div>`; return; }
  const round = APP.season.calendar[APP.season.currentRound - 1];
  if (!round) { root.innerHTML=`<div class="card"><div class="text-sm">Season complete.</div></div>`; return; }
  if (!round.qualResults) {
    root.innerHTML=`<div class="card">
      <div class="card-title">Qualifying required</div>
      <button class="btn btn-red mt-12" onclick="document.querySelector('.nav-tab[data-page=qualifying]').click()">Go to Qualifying →</button>
    </div>`; return;
  }
  if (round.raceResults) { renderRaceComplete(round); return; }
  const track   = TRACKS.find(t => t.id === round.trackId);
  const weather = WEATHER_OPTIONS.find(w => w.id === round.weatherId) || WEATHER_OPTIONS[0];
  const roundIdx = APP.season.currentRound - 1;

  /* Show strategy + aero summary */
  const stratRows = APP.teams.filter(teamComplete).map(team => {
    const sKey = getTeamStrategy(team.id, roundIdx);
    const aKey = getTeamAero(team.id, roundIdx);
    const sInfo = getStrategyInfo(sKey);
    const aInfo = getAeroInfo(aKey);
    const sFit = strategyTrackFit(sKey, track);
    const aFit = aeroTrackFit(aKey, track, weather);
    const seqHtml = (sInfo?.compounds||[]).map((c,ci) =>
      `${ci>0?'<span class="compound-arrow" style="font-size:8px;color:var(--text-3)">→</span>':''}<span class="compound-chip chip-${c}" style="width:18px;height:18px;font-size:8px;">${c}</span>`).join('');
    const fitClass = (fit) => fit.rating === 'good' ? 'text-green' : fit.rating === 'bad' ? 'text-accent' : 'text-muted';
    return `<div class="flex gap-8" style="font-size:12px;padding:6px 0;border-bottom:1px solid var(--border)">
      <span class="champ-dot" style="background:${escHtml(team.color)};width:8px;height:8px;border-radius:50%;flex-shrink:0;margin-top:4px"></span>
      <span style="flex:1;font-weight:600">${escHtml(team.name)}</span>
      <span style="font-size:11px">${aInfo.icon} <span class="${fitClass(aFit)}">${aFit.label}</span></span>
      <span style="font-size:10px;color:var(--text-2)">${sInfo?.name||'Auto'}</span>
      <div class="compound-sequence" style="gap:2px;margin:0">${seqHtml||'<span class="text-dim text-xs">Auto</span>'}</div>
    </div>`;
  }).join('');

  root.innerHTML = `
    <div class="card">
      <div class="flex gap-12 mb-8 flex-wrap">
        <div>
          <div class="card-title">Round ${APP.season.currentRound} — ${track.flag} ${escHtml(track.name)}</div>
          <div class="text-sm text-muted">${weather.emoji} ${weather.label} · ${track.laps} laps · ${round.qualResults.entries.length} cars</div>
        </div>
        <div class="ml-auto"><button class="btn btn-red" id="race-init-btn">▶ Lights Out</button></div>
      </div>
      ${stratRows ? `<div class="card-title" style="margin-top:12px">Team Race Setups</div>${stratRows}` : ''}
    </div>
    <div id="race-stage"></div>`;
  document.getElementById('race-init-btn').addEventListener('click', () => {
    /* Roll crisis check first */
    const crisis = rollInjuryCrisis(roundIdx);
    if (crisis.injured.length) {
      showCrisisPopup(crisis, () => initiateRace());
    } else {
      initiateRace();
    }
  });
}

function initiateRace() {
  const stage = document.getElementById('race-stage');
  stage.innerHTML = `
    <div class="card">
      <div class="card-title text-accent">Lights sequence</div>
      <div class="lights-container" id="lights-container">
        ${[1,2,3,4,5].map(() => `<div class="light-housing"><div class="light-bulb"></div><div class="light-bulb"></div></div>`).join('')}
      </div>
      <div class="text-sm text-muted" style="text-align:center">Hold tight…</div>
    </div>`;
  const housings = stage.querySelectorAll('.light-housing');
  let i = 0;
  const turnOn = () => {
    if (i >= 5) {
      const holdMs = 600 + Math.random() * 1800;
      setTimeout(() => {
        housings.forEach(h => h.querySelectorAll('.light-bulb').forEach(b => b.classList.remove('on')));
        setTimeout(startRace, 400);
      }, holdMs);
      return;
    }
    housings[i].querySelectorAll('.light-bulb').forEach(b => b.classList.add('on'));
    i++; setTimeout(turnOn, 1000);
  };
  setTimeout(turnOn, 600);
}

function startRace() {
  const round    = APP.season.calendar[APP.season.currentRound - 1];
  const track    = TRACKS.find(t => t.id === round.trackId);
  const weather  = WEATHER_OPTIONS.find(w => w.id === round.weatherId);
  const roundIdx = APP.season.currentRound - 1;

  const cars = round.qualResults.entries.map((e, i) => {
    const team   = APP.teams.find(t => t.id === e.teamId);
    const driver = getAsset(e.driverId);
    const aeroKey = getTeamAero(team.id, roundIdx);
    const aeroPkg = getAeroInfo(aeroKey);
    const aeroFit = aeroTrackFit(aeroKey, track, weather);
    const stratKey = getTeamStrategy(team.id, roundIdx);
    const stratFit = strategyTrackFit(stratKey, track);
    const carScore = computeCarScore(team, track, weather, aeroKey);
    const drvScore = computeDriverScore(driver, track, weather);
    const totalScore = carScore * 0.55 + drvScore * 0.45;

    const availStrats = getAvailableStrategies(weather.id);
    const chosenStrat = availStrats.find(s => s.id === stratKey);
    const isAutoStrat = !chosenStrat || chosenStrat.compounds === null;
    const strategyCompounds = isAutoStrat ? null : chosenStrat.compounds;
    const targetStops = isAutoStrat ? chooseTargetStops(track, drvScore) : chosenStrat.stops;

    let startCompound;
    if (weather.id === 'wet') startCompound = 'W';
    else if (weather.id === 'mixed') startCompound = 'I';
    else if (strategyCompounds) startCompound = strategyCompounds[0];
    else startCompound = 'M';

    /* TD effects — BIGGER now */
    const tdAsset = getAsset(team.assets.techDir);
    const tdReliBonus = tdAsset ? Math.max(0, (tdAsset.ratings.Reliability_Focus||80) - 70) * 0.012 : 0;
    const tdPaceBonus = tdAsset ? Math.max(0, (tdAsset.ratings.Setup_Mastery||80) - 80) * 0.012 : 0; // seconds/lap
    const tdInnovBonus = tdAsset && Math.random() < ((tdAsset.ratings.Innovation||80) - 75) * 0.005
      ? (tdAsset.ratings.Innovation||80) * 0.005 : 0;

    /* Race-day form wobble — varies each race so the best team isn't always best */
    const raceDayWobble = gaussRand(0, 0.6); // ±0.6s/lap typical

    /* Aero affects degradation too */
    const aeroDegMult = aeroKey === 'aggressive' ? 1.30 : aeroKey === 'high_df' ? 1.08 : 1.0;

    return {
      teamId:team.id, teamName:team.name, teamColor:team.color,
      slot:e.slot, driverId:driver.id, driverName:driver.name,
      startPos:e.position, position:e.position, gridGap:e.gap,
      carScore, drvScore, totalScore,
      targetStops, stopsDone:0,
      compound:startCompound, tireAge:0,
      totalTime: i * 0.3, lastLapTime:0, fastestLap:Infinity,
      pitStops:[], events:[],
      dnf:false, dnfLap:null, dnfReason:null,
      reliabilityRating: getAsset(team.assets.engine)?.ratings.Reliability || 85,
      tdReliBonus, tdPaceBonus, tdInnovBonus, raceDayWobble,
      pitTime: clamp(28 - ((getAsset(team.assets.pitcrew)?.ratings.Stop_Time||85) - 80) * 0.18, 21, 30),
      strategyCompounds, stintIdx: 0, isAutoStrat,
      teamRef: team, aeroPkg, aeroKey, aeroFit, stratFit, aeroDegMult,
      reserveDriver: e.injured,
    };
  });

  APP.race.state = {
    track, weather, lap:0, totalLaps:track.laps,
    cars, events:[],
    scActive:false, scLapsRemaining:0, scTriggered:0,
    roundIdx,
  };
  APP.race.running = true; APP.race.paused = false; APP.race.speedKey = '1x';
  renderRaceLive();
  scheduleNextLap();
}

function chooseTargetStops(track, drvScore) {
  const deg = track.ch.tyre_deg;
  if (deg < 50 && drvScore > 88) return 1;
  if (deg > 85 && Math.random() < 0.30) return 3;
  return 2;
}

function renderRaceLive() {
  const stage = document.getElementById('race-stage');
  const s     = APP.race.state;
  stage.innerHTML = `
    <div class="race-container">
      <div class="race-header">
        <span class="live-pill"><span class="live-dot"></span>LIVE</span>
        <span class="race-circuit">${s.track.flag} ${escHtml(s.track.name)}</span>
        <span class="sc-banner ${s.scActive?'show':''}" id="sc-banner">🟡 SAFETY CAR</span>
        <span class="race-lap-disp" id="race-lap-disp">Lap ${s.lap}/${s.totalLaps}</span>
      </div>
      <div class="race-progress-bar"><div class="race-progress-fill" id="race-progress" style="width:0%"></div></div>
      <div class="race-controls">
        <button class="btn btn-ghost btn-sm" id="race-pause-btn">⏸ Pause</button>
        <button class="btn btn-ghost btn-sm" id="race-skip-btn">⏭ Skip to End</button>
        <div class="race-speed-control">
          <label>Speed</label>
          <select id="race-speed-select">
            <option value="0.25x">0.25×</option>
            <option value="1x" selected>1×</option>
            <option value="4x">4×</option>
          </select>
        </div>
      </div>
      <div class="timing-table" id="timing-table"></div>
      <div class="events-ticker" id="events-ticker"></div>
    </div>`;
  document.getElementById('race-pause-btn').addEventListener('click', toggleRacePause);
  document.getElementById('race-skip-btn').addEventListener('click', skipRaceToEnd);
  document.getElementById('race-speed-select').addEventListener('change', e => { APP.race.speedKey = e.target.value; });
  renderTimingTable();
}

function renderTimingTable() {
  const s      = APP.race.state;
  const sorted = [...s.cars].sort((a, b) => {
    if (a.dnf && !b.dnf) return 1; if (b.dnf && !a.dnf) return -1;
    if (a.dnf && b.dnf)  return (b.dnfLap || 0) - (a.dnfLap || 0);
    return a.totalTime - b.totalTime;
  });
  const leader = sorted.find(c => !c.dnf);
  sorted.forEach((c, i) => { if (!c.dnf) { const np = i+1; if (np !== c.position && c.position) c._posChanged = true; c.position = np; } });
  let flTime = Infinity, flHolder = null;
  s.cars.filter(c => !c.dnf).forEach(c => { if (c.fastestLap < flTime) { flTime = c.fastestLap; flHolder = c; } });
  const html = sorted.map(c => {
    const tire     = TIRE_COMPOUNDS[c.compound];
    const pastCliff = c.tireAge > tire.cliff;
    const isFLLeader = flHolder && c === flHolder && s.lap > 3;
    let posDisplay, gapDisplay;
    if (c.dnf) {
      posDisplay = `<span class="t-pos dnf">DNF</span>`;
      gapDisplay = `<span class="t-gap text-accent">L${c.dnfLap}</span>`;
    } else {
      const pcls = c.position===1?'p1':c.position===2?'p2':c.position===3?'p3':'';
      posDisplay = `<span class="t-pos ${pcls}">${c.position}</span>`;
      gapDisplay = `<span class="t-gap">${c===leader?'LEADER':'+' + (c.totalTime - leader.totalTime).toFixed(3)}</span>`;
    }
    const flash = c._posChanged ? 'pos-change' : '';
    if (c._posChanged) c._posChanged = false;
    const stratLabel = c.strategyCompounds ? `<span class="t-strategy">${c.strategyCompounds.join('→')}</span>` : '';
    const aeroLabel = `<span class="t-strategy" title="${c.aeroPkg.name}">${c.aeroPkg.icon}</span>`;
    const flBadge  = isFLLeader ? `<span class="t-fl-badge">⚡FL</span>` : '';
    const tireCls  = pastCliff && !c.dnf ? 'tire-warn' : '';
    const rowCls   = [flash, isFLLeader ? 'fl-leader' : '', c.reserveDriver ? 'reserve-driver' : ''].filter(Boolean).join(' ');
    return `<div class="timing-row ${rowCls}" style="--rc:${escHtml(c.teamColor)}">
      ${posDisplay}<span class="t-dot"></span>
      <div class="t-driver">
        <div class="t-driver-name">${escHtml(c.driverName)} ${c.reserveDriver?'<span style="font-size:9px;color:var(--purple)">[RES]</span>':''}</div>
        <div class="t-driver-team">${escHtml(c.teamName)}</div>
      </div>
      <span class="tire-badge ${tire.css} ${tireCls}">${c.compound}${c.dnf ? '' : ` ${c.tireAge}`}</span>
      ${flBadge}${aeroLabel}${stratLabel}
      <span class="t-stops">${c.stopsDone}/${c.targetStops}</span>
      ${gapDisplay}
    </div>`;
  }).join('');
  document.getElementById('timing-table').innerHTML = html;
  document.getElementById('race-lap-disp').textContent = `Lap ${s.lap}/${s.totalLaps}`;
  document.getElementById('race-progress').style.width = `${(s.lap / s.totalLaps) * 100}%`;
  document.getElementById('sc-banner')?.classList.toggle('show', s.scActive);
}

function pushEvent(text, cls='') {
  const s = APP.race.state;
  s.events.push({ lap:s.lap, text, cls });
  const ticker = document.getElementById('events-ticker');
  if (ticker) {
    ticker.insertAdjacentHTML('afterbegin', `<div class="event-line"><span class="lap-tag">L${s.lap}</span><span class="${cls}">${text}</span></div>`);
    while (ticker.children.length > 60) ticker.removeChild(ticker.lastChild);
  }
}

function scheduleNextLap() {
  if (!APP.race.running || APP.race.paused) return;
  const ms = RACE_SPEEDS[APP.race.speedKey] || 600;
  APP.race.interval = setTimeout(() => {
    simulateLap();
    if (APP.race.state.lap < APP.race.state.totalLaps) scheduleNextLap();
    else finishRace();
  }, ms);
}

function simulateLap() {
  const s = APP.race.state;
  s.lap++;

  if (s.scActive) {
    s.scLapsRemaining--;
    if (s.scLapsRemaining <= 0) { s.scActive=false; pushEvent('Safety car in this lap','ev-sc'); }
  }
  if (!s.scActive && s.scTriggered < 2) {
    const baseChance = (s.track.ch.sc_base/100) * s.weather.mods.sc / s.totalLaps * 1.5;
    if (Math.random() < baseChance) {
      s.scActive=true; s.scLapsRemaining=3+Math.floor(Math.random()*3); s.scTriggered++;
      pushEvent('🟡 Safety car deployed','ev-sc');
      const racing = s.cars.filter(c=>!c.dnf).sort((a,b)=>a.totalTime-b.totalTime);
      const sc_leader = racing[0];
      racing.forEach((c,i) => { if(i===0)return; const target=sc_leader.totalTime+i*0.8; if(c.totalTime>target)c.totalTime=target; });
    }
  }

  s.cars.forEach(c => {
    if (c.dnf) return;
    c.tireAge++;

    /* DNF check — TD reliability bonus is now MEANINGFUL */
    const dnfChance = Math.max(0,
      (100 - c.reliabilityRating) / 9000 * (1 / s.weather.mods.reliability) - c.tdReliBonus);
    if (Math.random() < dnfChance) {
      c.dnf=true; c.dnfLap=s.lap;
      c.dnfReason=['Engine failure','Hydraulics','Gearbox','Power unit','Mechanical'][Math.floor(Math.random()*5)];
      pushEvent(`💥 ${escHtml(c.driverName)} OUT — ${c.dnfReason}`,'ev-dnf');
      const dk = driverKey(c.teamId, c.slot);
      if (APP.champ.drivers[dk] && !c.reserveDriver) APP.champ.drivers[dk].dnfs++;
      return;
    }

    /* PIT LOGIC — manual strategies are now STICKIER */
    const lapsLeft  = s.totalLaps - s.lap;
    const stopsLeft = c.targetStops - c.stopsDone;
    const tire      = TIRE_COMPOUNDS[c.compound];
    const pastCliff = c.tireAge > tire.cliff;
    let pitting = false;

    if (!c.isAutoStrat && c.strategyCompounds) {
      /* MANUAL STRATEGY — stick to the plan unless tyres totally gone */
      const totalStints = c.strategyCompounds.length;
      const targetStintLength = Math.floor(s.totalLaps / totalStints);
      const currentStintStart = c.stintIdx * targetStintLength;
      const expectedSwapLap   = currentStintStart + targetStintLength;
      if (c.stintIdx < totalStints - 1) {
        /* Normal window: pit within ±3 laps of scheduled swap */
        if (s.lap >= expectedSwapLap - 1 && s.lap <= expectedSwapLap + 3) pitting = true;
        /* Emergency: tyres totally past cliff + 8 laps */
        else if (c.tireAge > tire.cliff + 8) pitting = true;
        /* SC bonus: pit only if within 4 laps of scheduled swap */
        else if (s.scActive && s.lap >= expectedSwapLap - 4 && Math.random() < 0.65) pitting = true;
      }
    } else {
      /* AUTO STRATEGY — original adaptive logic */
      const window = stopsLeft > 0 ? Math.floor(s.totalLaps / (c.targetStops + 1)) : 999;
      if (stopsLeft > 0 && c.tireAge >= window) {
        if (s.scActive && Math.random() < 0.6)       pitting = true;
        else if (pastCliff && Math.random() < 0.5)   pitting = true;
        else if (c.tireAge >= window + 5)             pitting = true;
      }
    }
    if (lapsLeft <= 2 && stopsLeft > 0 && pastCliff && c.tireAge > tire.cliff + 5) pitting = true;
    if (lapsLeft <= 1) pitting = false;

    let lapTime;
    if (pitting) {
      let newCompound;
      if (s.weather.id==='wet') newCompound='W';
      else if (s.weather.id==='mixed') newCompound = Math.random()<0.5?'I':'M';
      else if (c.strategyCompounds && c.stintIdx+1 < c.strategyCompounds.length) {
        c.stintIdx++; newCompound = c.strategyCompounds[c.stintIdx];
      } else {
        if (stopsLeft-1===0) {
          if (lapsLeft<18) newCompound='S'; else if(lapsLeft<32) newCompound='M'; else newCompound='H';
        } else { newCompound = c.compound==='M'?'H':(c.compound==='H'?'M':'M'); }
      }
      const stopT = c.pitTime + gaussRand(0, 0.4);
      c.pitStops.push({ lap:s.lap, fromCompound:c.compound, toCompound:newCompound, time:stopT });
      pushEvent(`🔧 ${escHtml(c.driverName)} pits → ${TIRE_COMPOUNDS[newCompound].name} (${stopT.toFixed(1)}s)`,'ev-pit');
      c.compound=newCompound; c.tireAge=0; c.stopsDone++;
      lapTime = computeBaseLapTime(c, s) + stopT;
    } else {
      lapTime = computeBaseLapTime(c, s);
    }
    if (s.scActive) lapTime = s.track.baseLap * 1.45;
    c.totalTime += lapTime;
    c.lastLapTime = lapTime;
    if (lapTime < c.fastestLap && !pitting && !s.scActive) c.fastestLap = lapTime;

    /* Random on-track incident — increased frequency for fairness */
    const incidentChance = (100 - (getAsset(c.driverId)?.ratings.Racecraft||80)) / 10000;
    if (!s.scActive && Math.random() < incidentChance) {
      const loss = rand(2, 8);
      c.totalTime += loss;
      pushEvent(`⚠ ${escHtml(c.driverName)} runs wide (+${loss.toFixed(1)}s)`,'ev-pit');
    }
  });
  renderTimingTable();
}

function computeBaseLapTime(c, s) {
  const tire = TIRE_COMPOUNDS[c.compound];
  const base = s.track.baseLap * 1.005;
  const offset     = (95 - c.totalScore) * 0.08;
  /* Strategy fit affects per-lap pace */
  const stratPenalty = c.stratFit.mod;
  /* Aero affects degradation rate */
  const tireOffset = tire.pace
    + Math.max(0, c.tireAge-2) * tire.deg * c.aeroDegMult
    + Math.max(0, c.tireAge - tire.cliff) * tire.deg * 3.5 * c.aeroDegMult;
  /* TD setup mastery → real pace bonus */
  const tdPace = c.tdPaceBonus + c.tdInnovBonus;
  /* Race-day wobble (constant for this race) + lap-to-lap variance */
  const driver = getAsset(c.driverId);
  const consistency = driver?.ratings.Consistency || 80;
  const tdAsset = getAsset(c.teamRef?.assets?.techDir);
  const setupSigmaReduction = tdAsset ? Math.max(0, (tdAsset.ratings.Setup_Mastery||80) - 80) * 0.0001 : 0;
  const sigma = Math.max(0.04, (100-consistency)/300 - setupSigmaReduction);
  return base + offset + stratPenalty + tireOffset - tdPace + c.raceDayWobble + gaussRand(0, sigma);
}

function toggleRacePause() {
  APP.race.paused = !APP.race.paused;
  const btn = document.getElementById('race-pause-btn');
  if (APP.race.paused) { if (APP.race.interval) clearTimeout(APP.race.interval); btn.textContent='▶ Resume'; }
  else { btn.textContent='⏸ Pause'; scheduleNextLap(); }
}
function skipRaceToEnd() {
  if (!APP.race.running) return;
  if (APP.race.interval) clearTimeout(APP.race.interval);
  APP.race.paused = false;
  while (APP.race.state.lap < APP.race.state.totalLaps) simulateLap();
  finishRace();
}

function finishRace() {
  if (APP.race.interval) clearTimeout(APP.race.interval);
  APP.race.running = false;
  const s     = APP.race.state;
  const round = APP.season.calendar[APP.season.currentRound - 1];
  const finishers = s.cars.filter(c=>!c.dnf).sort((a,b)=>a.totalTime-b.totalTime);
  const dnfList   = s.cars.filter(c=>c.dnf).sort((a,b)=>(b.dnfLap||0)-(a.dnfLap||0));
  const ordered   = [...finishers, ...dnfList];
  let flCar=null, flTime=Infinity;
  finishers.forEach(c => { if(c.fastestLap<flTime){flTime=c.fastestLap;flCar=c;} });
  const allStops = s.cars.flatMap(c => c.pitStops.map(p=>({...p,car:c})));
  const bestPit  = allStops.length ? allStops.reduce((a,b)=>a.time<b.time?a:b) : null;

  const classification = ordered.map((c,i) => {
    const finishedTop10 = !c.dnf && i < 10;
    const points    = finishedTop10 ? POINTS_SYS[i] : 0;
    const isFL      = flCar && c===flCar && i<10;
    const flPoints  = isFL ? FL_BONUS : 0;
    const totalPoints = points + flPoints;
    /* Reserve drivers: points still go to constructor, but to the slot's driver record */
    const dk = driverKey(c.teamId, c.slot);
    if (APP.champ.drivers[dk]) {
      const cd = APP.champ.drivers[dk];
      cd.points += totalPoints;
      if (i===0 && !c.dnf) cd.wins++;
      if (i<3  && !c.dnf) cd.podiums++;
      if (isFL) cd.fl++;
      cd.history.push({ round:APP.season.currentRound, trackId:s.track.id, gridPos:c.startPos, finishPos:c.dnf?null:i+1, points:totalPoints, dnf:c.dnf, dnfReason:c.dnfReason, fl:isFL, reserve:c.reserveDriver });
    }
    if (APP.champ.constructors[c.teamId]) {
      APP.champ.constructors[c.teamId].points += totalPoints;
      if (i===0 && !c.dnf) APP.champ.constructors[c.teamId].wins++;
      if (i<3  && !c.dnf) APP.champ.constructors[c.teamId].podiums++;
    }
    return { position:c.dnf?null:i+1, teamId:c.teamId, teamName:c.teamName, teamColor:c.teamColor, slot:c.slot, driverId:c.driverId, driverName:c.driverName, startPos:c.startPos, totalTime:c.totalTime, fastestLap:c.fastestLap, compound:c.compound, pitStops:c.pitStops, points:totalPoints, basePoints:points, flPoints, isFL, isBestPit:!!(bestPit&&c===bestPit.car), dnf:c.dnf, dnfLap:c.dnfLap, dnfReason:c.dnfReason, reserve:c.reserveDriver, aeroKey:c.aeroKey, stratFit:c.stratFit.label, aeroFit:c.aeroFit.label };
  });
  classification.forEach(r => {
    if (APP.champ.constructors[r.teamId]) APP.champ.constructors[r.teamId].history.push({ round:APP.season.currentRound, trackId:s.track.id, position:r.position, points:r.points, dnf:r.dnf });
  });
  round.raceResults = { classification, events:s.events, flCar:flCar?{driverId:flCar.driverId,time:flCar.fastestLap}:null, bestPit:bestPit?{driverId:bestPit.car.driverId,time:bestPit.time,lap:bestPit.lap}:null, scTriggers:s.scTriggered, generatedAt:new Date().toISOString() };
  round.completed = true;
  if (APP.season.currentRound < APP.season.calendar.length) APP.season.currentRound++;
  saveState(); updateSidebar(); updateRoundBadge();

  const f1 = finishers[0], f2 = finishers[1];
  const isSeasonDone = APP.season.calendar.every(r => r.completed);
  if (f1 && f2 && !isSeasonDone && (f2.totalTime - f1.totalTime) < 0.3) {
    showPhotoFinish(f1, f2, f2.totalTime - f1.totalTime, () => showRaceWinnerPopup(round));
  } else {
    showRaceWinnerPopup(round);
  }
  renderRaceComplete(round);
  notify('🏁 Race complete','success');
}

function renderRaceComplete(round) {
  const track  = TRACKS.find(t => t.id === round.trackId);
  const top3   = round.raceResults.classification.slice(0,3);
  document.getElementById('race-content').innerHTML = `
    <div class="card">
      <div class="card-title">🏁 Race Complete — ${track.flag} ${escHtml(track.name)}</div>
      <div class="grid-3 mb-12">
        ${top3.map((r,i) => `
          <div class="card-sm card" style="border-left:3px solid ${escHtml(r.teamColor)}">
            <div class="text-xs text-muted">P${i+1}</div>
            <div class="fw-700">${escHtml(r.driverName)} ${r.reserve?'<span class="text-purple text-xs">[RES]</span>':''}</div>
            <div class="text-xs text-muted">${escHtml(r.teamName)}</div>
            <div class="text-gold mono mt-8">+${r.points} pts</div>
          </div>`).join('')}
      </div>
      <div class="flex gap-12 flex-wrap">
        <button class="btn btn-blue" onclick="document.querySelector('.nav-tab[data-page=results]').click()">View Full Results →</button>
        ${APP.season.currentRound > APP.season.calendar.length
          ? `<span class="tag tag-ready">Season Complete</span>`
          : `<button class="btn btn-red" onclick="document.querySelector('.nav-tab[data-page=qualifying]').click()">Next Round: Qualifying →</button>`}
      </div>
    </div>`;
}

/* ═══════════════════════════════════════════════════════════════
   PART 5 — Results · Championship · Analytics · Trade · Admin · Guide
═══════════════════════════════════════════════════════════════ */

function renderResults() {
  const completed = APP.season.calendar.filter(r => r.completed);
  if (!completed.length) { document.getElementById('results-content').innerHTML = `<div class="card"><div class="text-sm text-muted">No completed races yet.</div></div>`; return; }
  const selected = APP.ui.selectedResult || completed.length;
  const round    = APP.season.calendar[selected - 1];
  const track    = TRACKS.find(t => t.id === round.trackId);
  const weather  = WEATHER_OPTIONS.find(w => w.id === round.weatherId);
  const r        = round.raceResults;
  const crisis   = APP.season.roundCrises?.[selected-1];
  const crisisBanner = crisis?.injured?.length ? `
    <div class="card" style="border-left:3px solid var(--accent);background:rgba(232,0,45,0.04);padding:12px 16px;">
      <div class="text-xs text-accent fw-700" style="letter-spacing:0.08em;text-transform:uppercase">🚨 Race-Week Crisis</div>
      <div class="text-sm">${escHtml(crisis.headline)} — ${crisis.injured.map(i => `<strong>${escHtml(i.driverName)}</strong> (${escHtml(i.teamName)})`).join(' & ')} missed this race.</div>
    </div>` : '';
  const rows = r.classification.map((c, i) => {
    const badges = [];
    if (c.dsq)       badges.push('<span class="r-badge r-dsq">DSQ</span>');
    if (c.isFL)      badges.push('<span class="r-badge r-fl">FL</span>');
    if (c.isBestPit) badges.push('<span class="r-badge r-best-pit">BEST PIT</span>');
    if (c.dnf)       badges.push('<span class="r-badge r-dnf">DNF</span>');
    if (c.reserve)   badges.push('<span class="r-badge" style="background:rgba(171,71,188,0.18);border:1px solid rgba(171,71,188,0.35);color:var(--purple)">RESERVE</span>');
    const dsqBtn = !c.dnf
      ? `<button class="btn btn-ghost btn-xs dsq-toggle-btn" data-round="${selected - 1}" data-driver-id="${escHtml(c.driverId)}" style="color:${c.dsq ? 'var(--green)' : 'var(--accent)'}">${c.dsq ? '↩ Un-DSQ' : '⛔ DSQ'}</button>` : '';
    return `<div class="result-row" style="border-left:3px solid ${escHtml(c.dsq ? '#555' : c.teamColor)};padding-left:13px;${c.dsq ? 'opacity:0.55' : ''}">
      <span class="res-pos" style="${c.dsq ? 'text-decoration:line-through;color:var(--text-3)' : ''}">${c.dnf ? 'DNF' : c.position}</span>
      <div>
        <div class="fw-700 text-sm">${escHtml(c.driverName)}</div>
        <div class="text-xs text-muted">${escHtml(c.teamName)} · started P${c.startPos}${c.dnf ? ` · ${escHtml(c.dnfReason || '')}` : ''}</div>
      </div>
      <div class="result-badges">${badges.join('')}</div>
      ${!c.dnf ? `<span class="text-xs mono text-muted">${fmtTime(c.fastestLap)}</span>` : ''}
      <span class="res-pts" style="${c.dsq ? 'text-decoration:line-through;color:var(--text-3)' : ''}">${c.dsq ? 0 : c.points}</span>
      ${dsqBtn}
    </div>`;
  }).join('');
  const pitRows = r.classification.filter(c => c.pitStops?.length).flatMap(c => c.pitStops.map(p => `<tr>
      <td>${escHtml(c.driverName)}</td><td>L${p.lap}</td>
      <td>${TIRE_COMPOUNDS[p.fromCompound]?.name || p.fromCompound}</td><td>→</td>
      <td>${TIRE_COMPOUNDS[p.toCompound]?.name || p.toCompound}</td>
      <td class="mono">${p.time.toFixed(2)}s</td>
    </tr>`)).join('');
  const eventsList = r.events.slice().reverse().map(e =>
    `<div class="event-line"><span class="lap-tag">L${e.lap}</span><span class="${e.cls}">${e.text}</span></div>`).join('');
  const selector = `<select id="results-round-select">${
    completed.map(rr => {
      const tr  = TRACKS.find(t => t.id === rr.trackId);
      const idx = APP.season.calendar.indexOf(rr) + 1;
      return `<option value="${idx}" ${idx === selected ? 'selected' : ''}>R${idx} — ${tr?.flag} ${escHtml(tr?.name)}</option>`;
    }).join('')
  }</select>`;
  document.getElementById('results-content').innerHTML = `
    ${crisisBanner}
    <div class="card">
      <div class="flex gap-12 mb-8 flex-wrap">
        <div>
          <div class="card-title">Round ${selected} — ${track.flag} ${escHtml(track.name)}</div>
          <div class="text-sm text-muted">${weather?.emoji} ${weather?.label} · ${track.laps} laps · ${r.scTriggers} SC${r.scTriggers === 1 ? '' : 's'}</div>
        </div>
        <div class="ml-auto flex gap-8">${selector}</div>
      </div>
    </div>
    <div class="card"><div class="card-title">Final Classification</div>${rows}</div>
    ${pitRows ? `<div class="card">
      <div class="card-title">Pit Stop Performance</div>
      <table class="champ-table">
        <thead><tr><th>Driver</th><th>Lap</th><th>From</th><th></th><th>To</th><th>Time</th></tr></thead>
        <tbody>${pitRows}</tbody>
      </table>
    </div>` : ''}
    <div class="card"><div class="card-title">Race Events</div>
      <div class="events-ticker" style="height:auto;max-height:300px">${eventsList}</div>
    </div>`;
  document.getElementById('results-round-select').addEventListener('change', e => {
    APP.ui.selectedResult = parseInt(e.target.value, 10); renderResults();
  });
  document.querySelectorAll('.dsq-toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const ri  = parseInt(btn.dataset.round, 10);
      const did = btn.dataset.driverId;
      const isReverse = btn.textContent.trim().startsWith('↩');
      openModal({
        title: isReverse ? 'Reverse DSQ?' : 'Disqualify Driver?',
        body: isReverse
          ? `<div class="text-sm">Restore this driver's championship points from Round ${ri + 1}?</div>`
          : `<div class="text-sm">This will remove all championship points earned by this driver in Round ${ri + 1}.</div>`,
        actions: [
          { label:'Cancel',    cls:'btn-ghost', onClick: closeModal },
          { label: isReverse ? 'Restore' : 'Disqualify',
            cls: isReverse ? 'btn-green' : 'btn-red',
            onClick: () => { closeModal(); applyDSQ(ri, did); } },
        ],
      });
    });
  });
}

function applyDSQ(roundIdx, driverId) {
  const round = APP.season.calendar[roundIdx];
  if (!round?.raceResults) { notify('No race results for this round', 'warn'); return; }
  const cls   = round.raceResults.classification;
  const entry = cls.find(c => c.driverId === driverId);
  if (!entry) { notify('Driver not found', 'error'); return; }
  if (entry.dnf) { notify('Cannot DSQ a DNF driver', 'warn'); return; }
  const dk = driverKey(entry.teamId, entry.slot);
  if (entry.dsq) {
    const restore = entry.dsqOriginalPoints ?? 0;
    entry.points = restore; entry.basePoints = entry.dsqOriginalBase ?? restore; entry.flPoints = entry.dsqOriginalFL ?? 0;
    entry.dsq = false;
    delete entry.dsqOriginalPoints; delete entry.dsqOriginalBase; delete entry.dsqOriginalFL;
    if (APP.champ.drivers[dk]) APP.champ.drivers[dk].points += restore;
    if (APP.champ.constructors[entry.teamId]) APP.champ.constructors[entry.teamId].points += restore;
    notify(`↩ DSQ reversed — ${entry.driverName} restored (+${restore} pts)`, 'success');
  } else {
    entry.dsqOriginalPoints = entry.points; entry.dsqOriginalBase = entry.basePoints; entry.dsqOriginalFL = entry.flPoints;
    const removed = entry.points;
    entry.points = 0; entry.basePoints = 0; entry.flPoints = 0; entry.dsq = true;
    if (APP.champ.drivers[dk]) APP.champ.drivers[dk].points = Math.max(0, APP.champ.drivers[dk].points - removed);
    if (APP.champ.constructors[entry.teamId]) APP.champ.constructors[entry.teamId].points = Math.max(0, APP.champ.constructors[entry.teamId].points - removed);
    notify(`⛔ ${entry.driverName} disqualified from Round ${roundIdx + 1} (−${removed} pts)`, 'warn');
  }
  saveState(); updateSidebar(); renderResults();
  if (document.getElementById('page-championship')?.classList.contains('active')) renderChampionship();
}

/* ─── CHAMPIONSHIP (deduped, single source of truth) ──────── */
function renderChampionship() {
  const drivers      = Object.entries(APP.champ.drivers).sort((a, b) => b[1].points - a[1].points);
  const constructors = Object.entries(APP.champ.constructors).sort((a, b) => b[1].points - a[1].points);
  const completedRounds = APP.season.calendar.map((r, i) => r.completed ? (i + 1) : null).filter(Boolean);
  const racesRemaining  = APP.season.calendar.filter(r => !r.completed).length;
  const totalRaces      = APP.season.calendar.length;
  const maxPtsPerRace   = POINTS_SYS[0] + FL_BONUS;
  const maxConstructorPR = maxPtsPerRace * 2;

  let contentionHtml = '';
  if (constructors.length >= 2 && totalRaces > 0 && completedRounds.length > 0) {
    const [, c1] = constructors[0];
    const [, c2] = constructors[1];
    const gap = c1.points - c2.points;
    const remainingForP2 = racesRemaining * maxConstructorPR;
    const isClinched = gap > remainingForP2;
    const ptsNeeded  = isClinched ? 0 : (remainingForP2 - gap + 1);
    if (isClinched) {
      contentionHtml = `<div class="contention-panel"><span class="contention-icon">🏆</span>
        <div class="contention-text"><strong style="color:${escHtml(c1.color)}">${escHtml(c1.name)}</strong> have clinched the Constructors' Championship with ${racesRemaining} race${racesRemaining===1?'':'s'} to go.</div>
        <span class="contention-badge clinched">CHAMPION</span></div>`;
    } else if (racesRemaining > 0) {
      contentionHtml = `<div class="contention-panel"><span class="contention-icon">🔥</span>
        <div class="contention-text"><strong style="color:${escHtml(c2.color)}">${escHtml(c2.name)}</strong> trail by <strong>${gap} pts</strong> with ${racesRemaining} race${racesRemaining===1?'':'s'} remaining (${remainingForP2} pts available). They need <strong>${ptsNeeded} pts</strong> more than ${escHtml(c1.name)} to take the title.</div>
        <span class="contention-badge">${gap} PTS BEHIND</span></div>`;
    }
  }
  const conRows = constructors.map(([id, c], i) => `<tr>
    <td class="champ-pos">${i + 1}</td>
    <td><span class="champ-dot" style="background:${escHtml(c.color)}"></span>${escHtml(c.name)}</td>
    <td class="mono">${c.wins || 0}</td><td class="mono">${c.podiums || 0}</td>
    <td class="champ-pts">${c.points}</td>
  </tr>`).join('');
  const drvRows = drivers.map(([k, d], i) => `<tr>
    <td class="champ-pos">${i + 1}</td>
    <td><span class="champ-dot" style="background:${escHtml(d.teamColor)}"></span>${escHtml(d.name)}</td>
    <td class="text-muted text-xs">${escHtml(d.teamName)}</td>
    <td class="mono">${d.wins || 0}</td><td class="mono">${d.podiums || 0}</td>
    <td class="mono">${d.poles || 0}</td><td class="mono">${d.fl || 0}</td>
    <td class="mono text-accent">${d.dnfs || 0}</td>
    <td class="champ-pts">${d.points}</td>
  </tr>`).join('');
  const matrixHeader = completedRounds.map(r => {
    const rt = TRACKS.find(t => t.id === APP.season.calendar[r - 1].trackId);
    const isLast = r === totalRaces;
    return `<th ${isLast ? 'style="color:var(--gold)"' : ''}>${rt?.flag || ''} R${r}</th>`;
  }).join('');
  const matrixRows = drivers.map(([k, d]) => {
    const cells = completedRounds.map(r => {
      const h = (d.history || []).find(x => x.round === r);
      if (!h) return '<td class="text-dim">—</td>';
      if (h.dnf) return `<td class="text-accent mono text-xs">DNF</td>`;
      const pCls = h.finishPos === 1 ? 'text-gold' : h.finishPos <= 3 ? 'text-green' : '';
      return `<td class="mono ${pCls}">P${h.finishPos}<br><span class="text-dim" style="font-size:10px">+${h.points}</span></td>`;
    }).join('');
    return `<tr><td><span class="champ-dot" style="background:${escHtml(d.teamColor)}"></span>${escHtml(d.name)}</td>${cells}<td class="champ-pts">${d.points}</td></tr>`;
  }).join('');
  document.getElementById('championship-content').innerHTML = `
    ${contentionHtml}
    <div class="grid-2">
      <div class="card">
        <div class="card-title" style="color:var(--gold)">Constructors' Championship</div>
        <table class="champ-table">
          <thead><tr><th>Pos</th><th>Team</th><th>W</th><th>Pod</th><th>Pts</th></tr></thead>
          <tbody>${conRows || '<tr><td colspan="5" class="text-dim text-center">No data</td></tr>'}</tbody>
        </table>
      </div>
      <div class="card">
        <div class="card-title">Drivers' Championship</div>
        <table class="champ-table">
          <thead><tr><th>Pos</th><th>Driver</th><th>Team</th><th>W</th><th>Pod</th><th>Pole</th><th>FL</th><th>DNF</th><th>Pts</th></tr></thead>
          <tbody>${drvRows || '<tr><td colspan="9" class="text-dim text-center">No data</td></tr>'}</tbody>
        </table>
      </div>
    </div>
    ${completedRounds.length ? `<div class="card">
      <div class="card-title">Race-by-Race Results</div>
      <div style="overflow-x:auto">
        <table class="champ-table">
          <thead><tr><th>Driver</th>${matrixHeader}<th>Total</th></tr></thead>
          <tbody>${matrixRows}</tbody>
        </table>
      </div>
    </div>` : ''}`;
}

/* ─── ANALYTICS ──────────────────────────────────────────── */
function renderAnalytics() {
  let teamId = APP.ui.selectedAnalyticsTeam || APP.teams[0]?.id;
  if (!teamId) { document.getElementById('analytics-content').innerHTML = `<div class="card"><div class="text-sm text-muted">No team data available.</div></div>`; return; }
  const team = APP.teams.find(t => t.id === teamId);
  if (!team) { document.getElementById('analytics-content').innerHTML = '<div class="card">Team not found</div>'; return; }
  const hasTDs = ASSET_DB.technicalDirectors.length > 0;
  const conData = APP.champ.constructors[team.id];
  const teamSelector = `<select id="analytics-team-select">${APP.teams.map(t => `<option value="${t.id}" ${t.id === teamId ? 'selected' : ''}>${escHtml(t.name)}</option>`).join('')}</select>`;
  const driverHtml = ['driver1', 'driver2', 'reserve'].map(slot => {
    const a = getAsset(team.assets[slot]);
    if (!a) return `<div class="card card-sm"><div class="card-title">${SLOT_LABELS[slot]}</div><div class="text-dim">— empty —</div></div>`;
    const ratingsHtml = Object.entries(a.ratings).map(([k, v]) =>
      `<div class="stat-bar-wrap" style="--bar-color:${escHtml(team.color)}">
        <span class="stat-bar-label">${escHtml(k.replace(/_/g, ' '))}</span>
        <div class="stat-bar-track"><div class="stat-bar-fill" style="width:${v}%"></div></div>
        <span class="stat-bar-val">${v}</span>
      </div>`).join('');
    const dk = driverKey(team.id, slot);
    const cd = APP.champ.drivers[dk];
    return `<div class="card card-sm">
      <div class="card-title">${SLOT_LABELS[slot]} ${slot === 'reserve' ? '<span class="tag tag-purple">Reserve</span>' : ''}</div>
      <div class="fw-700 text-sm">${escHtml(a.name)}</div>
      <div class="text-xs text-muted mb-12">${escHtml(a.nat || '')} · OVR ${ovr(a)}</div>
      ${ratingsHtml}
      ${cd ? `<div class="mt-12 stat-row"><span class="stat-label">Championship</span><span class="stat-val">${cd.points} pts · ${cd.wins}W ${cd.podiums}P ${cd.dnfs}DNF</span></div>` : ''}
    </div>`;
  }).join('');
  const compSlots = ['engine', 'strategist', 'pitcrew', 'principal', ...(hasTDs ? ['techDir'] : [])];
  const compHtml  = compSlots.map(slot => {
    const a  = getAsset(team.assets[slot]);
    const tc = TYPE_COLORS[SLOT_TO_TYPE[slot]] || '#888';
    if (!a) return `<div class="card card-sm"><div class="card-title" style="color:${tc}">${SLOT_LABELS[slot]}</div><div class="text-dim">— empty —</div></div>`;
    const ratingsHtml = Object.entries(a.ratings).map(([k, v]) =>
      `<div class="stat-bar-wrap" style="--bar-color:${tc}">
        <span class="stat-bar-label">${escHtml(k.replace(/_/g, ' '))}</span>
        <div class="stat-bar-track"><div class="stat-bar-fill" style="width:${v}%"></div></div>
        <span class="stat-bar-val">${v}</span>
      </div>`).join('');
    return `<div class="card card-sm">
      <div class="card-title" style="color:${tc}">${SLOT_LABELS[slot]}</div>
      <div class="fw-700 text-sm">${escHtml(a.name)}</div>
      <div class="text-xs text-muted mb-12">${escHtml(a.nat || '')} · OVR ${ovr(a)} · $${priceOf(a.id)}M</div>
      ${ratingsHtml}
    </div>`;
  }).join('');
  const completedRounds = APP.season.calendar.filter(r => r.completed);
  const historyRows = completedRounds.map((round, i) => {
    const tr = TRACKS.find(t => t.id === round.trackId);
    return round.raceResults.classification.filter(c => c.teamId === team.id).map(c => {
      const grade = gradeFromScore(c.dnf ? 50 : (100 - (c.position - 1) * 4));
      const aeroInfo = getAeroInfo(c.aeroKey || 'balanced');
      return `<div class="race-history-row">
        <span class="race-round">R${i + 1}</span>
        <span class="race-track">${tr?.flag} ${escHtml(tr?.name)} — ${escHtml(c.driverName)} ${c.reserve?'<span style="color:var(--purple);font-size:10px">[RES]</span>':''}</span>
        <span class="text-xs text-muted" title="Aero / strategy fit">${aeroInfo.icon} ${escHtml(c.aeroFit||'')}</span>
        <span class="race-pos">P${c.startPos}→${c.dnf ? 'DNF' : 'P' + c.position}</span>
        <span class="race-pts">+${c.points}</span>
        <span class="perf-grade ${grade.css}">${grade.g}</span>
      </div>`;
    }).join('');
  }).join('');
  let cum = 0;
  const allCumMaxes = completedRounds.map((_, i) =>
    completedRounds.slice(0, i + 1).flatMap(round => round.raceResults.classification.filter(c => c.teamId === team.id)).reduce((s, c) => s + c.points, 0));
  const maxCum = Math.max(...allCumMaxes, 1);
  const progHtml = completedRounds.map((round, i) => {
    const roundPts = round.raceResults.classification.filter(c => c.teamId === team.id).reduce((s, c) => s + c.points, 0);
    cum += roundPts;
    return `<div class="stat-bar-wrap" style="--bar-color:${escHtml(team.color)}">
      <span class="stat-bar-label">R${i + 1}</span>
      <div class="stat-bar-track"><div class="stat-bar-fill" style="width:${(cum / maxCum) * 100}%"></div></div>
      <span class="stat-bar-val">${cum}</span>
    </div>`;
  }).join('');
  const allCons = Object.entries(APP.champ.constructors).sort((a, b) => b[1].points - a[1].points);
  const maxPts  = Math.max(...allCons.map(([, c]) => c.points), 1);
  const compareHtml = allCons.map(([id, c]) => {
    const isMe = id === team.id;
    return `<div class="stat-bar-wrap" style="--bar-color:${escHtml(c.color)}">
      <span class="stat-bar-label" style="${isMe ? 'font-weight:700;color:var(--text)' : ''}">${escHtml(c.name)}</span>
      <div class="stat-bar-track"><div class="stat-bar-fill" style="width:${(c.points / maxPts) * 100}%"></div></div>
      <span class="stat-bar-val">${c.points}</span>
    </div>`;
  }).join('');
  document.getElementById('analytics-content').innerHTML = `
    <div class="card">
      <div class="flex gap-12 mb-8 flex-wrap">
        <div>
          <div class="card-title">Team Profile</div>
          <div class="fw-700" style="font-family:var(--font-display);font-size:18px;color:${escHtml(team.color)}">${escHtml(team.name)}</div>
          <div class="text-sm text-muted">OVR ${teamOvr(team) ?? '—'} · $${teamSpent(team)}M · ${conData?.points || 0} championship pts</div>
        </div>
        <div class="ml-auto">${teamSelector}</div>
      </div>
    </div>
    <div class="analytics-section">
      <div class="analytics-heading">Driver Lineup</div>
      <div class="grid-3">${driverHtml}</div>
    </div>
    <div class="analytics-section">
      <div class="analytics-heading">Team Components${hasTDs ? ' — including Technical Director' : ''}</div>
      <div class="grid-auto-lg">${compHtml}</div>
    </div>
    ${completedRounds.length ? `
    <div class="analytics-section">
      <div class="analytics-heading">Race-by-Race Performance</div>
      <div class="card">${historyRows || '<div class="text-dim text-sm">No races completed yet</div>'}</div>
    </div>
    <div class="analytics-section">
      <div class="analytics-heading">Points Progression</div>
      <div class="card">${progHtml}</div>
    </div>` : ''}
    <div class="analytics-section">
      <div class="analytics-heading">Constructors Comparison</div>
      <div class="card">${compareHtml || '<div class="text-dim">No data yet</div>'}</div>
    </div>`;
  document.getElementById('analytics-team-select')?.addEventListener('change', e => {
    APP.ui.selectedAnalyticsTeam = e.target.value; renderAnalytics();
  });
}

/* ─── TRADE DESK (admin only now) ──────────────────────────── */
function renderTrade() {
  const root = document.getElementById('trade-content');
  if (APP.teams.length < 2) { root.innerHTML = `<div class="card"><div class="text-sm text-muted">Need at least 2 teams to trade.</div></div>`; return; }
  if (!APP.ui.tradeA) APP.ui.tradeA = APP.teams[0].id;
  if (!APP.ui.tradeB) APP.ui.tradeB = APP.teams[1].id;
  if (APP.ui.tradeA === APP.ui.tradeB) APP.ui.tradeB = APP.teams.find(t => t.id !== APP.ui.tradeA)?.id;
  const teamA = APP.teams.find(t => t.id === APP.ui.tradeA);
  const teamB = APP.teams.find(t => t.id === APP.ui.tradeB);
  const optionsA = APP.teams.map(t => `<option value="${t.id}" ${t.id === APP.ui.tradeA ? 'selected' : ''}>${escHtml(t.name)}</option>`).join('');
  const optionsB = APP.teams.map(t => `<option value="${t.id}" ${t.id === APP.ui.tradeB ? 'selected' : ''}>${escHtml(t.name)}</option>`).join('');
  const buildSide = (team, side) => {
    const selected = side === 'A' ? APP.ui.tradeASelected : APP.ui.tradeBSelected;
    const rows = SLOT_ORDER.map(slot => {
      const a = getAsset(team.assets[slot]);
      if (!a) return '';
      const isSel = selected.includes(slot);
      return `<div class="trade-row ${isSel ? 'selected' : ''}" data-side="${side}" data-slot="${slot}">
        <span class="text-xs text-muted" style="min-width:72px">${SLOT_LABELS[slot]}</span>
        <div class="flex-1"><div class="fw-700 text-sm">${escHtml(a.name)}</div>
        <div class="text-xs text-muted">OVR ${ovr(a)} · $${priceOf(a.id)}M</div></div>
      </div>`;
    }).join('');
    const totalVal = selected.reduce((sum, s) => sum + priceOf(team.assets[s]), 0);
    return `<div class="card">
      <div class="flex gap-8 mb-12"><select data-trade-side="${side}" style="flex:1">${side === 'A' ? optionsA : optionsB}</select></div>
      <div class="card-title">Click to select for trade</div>
      ${rows || '<div class="text-dim text-sm">No assets assigned</div>'}
      <div class="mt-12 text-xs">Selected value: <span class="text-gold mono">$${totalVal}M</span></div>
    </div>`;
  };
  root.innerHTML = `
    <div class="trade-grid">${buildSide(teamA, 'A')}<div class="trade-arrow">⇄</div>${buildSide(teamB, 'B')}</div>
    <div class="card mt-16">
      <div class="card-title">Execute Trade</div>
      <div class="text-xs text-muted mb-12">Slot types must match (drivers ↔ drivers, engines ↔ engines).</div>
      <button class="btn btn-red" id="trade-execute-btn">⚡ Execute Trade</button>
    </div>`;
  document.querySelectorAll('[data-trade-side]').forEach(sel => {
    sel.addEventListener('change', e => {
      if (sel.dataset.tradeSide === 'A') APP.ui.tradeA = e.target.value;
      else APP.ui.tradeB = e.target.value;
      APP.ui.tradeASelected = []; APP.ui.tradeBSelected = [];
      renderTrade();
    });
  });
  document.querySelectorAll('.trade-row').forEach(r => {
    r.addEventListener('click', () => {
      const side = r.dataset.side, slot = r.dataset.slot;
      const arr  = side === 'A' ? APP.ui.tradeASelected : APP.ui.tradeBSelected;
      const idx  = arr.indexOf(slot);
      if (idx >= 0) arr.splice(idx, 1); else arr.push(slot);
      renderTrade();
    });
  });
  document.getElementById('trade-execute-btn').addEventListener('click', executeTrade);
}
function executeTrade() {
  const teamA = APP.teams.find(t => t.id === APP.ui.tradeA);
  const teamB = APP.teams.find(t => t.id === APP.ui.tradeB);
  const aSlots = APP.ui.tradeASelected, bSlots = APP.ui.tradeBSelected;
  if (!aSlots.length || !bSlots.length) { notify('Select assets on both sides', 'warn'); return; }
  const driverSlots = ['driver1', 'driver2', 'reserve'];
  const toType = s => driverSlots.includes(s) ? 'driver' : s;
  if (aSlots.length !== bSlots.length) { notify('Both sides must offer the same number of assets', 'error'); return; }
  if ([...aSlots.map(toType)].sort().join(',') !== [...bSlots.map(toType)].sort().join(',')) {
    notify('Slot types must match', 'error'); return;
  }
  const aRemain = [...aSlots], bRemain = [...bSlots], swaps = [];
  while (aRemain.length) {
    const a    = aRemain.shift();
    const mIdx = bRemain.findIndex(b => toType(b) === toType(a));
    if (mIdx < 0) { notify('Could not match all slots', 'error'); return; }
    swaps.push([a, bRemain.splice(mIdx, 1)[0]]);
  }
  swaps.forEach(([slotA, slotB]) => {
    const tmp = teamA.assets[slotA];
    teamA.assets[slotA] = teamB.assets[slotB];
    teamB.assets[slotB] = tmp;
  });
  ['driver1', 'driver2'].forEach(slot => {
    [teamA, teamB].forEach(team => {
      const dk = driverKey(team.id, slot);
      const a  = getAsset(team.assets[slot]);
      if (a && APP.champ.drivers[dk]) { APP.champ.drivers[dk].name = a.name; APP.champ.drivers[dk].driverId = a.id; }
    });
  });
  APP.ui.tradeASelected = []; APP.ui.tradeBSelected = [];
  saveState(); renderTrade();
  notify(`✓ Trade executed: ${swaps.length} asset${swaps.length === 1 ? '' : 's'} swapped`, 'success');
}

/* ═══════════════════════════════════════════════════════════════
   PART 6 — Admin Panel · Spectator Link · Guide
═══════════════════════════════════════════════════════════════ */

function renderAdmin() {
  const teamRows = APP.teams.map(t => {
    const d1 = getAsset(t.assets.driver1);
    const d2 = getAsset(t.assets.driver2);
    const dr = getAsset(t.assets.reserve);
    return `<div class="card card-sm" style="border-left:3px solid ${escHtml(t.color)}">
      <div class="flex gap-8 mb-8"><span class="fw-700">${escHtml(t.name)}</span></div>
      <div class="grid-3" style="gap:8px">
        <div class="text-xs"><span class="text-muted">Driver 1:</span><br>${d1 ? escHtml(d1.name) : '<span class="text-dim">empty</span>'}</div>
        <div class="text-xs"><span class="text-muted">Driver 2:</span><br>${d2 ? escHtml(d2.name) : '<span class="text-dim">empty</span>'}</div>
        <div class="text-xs"><span class="text-muted" style="color:var(--purple)">Reserve:</span><br>${dr ? escHtml(dr.name) : '<span class="text-dim">empty</span>'}</div>
      </div>
      <div class="flex gap-8 mt-8">
        <button class="btn btn-ghost btn-xs" data-swap="${t.id}">Swap Drivers</button>
        ${dr ? `<button class="btn btn-ghost btn-xs" data-activate-reserve="${t.id}">Activate Reserve</button>` : ''}
      </div>
    </div>`;
  }).join('');

  document.getElementById('admin-content').innerHTML = `
    <div class="admin-section">
      <div class="admin-section-title">Authentication</div>
      <div>
        <label class="text-xs text-muted">Admin Password</label>
        <div class="flex gap-8 mt-8" style="max-width:340px">
          <input type="text" id="admin-pw-input" value="${escHtml(APP.auth.adminPw)}" style="flex:1" />
          <button class="btn btn-blue btn-sm" id="set-admin-pw-btn">Save</button>
        </div>
      </div>
    </div>

    <div class="admin-section">
      <div class="admin-section-title">Teams · Driver Swaps</div>
      <div class="grid-2">${teamRows || '<div class="text-dim">No teams yet</div>'}</div>
    </div>

    <div class="admin-section">
      <div class="admin-section-title">📊 Spectator Analytics Link</div>
      <div class="text-xs text-muted mb-12">
        Generate a read-only link delegates can open on any device. They'll see all
        championship standings, race results, asset registry, team analytics, race events,
        and pit-stop data — without any ability to edit. After each race, regenerate and
        re-share via WhatsApp/Telegram/Email.
      </div>
      <div class="spec-link-panel">
        <div class="spec-link-display">
          <input type="text" id="spec-link-input" placeholder="(click Generate to create the link)" readonly />
          <button class="btn btn-ghost btn-sm" id="spec-link-copy-btn">📋 Copy</button>
        </div>
        <div class="spec-link-meta" id="spec-link-meta"></div>
        <div class="spec-link-actions">
          <button class="btn btn-teal" id="spec-link-gen-btn">⚡ Generate Spectator Link</button>
          <button class="btn btn-ghost btn-sm" id="spec-link-open-btn">↗ Open in new tab</button>
        </div>
      </div>
    </div>

    <div class="admin-section">
      <div class="admin-section-title">Distribution (file-based backup)</div>
      <div class="flex gap-12 flex-wrap">
        <button class="btn btn-ghost" id="export-state-btn">⬇ Download State (JSON)</button>
        <label class="btn btn-ghost file-label">⬆ Import State (JSON)
          <input type="file" accept=".json" id="import-state-input" hidden />
        </label>
      </div>
    </div>

    <div class="admin-section danger">
      <div class="admin-section-title">⚠ Danger Zone</div>
      <div class="flex gap-12 flex-wrap">
        <button class="btn btn-ghost" id="reset-fp-btn">Reset Free Practice</button>
        <button class="btn btn-ghost" id="reset-season-btn">Reset Season Progress</button>
        <button class="btn btn-red"   id="reset-all-btn">⚠ Reset Everything</button>
      </div>
    </div>

    <div class="admin-section">
      <div class="admin-section-title">System Info</div>
      <div class="grid-3">
        <div class="stat-row"><span class="stat-label">Teams</span><span class="stat-val">${APP.teams.length}</span></div>
        <div class="stat-row"><span class="stat-label">Assets</span><span class="stat-val">${allAssets().length}</span></div>
        <div class="stat-row"><span class="stat-label">Tech Directors</span><span class="stat-val">${ASSET_DB.technicalDirectors.length}</span></div>
        <div class="stat-row"><span class="stat-label">Races Done</span><span class="stat-val">${APP.season.calendar.filter(r => r.completed).length}/${APP.season.calendar.length}</span></div>
        <div class="stat-row"><span class="stat-label">FP Done</span><span class="stat-val">${APP.fpData ? '✓' : '—'}</span></div>
        <div class="stat-row"><span class="stat-label">Round</span><span class="stat-val">${APP.season.currentRound}</span></div>
      </div>
    </div>`;

  document.getElementById('set-admin-pw-btn').addEventListener('click', () => {
    const v = document.getElementById('admin-pw-input').value.trim();
    if (!v) { notify('Password cannot be empty', 'warn'); return; }
    APP.auth.adminPw = v; saveState(); notify('Admin password updated', 'success');
  });
  document.querySelectorAll('[data-swap]').forEach(b =>
    b.addEventListener('click', () => openDriverSwapModal(b.dataset.swap)));
  document.querySelectorAll('[data-activate-reserve]').forEach(b =>
    b.addEventListener('click', () => activateReserveModal(b.dataset.activateReserve)));

  document.getElementById('spec-link-gen-btn').addEventListener('click', generateSpectatorLink);
  document.getElementById('spec-link-copy-btn').addEventListener('click', () => {
    const inp = document.getElementById('spec-link-input');
    if (!inp.value) { notify('Generate the link first', 'warn'); return; }
    navigator.clipboard?.writeText(inp.value)
      .then(() => notify('✓ Link copied — paste into WhatsApp / email', 'success'))
      .catch(() => { inp.select(); document.execCommand('copy'); notify('Copied', 'success'); });
  });
  document.getElementById('spec-link-open-btn').addEventListener('click', () => {
    const inp = document.getElementById('spec-link-input');
    if (!inp.value) { notify('Generate the link first', 'warn'); return; }
    window.open(inp.value, '_blank');
  });

  document.getElementById('export-state-btn').addEventListener('click', exportStateJSON);
  document.getElementById('import-state-input').addEventListener('change', e => {
    if (e.target.files[0]) importStateJSON(e.target.files[0]);
  });

  document.getElementById('reset-fp-btn').addEventListener('click', () => {
    openModal({ title:'Reset Free Practice?',
      body:'<div class="text-sm">Allows the FP session to be re-run.</div>',
      actions:[
        { label:'Cancel', cls:'btn-ghost', onClick:closeModal },
        { label:'Reset',  cls:'btn-red',   onClick:() => {
          APP.fpData = null; APP.season.fpDone = false;
          saveState(); closeModal(); notify('Free Practice reset', 'warn');
        }},
      ],
    });
  });
  document.getElementById('reset-season-btn').addEventListener('click', () => {
    openModal({ title:'Reset Season Progress?',
      body:'<div class="text-sm">Clears all race results, qualifying, and championship standings. Teams and assets remain.</div>',
      actions:[
        { label:'Cancel',       cls:'btn-ghost', onClick:closeModal },
        { label:'Reset Season', cls:'btn-red',   onClick:() => {
          APP.season.calendar.forEach(r => { r.qualResults=null; r.raceResults=null; r.completed=false; });
          APP.season.currentRound = APP.season.started ? 1 : 0;
          APP.season.teamStrategies = {}; APP.season.teamAero = {}; APP.season.roundCrises = {};
          APP.fpData = null; APP.season.fpDone = false;
          initChampionship();
          saveState(); closeModal(); updateSidebar(); updateRoundBadge(); renderAdmin();
          notify('Season reset', 'warn');
        }},
      ],
    });
  });
  document.getElementById('reset-all-btn').addEventListener('click', () => {
    openModal({ title:'Reset EVERYTHING?',
      body:'<div class="text-sm text-accent">Wipes all teams, assets, season data, championships and passwords. Cannot be undone.</div>',
      actions:[
        { label:'Cancel',          cls:'btn-ghost', onClick:closeModal },
        { label:'WIPE EVERYTHING', cls:'btn-red',   onClick:() => {
          try { localStorage.removeItem(LS_KEY); } catch(e) {}
          location.reload();
        }},
      ],
    });
  });
}

function openDriverSwapModal(teamId) {
  const team = APP.teams.find(t => t.id === teamId); if (!team) return;
  const heldIds = ['driver1','driver2','reserve'].map(s => team.assets[s]).filter(Boolean);
  const buildSelect = (id, currentId) => {
    const opts = ['<option value="">— empty —</option>']
      .concat(heldIds.map(aid => { const a = getAsset(aid); return `<option value="${aid}" ${currentId===aid?'selected':''}>${escHtml(a?.name||aid)}</option>`; })).join('');
    return `<select id="${id}" style="min-width:180px">${opts}</select>`;
  };
  const d1 = getAsset(team.assets.driver1);
  const d2 = getAsset(team.assets.driver2);
  const dr = getAsset(team.assets.reserve);
  openModal({ title: `Driver Lineup — ${team.name}`,
    body: `<div class="text-sm text-muted mb-12">Reassign your three drivers. Championship points stay with the slot.</div>
      <div class="modal-list">
        <div class="modal-list-item">
          <span class="text-xs text-muted" style="min-width:74px">Driver 1</span>
          <div class="flex-1 text-xs text-muted">Currently: ${d1?escHtml(d1.name):'empty'}</div>
          ${buildSelect('swap-d1', team.assets.driver1)}
        </div>
        <div class="modal-list-item">
          <span class="text-xs text-muted" style="min-width:74px">Driver 2</span>
          <div class="flex-1 text-xs text-muted">Currently: ${d2?escHtml(d2.name):'empty'}</div>
          ${buildSelect('swap-d2', team.assets.driver2)}
        </div>
        <div class="modal-list-item" style="background:rgba(171,71,188,0.06)">
          <span class="text-xs text-purple" style="min-width:74px">Reserve</span>
          <div class="flex-1 text-xs text-muted">Currently: ${dr?escHtml(dr.name):'empty'}</div>
          ${buildSelect('swap-dr', team.assets.reserve)}
        </div>
      </div>`,
    actions:[
      { label:'Cancel', cls:'btn-ghost', onClick:closeModal },
      { label:'Apply',  cls:'btn-red',   onClick:() => {
        const n1 = document.getElementById('swap-d1').value || null;
        const n2 = document.getElementById('swap-d2').value || null;
        const nr = document.getElementById('swap-dr').value || null;
        const picks = [n1,n2,nr].filter(Boolean);
        if (new Set(picks).size !== picks.length) { notify('Each driver can only fill one slot','error'); return; }
        team.assets.driver1 = n1; team.assets.driver2 = n2; team.assets.reserve = nr;
        ['driver1','driver2'].forEach(slot => {
          const dk = driverKey(team.id, slot);
          const a  = getAsset(team.assets[slot]);
          if (a && APP.champ.drivers[dk]) { APP.champ.drivers[dk].name=a.name; APP.champ.drivers[dk].driverId=a.id; }
          else if (a && !APP.champ.drivers[dk] && APP.season.started) {
            APP.champ.drivers[dk] = { name:a.name, teamId:team.id, teamName:team.name, teamColor:team.color, slot, driverId:a.id, points:0, wins:0, podiums:0, poles:0, fl:0, dnfs:0, history:[] };
          }
        });
        saveState(); closeModal(); renderAdmin(); updateSidebar();
        notify(`Lineup updated — ${team.name}`, 'success');
      }},
    ],
  });
}

function activateReserveModal(teamId) {
  const team = APP.teams.find(t => t.id === teamId); if (!team) return;
  const dr = getAsset(team.assets.reserve);
  if (!dr) { notify('No reserve driver assigned','warn'); return; }
  const d1 = getAsset(team.assets.driver1);
  const d2 = getAsset(team.assets.driver2);
  openModal({ title: `Activate Reserve — ${team.name}`,
    body: `<div class="text-sm mb-12">Promote <span class="fw-700 text-purple">${escHtml(dr.name)}</span> into a race seat. The displaced driver moves to Reserve.</div>
      <div class="flex gap-8 flex-col">
        <button class="btn btn-ghost btn-full" data-promote-to="driver1">Replace Driver 1${d1?` — ${escHtml(d1.name)}`:''}</button>
        <button class="btn btn-ghost btn-full" data-promote-to="driver2">Replace Driver 2${d2?` — ${escHtml(d2.name)}`:''}</button>
      </div>`,
    actions:[{ label:'Cancel', cls:'btn-ghost', onClick:closeModal }],
  });
  document.querySelectorAll('[data-promote-to]').forEach(btn => {
    btn.addEventListener('click', () => {
      const slot = btn.dataset.promoteTo;
      const old  = team.assets[slot];
      team.assets[slot] = team.assets.reserve;
      team.assets.reserve = old;
      const dk = driverKey(team.id, slot);
      const newRacer = getAsset(team.assets[slot]);
      if (newRacer && APP.champ.drivers[dk]) { APP.champ.drivers[dk].name=newRacer.name; APP.champ.drivers[dk].driverId=newRacer.id; }
      else if (newRacer && !APP.champ.drivers[dk] && APP.season.started) {
        APP.champ.drivers[dk] = { name:newRacer.name, teamId:team.id, teamName:team.name, teamColor:team.color, slot, driverId:newRacer.id, points:0, wins:0, podiums:0, poles:0, fl:0, dnfs:0, history:[] };
      }
      saveState(); closeModal(); renderAdmin(); updateSidebar();
      notify(`${escHtml(newRacer.name)} promoted`, 'success');
    });
  });
}

/* ─── SPECTATOR LINK GENERATOR (URL hash with LZ compression) ─ */
function getSpectatorSnapshot() {
  /* Trim heavy data not needed for spectator analytics */
  const snap = {
    season: APP.season,
    champ:  APP.champ,
    teams:  APP.teams,
    prices: APP.prices,
    ASSET_DB,
    fpData: APP.fpData ? {
      ...APP.fpData,
      byDriver: APP.fpData.byDriver?.map(d => ({
        ...d, stints: d.stints.map(({ lapTimes, ...rest }) => rest),
      })),
    } : null,
    exportedAt: new Date().toISOString(),
  };
  /* Trim race event logs (can be 200+ entries) but keep the important ones */
  if (snap.season?.calendar) {
    snap.season.calendar = snap.season.calendar.map(r =>
      r.raceResults ? {
        ...r,
        raceResults: {
          ...r.raceResults,
          events: (r.raceResults.events || []).filter(e =>
            e.cls === 'ev-dnf' || e.cls === 'ev-sc' || e.cls === 'ev-pit'
          ).slice(0, 30),
        },
      } : r);
  }
  return snap;
}

function generateSpectatorLink() {
  try {
    const snap = getSpectatorSnapshot();
    const json = JSON.stringify(snap);
    let encoded;
    if (typeof LZString !== 'undefined') {
      encoded = LZString.compressToEncodedURIComponent(json);
      if (!encoded) throw new Error('Compression returned empty');
    } else {
      const bytes  = new TextEncoder().encode(json);
      const binary = Array.from(bytes, b => String.fromCharCode(b)).join('');
      encoded = btoa(binary);
    }
    const url = `${location.origin}${location.pathname}#view=${encoded}`;
    const sizeKB = (encoded.length / 1024).toFixed(1);
    const inp = document.getElementById('spec-link-input');
    inp.value = url;
    document.getElementById('spec-link-meta').innerHTML = `
      ✓ Link size: <strong>${sizeKB} KB</strong> ·
      Last generated: ${new Date().toLocaleTimeString()} ·
      Round ${APP.season.currentRound}/${APP.season.calendar.length}
      ${sizeKB > 50 ? '<br>⚠ Large URL — some messaging apps may truncate. Consider asking delegates to use a desktop browser for best results.' : ''}`;
    notify('✓ Spectator link ready — copy & share', 'success');
  } catch(err) {
    notify('Failed: ' + err.message, 'error');
    console.warn(err);
  }
}

function exportStateJSON() {
  const snap = { ...getSpectatorSnapshot(), auth:APP.auth, exportedAt:new Date().toISOString() };
  const blob  = new Blob([JSON.stringify(snap, null, 2)], { type:'application/json' });
  const url   = URL.createObjectURL(blob);
  const a     = document.createElement('a');
  a.href = url; a.download = `f1mun_state_${new Date().toISOString().slice(0,10)}.json`;
  document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(url);
  notify('State exported', 'success');
}
function importStateJSON(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const data = JSON.parse(e.target.result);
      openModal({ title: 'Import State?',
        body: `<div class="text-sm">This will REPLACE all current data.</div>`,
        actions:[
          { label:'Cancel',           cls:'btn-ghost', onClick:closeModal },
          { label:'Import & Replace', cls:'btn-red',   onClick:() => {
            if (data.auth) APP.auth = data.auth;
            if (data.season) { APP.season = { ...APP.season, ...data.season };
              if (!APP.season.teamStrategies) APP.season.teamStrategies = {};
              if (!APP.season.teamAero) APP.season.teamAero = {};
              if (!APP.season.roundCrises) APP.season.roundCrises = {};
            }
            if (data.champ) APP.champ = data.champ;
            if (data.teams) APP.teams = data.teams;
            if (data.prices) APP.prices = data.prices;
            if (data.fpData) APP.fpData = data.fpData;
            if (data.ASSET_DB) ASSET_DB = { engines:[], principals:[], drivers:[], strategists:[], pitstops:[], technicalDirectors:[], ...data.ASSET_DB };
            saveState(); closeModal(); notify('✓ State imported', 'success');
            setTimeout(() => location.reload(), 800);
          }},
        ],
      });
    } catch(err) { notify('Invalid JSON: ' + err.message, 'error'); }
  };
  reader.readAsText(file);
}

/* ─── GUIDE ──────────────────────────────────────────────── */
function renderGuide() {
  document.getElementById('guide-content').innerHTML = `
    <div class="guide-wrap">
      <div class="guide-jumpnav">
        ${[
          ['gs',    '🚀 Quick Start'],
          ['flow',  '🗓 Race Weekend Flow'],
          ['assets','📦 Asset Types'],
          ['aero',  '🪶 Aero Packages'],
          ['strat', '🏁 Tyre Strategy'],
          ['crisis','🚨 Crisis System'],
          ['score', '🏆 Scoring'],
          ['spec',  '📊 Spectator Link'],
          ['dsq',   '⛔ Disqualification'],
          ['admin', '⚙ Admin Tools'],
        ].map(([id, label]) => `<a class="guide-jump-btn" href="#gs-${id}">${label}</a>`).join('')}
      </div>

      <div class="guide-section" id="gs-gs">
        <div class="guide-section-title">🚀 Quick Start</div>
        <div class="guide-card">
          <div class="guide-card-head">EB / Chair workflow</div>
          <ol class="guide-ol">
            <li><strong>Assets</strong> → import your CSV (Aero rows are skipped — aero is now a per-race choice)</li>
            <li><strong>Teams</strong> → create teams, assign engine, drivers, strategist, pit crew, principal, TD</li>
            <li><strong>Season</strong> → pick circuits, lock the season</li>
            <li><strong>Practice</strong> → run one Free Practice</li>
            <li><strong>Qualifying</strong> → set weather, run qualifying</li>
            <li><strong>Strategy</strong> → set each team's Aero Package + Tyre Strategy for this round (or use Set All to Recommended)</li>
            <li><strong>Race</strong> → press Lights Out (crisis may roll!), watch it unfold</li>
            <li><strong>Admin → Generate Spectator Link</strong> → share with delegates</li>
            <li>Move to next round and repeat from Step 5</li>
          </ol>
        </div>
      </div>

      <div class="guide-section" id="gs-flow">
        <div class="guide-section-title">🗓 Race Weekend Flow</div>
        <div class="guide-flow-steps">
          ${[
            ['Free Practice','One pre-season session. Generates tyre performance baseline for all drivers.'],
            ['Qualifying','Single flying lap per driver. Weather affects both qualifying AND the race (set once).'],
            ['Strategy Setup','EB enters each team\'s Aero Package and Tyre Strategy for the round. Correct choices for the track give real lap-time bonuses; wrong choices cost real lap-time.'],
            ['Race','Crisis check rolls (~25% chance of 2-driver injury). Lights out. Live simulation with TD effects, strategy fits, and race-day variance.'],
            ['Results','Final classification. EB can apply DSQ. Crisis events shown in race banner. Spectator link regenerated and shared.'],
          ].map(([title, desc], i) => `
            <div class="guide-flow-step">
              <div class="guide-flow-num">${i + 1}</div>
              <div><div class="guide-flow-title">${title}</div><div class="guide-flow-desc">${desc}</div></div>
            </div>`).join('')}
        </div>
      </div>

      <div class="guide-section" id="gs-assets">
        <div class="guide-section-title">📦 Asset Types</div>
        <div class="guide-grid-2">
          ${[
            ['#29b6f6','Engine','Power, Reliability, Deployment, Fuel_Eff, Thermal','The power unit. Reliability affects DNF probability — TD Reliability_Focus boosts this significantly.'],
            ['#e8002d','Team Principal','Strategy, Morale, Budget_Mgmt, Driver_Mgmt','Leadership. Contributes ~7-10% to car score.'],
            ['#00e676','Driver','Pace, Racecraft, Wet_Weather, Tyre_Mgmt, Consistency, Qualifying','Driver 1 & 2 race; Reserve is backup (auto-promoted in crisis events).'],
            ['#ab47bc','Strategist','Undercut, Overcut, Safety_Car, Tyre_Choice, Pitstop_Timing','Influences pit-stop timing and reaction to safety cars.'],
            ['#ff7043','Pit Crew','Stop_Time, Reliability, Undercut_Exec, Pressure_Handling, Multi_Stop','Determines pit-stop duration (21–30 s range).'],
            ['#26c6da','Technical Director','Technical_Knowledge, Dev_Speed, Reliability_Focus, Innovation, Setup_Mastery, Race_Engineering','MAJOR new role: Setup_Mastery → direct pace bonus; Reliability_Focus → big DNF reduction; Innovation → occasional race-pace breakthrough.'],
          ].map(([color, name, ratings, desc]) => `
            <div class="guide-asset-card" style="border-left:3px solid ${color}">
              <div class="guide-asset-name" style="color:${color}">${name}</div>
              <div class="guide-asset-ratings">Ratings: <em>${ratings}</em></div>
              <div class="guide-asset-desc">${desc}</div>
            </div>`).join('')}
        </div>
      </div>

      <div class="guide-section" id="gs-aero">
        <div class="guide-section-title">🪶 Aero Packages (per-race choice)</div>
        <div class="guide-card">
          <div class="guide-card-head">Aero is no longer an asset — it's a per-race tactical decision</div>
          <p class="text-sm" style="line-height:1.6;color:var(--text-2)">Before each race, the EB picks an aero package for each team. The package's fit with the track type determines a real pace bonus or penalty — wrong choices cost up to ~0.5s per lap.</p>
          <div class="guide-table-wrap">
            <table class="guide-table">
              <thead><tr><th>Package</th><th>Best for</th><th>Weak on</th><th>Side effect</th></tr></thead>
              <tbody>
                <tr><td>🪶 Low-Drag</td><td>Power, Street/Power, High-Speed</td><td>Street, Technical, Banked</td><td>None</td></tr>
                <tr><td>⚖️ Balanced</td><td>Balanced, Mixed</td><td>Nothing dramatic</td><td>Safe default — no big highs or lows</td></tr>
                <tr><td>🏎️ High-Downforce</td><td>Street, Technical, Banked, Street/Power</td><td>Power, High-Speed</td><td>+8% tyre deg</td></tr>
                <tr><td>💧 Wet Spec</td><td>Wet, Mixed weather</td><td>Dry races</td><td>Huge bonus in rain, big penalty in dry</td></tr>
                <tr><td>🔥 Aggressive</td><td>Power, Street/Power, High-Speed</td><td>—</td><td>Extra pace BUT +30% tyre deg</td></tr>
              </tbody>
            </table>
          </div>
          <div class="guide-tip">💡 Look at the Strategy page header — it shows the recommended aero package for the current track and weather.</div>
        </div>
      </div>

      <div class="guide-section" id="gs-strat">
        <div class="guide-section-title">🏁 Tyre Strategy</div>
        <div class="guide-card">
          <div class="guide-card-head">Tyre strategy fit matters more than ever in v3</div>
          <div class="guide-table-wrap">
            <table class="guide-table">
              <thead><tr><th>Strategy</th><th>Sequence</th><th>Best for</th></tr></thead>
              <tbody>
                <tr><td>1-Stop Endurance</td><td>H → H</td><td>Very low degradation (Vegas, Bahrain in cold)</td></tr>
                <tr><td>1-Stop Standard</td><td>M → H</td><td>Low-medium degradation (under 55%)</td></tr>
                <tr><td>1-Stop Gamble</td><td>S → H</td><td>Undercut opportunities, lower-mid deg</td></tr>
                <tr><td>2-Stop Balanced</td><td>M → M → H</td><td>Medium-high degradation, safe choice</td></tr>
                <tr><td>2-Stop Attack</td><td>S → M → H</td><td>High degradation (75%+), max pace</td></tr>
                <tr><td>3-Stop Sprint</td><td>S → S → M → H</td><td>Extreme degradation only</td></tr>
              </tbody>
            </table>
          </div>
          <div class="guide-tip">💡 Manual strategies are now STICKY — the car will follow the planned sequence within ±3 laps unless tyres are catastrophically gone. Pick wisely.</div>
        </div>
      </div>

      <div class="guide-section" id="gs-crisis">
        <div class="guide-section-title">🚨 Crisis System</div>
        <div class="guide-card">
          <p class="text-sm" style="line-height:1.6;color:var(--text-2)">A scripted mid-season crash. At the <strong>50% mark of the season</strong> (e.g. R3 of 5, R5 of 10), the <strong>Driver 2s</strong> of the current championship-leading constructor and the second-placed constructor collide and both miss that single race. Their reserves are activated.</p>
          <ul class="guide-ul">
            <li>Fires exactly once per season, at the midpoint race</li>
            <li>Targets are decided by constructor standings going into that race (P1 + P2 by points)</li>
            <li>Both Driver 2 slots are sidelined; reserves auto-promote for that race only</li>
            <li>Original drivers return automatically next round</li>
            <li>Points still post to the slot's championship record (so the team isn't penalised on paper)</li>
            <li>Crisis banner appears in Results and the reserves get a [RES] tag in timing tables</li>
            <li>If a team has no reserve, its D2 seat is empty for that race (no replacement)</li>
            <li>If only one team is championship-eligible by the midpoint, the crisis does not fire</li>
          </ul>
        </div>
      </div>

      <div class="guide-section" id="gs-score">
        <div class="guide-section-title">🏆 Scoring System</div>
        <div class="guide-grid-2">
          <div class="guide-card">
            <div class="guide-card-head">Points Table</div>
            <div class="guide-table-wrap">
              <table class="guide-table">
                <thead><tr><th>Position</th><th>Points</th></tr></thead>
                <tbody>
                  ${POINTS_SYS.map((p,i) => `<tr><td>P${i+1}</td><td>${p}</td></tr>`).join('')}
                  <tr style="border-top:1px solid var(--border-2)"><td>Fastest Lap (top 10)</td><td>+1</td></tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="guide-card">
            <div class="guide-card-head">v3 scoring philosophy</div>
            <ul class="guide-ul">
              <li>Strategy + Aero can swing pace by ~1.0s/lap — enough for an underdog to beat a top team if the favourite picks badly</li>
              <li>Race-day variance ("form wobble") means the same team won't always win</li>
              <li>TD has bigger effects: real reliability boost (-DNF chance), real pace bonus from Setup_Mastery</li>
              <li>Aggressive aero = +pace but +30% tyre deg → tradeoff matters</li>
            </ul>
          </div>
        </div>
      </div>

      <div class="guide-section" id="gs-spec">
        <div class="guide-section-title">📊 Spectator Analytics Link</div>
        <div class="guide-card">
          <p class="text-sm" style="line-height:1.6;color:var(--text-2)">Delegates do NOT log in. After each race, EB regenerates the Spectator Link in Admin and shares it via WhatsApp/Telegram/Email. Delegates open the link and see a read-only dashboard with all standings, race results, asset registry, team analytics, and race events.</p>
          <ol class="guide-ol">
            <li>Go to <strong>Admin → 📊 Spectator Analytics Link</strong></li>
            <li>Click <strong>⚡ Generate Spectator Link</strong></li>
            <li>Copy the link (📋 button) and paste into your delegate group chat</li>
            <li>Delegates open the link on any device — read-only view loads</li>
            <li>After each race, regenerate and reshare</li>
          </ol>
          <div class="guide-tip">💡 The link contains compressed state — works fully offline once opened. No server, no network dependencies, no logins for delegates.</div>
          <div class="guide-note">⚠ If the link is over ~50 KB, some messaging apps may truncate it. Tell delegates to use a desktop browser or share via email/Google Docs in that case.</div>
        </div>
      </div>

      <div class="guide-section" id="gs-dsq">
        <div class="guide-section-title">⛔ Driver Disqualification</div>
        <div class="guide-card">
          <ol class="guide-ol">
            <li>Go to <strong>Results</strong> tab after a race</li>
            <li>Find the driver in Final Classification</li>
            <li>Click <span style="color:var(--accent)">⛔ DSQ</span> — confirm</li>
            <li>Click <span style="color:var(--green)">↩ Un-DSQ</span> to reverse</li>
          </ol>
        </div>
      </div>

      <div class="guide-section" id="gs-admin">
        <div class="guide-section-title">⚙ Admin Tools</div>
        <div class="guide-card">
          <div class="guide-table-wrap">
            <table class="guide-table">
              <thead><tr><th>Action</th><th>Use</th></tr></thead>
              <tbody>
                <tr><td>Set admin password</td><td>Change the EB login code</td></tr>
                <tr><td>Swap Drivers</td><td>Re-assign driver slots within a team</td></tr>
                <tr><td>Activate Reserve</td><td>Manually promote reserve into a race seat</td></tr>
                <tr><td>Generate Spectator Link</td><td>Share read-only dashboard with delegates</td></tr>
                <tr><td>Export/Import State</td><td>JSON backup; replace current state</td></tr>
                <tr><td>Reset Season Progress</td><td>Clear race results, keep teams/assets</td></tr>
                <tr><td>Reset Everything</td><td>Full wipe + reload</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>`;
}


/* ════════════════════════════════════════════════════════════════
   PART 7 — MODAL, NOTIFY, POPUPS, SPECTATOR VIEW, BOOT
════════════════════════════════════════════════════════════════ */

/* ─── GENERIC MODAL ─────────────────────────────────────────── */
function openModal({ title, body, actions, wide=false }) {
  const ov  = document.getElementById('modal-overlay');
  const m   = ov.querySelector('.modal');
  const t   = document.getElementById('modal-title');
  const bd  = document.getElementById('modal-body');
  const ac  = document.getElementById('modal-actions');
  if (!ov || !t || !bd || !ac) return;
  t.textContent = title || '';
  bd.innerHTML  = body  || '';
  ac.innerHTML  = '';
  m.classList.toggle('modal-wide', !!wide);
  (actions || []).forEach(a => {
    const b = document.createElement('button');
    b.className = `btn ${a.cls || 'btn-primary'}`;
    b.textContent = a.label;
    b.addEventListener('click', e => {
      if (typeof a.onClick === 'function') a.onClick(e);
    });
    ac.appendChild(b);
  });
  ov.hidden = false;
  ov.classList.add('open');
}
function closeModal() {
  const ov = document.getElementById('modal-overlay');
  if (!ov) return;
  ov.hidden = true;
  ov.classList.remove('open');
}

/* ─── TOAST NOTIFICATIONS ───────────────────────────────────── */
function notify(msg, type='info') {
  const c = document.getElementById('notif-container');
  if (!c) { console.log('[notify]', type, msg); return; }
  const n = document.createElement('div');
  n.className = `notif notif-${type}`;
  n.textContent = msg;
  c.appendChild(n);
  requestAnimationFrame(() => n.classList.add('notif-show'));
  setTimeout(() => {
    n.classList.remove('notif-show');
    n.classList.add('notif-hide');
    setTimeout(() => n.remove(), 350);
  }, type === 'error' ? 4500 : 2800);
}

/* ─── CONFETTI & FIREWORKS GENERATORS ───────────────────────── */
function generateConfetti(containerId, isGrand=false) {
  const c = document.getElementById(containerId);
  if (!c) return;
  c.innerHTML = '';
  const count = isGrand ? 140 : 70;
  const colors = ['#ff3b30','#ffd60a','#34c759','#0a84ff','#bf5af2','#ff9f0a','#ff6482','#5ac8fa'];
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'confetti-piece';
    p.style.left            = (Math.random() * 100) + '%';
    p.style.background      = colors[Math.floor(Math.random() * colors.length)];
    p.style.animationDelay  = (Math.random() * 0.8) + 's';
    p.style.animationDuration = (1.8 + Math.random() * 1.6) + 's';
    p.style.transform       = `rotate(${Math.random() * 360}deg)`;
    if (Math.random() > 0.5) p.classList.add('confetti-rect');
    c.appendChild(p);
  }
}

function generateFireworks(containerId) {
  const c = document.getElementById(containerId);
  if (!c) return;
  c.innerHTML = '';
  const colors = ['#ffd60a','#ff3b30','#0a84ff','#34c759','#bf5af2','#ff9f0a'];
  for (let i = 0; i < 12; i++) {
    const fw = document.createElement('div');
    fw.className = 'firework';
    fw.style.left           = (10 + Math.random() * 80) + '%';
    fw.style.top            = (15 + Math.random() * 55) + '%';
    fw.style.animationDelay = (Math.random() * 3) + 's';
    fw.style.setProperty('--fw-color', colors[i % colors.length]);
    c.appendChild(fw);
  }
}

/* ─── PHOTO FINISH (briefly held tension before winner popup) ── */
function showPhotoFinish(p1, p2, gap, callback) {
  openModal({
    title: '📸 PHOTO FINISH!',
    wide: true,
    body: `
      <div style="text-align:center;padding:20px 8px">
        <div style="font-size:18px;color:var(--text-2);margin-bottom:16px">
          Margin of victory: <strong style="color:var(--accent)">${gap.toFixed(3)}s</strong>
        </div>
        <div style="display:flex;justify-content:center;gap:24px;align-items:end;margin:20px 0">
          <div style="text-align:center">
            <div style="font-size:14px;color:var(--text-3)">P1</div>
            <div style="font-size:22px;font-weight:700;color:${p1.color || 'var(--accent)'}">${escHtml(p1.driverName || '')}</div>
            <div style="font-size:13px;color:var(--text-2)">${escHtml(p1.teamName || '')}</div>
          </div>
          <div style="font-size:30px;align-self:center">vs</div>
          <div style="text-align:center">
            <div style="font-size:14px;color:var(--text-3)">P2</div>
            <div style="font-size:22px;font-weight:700;color:${p2.color || 'var(--text-2)'}">${escHtml(p2.driverName || '')}</div>
            <div style="font-size:13px;color:var(--text-2)">${escHtml(p2.teamName || '')}</div>
          </div>
        </div>
        <div style="font-size:13px;color:var(--text-3);margin-top:10px">Stewards reviewing…</div>
      </div>`,
    actions: [{
      label: '🏁 Reveal Winner',
      cls:   'btn-primary',
      onClick: () => { closeModal(); if (typeof callback === 'function') callback(); }
    }]
  });
}

/* ─── RACE WINNER POPUP ─────────────────────────────────────── */
function showRaceWinnerPopup(round) {
  const pop  = document.getElementById('win-popup');
  const card = document.getElementById('win-card');
  if (!pop || !card || !round?.raceResults?.classification?.length) return;

  const p1 = round.raceResults.classification[0];
  const p2 = round.raceResults.classification[1];
  const p3 = round.raceResults.classification[2];

  const trk = TRACKS.find(t => t.id === round.trackId);
  const trackName = trk ? `${trk.flag} ${trk.name}` : (round.trackName || 'Race');

  card.innerHTML = `
    <div class="win-header">
      <div class="win-flag">🏁</div>
      <div class="win-title">RACE WINNER</div>
      <div class="win-track">${escHtml(trackName)} · Round ${round.roundNumber}</div>
    </div>
    <div class="win-winner" style="border-color:${p1.color || 'var(--accent)'}">
      <div class="win-pos">P1</div>
      <div class="win-driver" style="color:${p1.color || 'var(--accent)'}">${escHtml(p1.driverName)}</div>
      <div class="win-team">${escHtml(p1.teamName)}</div>
      <div class="win-time">${fmtTime(p1.totalTime)}</div>
    </div>
    <div class="win-podium">
      ${p2 ? `<div class="win-podium-row"><span class="win-pp">P2</span> <strong style="color:${p2.color}">${escHtml(p2.driverName)}</strong> <span class="win-pg">+${(p2.totalTime - p1.totalTime).toFixed(3)}s</span></div>` : ''}
      ${p3 ? `<div class="win-podium-row"><span class="win-pp">P3</span> <strong style="color:${p3.color}">${escHtml(p3.driverName)}</strong> <span class="win-pg">+${(p3.totalTime - p1.totalTime).toFixed(3)}s</span></div>` : ''}
    </div>
    <div class="win-actions">
      <button class="btn btn-ghost" id="win-dismiss">Close</button>
      <button class="btn btn-primary" id="win-results">View Full Results</button>
    </div>`;

  pop.hidden = false;
  pop.classList.add('open');
  generateConfetti('win-confetti', false);

  const close = () => {
    pop.classList.remove('open');
    setTimeout(() => { pop.hidden = true; }, 250);
    // After race-winner, if season complete → show champion popup
    const allDone = APP.season.calendar.every(r => r.completed);
    if (allDone) setTimeout(showSeasonChampionPopup, 600);
  };
  document.getElementById('win-dismiss')?.addEventListener('click', close);
  document.getElementById('win-results')?.addEventListener('click', () => {
    close();
    APP.ui.page = 'results';
    APP.ui.viewRound = APP.season.calendar.indexOf(round);
    buildNav(); updateSidebar(); renderResults();
  });
}

/* ─── SEASON CHAMPION POPUP (staged cinematic reveal) ───────── */
function showSeasonChampionPopup() {
  const pop  = document.getElementById('champion-popup');
  const card = document.getElementById('champion-card');
  if (!pop || !card) return;

  // Compute final standings
  const teamPts = {};
  const driverPts = {};
  APP.teams.forEach(t => { teamPts[t.id] = 0; });
  APP.season.calendar.forEach(r => {
    if (!r.completed || !r.raceResults) return;
    r.raceResults.classification.forEach(e => {
      if (e.dsq) return;
      teamPts[e.teamId] = (teamPts[e.teamId] || 0) + (e.points || 0);
      const key = `${e.teamId}::${e.driverId}`;
      if (!driverPts[key]) driverPts[key] = { name: e.driverName, teamName: e.teamName, color: e.color, pts: 0 };
      driverPts[key].pts += (e.points || 0);
    });
  });

  const teamRank = APP.teams
    .map(t => ({ id: t.id, name: t.name, color: t.color, pts: teamPts[t.id] || 0 }))
    .sort((a,b) => b.pts - a.pts);
  const driverRank = Object.values(driverPts).sort((a,b) => b.pts - a.pts);

  const champTeam = teamRank[0];
  const champDriver = driverRank[0];

  card.innerHTML = `
    <div class="cs-stage cs-s0">
      <div class="cs-checkered"></div>
      <div class="cs-flash">2026 SEASON COMPLETE</div>
    </div>
    <div class="cs-stage cs-s2" hidden>
      <div class="cs-label">AND THE CONSTRUCTORS' CHAMPION IS…</div>
      <div class="cs-tension">🏆</div>
    </div>
    <div class="cs-stage cs-s4" hidden>
      <div class="cs-burst-in" style="color:${champTeam.color}">${escHtml(champTeam.name)}</div>
      <div class="cs-subtitle">CONSTRUCTORS' CHAMPION · ${champTeam.pts} pts</div>
      ${champDriver ? `<div class="cs-driver">
        <span class="cs-driver-label">DRIVERS' CHAMPION</span>
        <span class="cs-driver-name" style="color:${champDriver.color}">${escHtml(champDriver.name)}</span>
        <span class="cs-driver-pts">${champDriver.pts} pts · ${escHtml(champDriver.teamName)}</span>
      </div>` : ''}
    </div>
    <div class="cs-stage cs-s5" hidden>
      <div class="cs-final-title">FINAL STANDINGS</div>
      <div class="cs-final-grid">
        <div class="cs-final-col">
          <div class="cs-final-h">Constructors</div>
          ${teamRank.slice(0, 8).map((t, i) => `
            <div class="cs-final-row">
              <span class="cs-fp">${i+1}</span>
              <span class="cs-fn" style="color:${t.color}">${escHtml(t.name)}</span>
              <span class="cs-fpts">${t.pts}</span>
            </div>`).join('')}
        </div>
        <div class="cs-final-col">
          <div class="cs-final-h">Drivers</div>
          ${driverRank.slice(0, 8).map((d, i) => `
            <div class="cs-final-row">
              <span class="cs-fp">${i+1}</span>
              <span class="cs-fn" style="color:${d.color}">${escHtml(d.name)}</span>
              <span class="cs-fpts">${d.pts}</span>
            </div>`).join('')}
        </div>
      </div>
      <div class="cs-final-actions">
        <button class="btn btn-primary" id="cs-dismiss">🏁 Close</button>
      </div>
    </div>`;

  pop.hidden = false;
  pop.classList.add('open');
  generateFireworks('champion-fireworks');

  // Stage timing: 0s flash, 1.2s constructor tension, 2.6s reveal, 5.2s standings
  setTimeout(() => {
    card.querySelector('.cs-s0').hidden = true;
    card.querySelector('.cs-s2').hidden = false;
  }, 1400);
  setTimeout(() => {
    card.querySelector('.cs-s2').hidden = true;
    card.querySelector('.cs-s4').hidden = false;
    generateFireworks('champion-fireworks');
  }, 2800);
  setTimeout(() => {
    card.querySelector('.cs-s5').hidden = false;
    document.getElementById('cs-dismiss')?.addEventListener('click', () => {
      pop.classList.remove('open');
      setTimeout(() => { pop.hidden = true; }, 250);
    });
  }, 5400);
}



/* ════════════════════════════════════════════════════════════════
   SPECTATOR VIEW (read-only, loaded from #view=<lz_state> hash)
════════════════════════════════════════════════════════════════ */

let SPEC_MODE = false;

function detectSpectatorHash() {
  if (!location.hash.startsWith('#view=')) return null;
  const payload = location.hash.slice(6);
  if (!payload) return null;
  if (typeof LZString === 'undefined') {
    console.error('LZString not loaded');
    return null;
  }
  try {
    const json = LZString.decompressFromEncodedURIComponent(payload);
    if (!json) return null;
    return JSON.parse(json);
  } catch (err) {
    console.error('Failed to decode spectator hash:', err);
    return null;
  }
}

function bootSpectator(snapshot) {
  SPEC_MODE = true;

  // Replace APP with snapshot (keeping any UI defaults)
  APP = Object.assign({
    ui: { page: 'login', viewRound: 0, viewTeam: null, specPage: 'overview', specTeam: null }
  }, snapshot);
  if (!APP.ui) APP.ui = { specPage: 'overview', specTeam: null };
  APP.ui.specPage = 'overview';
  APP.ui.specTeam = null;

  // Hide all other screens
  ['screen-login', 'screen-app'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.hidden = true;
  });
  const spec = document.getElementById('screen-spectator');
  if (spec) spec.hidden = false;

  // Updated timestamp
  const updEl = document.getElementById('spec-updated');
  if (updEl) {
    const ts = snapshot.__exportedAt ? new Date(snapshot.__exportedAt) : new Date();
    updEl.textContent = `Updated ${ts.toLocaleString()}`;
  }

  renderSpectatorTabs();
  renderSpectatorPage();
}

function renderSpectatorTabs() {
  const wrap = document.getElementById('spec-tabs');
  if (!wrap) return;
  const tabs = [
    { id: 'overview',  label: '📋 Overview'    },
    { id: 'champ',     label: '🏆 Championship' },
    { id: 'results',   label: '🏁 Race Results' },
    { id: 'analytics', label: '📊 Team Analytics' },
    { id: 'assets',    label: '🎴 Asset Registry' },
  ];
  wrap.innerHTML = tabs.map(t =>
    `<button class="spec-tab ${APP.ui.specPage === t.id ? 'active' : ''}" data-spec="${t.id}">${t.label}</button>`
  ).join('');
  wrap.querySelectorAll('.spec-tab').forEach(b => {
    b.addEventListener('click', () => {
      APP.ui.specPage = b.dataset.spec;
      renderSpectatorTabs();
      renderSpectatorPage();
    });
  });
}

function renderSpectatorPage() {
  const main = document.getElementById('spec-main');
  if (!main) return;
  switch (APP.ui.specPage) {
    case 'overview':  return renderSpecOverview(main);
    case 'champ':     return renderSpecChampionship(main);
    case 'results':   return renderSpecResults(main);
    case 'analytics': return renderSpecAnalytics(main);
    case 'assets':    return renderSpecAssets(main);
    default:          main.innerHTML = '';
  }
}

/* Spec Overview — quick season status snapshot */
function renderSpecOverview(main) {
  const cal = APP.season?.calendar || [];
  const done = cal.filter(r => r.completed).length;
  const total = cal.length;
  const next = cal.find(r => !r.completed);
  const teams = APP.teams || [];

  // Standings preview
  const teamPts = {};
  teams.forEach(t => { teamPts[t.id] = 0; });
  cal.forEach(r => {
    if (!r.completed || !r.raceResults) return;
    r.raceResults.classification.forEach(e => {
      if (e.dsq) return;
      teamPts[e.teamId] = (teamPts[e.teamId] || 0) + (e.points || 0);
    });
  });
  const ranked = teams.map(t => ({ ...t, pts: teamPts[t.id] || 0 })).sort((a,b) => b.pts - a.pts);

  main.innerHTML = `
    <section class="spec-section">
      <header class="spec-section-head">
        <div>
          <h1 class="spec-title">${escHtml(APP.season?.name || '2026 Season')}</h1>
          <p class="spec-sub">Round ${done} of ${total} complete${next ? ` · Next: ${escHtml(next.trackName)}` : ' · Season finished'}</p>
        </div>
      </header>
      <div class="spec-grid">
        <div class="spec-card">
          <div class="spec-card-h">🏎 Constructors Standings (Top 5)</div>
          <div class="spec-card-body">
            ${ranked.slice(0, 5).map((t, i) => `
              <div class="spec-row">
                <span class="spec-rk">${i+1}</span>
                <span class="spec-nm" style="color:${t.color}">${escHtml(t.name)}</span>
                <span class="spec-vl">${t.pts} pts</span>
              </div>`).join('') || '<div class="spec-empty">No races completed yet.</div>'}
          </div>
        </div>
        <div class="spec-card">
          <div class="spec-card-h">📅 Calendar</div>
          <div class="spec-card-body">
            ${cal.map((r, i) => `
              <div class="spec-row">
                <span class="spec-rk">R${r.roundNumber}</span>
                <span class="spec-nm">${escHtml(r.trackName)}</span>
                <span class="spec-vl">${r.completed
                  ? '✅ Done'
                  : (i === done ? '⏳ Upcoming' : '—')}</span>
              </div>`).join('')}
          </div>
        </div>
      </div>
    </section>`;
}

/* Spec Championship — full constructor + driver tables */
function renderSpecChampionship(main) {
  const teams = APP.teams || [];
  const cal   = APP.season?.calendar || [];

  const teamPts = {};
  const driverPts = {};
  teams.forEach(t => { teamPts[t.id] = 0; });
  cal.forEach(r => {
    if (!r.completed || !r.raceResults) return;
    r.raceResults.classification.forEach(e => {
      if (e.dsq) return;
      teamPts[e.teamId] = (teamPts[e.teamId] || 0) + (e.points || 0);
      const key = `${e.teamId}::${e.driverId}`;
      if (!driverPts[key]) driverPts[key] = { name: e.driverName, teamName: e.teamName, color: e.color, pts: 0, wins: 0, poles: 0 };
      driverPts[key].pts += (e.points || 0);
      if (e.position === 1) driverPts[key].wins += 1;
    });
    if (r.qualResults?.order?.[0]) {
      const q = r.qualResults.order[0];
      const k = `${q.teamId}::${q.driverId}`;
      if (driverPts[k]) driverPts[k].poles += 1;
    }
  });

  const teamRank = teams.map(t => ({ ...t, pts: teamPts[t.id] || 0 })).sort((a,b) => b.pts - a.pts);
  const drvRank  = Object.values(driverPts).sort((a,b) => b.pts - a.pts);

  main.innerHTML = `
    <section class="spec-section">
      <h1 class="spec-title">🏆 Championship Standings</h1>
      <div class="spec-grid">
        <div class="spec-card">
          <div class="spec-card-h">Constructors</div>
          <table class="spec-table">
            <thead><tr><th>#</th><th>Team</th><th>Points</th></tr></thead>
            <tbody>
              ${teamRank.map((t, i) => `
                <tr>
                  <td>${i+1}</td>
                  <td style="color:${t.color};font-weight:600">${escHtml(t.name)}</td>
                  <td><strong>${t.pts}</strong></td>
                </tr>`).join('')}
            </tbody>
          </table>
        </div>
        <div class="spec-card">
          <div class="spec-card-h">Drivers</div>
          <table class="spec-table">
            <thead><tr><th>#</th><th>Driver</th><th>Team</th><th>W</th><th>Pole</th><th>Pts</th></tr></thead>
            <tbody>
              ${drvRank.map((d, i) => `
                <tr>
                  <td>${i+1}</td>
                  <td style="color:${d.color};font-weight:600">${escHtml(d.name)}</td>
                  <td>${escHtml(d.teamName)}</td>
                  <td>${d.wins}</td>
                  <td>${d.poles}</td>
                  <td><strong>${d.pts}</strong></td>
                </tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </section>`;
}

/* Spec Results — per-race classification + key events */
function renderSpecResults(main) {
  const cal = (APP.season?.calendar || []).filter(r => r.completed);
  if (!cal.length) {
    main.innerHTML = `<section class="spec-section"><h1 class="spec-title">🏁 Race Results</h1><div class="spec-empty">No races completed yet.</div></section>`;
    return;
  }
  if (typeof APP.ui.specViewRound !== 'number') APP.ui.specViewRound = 0;
  const idx = Math.max(0, Math.min(APP.ui.specViewRound, cal.length - 1));
  const r = cal[idx];
  const cls = r.raceResults?.classification || [];

  const crisis = (APP.season.roundCrises || {})[APP.season.calendar.indexOf(r)];

  main.innerHTML = `
    <section class="spec-section">
      <header class="spec-section-head">
        <h1 class="spec-title">🏁 ${escHtml(r.trackName)} — Round ${r.roundNumber}</h1>
        <select class="spec-select" id="spec-race-sel">
          ${cal.map((rr, i) => `<option value="${i}" ${i === idx ? 'selected' : ''}>R${rr.roundNumber} · ${escHtml(rr.trackName)}</option>`).join('')}
        </select>
      </header>
      ${crisis?.headline ? `<div class="spec-crisis">⚠ ${escHtml(crisis.headline)}</div>` : ''}
      <div class="spec-card">
        <table class="spec-table">
          <thead><tr><th>Pos</th><th>Driver</th><th>Team</th><th>Time</th><th>Aero</th><th>Strat</th><th>Pts</th></tr></thead>
          <tbody>
            ${cls.map(e => {
              const aero = AERO_PACKAGES[e.aeroKey];
              const strat = TYRE_STRATEGIES[e.stratKey];
              const posLbl = e.dsq ? 'DSQ' : (e.dnf ? 'DNF' : `P${e.position}`);
              return `
                <tr ${e.dsq ? 'style="opacity:.55;text-decoration:line-through"' : ''}>
                  <td>${posLbl}</td>
                  <td style="color:${e.color};font-weight:600">${escHtml(e.driverName)}${e.reserve ? ' <span class="spec-tag">RES</span>' : ''}</td>
                  <td>${escHtml(e.teamName)}</td>
                  <td>${e.dnf || e.dsq ? '—' : fmtTime(e.totalTime)}</td>
                  <td>${aero ? aero.icon + ' ' + escHtml(aero.shortName || aero.name) : '—'}</td>
                  <td>${strat ? escHtml(strat.shortName || strat.name) : '—'}</td>
                  <td><strong>${e.points || 0}</strong></td>
                </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
      ${r.raceResults?.events?.length ? `
        <div class="spec-card">
          <div class="spec-card-h">🎙 Race Feed (key moments)</div>
          <div class="spec-events">
            ${r.raceResults.events.slice(-30).map(ev => `<div class="spec-ev ${ev.cls || ''}">L${ev.lap || '·'} — ${escHtml(ev.text)}</div>`).join('')}
          </div>
        </div>` : ''}
    </section>`;

  document.getElementById('spec-race-sel')?.addEventListener('change', e => {
    APP.ui.specViewRound = parseInt(e.target.value, 10) || 0;
    renderSpecResults(main);
  });
}

/* Spec Analytics — per-team aero/strat performance over the season */
function renderSpecAnalytics(main) {
  const teams = APP.teams || [];
  if (!teams.length) {
    main.innerHTML = `<section class="spec-section"><h1 class="spec-title">📊 Team Analytics</h1><div class="spec-empty">No teams.</div></section>`;
    return;
  }
  if (!APP.ui.specTeam) APP.ui.specTeam = teams[0].id;
  const team = teams.find(t => t.id === APP.ui.specTeam) || teams[0];

  const rows = [];
  (APP.season?.calendar || []).forEach(r => {
    if (!r.completed) return;
    const entries = (r.raceResults?.classification || []).filter(e => e.teamId === team.id);
    entries.forEach(e => {
      const aero = AERO_PACKAGES[e.aeroKey];
      const strat = TYRE_STRATEGIES[e.stratKey];
      rows.push({
        round: r.roundNumber, track: r.trackName,
        driver: e.driverName, pos: e.dsq ? 'DSQ' : (e.dnf ? 'DNF' : 'P' + e.position),
        pts: e.points || 0,
        aero: aero ? (aero.icon + ' ' + (aero.shortName || aero.name)) : '—',
        strat: strat ? (strat.shortName || strat.name) : '—',
        aeroFit: typeof e.aeroFit === 'number' ? (e.aeroFit * 100).toFixed(0) + '%' : '—',
        stratFit: typeof e.stratFit === 'number' ? (e.stratFit * 100).toFixed(0) + '%' : '—'
      });
    });
  });

  main.innerHTML = `
    <section class="spec-section">
      <header class="spec-section-head">
        <h1 class="spec-title">📊 Team Analytics</h1>
        <select class="spec-select" id="spec-team-sel">
          ${teams.map(t => `<option value="${t.id}" ${t.id === team.id ? 'selected' : ''}>${escHtml(t.name)}</option>`).join('')}
        </select>
      </header>
      <div class="spec-team-head" style="border-color:${team.color}">
        <h2 style="color:${team.color}">${escHtml(team.name)}</h2>
        <div class="spec-sub">${(team.principal?.name) ? `Principal: ${escHtml(team.principal.name)}` : 'No Principal'}</div>
      </div>
      <div class="spec-card">
        <div class="spec-card-h">Race-by-Race Choices & Outcomes</div>
        ${rows.length ? `
          <table class="spec-table">
            <thead><tr><th>R</th><th>Track</th><th>Driver</th><th>Aero</th><th>Aero Fit</th><th>Strat</th><th>Strat Fit</th><th>Pos</th><th>Pts</th></tr></thead>
            <tbody>
              ${rows.map(r => `
                <tr>
                  <td>R${r.round}</td><td>${escHtml(r.track)}</td><td>${escHtml(r.driver)}</td>
                  <td>${r.aero}</td><td>${r.aeroFit}</td>
                  <td>${escHtml(r.strat)}</td><td>${r.stratFit}</td>
                  <td>${r.pos}</td><td><strong>${r.pts}</strong></td>
                </tr>`).join('')}
            </tbody>
          </table>` : '<div class="spec-empty">No race data for this team yet.</div>'}
      </div>
    </section>`;

  document.getElementById('spec-team-sel')?.addEventListener('change', e => {
    APP.ui.specTeam = e.target.value;
    renderSpecAnalytics(main);
  });
}

/* Spec Assets — registry of every assigned asset per team */
function renderSpecAssets(main) {
  const teams = APP.teams || [];
  if (!teams.length) {
    main.innerHTML = `<section class="spec-section"><h1 class="spec-title">🎴 Asset Registry</h1><div class="spec-empty">No teams.</div></section>`;
    return;
  }

  main.innerHTML = `
    <section class="spec-section">
      <h1 class="spec-title">🎴 Asset Registry</h1>
      <div class="spec-grid spec-asset-grid">
        ${teams.map(t => {
          const slots = [
            ['principal', '👔 Principal', t.principal],
            ['engine',    '🔧 Engine',    t.engine],
            ['driver1',   '🏎 Driver 1',  t.driver1],
            ['driver2',   '🏎 Driver 2',  t.driver2],
            ['reserve',   '🪑 Reserve',   t.reserve],
            ['strategy',  '📋 Strategy',  t.strategy],
            ['pit',       '🛠 Pit Crew',  t.pit],
            ['td',        '📐 Tech Dir',  t.td],
          ];
          return `
            <div class="spec-card" style="border-top:3px solid ${t.color}">
              <div class="spec-card-h" style="color:${t.color}">${escHtml(t.name)}</div>
              <div class="spec-asset-list">
                ${slots.map(([k, lbl, a]) => `
                  <div class="spec-asset-row">
                    <span class="spec-asset-lbl">${lbl}</span>
                    <span class="spec-asset-val">${a ? escHtml(a.name) + (a.rating ? ` <small>(${a.rating})</small>` : '') : '<em style="opacity:.5">—</em>'}</span>
                  </div>`).join('')}
              </div>
            </div>`;
        }).join('')}
      </div>
    </section>`;
}



/* ════════════════════════════════════════════════════════════════
   BOOT — wire login + global handlers + entry point
════════════════════════════════════════════════════════════════ */

function wireGlobalHandlers() {
  // Modal: click overlay (not inner card) or ESC to close
  const ov = document.getElementById('modal-overlay');
  if (ov) {
    ov.addEventListener('click', e => { if (e.target === ov) closeModal(); });
  }
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if (ov && !ov.hidden) closeModal();
    }
  });

  // Warn before unload during a live race
  window.addEventListener('beforeunload', e => {
    if (APP.race?.running) {
      e.preventDefault();
      e.returnValue = 'A race is in progress. Are you sure you want to leave?';
      return e.returnValue;
    }
  });
}

function wireLoginScreen() {
  const submit = document.getElementById('login-submit-btn');
  const pwInp  = document.getElementById('login-pw');
  if (submit) submit.addEventListener('click', attemptLogin);
  if (pwInp) {
    pwInp.addEventListener('keydown', e => {
      if (e.key === 'Enter') { e.preventDefault(); attemptLogin(); }
    });
  }
}

/* Wire all static (always-in-DOM) interactive elements once at app entry.
   Page-specific buttons rendered inside innerHTML are wired by their renderers. */
function wireStaticAppHandlers() {
  // Top-nav logout
  const lo = document.getElementById('nav-logout-btn');
  if (lo) lo.addEventListener('click', logout);

  // Assets toolbar
  const csv = document.getElementById('csv-file-input');
  if (csv) csv.addEventListener('change', e => {
    if (e.target.files[0]) importCSVFile(e.target.files[0]);
    e.target.value = '';
  });
  const sheetsBtn = document.getElementById('sheets-fetch-btn');
  if (sheetsBtn) sheetsBtn.addEventListener('click', importFromSheets);
  const resetA = document.getElementById('reset-assets-btn');
  if (resetA) resetA.addEventListener('click', resetAssets);

  // Teams page
  const createBtn = document.getElementById('create-team-btn');
  if (createBtn) createBtn.addEventListener('click', createTeam);
  const newTeamName = document.getElementById('new-team-name');
  if (newTeamName) newTeamName.addEventListener('keydown', e => {
    if (e.key === 'Enter') { e.preventDefault(); createTeam(); }
  });

  // Season page lock/unlock + dynamic rounds preview
  const lockBtn = document.getElementById('lock-season-btn');
  if (lockBtn) lockBtn.addEventListener('click', lockSeason);
  const unlockBtn = document.getElementById('unlock-season-btn');
  if (unlockBtn) unlockBtn.addEventListener('click', unlockSeason);
  const roundsInp = document.getElementById('season-rounds');
  if (roundsInp) roundsInp.addEventListener('input', updateCalendarPreview);
}

function init() {
  // 1. Always load state first (so spectator can fall back to local APP if needed)
  loadState();

  // 2. Spectator-mode check (URL hash)
  const snap = detectSpectatorHash();
  if (snap) {
    bootSpectator(snap);
    return;
  }

  // 3. Normal admin flow
  wireGlobalHandlers();
  wireLoginScreen();

  // If already logged in (shouldn't be — session isn't persisted — but defensive)
  if (APP.session?.role === 'admin') {
    enterApp();
  } else {
    document.getElementById('screen-login').hidden = false;
    document.getElementById('screen-app').hidden   = true;
    const spec = document.getElementById('screen-spectator');
    if (spec) spec.hidden = true;
  }
}

// Bootstrap (script has defer, but DOM may already be parsed)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}