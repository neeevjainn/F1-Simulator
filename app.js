/* ═══════════════════════════════════════════════════════════════
   F1 MUN — RACE CONTROL SYSTEM  ·  app.js  v2
   ── PART 1 of 6 ── Constants · Asset DB · State · Persistence · Utilities
   ───────────────────────────────────────────────────────────────
   To resume after a usage-limit interruption, check the last
   written line with:  tail -5 /home/claude/app.js
   Then continue appending at the correct Part number.
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
];

const WEATHER_OPTIONS = [
  { id:'dry',      emoji:'☀️', label:'Dry',      mods:{ power:1.00, reliability:1.00, wet:0.0, tyre:1.00, sc:1.0  } },
  { id:'overcast', emoji:'☁️', label:'Overcast', mods:{ power:0.99, reliability:0.99, wet:0.2, tyre:1.01, sc:1.10 } },
  { id:'wet',      emoji:'🌧️', label:'Wet',      mods:{ power:0.88, reliability:0.91, wet:1.0, tyre:0.82, sc:1.60 } },
  { id:'mixed',    emoji:'⛈️', label:'Mixed',    mods:{ power:0.93, reliability:0.93, wet:0.6, tyre:0.87, sc:1.35 } },
];

const POINTS_SYS = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1];
const FL_BONUS   = 1;

/* ── Dry-weather tyre strategy presets ──────────────────────── */
const TYRE_STRATEGIES = [
  { id:'auto',     name:'Auto Strategy',    desc:'Simulator decides',           icon:'🤖', compounds:null,              stops:null, style:'auto'         },
  { id:'s_m_h',    name:'2-Stop Attack',    desc:'Soft → Medium → Hard',        icon:'🔴', compounds:['S','M','H'],      stops:2,    style:'aggressive'   },
  { id:'m_h',      name:'1-Stop Standard',  desc:'Medium → Hard',               icon:'🟡', compounds:['M','H'],          stops:1,    style:'conservative' },
  { id:'s_h',      name:'1-Stop Gamble',    desc:'Soft → Hard',                 icon:'🎲', compounds:['S','H'],          stops:1,    style:'gamble'       },
  { id:'h_h',      name:'1-Stop Endurance', desc:'Hard → Hard',                 icon:'⚪', compounds:['H','H'],          stops:1,    style:'endurance'    },
  { id:'m_m_h',    name:'2-Stop Balanced',  desc:'Medium → Medium → Hard',      icon:'🟡', compounds:['M','M','H'],      stops:2,    style:'balanced'     },
  { id:'s_s_m_h',  name:'3-Stop Sprint',    desc:'Soft → Soft → Medium → Hard', icon:'🔥', compounds:['S','S','M','H'],  stops:3,    style:'ultra'        },
];

/* ── Wet/mixed strategy presets ─────────────────────────────── */
const WET_TYRE_STRATEGIES = [
  { id:'wet_auto', name:'Auto',         desc:'Weather-adjusted auto strategy', icon:'🤖', compounds:null,            stops:null, style:'auto'       },
  { id:'w_w',      name:'Full Wet',     desc:'Wet → Wet',                      icon:'💧', compounds:['W','W'],       stops:1,    style:'wet'        },
  { id:'w_i_m',    name:'Transition',   desc:'Wet → Inter → Medium',           icon:'⛈️', compounds:['W','I','M'],   stops:2,    style:'transition' },
  { id:'i_m',      name:'Intermediate', desc:'Inter → Medium',                 icon:'🌧️', compounds:['I','M'],       stops:1,    style:'inter'      },
];

const TYPE_COLORS = {
  engines:'#29b6f6', principals:'#e8002d',   drivers:'#00e676',
  aero:'#ffd700',    strategists:'#ab47bc',  pitstops:'#ff7043',
  technicalDirectors:'#26c6da',
};
const TYPE_LABELS = {
  engines:'Engine',  principals:'Team Principal', drivers:'Driver',
  aero:'Aero Package', strategists:'Strategist',  pitstops:'Pit Crew',
  technicalDirectors:'Technical Director',
};
const TYPE_TO_SLOT = {
  engines:'engine', principals:'principal', drivers:['driver1','driver2','reserve'],
  aero:'aero', strategists:'strategist', pitstops:'pitcrew',
  technicalDirectors:'techDir',
};
const SLOT_LABELS = {
  engine:'Engine',  principal:'Principal',
  driver1:'Driver 1', driver2:'Driver 2', reserve:'Reserve',
  aero:'Aero', strategist:'Strategist', pitcrew:'Pit Crew',
  techDir:'Tech Director',
};
const SLOT_ORDER = ['engine','principal','driver1','driver2','reserve','aero','strategist','pitcrew','techDir'];
const SLOT_TO_TYPE = {
  engine:'engines', principal:'principals',
  driver1:'drivers', driver2:'drivers', reserve:'drivers',
  aero:'aero', strategist:'strategists', pitcrew:'pitstops',
  techDir:'technicalDirectors',
};

const TIRE_COMPOUNDS = {
  S: { name:'Soft',   pace:0.0,  cliff:22, deg:0.045, css:'tire-soft'   },
  M: { name:'Medium', pace:0.55, cliff:34, deg:0.030, css:'tire-medium' },
  H: { name:'Hard',   pace:1.10, cliff:46, deg:0.020, css:'tire-hard'   },
  I: { name:'Inter',  pace:0.80, cliff:30, deg:0.035, css:'tire-inter'  },
  W: { name:'Wet',    pace:1.60, cliff:35, deg:0.030, css:'tire-wet'    },
};

const RACE_SPEEDS = { '0.25x':2400, '1x':600, '4x':150 };


/* ─── 2. ASSET DB SCAFFOLD ─────────────────────────────────── */
let ASSET_DB = {
  engines:[], principals:[], drivers:[],
  aero:[], strategists:[], pitstops:[],
  technicalDirectors:[],            /* NEW — Technical Directors */
};


/* ─── 3. EMBEDDED STATE PLACEHOLDER ────────────────────────── */
const EMBEDDED_STATE = /*EMBED_STATE_START*/null/*EMBED_STATE_END*/;


/* ─── 4. APP STATE ─────────────────────────────────────────── */
const APP = {
  auth: { adminPw:'ADMIN2025', userPw:'F1MUN2025' },
  session: { role:null, teamId:null },
  season: {
    name: 'F1 MUN Grand Prix Championship',
    started: false,
    fpDone: false,
    currentRound: 0,
    calendar: [],
    selectedTrackIds: [],
    teamStrategies: {},   /* { roundIdx: { teamId: strategyKey } } */
  },
  champ: {
    drivers: {},      /* driverKey → stats */
    constructors: {}, /* teamId   → stats */
  },
  teams: [],
  prices: {},
  fpData: null,
  /* ── Live-sync state ───────────────────────── */
  sync: {
    sessionId:  null,   /* JSONBlob blob ID when session is active   */
    isHost:     false,
    autoSync:   false,  /* auto-push after each race if true         */
    lastPushAt: null,
    lastPullAt: null,
  },
  ui: {
    filterType: 'all',
    selectedAnalyticsTeam: null,
    qualWeather: 'dry',
    tradeA: null, tradeB: null, tradeASelected: [], tradeBSelected: [],
    selectedStrategyRound: null,   /* which round is open in Strategy tab */
    selectedResult: null,
  },
  race: { running:false, paused:false, speedKey:'1x', interval:null, state:null },
};


/* ─── 5. PERSISTENCE ───────────────────────────────────────── */
const LS_KEY = 'f1mun_v3';

function saveState() {
  try {
    const snap = {
      auth:   APP.auth,
      session:APP.session,
      season: APP.season,
      champ:  APP.champ,
      teams:  APP.teams,
      prices: APP.prices,
      fpData: APP.fpData,
      sync:   { sessionId: APP.sync.sessionId, isHost: APP.sync.isHost,
                autoSync: APP.sync.autoSync, lastPushAt: APP.sync.lastPushAt },
      ASSET_DB,
    };
    localStorage.setItem(LS_KEY, JSON.stringify(snap));
  } catch(e) { console.warn('Save failed:', e); }
}

function loadState() {
  let src = null;
  if (EMBEDDED_STATE) src = EMBEDDED_STATE;
  else {
    try { const s = localStorage.getItem(LS_KEY); if (s) src = JSON.parse(s); } catch(e){}
  }
  if (!src) return;

  if (src.auth)    APP.auth    = { ...APP.auth,    ...src.auth };
  if (src.season)  {
    APP.season = { ...APP.season, ...src.season };
    if (!APP.season.teamStrategies) APP.season.teamStrategies = {};
  }
  if (src.champ)   APP.champ   = src.champ;
  if (src.teams)   APP.teams   = src.teams;
  if (src.prices)  APP.prices  = src.prices;
  if (src.fpData)  APP.fpData  = src.fpData;
  if (src.sync)    APP.sync    = { ...APP.sync, ...src.sync, lastPullAt: null };
  if (src.ASSET_DB && Object.values(src.ASSET_DB).some(a => a.length)) {
    ASSET_DB = { ...ASSET_DB, ...src.ASSET_DB };
    if (!ASSET_DB.technicalDirectors) ASSET_DB.technicalDirectors = [];
  }
  /* Migrate: add missing slots (techDir) and flatten object refs → IDs */
  APP.teams.forEach(t => {
    if (!t.assets) t.assets = blankSlots();
    SLOT_ORDER.forEach(s => {
      if (!(s in t.assets)) t.assets[s] = null;
      if (t.assets[s] && typeof t.assets[s] === 'object') t.assets[s] = t.assets[s].id;
    });
  });
}

/* Snapshot used for sync export (excludes admin password) */
function getPublicStateSnapshot() {
  return {
    season:  APP.season,
    champ:   APP.champ,
    teams:   APP.teams,
    prices:  APP.prices,
    fpData:  APP.fpData,
    ASSET_DB,
    exportedAt: new Date().toISOString(),
  };
}

/* Apply an imported/synced snapshot */
function applyStateSnapshot(data) {
  if (data.season) {
    APP.season = { ...APP.season, ...data.season };
    if (!APP.season.teamStrategies) APP.season.teamStrategies = {};
  }
  if (data.champ)   APP.champ  = data.champ;
  if (data.teams)   APP.teams  = data.teams;
  if (data.prices)  APP.prices = data.prices;
  if (data.fpData)  APP.fpData = data.fpData;
  if (data.ASSET_DB && Object.values(data.ASSET_DB).some(a => a.length)) {
    ASSET_DB = { ...ASSET_DB, ...data.ASSET_DB };
    if (!ASSET_DB.technicalDirectors) ASSET_DB.technicalDirectors = [];
  }
  APP.teams.forEach(t => {
    if (!t.assets) t.assets = blankSlots();
    SLOT_ORDER.forEach(s => { if (!(s in t.assets)) t.assets[s] = null; });
  });
  saveState();
}


/* ─── 6. UTILITIES ─────────────────────────────────────────── */
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
function fmtGap(secs) {
  if (!isFinite(secs)) return '—';
  return secs >= 0 ? `+${secs.toFixed(3)}` : secs.toFixed(3);
}
function escHtml(s) {
  return String(s ?? '').replace(/[&<>"']/g,
    c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
}
function blankSlots() {
  return {
    engine:null, principal:null,
    driver1:null, driver2:null, reserve:null,
    aero:null, strategist:null, pitcrew:null,
    techDir:null,
  };
}
function uid(prefix = 'id') { return prefix + '_' + Math.random().toString(36).slice(2,10); }

function getAsset(id) {
  if (!id) return null;
  for (const cat of Object.values(ASSET_DB)) {
    const a = cat.find(x => x.id === id);
    if (a) return a;
  }
  return null;
}
function assetCategory(id) {
  for (const [k, arr] of Object.entries(ASSET_DB)) {
    if (arr.some(a => a.id === id)) return k;
  }
  return null;
}
function allAssets() { return Object.values(ASSET_DB).flat(); }

function ovr(asset) {
  if (!asset?.ratings) return 0;
  const v = Object.values(asset.ratings).filter(n => typeof n === 'number');
  if (!v.length) return 0;
  return Math.round(v.reduce((a,b) => a + b, 0) / v.length);
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
  return !!(
    a.engine && a.principal && a.driver1 && a.driver2 &&
    a.aero && a.strategist && a.pitcrew &&
    (hasTDs ? a.techDir : true)
  );
}
function teamOvr(team) {
  const ids = SLOT_ORDER.filter(s => s !== 'reserve').map(s => team.assets[s]).filter(Boolean);
  if (!ids.length) return null;
  const all = ids.flatMap(id => {
    const a = getAsset(id);
    return a ? Object.values(a.ratings).filter(n => typeof n === 'number') : [];
  });
  if (!all.length) return null;
  return Math.round(all.reduce((a,b) => a + b, 0) / all.length);
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
function slotOf(team, assetId) {
  return SLOT_ORDER.find(s => team.assets[s] === assetId);
}

/* Strategy helpers */
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
  notify(info ? `Strategy: ${info.name}` : 'Strategy updated', 'success');
}
/* ─── END OF PART 1 ──────────────────────────────────────── */

/* ═══════════════════════════════════════════════════════════════
   PART 2 — Auth · Navigation · CSV · Dashboard · Assets · Teams
═══════════════════════════════════════════════════════════════ */

/* ─── 7. AUTHENTICATION ────────────────────────────────────── */
function attemptLogin() {
  const pw = document.getElementById('login-pw').value.trim();
  if (!pw) { showLoginError('Enter your access code'); return; }
  if (pw === APP.auth.adminPw) { APP.session = { role:'admin', teamId:null }; enterApp(); return; }
  const teamMatch = APP.teams.find(t => t.password && t.password === pw);
  if (teamMatch) { APP.session = { role:'user', teamId:teamMatch.id }; enterApp(); return; }
  if (pw === APP.auth.userPw) {
    if (!APP.teams.length) { showLoginError('No teams configured yet'); return; }
    APP.session = { role:'user', teamId:null };
    showTeamPicker(); return;
  }
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

function showTeamPicker() {
  document.getElementById('login-pw-section').hidden  = true;
  document.getElementById('login-team-section').hidden = false;
  const grid = document.getElementById('team-select-grid');
  grid.innerHTML = APP.teams.map(t => `
    <button class="team-login-btn" style="--tc:${escHtml(t.color)}" data-team-id="${t.id}">
      <span class="team-login-dot"></span>
      <span>${escHtml(t.name)}</span>
    </button>`).join('');
  grid.querySelectorAll('.team-login-btn').forEach(btn =>
    btn.addEventListener('click', () => { APP.session.teamId = btn.dataset.teamId; enterApp(); }));
}

function showLoginPw() {
  document.getElementById('login-pw-section').hidden   = false;
  document.getElementById('login-team-section').hidden = true;
  document.getElementById('login-sync-section').hidden = true;
  document.getElementById('login-pw').value = '';
  document.getElementById('login-pw').focus();
}

function showLoginSync() {
  document.getElementById('login-pw-section').hidden   = true;
  document.getElementById('login-team-section').hidden = true;
  document.getElementById('login-sync-section').hidden = false;
  document.getElementById('login-session-id').focus();
}

/* Join via session ID (delegates, no file download) */
async function joinSessionAndEnter() {
  const raw = document.getElementById('login-session-id').value.trim();
  if (!raw) { showSyncLoginError('Enter a Session ID'); return; }
  const btn = document.getElementById('login-sync-submit-btn');
  btn.textContent = '⏳ Syncing…';
  btn.disabled = true;
  const ok = await pullLiveSession(raw, /*silent*/true);
  btn.textContent = '⚡ Sync & Enter';
  btn.disabled = false;
  if (ok) {
    notify('✓ State synced — choose your team', 'success');
    APP.session = { role:'user', teamId:null };
    if (APP.teams.length) showTeamPicker();
    else showLoginPw();
  } else {
    showSyncLoginError('Could not connect — check the ID and try again');
  }
}
function showSyncLoginError(msg) {
  const err = document.getElementById('login-sync-error');
  err.textContent = '⚠ ' + msg;
  err.classList.add('show');
  setTimeout(() => err.classList.remove('show'), 4000);
}

function enterApp() {
  document.getElementById('screen-login').hidden = true;
  document.getElementById('screen-app').hidden   = false;
  buildNav();
  showPage('dashboard');
  updateSidebar();
}

function logout() {
  if (APP.race.running && APP.race.interval) { clearTimeout(APP.race.interval); APP.race.running = false; }
  APP.session = { role:null, teamId:null };
  document.getElementById('screen-app').hidden   = true;
  document.getElementById('screen-login').hidden = false;
  document.getElementById('login-pw').value = '';
  document.getElementById('login-error').classList.remove('show');
  showLoginPw();
}


/* ─── 8. NAVIGATION ────────────────────────────────────────── */
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
];
const USER_TABS = [
  { id:'dashboard',    label:'Dashboard'     },
  { id:'strategy',     label:'Strategy 🏁'   },
  { id:'results',      label:'Results'       },
  { id:'championship', label:'Championship'  },
  { id:'analytics',    label:'Analytics'     },
  { id:'trade',        label:'Trade Desk'    },
];

function buildNav() {
  const isAdmin = APP.session.role === 'admin';
  const tabs = isAdmin ? ADMIN_TABS : USER_TABS;
  const nav  = document.getElementById('nav-tabs');
  nav.innerHTML = tabs.map(t =>
    `<button class="nav-tab" data-page="${t.id}">${t.label}</button>`).join('');
  nav.querySelectorAll('.nav-tab').forEach(btn =>
    btn.addEventListener('click', () => showPage(btn.dataset.page)));

  const userInfo = document.getElementById('nav-user-info');
  if (isAdmin) {
    userInfo.innerHTML = `<span class="nav-user-admin">ADMIN</span>`;
  } else {
    const team = APP.teams.find(t => t.id === APP.session.teamId);
    userInfo.innerHTML = team
      ? `<span style="font-weight:600;font-size:12px;color:${escHtml(team.color)}">${escHtml(team.name)}</span>`
      : `<span class="text-muted">Delegate</span>`;
  }
  updateRoundBadge();
}

const PAGE_RENDERERS = {
  dashboard:    renderDashboard,
  assets:       renderAssets,
  teams:        renderTeams,
  season:       renderSeason,
  strategy:     renderStrategy,
  fp:           renderFP,
  qualifying:   renderQual,
  race:         renderRace,
  results:      renderResults,
  championship: renderChampionship,
  analytics:    renderAnalytics,
  trade:        renderTrade,
  admin:        renderAdmin,
};

function showPage(name) {
  const adminOnly = ['assets','teams','season','fp','qualifying','race','admin'];
  if (APP.session.role !== 'admin' && adminOnly.includes(name)) {
    notify('Admin access required', 'error'); return;
  }
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
  if (!APP.season.started) { el.textContent = 'Pre-Season'; return; }
  const total = APP.season.calendar.length;
  const done  = APP.season.calendar.filter(r => r.completed).length;
  el.textContent = done >= total
    ? `Season Complete · ${total}/${total}`
    : `Round ${APP.season.currentRound} / ${total}`;
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
      <span class="lb-pos">${i+1}</span>
      <span class="lb-dot"></span>
      <span class="lb-name">${escHtml(t.name)}</span>
      <span class="lb-pts">${pts}</span>${gap}
    </div>`;
  }).join('') : '<div class="sb-empty">No teams yet</div>';
  document.getElementById('lb-constructors').innerHTML = lbHtml;

  const completed = APP.season.calendar.filter(r => r.completed);
  const histHtml = completed.length ? completed.map((r, i) => {
    const t = TRACKS.find(x => x.id === r.trackId);
    const top3 = (r.raceResults?.classification || []).slice(0,3);
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
  document.getElementById('lb-history').innerHTML = histHtml;
}


/* ─── 9. CSV IMPORT ────────────────────────────────────────── */
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
    Aero:'aero', Strategist:'strategists', PitCrew:'pitstops',
    TechnicalDirector:'technicalDirectors',   /* NEW */
  };
  const newDB = { engines:[], principals:[], drivers:[], aero:[], strategists:[], pitstops:[], technicalDirectors:[] };
  rows.forEach(r => {
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
  if (PAGE_RENDERERS.assets) renderAssets();
  notify(`✓ Imported ${rows.length} assets`, 'success');
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
        ASSET_DB = { engines:[], principals:[], drivers:[], aero:[], strategists:[], pitstops:[], technicalDirectors:[] };
        APP.teams.forEach(t => { t.assets = blankSlots(); });
        APP.prices = {};
        saveState(); closeModal(); renderAssets(); notify('Assets cleared','warn');
      }},
    ],
  });
}


/* ─── 10. DASHBOARD ────────────────────────────────────────── */
function renderDashboard() {
  const isAdmin = APP.session.role === 'admin';
  const completeTeams = APP.teams.filter(teamComplete);
  const nextRace  = APP.season.calendar.find(r => !r.completed);
  const nextTrack = nextRace ? TRACKS.find(t => t.id === nextRace.trackId) : null;
  const sortedC   = Object.entries(APP.champ.constructors).sort((a,b) => b[1].points - a[1].points);
  const sortedD   = Object.entries(APP.champ.drivers).sort((a,b) => b[1].points - a[1].points);
  const constLeader = sortedC[0]?.[1];
  const drvLeader   = sortedD[0]?.[1];
  const totalAssets = allAssets().length;
  const hasTDs      = ASSET_DB.technicalDirectors.length > 0;

  /* Strategy reminder for delegates */
  const myTeam = APP.session.role !== 'admin' ? APP.teams.find(t => t.id === APP.session.teamId) : null;
  const myStratRound = APP.season.calendar.findIndex(r => !r.completed);
  const myStratKey   = myTeam && myStratRound >= 0 ? getTeamStrategy(myTeam.id, myStratRound) : null;
  const stratBanner  = myTeam && myStratRound >= 0 && (myStratKey === 'auto' || myStratKey === 'wet_auto') ? `
    <div class="card" style="border-left:3px solid var(--teal);background:rgba(38,198,218,0.04);">
      <div class="flex gap-12">
        <div class="flex-1">
          <div class="card-title" style="color:var(--teal)">⚡ Set Your Tyre Strategy</div>
          <div class="text-sm text-muted">You haven't set a strategy for Round ${myStratRound + 1} yet. Auto mode is active.</div>
        </div>
        <button class="btn btn-teal btn-sm" data-go="strategy">Set Strategy →</button>
      </div>
    </div>` : '';

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

  const adminGuide = (isAdmin && !APP.season.started) ? `
    <div class="card" style="border-color:var(--accent);background:rgba(232,0,45,0.04);">
      <div class="card-title text-accent">⚡ Admin — Getting Started</div>
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
    ${stratBanner}
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


/* ─── 11. ASSETS PAGE ──────────────────────────────────────── */
function renderAssets() {
  const types  = ['all','engines','principals','drivers','aero','strategists','pitstops','technicalDirectors'];
  const labels = { all:'All', engines:'Engines', principals:'Principals', drivers:'Drivers', aero:'Aero', strategists:'Strategists', pitstops:'Pit Crews', technicalDirectors:'Tech Directors' };
  const counts = Object.fromEntries(Object.entries(ASSET_DB).map(([k,v]) => [k,v.length]));

  document.getElementById('asset-filter-bar').innerHTML = types.map(t => {
    const count = t === 'all' ? allAssets().length : (counts[t]||0);
    return `<button class="filter-pill ${APP.ui.filterType===t?'active':''}" data-filter="${t}">${labels[t]} ${count?`· ${count}`:''}</button>`;
  }).join('');
  document.querySelectorAll('#asset-filter-bar .filter-pill').forEach(b =>
    b.addEventListener('click', () => { APP.ui.filterType = b.dataset.filter; renderAssets(); }));

  const grid    = document.getElementById('asset-grid');
  const isAdmin = APP.session.role === 'admin';
  const list    = APP.ui.filterType === 'all' ? allAssets() : (ASSET_DB[APP.ui.filterType]||[]);

  if (!list.length) {
    grid.innerHTML = `<div class="card" style="grid-column:1/-1;text-align:center;padding:40px;">
      <div class="card-title">No assets loaded</div>
      <div class="text-sm text-muted">Import your CSV to populate the asset registry.</div>
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
        ${isAdmin
          ? `<input type="number" class="price-input" value="${priceOf(a.id)}" data-asset-id="${a.id}" />`
          : `<span class="mono text-gold fw-700">$${priceOf(a.id)}M</span>`}
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


/* ─── 12. TEAMS PAGE ───────────────────────────────────────── */
function createTeam() {
  const name  = document.getElementById('new-team-name').value.trim();
  const color = document.getElementById('new-team-color').value;
  const pw    = document.getElementById('new-team-pw').value.trim();
  if (!name) { notify('Enter a team name','warn'); return; }
  if (APP.season.started) { notify('Season locked — cannot add teams','error'); return; }
  APP.teams.push({ id:uid('team'), name, color, password:pw||null, assets:blankSlots() });
  document.getElementById('new-team-name').value = '';
  document.getElementById('new-team-pw').value   = '';
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
  const grid    = document.getElementById('teams-grid');
  const isAdmin = APP.session.role === 'admin';
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
      if (isTD && !hasTDs) return ''; /* hide TD slot if no TDs loaded */
      const rowCls  = isRes ? 'slot-reserve' : isTD ? 'slot-techdir' : '';
      return `<div class="slot-row ${rowCls}">
        <span class="slot-label">${SLOT_LABELS[slot]}</span>
        ${a
          ? `<span class="slot-fill">${escHtml(a.name)}</span>
             <span class="slot-ovr">OVR ${ovr(a)}</span>
             ${isAdmin ? `<button class="slot-remove" data-team="${t.id}" data-slot="${slot}">×</button>` : ''}`
          : `<span class="slot-empty">— empty —</span>
             ${isAdmin ? `<button class="slot-assign" data-team="${t.id}" data-slot="${slot}">+ assign</button>` : ''}`}
      </div>`;
    }).join('');
    return `<div class="team-card" style="--tc:${escHtml(t.color)}">
      <div class="team-head">
        <span class="team-dot"></span>
        <span class="team-name">${escHtml(t.name)}</span>
        ${tovr!=null?`<span class="team-ovr">OVR ${tovr}</span>`:''}
        <span class="team-spent">$${spent}M</span>
        ${ready?'<span class="tag tag-ready">Ready</span>':'<span class="tag tag-incomplete">Incomplete</span>'}
        ${isAdmin&&!APP.season.started?`<div class="team-actions"><button class="btn btn-ghost btn-xs" data-del-team="${t.id}">Delete</button></div>`:''}
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
/* ─── END OF PART 2 ──────────────────────────────────────── */

/* ═══════════════════════════════════════════════════════════════
   PART 3 — Season · Strategy Page · Free Practice · Scoring Engine
═══════════════════════════════════════════════════════════════ */

/* ─── 13. SEASON PAGE ──────────────────────────────────────── */
function renderSeason() {
  document.getElementById('season-name-input').value = APP.season.name;
  const rounds = APP.season.started ? APP.season.calendar.length : (APP.season.selectedTrackIds.length || 5);
  document.getElementById('season-rounds').value = rounds;
  document.getElementById('lock-season-btn').hidden   = APP.season.started;
  document.getElementById('unlock-season-btn').hidden = !APP.season.started;
  renderTrackGrid();
  updateCalendarPreview();
}
function renderTrackGrid() {
  const grid = document.getElementById('season-track-grid');
  grid.innerHTML = TRACKS.map(t => {
    const active = APP.season.selectedTrackIds.includes(t.id);
    return `<div class="track-card ${active?'active':''}" data-track="${t.id}">
      <div class="track-flag">${t.flag}</div>
      <div class="track-name">${escHtml(t.name)}</div>
      <div class="track-type">${escHtml(t.type)}</div>
    </div>`;
  }).join('');
  grid.querySelectorAll('[data-track]').forEach(c =>
    c.addEventListener('click', () => toggleTrackInCalendar(c.dataset.track)));
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
    const t = TRACKS.find(x => x.id === trackId);
    if (!t) return '';
    const r = APP.season.calendar[i];
    const status = r?.completed ? 'cal-done' : (APP.season.currentRound===i+1?'cal-current':'cal-pending');
    const statusText = r?.completed ? 'Complete' : (APP.season.currentRound===i+1?'Current':'Pending');
    return `<div class="calendar-race">
      <span class="cal-round">R${i+1}</span>
      <span class="cal-flag">${t.flag}</span>
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
  initChampionship();
  saveState(); renderSeason(); updateSidebar(); updateRoundBadge();
  notify('🔒 Season locked. Run Free Practice next.','success');
}
function unlockSeason() {
  if (APP.season.calendar.some(r => r.completed)) {
    notify('Cannot unlock — races already completed. Use Admin → Reset Season.','error'); return;
  }
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
      const d = getAsset(t.assets[slot]);
      if (!d) return;
      APP.champ.drivers[driverKey(t.id,slot)] = {
        name:d.name, teamId:t.id, teamName:t.name, teamColor:t.color,
        slot, driverId:d.id,
        points:0, wins:0, podiums:0, poles:0, fl:0, dnfs:0, history:[],
      };
    });
  });
}


/* ─── 14. STRATEGY PAGE (NEW) ──────────────────────────────── */
function renderStrategy() {
  const root    = document.getElementById('strategy-content');
  const isAdmin = APP.session.role === 'admin';

  if (!APP.season.started) {
    root.innerHTML = `<div class="card"><div class="text-sm text-muted">Lock the season first to set race strategies.</div></div>`;
    return;
  }
  const upcoming = APP.season.calendar.map((r,i) => ({ r,i })).filter(({r}) => !r.completed);
  if (!upcoming.length) {
    root.innerHTML = `<div class="card"><div class="text-sm text-muted">Season complete — all races have been run.</div></div>`;
    return;
  }

  /* Default to first upcoming round */
  const firstUpcoming = upcoming[0].i + 1;
  if (APP.ui.selectedStrategyRound == null ||
      APP.season.calendar[APP.ui.selectedStrategyRound - 1]?.completed) {
    APP.ui.selectedStrategyRound = firstUpcoming;
  }

  const roundIdx = APP.ui.selectedStrategyRound - 1;
  const round    = APP.season.calendar[roundIdx];
  const track    = TRACKS.find(t => t.id === round.trackId);
  const isRaceLocked = !!(round.raceResults);
  const weatherId    = round.qualResults?.weatherId || round.weatherId || 'dry';
  const strategies   = getAvailableStrategies(weatherId);

  /* Round tabs */
  const tabsHtml = APP.season.calendar.map((r,i) => {
    const t = TRACKS.find(x => x.id === r.trackId);
    const active = APP.ui.selectedStrategyRound === i+1;
    return `<button class="strat-round-tab ${active?'active':''} ${r.completed?'done':''}" data-strat-round="${i+1}">
      <span class="round-flag">${t?.flag||''}</span>
      R${i+1} ${escHtml(t?.name||'')} ${r.completed?'✓':''}
    </button>`;
  }).join('');

  const lockedNotice = isRaceLocked
    ? `<div class="strategy-locked-notice"><span class="lock-icon">🔒</span><span>Race has started — strategy locked in.</span></div>` : '';

  /* Teams visible to this user */
  const visibleTeams = isAdmin
    ? APP.teams.filter(teamComplete)
    : APP.teams.filter(t => t.id === APP.session.teamId).filter(teamComplete);

  const degradationNote = track
    ? (track.ch.tyre_deg > 70
        ? '⚠ High degradation track — 2+ stop strategies recommended'
        : track.ch.tyre_deg > 50
          ? 'Moderate degradation — strategy flexibility is high'
          : '✓ Low degradation track — 1-stop strategies are viable')
    : '';

  root.innerHTML = `
    <div class="strategy-round-tabs" id="strat-round-tabs">${tabsHtml}</div>
    ${lockedNotice}
    <div class="card mb-16" style="padding:12px 18px;">
      <div class="flex gap-12 flex-wrap">
        <div>
          <div class="card-title">Round ${roundIdx+1} · ${track?.flag||''} ${escHtml(track?.name||'')} GP · ${WEATHER_OPTIONS.find(w=>w.id===weatherId)?.emoji||'☀️'}</div>
          <div class="text-xs text-muted">${degradationNote}</div>
        </div>
        ${isAdmin?`<button class="btn btn-ghost btn-sm ml-auto" id="strat-set-all-auto-btn">Reset All to Auto</button>`:''}
      </div>
    </div>
    <div class="strategy-teams-grid" id="strategy-teams-grid">
      ${visibleTeams.map(team => buildStrategyTeamCard(team, roundIdx, strategies, isAdmin, isRaceLocked)).join('')
        || '<div class="card text-dim text-sm">No complete teams to display.</div>'}
    </div>`;

  document.querySelectorAll('[data-strat-round]').forEach(btn =>
    btn.addEventListener('click', () => { APP.ui.selectedStrategyRound = parseInt(btn.dataset.stratRound,10); renderStrategy(); }));

  document.querySelectorAll('[data-strat-key]').forEach(btn =>
    btn.addEventListener('click', () => {
      const { stratTid: tid, stratRi: ri, stratKey: key } = btn.dataset;
      setTeamStrategy(tid, parseInt(ri,10), key);
      renderStrategy();
    }));

  document.getElementById('strat-set-all-auto-btn')?.addEventListener('click', () => {
    APP.teams.filter(teamComplete).forEach(t => setTeamStrategy(t.id, roundIdx, 'auto'));
    renderStrategy();
  });
}

function buildStrategyTeamCard(team, roundIdx, strategies, isAdmin, isLocked) {
  const currentKey  = getTeamStrategy(team.id, roundIdx);
  const currentInfo = getStrategyInfo(currentKey) || strategies[0];
  const strategist  = getAsset(team.assets.strategist);
  const tyreChoice  = strategist?.ratings?.Tyre_Choice || 80;
  const track       = TRACKS.find(t => t.id === APP.season.calendar[roundIdx].trackId);
  const isHighDeg   = (track?.ch.tyre_deg || 50) > 70;
  const isSet       = currentKey !== 'auto' && currentKey !== 'wet_auto';
  const badgeCls    = isLocked ? 'strat-locked' : isSet ? 'strat-set' : 'strat-auto';
  const badgeTxt    = isLocked ? '🔒 Locked' : isSet ? '✓ Set' : '⚙ Auto';

  /* Strategist bonus */
  let bonusHtml = '';
  if (isSet && strategist && Math.abs(tyreChoice - 80) > 2) {
    const goodMatch = (isHighDeg && (currentInfo?.stops||1) >= 2) || (!isHighDeg && (currentInfo?.stops||1) <= 1);
    const bonusPct  = goodMatch ? ((tyreChoice - 80) * 0.05).toFixed(1) : '0';
    const bonusSign = parseFloat(bonusPct) > 0 ? '+' : '';
    bonusHtml = `<div class="strategy-bonus-row">
      <span class="strategy-bonus-icon">⚡</span>
      <span class="strategy-bonus-text">${escHtml(strategist.name)} · Tyre Choice ${tyreChoice}</span>
      <span class="strategy-bonus-val">${goodMatch?bonusSign+bonusPct+'% pace':'—'}</span>
    </div>`;
  }

  /* Stint timeline */
  let timelineHtml = '';
  if (currentInfo?.compounds) {
    const totalLaps = track?.laps || 50;
    const perStint  = Math.floor(totalLaps / currentInfo.compounds.length);
    timelineHtml = `<div class="strategy-timeline">
      ${currentInfo.compounds.map((c,ci) => {
        const isLast = ci === currentInfo.compounds.length - 1;
        const laps = isLast ? totalLaps - perStint * ci : perStint;
        return `<div class="strategy-stint stint-${c}" style="flex:${laps}" title="${c} · ~${laps} laps">${c}</div>`;
      }).join('')}
    </div>`;
  }

  /* Preset cards */
  const presetsHtml = strategies.map(s => {
    const isSel = currentKey === s.id;
    const seqHtml = (s.compounds||[]).map((c,ci) =>
      `${ci>0?'<span class="compound-arrow">→</span>':''}<span class="compound-chip chip-${c}">${c}</span>`
    ).join('');
    return `<div class="strategy-preset-card ${isSel?'selected':''} ${isLocked?'locked':''}"
      data-strat-key="${s.id}" data-strat-tid="${team.id}" data-strat-ri="${roundIdx}"
      ${isSel?`style="--tc:${escHtml(team.color)}"`:''}>
      <div class="preset-icon">${s.icon}</div>
      <div class="preset-name">${escHtml(s.name)}</div>
      <div class="compound-sequence">${seqHtml||'<span class="text-dim text-xs">Auto</span>'}</div>
      <div class="preset-desc">${escHtml(s.desc)}</div>
      ${s.stops!=null?`<span class="preset-stops">${s.stops}-stop</span>`:''}
    </div>`;
  }).join('');

  return `<div class="strategy-team-card" style="--tc:${escHtml(team.color)}">
    <div class="strategy-team-head">
      <div class="strategy-team-dot"></div>
      <div class="strategy-team-name">${escHtml(team.name)}</div>
      <span class="strategy-status-badge ${badgeCls}">${badgeTxt}</span>
    </div>
    ${timelineHtml}
    <div class="strategy-preset-grid">${presetsHtml}</div>
    ${bonusHtml}
  </div>`;
}


/* ─── 15. FREE PRACTICE ────────────────────────────────────── */
function renderFP() {
  const root = document.getElementById('fp-content');
  if (!APP.season.started) {
    root.innerHTML = `<div class="card"><div class="text-sm text-muted">Lock the season first to enable Free Practice.</div></div>`; return;
  }
  if (!APP.fpData) {
    root.innerHTML = `
      <div class="card">
        <div class="card-title">Pre-Season Free Practice</div>
        <div class="text-sm text-muted mb-12">
          One session · 3 stints (S/M/H) per driver · balanced reference circuit.
          Generates a tyre performance report to inform strategy selection.
        </div>
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
      const driverAsset = getAsset(team.assets[slot]);
      if (!driverAsset) return;
      const drvScore  = computeDriverScore(driverAsset, refTrack, weather);
      const carScore  = computeCarScore(team, refTrack, weather);
      const totalScore = drvScore * 0.42 + carScore * 0.58;
      const baseLap    = refTrack.baseLap + (95 - totalScore) * 0.18;
      const consistency = driverAsset.ratings.Consistency || 80;
      const sigma      = (100 - consistency) / 70;
      const stints = [];
      [['S',5],['M',8],['H',10]].forEach(([compound, laps]) => {
        const tire  = TIRE_COMPOUNDS[compound];
        const stint = { compound, name:tire.name, laps, lapTimes:[] };
        for (let i = 0; i < laps; i++) {
          const tireOffset = tire.pace + Math.max(0, i-2) * tire.deg;
          stint.lapTimes.push(baseLap + tireOffset + gaussRand(0, sigma));
        }
        stint.avg  = stint.lapTimes.reduce((a,b) => a+b, 0) / stint.lapTimes.length;
        stint.best = Math.min(...stint.lapTimes);
        const mean = stint.avg;
        stint.std  = Math.sqrt(stint.lapTimes.reduce((s,t) => s+(t-mean)**2, 0) / stint.lapTimes.length);
        stint.deg  = stint.lapTimes.length >= 2
          ? (stint.lapTimes[stint.lapTimes.length-1] - stint.lapTimes[0]) / (stint.lapTimes.length-1)
          : 0;
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
  const sorted   = [...data.byDriver].sort((a,b) => {
    const ba = Math.min(...a.stints.flatMap(s => s.lapTimes));
    const bb = Math.min(...b.stints.flatMap(s => s.lapTimes));
    return ba - bb;
  });
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
      <div class="stat-row"><span class="stat-label">Stint Length</span><span class="stat-val mono">~${stints[0].laps} laps</span></div>
    </div>`;
  }).join('');
  const detailed = sorted.map(d => {
    const stintCells = d.stints.map(s => {
      const tire = TIRE_COMPOUNDS[s.compound];
      return `<td>
        <span class="tire-badge ${tire.css}">${s.compound}</span>
        <div class="text-xs mono">${fmtTime(s.best)}</div>
        <div class="text-xs text-dim mono">σ ${(s.std*1000).toFixed(0)}ms</div>
        <div class="text-xs text-dim mono">deg ${(s.deg*1000).toFixed(0)}ms</div>
      </td>`;
    }).join('');
    return `<tr>
      <td><span class="champ-dot" style="background:${escHtml(d.teamColor)}"></span>${escHtml(d.driverName)}</td>
      <td class="text-xs text-muted">${escHtml(d.teamName)}</td>
      ${stintCells}
      <td class="mono fw-700">${d.totalScore.toFixed(1)}</td>
    </tr>`;
  }).join('');
  const insights = generateFPInsights(data);
  document.getElementById('fp-content').innerHTML = `
    <div class="flex gap-12 mb-16 flex-wrap">
      <button class="btn btn-blue" id="fp-print-btn">📄 Export PDF</button>
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
    </div>
    <div class="card">
      <div class="card-title">Detailed Stint Breakdown</div>
      <table class="champ-table">
        <thead><tr><th>Driver</th><th>Team</th><th>Soft</th><th>Medium</th><th>Hard</th><th>Score</th></tr></thead>
        <tbody>${detailed}</tbody>
      </table>
    </div>
    <div class="card">
      <div class="card-title">Key Insights</div>${insights}
    </div>`;
  document.getElementById('fp-print-btn').addEventListener('click', printFPReport);
  document.getElementById('fp-rerun-btn').addEventListener('click', () => {
    if (confirm('Re-run Free Practice? Current report will be overwritten.')) runFP();
  });
}
function generateFPInsights(data) {
  const teams = {};
  data.byDriver.forEach(d => {
    if (!teams[d.teamId]) teams[d.teamId] = { name:d.teamName, color:d.teamColor, drivers:[] };
    teams[d.teamId].drivers.push(d);
  });
  const lines = [];
  const teamPace = Object.entries(teams).map(([id,t]) => ({
    name:t.name, color:t.color,
    best: Math.min(...t.drivers.flatMap(d => d.stints.flatMap(s => s.lapTimes))),
  })).sort((a,b) => a.best - b.best);
  if (teamPace.length >= 2) {
    const fastest = teamPace[0], slowest = teamPace[teamPace.length-1];
    lines.push(`<div class="stat-row"><span class="stat-label">Fastest team</span><span class="stat-val"><span class="champ-dot" style="background:${escHtml(fastest.color)}"></span>${escHtml(fastest.name)} · ${fmtTime(fastest.best)}</span></div>`);
    lines.push(`<div class="stat-row"><span class="stat-label">Field spread</span><span class="stat-val mono">${(slowest.best - fastest.best).toFixed(3)}s</span></div>`);
  }
  const consist = data.byDriver.map(d => ({
    name:d.driverName, color:d.teamColor,
    avgStd: d.stints.reduce((a,s) => a+s.std, 0) / d.stints.length,
  })).sort((a,b) => a.avgStd - b.avgStd);
  if (consist.length)
    lines.push(`<div class="stat-row"><span class="stat-label">Most consistent</span><span class="stat-val"><span class="champ-dot" style="background:${escHtml(consist[0].color)}"></span>${escHtml(consist[0].name)} · σ ${(consist[0].avgStd*1000).toFixed(0)}ms</span></div>`);
  const degList = data.byDriver.map(d => ({
    name:d.driverName, color:d.teamColor,
    deg: d.stints.reduce((a,s) => a + Math.max(0,s.deg), 0) / d.stints.length,
  })).sort((a,b) => a.deg - b.deg);
  if (degList.length)
    lines.push(`<div class="stat-row"><span class="stat-label">Best tyre mgmt</span><span class="stat-val"><span class="champ-dot" style="background:${escHtml(degList[0].color)}"></span>${escHtml(degList[0].name)} · ${(degList[0].deg*1000).toFixed(0)}ms/lap</span></div>`);
  const stintsBest = ['S','M','H'].map(c => {
    const all = data.byDriver.flatMap(d => d.stints.filter(s => s.compound===c));
    return { c, avgDeg: all.reduce((a,s) => a+s.deg, 0)/all.length };
  });
  const highestDeg = stintsBest.sort((a,b) => b.avgDeg - a.avgDeg)[0];
  lines.push(`<div class="stat-row"><span class="stat-label">Strategic note</span><span class="stat-val">${highestDeg.c==='S'?'Soft shows highest degradation — favour 2-stop strategies':highestDeg.c==='H'?'Hard compound durable — long stints viable':'Medium tyres most balanced for race strategy'}</span></div>`);
  return lines.join('');
}
function printFPReport() {
  const data = APP.fpData; if (!data) return;
  const refTrack = TRACKS.find(t => t.id === data.refTrackId);
  const sorted   = [...data.byDriver].sort((a,b) => Math.min(...a.stints.flatMap(s=>s.lapTimes)) - Math.min(...b.stints.flatMap(s=>s.lapTimes)));
  const fastest  = Math.min(...sorted.flatMap(d => d.stints.flatMap(s => s.lapTimes)));
  document.getElementById('print-view').innerHTML = `
    <div class="print-page">
      <div class="print-header">
        <div><div class="print-title">Free Practice Report</div><div class="print-subtitle">${escHtml(APP.season.name)} — Reference: ${refTrack?.name||''}</div></div>
        <div class="print-logo">F1 MUN</div>
      </div>
      <div class="print-section">
        <div class="print-section-title">Overall Pace Ranking</div>
        <table class="print-table">
          <thead><tr><th>Pos</th><th>Driver</th><th>Team</th><th>Best Lap</th><th>Gap</th><th>Score</th></tr></thead>
          <tbody>${sorted.map((d,i) => { const best=Math.min(...d.stints.flatMap(s=>s.lapTimes)); return `<tr><td>${i+1}</td><td>${escHtml(d.driverName)}</td><td>${escHtml(d.teamName)}</td><td>${fmtTime(best)}</td><td>${i===0?'—':'+'+(best-fastest).toFixed(3)}</td><td>${d.totalScore.toFixed(1)}</td></tr>`; }).join('')}</tbody>
        </table>
      </div>
    </div>`;
  setTimeout(() => window.print(), 100);
}


/* ─── 16. SCORING ENGINE ───────────────────────────────────── */
function computeCarScore(team, track, weather) {
  const eng  = getAsset(team.assets.engine);
  const aero = getAsset(team.assets.aero);
  const strat = getAsset(team.assets.strategist);
  const pit  = getAsset(team.assets.pitcrew);
  const prin = getAsset(team.assets.principal);
  const td   = getAsset(team.assets.techDir);
  if (!eng || !aero || !strat || !pit || !prin) return 60;

  const ch = track.ch, w = weather.mods;
  const isHighSpeed = ch.power_dep > 65;

  const engScore = clamp(
      (eng.ratings.Power      || 80) * (0.35 * ch.power_dep / 100 + 0.15) * w.power
    + (eng.ratings.Reliability|| 80) * 0.20 * w.reliability
    + (eng.ratings.Deployment || 80) * 0.15
    + (eng.ratings.Fuel_Eff   || 80) * 0.10
    + (eng.ratings.Thermal    || 80) * 0.05,
    0, 100);

  const aeroScore = clamp(
      (aero.ratings.Downforce   || 80) * (0.30 * ch.downforce_dep / 100 + 0.10)
    + (aero.ratings.Drag        || 80) * (isHighSpeed ? 0.20 : 0.10)
    + (aero.ratings.Street_Circuit||80) * (track.type==='Street' ? 0.20 : 0.05)
    + (aero.ratings.High_Speed  || 80) * (isHighSpeed ? 0.18 : 0.08)
    + (aero.ratings.Balance     || 80) * 0.12,
    0, 100);

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

  /* Technical Director contribution (when TDs are loaded and assigned) */
  const hasTDs = ASSET_DB.technicalDirectors?.length > 0;
  if (hasTDs && td) {
    const tdScore = clamp(
        (td.ratings.Technical_Knowledge || 80) * 0.28
      + (td.ratings.Dev_Speed           || 80) * 0.18
      + (td.ratings.Reliability_Focus   || 80) * 0.20
      + (td.ratings.Innovation          || 80) * 0.16
      + (td.ratings.Setup_Mastery       || 80) * 0.12
      + (td.ratings.Race_Engineering    || 80) * 0.06,
      20, 100);
    /* With TD: re-weighted 28+26+12+14+13+7 = 100 */
    return clamp(
        engScore  * 0.28
      + aeroScore * 0.26
      + tdScore   * 0.12
      + stratScore* 0.14
      + pitScore  * 0.13
      + prinScore * 0.07,
      20, 100);
  }
  /* Without TD: original weights 32+30+14+14+10 = 100 */
  return clamp(
      engScore  * 0.32
    + aeroScore * 0.30
    + stratScore* 0.14
    + pitScore  * 0.14
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

function activeDriversForTeam(team) {
  return ['driver1','driver2']
    .map(slot => ({ slot, asset:getAsset(team.assets[slot]) }))
    .filter(x => x.asset);
}
/* ─── END OF PART 3 ──────────────────────────────────────── */

/* ═══════════════════════════════════════════════════════════════
   PART 4 — Qualifying · Race Simulation (strategies + TD effects)
═══════════════════════════════════════════════════════════════ */

/* ─── 17. QUALIFYING ───────────────────────────────────────── */
function renderQual() {
  const root = document.getElementById('qualifying-content');
  if (!APP.season.started) { root.innerHTML = `<div class="card"><div class="text-sm text-muted">Lock the season first.</div></div>`; return; }
  if (!APP.season.fpDone)  {
    root.innerHTML = `<div class="card">
      <div class="card-title">Free Practice required</div>
      <div class="text-sm text-muted">Run the pre-season Free Practice session before qualifying.</div>
      <button class="btn btn-red mt-12" onclick="document.querySelector('.nav-tab[data-page=fp]').click()">Go to Practice →</button>
    </div>`; return;
  }
  const round = APP.season.calendar[APP.season.currentRound - 1];
  if (!round) { root.innerHTML = `<div class="card"><div class="text-sm">Season complete.</div></div>`; return; }
  const track = TRACKS.find(t => t.id === round.trackId);
  if (round.qualResults) { renderQualResults(round, track); return; }

  const weatherSelectors = WEATHER_OPTIONS.map(w =>
    `<button class="w-pill ${APP.ui.qualWeather===w.id?'active':''}" data-weather="${w.id}">${w.emoji} ${w.label}</button>`
  ).join('');

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
      <div class="card-title">Weather</div>
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
  round.weatherId = weather.id;
  const entries = [];
  APP.teams.filter(teamComplete).forEach(team => {
    activeDriversForTeam(team).forEach(({ slot, asset }) => {
      const carScore = computeCarScore(team, track, weather);
      const drvScore = computeDriverScore(asset, track, weather);
      const qualBoost = ((asset.ratings.Qualifying || 80) - 80) * 0.04;
      const totalScore = carScore * 0.50 + drvScore * 0.50;
      const sigma = (100 - (asset.ratings.Consistency||80)) / 70;
      let lapTime = track.baseLap + (95 - totalScore) * 0.18 - qualBoost + gaussRand(0, sigma);
      let note = null;
      if (Math.random() < 0.03) { lapTime += rand(0.8,2.0); note='Lock-up'; }
      if (weather.id==='wet'||weather.id==='mixed') lapTime += (90-(asset.ratings.Wet_Weather||80)) * 0.04;
      entries.push({ teamId:team.id, teamName:team.name, teamColor:team.color, slot, driverId:asset.id, driverName:asset.name, lapTime, note, carScore, drvScore });
    });
  });
  entries.sort((a,b) => a.lapTime - b.lapTime);
  const pole = entries[0]?.lapTime || 0;
  entries.forEach((e,i) => { e.position = i+1; e.gap = i===0 ? 0 : e.lapTime - pole; });
  round.qualResults = { weatherId:weather.id, entries, generatedAt:new Date().toISOString() };
  const poleEntry = entries[0];
  if (poleEntry) { const dk = driverKey(poleEntry.teamId, poleEntry.slot); if (APP.champ.drivers[dk]) APP.champ.drivers[dk].poles++; }
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
        <div class="q-driver-name">${escHtml(e.driverName)} ${i===0?'<span class="q-pole-badge">POLE</span>':''}</div>
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


/* ─── 18. RACE SIMULATION ──────────────────────────────────── */
function renderRace() {
  const root = document.getElementById('race-content');
  if (!APP.season.started) { root.innerHTML=`<div class="card"><div class="text-sm text-muted">Lock the season first.</div></div>`; return; }
  const round = APP.season.calendar[APP.season.currentRound - 1];
  if (!round) { root.innerHTML=`<div class="card"><div class="text-sm">Season complete. View results in the Championship tab.</div></div>`; return; }
  if (!round.qualResults) {
    root.innerHTML=`<div class="card">
      <div class="card-title">Qualifying required</div>
      <div class="text-sm text-muted">Run qualifying for this round before starting the race.</div>
      <button class="btn btn-red mt-12" onclick="document.querySelector('.nav-tab[data-page=qualifying]').click()">Go to Qualifying →</button>
    </div>`; return;
  }
  if (round.raceResults) { renderRaceComplete(round); return; }
  const track   = TRACKS.find(t => t.id === round.trackId);
  const weather = WEATHER_OPTIONS.find(w => w.id === round.weatherId) || WEATHER_OPTIONS[0];

  /* Show strategy summary before lights out */
  const stratRows = APP.teams.filter(teamComplete).map(team => {
    const key  = getTeamStrategy(team.id, APP.season.currentRound - 1);
    const info = getStrategyInfo(key);
    const seqHtml = (info?.compounds||[]).map((c,ci) =>
      `${ci>0?'<span class="compound-arrow" style="font-size:8px;color:var(--text-3)">→</span>':''}<span class="compound-chip chip-${c}" style="width:18px;height:18px;font-size:8px;">${c}</span>`
    ).join('');
    return `<div class="flex gap-8" style="font-size:12px;padding:4px 0;border-bottom:1px solid var(--border)">
      <span class="champ-dot" style="background:${escHtml(team.color)};width:8px;height:8px;border-radius:50%;flex-shrink:0;margin-top:4px"></span>
      <span style="flex:1;font-weight:600">${escHtml(team.name)}</span>
      <span style="font-size:10px;color:var(--text-2)">${info?.name||'Auto'}</span>
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
      ${stratRows ? `<div class="card-title" style="margin-top:12px">Team Strategies</div>${stratRows}` : ''}
    </div>
    <div id="race-stage"></div>`;
  document.getElementById('race-init-btn').addEventListener('click', initiateRace);
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
    i++;
    setTimeout(turnOn, 1000);
  };
  setTimeout(turnOn, 600);
}

function startRace() {
  const round   = APP.season.calendar[APP.season.currentRound - 1];
  const track   = TRACKS.find(t => t.id === round.trackId);
  const weather = WEATHER_OPTIONS.find(w => w.id === round.weatherId);
  const roundIdx = APP.season.currentRound - 1;

  const cars = round.qualResults.entries.map((e, i) => {
    const team    = APP.teams.find(t => t.id === e.teamId);
    const driver  = getAsset(e.driverId);
    const carScore = computeCarScore(team, track, weather);
    const drvScore = computeDriverScore(driver, track, weather);
    const totalScore = carScore * 0.55 + drvScore * 0.45;

    /* Resolve team strategy */
    const stratKey     = getTeamStrategy(team.id, roundIdx);
    const availStrats  = getAvailableStrategies(weather.id);
    const chosenStrat  = availStrats.find(s => s.id === stratKey);
    const isAutoStrat  = !chosenStrat || chosenStrat.compounds === null;

    const strategyCompounds = isAutoStrat ? null : chosenStrat.compounds;
    const targetStops = isAutoStrat
      ? chooseTargetStops(track, drvScore)
      : chosenStrat.stops;

    let startCompound;
    if (weather.id === 'wet') startCompound = 'W';
    else if (weather.id === 'mixed') startCompound = 'I';
    else if (strategyCompounds) startCompound = strategyCompounds[0];
    else startCompound = 'M';

    /* Retrieve Technical Director for this team */
    const tdAsset     = getAsset(team.assets.techDir);
    const tdReliBonus = tdAsset ? Math.max(0, (tdAsset.ratings.Reliability_Focus||80) - 80) * 0.003 : 0;

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
      tdReliBonus,     /* Technical Director reliability effect */
      pitTime: clamp(28 - ((getAsset(team.assets.pitcrew)?.ratings.Stop_Time||85) - 80) * 0.18, 21, 30),
      strategyCompounds,   /* null = auto, array = follow sequence */
      stintIdx: 0,         /* current index in strategyCompounds */
      teamRef: team,       /* keep ref for TD setup bonus in lap time */
    };
  });

  APP.race.state = {
    track, weather, lap:0, totalLaps:track.laps,
    cars, events:[],
    scActive:false, scLapsRemaining:0, scTriggered:0,
  };
  APP.race.running = true;
  APP.race.paused  = false;
  APP.race.speedKey = '1x';

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
  const sorted = [...s.cars].sort((a,b) => {
    if (a.dnf && !b.dnf) return 1; if (b.dnf && !a.dnf) return -1;
    if (a.dnf && b.dnf) return (b.dnfLap||0) - (a.dnfLap||0);
    return a.totalTime - b.totalTime;
  });
  const leader = sorted.find(c => !c.dnf);
  sorted.forEach((c,i) => { if (!c.dnf) { const np=i+1; if(np!==c.position&&c.position) c._posChanged=true; c.position=np; } });

  const html = sorted.map(c => {
    const tire = TIRE_COMPOUNDS[c.compound];
    let posDisplay, gapDisplay;
    if (c.dnf) {
      posDisplay = `<span class="t-pos dnf">DNF</span>`;
      gapDisplay = `<span class="t-gap text-accent">L${c.dnfLap}</span>`;
    } else {
      const pcls = c.position===1?'p1':c.position===2?'p2':c.position===3?'p3':'';
      posDisplay = `<span class="t-pos ${pcls}">${c.position}</span>`;
      gapDisplay = `<span class="t-gap">${c===leader?'LEADER':'+' + (c.totalTime-leader.totalTime).toFixed(3)}</span>`;
    }
    const flash = c._posChanged ? 'pos-change' : '';
    if (c._posChanged) c._posChanged = false;
    /* Show strategy compound sequence in timing if set */
    const stratLabel = c.strategyCompounds
      ? `<span class="t-strategy">${c.strategyCompounds.join('→')}</span>`
      : '';
    return `<div class="timing-row ${flash}" style="--rc:${escHtml(c.teamColor)}">
      ${posDisplay}
      <span class="t-dot"></span>
      <div class="t-driver">
        <div class="t-driver-name">${escHtml(c.driverName)}</div>
        <div class="t-driver-team">${escHtml(c.teamName)}</div>
      </div>
      <span class="tire-badge ${tire.css}">${c.compound}${c.dnf?'':` ${c.tireAge}`}</span>
      ${stratLabel}
      <span class="t-stops">${c.stopsDone}/${c.targetStops}</span>
      ${gapDisplay}
    </div>`;
  }).join('');

  document.getElementById('timing-table').innerHTML = html;
  document.getElementById('race-lap-disp').textContent = `Lap ${s.lap}/${s.totalLaps}`;
  document.getElementById('race-progress').style.width = `${(s.lap/s.totalLaps)*100}%`;
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

  /* Safety car decay */
  if (s.scActive) {
    s.scLapsRemaining--;
    if (s.scLapsRemaining <= 0) { s.scActive=false; pushEvent('Safety car in this lap — racing resumes','ev-sc'); }
  }
  /* Fresh SC trigger */
  if (!s.scActive && s.scTriggered < 2) {
    const baseChance = (s.track.ch.sc_base/100) * s.weather.mods.sc / s.totalLaps * 1.4;
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

    /* DNF check — Technical Director reduces failure chance */
    const dnfChance = Math.max(0,
      (100 - c.reliabilityRating) / 9000 * (1 / s.weather.mods.reliability) - c.tdReliBonus);
    if (Math.random() < dnfChance) {
      c.dnf=true; c.dnfLap=s.lap;
      c.dnfReason=['Engine failure','Hydraulics','Gearbox','Power unit','Mechanical'][Math.floor(Math.random()*5)];
      pushEvent(`💥 ${escHtml(c.driverName)} OUT — ${c.dnfReason}`,'ev-dnf');
      const dk = driverKey(c.teamId, c.slot);
      if (APP.champ.drivers[dk]) APP.champ.drivers[dk].dnfs++;
      return;
    }

    /* Pit stop logic */
    const lapsLeft  = s.totalLaps - s.lap;
    const stopsLeft = c.targetStops - c.stopsDone;
    const tire      = TIRE_COMPOUNDS[c.compound];
    const pastCliff = c.tireAge > tire.cliff;
    const window    = stopsLeft > 0 ? Math.floor(s.totalLaps / (c.targetStops + 1)) : 999;
    let pitting = false;
    if (stopsLeft > 0 && c.tireAge >= window) {
      if (s.scActive && Math.random() < 0.6)       pitting = true;
      else if (pastCliff && Math.random() < 0.5)   pitting = true;
      else if (c.tireAge >= window + 5)             pitting = true;
    }
    if (lapsLeft <= 2 && stopsLeft > 0 && pastCliff) pitting = true;
    if (lapsLeft <= 1) pitting = false;

    let lapTime;
    if (pitting) {
      /* Choose new compound — follow strategy sequence if set */
      let newCompound;
      if (s.weather.id==='wet') newCompound='W';
      else if (s.weather.id==='mixed') newCompound = Math.random()<0.5?'I':'M';
      else if (c.strategyCompounds && c.stintIdx+1 < c.strategyCompounds.length) {
        c.stintIdx++;
        newCompound = c.strategyCompounds[c.stintIdx];
      } else {
        /* Auto fallback */
        if (stopsLeft-1===0) {
          if (lapsLeft<18) newCompound='S'; else if(lapsLeft<32) newCompound='M'; else newCompound='H';
        } else {
          newCompound = c.compound==='M'?'H':(c.compound==='H'?'M':'M');
        }
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

    /* Random incident */
    const incidentChance = (100 - (getAsset(c.driverId)?.ratings.Racecraft||80)) / 13000;
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
  const tireOffset = tire.pace
    + Math.max(0, c.tireAge-2) * tire.deg
    + Math.max(0, c.tireAge - tire.cliff) * tire.deg * 3.5;

  const driver = getAsset(c.driverId);
  const consistency = driver?.ratings.Consistency || 80;

  /* Technical Director reduces lap time variance via Setup_Mastery */
  const tdAsset    = getAsset(c.teamRef?.assets?.techDir);
  const setupBonus = tdAsset ? Math.max(0, (tdAsset.ratings.Setup_Mastery||80) - 80) * 0.00008 : 0;
  const sigma      = Math.max(0.025, (100-consistency)/350 - setupBonus);

  return base + offset + tireOffset + gaussRand(0, sigma);
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

    const dk = driverKey(c.teamId, c.slot);
    if (APP.champ.drivers[dk]) {
      const cd = APP.champ.drivers[dk];
      cd.points += totalPoints;
      if (i===0 && !c.dnf) cd.wins++;
      if (i<3  && !c.dnf) cd.podiums++;
      if (isFL) cd.fl++;
      cd.history.push({ round:APP.season.currentRound, trackId:s.track.id, gridPos:c.startPos, finishPos:c.dnf?null:i+1, points:totalPoints, dnf:c.dnf, dnfReason:c.dnfReason, fl:isFL });
    }
    if (APP.champ.constructors[c.teamId]) {
      APP.champ.constructors[c.teamId].points += totalPoints;
      if (i===0 && !c.dnf) APP.champ.constructors[c.teamId].wins++;
      if (i<3  && !c.dnf) APP.champ.constructors[c.teamId].podiums++;
    }
    return { position:c.dnf?null:i+1, teamId:c.teamId, teamName:c.teamName, teamColor:c.teamColor, slot:c.slot, driverId:c.driverId, driverName:c.driverName, startPos:c.startPos, totalTime:c.totalTime, fastestLap:c.fastestLap, compound:c.compound, pitStops:c.pitStops, points:totalPoints, basePoints:points, flPoints, isFL, isBestPit:!!(bestPit&&c===bestPit.car), dnf:c.dnf, dnfLap:c.dnfLap, dnfReason:c.dnfReason };
  });

  classification.forEach(r => {
    if (APP.champ.constructors[r.teamId]) APP.champ.constructors[r.teamId].history.push({ round:APP.season.currentRound, trackId:s.track.id, position:r.position, points:r.points, dnf:r.dnf });
  });

  round.raceResults = { classification, events:s.events, flCar:flCar?{driverId:flCar.driverId,time:flCar.fastestLap}:null, bestPit:bestPit?{driverId:bestPit.car.driverId,time:bestPit.time,lap:bestPit.lap}:null, scTriggers:s.scTriggered, generatedAt:new Date().toISOString() };
  round.completed = true;

  if (APP.season.currentRound < APP.season.calendar.length) APP.season.currentRound++;

  saveState(); updateSidebar(); updateRoundBadge();

  /* Auto-push to live session if enabled */
  if (APP.sync.autoSync && APP.sync.sessionId) pushLiveSession();

  /* Show winner popup (champion popup for final race) */
  showRaceWinnerPopup(round);

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
            <div class="fw-700">${escHtml(r.driverName)}</div>
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
/* ─── END OF PART 4 ──────────────────────────────────────── */

/* ═══════════════════════════════════════════════════════════════
   PART 5-A — Results · Championship · Analytics · Trade Desk
═══════════════════════════════════════════════════════════════ */

/* ─── 19. RESULTS ──────────────────────────────────────────── */
function renderResults() {
  const completed = APP.season.calendar.filter(r => r.completed);
  if (!completed.length) {
    document.getElementById('results-content').innerHTML =
      `<div class="card"><div class="text-sm text-muted">No completed races yet.</div></div>`;
    return;
  }
  const selected = APP.ui.selectedResult || completed.length;
  const round    = APP.season.calendar[selected - 1];
  const track    = TRACKS.find(t => t.id === round.trackId);
  const weather  = WEATHER_OPTIONS.find(w => w.id === round.weatherId);
  const r        = round.raceResults;

  const rows = r.classification.map((c, i) => {
    const badges = [];
    if (c.isFL)      badges.push('<span class="r-badge r-fl">FL</span>');
    if (c.isBestPit) badges.push('<span class="r-badge r-best-pit">BEST PIT</span>');
    if (c.dnf)       badges.push('<span class="r-badge r-dnf">DNF</span>');
    return `<div class="result-row" style="border-left:3px solid ${escHtml(c.teamColor)};padding-left:13px">
      <span class="res-pos">${c.dnf ? 'DNF' : c.position}</span>
      <div>
        <div class="fw-700 text-sm">${escHtml(c.driverName)}</div>
        <div class="text-xs text-muted">${escHtml(c.teamName)} · started P${c.startPos}${c.dnf ? ` · ${escHtml(c.dnfReason || '')}` : ''}</div>
      </div>
      <div class="result-badges">${badges.join('')}</div>
      ${!c.dnf ? `<span class="text-xs mono text-muted">${fmtTime(c.fastestLap)}</span>` : ''}
      <span class="res-pts">${c.points}</span>
    </div>`;
  }).join('');

  const pitRows = r.classification
    .filter(c => c.pitStops?.length)
    .flatMap(c => c.pitStops.map(p => `<tr>
      <td>${escHtml(c.driverName)}</td>
      <td>L${p.lap}</td>
      <td>${TIRE_COMPOUNDS[p.fromCompound]?.name || p.fromCompound}</td>
      <td>→</td>
      <td>${TIRE_COMPOUNDS[p.toCompound]?.name || p.toCompound}</td>
      <td class="mono">${p.time.toFixed(2)}s</td>
    </tr>`)).join('');

  const eventsList = r.events.slice().reverse().map(e =>
    `<div class="event-line"><span class="lap-tag">L${e.lap}</span><span class="${e.cls}">${e.text}</span></div>`
  ).join('');

  const selector = `<select id="results-round-select">${
    completed.map(rr => {
      const tr  = TRACKS.find(t => t.id === rr.trackId);
      const idx = APP.season.calendar.indexOf(rr) + 1;
      return `<option value="${idx}" ${idx === selected ? 'selected' : ''}>R${idx} — ${tr?.flag} ${escHtml(tr?.name)}</option>`;
    }).join('')
  }</select>`;

  document.getElementById('results-content').innerHTML = `
    <div class="card">
      <div class="flex gap-12 mb-8 flex-wrap">
        <div>
          <div class="card-title">Round ${selected} — ${track.flag} ${escHtml(track.name)}</div>
          <div class="text-sm text-muted">${weather?.emoji} ${weather?.label} · ${track.laps} laps · ${r.scTriggers} SC${r.scTriggers === 1 ? '' : 's'}</div>
        </div>
        <div class="ml-auto flex gap-8">
          ${selector}
          <button class="btn btn-blue btn-sm" id="results-print-btn">📄 Export PDF</button>
        </div>
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
    <div class="card">
      <div class="card-title">Race Events</div>
      <div class="events-ticker" style="height:auto;max-height:300px">${eventsList}</div>
    </div>`;

  document.getElementById('results-round-select').addEventListener('change', e => {
    APP.ui.selectedResult = parseInt(e.target.value, 10);
    renderResults();
  });
  document.getElementById('results-print-btn').addEventListener('click', () => printRaceResults(selected));
}

function printRaceResults(roundIdx) {
  const round = APP.season.calendar[roundIdx - 1];
  if (!round?.raceResults) return;
  const track   = TRACKS.find(t => t.id === round.trackId);
  const weather = WEATHER_OPTIONS.find(w => w.id === round.weatherId);
  const r       = round.raceResults;
  document.getElementById('print-view').innerHTML = `
    <div class="print-page">
      <div class="print-header">
        <div>
          <div class="print-title">Race Report — Round ${roundIdx}</div>
          <div class="print-subtitle">${track.flag} ${escHtml(track.name)} GP · ${weather?.emoji} ${weather?.label} · ${track.laps} laps · ${r.scTriggers} SC</div>
        </div>
        <div class="print-logo">F1 MUN</div>
      </div>
      <div class="print-section">
        <div class="print-section-title">Final Classification</div>
        <table class="print-table">
          <thead><tr><th>Pos</th><th>Driver</th><th>Team</th><th>Grid</th><th>Status</th><th>Fastest Lap</th><th>Stops</th><th>Pts</th></tr></thead>
          <tbody>${r.classification.map(c => `<tr>
            <td>${c.dnf ? 'DNF' : c.position}</td>
            <td>${escHtml(c.driverName)}${c.isFL ? ' ⚡' : ''}${c.isBestPit ? ' 🔧' : ''}</td>
            <td>${escHtml(c.teamName)}</td>
            <td>${c.startPos}</td>
            <td>${c.dnf ? escHtml(c.dnfReason || 'DNF') : 'Finished'}</td>
            <td>${c.dnf ? '—' : fmtTime(c.fastestLap)}</td>
            <td>${c.pitStops?.length || 0}</td>
            <td>${c.points}</td>
          </tr>`).join('')}</tbody>
        </table>
      </div>
    </div>`;
  setTimeout(() => window.print(), 100);
}


/* ─── 20. CHAMPIONSHIP ─────────────────────────────────────── */
function renderChampionship() {
  const drivers      = Object.entries(APP.champ.drivers).sort((a, b) => b[1].points - a[1].points);
  const constructors = Object.entries(APP.champ.constructors).sort((a, b) => b[1].points - a[1].points);
  const completedRounds = APP.season.calendar
    .map((r, i) => r.completed ? (i + 1) : null)
    .filter(x => x);

  const drvRows = drivers.map(([k, d], i) => `<tr>
    <td class="champ-pos">${i + 1}</td>
    <td><span class="champ-dot" style="background:${escHtml(d.teamColor)}"></span>${escHtml(d.name)}</td>
    <td class="text-muted">${escHtml(d.teamName)}</td>
    <td class="mono">${d.wins || 0}</td>
    <td class="mono">${d.podiums || 0}</td>
    <td class="mono">${d.poles || 0}</td>
    <td class="mono">${d.fl || 0}</td>
    <td class="mono text-accent">${d.dnfs || 0}</td>
    <td class="champ-pts">${d.points}</td>
  </tr>`).join('');

  const conRows = constructors.map(([id, c], i) => `<tr>
    <td class="champ-pos">${i + 1}</td>
    <td><span class="champ-dot" style="background:${escHtml(c.color)}"></span>${escHtml(c.name)}</td>
    <td class="mono">${c.wins || 0}</td>
    <td class="mono">${c.podiums || 0}</td>
    <td class="champ-pts">${c.points}</td>
  </tr>`).join('');

  const matrixHeader = completedRounds.map(r => {
    const rt = TRACKS.find(t => t.id === APP.season.calendar[r - 1].trackId);
    return `<th>R${r} ${rt?.flag || ''}</th>`;
  }).join('');

  const matrixRows = drivers.map(([k, d]) => {
    const cells = completedRounds.map(r => {
      const h = (d.history || []).find(x => x.round === r);
      if (!h) return '<td class="text-dim">—</td>';
      if (h.dnf) return `<td class="text-accent mono">DNF</td>`;
      return `<td class="mono">P${h.finishPos}<br><span class="text-dim text-xs">+${h.points}</span></td>`;
    }).join('');
    return `<tr>
      <td><span class="champ-dot" style="background:${escHtml(d.teamColor)}"></span>${escHtml(d.name)}</td>
      ${cells}
      <td class="champ-pts">${d.points}</td>
    </tr>`;
  }).join('');

  document.getElementById('championship-content').innerHTML = `
    <div class="grid-2">
      <div class="card">
        <div class="card-title">Drivers' Championship</div>
        <table class="champ-table">
          <thead><tr><th>Pos</th><th>Driver</th><th>Team</th><th>W</th><th>Pod</th><th>Pole</th><th>FL</th><th>DNF</th><th>Pts</th></tr></thead>
          <tbody>${drvRows || '<tr><td colspan="9" class="text-dim text-center">No data yet</td></tr>'}</tbody>
        </table>
      </div>
      <div class="card">
        <div class="card-title">Constructors' Championship</div>
        <table class="champ-table">
          <thead><tr><th>Pos</th><th>Team</th><th>W</th><th>Pod</th><th>Pts</th></tr></thead>
          <tbody>${conRows || '<tr><td colspan="5" class="text-dim text-center">No data yet</td></tr>'}</tbody>
        </table>
      </div>
    </div>
    ${completedRounds.length ? `
    <div class="card">
      <div class="card-title">Race-by-Race Progression</div>
      <div style="overflow-x:auto">
        <table class="champ-table">
          <thead><tr><th>Driver</th>${matrixHeader}<th>Total</th></tr></thead>
          <tbody>${matrixRows}</tbody>
        </table>
      </div>
    </div>` : ''}`;
}


/* ─── 21. ANALYTICS ────────────────────────────────────────── */
function renderAnalytics() {
  const isAdmin = APP.session.role === 'admin';
  let teamId = APP.ui.selectedAnalyticsTeam || (isAdmin ? APP.teams[0]?.id : APP.session.teamId);
  if (!teamId) {
    document.getElementById('analytics-content').innerHTML =
      `<div class="card"><div class="text-sm text-muted">No team data available.</div></div>`;
    return;
  }
  const team = APP.teams.find(t => t.id === teamId);
  if (!team) { document.getElementById('analytics-content').innerHTML = '<div class="card">Team not found</div>'; return; }

  const hasTDs     = ASSET_DB.technicalDirectors.length > 0;
  const conData    = APP.champ.constructors[team.id];
  const teamSelector = isAdmin
    ? `<select id="analytics-team-select">${APP.teams.map(t => `<option value="${t.id}" ${t.id === teamId ? 'selected' : ''}>${escHtml(t.name)}</option>`).join('')}</select>`
    : '';

  /* Driver lineup cards */
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

  /* Car component cards — TD included when available */
  const compSlots = ['engine', 'aero', 'strategist', 'pitcrew', 'principal', ...(hasTDs ? ['techDir'] : [])];
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

  /* Race history */
  const completedRounds = APP.season.calendar.filter(r => r.completed);
  const historyRows = completedRounds.map((round, i) => {
    const tr = TRACKS.find(t => t.id === round.trackId);
    return round.raceResults.classification.filter(c => c.teamId === team.id).map(c => {
      const grade = gradeFromScore(c.dnf ? 50 : (100 - (c.position - 1) * 4));
      return `<div class="race-history-row">
        <span class="race-round">R${i + 1}</span>
        <span class="race-track">${tr?.flag} ${escHtml(tr?.name)} — ${escHtml(c.driverName)}</span>
        <span class="race-pos">P${c.startPos}→${c.dnf ? 'DNF' : 'P' + c.position}</span>
        <span class="race-pts">+${c.points}</span>
        <span class="perf-grade ${grade.css}">${grade.g}</span>
      </div>`;
    }).join('');
  }).join('');

  /* Points progression bar chart */
  let cum = 0;
  const allCumMaxes = completedRounds.map((_, i) => {
    const pts = completedRounds.slice(0, i + 1)
      .flatMap(round => round.raceResults.classification.filter(c => c.teamId === team.id))
      .reduce((s, c) => s + c.points, 0);
    return pts;
  });
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

  /* Constructors comparison */
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
        <div class="ml-auto flex gap-8">
          ${teamSelector}
          <button class="btn btn-blue btn-sm" id="analytics-print-btn">📄 Export Report</button>
        </div>
      </div>
    </div>
    <div class="analytics-section">
      <div class="analytics-heading">Driver Lineup</div>
      <div class="grid-3">${driverHtml}</div>
    </div>
    <div class="analytics-section">
      <div class="analytics-heading">Car Components${hasTDs ? ' — including Technical Director' : ''}</div>
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

  if (isAdmin) {
    document.getElementById('analytics-team-select')?.addEventListener('change', e => {
      APP.ui.selectedAnalyticsTeam = e.target.value;
      renderAnalytics();
    });
  }
  document.getElementById('analytics-print-btn')?.addEventListener('click', () => printAnalyticsReport(team.id));
}

function printAnalyticsReport(teamId) {
  const team    = APP.teams.find(t => t.id === teamId); if (!team) return;
  const conData = APP.champ.constructors[team.id];
  const completed = APP.season.calendar.filter(r => r.completed);
  const constructors = Object.entries(APP.champ.constructors).sort((a, b) => b[1].points - a[1].points);
  const drivers      = Object.entries(APP.champ.drivers).sort((a, b) => b[1].points - a[1].points);

  const assetRows = SLOT_ORDER.map(slot => {
    const a = getAsset(team.assets[slot]);
    if (!a) return `<tr><td>${SLOT_LABELS[slot]}</td><td colspan="3" style="color:#999">— empty —</td></tr>`;
    return `<tr>
      <td>${SLOT_LABELS[slot]}</td><td>${escHtml(a.name)}</td><td>${ovr(a)}</td>
      <td style="font-size:9px">${Object.entries(a.ratings).map(([k, v]) => `${k}: ${v}`).join(', ')}</td>
    </tr>`;
  }).join('');

  document.getElementById('print-view').innerHTML = `
    <div class="print-page">
      <div class="print-header">
        <div>
          <div class="print-title">${escHtml(team.name)}</div>
          <div class="print-subtitle">Team Performance Report · ${escHtml(APP.season.name)}</div>
        </div>
        <div class="print-logo">F1 MUN</div>
      </div>
      <div class="print-grid-2">
        <div>
          <div class="print-section-title">Team Statistics</div>
          <div class="print-stat-row"><span>Overall Rating</span><span>${teamOvr(team) ?? '—'}</span></div>
          <div class="print-stat-row"><span>Total Spent</span><span>$${teamSpent(team)}M</span></div>
          <div class="print-stat-row"><span>Championship Points</span><span>${conData?.points || 0}</span></div>
          <div class="print-stat-row"><span>Wins</span><span>${conData?.wins || 0}</span></div>
          <div class="print-stat-row"><span>Podiums</span><span>${conData?.podiums || 0}</span></div>
          <div class="print-stat-row"><span>Position</span><span>${constructors.findIndex(([id]) => id === team.id) + 1} / ${constructors.length}</span></div>
        </div>
      </div>
      <div class="print-section">
        <div class="print-section-title">Asset Roster</div>
        <table class="print-table">
          <thead><tr><th>Slot</th><th>Asset</th><th>OVR</th><th>Ratings</th></tr></thead>
          <tbody>${assetRows}</tbody>
        </table>
      </div>
    </div>
    <div class="print-page">
      <div class="print-header">
        <div>
          <div class="print-title">Championship Standings</div>
          <div class="print-subtitle">After Round ${completed.length} / ${APP.season.calendar.length}</div>
        </div>
        <div class="print-logo">F1 MUN</div>
      </div>
      <div class="print-grid-2">
        <div>
          <div class="print-section-title">Drivers</div>
          <table class="print-table">
            <thead><tr><th>Pos</th><th>Driver</th><th>Team</th><th>Pts</th></tr></thead>
            <tbody>${drivers.map(([k, d], i) => `<tr><td>${i + 1}</td><td>${escHtml(d.name)}</td><td>${escHtml(d.teamName)}</td><td>${d.points}</td></tr>`).join('')}</tbody>
          </table>
        </div>
        <div>
          <div class="print-section-title">Constructors</div>
          <table class="print-table">
            <thead><tr><th>Pos</th><th>Team</th><th>Pts</th></tr></thead>
            <tbody>${constructors.map(([id, c], i) => `<tr><td>${i + 1}</td><td>${escHtml(c.name)}</td><td>${c.points}</td></tr>`).join('')}</tbody>
          </table>
        </div>
      </div>
    </div>`;
  setTimeout(() => window.print(), 100);
}


/* ─── 22. TRADE DESK ───────────────────────────────────────── */
function renderTrade() {
  const root    = document.getElementById('trade-content');
  const isAdmin = APP.session.role === 'admin';

  /* Show delegate info banner */
  const banner = document.getElementById('trade-admin-banner');
  if (banner) banner.hidden = isAdmin;

  if (APP.teams.length < 2) {
    root.innerHTML = `<div class="card"><div class="text-sm text-muted">Need at least 2 teams to trade.</div></div>`;
    return;
  }
  if (!APP.ui.tradeA) APP.ui.tradeA = APP.teams[0].id;
  if (!APP.ui.tradeB) APP.ui.tradeB = APP.teams[1].id;
  if (APP.ui.tradeA === APP.ui.tradeB)
    APP.ui.tradeB = APP.teams.find(t => t.id !== APP.ui.tradeA)?.id;

  const teamA    = APP.teams.find(t => t.id === APP.ui.tradeA);
  const teamB    = APP.teams.find(t => t.id === APP.ui.tradeB);
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
        <div class="flex-1">
          <div class="fw-700 text-sm">${escHtml(a.name)}</div>
          <div class="text-xs text-muted">OVR ${ovr(a)} · $${priceOf(a.id)}M</div>
        </div>
      </div>`;
    }).join('');
    const totalVal = selected.reduce((sum, s) => sum + priceOf(team.assets[s]), 0);
    return `<div class="card">
      <div class="flex gap-8 mb-12">
        <select data-trade-side="${side}" style="flex:1">${side === 'A' ? optionsA : optionsB}</select>
      </div>
      <div class="card-title">Click assets to select for trade</div>
      ${rows || '<div class="text-dim text-sm">No assets assigned</div>'}
      <div class="mt-12 text-xs">Selected value: <span class="text-gold mono">$${totalVal}M</span></div>
    </div>`;
  };

  root.innerHTML = `
    <div class="trade-grid">
      ${buildSide(teamA, 'A')}
      <div class="trade-arrow">⇄</div>
      ${buildSide(teamB, 'B')}
    </div>
    <div class="card mt-16">
      <div class="card-title">Execute Trade</div>
      <div class="text-xs text-muted mb-12">
        Slot types must match (drivers ↔ drivers, engines ↔ engines, etc.).
      </div>
      ${isAdmin
        ? `<button class="btn btn-red" id="trade-execute-btn">⚡ Execute Trade</button>`
        : `<div class="trade-execute-disabled">🔐 Only the Admin / Chair can execute a trade. Select your offer above, then ask the Chair to confirm.</div>`}
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
  if (isAdmin) document.getElementById('trade-execute-btn').addEventListener('click', executeTrade);
}

function executeTrade() {
  const teamA  = APP.teams.find(t => t.id === APP.ui.tradeA);
  const teamB  = APP.teams.find(t => t.id === APP.ui.tradeB);
  const aSlots = APP.ui.tradeASelected;
  const bSlots = APP.ui.tradeBSelected;
  if (!aSlots.length || !bSlots.length) { notify('Select assets on both sides', 'warn'); return; }

  const driverSlots = ['driver1', 'driver2', 'reserve'];
  const toType = s => driverSlots.includes(s) ? 'driver' : s;
  if (aSlots.length !== bSlots.length) { notify('Both sides must offer the same number of assets', 'error'); return; }
  if ([...aSlots.map(toType)].sort().join(',') !== [...bSlots.map(toType)].sort().join(',')) {
    notify('Slot types must match (drivers ↔ drivers, engines ↔ engines, etc.)', 'error'); return;
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
  /* Sync championship entries */
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
/* ─── END OF PART 5-A ────────────────────────────────────── */

/* ═══════════════════════════════════════════════════════════════
   PART 5-B — Admin Panel (renderAdmin + all helper modals + export)
═══════════════════════════════════════════════════════════════ */

/* ─── 23. ADMIN PANEL ──────────────────────────────────────── */
function renderAdmin() {
  const teamRows = APP.teams.map(t => {
    const d1 = getAsset(t.assets.driver1);
    const d2 = getAsset(t.assets.driver2);
    const dr = getAsset(t.assets.reserve);
    return `<div class="card card-sm" style="border-left:3px solid ${escHtml(t.color)}">
      <div class="flex gap-8 mb-8">
        <span class="fw-700">${escHtml(t.name)}</span>
        <span class="ml-auto text-xs text-muted">PW: ${t.password ? '••••' : '<span class="text-dim">none</span>'}</span>
        <button class="btn btn-ghost btn-xs" data-team-pw="${t.id}">Set PW</button>
      </div>
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

  /* Live Sync section */
  const syncActive = !!APP.sync.sessionId;
  const sessionQR  = syncActive
    ? `<div class="sync-qr-wrapper"><img src="${getQRCodeURL(buildSessionURL(APP.sync.sessionId))}" alt="QR Code" /></div>`
    : '';
  const syncBodyHtml = `
    <div class="card-title">Option A — Share Link (instant, one-time snapshot)</div>
    <div class="text-xs text-muted mb-8">Encodes the full state into a URL. Anyone who opens it gets your current data — no server needed.</div>
    <div class="sync-url-block">
      <div class="sync-url-display" id="sync-url-preview">(click Generate to create link)</div>
      <button class="btn btn-ghost btn-sm" id="sync-copy-url-btn">📋 Copy</button>
    </div>
    <div class="sync-qr-wrapper" id="sync-url-qr" hidden></div>
    <div class="sync-actions-row">
      <button class="btn btn-blue btn-sm" id="sync-gen-url-btn">⚡ Generate Link</button>
    </div>

    <div class="sync-divider">or Live Session (delegates can pull anytime)</div>

    <div class="card-title">Option B — Live Session</div>
    <div class="text-xs text-muted mb-8">Creates a persistent session on a free public server. Share the ID — delegates enter it on the login screen to pull the latest state. Push updates after each race.</div>
    ${syncActive ? `
      <div class="sync-session-id-display">
        <div class="sync-session-id-label">Session ID — share with all delegates</div>
        <div class="sync-session-id-value" id="sync-session-id-val">${escHtml(APP.sync.sessionId)}</div>
      </div>
      ${sessionQR}
      ${APP.sync.lastPushAt ? `<div class="sync-last-updated">Last pushed: ${new Date(APP.sync.lastPushAt).toLocaleTimeString()}</div>` : ''}
      <div class="sync-actions-row">
        <button class="btn btn-red btn-sm" id="sync-push-btn">📤 Push Update Now</button>
        <button class="btn btn-ghost btn-sm" id="sync-copy-id-btn">📋 Copy ID</button>
        <button class="btn btn-ghost btn-sm" id="sync-end-session-btn">✕ End Session</button>
      </div>` : `
      <div class="sync-actions-row">
        <button class="btn btn-teal btn-sm" id="sync-create-session-btn">▶ Create Live Session</button>
      </div>`}

    <div class="sync-auto-row">
      <span class="sync-auto-label">Auto-push state after each race</span>
      <label class="sync-toggle">
        <input type="checkbox" id="sync-auto-toggle" ${APP.sync.autoSync ? 'checked' : ''}>
        <span class="sync-toggle-slider"></span>
      </label>
    </div>`;

  document.getElementById('admin-content').innerHTML = `
    <div class="admin-section">
      <div class="admin-section-title">Authentication</div>
      <div class="grid-2">
        <div>
          <label class="text-xs text-muted">Admin Password</label>
          <div class="flex gap-8 mt-8">
            <input type="text" id="admin-pw-input" value="${escHtml(APP.auth.adminPw)}" />
            <button class="btn btn-blue btn-sm" id="set-admin-pw-btn">Save</button>
          </div>
        </div>
        <div>
          <label class="text-xs text-muted">Shared Delegate Password</label>
          <div class="flex gap-8 mt-8">
            <input type="text" id="user-pw-input" value="${escHtml(APP.auth.userPw)}" />
            <button class="btn btn-blue btn-sm" id="set-user-pw-btn">Save</button>
          </div>
        </div>
      </div>
    </div>

    <div class="admin-section">
      <div class="admin-section-title">Teams · Driver Swaps · Per-Team Passwords</div>
      <div class="grid-2">${teamRows || '<div class="text-dim">No teams yet</div>'}</div>
    </div>

    <div class="admin-section">
      <div class="admin-section-title">🔗 Live Sync — Share Without Downloads</div>
      <div class="text-xs text-muted mb-12">
        Delegates don't need to download any file. Share a link or session ID — they open it
        in their browser, the state loads, and they log in as normal.
      </div>
      <div class="sync-panel">
        <div class="sync-panel-header">
          <div class="sync-status-dot ${syncActive ? 'active' : ''}" id="sync-status-dot"></div>
          <div>
            <div class="sync-panel-title">${syncActive ? 'Live Session Active' : 'No Active Session'}</div>
            <div class="sync-panel-sub">${syncActive ? `Session ID: …${APP.sync.sessionId.slice(-8)}` : 'Create a session or generate a share link'}</div>
          </div>
        </div>
        <div class="sync-panel-body">${syncBodyHtml}</div>
      </div>
    </div>

    <div class="admin-section">
      <div class="admin-section-title">Distribution (File-based fallback)</div>
      <div class="text-xs text-muted mb-12">Use the live sync above as the primary method. File export is a backup.</div>
      <div class="flex gap-12 flex-wrap">
        <button class="btn btn-red" id="export-package-btn">📦 Generate Package (HTML)</button>
        <button class="btn btn-ghost" id="export-state-btn">⬇ Download State (JSON)</button>
        <label class="btn btn-ghost file-label">
          ⬆ Import State (JSON)
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

  /* ── Wire up all admin buttons ── */
  document.getElementById('set-admin-pw-btn').addEventListener('click', () => {
    const v = document.getElementById('admin-pw-input').value.trim();
    if (!v) { notify('Password cannot be empty', 'warn'); return; }
    APP.auth.adminPw = v; saveState(); notify('Admin password updated', 'success');
  });
  document.getElementById('set-user-pw-btn').addEventListener('click', () => {
    const v = document.getElementById('user-pw-input').value.trim();
    if (!v) { notify('Password cannot be empty', 'warn'); return; }
    APP.auth.userPw = v; saveState(); notify('Delegate password updated', 'success');
  });

  document.querySelectorAll('[data-team-pw]').forEach(b =>
    b.addEventListener('click', () => setTeamPasswordModal(b.dataset.teamPw)));
  document.querySelectorAll('[data-swap]').forEach(b =>
    b.addEventListener('click', () => openDriverSwapModal(b.dataset.swap)));
  document.querySelectorAll('[data-activate-reserve]').forEach(b =>
    b.addEventListener('click', () => activateReserveModal(b.dataset.activateReserve)));

  /* Sync buttons */
  document.getElementById('sync-gen-url-btn')?.addEventListener('click', () => {
    const url      = generateShareLink();
    const preview  = document.getElementById('sync-url-preview');
    const qrWrapper = document.getElementById('sync-url-qr');
    preview.textContent = url.length > 80 ? url.slice(0, 78) + '…' : url;
    preview.title = url;
    preview.dataset.fullUrl = url;
    qrWrapper.hidden = false;
    qrWrapper.innerHTML = `<img src="${getQRCodeURL(url)}" alt="QR Code" />`;
    notify('Share link ready — copy it above', 'success');
  });
  document.getElementById('sync-copy-url-btn')?.addEventListener('click', () => {
    const url = document.getElementById('sync-url-preview')?.dataset.fullUrl;
    if (!url) { notify('Generate the link first', 'warn'); return; }
    navigator.clipboard?.writeText(url).then(() => notify('Link copied!', 'success'))
      .catch(() => { prompt('Copy this link:', url); });
  });
  document.getElementById('sync-create-session-btn')?.addEventListener('click', createLiveSession);
  document.getElementById('sync-push-btn')?.addEventListener('click', pushLiveSession);
  document.getElementById('sync-copy-id-btn')?.addEventListener('click', () => {
    const id = APP.sync.sessionId;
    if (!id) return;
    navigator.clipboard?.writeText(id).then(() => notify('Session ID copied!', 'success'))
      .catch(() => { prompt('Copy this Session ID:', id); });
  });
  document.getElementById('sync-end-session-btn')?.addEventListener('click', () => {
    APP.sync.sessionId = null; APP.sync.isHost = false;
    saveState(); renderAdmin(); notify('Session ended', 'warn');
  });
  document.getElementById('sync-auto-toggle')?.addEventListener('change', e => {
    APP.sync.autoSync = e.target.checked; saveState();
    notify(APP.sync.autoSync ? 'Auto-push enabled' : 'Auto-push disabled', 'success');
  });

  /* Export / import */
  document.getElementById('export-package-btn').addEventListener('click', exportPackage);
  document.getElementById('export-state-btn').addEventListener('click', exportStateJSON);
  document.getElementById('import-state-input').addEventListener('change', e => {
    if (e.target.files[0]) importStateJSON(e.target.files[0]);
  });

  /* Danger zone */
  document.getElementById('reset-fp-btn').addEventListener('click', () => {
    openModal({
      title: 'Reset Free Practice?',
      body:  '<div class="text-sm">Allows the FP session to be re-run.</div>',
      actions: [
        { label:'Cancel', cls:'btn-ghost', onClick:closeModal },
        { label:'Reset',  cls:'btn-red',   onClick:() => {
          APP.fpData = null; APP.season.fpDone = false;
          saveState(); closeModal(); notify('Free Practice reset', 'warn');
        }},
      ],
    });
  });
  document.getElementById('reset-season-btn').addEventListener('click', () => {
    openModal({
      title: 'Reset Season Progress?',
      body:  '<div class="text-sm">Clears all race results, qualifying, and championship standings. Teams and assets remain.</div>',
      actions: [
        { label:'Cancel',       cls:'btn-ghost', onClick:closeModal },
        { label:'Reset Season', cls:'btn-red',   onClick:() => {
          APP.season.calendar.forEach(r => { r.qualResults=null; r.raceResults=null; r.completed=false; });
          APP.season.currentRound = APP.season.started ? 1 : 0;
          APP.season.teamStrategies = {};
          APP.fpData = null; APP.season.fpDone = false;
          initChampionship();
          saveState(); closeModal(); updateSidebar(); updateRoundBadge(); renderAdmin();
          notify('Season reset', 'warn');
        }},
      ],
    });
  });
  document.getElementById('reset-all-btn').addEventListener('click', () => {
    openModal({
      title: 'Reset EVERYTHING?',
      body:  '<div class="text-sm text-accent">Wipes all teams, assets, season data, championships and passwords. Cannot be undone.</div>',
      actions: [
        { label:'Cancel',          cls:'btn-ghost', onClick:closeModal },
        { label:'WIPE EVERYTHING', cls:'btn-red',   onClick:() => {
          try { localStorage.removeItem(LS_KEY); } catch(e) {}
          location.reload();
        }},
      ],
    });
  });
}


/* ─── Admin helper modals ───────────────────────────────────── */
function setTeamPasswordModal(teamId) {
  const team = APP.teams.find(t => t.id === teamId); if (!team) return;
  openModal({
    title: `Set password — ${team.name}`,
    body: `<div class="text-sm text-muted mb-12">Optional. If set, this team can log in directly with their own code (skipping the team picker). Leave blank to remove.</div>
      <input type="text" id="team-pw-modal-input" value="${escHtml(team.password || '')}" placeholder="Team password" style="width:100%" />`,
    actions: [
      { label:'Cancel', cls:'btn-ghost', onClick:closeModal },
      { label:'Save',   cls:'btn-red',   onClick:() => {
        const v = document.getElementById('team-pw-modal-input').value.trim();
        team.password = v || null;
        saveState(); closeModal(); renderAdmin();
        notify(v ? 'Team password set' : 'Team password removed', 'success');
      }},
    ],
  });
  setTimeout(() => document.getElementById('team-pw-modal-input')?.focus(), 100);
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
  openModal({
    title: `Driver Lineup — ${team.name}`,
    body: `<div class="text-sm text-muted mb-12">Reassign your three drivers among the slots. Championship points stay with the slot.</div>
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
    actions: [
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
  openModal({
    title: `Activate Reserve — ${team.name}`,
    body: `<div class="text-sm mb-12">Promote <span class="fw-700 text-purple">${escHtml(dr.name)}</span> into a race seat. The displaced driver moves to Reserve.</div>
      <div class="flex gap-8 flex-col">
        <button class="btn btn-ghost btn-full" data-promote-to="driver1">Replace Driver 1${d1?` — ${escHtml(d1.name)}`:''}</button>
        <button class="btn btn-ghost btn-full" data-promote-to="driver2">Replace Driver 2${d2?` — ${escHtml(d2.name)}`:''}</button>
      </div>`,
    actions: [{ label:'Cancel', cls:'btn-ghost', onClick:closeModal }],
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
      notify(`${escHtml(newRacer.name)} promoted to ${slot==='driver1'?'Driver 1':'Driver 2'}`, 'success');
    });
  });
}


/* ─── Distribution helpers ──────────────────────────────────── */
async function exportPackage() {
  try {
    notify('Building package…', 'blue');
    let cssText = '', jsText = '';
    try { cssText = await (await fetch('styles.css')).text(); } catch(e) {}
    try { jsText  = await (await fetch('app.js')).text(); }    catch(e) {}
    if (!cssText || !jsText) {
      notify('⚠ Could not bundle CSS/JS (file:// blocks fetch). Use State JSON export instead.', 'warn'); return;
    }
    let htmlSource = document.documentElement.outerHTML;
    htmlSource = htmlSource.replace(/<link[^>]*href=["']styles\.css["'][^>]*>/i, `<style>${cssText}</style>`);
    const stateJson   = JSON.stringify(getPublicStateSnapshot());
    const embeddedJs  = jsText.replace(
      /\/\*EMBED_STATE_START\*\/[\s\S]*?\/\*EMBED_STATE_END\*\//,
      `/*EMBED_STATE_START*/${stateJson}/*EMBED_STATE_END*/`
    );
    htmlSource = htmlSource.replace(
      /<script[^>]*src=["']app\.js["'][^>]*><\/script>/i,
      `<script>${embeddedJs}</script>`
    );
    const blob  = new Blob(['<!DOCTYPE html>\n', htmlSource], { type:'text/html' });
    const url   = URL.createObjectURL(blob);
    const a     = document.createElement('a');
    const stamp = new Date().toISOString().slice(0,10);
    a.href     = url;
    a.download = `F1MUN_${stamp}_R${APP.season.currentRound}.html`;
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
    notify('✓ Package ready — share via Google Drive', 'success');
  } catch(err) { notify('Export failed: ' + err.message, 'error'); }
}

function exportStateJSON() {
  const snap = { ...getPublicStateSnapshot(), auth:APP.auth, exportedAt:new Date().toISOString() };
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
      openModal({
        title: 'Import State?',
        body:  `<div class="text-sm">This will <span class="text-accent fw-700">REPLACE</span> all current data with the contents of <span class="mono">${escHtml(file.name)}</span>.${data.exportedAt?`<br><br><span class="text-xs text-muted">Exported ${new Date(data.exportedAt).toLocaleString()}</span>`:''}</div>`,
        actions: [
          { label:'Cancel',           cls:'btn-ghost', onClick:closeModal },
          { label:'Import & Replace', cls:'btn-red',   onClick:() => {
            if (data.auth)   APP.auth   = data.auth;
            applyStateSnapshot(data);
            closeModal(); notify('✓ State imported', 'success');
            setTimeout(() => location.reload(), 800);
          }},
        ],
      });
    } catch(err) { notify('Invalid JSON file: ' + err.message, 'error'); }
  };
  reader.readAsText(file);
}
/* ─── END OF PART 5-B ────────────────────────────────────── */

/* ═══════════════════════════════════════════════════════════════
   PART 6 — Winner Popup · Champion Popup · Live Sync · Modal · Init
═══════════════════════════════════════════════════════════════ */

/* ─── 24. RACE WINNER POPUP ────────────────────────────────── */
function showRaceWinnerPopup(round) {
  const isLastRace = APP.season.calendar.every(r => r.completed);
  if (isLastRace) { showSeasonChampionPopup(); return; }

  const classification = round.raceResults.classification;
  const track = TRACKS.find(t => t.id === round.trackId);
  const p1 = classification[0];
  const p2 = classification[1];
  const p3 = classification[2];
  const flEntry = round.raceResults.flCar
    ? classification.find(c => c.driverId === round.raceResults.flCar.driverId)
    : null;

  const popup = document.getElementById('win-popup');
  const card  = document.getElementById('win-card');

  card.innerHTML = `
    <div class="win-track-label">${track?.flag || ''} ${escHtml(track?.name || '')} Grand Prix</div>
    <div class="win-chequered">🏁</div>
    <div class="win-race-label">Race Winner</div>
    <div class="win-driver-name" style="color:${escHtml(p1.teamColor)}">${escHtml(p1.driverName)}</div>
    <div class="win-team-label">${escHtml(p1.teamName)}</div>
    <div class="win-time-display">${fmtTime(p1.totalTime)}</div>

    <div class="win-podium">
      <div class="podium-block p2" style="--pc:${escHtml(p2?.teamColor || '#888')}">
        <div class="podium-pos-num">P2</div>
        <div class="podium-driver-label">${escHtml(p2?.driverName || '—')}</div>
      </div>
      <div class="podium-block p1" style="--pc:${escHtml(p1.teamColor)}">
        <div class="podium-pos-num">P1</div>
        <div class="podium-driver-label">${escHtml(p1.driverName)}</div>
      </div>
      <div class="podium-block p3" style="--pc:${escHtml(p3?.teamColor || '#888')}">
        <div class="podium-pos-num">P3</div>
        <div class="podium-driver-label">${escHtml(p3?.driverName || '—')}</div>
      </div>
    </div>

    ${flEntry ? `<div class="win-fl-row">
      <span class="fl-label">⚡ FASTEST LAP</span>
      <span>${escHtml(flEntry.driverName)}</span>
      <span class="mono">${fmtTime(round.raceResults.flCar.time)}</span>
    </div>` : ''}

    <button class="btn btn-red win-close-btn" id="win-close-btn">Continue →</button>`;

  popup.hidden = false;
  generateConfetti('win-confetti', false);

  document.getElementById('win-close-btn').addEventListener('click', () => {
    popup.hidden = true;
    document.getElementById('win-confetti').innerHTML = '';
    showPage('results');
  });
}


/* ─── 25. SEASON CHAMPION POPUP ────────────────────────────── */
function showSeasonChampionPopup() {
  const drivers      = Object.entries(APP.champ.drivers).sort((a, b) => b[1].points - a[1].points);
  const constructors = Object.entries(APP.champ.constructors).sort((a, b) => b[1].points - a[1].points);
  const wdc = drivers[0]?.[1];
  const wcc = constructors[0]?.[1];

  const popup = document.getElementById('champion-popup');
  const card  = document.getElementById('champion-card');

  const standingsHtml = drivers.slice(0, 5).map(([k, d], i) => `
    <div class="champion-standing-row">
      <span class="champion-standing-pos ${i===0?'cp1':i===1?'cp2':i===2?'cp3':''}">${i + 1}</span>
      <span class="champion-standing-dot" style="background:${escHtml(d.teamColor)}"></span>
      <div style="flex:1;text-align:left">
        <div class="champion-standing-name">${escHtml(d.name)}</div>
        <div class="champion-standing-team">${escHtml(d.teamName)}</div>
      </div>
      <span class="champion-standing-pts">${d.points}</span>
    </div>`).join('');

  card.innerHTML = `
    <div class="champion-trophy">🏆</div>
    <div class="champion-world-label">World Champion</div>
    <div class="champion-season-name">${escHtml(APP.season.name)}</div>

    <div class="champion-section">
      <div class="champion-section-label">Drivers' Champion</div>
      <div class="champion-driver-name" style="color:${escHtml(wdc?.teamColor || '#ffd700')}">${escHtml(wdc?.name || '—')}</div>
      <div class="champion-team-label">${escHtml(wdc?.teamName || '—')}</div>
      <div class="champion-pts-big">${wdc?.points || 0}</div>
      <div class="champion-pts-label">CHAMPIONSHIP POINTS</div>
      <div class="champion-mini-stats">
        <div class="champion-mini-stat"><span class="champion-mini-val">${wdc?.wins || 0}</span><span class="champion-mini-lbl">Wins</span></div>
        <div class="champion-mini-stat"><span class="champion-mini-val">${wdc?.podiums || 0}</span><span class="champion-mini-lbl">Podiums</span></div>
        <div class="champion-mini-stat"><span class="champion-mini-val">${wdc?.poles || 0}</span><span class="champion-mini-lbl">Poles</span></div>
        <div class="champion-mini-stat"><span class="champion-mini-val">${wdc?.fl || 0}</span><span class="champion-mini-lbl">Fastest</span></div>
      </div>
    </div>

    <div class="champion-divider"></div>

    <div class="champion-section">
      <div class="champion-section-label">Constructors' Champions</div>
      <div class="champion-driver-name" style="color:${escHtml(wcc?.color || '#ffd700')};font-size:20px">${escHtml(wcc?.name || '—')}</div>
      <div class="champion-pts-big" style="font-size:26px">${wcc?.points || 0}</div>
      <div class="champion-pts-label">CONSTRUCTOR POINTS</div>
    </div>

    <div class="champion-divider"></div>

    <div class="champion-section-label" style="margin-bottom:10px">Final Drivers' Standings</div>
    <div class="champion-standings-list">${standingsHtml}</div>

    <div class="champion-countdown" id="champion-countdown">Opening in 5s…</div>
    <button class="champion-close-btn btn btn-gold" id="champion-close-btn">🏆 View Championship</button>`;

  popup.hidden = false;
  generateConfetti('champion-fireworks', true);
  generateFireworks('champion-fireworks');

  let secs = 5;
  const countEl = document.getElementById('champion-countdown');
  const countInterval = setInterval(() => {
    secs--;
    if (secs <= 0) { clearInterval(countInterval); if (countEl) countEl.textContent = ''; }
    else if (countEl) countEl.textContent = `Opening in ${secs}s…`;
  }, 1000);

  document.getElementById('champion-close-btn').addEventListener('click', () => {
    clearInterval(countInterval);
    popup.hidden = true;
    document.getElementById('champion-fireworks').innerHTML = '';
    showPage('championship');
  });
}


/* ─── Confetti & Fireworks generators ──────────────────────── */
function generateConfetti(containerId, isGrand = false) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';
  const colors = isGrand
    ? ['#ffd700','#e8002d','#ff7043','#ffd700','#ab47bc','#fff','#ffd700']
    : ['#e8002d','#ffd700','#29b6f6','#00e676','#ab47bc','#ff7043','#fff'];
  const count = isGrand ? 120 : 70;
  for (let i = 0; i < count; i++) {
    const p      = document.createElement('div');
    const size   = 6 + Math.random() * 10;
    const circle = Math.random() > 0.5;
    p.className  = 'confetti-piece';
    p.style.cssText = `
      left:${Math.random() * 100}%;
      width:${size}px; height:${circle ? size : size * 1.6}px;
      background:${colors[Math.floor(Math.random() * colors.length)]};
      animation-delay:${Math.random() * (isGrand ? 3 : 1.5)}s;
      animation-duration:${2.5 + Math.random() * 2}s;
      border-radius:${circle ? '50%' : '2px'};
      opacity:${0.75 + Math.random() * 0.25};
      transform:rotate(${Math.random() * 360}deg);`;
    container.appendChild(p);
  }
}

function generateFireworks(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const colors = ['#ffd700','#e8002d','#29b6f6','#00e676','#ab47bc','#ff7043','#fff'];
  const positions = [
    {x:20,y:25},{x:80,y:20},{x:50,y:15},
    {x:15,y:60},{x:85,y:55},{x:45,y:40},{x:65,y:30},{x:30,y:70},
  ];
  positions.forEach((pos, pi) => {
    const color = colors[pi % colors.length];
    const n     = 12 + Math.floor(Math.random() * 8);
    for (let j = 0; j < n; j++) {
      const angle    = (j / n) * 360;
      const distance = 50 + Math.random() * 70;
      const dx = Math.cos(angle * Math.PI / 180) * distance;
      const dy = Math.sin(angle * Math.PI / 180) * distance;
      const star = document.createElement('div');
      star.className = 'firework-star';
      star.style.cssText = `
        left:${pos.x}%; top:${pos.y}%;
        background:${color};
        width:${3 + Math.random() * 4}px; height:${3 + Math.random() * 4}px;
        --dx:${dx}px; --dy:${dy}px;
        --dur:${1 + Math.random() * 0.8}s;
        --delay:${pi * 0.35 + Math.random() * 0.5}s;
        box-shadow:0 0 5px ${color};`;
      container.appendChild(star);
    }
  });
}


/* ─── 26. LIVE SYNC ────────────────────────────────────────── */
const JSONBLOB_API = 'https://jsonblob.com/api/jsonBlob';

function buildSessionURL(blobId) {
  return `${location.origin}${location.pathname}?sid=${encodeURIComponent(blobId)}`;
}

function getQRCodeURL(text) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=160x160&format=png&data=${encodeURIComponent(text)}`;
}

/* Compress state into a URL-safe hash */
function generateShareLink() {
  const json = JSON.stringify(getPublicStateSnapshot());
  let encoded;
  if (typeof LZString !== 'undefined') {
    encoded = LZString.compressToEncodedURIComponent(json);
  } else {
    encoded = btoa(unescape(encodeURIComponent(json)));
  }
  return `${location.origin}${location.pathname}#sync=${encoded}`;
}

/* Attempt to load state from the URL hash */
function loadFromShareHash() {
  const hash = location.hash;
  if (!hash.startsWith('#sync=')) return false;
  try {
    const encoded = hash.slice(6);
    let json;
    if (typeof LZString !== 'undefined') {
      json = LZString.decompressFromEncodedURIComponent(encoded);
    } else {
      json = decodeURIComponent(escape(atob(encoded)));
    }
    if (!json) throw new Error('Decompression failed');
    applyStateSnapshot(JSON.parse(json));
    history.replaceState(null, '', location.pathname + location.search);
    notify('✓ State loaded from share link', 'success');
    return true;
  } catch(e) { console.warn('Share hash error:', e); return false; }
}

/* Create a new JSONBlob session */
async function createLiveSession() {
  try {
    notify('Creating live session…', 'blue');
    const resp = await fetch(JSONBLOB_API, {
      method:  'POST',
      headers: { 'Content-Type':'application/json', 'Accept':'application/json' },
      body:    JSON.stringify(getPublicStateSnapshot()),
    });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const loc    = resp.headers.get('Location') || '';
    const blobId = loc.split('/').pop();
    if (!blobId) throw new Error('No blob ID returned');
    APP.sync.sessionId  = blobId;
    APP.sync.isHost     = true;
    APP.sync.lastPushAt = new Date().toISOString();
    saveState();
    notify('✓ Live session created — share the ID with delegates', 'success');
    renderAdmin();
  } catch(e) {
    notify('Could not create session: ' + e.message + ' — check network / CORS', 'error');
    console.warn(e);
  }
}

/* Push current state to the active session */
async function pushLiveSession() {
  if (!APP.sync.sessionId) { notify('No active session', 'warn'); return; }
  try {
    notify('Pushing state…', 'blue');
    const resp = await fetch(`${JSONBLOB_API}/${APP.sync.sessionId}`, {
      method:  'PUT',
      headers: { 'Content-Type':'application/json', 'Accept':'application/json' },
      body:    JSON.stringify(getPublicStateSnapshot()),
    });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    APP.sync.lastPushAt = new Date().toISOString();
    saveState(); notify('✓ State pushed to delegates', 'success');
    renderAdmin();
  } catch(e) { notify('Push failed: ' + e.message, 'error'); console.warn(e); }
}

/* Pull state from a session (used by delegates on login or auto-sync) */
async function pullLiveSession(sessionId, silent = false) {
  const id = sessionId || APP.sync.sessionId;
  if (!id) { if (!silent) notify('Enter a session ID', 'warn'); return false; }
  try {
    if (!silent) notify('Pulling state…', 'blue');
    const resp = await fetch(`${JSONBLOB_API}/${id}`, {
      headers: { 'Accept':'application/json' },
    });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const data = await resp.json();
    applyStateSnapshot(data);
    APP.sync.sessionId  = id;
    APP.sync.lastPullAt = new Date().toISOString();
    saveState();
    if (!silent) notify('✓ State synced from session', 'success');
    return true;
  } catch(e) {
    if (!silent) notify('Sync failed: ' + e.message, 'error');
    console.warn(e);
    return false;
  }
}


/* ─── 27. MODAL HELPERS ────────────────────────────────────── */
function openModal({ title = 'Modal', body = '', actions = [] } = {}) {
  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-body').innerHTML    = body;
  const root = document.getElementById('modal-actions');
  root.innerHTML = '';
  actions.forEach(a => {
    const btn = document.createElement('button');
    btn.className   = `btn ${a.cls || 'btn-ghost'}`;
    btn.textContent = a.label;
    btn.addEventListener('click', () => { try { a.onClick?.(); } catch(e) { console.error(e); } });
    root.appendChild(btn);
  });
  document.getElementById('modal-overlay').hidden = false;
}

function closeModal() {
  document.getElementById('modal-overlay').hidden = true;
  document.getElementById('modal-body').innerHTML    = '';
  document.getElementById('modal-actions').innerHTML = '';
}


/* ─── 28. NOTIFICATIONS ────────────────────────────────────── */
function notify(msg, type = '') {
  const container = document.getElementById('notif-container');
  if (!container) return;
  const el = document.createElement('div');
  el.className  = `notif ${type ? 'notif-' + type : ''}`;
  el.textContent = msg;
  container.appendChild(el);
  while (container.children.length > 5) container.removeChild(container.firstChild);
  setTimeout(() => { el.classList.add('fade-out'); setTimeout(() => el.remove(), 320); }, 3200);
}


/* ─── 29. INIT / EVENT BINDINGS ────────────────────────────── */
function init() {
  loadState();

  /* ── Check URL for share hash or session ID ─── */
  const urlParams = new URLSearchParams(location.search);
  const sidParam  = urlParams.get('sid');

  if (sidParam) {
    /* Delegate opened a session link — pull state then show normal login */
    pullLiveSession(sidParam, true).then(ok => {
      if (ok) {
        notify('✓ Session synced — log in to continue', 'success');
        /* Clean URL so refresh doesn't re-pull */
        history.replaceState(null, '', location.pathname);
      }
    });
  } else if (location.hash.startsWith('#sync=')) {
    loadFromShareHash();
  }

  /* ── Login screen ──────────────────────────────────────── */
  document.getElementById('login-submit-btn')
    .addEventListener('click', attemptLogin);
  document.getElementById('login-pw')
    .addEventListener('keydown', e => { if (e.key === 'Enter') attemptLogin(); });
  document.getElementById('login-back-btn')
    .addEventListener('click', showLoginPw);

  /* Sync join panel */
  document.getElementById('login-sync-btn')
    .addEventListener('click', showLoginSync);
  document.getElementById('login-sync-back-btn')
    .addEventListener('click', showLoginPw);
  document.getElementById('login-sync-submit-btn')
    .addEventListener('click', joinSessionAndEnter);
  document.getElementById('login-session-id')
    .addEventListener('keydown', e => { if (e.key === 'Enter') joinSessionAndEnter(); });

  /* ── Top nav ───────────────────────────────────────────── */
  document.getElementById('nav-logout-btn')
    .addEventListener('click', logout);

  /* ── Assets toolbar ────────────────────────────────────── */
  document.getElementById('csv-file-input')
    .addEventListener('change', e => { if (e.target.files[0]) importCSVFile(e.target.files[0]); e.target.value = ''; });
  document.getElementById('reset-assets-btn')
    .addEventListener('click', resetAssets);
  document.getElementById('sheets-fetch-btn')
    .addEventListener('click', importFromSheets);
  document.getElementById('sheets-url')
    .addEventListener('keydown', e => { if (e.key === 'Enter') importFromSheets(); });

  /* ── Teams form ────────────────────────────────────────── */
  document.getElementById('create-team-btn')
    .addEventListener('click', createTeam);
  document.getElementById('new-team-name')
    .addEventListener('keydown', e => { if (e.key === 'Enter') createTeam(); });

  /* ── Season page ───────────────────────────────────────── */
  document.getElementById('lock-season-btn')
    .addEventListener('click', lockSeason);
  document.getElementById('unlock-season-btn')
    .addEventListener('click', unlockSeason);
  document.getElementById('season-name-input')
    .addEventListener('change', e => {
      APP.season.name = e.target.value.trim() || APP.season.name;
      saveState();
      if (document.getElementById('page-dashboard').classList.contains('active')) renderDashboard();
    });
  document.getElementById('season-rounds')
    .addEventListener('input', updateCalendarPreview);

  /* ── Modal: close on overlay click or ESC ──────────────── */
  document.getElementById('modal-overlay').addEventListener('click', e => {
    if (e.target.id === 'modal-overlay') closeModal();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !document.getElementById('modal-overlay').hidden) closeModal();
  });

  /* ── Warn before unload during live race ───────────────── */
  window.addEventListener('beforeunload', e => {
    if (APP.race.running) {
      e.preventDefault();
      e.returnValue = 'A race is in progress — leaving will lose live progress.';
      return e.returnValue;
    }
  });

  /* ── Auto-focus password field ─────────────────────────── */
  setTimeout(() => document.getElementById('login-pw')?.focus(), 120);

  console.log(
    '%cF1 MUN Race Control v2',
    'color:#e8002d;font-weight:900;font-size:14px;letter-spacing:0.1em;',
    '— ready · TD · Strategy · Live Sync · Popups'
  );
}

/* Boot */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
/* ─── END OF PART 6 — app.js complete ───────────────────── */