/* ═══════════════════════════════════════════════════════════════
   F1 MUN — RACE CONTROL SYSTEM
   app.js
   ─────────────────────────────────────────────────────────────────
   Sections:
   1.  Constants (tracks, weather, points, etc.)
   2.  Asset DB scaffold (populated by CSV import)
   3.  Embedded state placeholder
   4.  App state
   5.  Persistence
   6.  Utilities
   7.  Authentication
   8.  Navigation
   9.  CSV import
   10. Dashboard
   11. Assets page
   12. Teams page
   13. Season page
   14. Free Practice
   15. Scoring engine
   16. Qualifying
   17. Race simulation
   18. Results
   19. Championship
   20. Analytics
   21. Trade Desk
   22. Admin Panel
   23. Modal helpers
   24. Notifications
   25. Init / event bindings
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
const FL_BONUS = 1; // fastest lap bonus (must finish in top 10)

const TYPE_COLORS = {
  engines:'#29b6f6', principals:'#e8002d', drivers:'#00e676',
  aero:'#ffd700',    strategists:'#ab47bc', pitstops:'#ff7043',
};
const TYPE_LABELS = {
  engines:'Engine', principals:'Team Principal', drivers:'Driver',
  aero:'Aero Package', strategists:'Strategist', pitstops:'Pit Crew',
};
const TYPE_TO_SLOT = {
  engines:'engine', principals:'principal', drivers:['driver1','driver2','reserve'],
  aero:'aero', strategists:'strategist', pitstops:'pitcrew',
};

const SLOT_LABELS = {
  engine:'Engine', principal:'Principal',
  driver1:'Driver 1', driver2:'Driver 2', reserve:'Reserve',
  aero:'Aero', strategist:'Strategist', pitcrew:'Pit Crew',
};
const SLOT_ORDER = ['engine','principal','driver1','driver2','reserve','aero','strategist','pitcrew'];
const SLOT_TO_TYPE = {
  engine:'engines', principal:'principals',
  driver1:'drivers', driver2:'drivers', reserve:'drivers',
  aero:'aero', strategist:'strategists', pitcrew:'pitstops',
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
  engines: [], principals: [], drivers: [],
  aero: [], strategists: [], pitstops: [],
};


/* ─── 3. EMBEDDED STATE PLACEHOLDER ────────────────────────── */
/* When the admin exports a package, the marker below is replaced
   with a JSON snapshot of the entire APP state plus ASSET_DB.   */
const EMBEDDED_STATE = /*EMBED_STATE_START*/null/*EMBED_STATE_END*/;


/* ─── 4. APP STATE ─────────────────────────────────────────── */
const APP = {
  auth: {
    adminPw: 'ADMIN2025',
    userPw:  'F1MUN2025',
  },
  session: { role: null, teamId: null },
  season: {
    name: 'F1 MUN Grand Prix Championship',
    started: false,
    fpDone: false,
    currentRound: 0,
    calendar: [],          // [{ trackId, weatherId, qualResults, raceResults, completed }]
    selectedTrackIds: [],  // working set during setup
  },
  champ: {
    drivers: {},      // driverKey -> { name, teamId, teamName, teamColor, points, wins, podiums, poles, fl, dnfs, history:[] }
    constructors: {}, // teamId  -> { name, color, points, wins, podiums, history:[] }
  },
  teams: [],          // [{ id, name, color, password, assets:{engine,principal,driver1,driver2,reserve,aero,strategist,pitcrew} (asset IDs or null) }]
  prices: {},         // assetId -> price (admin-set, falls back to default)
  fpData: null,       // { weatherId, byDriver:[{teamId,slot,driverId,stints:[{compound,laps,avg,best,deg,std}]}], generatedAt }
  ui: { filterType:'all', selectedAnalyticsTeam:null, qualWeather:'dry', tradeA:null, tradeB:null, tradeASelected:[], tradeBSelected:[] },
  race: { running:false, paused:false, speedKey:'1x', interval:null, state:null },
};


/* ─── 5. PERSISTENCE ───────────────────────────────────────── */
const LS_KEY = 'f1mun_v3';

function saveState() {
  try {
    const snap = {
      auth: APP.auth, session: APP.session, season: APP.season,
      champ: APP.champ, teams: APP.teams, prices: APP.prices,
      fpData: APP.fpData, ASSET_DB,
    };
    localStorage.setItem(LS_KEY, JSON.stringify(snap));
  } catch (e) { console.warn('Save failed:', e); }
}

function loadState() {
  // Embedded state from package always wins over localStorage
  let src = null;
  if (EMBEDDED_STATE) src = EMBEDDED_STATE;
  else {
    try { const s = localStorage.getItem(LS_KEY); if (s) src = JSON.parse(s); } catch(e){}
  }
  if (!src) return;
  if (src.auth)    APP.auth    = { ...APP.auth, ...src.auth };
  if (src.season)  APP.season  = { ...APP.season, ...src.season };
  if (src.champ)   APP.champ   = src.champ;
  if (src.teams)   APP.teams   = src.teams;
  if (src.prices)  APP.prices  = src.prices;
  if (src.fpData)  APP.fpData  = src.fpData;
  if (src.ASSET_DB && Object.values(src.ASSET_DB).some(a => a.length)) ASSET_DB = src.ASSET_DB;
  // Migrate any stale full-object asset references → IDs
  APP.teams.forEach(t => {
    if (!t.assets) t.assets = blankSlots();
    SLOT_ORDER.forEach(s => {
      if (t.assets[s] && typeof t.assets[s] === 'object') t.assets[s] = t.assets[s].id;
    });
  });
}


/* ─── 6. UTILITIES ─────────────────────────────────────────── */
function rand(a, b) { return Math.random() * (b - a) + a; }
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
  return `${m}:${s.toFixed(3).padStart(6, '0')}`;
}
function fmtGap(secs) {
  if (!isFinite(secs)) return '—';
  if (Math.abs(secs) < 1) return secs >= 0 ? `+${secs.toFixed(3)}` : secs.toFixed(3);
  return secs >= 0 ? `+${secs.toFixed(3)}` : secs.toFixed(3);
}
function escHtml(s) {
  return String(s ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
}
function blankSlots() {
  return { engine:null, principal:null, driver1:null, driver2:null, reserve:null, aero:null, strategist:null, pitcrew:null };
}
function uid(prefix = 'id') {
  return prefix + '_' + Math.random().toString(36).slice(2, 10);
}
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
function allAssets() {
  return Object.values(ASSET_DB).flat();
}
function ovr(asset) {
  if (!asset?.ratings) return 0;
  const v = Object.values(asset.ratings).filter(n => typeof n === 'number');
  if (!v.length) return 0;
  return Math.round(v.reduce((a, b) => a + b, 0) / v.length);
}
function priceOf(assetId) {
  if (assetId == null) return 0;
  if (assetId in APP.prices) return APP.prices[assetId];
  const a = getAsset(assetId);
  return a?.price ?? 0;
}
function teamSpent(team) {
  if (!team) return 0;
  return SLOT_ORDER.reduce((sum, s) => sum + (team.assets[s] ? priceOf(team.assets[s]) : 0), 0);
}
function teamComplete(team) {
  const a = team.assets;
  return !!(a.engine && a.principal && a.driver1 && a.driver2 && a.aero && a.strategist && a.pitcrew);
}
function teamOvr(team) {
  const ids = SLOT_ORDER.filter(s => s !== 'reserve').map(s => team.assets[s]).filter(Boolean);
  if (!ids.length) return null;
  const all = ids.flatMap(id => {
    const a = getAsset(id);
    return a ? Object.values(a.ratings).filter(n => typeof n === 'number') : [];
  });
  if (!all.length) return null;
  return Math.round(all.reduce((a, b) => a + b, 0) / all.length);
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


/* ─── 7. AUTHENTICATION ────────────────────────────────────── */
function attemptLogin() {
  const pw = document.getElementById('login-pw').value.trim();
  if (!pw) { showLoginError('Enter your access code'); return; }

  // Admin
  if (pw === APP.auth.adminPw) {
    APP.session = { role:'admin', teamId:null };
    enterApp(); return;
  }
  // Team-specific password
  const teamMatch = APP.teams.find(t => t.password && t.password === pw);
  if (teamMatch) {
    APP.session = { role:'user', teamId: teamMatch.id };
    enterApp(); return;
  }
  // Shared user password → team picker
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
  document.getElementById('login-pw-section').hidden = true;
  document.getElementById('login-team-section').hidden = false;
  const grid = document.getElementById('team-select-grid');
  grid.innerHTML = APP.teams.map(t => `
    <button class="team-login-btn" style="--tc:${escHtml(t.color)}" data-team-id="${t.id}">
      <span class="team-login-dot"></span>
      <span>${escHtml(t.name)}</span>
    </button>
  `).join('');
  grid.querySelectorAll('.team-login-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      APP.session.teamId = btn.dataset.teamId;
      enterApp();
    });
  });
}

function showLoginPw() {
  document.getElementById('login-pw-section').hidden = false;
  document.getElementById('login-team-section').hidden = true;
  document.getElementById('login-pw').value = '';
  document.getElementById('login-pw').focus();
}

function enterApp() {
  document.getElementById('screen-login').hidden = true;
  document.getElementById('screen-app').hidden = false;
  buildNav();
  showPage('dashboard');
  updateSidebar();
}

function logout() {
  if (APP.race.running && APP.race.interval) {
    clearTimeout(APP.race.interval);
    APP.race.running = false;
  }
  APP.session = { role:null, teamId:null };
  document.getElementById('screen-app').hidden = true;
  document.getElementById('screen-login').hidden = false;
  document.getElementById('login-pw').value = '';
  document.getElementById('login-error').classList.remove('show');
  showLoginPw();
}


/* ─── 8. NAVIGATION ────────────────────────────────────────── */
const ADMIN_TABS = [
  { id:'dashboard',    label:'Dashboard' },
  { id:'assets',       label:'Assets' },
  { id:'teams',        label:'Teams' },
  { id:'season',       label:'Season' },
  { id:'fp',           label:'Practice' },
  { id:'qualifying',   label:'Qualifying' },
  { id:'race',         label:'Race' },
  { id:'results',      label:'Results' },
  { id:'championship', label:'Championship' },
  { id:'analytics',    label:'Analytics' },
  { id:'trade',        label:'Trade Desk' },
  { id:'admin',        label:'Admin ⚙' },
];
const USER_TABS = [
  { id:'dashboard',    label:'Dashboard' },
  { id:'results',      label:'Results' },
  { id:'championship', label:'Championship' },
  { id:'analytics',    label:'Analytics' },
  { id:'trade',        label:'Trade Desk' },
];

function buildNav() {
  const isAdmin = APP.session.role === 'admin';
  const tabs = isAdmin ? ADMIN_TABS : USER_TABS;
  const nav = document.getElementById('nav-tabs');
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
      ? `<span style="font-weight:600;font-size:12px;color:${escHtml(team.color)};">${escHtml(team.name)}</span>`
      : `<span class="text-muted">Delegate</span>`;
  }
  updateRoundBadge();
}

const PAGE_RENDERERS = {
  dashboard: renderDashboard,
  assets: renderAssets,
  teams: renderTeams,
  season: renderSeason,
  fp: renderFP,
  qualifying: renderQual,
  race: renderRace,
  results: renderResults,
  championship: renderChampionship,
  analytics: renderAnalytics,
  trade: renderTrade,
  admin: renderAdmin,
};

function showPage(name) {
  const adminOnly = ['assets','teams','season','fp','qualifying','race','admin'];
  if (APP.session.role !== 'admin' && adminOnly.includes(name)) {
    notify('Admin access required', 'error'); return;
  }
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
  const page = document.getElementById('page-' + name);
  const tab = document.querySelector(`.nav-tab[data-page="${name}"]`);
  if (page) page.classList.add('active');
  if (tab) tab.classList.add('active');
  PAGE_RENDERERS[name]?.();
}

function updateRoundBadge() {
  const el = document.getElementById('nav-round-badge');
  if (!APP.season.started) { el.textContent = 'Pre-Season'; return; }
  const total = APP.season.calendar.length;
  const done = APP.season.calendar.filter(r => r.completed).length;
  el.textContent = done >= total
    ? `Season Complete · ${total}/${total}`
    : `Round ${APP.season.currentRound} / ${total}`;
}

function updateSidebar() {
  // Constructors leaderboard
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
      <span class="lb-pos">${i + 1}</span>
      <span class="lb-dot"></span>
      <span class="lb-name">${escHtml(t.name)}</span>
      <span class="lb-pts">${pts}</span>${gap}
    </div>`;
  }).join('') : '<div class="sb-empty">No teams yet</div>';
  document.getElementById('lb-constructors').innerHTML = lbHtml;

  // Race history
  const completed = APP.season.calendar.filter(r => r.completed);
  const histHtml = completed.length ? completed.map((r, i) => {
    const t = TRACKS.find(x => x.id === r.trackId);
    const top3 = (r.raceResults?.classification || []).slice(0, 3);
    return `<div class="sb-history-block">
      <div class="sb-history-title">R${i + 1} ${t?.flag || ''} ${escHtml(t?.name || '')}</div>
      ${top3.map((c, j) => `<div class="sb-history-row">
        <span class="pos">${j + 1}.</span>
        <span class="dot" style="background:${escHtml(c.teamColor)}"></span>
        <span class="truncate">${escHtml(c.driverName)}</span>
        <span class="pts">+${c.points || 0}</span>
      </div>`).join('')}
    </div>`;
  }).join('') : '<div class="sb-empty">No races yet</div>';
  document.getElementById('lb-history').innerHTML = histHtml;
}


/* ─── 9. CSV IMPORT ────────────────────────────────────────── */
function parseCSV(text) {
  const lines = text.replace(/\r\n?/g, '\n').trim().split('\n').filter(l => l.trim());
  if (!lines.length) return [];
  const headers = splitCSVLine(lines[0]);
  return lines.slice(1).map(line => {
    const vals = splitCSVLine(line);
    const obj = {};
    headers.forEach((h, i) => { obj[h.trim()] = (vals[i] ?? '').trim(); });
    return obj;
  });
}

function splitCSVLine(line) {
  // Handles quoted fields with commas inside them
  const out = [];
  let cur = '', inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (inQuotes) {
      if (c === '"' && line[i + 1] === '"') { cur += '"'; i++; }
      else if (c === '"') inQuotes = false;
      else cur += c;
    } else {
      if (c === ',') { out.push(cur); cur = ''; }
      else if (c === '"') inQuotes = true;
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
  };
  const newDB = { engines:[], principals:[], drivers:[], aero:[], strategists:[], pitstops:[] };
  rows.forEach(r => {
    const cat = typeMap[r.Type];
    if (!cat || !r.ID || !r.Name) return;
    const ratings = {};
    for (let i = 1; i <= 6; i++) {
      const sn = r[`S${i}`];
      const sv = parseFloat(r[`V${i}`]);
      if (sn && !isNaN(sv)) ratings[sn] = sv;
    }
    newDB[cat].push({
      id: r.ID, name: r.Name, nat: r.Nationality || '',
      ratings, price: parseFloat(r.Price) || 0,
      desc: r.Description || '',
    });
  });
  // Replace only categories that have data — preserves any partial uploads
  Object.keys(newDB).forEach(k => { if (newDB[k].length) ASSET_DB[k] = newDB[k]; });
  // Clear assignments and prices since identifiers may have shifted
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
    catch (err) { notify('CSV parse failed: ' + err.message, 'error'); }
  };
  reader.readAsText(file);
}

async function importFromSheets() {
  let url = document.getElementById('sheets-url').value.trim();
  if (!url) { notify('Enter a Google Sheets CSV URL', 'warn'); return; }
  // Auto-convert /edit URL to /export?format=csv
  if (url.includes('/edit') && !url.includes('/export')) {
    url = url.replace(/\/edit.*$/, '/export?format=csv');
  }
  try {
    notify('Fetching CSV…', 'blue');
    const r = await fetch(url);
    if (!r.ok) throw new Error('HTTP ' + r.status);
    const text = await r.text();
    applyCSVRows(parseCSV(text));
  } catch (err) {
    notify('Could not fetch URL. Try the file import instead.', 'error');
    console.warn(err);
  }
}

function resetAssets() {
  openModal({
    title: 'Reset Assets?',
    body: '<div class="text-sm">This will clear ALL imported assets and team assignments. Continue?</div>',
    actions: [
      { label:'Cancel', cls:'btn-ghost', onClick: closeModal },
      { label:'Reset', cls:'btn-red', onClick: () => {
        ASSET_DB = { engines:[], principals:[], drivers:[], aero:[], strategists:[], pitstops:[] };
        APP.teams.forEach(t => { t.assets = blankSlots(); });
        APP.prices = {};
        saveState();
        closeModal();
        renderAssets();
        notify('Assets cleared', 'warn');
      }},
    ],
  });
}


/* ─── 10. DASHBOARD ────────────────────────────────────────── */
function renderDashboard() {
  const isAdmin = APP.session.role === 'admin';
  const completeTeams = APP.teams.filter(teamComplete);
  const nextRace = APP.season.calendar.find(r => !r.completed);
  const nextTrack = nextRace ? TRACKS.find(t => t.id === nextRace.trackId) : null;

  const sortedC = Object.entries(APP.champ.constructors).sort((a, b) => b[1].points - a[1].points);
  const sortedD = Object.entries(APP.champ.drivers).sort((a, b) => b[1].points - a[1].points);
  const constLeader = sortedC[0]?.[1];
  const drvLeader = sortedD[0]?.[1];
  const totalAssets = allAssets().length;

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
        <button class="btn btn-red" data-go="qualifying">5. Start Qualifying →</button>
      </div>
    </div>` : '';

  document.getElementById('dashboard-content').innerHTML = `
    <div class="dashboard-hero">
      <div class="hero-round">${APP.season.started ? `ROUND ${APP.season.currentRound} / ${APP.season.calendar.length}` : 'PRE-SEASON'}</div>
      <div class="hero-title">${escHtml(APP.season.name)}</div>
      <div class="hero-sub">${nextTrack ? `Next race: ${nextTrack.flag} ${escHtml(nextTrack.name)} Grand Prix` : (APP.season.started ? 'Season complete' : 'Configure season to begin')}</div>
    </div>
    <div class="stat-overview-grid">
      <div class="stat-overview-card">
        <div class="stat-overview-label">Teams</div>
        <div class="stat-overview-val">${completeTeams.length}</div>
        <div class="stat-overview-sub">${APP.teams.length} total · ${completeTeams.length} ready</div>
      </div>
      <div class="stat-overview-card">
        <div class="stat-overview-label">Races Done</div>
        <div class="stat-overview-val">${APP.season.calendar.filter(r => r.completed).length}</div>
        <div class="stat-overview-sub">of ${APP.season.calendar.length} scheduled</div>
      </div>
      <div class="stat-overview-card">
        <div class="stat-overview-label">Constructors Leader</div>
        <div class="stat-overview-val" style="font-size:16px;color:var(--gold);">${constLeader ? escHtml(constLeader.name) : '—'}</div>
        <div class="stat-overview-sub">${constLeader ? constLeader.points + ' pts' : 'No data'}</div>
      </div>
      <div class="stat-overview-card">
        <div class="stat-overview-label">Drivers Leader</div>
        <div class="stat-overview-val" style="font-size:16px;color:var(--green);">${drvLeader ? escHtml(drvLeader.name) : '—'}</div>
        <div class="stat-overview-sub">${drvLeader ? drvLeader.points + ' pts' : 'No data'}</div>
      </div>
      <div class="stat-overview-card">
        <div class="stat-overview-label">Practice</div>
        <div class="stat-overview-val" style="font-size:16px;">${APP.fpData ? '✅ Done' : '⏳ Pending'}</div>
        <div class="stat-overview-sub">${APP.fpData ? 'Report ready' : 'Run before quali'}</div>
      </div>
      <div class="stat-overview-card">
        <div class="stat-overview-label">Asset Pool</div>
        <div class="stat-overview-val" style="font-size:16px;">${totalAssets}</div>
        <div class="stat-overview-sub">${totalAssets ? 'Loaded' : 'Import CSV'}</div>
      </div>
    </div>
    ${condCards}
    ${adminGuide}
  `;
  document.querySelectorAll('[data-go]').forEach(b =>
    b.addEventListener('click', () => showPage(b.dataset.go)));
}


/* ─── 11. ASSETS PAGE ──────────────────────────────────────── */
function renderAssets() {
  const types = ['all','engines','principals','drivers','aero','strategists','pitstops'];
  const labels = { all:'All', engines:'Engines', principals:'Principals', drivers:'Drivers', aero:'Aero', strategists:'Strategists', pitstops:'Pit Crews' };
  const counts = Object.fromEntries(Object.entries(ASSET_DB).map(([k, v]) => [k, v.length]));

  document.getElementById('asset-filter-bar').innerHTML = types.map(t => {
    const count = t === 'all' ? allAssets().length : (counts[t] || 0);
    return `<button class="filter-pill ${APP.ui.filterType === t ? 'active' : ''}" data-filter="${t}">${labels[t]} ${count ? `· ${count}` : ''}</button>`;
  }).join('');
  document.querySelectorAll('#asset-filter-bar .filter-pill').forEach(b => {
    b.addEventListener('click', () => { APP.ui.filterType = b.dataset.filter; renderAssets(); });
  });

  const grid = document.getElementById('asset-grid');
  const isAdmin = APP.session.role === 'admin';
  const list = APP.ui.filterType === 'all' ? allAssets() : (ASSET_DB[APP.ui.filterType] || []);

  if (!list.length) {
    grid.innerHTML = `<div class="card" style="grid-column:1/-1;text-align:center;padding:40px;">
      <div class="card-title">No assets loaded</div>
      <div class="text-sm text-muted">Import your CSV to populate the asset registry.</div>
    </div>`;
    return;
  }

  grid.innerHTML = list.map(a => {
    const cat = assetCategory(a.id);
    const tc = TYPE_COLORS[cat] || '#888';
    const assigned = isAssigned(a.id);
    const owner = assigned ? teamOf(a.id) : null;
    return `<div class="asset-card ${assigned ? 'assigned' : ''}" style="--tc:${tc}">
      <div class="asset-type-tag">${TYPE_LABELS[cat] || cat}</div>
      <div class="asset-name">${escHtml(a.name)}</div>
      <div class="asset-nat">${escHtml(a.nat || '')}</div>
      <div class="asset-ovr"><span class="ovr-num">${ovr(a)}</span><span class="ovr-lbl">OVR</span></div>
      <div class="asset-price">
        <span class="text-xs text-muted">Price:</span>
        ${isAdmin
          ? `<input type="number" class="price-input" value="${priceOf(a.id)}" data-asset-id="${a.id}" />`
          : `<span class="mono text-gold fw-700">$${priceOf(a.id)}M</span>`}
      </div>
      ${assigned ? `<div class="asset-assigned-badge">→ ${escHtml(owner?.name || 'Assigned')}</div>` : ''}
      ${a.desc ? `<div class="asset-desc">${escHtml(a.desc)}</div>` : ''}
    </div>`;
  }).join('');
  grid.querySelectorAll('.price-input').forEach(inp => {
    inp.addEventListener('change', () => {
      const v = parseFloat(inp.value);
      if (!isNaN(v) && v >= 0) {
        APP.prices[inp.dataset.assetId] = v;
        saveState();
        notify(`Price updated: $${v}M`, 'success');
      }
    });
  });
}


/* ─── 12. TEAMS PAGE ───────────────────────────────────────── */
function createTeam() {
  const name = document.getElementById('new-team-name').value.trim();
  const color = document.getElementById('new-team-color').value;
  const password = document.getElementById('new-team-pw').value.trim();
  if (!name) { notify('Enter a team name', 'warn'); return; }
  if (APP.season.started) { notify('Season locked — cannot add teams', 'error'); return; }
  APP.teams.push({
    id: uid('team'),
    name, color,
    password: password || null,
    assets: blankSlots(),
  });
  document.getElementById('new-team-name').value = '';
  document.getElementById('new-team-pw').value = '';
  saveState();
  renderTeams();
  updateSidebar();
  notify(`Team "${name}" created`, 'success');
}

function deleteTeam(teamId) {
  const t = APP.teams.find(x => x.id === teamId);
  if (!t) return;
  if (APP.season.started) { notify('Season locked', 'error'); return; }
  openModal({
    title:`Delete "${t.name}"?`,
    body:`<div class="text-sm">This will release all of their assets back to the pool.</div>`,
    actions:[
      { label:'Cancel', cls:'btn-ghost', onClick: closeModal },
      { label:'Delete', cls:'btn-red', onClick:() => {
        APP.teams = APP.teams.filter(x => x.id !== teamId);
        saveState(); closeModal(); renderTeams(); updateSidebar();
        notify('Team deleted', 'warn');
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
  const isAdmin = APP.session.role === 'admin';
  grid.innerHTML = APP.teams.map(t => {
    const tovr = teamOvr(t);
    const spent = teamSpent(t);
    const ready = teamComplete(t);
    const slotsHtml = SLOT_ORDER.map(slot => {
      const assetId = t.assets[slot];
      const a = getAsset(assetId);
      const isReserve = slot === 'reserve';
      return `<div class="slot-row ${isReserve ? 'slot-reserve' : ''}">
        <span class="slot-label">${SLOT_LABELS[slot]}</span>
        ${a
          ? `<span class="slot-fill">${escHtml(a.name)}</span>
             <span class="slot-ovr">OVR ${ovr(a)}</span>
             ${isAdmin ? `<button class="slot-remove" data-team="${t.id}" data-slot="${slot}">×</button>` : ''}`
          : `<span class="slot-empty">— empty —</span>
             ${isAdmin ? `<button class="slot-assign" data-team="${t.id}" data-slot="${slot}">+ assign</button>` : ''}`
        }
      </div>`;
    }).join('');
    return `<div class="team-card" style="--tc:${escHtml(t.color)}">
      <div class="team-head">
        <span class="team-dot"></span>
        <span class="team-name">${escHtml(t.name)}</span>
        ${tovr != null ? `<span class="team-ovr">OVR ${tovr}</span>` : ''}
        <span class="team-spent">$${spent}M</span>
        ${ready ? '<span class="tag tag-ready">Ready</span>' : '<span class="tag tag-incomplete">Incomplete</span>'}
        ${isAdmin && !APP.season.started ? `<div class="team-actions"><button class="btn btn-ghost btn-xs" data-del-team="${t.id}">Delete</button></div>` : ''}
      </div>
      <div class="slot-grid">${slotsHtml}</div>
    </div>`;
  }).join('');
  grid.querySelectorAll('.slot-assign').forEach(b =>
    b.addEventListener('click', () => openAssignModal(b.dataset.team, b.dataset.slot)));
  grid.querySelectorAll('.slot-remove').forEach(b =>
    b.addEventListener('click', () => removeFromSlot(b.dataset.team, b.dataset.slot)));
  grid.querySelectorAll('[data-del-team]').forEach(b =>
    b.addEventListener('click', () => deleteTeam(b.dataset.delTeam)));
}

function openAssignModal(teamId, slot) {
  const team = APP.teams.find(t => t.id === teamId);
  if (!team) return;
  const cat = SLOT_TO_TYPE[slot];
  const pool = ASSET_DB[cat] || [];
  const available = pool.filter(a => !isAssigned(a.id));
  if (!available.length) {
    notify(`No ${TYPE_LABELS[cat] || cat} available`, 'warn');
    return;
  }
  const sorted = [...available].sort((a, b) => ovr(b) - ovr(a));
  openModal({
    title:`Assign ${SLOT_LABELS[slot]} → ${team.name}`,
    body:`<div class="modal-list">
      ${sorted.map(a => `<div class="modal-list-item" data-assign="${a.id}">
        <div class="flex-1">
          <div class="fw-700 text-sm">${escHtml(a.name)}</div>
          <div class="text-xs text-muted">${escHtml(a.nat || '')}</div>
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
  notify('Assigned', 'success');
}

function removeFromSlot(teamId, slot) {
  if (APP.season.started) { notify('Season locked — use Admin → Driver Swap to change drivers', 'warn'); return; }
  const team = APP.teams.find(t => t.id === teamId);
  if (!team) return;
  team.assets[slot] = null;
  saveState(); renderTeams(); updateSidebar();
}


/* ─── 13. SEASON PAGE ──────────────────────────────────────── */
function renderSeason() {
  // Season name
  document.getElementById('season-name-input').value = APP.season.name;

  // Round count: show calendar length if started, else stored count or default 5
  const rounds = APP.season.started
    ? APP.season.calendar.length
    : (APP.season.selectedTrackIds.length || 5);
  document.getElementById('season-rounds').value = rounds;

  // Lock/unlock buttons
  document.getElementById('lock-season-btn').hidden = APP.season.started;
  document.getElementById('unlock-season-btn').hidden = !APP.season.started;

  renderTrackGrid();
  updateCalendarPreview();
}

function renderTrackGrid() {
  const grid = document.getElementById('season-track-grid');
  grid.innerHTML = TRACKS.map(t => {
    const active = APP.season.selectedTrackIds.includes(t.id);
    return `<div class="track-card ${active ? 'active' : ''}" data-track="${t.id}">
      <div class="track-flag">${t.flag}</div>
      <div class="track-name">${escHtml(t.name)}</div>
      <div class="track-type">${escHtml(t.type)}</div>
    </div>`;
  }).join('');
  grid.querySelectorAll('[data-track]').forEach(c =>
    c.addEventListener('click', () => toggleTrackInCalendar(c.dataset.track)));
}

function toggleTrackInCalendar(trackId) {
  if (APP.season.started) { notify('Season locked', 'warn'); return; }
  const idx = APP.season.selectedTrackIds.indexOf(trackId);
  if (idx >= 0) APP.season.selectedTrackIds.splice(idx, 1);
  else APP.season.selectedTrackIds.push(trackId);
  document.getElementById('season-rounds').value = APP.season.selectedTrackIds.length || 1;
  renderTrackGrid();
  updateCalendarPreview();
}

function updateCalendarPreview() {
  const target = parseInt(document.getElementById('season-rounds').value, 10) || 0;
  let chosen = [...APP.season.selectedTrackIds];
  // Pad with sequential tracks if user picked fewer than they want
  if (chosen.length < target) {
    TRACKS.forEach(t => { if (!chosen.includes(t.id) && chosen.length < target) chosen.push(t.id); });
  }
  // Trim if they picked more than they want
  if (chosen.length > target) chosen = chosen.slice(0, target);

  const preview = document.getElementById('calendar-preview');
  preview.innerHTML = chosen.map((trackId, i) => {
    const t = TRACKS.find(x => x.id === trackId);
    if (!t) return '';
    const r = APP.season.calendar[i];
    const status = r?.completed ? 'cal-done'
      : (APP.season.currentRound === i + 1 ? 'cal-current' : 'cal-pending');
    const statusText = r?.completed ? 'Complete' : (APP.season.currentRound === i + 1 ? 'Current' : 'Pending');
    return `<div class="calendar-race">
      <span class="cal-round">R${i + 1}</span>
      <span class="cal-flag">${t.flag}</span>
      <span class="cal-name">${escHtml(t.name)}</span>
      <span class="cal-status ${status}">${statusText}</span>
    </div>`;
  }).join('') || '<div class="text-sm text-dim">No tracks selected</div>';
}

function lockSeason() {
  const completeTeams = APP.teams.filter(teamComplete);
  if (completeTeams.length < 2) { notify('Need at least 2 complete teams', 'error'); return; }
  const target = parseInt(document.getElementById('season-rounds').value, 10) || 0;
  if (target < 1) { notify('Select at least 1 race', 'error'); return; }

  let chosen = [...APP.season.selectedTrackIds];
  if (chosen.length < target) {
    TRACKS.forEach(t => { if (!chosen.includes(t.id) && chosen.length < target) chosen.push(t.id); });
  }
  chosen = chosen.slice(0, target);

  APP.season.name = document.getElementById('season-name-input').value.trim() || APP.season.name;
  APP.season.calendar = chosen.map(tid => ({
    trackId: tid, weatherId:'dry',
    qualResults:null, raceResults:null, completed:false,
  }));
  APP.season.selectedTrackIds = chosen;
  APP.season.started = true;
  APP.season.currentRound = 1;
  initChampionship();
  saveState();
  renderSeason();
  updateSidebar();
  updateRoundBadge();
  notify('🔒 Season locked. Run Free Practice next.', 'success');
}

function unlockSeason() {
  if (APP.season.calendar.some(r => r.completed)) {
    notify('Cannot unlock — races already completed. Use Admin → Reset Season instead.', 'error');
    return;
  }
  openModal({
    title:'Unlock season?',
    body:'<div class="text-sm">Allows team and asset edits. Calendar will be preserved.</div>',
    actions:[
      { label:'Cancel', cls:'btn-ghost', onClick:closeModal },
      { label:'Unlock', cls:'btn-red', onClick:() => {
        APP.season.started = false;
        APP.season.currentRound = 0;
        saveState(); closeModal(); renderSeason(); updateRoundBadge();
        notify('Season unlocked', 'warn');
      }},
    ],
  });
}

function initChampionship() {
  APP.champ = { drivers:{}, constructors:{} };
  APP.teams.filter(teamComplete).forEach(t => {
    APP.champ.constructors[t.id] = {
      name: t.name, color: t.color,
      points:0, wins:0, podiums:0, history:[],
    };
    ['driver1','driver2'].forEach(slot => {
      const d = getAsset(t.assets[slot]);
      if (!d) return;
      APP.champ.drivers[driverKey(t.id, slot)] = {
        name: d.name, teamId: t.id, teamName: t.name, teamColor: t.color,
        slot, driverId: d.id,
        points:0, wins:0, podiums:0, poles:0, fl:0, dnfs:0, history:[],
      };
    });
  });
}


/* ─── 14. FREE PRACTICE ────────────────────────────────────── */
function renderFP() {
  const root = document.getElementById('fp-content');
  if (!APP.season.started) {
    root.innerHTML = `<div class="card"><div class="text-sm text-muted">Lock the season first to enable Free Practice.</div></div>`;
    return;
  }
  if (!APP.fpData) {
    root.innerHTML = `
      <div class="card">
        <div class="card-title">Pre-Season Free Practice</div>
        <div class="text-sm text-muted mb-12">
          One session covering 3 stints (Soft / Medium / Hard) per driver on a balanced reference circuit.
          Generates a full performance and tyre report — drivers and chairs use this to inform strategy
          before qualifying begins.
        </div>
        <button class="btn btn-red" id="fp-run-btn">▶ Run Free Practice Session</button>
      </div>`;
    document.getElementById('fp-run-btn').addEventListener('click', runFP);
    return;
  }
  renderFPReport();
}

function runFP() {
  const completeTeams = APP.teams.filter(teamComplete);
  if (!completeTeams.length) { notify('No complete teams', 'error'); return; }

  // Reference track: use a balanced circuit for pure relative pace
  const refTrack = TRACKS.find(t => t.type === 'Balanced') || TRACKS[5];
  const weather  = WEATHER_OPTIONS[0]; // Dry baseline

  const byDriver = [];
  completeTeams.forEach(team => {
    ['driver1','driver2'].forEach(slot => {
      const driverAsset = getAsset(team.assets[slot]);
      if (!driverAsset) return;
      const drvScore = computeDriverScore(driverAsset, refTrack, weather);
      const carScore = computeCarScore(team, refTrack, weather);
      const totalScore = drvScore * 0.42 + carScore * 0.58;
      const baseLap = refTrack.baseLap + (95 - totalScore) * 0.18;
      const consistency = driverAsset.ratings.Consistency || 80;
      const sigma = (100 - consistency) / 70;

      const stints = [];
      [['S', 5], ['M', 8], ['H', 10]].forEach(([compound, laps]) => {
        const tire = TIRE_COMPOUNDS[compound];
        const stint = { compound, name: tire.name, laps, lapTimes:[] };
        for (let i = 0; i < laps; i++) {
          const tireOffset = tire.pace + Math.max(0, i - 2) * tire.deg;
          const noise = gaussRand(0, sigma);
          stint.lapTimes.push(baseLap + tireOffset + noise);
        }
        stint.avg  = stint.lapTimes.reduce((a, b) => a + b, 0) / stint.lapTimes.length;
        stint.best = Math.min(...stint.lapTimes);
        // Std deviation
        const mean = stint.avg;
        const variance = stint.lapTimes.reduce((s, t) => s + (t - mean) ** 2, 0) / stint.lapTimes.length;
        stint.std = Math.sqrt(variance);
        // Degradation slope (sec / lap)
        if (stint.lapTimes.length >= 2) {
          const last = stint.lapTimes[stint.lapTimes.length - 1];
          const first = stint.lapTimes[0];
          stint.deg = (last - first) / (stint.lapTimes.length - 1);
        } else stint.deg = 0;
        stints.push(stint);
      });

      byDriver.push({
        teamId: team.id, teamName: team.name, teamColor: team.color,
        slot, driverId: driverAsset.id, driverName: driverAsset.name,
        carScore, drvScore, totalScore, consistency,
        stints,
      });
    });
  });

  APP.fpData = {
    weatherId: weather.id, refTrackId: refTrack.id,
    byDriver, generatedAt: new Date().toISOString(),
  };
  APP.season.fpDone = true;
  saveState();
  renderFPReport();
  notify('Free Practice complete — report ready', 'success');
}

function renderFPReport() {
  const data = APP.fpData;
  const refTrack = TRACKS.find(t => t.id === data.refTrackId) || TRACKS[5];
  const sorted = [...data.byDriver].sort((a, b) => {
    const ba = Math.min(...a.stints.flatMap(s => s.lapTimes));
    const bb = Math.min(...b.stints.flatMap(s => s.lapTimes));
    return ba - bb;
  });
  const fastestOverall = Math.min(...sorted.flatMap(d => d.stints.flatMap(s => s.lapTimes)));

  // Pace ranking
  const paceRows = sorted.map((d, i) => {
    const best = Math.min(...d.stints.flatMap(s => s.lapTimes));
    const gap  = best - fastestOverall;
    const grade = gradeFromScore(d.totalScore);
    return `<tr>
      <td class="champ-pos">${i + 1}</td>
      <td><span class="champ-dot" style="background:${escHtml(d.teamColor)}"></span>${escHtml(d.driverName)}</td>
      <td class="text-muted">${escHtml(d.teamName)}</td>
      <td class="mono">${fmtTime(best)}</td>
      <td class="mono text-dim">${i === 0 ? '—' : '+' + gap.toFixed(3)}</td>
      <td><span class="perf-grade ${grade.css}">${grade.g}</span></td>
    </tr>`;
  }).join('');

  // Tyre performance summary
  const tyreSummary = ['S','M','H'].map(c => {
    const stints = data.byDriver.flatMap(d => d.stints.filter(s => s.compound === c));
    if (!stints.length) return '';
    const avg = stints.reduce((a, s) => a + s.avg, 0) / stints.length;
    const deg = stints.reduce((a, s) => a + s.deg, 0) / stints.length;
    const best = Math.min(...stints.map(s => s.best));
    const tire = TIRE_COMPOUNDS[c];
    return `<div class="card-sm card">
      <div class="card-title"><span class="tire-badge ${tire.css}">${c}</span> &nbsp; ${tire.name}</div>
      <div class="stat-row"><span class="stat-label">Best Lap</span><span class="stat-val mono">${fmtTime(best)}</span></div>
      <div class="stat-row"><span class="stat-label">Avg Pace</span><span class="stat-val mono">${fmtTime(avg)}</span></div>
      <div class="stat-row"><span class="stat-label">Degradation</span><span class="stat-val mono">${(deg * 1000).toFixed(0)} ms / lap</span></div>
      <div class="stat-row"><span class="stat-label">Stint Length</span><span class="stat-val mono">~${stints[0].laps} laps</span></div>
    </div>`;
  }).join('');

  // Per-driver detailed breakdown
  const detailed = sorted.map(d => {
    const stintCells = d.stints.map(s => {
      const tire = TIRE_COMPOUNDS[s.compound];
      return `<td>
        <span class="tire-badge ${tire.css}">${s.compound}</span>
        <div class="text-xs mono">${fmtTime(s.best)}</div>
        <div class="text-xs text-dim mono">σ ${(s.std * 1000).toFixed(0)}ms</div>
        <div class="text-xs text-dim mono">deg ${(s.deg * 1000).toFixed(0)}ms</div>
      </td>`;
    }).join('');
    return `<tr>
      <td><span class="champ-dot" style="background:${escHtml(d.teamColor)}"></span>${escHtml(d.driverName)}</td>
      <td class="text-xs text-muted">${escHtml(d.teamName)}</td>
      ${stintCells}
      <td class="mono fw-700">${d.totalScore.toFixed(1)}</td>
    </tr>`;
  }).join('');

  // Insights
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
      <div class="card-title">Key Insights</div>
      ${insights}
    </div>
  `;
  document.getElementById('fp-print-btn').addEventListener('click', printFPReport);
  document.getElementById('fp-rerun-btn').addEventListener('click', () => {
    if (confirm('Re-run Free Practice? Current report will be overwritten.')) runFP();
  });
}

function generateFPInsights(data) {
  const teams = {};
  data.byDriver.forEach(d => {
    if (!teams[d.teamId]) teams[d.teamId] = { name: d.teamName, color: d.teamColor, drivers: [] };
    teams[d.teamId].drivers.push(d);
  });
  const lines = [];

  // Constructor pace gaps
  const teamPace = Object.entries(teams).map(([id, t]) => ({
    name: t.name, color: t.color,
    best: Math.min(...t.drivers.flatMap(d => d.stints.flatMap(s => s.lapTimes))),
  })).sort((a, b) => a.best - b.best);
  if (teamPace.length >= 2) {
    const fastest = teamPace[0], slowest = teamPace[teamPace.length - 1];
    lines.push(`<div class="stat-row">
      <span class="stat-label">Fastest team</span>
      <span class="stat-val"><span class="champ-dot" style="background:${escHtml(fastest.color)}"></span>${escHtml(fastest.name)} · ${fmtTime(fastest.best)}</span>
    </div>`);
    lines.push(`<div class="stat-row">
      <span class="stat-label">Field spread</span>
      <span class="stat-val mono">${(slowest.best - fastest.best).toFixed(3)}s</span>
    </div>`);
  }
  // Most consistent driver
  const consist = data.byDriver.map(d => ({
    name:d.driverName, color:d.teamColor,
    avgStd: d.stints.reduce((a,s) => a + s.std, 0) / d.stints.length,
  })).sort((a, b) => a.avgStd - b.avgStd);
  if (consist.length) {
    lines.push(`<div class="stat-row">
      <span class="stat-label">Most consistent</span>
      <span class="stat-val"><span class="champ-dot" style="background:${escHtml(consist[0].color)}"></span>${escHtml(consist[0].name)} · σ ${(consist[0].avgStd * 1000).toFixed(0)}ms</span>
    </div>`);
  }
  // Best tire degradation manager
  const degList = data.byDriver.map(d => {
    const totalDeg = d.stints.reduce((a, s) => a + Math.max(0, s.deg), 0) / d.stints.length;
    return { name:d.driverName, color:d.teamColor, deg: totalDeg };
  }).sort((a, b) => a.deg - b.deg);
  if (degList.length) {
    lines.push(`<div class="stat-row">
      <span class="stat-label">Best tyre management</span>
      <span class="stat-val"><span class="champ-dot" style="background:${escHtml(degList[0].color)}"></span>${escHtml(degList[0].name)} · ${(degList[0].deg * 1000).toFixed(0)}ms / lap</span>
    </div>`);
  }
  // Strategic recommendation
  const stintsBest = ['S','M','H'].map(c => {
    const all = data.byDriver.flatMap(d => d.stints.filter(s => s.compound === c));
    return { c, avgDeg: all.reduce((a, s) => a + s.deg, 0) / all.length, best: Math.min(...all.map(s => s.best)) };
  });
  const slowestDeg = stintsBest.sort((a, b) => b.avgDeg - a.avgDeg)[0];
  lines.push(`<div class="stat-row">
    <span class="stat-label">Strategic note</span>
    <span class="stat-val">${slowestDeg.c === 'S' ? 'Soft compound shows highest degradation — favour 2-stop strategies' : slowestDeg.c === 'H' ? 'Hard compound durable — long stints viable' : 'Medium tyres most balanced for race-day strategy'}</span>
  </div>`);
  return lines.join('');
}

function printFPReport() {
  const data = APP.fpData;
  if (!data) return;
  const refTrack = TRACKS.find(t => t.id === data.refTrackId);
  const sorted = [...data.byDriver].sort((a, b) => {
    const ba = Math.min(...a.stints.flatMap(s => s.lapTimes));
    const bb = Math.min(...b.stints.flatMap(s => s.lapTimes));
    return ba - bb;
  });
  const fastest = Math.min(...sorted.flatMap(d => d.stints.flatMap(s => s.lapTimes)));

  document.getElementById('print-view').innerHTML = `
    <div class="print-page">
      <div class="print-header">
        <div>
          <div class="print-title">Free Practice Report</div>
          <div class="print-subtitle">${escHtml(APP.season.name)} — Reference: ${refTrack?.name || ''}</div>
        </div>
        <div class="print-logo">F1 MUN</div>
      </div>
      <div class="print-section">
        <div class="print-section-title">Overall Pace Ranking</div>
        <table class="print-table">
          <thead><tr><th>Pos</th><th>Driver</th><th>Team</th><th>Best Lap</th><th>Gap</th><th>Avg Std Dev</th><th>Score</th></tr></thead>
          <tbody>${sorted.map((d, i) => {
            const best = Math.min(...d.stints.flatMap(s => s.lapTimes));
            const avgStd = d.stints.reduce((a, s) => a + s.std, 0) / d.stints.length;
            return `<tr>
              <td>${i + 1}</td><td>${escHtml(d.driverName)}</td><td>${escHtml(d.teamName)}</td>
              <td>${fmtTime(best)}</td><td>${i === 0 ? '—' : '+' + (best - fastest).toFixed(3)}</td>
              <td>${(avgStd * 1000).toFixed(0)} ms</td><td>${d.totalScore.toFixed(1)}</td>
            </tr>`;
          }).join('')}</tbody>
        </table>
      </div>
      <div class="print-section">
        <div class="print-section-title">Stint Breakdown by Driver</div>
        <table class="print-table">
          <thead><tr><th>Driver</th><th>Compound</th><th>Laps</th><th>Best</th><th>Avg</th><th>Deg (ms/lap)</th><th>Std (ms)</th></tr></thead>
          <tbody>${sorted.flatMap(d => d.stints.map(s => `<tr>
            <td>${escHtml(d.driverName)}</td><td>${s.name}</td><td>${s.laps}</td>
            <td>${fmtTime(s.best)}</td><td>${fmtTime(s.avg)}</td>
            <td>${(s.deg * 1000).toFixed(0)}</td><td>${(s.std * 1000).toFixed(0)}</td>
          </tr>`)).join('')}</tbody>
        </table>
      </div>
    </div>`;
  setTimeout(() => window.print(), 100);
}


/* ─── 15. SCORING ENGINE ───────────────────────────────────── */
/* Computes a 0-100 weighted score for the car (engine+aero+strategist+pitcrew+principal)
   and a 0-100 score for the driver, modulated by track characteristics + weather.   */

function computeCarScore(team, track, weather) {
  const eng = getAsset(team.assets.engine);
  const aero = getAsset(team.assets.aero);
  const strat = getAsset(team.assets.strategist);
  const pit = getAsset(team.assets.pitcrew);
  const prin = getAsset(team.assets.principal);
  if (!eng || !aero || !strat || !pit || !prin) return 60;

  const ch = track.ch;
  const w = weather.mods;

  // Engine: power weighted by track power dependency, plus reliability and deployment
  const engScore =
      (eng.ratings.Power || 80) * (0.35 * ch.power_dep / 100 + 0.15) * w.power
    + (eng.ratings.Reliability || 80) * 0.20 * w.reliability
    + (eng.ratings.Deployment || 80) * 0.15
    + (eng.ratings.Fuel_Eff || 80) * 0.10
    + (eng.ratings.Thermal || 80) * 0.05;

  // Aero: downforce weighted by track downforce dep, plus drag (inverse for high-speed)
  const isHighSpeed = ch.power_dep > 65;
  const aeroScore =
      (aero.ratings.Downforce || 80) * (0.30 * ch.downforce_dep / 100 + 0.10)
    + (aero.ratings.Drag || 80) * (isHighSpeed ? 0.20 : 0.10)
    + (aero.ratings.Street_Circuit || 80) * (track.type === 'Street' ? 0.20 : 0.05)
    + (aero.ratings.High_Speed || 80) * (isHighSpeed ? 0.18 : 0.08)
    + (aero.ratings.Balance || 80) * 0.12;

  // Strategist
  const stratScore = (
      (strat.ratings.Undercut || 80) +
      (strat.ratings.Overcut || 80) +
      (strat.ratings.Safety_Car || 80) * w.sc +
      (strat.ratings.Tyre_Choice || 80) +
      (strat.ratings.Pitstop_Timing || 80)
  ) / 5;

  // Pit crew
  const pitScore = (
      (pit.ratings.Stop_Time || 80) +
      (pit.ratings.Reliability || 80) * w.reliability +
      (pit.ratings.Undercut_Exec || 80) +
      (pit.ratings.Pressure_Handling || 80) +
      (pit.ratings.Multi_Stop || 80)
  ) / 5;

  // Principal
  const prinScore = (
      (prin.ratings.Strategy || 80) +
      (prin.ratings.Morale || 80) +
      (prin.ratings.Budget_Mgmt || 80) +
      (prin.ratings.Driver_Mgmt || 80)
  ) / 4;

  // Weighted combine — engine + aero are dominant
  const engNorm = clamp(engScore, 0, 100);
  const aeroNorm = clamp(aeroScore, 0, 100);

  return clamp(
      engNorm * 0.32
    + aeroNorm * 0.30
    + stratScore * 0.14
    + pitScore * 0.14
    + prinScore * 0.10,
    20, 100
  );
}

function computeDriverScore(driver, track, weather) {
  if (!driver?.ratings) return 70;
  const r = driver.ratings;
  const ch = track.ch;
  const wetMix = weather.mods.wet;

  return clamp(
      (r.Pace || 80)        * 0.30
    + (r.Racecraft || 80)   * (0.18 + 0.10 * ch.overtaking / 100)
    + (r.Wet_Weather || 80) * (0.05 + 0.20 * wetMix * ch.wet_sens / 100)
    + (r.Tyre_Mgmt || 80)   * (0.08 + 0.10 * ch.tyre_deg / 100)
    + (r.Consistency || 80) * 0.12
    + (r.Qualifying || 80)  * 0.07,
    20, 100
  );
}

function activeDriversForTeam(team) {
  // Returns the two racing drivers (driver1, driver2). Reserve only races if admin swapped.
  return ['driver1','driver2']
    .map(slot => ({ slot, asset: getAsset(team.assets[slot]) }))
    .filter(x => x.asset);
}


/* ─── 16. QUALIFYING ───────────────────────────────────────── */
function renderQual() {
  const root = document.getElementById('qualifying-content');
  if (!APP.season.started) {
    root.innerHTML = `<div class="card"><div class="text-sm text-muted">Lock the season first.</div></div>`;
    return;
  }
  if (!APP.season.fpDone) {
    root.innerHTML = `<div class="card">
      <div class="card-title">Free Practice required</div>
      <div class="text-sm text-muted">Run the pre-season Free Practice session before starting qualifying.</div>
      <button class="btn btn-red mt-12" onclick="document.querySelector('.nav-tab[data-page=fp]').click()">Go to Practice →</button>
    </div>`;
    return;
  }

  const round = APP.season.calendar[APP.season.currentRound - 1];
  if (!round) { root.innerHTML = `<div class="card"><div class="text-sm">Season complete.</div></div>`; return; }
  const track = TRACKS.find(t => t.id === round.trackId);

  if (round.qualResults) {
    renderQualResults(round, track);
    return;
  }

  const weatherSelectors = WEATHER_OPTIONS.map(w =>
    `<button class="w-pill ${APP.ui.qualWeather === w.id ? 'active' : ''}" data-weather="${w.id}">${w.emoji} ${w.label}</button>`
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
    </div>
  `;
  document.querySelectorAll('#qual-weather-row .w-pill').forEach(b =>
    b.addEventListener('click', () => { APP.ui.qualWeather = b.dataset.weather; renderQual(); }));
  document.getElementById('qual-run-btn').addEventListener('click', runQualifying);
}

function runQualifying() {
  const round = APP.season.calendar[APP.season.currentRound - 1];
  const track = TRACKS.find(t => t.id === round.trackId);
  const weather = WEATHER_OPTIONS.find(w => w.id === APP.ui.qualWeather);

  round.weatherId = weather.id;

  const entries = [];
  APP.teams.filter(teamComplete).forEach(team => {
    activeDriversForTeam(team).forEach(({ slot, asset }) => {
      const carScore = computeCarScore(team, track, weather);
      const drvScore = computeDriverScore(asset, track, weather);
      const qualBoost = ((asset.ratings.Qualifying || 80) - 80) * 0.04;
      const totalScore = carScore * 0.50 + drvScore * 0.50;
      const consistency = asset.ratings.Consistency || 80;
      const sigma = (100 - consistency) / 70;

      let lapTime = track.baseLap
        + (95 - totalScore) * 0.18
        - qualBoost
        + gaussRand(0, sigma);

      // Disaster lap: 3% chance, +0.8 to +2.0s
      let note = null;
      if (Math.random() < 0.03) {
        lapTime += rand(0.8, 2.0);
        note = 'Lock-up';
      }
      // Wet weather penalty for poor wet drivers
      if (weather.id === 'wet' || weather.id === 'mixed') {
        const wetSkill = asset.ratings.Wet_Weather || 80;
        lapTime += (90 - wetSkill) * 0.04;
      }

      entries.push({
        teamId: team.id, teamName: team.name, teamColor: team.color,
        slot, driverId: asset.id, driverName: asset.name,
        lapTime, note, carScore, drvScore,
      });
    });
  });

  entries.sort((a, b) => a.lapTime - b.lapTime);
  const pole = entries[0]?.lapTime || 0;
  entries.forEach((e, i) => {
    e.position = i + 1;
    e.gap = i === 0 ? 0 : e.lapTime - pole;
  });

  round.qualResults = { weatherId: weather.id, entries, generatedAt: new Date().toISOString() };

  // Update pole stat
  const poleEntry = entries[0];
  if (poleEntry) {
    const dk = driverKey(poleEntry.teamId, poleEntry.slot);
    if (APP.champ.drivers[dk]) APP.champ.drivers[dk].poles++;
  }
  saveState();
  renderQualResults(round, track);
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
  list.innerHTML = round.qualResults.entries.map((e, i) => {
    const posClass = i === 0 ? 'q1' : i === 1 ? 'q2' : i === 2 ? 'q3' : '';
    return `<div class="qual-row" style="--qc:${escHtml(e.teamColor)}" data-idx="${i}">
      <div class="q-pos ${posClass}">${e.position}</div>
      <div class="q-name">
        <div class="q-driver-name">${escHtml(e.driverName)} ${i === 0 ? '<span class="q-pole-badge">POLE</span>' : ''}</div>
        <div class="q-team-name">${escHtml(e.teamName)}${e.note ? ` · ${e.note}` : ''}</div>
      </div>
      <div class="q-time">${fmtTime(e.lapTime)}</div>
      <div class="q-gap">${i === 0 ? '—' : '+' + e.gap.toFixed(3)}</div>
    </div>`;
  }).join('');

  // Reverse-order reveal (from last to pole) for drama
  const rows = [...list.querySelectorAll('.qual-row')];
  const reversed = [...rows].reverse();
  reversed.forEach((row, i) => {
    setTimeout(() => row.classList.add('revealed'), 80 * i);
  });

  document.getElementById('qual-to-race-btn').addEventListener('click', () => showPage('race'));
  document.getElementById('qual-rerun-btn').addEventListener('click', () => {
    if (confirm('Re-run qualifying for this round?')) {
      round.qualResults = null;
      saveState(); renderQual();
    }
  });
}


/* ─── 17. RACE SIMULATION ──────────────────────────────────── */
function renderRace() {
  const root = document.getElementById('race-content');
  if (!APP.season.started) {
    root.innerHTML = `<div class="card"><div class="text-sm text-muted">Lock the season first.</div></div>`;
    return;
  }
  const round = APP.season.calendar[APP.season.currentRound - 1];
  if (!round) {
    root.innerHTML = `<div class="card"><div class="text-sm">Season complete. View results in the Championship tab.</div></div>`;
    return;
  }
  if (!round.qualResults) {
    root.innerHTML = `<div class="card">
      <div class="card-title">Qualifying required</div>
      <div class="text-sm text-muted">Run qualifying for this round before starting the race.</div>
      <button class="btn btn-red mt-12" onclick="document.querySelector('.nav-tab[data-page=qualifying]').click()">Go to Qualifying →</button>
    </div>`;
    return;
  }
  if (round.raceResults) {
    renderRaceComplete(round);
    return;
  }
  const track = TRACKS.find(t => t.id === round.trackId);
  const weather = WEATHER_OPTIONS.find(w => w.id === round.weatherId) || WEATHER_OPTIONS[0];

  root.innerHTML = `
    <div class="card">
      <div class="flex gap-12 mb-8 flex-wrap">
        <div>
          <div class="card-title">Round ${APP.season.currentRound} — ${track.flag} ${escHtml(track.name)}</div>
          <div class="text-sm text-muted">${weather.emoji} ${weather.label} · ${track.laps} laps · ${round.qualResults.entries.length} cars on grid</div>
        </div>
        <div class="ml-auto">
          <button class="btn btn-red" id="race-init-btn">▶ Lights Out</button>
        </div>
      </div>
    </div>
    <div id="race-stage"></div>
  `;
  document.getElementById('race-init-btn').addEventListener('click', initiateRace);
}

function initiateRace() {
  const stage = document.getElementById('race-stage');
  stage.innerHTML = `
    <div class="card">
      <div class="card-title text-accent">Lights sequence</div>
      <div class="lights-container" id="lights-container">
        ${[1,2,3,4,5].map(() => `
          <div class="light-housing">
            <div class="light-bulb"></div>
            <div class="light-bulb"></div>
          </div>`).join('')}
      </div>
      <div class="text-sm text-muted" style="text-align:center;">Hold tight…</div>
    </div>
  `;
  const housings = stage.querySelectorAll('.light-housing');
  let i = 0;
  const turnOn = () => {
    if (i >= 5) {
      const holdMs = 600 + Math.random() * 1800; // dramatic random hold
      setTimeout(() => {
        // Lights out!
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
  const round = APP.season.calendar[APP.season.currentRound - 1];
  const track = TRACKS.find(t => t.id === round.trackId);
  const weather = WEATHER_OPTIONS.find(w => w.id === round.weatherId);

  // Build per-car race state
  const cars = round.qualResults.entries.map((e, i) => {
    const team = APP.teams.find(t => t.id === e.teamId);
    const driver = getAsset(e.driverId);
    const carScore = computeCarScore(team, track, weather);
    const drvScore = computeDriverScore(driver, track, weather);
    const totalScore = carScore * 0.55 + drvScore * 0.45;
    const targetStops = chooseTargetStops(track, drvScore);

    // Initial compound
    const startCompound = weather.id === 'wet' ? 'W' : (weather.id === 'mixed' ? 'I' : (i < 8 ? 'M' : 'M'));

    return {
      teamId: team.id, teamName: team.name, teamColor: team.color,
      slot: e.slot, driverId: driver.id, driverName: driver.name,
      startPos: e.position, position: e.position,
      gridGap: e.gap,
      carScore, drvScore, totalScore,
      targetStops, stopsDone: 0,
      compound: startCompound, tireAge: 0,
      totalTime: i * 0.3, // grid spacing
      lastLapTime: 0, fastestLap: Infinity,
      pitStops: [], events: [],
      dnf: false, dnfLap: null, dnfReason: null,
      reliabilityRating: getAsset(team.assets.engine)?.ratings.Reliability || 85,
      pitTime: clamp(28 - ((getAsset(team.assets.pitcrew)?.ratings.Stop_Time || 85) - 80) * 0.18, 21, 30),
    };
  });

  APP.race.state = {
    track, weather, lap: 0, totalLaps: track.laps,
    cars, events: [],
    scActive: false, scLapsRemaining: 0, scTriggered: 0,
  };
  APP.race.running = true;
  APP.race.paused = false;
  APP.race.speedKey = '1x';

  renderRaceLive();
  scheduleNextLap();
}

function chooseTargetStops(track, drvScore) {
  // 1-stop if low deg + skilled driver, 3-stop if very high deg, else 2-stop
  const deg = track.ch.tyre_deg;
  if (deg < 50 && drvScore > 88) return 1;
  if (deg > 85 && Math.random() < 0.30) return 3;
  return 2;
}

function renderRaceLive() {
  const stage = document.getElementById('race-stage');
  const s = APP.race.state;
  stage.innerHTML = `
    <div class="race-container">
      <div class="race-header">
        <span class="live-pill"><span class="live-dot"></span>LIVE</span>
        <span class="race-circuit">${s.track.flag} ${escHtml(s.track.name)}</span>
        <span class="sc-banner ${s.scActive ? 'show' : ''}" id="sc-banner">🟡 SAFETY CAR</span>
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
  document.getElementById('race-speed-select').addEventListener('change', e => {
    APP.race.speedKey = e.target.value;
  });
  renderTimingTable();
}

function renderTimingTable() {
  const s = APP.race.state;
  const sorted = [...s.cars].sort((a, b) => {
    if (a.dnf && !b.dnf) return 1;
    if (b.dnf && !a.dnf) return -1;
    if (a.dnf && b.dnf) return (b.dnfLap || 0) - (a.dnfLap || 0);
    return a.totalTime - b.totalTime;
  });
  const leader = sorted.find(c => !c.dnf);
  sorted.forEach((c, i) => {
    if (!c.dnf) {
      const newPos = i + 1;
      if (newPos !== c.position && c.position) c._posChanged = true;
      c.position = newPos;
    }
  });
  const html = sorted.map((c, i) => {
    const tire = TIRE_COMPOUNDS[c.compound];
    let posDisplay, gapDisplay;
    if (c.dnf) {
      posDisplay = `<span class="t-pos dnf">DNF</span>`;
      gapDisplay = `<span class="t-gap text-accent">L${c.dnfLap}</span>`;
    } else {
      const pcls = c.position === 1 ? 'p1' : c.position === 2 ? 'p2' : c.position === 3 ? 'p3' : '';
      posDisplay = `<span class="t-pos ${pcls}">${c.position}</span>`;
      gapDisplay = `<span class="t-gap">${c === leader ? 'LEADER' : '+' + (c.totalTime - leader.totalTime).toFixed(3)}</span>`;
    }
    const flash = c._posChanged ? 'pos-change' : '';
    if (c._posChanged) c._posChanged = false;
    return `<div class="timing-row ${flash}" style="--rc:${escHtml(c.teamColor)}">
      ${posDisplay}
      <span class="t-dot"></span>
      <div class="t-driver">
        <div class="t-driver-name">${escHtml(c.driverName)}</div>
        <div class="t-driver-team">${escHtml(c.teamName)}</div>
      </div>
      <span class="tire-badge ${tire.css}">${c.compound}${c.dnf ? '' : ` ${c.tireAge}`}</span>
      <span class="t-stops">${c.stopsDone}/${c.targetStops}</span>
      ${gapDisplay}
    </div>`;
  }).join('');
  document.getElementById('timing-table').innerHTML = html;
  document.getElementById('race-lap-disp').textContent = `Lap ${s.lap}/${s.totalLaps}`;
  document.getElementById('race-progress').style.width = `${(s.lap / s.totalLaps) * 100}%`;
  document.getElementById('sc-banner')?.classList.toggle('show', s.scActive);
}

function pushEvent(text, cls = '') {
  const s = APP.race.state;
  const line = `<div class="event-line"><span class="lap-tag">L${s.lap}</span><span class="${cls}">${text}</span></div>`;
  s.events.push({ lap:s.lap, text, cls });
  const ticker = document.getElementById('events-ticker');
  if (ticker) {
    ticker.insertAdjacentHTML('afterbegin', line);
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

  // Safety car decay
  if (s.scActive) {
    s.scLapsRemaining--;
    if (s.scLapsRemaining <= 0) {
      s.scActive = false;
      pushEvent('Safety car in this lap — racing resumes', 'ev-sc');
    }
  }

  // Fresh safety car trigger
  if (!s.scActive && s.scTriggered < 2) {
    const baseChance = (s.track.ch.sc_base / 100) * (s.weather.mods.sc) / s.totalLaps * 1.4;
    if (Math.random() < baseChance) {
      s.scActive = true;
      s.scLapsRemaining = 3 + Math.floor(Math.random() * 3);
      s.scTriggered++;
      pushEvent('🟡 Safety car deployed', 'ev-sc');
      // Bunch up: cap gap behind leader
      const racing = s.cars.filter(c => !c.dnf).sort((a, b) => a.totalTime - b.totalTime);
      const leader = racing[0];
      racing.forEach((c, i) => {
        if (i === 0) return;
        const target = leader.totalTime + i * 0.8;
        if (c.totalTime > target) c.totalTime = target;
      });
    }
  }

  // Per-car lap simulation
  s.cars.forEach(c => {
    if (c.dnf) return;
    c.tireAge++;

    // DNF check
    const dnfChance = (100 - c.reliabilityRating) / 9000 * (1 / s.weather.mods.reliability);
    if (Math.random() < dnfChance) {
      c.dnf = true;
      c.dnfLap = s.lap;
      c.dnfReason = ['Engine failure','Hydraulics','Gearbox','Power unit','Mechanical'][Math.floor(Math.random() * 5)];
      pushEvent(`💥 ${escHtml(c.driverName)} OUT — ${c.dnfReason}`, 'ev-dnf');
      const dk = driverKey(c.teamId, c.slot);
      if (APP.champ.drivers[dk]) APP.champ.drivers[dk].dnfs++;
      return;
    }

    // Pit stop logic
    const lapsLeft = s.totalLaps - s.lap;
    const stopsLeft = c.targetStops - c.stopsDone;
    const tire = TIRE_COMPOUNDS[c.compound];
    const pastCliff = c.tireAge > tire.cliff;
    const window = stopsLeft > 0 ? Math.floor(s.totalLaps / (c.targetStops + 1)) : 999;

    let pitting = false;
    if (stopsLeft > 0 && c.tireAge >= window) {
      // SC pit gain bonus
      if (s.scActive && Math.random() < 0.6) pitting = true;
      // Forced if past tire cliff
      else if (pastCliff && Math.random() < 0.5) pitting = true;
      // Standard
      else if (c.tireAge >= window + 5) pitting = true;
    }
    // Don't pit on the last 2 laps unless absolutely necessary
    if (lapsLeft <= 2 && stopsLeft > 0 && pastCliff) pitting = true;
    if (lapsLeft <= 1) pitting = false;

    let lapTime;
    if (pitting) {
      // Choose new compound based on stops remaining
      let newCompound;
      if (s.weather.id === 'wet') newCompound = 'W';
      else if (s.weather.id === 'mixed') newCompound = Math.random() < 0.5 ? 'I' : 'M';
      else {
        if (stopsLeft - 1 === 0) {
          // Final stint: pick based on lapsLeft
          if (lapsLeft < 18) newCompound = 'S';
          else if (lapsLeft < 32) newCompound = 'M';
          else newCompound = 'H';
        } else {
          newCompound = c.compound === 'M' ? 'H' : (c.compound === 'H' ? 'M' : 'M');
        }
      }
      const stopT = c.pitTime + gaussRand(0, 0.4);
      c.pitStops.push({ lap: s.lap, fromCompound: c.compound, toCompound: newCompound, time: stopT });
      pushEvent(`🔧 ${escHtml(c.driverName)} pits → ${TIRE_COMPOUNDS[newCompound].name} (${stopT.toFixed(1)}s)`, 'ev-pit');
      c.compound = newCompound;
      c.tireAge = 0;
      c.stopsDone++;
      lapTime = computeBaseLapTime(c, s) + stopT;
    } else {
      lapTime = computeBaseLapTime(c, s);
    }

    // Safety car lap times are slower and bunched
    if (s.scActive) lapTime = s.track.baseLap * 1.45;

    c.totalTime += lapTime;
    c.lastLapTime = lapTime;
    if (lapTime < c.fastestLap && !pitting && !s.scActive) c.fastestLap = lapTime;

    // Random incident (loss of time, not retirement)
    const incidentChance = (100 - (getAsset({ id:c.driverId })?.ratings.Racecraft || 80)) / 13000;
    if (!s.scActive && Math.random() < incidentChance) {
      const loss = rand(2, 8);
      c.totalTime += loss;
      pushEvent(`⚠ ${escHtml(c.driverName)} runs wide (+${loss.toFixed(1)}s)`, 'ev-pit');
    }
  });

  renderTimingTable();
}

function computeBaseLapTime(c, s) {
  const tire = TIRE_COMPOUNDS[c.compound];
  const base = s.track.baseLap * 1.005;
  const offset = (95 - c.totalScore) * 0.08;
  const tireOffset = tire.pace + Math.max(0, c.tireAge - 2) * tire.deg
                   + Math.max(0, c.tireAge - tire.cliff) * tire.deg * 3.5;
  const driver = getAsset(c.driverId);
  const consistency = driver?.ratings.Consistency || 80;
  const sigma = (100 - consistency) / 350;
  const noise = gaussRand(0, sigma);
  return base + offset + tireOffset + noise;
}

function toggleRacePause() {
  APP.race.paused = !APP.race.paused;
  const btn = document.getElementById('race-pause-btn');
  if (APP.race.paused) {
    if (APP.race.interval) clearTimeout(APP.race.interval);
    btn.textContent = '▶ Resume';
  } else {
    btn.textContent = '⏸ Pause';
    scheduleNextLap();
  }
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
  const s = APP.race.state;
  const round = APP.season.calendar[APP.season.currentRound - 1];

  const finishers = s.cars.filter(c => !c.dnf).sort((a, b) => a.totalTime - b.totalTime);
  const dnfList   = s.cars.filter(c =>  c.dnf).sort((a, b) => (b.dnfLap || 0) - (a.dnfLap || 0));
  const ordered   = [...finishers, ...dnfList];

  // Fastest lap (only finishers in top 10 get the bonus)
  let flCar = null, flTime = Infinity;
  finishers.forEach(c => { if (c.fastestLap < flTime) { flTime = c.fastestLap; flCar = c; } });

  // Best pit stop
  const allStops = s.cars.flatMap(c => c.pitStops.map(p => ({ ...p, car: c })));
  const bestPit = allStops.length ? allStops.reduce((a, b) => a.time < b.time ? a : b) : null;

  // Build classification + assign points + update champ
  const classification = ordered.map((c, i) => {
    const finishedTop10 = !c.dnf && i < 10;
    const points = finishedTop10 ? POINTS_SYS[i] : 0;
    const isFL = flCar && c === flCar && i < 10;
    const flPoints = isFL ? FL_BONUS : 0;
    const totalPoints = points + flPoints;

    const dk = driverKey(c.teamId, c.slot);
    if (APP.champ.drivers[dk]) {
      const cd = APP.champ.drivers[dk];
      cd.points += totalPoints;
      if (i === 0 && !c.dnf) cd.wins++;
      if (i < 3 && !c.dnf) cd.podiums++;
      if (isFL) cd.fl++;
      cd.history.push({
        round: APP.season.currentRound, trackId: s.track.id,
        gridPos: c.startPos, finishPos: c.dnf ? null : i + 1,
        points: totalPoints, dnf: c.dnf, dnfReason: c.dnfReason,
        fl: isFL,
      });
    }
    if (APP.champ.constructors[c.teamId]) {
      APP.champ.constructors[c.teamId].points += totalPoints;
      if (i === 0 && !c.dnf) APP.champ.constructors[c.teamId].wins++;
      if (i < 3 && !c.dnf) APP.champ.constructors[c.teamId].podiums++;
    }

    return {
      position: c.dnf ? null : i + 1,
      teamId: c.teamId, teamName: c.teamName, teamColor: c.teamColor,
      slot: c.slot, driverId: c.driverId, driverName: c.driverName,
      startPos: c.startPos,
      totalTime: c.totalTime, fastestLap: c.fastestLap,
      compound: c.compound, pitStops: c.pitStops,
      points: totalPoints, basePoints: points, flPoints,
      isFL, isBestPit: bestPit && c === bestPit.car,
      dnf: c.dnf, dnfLap: c.dnfLap, dnfReason: c.dnfReason,
    };
  });

  // Push round history into constructor
  classification.forEach(r => {
    if (APP.champ.constructors[r.teamId]) {
      APP.champ.constructors[r.teamId].history.push({
        round: APP.season.currentRound, trackId: s.track.id,
        position: r.position, points: r.points, dnf: r.dnf,
      });
    }
  });

  round.raceResults = {
    classification,
    events: s.events,
    flCar: flCar ? { driverId: flCar.driverId, time: flCar.fastestLap } : null,
    bestPit: bestPit ? { driverId: bestPit.car.driverId, time: bestPit.time, lap: bestPit.lap } : null,
    scTriggers: s.scTriggered,
    generatedAt: new Date().toISOString(),
  };
  round.completed = true;

  // Advance round
  if (APP.season.currentRound < APP.season.calendar.length) {
    APP.season.currentRound++;
  }

  saveState();
  updateSidebar();
  updateRoundBadge();
  renderRaceComplete(round);
  notify('🏁 Race complete', 'success');
}

function renderRaceComplete(round) {
  const stage = document.getElementById('race-stage') || document.getElementById('race-content');
  const track = TRACKS.find(t => t.id === round.trackId);
  const top3 = round.raceResults.classification.slice(0, 3);
  document.getElementById('race-content').innerHTML = `
    <div class="card">
      <div class="card-title">🏁 Race Complete — ${track.flag} ${escHtml(track.name)}</div>
      <div class="grid-3 mb-12">
        ${top3.map((r, i) => `
          <div class="card-sm card" style="border-left:3px solid ${escHtml(r.teamColor)};">
            <div class="text-xs text-muted">P${i + 1}</div>
            <div class="fw-700">${escHtml(r.driverName)}</div>
            <div class="text-xs text-muted">${escHtml(r.teamName)}</div>
            <div class="text-gold mono mt-8">+${r.points} pts</div>
          </div>
        `).join('')}
      </div>
      <div class="flex gap-12 flex-wrap">
        <button class="btn btn-blue" onclick="document.querySelector('.nav-tab[data-page=results]').click()">View Full Results →</button>
        ${APP.season.currentRound > APP.season.calendar.length
          ? `<span class="tag tag-ready">Season Complete</span>`
          : `<button class="btn btn-red" onclick="document.querySelector('.nav-tab[data-page=qualifying]').click()">Next Round: Qualifying →</button>`}
      </div>
    </div>
  `;
}


/* ─── 18. RESULTS ──────────────────────────────────────────── */
function renderResults() {
  const completed = APP.season.calendar.filter(r => r.completed);
  if (!completed.length) {
    document.getElementById('results-content').innerHTML = `
      <div class="card"><div class="text-sm text-muted">No completed races yet.</div></div>`;
    return;
  }
  const selected = APP.ui.selectedResult || completed.length;
  const round = APP.season.calendar[selected - 1];
  const track = TRACKS.find(t => t.id === round.trackId);
  const weather = WEATHER_OPTIONS.find(w => w.id === round.weatherId);
  const r = round.raceResults;

  const rows = r.classification.map((c, i) => {
    const badges = [];
    if (c.isFL) badges.push('<span class="r-badge r-fl">FL</span>');
    if (c.isBestPit) badges.push('<span class="r-badge r-best-pit">BEST PIT</span>');
    if (c.dnf) badges.push('<span class="r-badge r-dnf">DNF</span>');
    return `<div class="result-row" style="border-left:3px solid ${escHtml(c.teamColor)};padding-left:13px;">
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
      const tr = TRACKS.find(t => t.id === rr.trackId);
      const idx = APP.season.calendar.indexOf(rr) + 1;
      return `<option value="${idx}" ${idx === selected ? 'selected' : ''}>R${idx} — ${tr?.flag} ${escHtml(tr?.name)}</option>`;
    }).join('')
  }</select>`;

  document.getElementById('results-content').innerHTML = `
    <div class="card">
      <div class="flex gap-12 mb-8 flex-wrap">
        <div>
          <div class="card-title">Round ${selected} — ${track.flag} ${escHtml(track.name)}</div>
          <div class="text-sm text-muted">${weather?.emoji} ${weather?.label} · ${track.laps} laps · ${r.scTriggers} safety car${r.scTriggers === 1 ? '' : 's'}</div>
        </div>
        <div class="ml-auto flex gap-8">
          ${selector}
          <button class="btn btn-blue btn-sm" id="results-print-btn">📄 Export PDF</button>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="card-title">Final Classification</div>
      ${rows}
    </div>
    ${pitRows ? `<div class="card">
      <div class="card-title">Pit Stop Performance</div>
      <table class="champ-table">
        <thead><tr><th>Driver</th><th>Lap</th><th>From</th><th></th><th>To</th><th>Time</th></tr></thead>
        <tbody>${pitRows}</tbody>
      </table>
    </div>` : ''}
    <div class="card">
      <div class="card-title">Race Events</div>
      <div class="events-ticker" style="height:auto;max-height:300px;">${eventsList}</div>
    </div>
  `;
  document.getElementById('results-round-select').addEventListener('change', e => {
    APP.ui.selectedResult = parseInt(e.target.value, 10);
    renderResults();
  });
  document.getElementById('results-print-btn').addEventListener('click', () => printRaceResults(selected));
}

function printRaceResults(roundIdx) {
  const round = APP.season.calendar[roundIdx - 1];
  if (!round?.raceResults) return;
  const track = TRACKS.find(t => t.id === round.trackId);
  const weather = WEATHER_OPTIONS.find(w => w.id === round.weatherId);
  const r = round.raceResults;

  // Asset performance breakdown - grouped by team
  const teamPerf = {};
  r.classification.forEach(c => {
    if (!teamPerf[c.teamId]) {
      const team = APP.teams.find(t => t.id === c.teamId);
      teamPerf[c.teamId] = {
        name: c.teamName, color: c.teamColor,
        team, drivers: [], totalPoints: 0,
      };
    }
    teamPerf[c.teamId].drivers.push(c);
    teamPerf[c.teamId].totalPoints += c.points;
  });

  const teamPerfHtml = Object.values(teamPerf).map(tp => {
    const team = tp.team;
    const assetRows = SLOT_ORDER.filter(s => s !== 'reserve').map(slot => {
      const a = getAsset(team.assets[slot]);
      if (!a) return '';
      const ratingsList = Object.entries(a.ratings).map(([k, v]) => `${k}: ${v}`).join(', ');
      return `<tr>
        <td>${SLOT_LABELS[slot]}</td>
        <td>${escHtml(a.name)}</td>
        <td>${ovr(a)}</td>
        <td style="font-size:9px;">${escHtml(ratingsList)}</td>
      </tr>`;
    }).join('');
    return `<div class="print-section">
      <div class="print-team-header" style="border-left-color:${escHtml(tp.color)};">
        <div class="print-team-name">${escHtml(tp.name)}</div>
        <div style="font-size:11px;color:#555;">${tp.totalPoints} pts this race · drivers: ${tp.drivers.map(d => `${escHtml(d.driverName)} (${d.dnf ? 'DNF' : 'P' + d.position})`).join(', ')}</div>
      </div>
      <table class="print-table">
        <thead><tr><th>Slot</th><th>Asset</th><th>OVR</th><th>Ratings</th></tr></thead>
        <tbody>${assetRows}</tbody>
      </table>
    </div>`;
  }).join('');

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
          <thead><tr><th>Pos</th><th>Driver</th><th>Team</th><th>Grid</th><th>Status</th><th>Fastest Lap</th><th>Pit Stops</th><th>Points</th></tr></thead>
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
    </div>
    <div class="print-page">
      <div class="print-header">
        <div>
          <div class="print-title">Asset Performance Breakdown</div>
          <div class="print-subtitle">Round ${roundIdx} — ${track.flag} ${escHtml(track.name)}</div>
        </div>
        <div class="print-logo">F1 MUN</div>
      </div>
      ${teamPerfHtml}
    </div>
  `;
  setTimeout(() => window.print(), 100);
}


/* ─── 19. CHAMPIONSHIP ─────────────────────────────────────── */
function renderChampionship() {
  const drivers = Object.entries(APP.champ.drivers).sort((a, b) => b[1].points - a[1].points);
  const constructors = Object.entries(APP.champ.constructors).sort((a, b) => b[1].points - a[1].points);

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

  // Race-by-race progression matrix
  const rounds = APP.season.calendar.length;
  const completedRounds = APP.season.calendar.map((r, i) => r.completed ? (i + 1) : null).filter(x => x);
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
        <div style="overflow-x:auto;">
          <table class="champ-table">
            <thead><tr><th>Driver</th>${matrixHeader}<th>Total</th></tr></thead>
            <tbody>${matrixRows}</tbody>
          </table>
        </div>
      </div>` : ''}
  `;
}


/* ─── 20. ANALYTICS ────────────────────────────────────────── */
function renderAnalytics() {
  const isAdmin = APP.session.role === 'admin';
  let teamId = APP.ui.selectedAnalyticsTeam || (isAdmin ? APP.teams[0]?.id : APP.session.teamId);
  if (!teamId) {
    document.getElementById('analytics-content').innerHTML = `<div class="card"><div class="text-sm text-muted">No team data available.</div></div>`;
    return;
  }

  const team = APP.teams.find(t => t.id === teamId);
  if (!team) { document.getElementById('analytics-content').innerHTML = '<div class="card">Team not found</div>'; return; }

  const teamSelector = isAdmin ? `<select id="analytics-team-select">${
    APP.teams.map(t => `<option value="${t.id}" ${t.id === teamId ? 'selected' : ''}>${escHtml(t.name)}</option>`).join('')
  }</select>` : '';

  // Overview hero
  const tovr = teamOvr(team) ?? '—';
  const spent = teamSpent(team);
  const conData = APP.champ.constructors[team.id];

  // Driver lineup
  const driverHtml = ['driver1','driver2','reserve'].map(slot => {
    const a = getAsset(team.assets[slot]);
    if (!a) return `<div class="card card-sm"><div class="card-title">${SLOT_LABELS[slot]}</div><div class="text-dim">— empty —</div></div>`;
    const ratingsHtml = Object.entries(a.ratings).map(([k, v]) => `
      <div class="stat-bar-wrap" style="--bar-color:${escHtml(team.color)}">
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

  // Car components
  const compHtml = ['engine','aero','strategist','pitcrew','principal'].map(slot => {
    const a = getAsset(team.assets[slot]);
    if (!a) return `<div class="card card-sm"><div class="card-title">${SLOT_LABELS[slot]}</div><div class="text-dim">— empty —</div></div>`;
    const ratingsHtml = Object.entries(a.ratings).map(([k, v]) => `
      <div class="stat-bar-wrap" style="--bar-color:${TYPE_COLORS[SLOT_TO_TYPE[slot]]}">
        <span class="stat-bar-label">${escHtml(k.replace(/_/g, ' '))}</span>
        <div class="stat-bar-track"><div class="stat-bar-fill" style="width:${v}%"></div></div>
        <span class="stat-bar-val">${v}</span>
      </div>`).join('');
    return `<div class="card card-sm">
      <div class="card-title">${SLOT_LABELS[slot]}</div>
      <div class="fw-700 text-sm">${escHtml(a.name)}</div>
      <div class="text-xs text-muted mb-12">${escHtml(a.nat || '')} · OVR ${ovr(a)} · $${priceOf(a.id)}M</div>
      ${ratingsHtml}
    </div>`;
  }).join('');

  // Race history
  const completedRounds = APP.season.calendar.filter(r => r.completed);
  const historyRows = completedRounds.map((round, i) => {
    const tr = TRACKS.find(t => t.id === round.trackId);
    const teamRows = round.raceResults.classification.filter(c => c.teamId === team.id);
    return teamRows.map(c => {
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

  // Points progression
  let cumulative = 0;
  const progPoints = completedRounds.map((round, i) => {
    const teamRows = round.raceResults.classification.filter(c => c.teamId === team.id);
    const roundPts = teamRows.reduce((a, c) => a + c.points, 0);
    cumulative += roundPts;
    return { round:i + 1, roundPts, cumulative };
  });
  const maxC = Math.max(...progPoints.map(p => p.cumulative), 1);
  const progHtml = progPoints.map(p => {
    const pct = (p.cumulative / maxC) * 100;
    return `<div class="stat-bar-wrap" style="--bar-color:${escHtml(team.color)}">
      <span class="stat-bar-label">R${p.round}</span>
      <div class="stat-bar-track"><div class="stat-bar-fill" style="width:${pct}%"></div></div>
      <span class="stat-bar-val">${p.cumulative}</span>
    </div>`;
  }).join('');

  // All constructors comparison
  const allCons = Object.entries(APP.champ.constructors).sort((a, b) => b[1].points - a[1].points);
  const maxPts = Math.max(...allCons.map(([_, c]) => c.points), 1);
  const compareHtml = allCons.map(([id, c]) => {
    const pct = (c.points / maxPts) * 100;
    const isMe = id === team.id;
    return `<div class="stat-bar-wrap" style="--bar-color:${escHtml(c.color)}">
      <span class="stat-bar-label" style="${isMe ? 'font-weight:700;color:var(--text);' : ''}">${escHtml(c.name)}</span>
      <div class="stat-bar-track"><div class="stat-bar-fill" style="width:${pct}%"></div></div>
      <span class="stat-bar-val">${c.points}</span>
    </div>`;
  }).join('');

  document.getElementById('analytics-content').innerHTML = `
    <div class="card">
      <div class="flex gap-12 mb-8 flex-wrap">
        <div>
          <div class="card-title">Team Profile</div>
          <div class="fw-700" style="font-family:var(--font-display);font-size:18px;color:${escHtml(team.color)};">${escHtml(team.name)}</div>
          <div class="text-sm text-muted">OVR ${tovr} · $${spent}M spent · ${conData?.points || 0} championship points</div>
        </div>
        <div class="ml-auto flex gap-8 align-items-center">
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
      <div class="analytics-heading">Car Components</div>
      <div class="grid-auto-lg">${compHtml}</div>
    </div>

    ${completedRounds.length ? `
      <div class="analytics-section">
        <div class="analytics-heading">Race-by-Race Performance</div>
        <div class="card">${historyRows}</div>
      </div>
      <div class="analytics-section">
        <div class="analytics-heading">Points Progression</div>
        <div class="card">${progHtml}</div>
      </div>
    ` : ''}

    <div class="analytics-section">
      <div class="analytics-heading">Constructors Comparison</div>
      <div class="card">${compareHtml || '<div class="text-dim">No data yet</div>'}</div>
    </div>
  `;

  if (isAdmin) {
    document.getElementById('analytics-team-select').addEventListener('change', e => {
      APP.ui.selectedAnalyticsTeam = e.target.value;
      renderAnalytics();
    });
  }
  document.getElementById('analytics-print-btn').addEventListener('click', () => printAnalyticsReport(team.id));
}

function printAnalyticsReport(teamId) {
  const team = APP.teams.find(t => t.id === teamId);
  if (!team) return;
  const conData = APP.champ.constructors[team.id];
  const completedRounds = APP.season.calendar.filter(r => r.completed);

  // Page 1: overview + assets
  const assetRows = SLOT_ORDER.map(slot => {
    const a = getAsset(team.assets[slot]);
    if (!a) return `<tr><td>${SLOT_LABELS[slot]}</td><td colspan="3" style="color:#999;">— empty —</td></tr>`;
    return `<tr>
      <td>${SLOT_LABELS[slot]}</td>
      <td>${escHtml(a.name)}</td>
      <td>${ovr(a)}</td>
      <td style="font-size:9px;">${Object.entries(a.ratings).map(([k, v]) => `${k}: ${v}`).join(', ')}</td>
    </tr>`;
  }).join('');

  // Page 2: race history
  const historyRows = completedRounds.map((round, i) => {
    const tr = TRACKS.find(t => t.id === round.trackId);
    const teamCars = round.raceResults.classification.filter(c => c.teamId === team.id);
    return teamCars.map(c => `<tr>
      <td>R${i + 1}</td>
      <td>${tr?.name || ''}</td>
      <td>${escHtml(c.driverName)}</td>
      <td>P${c.startPos}</td>
      <td>${c.dnf ? 'DNF' : 'P' + c.position}</td>
      <td>${c.dnf ? c.dnfReason : fmtTime(c.fastestLap)}</td>
      <td>${c.pitStops?.length || 0}</td>
      <td>${c.points}</td>
    </tr>`).join('');
  }).join('');

  // Page 3: championship standings
  const drivers = Object.entries(APP.champ.drivers).sort((a, b) => b[1].points - a[1].points);
  const constructors = Object.entries(APP.champ.constructors).sort((a, b) => b[1].points - a[1].points);

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
          <div class="print-stat-row"><span>Position</span><span>${(constructors.findIndex(([id]) => id === team.id)) + 1} / ${constructors.length}</span></div>
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

    ${historyRows ? `
    <div class="print-page">
      <div class="print-header">
        <div>
          <div class="print-title">Race-by-Race History</div>
          <div class="print-subtitle">${escHtml(team.name)}</div>
        </div>
        <div class="print-logo">F1 MUN</div>
      </div>
      <div class="print-section">
        <table class="print-table">
          <thead><tr><th>Rd</th><th>Track</th><th>Driver</th><th>Grid</th><th>Finish</th><th>Notes</th><th>Stops</th><th>Pts</th></tr></thead>
          <tbody>${historyRows}</tbody>
        </table>
      </div>
    </div>` : ''}

    <div class="print-page">
      <div class="print-header">
        <div>
          <div class="print-title">Championship Standings</div>
          <div class="print-subtitle">After Round ${completedRounds.length} / ${APP.season.calendar.length}</div>
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
    </div>
  `;
  setTimeout(() => window.print(), 100);
}


/* ─── 21. TRADE DESK ───────────────────────────────────────── */
function renderTrade() {
  const root = document.getElementById('trade-content');
  if (APP.teams.length < 2) {
    root.innerHTML = `<div class="card"><div class="text-sm text-muted">Need at least 2 teams to trade.</div></div>`;
    return;
  }
  if (!APP.ui.tradeA) APP.ui.tradeA = APP.teams[0].id;
  if (!APP.ui.tradeB) APP.ui.tradeB = APP.teams[1].id;
  if (APP.ui.tradeA === APP.ui.tradeB) APP.ui.tradeB = APP.teams.find(t => t.id !== APP.ui.tradeA)?.id;

  const teamOptionsA = APP.teams.map(t => `<option value="${t.id}" ${t.id === APP.ui.tradeA ? 'selected' : ''}>${escHtml(t.name)}</option>`).join('');
  const teamOptionsB = APP.teams.map(t => `<option value="${t.id}" ${t.id === APP.ui.tradeB ? 'selected' : ''}>${escHtml(t.name)}</option>`).join('');

  const teamA = APP.teams.find(t => t.id === APP.ui.tradeA);
  const teamB = APP.teams.find(t => t.id === APP.ui.tradeB);
  const buildSide = (team, side) => {
    const selected = side === 'A' ? APP.ui.tradeASelected : APP.ui.tradeBSelected;
    const rows = SLOT_ORDER.map(slot => {
      const a = getAsset(team.assets[slot]);
      if (!a) return '';
      const isSel = selected.includes(slot);
      return `<div class="trade-row ${isSel ? 'selected' : ''}" data-side="${side}" data-slot="${slot}">
        <span class="text-xs text-muted" style="min-width:64px;">${SLOT_LABELS[slot]}</span>
        <div class="flex-1">
          <div class="fw-700 text-sm">${escHtml(a.name)}</div>
          <div class="text-xs text-muted">OVR ${ovr(a)} · $${priceOf(a.id)}M</div>
        </div>
      </div>`;
    }).join('');
    const totalVal = selected.reduce((sum, s) => sum + priceOf(team.assets[s]), 0);
    return `<div class="card">
      <div class="flex gap-8 mb-12">
        <select data-trade-side="${side}" style="flex:1;">${side === 'A' ? teamOptionsA : teamOptionsB}</select>
      </div>
      <div class="card-title">Available — click to select</div>
      ${rows || '<div class="text-dim text-sm">No assets</div>'}
      <div class="mt-12 text-xs">Selected value: <span class="text-gold mono">$${totalVal}M</span></div>
    </div>`;
  };

  const isAdmin = APP.session.role === 'admin';

  root.innerHTML = `
    <div class="trade-grid">
      ${buildSide(teamA, 'A')}
      <div class="trade-arrow">⇄</div>
      ${buildSide(teamB, 'B')}
    </div>
    <div class="card mt-16">
      <div class="card-title">Execute Trade</div>
      <div class="text-xs text-muted mb-12">
        Slots must align (drivers swap among driver1/driver2/reserve only; other slots must match exactly).
        ${isAdmin ? '' : 'Admin must execute the trade once both delegations agree.'}
      </div>
      <button class="btn btn-red" id="trade-execute-btn" ${isAdmin ? '' : 'disabled'}>Execute Trade</button>
    </div>
  `;

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
      const arr = side === 'A' ? APP.ui.tradeASelected : APP.ui.tradeBSelected;
      const idx = arr.indexOf(slot);
      if (idx >= 0) arr.splice(idx, 1); else arr.push(slot);
      renderTrade();
    });
  });
  if (isAdmin) document.getElementById('trade-execute-btn').addEventListener('click', executeTrade);
}

function executeTrade() {
  const teamA = APP.teams.find(t => t.id === APP.ui.tradeA);
  const teamB = APP.teams.find(t => t.id === APP.ui.tradeB);
  const aSlots = APP.ui.tradeASelected;
  const bSlots = APP.ui.tradeBSelected;
  if (!aSlots.length || !bSlots.length) { notify('Select assets on both sides', 'warn'); return; }

  // Validate slot compatibility
  const driverSlots = ['driver1','driver2','reserve'];
  const aTypes = aSlots.map(s => driverSlots.includes(s) ? 'driver' : s);
  const bTypes = bSlots.map(s => driverSlots.includes(s) ? 'driver' : s);
  if (aTypes.length !== bTypes.length) { notify('Both sides must offer the same number of assets', 'error'); return; }
  const aSorted = [...aTypes].sort(), bSorted = [...bTypes].sort();
  if (aSorted.join(',') !== bSorted.join(',')) {
    notify('Slot types must match (drivers↔drivers, engines↔engines, etc.)', 'error');
    return;
  }

  // Match pairs
  const aRemain = [...aSlots], bRemain = [...bSlots];
  const swaps = [];
  while (aRemain.length) {
    const a = aRemain.shift();
    const aType = driverSlots.includes(a) ? 'driver' : a;
    const matchIdx = bRemain.findIndex(b => (driverSlots.includes(b) ? 'driver' : b) === aType);
    if (matchIdx < 0) { notify('Could not match all slots', 'error'); return; }
    swaps.push([a, bRemain.splice(matchIdx, 1)[0]]);
  }

  // Execute
  swaps.forEach(([slotA, slotB]) => {
    const tmp = teamA.assets[slotA];
    teamA.assets[slotA] = teamB.assets[slotB];
    teamB.assets[slotB] = tmp;
  });

  // Update champ entries (driver names attached to teamId/slot)
  ['driver1','driver2'].forEach(slot => {
    const dk = driverKey(teamA.id, slot);
    const a = getAsset(teamA.assets[slot]);
    if (a && APP.champ.drivers[dk]) APP.champ.drivers[dk].name = a.name;
    const dkB = driverKey(teamB.id, slot);
    const b = getAsset(teamB.assets[slot]);
    if (b && APP.champ.drivers[dkB]) APP.champ.drivers[dkB].name = b.name;
  });

  APP.ui.tradeASelected = [];
  APP.ui.tradeBSelected = [];
  saveState();
  renderTrade();
  notify(`✓ Trade executed: ${swaps.length} asset${swaps.length === 1 ? '' : 's'}`, 'success');
}


/* ─── 22. ADMIN PANEL ──────────────────────────────────────── */
function renderAdmin() {
  const teamRows = APP.teams.map(t => {
    const d1 = getAsset(t.assets.driver1);
    const d2 = getAsset(t.assets.driver2);
    const dr = getAsset(t.assets.reserve);
    return `<div class="card card-sm" style="border-left:3px solid ${escHtml(t.color)};">
      <div class="flex gap-8 mb-8">
        <span class="fw-700">${escHtml(t.name)}</span>
        <span class="ml-auto text-xs text-muted">PW: ${t.password ? '••••' : '<span class="text-dim">none</span>'}</span>
        <button class="btn btn-ghost btn-xs" data-team-pw="${t.id}">Set PW</button>
      </div>
      <div class="grid-3" style="gap:8px;">
        <div class="text-xs"><span class="text-muted">Driver 1:</span><br>${d1 ? escHtml(d1.name) : '<span class="text-dim">empty</span>'}</div>
        <div class="text-xs"><span class="text-muted">Driver 2:</span><br>${d2 ? escHtml(d2.name) : '<span class="text-dim">empty</span>'}</div>
        <div class="text-xs"><span class="text-muted text-purple">Reserve:</span><br>${dr ? escHtml(dr.name) : '<span class="text-dim">empty</span>'}</div>
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
      <div class="grid-2">${teamRows || '<div class="text-dim">No teams</div>'}</div>
    </div>

    <div class="admin-section">
      <div class="admin-section-title">Distribution</div>
      <div class="text-xs text-muted mb-12">
        Generate a self-contained HTML package with all current state embedded.
        Share via Google Drive — delegates download and view their team data using the shared delegate password.
      </div>
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
        <button class="btn btn-red" id="reset-all-btn">⚠ Reset Everything</button>
      </div>
    </div>

    <div class="admin-section">
      <div class="admin-section-title">System Info</div>
      <div class="grid-3">
        <div class="stat-row"><span class="stat-label">Teams</span><span class="stat-val">${APP.teams.length}</span></div>
        <div class="stat-row"><span class="stat-label">Assets</span><span class="stat-val">${allAssets().length}</span></div>
        <div class="stat-row"><span class="stat-label">Races Done</span><span class="stat-val">${APP.season.calendar.filter(r => r.completed).length}/${APP.season.calendar.length}</span></div>
        <div class="stat-row"><span class="stat-label">FP</span><span class="stat-val">${APP.fpData ? '✓' : '—'}</span></div>
        <div class="stat-row"><span class="stat-label">Season Started</span><span class="stat-val">${APP.season.started ? '✓' : '—'}</span></div>
        <div class="stat-row"><span class="stat-label">Round</span><span class="stat-val">${APP.season.currentRound}</span></div>
      </div>
    </div>
  `;
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

  document.getElementById('export-package-btn').addEventListener('click', exportPackage);
  document.getElementById('export-state-btn').addEventListener('click', exportStateJSON);
  document.getElementById('import-state-input').addEventListener('change', e => {
    if (e.target.files[0]) importStateJSON(e.target.files[0]);
  });

  document.getElementById('reset-fp-btn').addEventListener('click', () => {
    openModal({
      title:'Reset Free Practice?',
      body:'<div class="text-sm">Allows the FP session to be re-run.</div>',
      actions:[
        { label:'Cancel', cls:'btn-ghost', onClick:closeModal },
        { label:'Reset', cls:'btn-red', onClick:() => {
          APP.fpData = null; APP.season.fpDone = false;
          saveState(); closeModal(); notify('Free Practice reset', 'warn');
        }},
      ],
    });
  });
  document.getElementById('reset-season-btn').addEventListener('click', () => {
    openModal({
      title:'Reset Season Progress?',
      body:'<div class="text-sm">Clears all race results, qualifying, and championship standings. Teams and assets remain.</div>',
      actions:[
        { label:'Cancel', cls:'btn-ghost', onClick:closeModal },
        { label:'Reset Season', cls:'btn-red', onClick:() => {
          APP.season.calendar.forEach(r => { r.qualResults = null; r.raceResults = null; r.completed = false; });
          APP.season.currentRound = APP.season.started ? 1 : 0;
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
      title:'Reset EVERYTHING?',
      body:'<div class="text-sm text-accent">This wipes all teams, assets, season data, championships, and passwords. Cannot be undone.</div>',
      actions:[
        { label:'Cancel', cls:'btn-ghost', onClick: closeModal },
        { label:'WIPE EVERYTHING', cls:'btn-red', onClick:() => {
          try { localStorage.removeItem(LS_KEY); } catch(e){}
          location.reload();
        }},
      ],
    });
  });
}

/* ─── Admin helper modals ───────────────────────────────── */
function setTeamPasswordModal(teamId) {
  const team = APP.teams.find(t => t.id === teamId);
  if (!team) return;
  openModal({
    title: `Set password — ${team.name}`,
    body: `
      <div class="text-sm text-muted mb-12">
        Optional. If set, this team can log in directly with their own password
        (skipping the team picker). Leave blank to remove.
      </div>
      <input type="text" id="team-pw-modal-input"
             value="${escHtml(team.password || '')}"
             placeholder="Team password"
             style="width:100%;" />`,
    actions: [
      { label:'Cancel', cls:'btn-ghost', onClick: closeModal },
      { label:'Save', cls:'btn-red', onClick: () => {
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
  const team = APP.teams.find(t => t.id === teamId);
  if (!team) return;

  // Pool of drivers held by THIS team only — we just reorder among slots
  const heldIds = ['driver1','driver2','reserve']
    .map(s => team.assets[s])
    .filter(Boolean);

  const buildSelect = (selectId, currentId) => {
    const opts = ['<option value="">— empty —</option>']
      .concat(heldIds.map(id => {
        const a = getAsset(id);
        return `<option value="${id}" ${currentId === id ? 'selected' : ''}>${escHtml(a?.name || id)}</option>`;
      })).join('');
    return `<select id="${selectId}" style="min-width:180px;">${opts}</select>`;
  };

  const d1 = getAsset(team.assets.driver1);
  const d2 = getAsset(team.assets.driver2);
  const dr = getAsset(team.assets.reserve);

  openModal({
    title: `Driver Lineup — ${team.name}`,
    body: `
      <div class="text-sm text-muted mb-12">
        Reassign your three drivers among the Driver 1, Driver 2, and Reserve slots.
        Championship points stay with the slot, not the driver.
      </div>
      <div class="modal-list">
        <div class="modal-list-item">
          <span class="text-xs text-muted" style="min-width:74px;">Driver 1</span>
          <div class="flex-1 text-xs text-muted">Currently: ${d1 ? escHtml(d1.name) : 'empty'}</div>
          ${buildSelect('swap-d1', team.assets.driver1)}
        </div>
        <div class="modal-list-item">
          <span class="text-xs text-muted" style="min-width:74px;">Driver 2</span>
          <div class="flex-1 text-xs text-muted">Currently: ${d2 ? escHtml(d2.name) : 'empty'}</div>
          ${buildSelect('swap-d2', team.assets.driver2)}
        </div>
        <div class="modal-list-item" style="background:rgba(171,71,188,0.06);">
          <span class="text-xs text-purple" style="min-width:74px;">Reserve</span>
          <div class="flex-1 text-xs text-muted">Currently: ${dr ? escHtml(dr.name) : 'empty'}</div>
          ${buildSelect('swap-dr', team.assets.reserve)}
        </div>
      </div>`,
    actions: [
      { label:'Cancel', cls:'btn-ghost', onClick: closeModal },
      { label:'Apply', cls:'btn-red', onClick: () => {
        const n1 = document.getElementById('swap-d1').value || null;
        const n2 = document.getElementById('swap-d2').value || null;
        const nr = document.getElementById('swap-dr').value || null;

        const picks = [n1, n2, nr].filter(Boolean);
        if (new Set(picks).size !== picks.length) {
          notify('Each driver can only fill one slot', 'error'); return;
        }

        team.assets.driver1 = n1;
        team.assets.driver2 = n2;
        team.assets.reserve = nr;

        // Sync championship driver entries — points stay attached to the slot
        ['driver1','driver2'].forEach(slot => {
          const dk = driverKey(team.id, slot);
          const a = getAsset(team.assets[slot]);
          if (a && APP.champ.drivers[dk]) {
            APP.champ.drivers[dk].name = a.name;
            APP.champ.drivers[dk].driverId = a.id;
          } else if (a && !APP.champ.drivers[dk] && APP.season.started) {
            APP.champ.drivers[dk] = {
              name: a.name, teamId: team.id, teamName: team.name, teamColor: team.color,
              slot, driverId: a.id,
              points:0, wins:0, podiums:0, poles:0, fl:0, dnfs:0, history:[],
            };
          }
        });

        saveState(); closeModal(); renderAdmin(); updateSidebar();
        notify(`Lineup updated — ${team.name}`, 'success');
      }},
    ],
  });
}

function activateReserveModal(teamId) {
  const team = APP.teams.find(t => t.id === teamId);
  if (!team) return;
  const dr = getAsset(team.assets.reserve);
  if (!dr) { notify('No reserve driver assigned', 'warn'); return; }
  const d1 = getAsset(team.assets.driver1);
  const d2 = getAsset(team.assets.driver2);

  openModal({
    title: `Activate Reserve — ${team.name}`,
    body: `
      <div class="text-sm mb-12">
        Promote <span class="fw-700 text-purple">${escHtml(dr.name)}</span> into a race seat.
        The current driver in that seat moves to Reserve.
      </div>
      <div class="flex gap-8 flex-col">
        <button class="btn btn-ghost btn-full" data-promote-to="driver1">
          Replace Driver 1${d1 ? ` — ${escHtml(d1.name)}` : ''}
        </button>
        <button class="btn btn-ghost btn-full" data-promote-to="driver2">
          Replace Driver 2${d2 ? ` — ${escHtml(d2.name)}` : ''}
        </button>
      </div>`,
    actions: [{ label:'Cancel', cls:'btn-ghost', onClick: closeModal }],
  });

  document.querySelectorAll('[data-promote-to]').forEach(btn => {
    btn.addEventListener('click', () => {
      const slot = btn.dataset.promoteTo;
      const oldDriver = team.assets[slot];
      team.assets[slot] = team.assets.reserve;
      team.assets.reserve = oldDriver;

      // Update championship entry — points stay with the slot
      const dk = driverKey(team.id, slot);
      const newRacer = getAsset(team.assets[slot]);
      if (newRacer && APP.champ.drivers[dk]) {
        APP.champ.drivers[dk].name = newRacer.name;
        APP.champ.drivers[dk].driverId = newRacer.id;
      } else if (newRacer && !APP.champ.drivers[dk] && APP.season.started) {
        APP.champ.drivers[dk] = {
          name: newRacer.name, teamId: team.id, teamName: team.name, teamColor: team.color,
          slot, driverId: newRacer.id,
          points:0, wins:0, podiums:0, poles:0, fl:0, dnfs:0, history:[],
        };
      }
      saveState(); closeModal(); renderAdmin(); updateSidebar();
      notify(`${escHtml(newRacer.name)} promoted to ${slot === 'driver1' ? 'Driver 1' : 'Driver 2'}`, 'success');
    });
  });
}

/* ─── Distribution: package export + state import/export ─── */

// Builds a self-contained HTML file with styles + JS + state inlined,
// then triggers a download. Falls back to JSON-only export if fetch fails.
async function exportPackage() {
  try {
    notify('Building package…', 'blue');

    // Try to inline styles.css and app.js so the package needs no companion files
    let cssText = '', jsText = '';
    try { cssText = await (await fetch('styles.css')).text(); } catch(e){}
    try { jsText  = await (await fetch('app.js')).text(); } catch(e){}

    if (!cssText || !jsText) {
      notify('⚠ Could not bundle CSS/JS (file:// blocks fetch). Use State JSON export instead.', 'warn');
      return;
    }

    // Strip the script tag that loads app.js externally — we'll inline it
    let htmlSource = document.documentElement.outerHTML;
    htmlSource = htmlSource.replace(/<link[^>]*href=["']styles\.css["'][^>]*>/i, `<style>${cssText}</style>`);

    // Embed current state into the JS by replacing the marker
    const stateSnapshot = {
      auth: APP.auth, season: APP.season, champ: APP.champ,
      teams: APP.teams, prices: APP.prices, fpData: APP.fpData,
      ASSET_DB,
    };
    const stateJson = JSON.stringify(stateSnapshot);
    const embeddedJs = jsText.replace(
      /\/\*EMBED_STATE_START\*\/[\s\S]*?\/\*EMBED_STATE_END\*\//,
      `/*EMBED_STATE_START*/${stateJson}/*EMBED_STATE_END*/`
    );

    htmlSource = htmlSource.replace(
      /<script[^>]*src=["']app\.js["'][^>]*><\/script>/i,
      `<script>${embeddedJs}</script>`
    );

    const blob = new Blob(['<!DOCTYPE html>\n', htmlSource], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const stamp = new Date().toISOString().slice(0, 10);
    const safeName = APP.season.name.replace(/[^a-z0-9]+/gi, '_');
    a.href = url;
    a.download = `${safeName}_${stamp}_R${APP.season.currentRound}.html`;
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);

    notify('✓ Package ready — share via Google Drive', 'success');
  } catch (err) {
    console.error(err);
    notify('Export failed: ' + err.message, 'error');
  }
}

function exportStateJSON() {
  const snapshot = {
    auth: APP.auth, season: APP.season, champ: APP.champ,
    teams: APP.teams, prices: APP.prices, fpData: APP.fpData,
    ASSET_DB, exportedAt: new Date().toISOString(),
  };
  const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const stamp = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `f1mun_state_${stamp}.json`;
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
        body: `<div class="text-sm">
          This will <span class="text-accent fw-700">REPLACE</span> all current data
          with the contents of <span class="mono">${escHtml(file.name)}</span>.
          ${data.exportedAt ? `<br><br><span class="text-xs text-muted">Exported ${new Date(data.exportedAt).toLocaleString()}</span>` : ''}
        </div>`,
        actions: [
          { label:'Cancel', cls:'btn-ghost', onClick: closeModal },
          { label:'Import & Replace', cls:'btn-red', onClick: () => {
            if (data.auth)    APP.auth   = data.auth;
            if (data.season)  APP.season = data.season;
            if (data.champ)   APP.champ  = data.champ;
            if (data.teams)   APP.teams  = data.teams;
            if (data.prices)  APP.prices = data.prices;
            if (data.fpData)  APP.fpData = data.fpData;
            if (data.ASSET_DB) ASSET_DB  = data.ASSET_DB;
            saveState(); closeModal();
            notify('✓ State imported', 'success');
            setTimeout(() => location.reload(), 800);
          }},
        ],
      });
    } catch (err) {
      notify('Invalid JSON file: ' + err.message, 'error');
    }
  };
  reader.readAsText(file);
}
/* ─── 23. MODAL HELPERS ────────────────────────────────────── */
/* Generic modal driver. Pass { title, body, actions:[{label, cls, onClick}] }.
   Body accepts an HTML string. Actions render as buttons in the footer.   */

function openModal({ title = 'Modal', body = '', actions = [] } = {}) {
  const overlay = document.getElementById('modal-overlay');
  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-body').innerHTML = body;

  const actionsRoot = document.getElementById('modal-actions');
  actionsRoot.innerHTML = '';
  actions.forEach(a => {
    const btn = document.createElement('button');
    btn.className = `btn ${a.cls || 'btn-ghost'}`;
    btn.textContent = a.label;
    btn.addEventListener('click', () => {
      try { a.onClick?.(); } catch (e) { console.error(e); }
    });
    actionsRoot.appendChild(btn);
  });

  overlay.hidden = false;
}

function closeModal() {
  document.getElementById('modal-overlay').hidden = true;
  document.getElementById('modal-body').innerHTML = '';
  document.getElementById('modal-actions').innerHTML = '';
}


/* ─── 24. NOTIFICATIONS ────────────────────────────────────── */
/* Lightweight toast stack. Auto-dismiss after 3.2s with fade-out.
   Types: '' (red, default), 'success', 'blue', 'error', 'warn'.   */

function notify(msg, type = '') {
  const container = document.getElementById('notif-container');
  if (!container) return;
  const el = document.createElement('div');
  el.className = `notif ${type ? 'notif-' + type : ''}`;
  el.textContent = msg;
  container.appendChild(el);

  // Cap visible toasts
  while (container.children.length > 5) {
    container.removeChild(container.firstChild);
  }

  setTimeout(() => {
    el.classList.add('fade-out');
    setTimeout(() => el.remove(), 320);
  }, 3200);
}


/* ─── 25. INIT / EVENT BINDINGS ────────────────────────────── */
/* Single bootstrap function. Wires every static element from the HTML
   to its handler. Anything injected dynamically by render functions
   binds its own listeners inline.                                     */

function init() {
  // Restore prior session data (or embedded snapshot)
  loadState();

  // ─── Login screen ──────────────────────────────────────────
  document.getElementById('login-submit-btn')
    .addEventListener('click', attemptLogin);

  document.getElementById('login-pw').addEventListener('keydown', e => {
    if (e.key === 'Enter') attemptLogin();
  });

  document.getElementById('login-back-btn')
    .addEventListener('click', showLoginPw);

  // ─── Top nav (static) ──────────────────────────────────────
  document.getElementById('nav-logout-btn')
    .addEventListener('click', logout);

  // ─── Assets toolbar ────────────────────────────────────────
  document.getElementById('csv-file-input')
    .addEventListener('change', e => {
      if (e.target.files[0]) importCSVFile(e.target.files[0]);
      e.target.value = ''; // allow re-import of same file
    });

  document.getElementById('reset-assets-btn')
    .addEventListener('click', resetAssets);

  document.getElementById('sheets-fetch-btn')
    .addEventListener('click', importFromSheets);

  document.getElementById('sheets-url').addEventListener('keydown', e => {
    if (e.key === 'Enter') importFromSheets();
  });

  // ─── Teams page form ───────────────────────────────────────
  document.getElementById('create-team-btn')
    .addEventListener('click', createTeam);

  document.getElementById('new-team-name').addEventListener('keydown', e => {
    if (e.key === 'Enter') createTeam();
  });

  // ─── Season page ──────────────────────────────────────────
  document.getElementById('lock-season-btn')
    .addEventListener('click', lockSeason);

  document.getElementById('unlock-season-btn')
    .addEventListener('click', unlockSeason);

  document.getElementById('season-name-input').addEventListener('change', e => {
    APP.season.name = e.target.value.trim() || APP.season.name;
    saveState();
    if (document.getElementById('page-dashboard').classList.contains('active')) {
      renderDashboard();
    }
  });

  document.getElementById('season-rounds')
    .addEventListener('input', updateCalendarPreview);

  // ─── Modal: close on overlay click ─────────────────────────
  document.getElementById('modal-overlay').addEventListener('click', e => {
    if (e.target.id === 'modal-overlay') closeModal();
  });

  // ─── Global ESC closes modal ───────────────────────────────
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      const overlay = document.getElementById('modal-overlay');
      if (!overlay.hidden) closeModal();
    }
  });

  // ─── Warn before unload during a live race ─────────────────
  window.addEventListener('beforeunload', e => {
    if (APP.race.running) {
      e.preventDefault();
      e.returnValue = 'A race is in progress. Leaving will lose live progress.';
      return e.returnValue;
    }
  });

  // ─── Auto-focus the password field on load ─────────────────
  setTimeout(() => document.getElementById('login-pw')?.focus(), 100);

  // Done
  console.log('%cF1 MUN Race Control', 'color:#e8002d;font-weight:900;font-size:14px;letter-spacing:0.1em;', '— ready');
}

// Boot when DOM is ready (script has `defer` so this is safe)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}