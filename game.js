"use strict";

/* =====================================================================
   CLASS GAME ENGINE
   Questions live in questions.js. Normally this file never needs editing,
   except for the small CONFIG block below.
   ===================================================================== */

const CONFIG = {
  minTeams: 2,
  maxTeams: 5,
  nameMaxLength: 12,
  teamColors: ["#ff8c42", "#00a6fb", "#f15bb5", "#9b5de5", "#fee440"], // the coloured strip on each team card

  bonusPoints: 0.5,                       // extra points for a fast, correct answer
  timeLimitOptions: [15, 20, 30, 45, 60], // seconds, as offered in the setup screen
  bonusWindowOptions: [5, 10, 15, 20],    // seconds, as offered in the setup screen
  defaultTimeLimit: 30,
  defaultBonusWindow: 10,
  defaultRounds: 4
};

/* ========= HELPERS ========= */

const $ = (id) => document.getElementById(id);

function shuffle(array) {
  const copy = array.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function formatScore(n) {
  return Number.isInteger(n) ? String(n) : n.toFixed(1);
}

/* ========= 8-BIT SOUND EFFECTS (made with the browser's own synth, no files) ========= */

const sfx = (() => {
  let ctx = null;
  let on = true;
  try { on = localStorage.getItem("classGameSound") !== "off"; } catch (e) { /* storage blocked: stay on */ }

  function audio() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) ctx = new AC();
    }
    if (ctx && ctx.state === "suspended") ctx.resume();
    return ctx;
  }

  function tone(freq, start, length, type = "square", volume = 0.05, slideTo = null) {
    const c = audio();
    if (!c) return;
    const t0 = c.currentTime + start;
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    if (slideTo) osc.frequency.linearRampToValueAtTime(slideTo, t0 + length);
    gain.gain.setValueAtTime(volume, t0);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + length);
    osc.connect(gain);
    gain.connect(c.destination);
    osc.start(t0);
    osc.stop(t0 + length + 0.03);
  }

  const notes = (list, step, length, type) => list.forEach((f, i) => tone(f, i * step, length, type));

  const sounds = {
    click:   () => tone(660, 0, 0.06),
    reveal:  () => notes([392, 523], 0.07, 0.1),
    tick:    () => tone(880, 0, 0.05, "square", 0.035),
    correct: () => notes([523, 659, 784, 1047], 0.09, 0.12),
    bonus:   () => notes([523, 659, 784, 1047, 1319, 1568], 0.07, 0.12),
    wrong:   () => { tone(220, 0, 0.18, "sawtooth", 0.06, 150); tone(150, 0.18, 0.28, "sawtooth", 0.06, 90); },
    timeup:  () => notes([494, 392, 330, 262], 0.12, 0.14, "triangle"),
    win:     () => notes([523, 523, 523, 659, 784, 659, 784, 1047], 0.13, 0.16)
  };

  return {
    get on() { return on; },
    set on(value) { on = value; },
    play(name) {
      if (!on || !sounds[name]) return;
      try { sounds[name](); } catch (e) { /* audio not available: ignore */ }
    }
  };
})();

function setSound(on) {
  sfx.on = on;
  try { localStorage.setItem("classGameSound", on ? "on" : "off"); } catch (e) { /* ignore */ }
  syncSoundUi();
  if (on) sfx.play("click");
}

function syncSoundUi() {
  $("soundSelect").value = sfx.on ? "on" : "off";
  $("soundBtn").innerHTML = sfx.on ? ICONS.soundOn : ICONS.soundOff;
}

/* ========= FLAT PIXEL ICONS (inline SVG, no emoji) ========= */
const ICONS = {
  soundOn:  '<svg class="ico" viewBox="0 0 14 12" aria-hidden="true"><path d="M0 4h2v4H0zM2 3h2v6H2zM4 1h2v10H4zM6 0h2v12H6zM9 4h2v4H9zM12 2h2v8h-2z"/></svg>',
  soundOff: '<svg class="ico" viewBox="0 0 14 12" aria-hidden="true"><path d="M0 4h2v4H0zM2 3h2v6H2zM4 1h2v10H4zM6 0h2v12H6z"/><path d="M9.5 3.5l4 5M13.5 3.5l-4 5" stroke="currentColor" stroke-width="1.5" fill="none"/></svg>',
  bolt:     '<svg class="ico ico-bolt" viewBox="0 0 8 10" aria-hidden="true"><path d="M4 0h4v1h-4zM3 1h4v1h-4zM2 2h4v1h-4zM1 3h7v1h-7zM3 4h5v1h-5zM4 5h3v1h-3zM3 6h3v1h-3zM2 7h3v1h-3zM2 8h2v1h-2zM1 9h2v1h-2z"/></svg>'
};

/* ========= SCREEN EFFECTS ========= */

function restartAnimation(el, className) {
  el.classList.remove(className);
  void el.offsetWidth; // lets the browser restart the animation
  el.classList.add(className);
}

// a little burst of pixels, from the middle of an element
function burstFrom(el, count = 24) {
  const rect = (el || document.querySelector(".dialogue-box")).getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;
  const colors = ["#ffc933", "#5fe08a", "#00a6fb", "#f15bb5", "#ffffff", "#9b5de5"];

  for (let i = 0; i < count; i++) {
    const spark = document.createElement("i");
    spark.className = "spark";
    const angle = Math.random() * Math.PI * 2;
    const distance = 4 + Math.random() * 9;
    spark.style.left = x + "px";
    spark.style.top = y + "px";
    spark.style.background = colors[i % colors.length];
    spark.style.setProperty("--dx", Math.cos(angle) * distance + "rem");
    spark.style.setProperty("--dy", Math.sin(angle) * distance + "rem");
    document.body.appendChild(spark);
    setTimeout(() => spark.remove(), 900);
  }
}

// "+1" floating up from a team card
function popScore(card, text) {
  if (!card) return;
  const pop = document.createElement("span");
  pop.className = "score-pop";
  pop.textContent = text;
  card.appendChild(pop);
  setTimeout(() => pop.remove(), 1200);
}

/* ========= STATE ========= */

const state = {
  phase: "setup",          // setup | asking | answered | ranking
  teams: [],               // { name, score }
  rounds: 0,
  plan: [],                // plan[round] = { type: "mc" | "tf", questions: [one per team] }
  round: 0,
  team: 0,
  settings: { mode: "chill", timeLimit: 0, bonus: false, bonusWindow: 0 },
  turn: null,              // the question currently on screen
  paused: false,
  feedbackText: "",
  feedbackRevealed: false
};

/* =====================================================================
   FAIR ROUND PLANNING
   Every team gets the same number of questions, with the same number of
   true/false ones (they are 50% guessable) and the same number of
   multiple-choice ones. If the number of questions doesn't divide evenly,
   fewer rounds are offered: nobody ever gets an extra turn.
   ===================================================================== */

function splitRounds(rounds) {
  // Odd number of rounds: the extra round is multiple choice (less luck).
  const tf = Math.floor(rounds / 2);
  return { tf, mc: rounds - tf };
}

// A question without a "level" belongs to level 1 (was / were).
function questionLevel(q) {
  return q.level === undefined ? 1 : q.level;
}

// How much of a game each kind of content gets (see LEVELS in questions.js).
function levelMix(level) {
  return LEVELS.find((l) => l.id === level).mix;
}

// Split the rounds of a game between the kinds of content of a level
// (1 = was / were, 2 = regular verbs, 3 = irregular verbs), as close to the
// level's mix as whole rounds allow, with one rule: the newest content is
// always the biggest part, then the next, then was / were (strictly, as soon
// as the game is long enough for that to be possible).
function allocateKinds(rounds, level) {
  const kinds = Object.entries(levelMix(level))
    .map(([category, weight]) => ({ category: Number(category), weight }))
    .sort((a, b) => b.weight - a.weight || b.category - a.category);

  const strictFrom = (i) => i === 0 || rounds >= 2 * kinds.length; // top always, the rest when long enough
  let best = null;

  (function search(i, left, counts) {
    if (i === kinds.length) {
      if (left !== 0) return;
      for (let k = 1; k < kinds.length; k++) {
        if (counts[k] > counts[k - 1]) return;
        if (kinds[k].weight < kinds[k - 1].weight && strictFrom(k - 1) && counts[k] === counts[k - 1] && counts[k - 1] > 0) return;
      }
      const error = counts.reduce((sum, c, k) => sum + (c - kinds[k].weight * rounds) ** 2, 0);
      if (!best || error < best.error - 1e-9) best = { counts: [...counts], error };
      return;
    }
    for (let c = 0; c <= left; c++) search(i + 1, left - c, [...counts, c]);
  })(0, rounds, []);

  if (!best) best = { counts: kinds.map((k, i) => (i === 0 ? rounds : 0)) }; // cannot happen with sane mixes
  const total = {};
  kinds.forEach((k, i) => { total[k.category] = best.counts[i]; });

  // Share each kind between multiple choice and true/false. A kind with an odd
  // number of rounds gives its spare round to MC and TF in turn, so overall
  // MC has the same number of rounds as TF (or one more when rounds is odd).
  const mc = {}, tf = {};
  let spareToMc = true;
  Object.keys(total).map(Number).sort((a, b) => b - a).forEach((category) => {
    const k = total[category];
    mc[category] = Math.floor(k / 2);
    tf[category] = Math.floor(k / 2);
    if (k % 2 === 1) {
      if (spareToMc) mc[category]++; else tf[category]++;
      spareToMc = !spareToMc;
    }
  });
  return { mc, tf };
}

// Questions of ONE kind of content (level 1, 2 or 3), split by question type.
function poolByCategory(category) {
  const tf = TRUE_FALSE.filter((q) => questionLevel(q) === category);
  return {
    mc: MULTIPLE_CHOICE.filter((q) => questionLevel(q) === category),
    trues: tf.filter((q) => q.answer === true),
    falses: tf.filter((q) => q.answer === false)
  };
}

// True/false rounds are numbered in a fixed order (by content kind), and team t
// gets a TRUE statement in round g when (t + g) is even, FALSE otherwise. So
// every team ends up with the same number of true and false statements
// (or differs by one when the number of true/false rounds is odd).
function trueCountInRound(teamCount, slot) {
  return slot % 2 === 0 ? Math.ceil(teamCount / 2) : Math.floor(teamCount / 2);
}

function tfSlotStarts(tfAllocation) {
  const starts = {};
  let next = 0;
  Object.keys(tfAllocation).map(Number).sort((a, b) => a - b).forEach((category) => {
    starts[category] = next;
    next += tfAllocation[category];
  });
  return starts;
}

function isFeasible(teamCount, rounds, level) {
  const { mc: mcAllocation, tf: tfAllocation } = allocateKinds(rounds, level);
  const starts = tfSlotStarts(tfAllocation);

  return Object.keys(levelMix(level)).map(Number).every((category) => {
    const pool = poolByCategory(category);
    if (teamCount * mcAllocation[category] > pool.mc.length) return false;

    let trues = 0;
    for (let j = 0; j < tfAllocation[category]; j++) trues += trueCountInRound(teamCount, starts[category] + j);
    const falses = teamCount * tfAllocation[category] - trues;
    return trues <= pool.trues.length && falses <= pool.falses.length;
  });
}

function maxRounds(teamCount, level) {
  let rounds = 0;
  while (isFeasible(teamCount, rounds + 1, level)) rounds++;
  return rounds;
}

// Topics that matter in a game of this level. "verb-..." topics (one per past
// tense verb) only matter from level 2, when verbs are actually being asked.
function activeTopics(q, level) {
  return q.topics.filter((t) => level > 1 || !t.startsWith("verb-"));
}

// Random order of round types, never three rounds of the same type in a row.
function makeRoundTypes(rounds) {
  const { tf, mc } = splitRounds(rounds);

  for (let attempt = 0; attempt < 500; attempt++) {
    const left = { tf, mc };
    const sequence = [];

    while (sequence.length < rounds) {
      const last = sequence[sequence.length - 1];
      const beforeLast = sequence[sequence.length - 2];
      const choices = ["tf", "mc"].filter(
        (type) => left[type] > 0 && !(type === last && type === beforeLast)
      );
      if (choices.length === 0) break; // dead end, start over

      // pick randomly, weighted by how many rounds of each type remain
      const total = choices.reduce((sum, type) => sum + left[type], 0);
      let roll = Math.random() * total;
      let pick = choices[choices.length - 1];
      for (const type of choices) {
        roll -= left[type];
        if (roll < 0) { pick = type; break; }
      }

      sequence.push(pick);
      left[pick]--;
    }

    if (sequence.length === rounds) return sequence;
  }

  // Fallback: plain alternation (always valid, because tf and mc differ by at most 1).
  const sequence = [];
  let left = { tf, mc };
  let next = mc >= tf ? "mc" : "tf";
  while (sequence.length < rounds) {
    if (left[next] === 0) next = next === "mc" ? "tf" : "mc";
    sequence.push(next);
    left[next]--;
    next = next === "mc" ? "tf" : "mc";
  }
  return sequence;
}

// Builds a plan a few times and keeps one where no fact comes up twice (when
// the questions allow it at all).
function buildPlan(teamCount, rounds, level, attempts = 40) {
  let best = null;
  for (let attempt = 0; attempt < attempts; attempt++) {
    const plan = buildPlanOnce(teamCount, rounds, level);
    if (!best || plan.repeats < best.repeats) best = plan;
    if (best.repeats === 0) break;
  }
  return best;
}

function buildPlanOnce(teamCount, rounds, level) {
  const types = makeRoundTypes(rounds);
  let repeats = 0;

  // Decide what KIND of content each round is about (level 1, 2 or 3).
  // Every team gets a question of that kind in that round, so every team
  // gets exactly the same amount of every kind of content.
  const expand = (allocation) =>
    shuffle(Object.entries(allocation).flatMap(([category, n]) => Array(n).fill(Number(category))));
  const { mc: mcAllocation, tf: tfAllocation } = allocateKinds(rounds, level);
  const categories = { mc: expand(mcAllocation), tf: expand(tfAllocation) };
  const slotStarts = tfSlotStarts(tfAllocation);
  const tfSeen = {};

  const pools = {};
  Object.keys(levelMix(level)).map(Number).forEach((category) => {
    const pool = poolByCategory(category);
    pools[category] = {
      mc: shuffle(pool.mc),
      trues: shuffle(pool.trues),
      falses: shuffle(pool.falses)
    };
  });

  const usedTopics = new Set();

  // Take a question from a pool (it is removed, so a question is never used
  // twice), preferring one that shares no fact with the questions already
  // used, so one question never gives away another.
  function take(pool) {
    let index = pool.findIndex((q) => !activeTopics(q, level).some((t) => usedTopics.has(t)));
    if (index === -1) { index = 0; repeats++; } // not enough distinct facts left: unavoidable repeat
    const [question] = pool.splice(index, 1);
    activeTopics(question, level).forEach((t) => usedTopics.add(t));
    return question;
  }

  const plan = types.map((type) => {
    const category = categories[type].shift();
    const pool = pools[category];
    const questions = [];

    let slot = 0;
    if (type === "tf") {
      tfSeen[category] = (tfSeen[category] || 0) + 1;
      slot = slotStarts[category] + tfSeen[category] - 1;
    }

    for (let team = 0; team < teamCount; team++) {
      if (type === "mc") {
        questions.push({ kind: "mc", data: take(pool.mc) });
      } else {
        // Alternate true/false statements so each team sees a balanced mix.
        const wantTrue = (team + slot) % 2 === 0;
        let source = wantTrue ? pool.trues : pool.falses;
        if (source.length === 0) source = wantTrue ? pool.falses : pool.trues;
        questions.push({ kind: "tf", data: take(source) });
      }
    }

    return { type, category, questions };
  });

  plan.repeats = repeats;
  return plan;
}

// How often does a game of this size have to repeat a fact? (0 to 1)
function repeatRate(teamCount, rounds, level, trials = 20) {
  let repeats = 0;
  for (let i = 0; i < trials; i++) {
    const seen = new Set();
    let clash = false;
    buildPlan(teamCount, rounds, level, 6).forEach((round) => round.questions.forEach((entry) => {
      const topics = activeTopics(entry.data, level);
      if (topics.some((t) => seen.has(t))) clash = true;
      topics.forEach((t) => seen.add(t));
    }));
    if (clash) repeats++;
  }
  return repeats / trials;
}

/* =====================================================================
   QUESTION BANK CHECK  (shows a message on the setup screen if you made
   a typo while editing questions.js)
   ===================================================================== */

function validateBank() {
  const problems = [];
  const validLevels = LEVELS.map((l) => l.id);
  const checkLevel = (q, label) => {
    if (q.level !== undefined && !validLevels.includes(q.level)) {
      problems.push(`${label}: "level" must be ${validLevels.join(", ")}.`);
    }
  };

  LEVELS.forEach((l) => {
    const total = Object.values(l.mix || {}).reduce((sum, w) => sum + w, 0);
    if (!l.mix || Math.abs(total - 1) > 0.001) problems.push(`${l.name}: the "mix" must add up to 1 (100%).`);
    else if (Object.keys(l.mix).some((k) => !validLevels.includes(Number(k)) || Number(k) > l.id)) {
      problems.push(`${l.name}: the "mix" can only use this level and lower ones.`);
    }
  });

  MULTIPLE_CHOICE.forEach((q, i) => {
    const label = `Multiple choice #${i + 1}`;
    if (!q.q) problems.push(`${label}: missing question text.`);
    if (!Array.isArray(q.options) || q.options.length !== OPTIONS_PER_QUESTION) {
      problems.push(`${label}: needs exactly ${OPTIONS_PER_QUESTION} options.`);
      return;
    }
    if (new Set(q.options).size !== q.options.length) {
      problems.push(`${label}: two options are identical.`);
    }
    if (!q.options.includes(q.answer)) {
      problems.push(`${label}: "answer" is not one of the options.`);
    }
    if (!q.why) problems.push(`${label}: missing "why".`);
    if (!Array.isArray(q.topics) || q.topics.length === 0) problems.push(`${label}: missing "topics".`);
    checkLevel(q, label);
  });

  TRUE_FALSE.forEach((q, i) => {
    const label = `True/false #${i + 1}`;
    if (!q.q) problems.push(`${label}: missing statement.`);
    if (!Array.isArray(q.topics) || q.topics.length === 0) problems.push(`${label}: missing "topics".`);
    if (typeof q.answer !== "boolean") problems.push(`${label}: "answer" must be true or false.`);
    if (q.prompt !== undefined && (typeof q.prompt !== "string" || !q.prompt.trim())) {
      problems.push(`${label}: "prompt" must be a text.`);
    }
    if (q.labels !== undefined &&
        !(Array.isArray(q.labels) && q.labels.length === 2 && q.labels[0] && q.labels[1] && q.labels[0] !== q.labels[1])) {
      problems.push(`${label}: "labels" must be two different texts, e.g. ["CORRECT", "INCORRECT"].`);
    }
    if (!q.why) problems.push(`${label}: missing "why".`);
    checkLevel(q, label);
  });

  return problems;
}

// Not an error, but worth a warning: for every kind of content (level 1, 2, 3)
// the number of TRUE and FALSE statements should be equal, otherwise some team
// could get an easier mix.
function levelWarnings() {
  const warnings = [];
  LEVELS.forEach(({ id, name }) => {
    const pool = poolByCategory(id);
    if (pool.trues.length !== pool.falses.length) {
      warnings.push(`${name}: ${pool.trues.length} true and ${pool.falses.length} false statements. Add or remove some so they are equal.`);
    }
  });
  return warnings;
}

/* =====================================================================
   SETUP SCREEN
   ===================================================================== */

function showScreen(name) {
  document.body.dataset.screen = name;
  $("title").textContent = name === "ranking" ? "High Scores" : GAME_TITLE;
  $("setup").hidden = name !== "setup";
  $("game").hidden = name !== "game";
  $("ranking").hidden = name !== "ranking";
}

function setTheme(name) {
  document.body.dataset.theme = name;

  // a quick colour flash over the whole screen for right / wrong / time's up
  if (name !== "purple") restartAnimation($("flash"), "go");
}

function fillSelect(select, values, labelFor, selected) {
  select.innerHTML = "";
  values.forEach((value) => {
    const option = document.createElement("option");
    option.value = String(value);
    option.textContent = labelFor(value);
    if (String(value) === String(selected)) option.selected = true;
    select.appendChild(option);
  });
}

function generateNameInputs() {
  const count = parseInt($("teamCount").value, 10);
  const container = $("teamNames");

  const existing = Array.from(container.querySelectorAll("input")).map((input) => input.value);
  container.innerHTML = "";

  for (let i = 0; i < count; i++) {
    const input = document.createElement("input");
    input.type = "text";
    input.id = "teamName" + i;
    input.className = "team-input";
    input.placeholder = "Team " + (i + 1);
    input.maxLength = CONFIG.nameMaxLength;
    if (existing[i]) input.value = existing[i];
    container.appendChild(input);
  }
}

function currentLevel() {
  return parseInt($("levelSelect").value, 10) || 1;
}

function updateRoundOptions() {
  const teamCount = parseInt($("teamCount").value, 10);
  const max = maxRounds(teamCount, currentLevel());
  const select = $("roundCount");
  const previous = parseInt(select.value, 10);

  select.innerHTML = "";
  for (let i = 1; i <= max; i++) {
    const option = document.createElement("option");
    option.value = String(i);
    option.textContent = i + " round" + (i > 1 ? "s" : "");
    select.appendChild(option);
  }

  if (max > 0) {
    const wanted = previous >= 1 && previous <= max ? previous : Math.min(CONFIG.defaultRounds, max);
    select.value = String(wanted);
  }

  updatePlanSummary();
}

function updatePlanSummary() {
  const rounds = parseInt($("roundCount").value, 10);
  if (!rounds) {
    $("planSummary").textContent = "";
    return;
  }

  const { tf, mc } = splitRounds(rounds);
  const parts = [];
  if (mc) parts.push(`${mc} multiple choice`);
  if (tf) parts.push(`${tf} true/false`);
  let text = `Each team gets ${parts.join(" + ")}.`;

  // Warn when the game is so long that the same fact has to come up twice.
  const teamCount = parseInt($("teamCount").value, 10);
  if (repeatRate(teamCount, rounds, currentLevel()) > 0.1) {
    text += " Long game: some facts will repeat, which can give answers away.";
  }
  $("planSummary").textContent = text;
}

function updateBonusWindowOptions() {
  const limit = parseInt($("timeLimit").value, 10) || 0;
  const select = $("bonusWindow");
  const previous = parseInt(select.value, 10);

  // The bonus window must be shorter than the time limit.
  const allowed = CONFIG.bonusWindowOptions.filter((w) => !limit || w < limit);
  fillSelect(select, allowed, (w) => w + " seconds", allowed.includes(previous) ? previous : null);

  if (!allowed.includes(previous)) {
    const fallback = allowed.includes(CONFIG.defaultBonusWindow)
      ? CONFIG.defaultBonusWindow
      : allowed[allowed.length - 1];
    select.value = String(fallback);
  }
}

function readSettings() {
  if ($("mode").value === "chill") {
    return { mode: "chill", timeLimit: 0, bonus: false, bonusWindow: 0 };
  }

  const bonus = $("bonusOn").checked;
  return {
    mode: "challenge",
    timeLimit: parseInt($("timeLimit").value, 10) || 0,
    bonus,
    bonusWindow: bonus ? parseInt($("bonusWindow").value, 10) || 0 : 0
  };
}

function updateModeUi() {
  const challenge = $("mode").value === "challenge";
  $("challengeOptions").hidden = !challenge;
  $("bonusWindowRow").hidden = !$("bonusOn").checked;
  updateRulesLine();
}

function updateRulesLine() {
  const s = readSettings();

  if (s.mode === "chill") {
    $("rulesLine").textContent = "Chill mode: take your time. 1 point per correct answer.";
    return;
  }

  const rules = ["1 point per correct answer."];
  if (s.timeLimit) rules.push(`${s.timeLimit} seconds per question. If time runs out, the answer counts as wrong.`);
  if (s.bonus) rules.push(`+${formatScore(CONFIG.bonusPoints)} bonus for a correct answer within ${s.bonusWindow} seconds.`);
  $("rulesLine").textContent = rules.join(" ");
}

function initSetup() {
  document.title = GAME_TITLE;
  $("title").textContent = GAME_TITLE;

  const teamCounts = [];
  for (let n = CONFIG.minTeams; n <= CONFIG.maxTeams; n++) teamCounts.push(n);
  fillSelect($("teamCount"), teamCounts, (n) => n + " Teams", 3);

  fillSelect($("timeLimit"), [0, ...CONFIG.timeLimitOptions],
    (s) => (s === 0 ? "No time limit" : s + " seconds"), CONFIG.defaultTimeLimit);
  updateBonusWindowOptions();

  fillSelect($("levelSelect"), LEVELS.map((l) => l.id), (id) => LEVELS.find((l) => l.id === id).name, 1);

  $("teamCount").addEventListener("change", () => { generateNameInputs(); updateRoundOptions(); });
  $("levelSelect").addEventListener("change", updateRoundOptions);
  $("roundCount").addEventListener("change", updatePlanSummary);
  $("mode").addEventListener("change", updateModeUi);
  $("timeLimit").addEventListener("change", () => { updateBonusWindowOptions(); updateRulesLine(); });
  $("bonusOn").addEventListener("change", updateModeUi);
  $("bonusWindow").addEventListener("change", updateRulesLine);

  $("startBtn").addEventListener("click", startGame);
  $("nextBtn").addEventListener("click", nextTurn);
  $("pauseBtn").addEventListener("click", togglePause);
  $("restartBtn").addEventListener("click", () => restartGame(false));
  $("soundSelect").addEventListener("change", () => setSound($("soundSelect").value === "on"));
  $("soundBtn").addEventListener("click", () => setSound(!sfx.on));
  syncSoundUi();

  generateNameInputs();
  updateRoundOptions();
  updateModeUi();

  const problems = validateBank();
  if (problems.length === 0) {
    LEVELS.forEach(({ id, name }) => {
      if (maxRounds(CONFIG.minTeams, id) === 0) problems.push(`${name}: not enough questions for even one round.`);
    });
  }
  const warnings = problems.length === 0 ? levelWarnings() : [];
  if (problems.length > 0 || warnings.length > 0) {
    $("bankErrors").hidden = false;
    const heading = problems.length > 0 ? "Problem in questions.js:" : "Check questions.js:";
    $("bankErrors").textContent = [heading, ...(problems.length > 0 ? problems : warnings)].join("\n");
    $("bankErrors").style.whiteSpace = "pre-line";
    $("startBtn").disabled = problems.length > 0;
  }

  showScreen("setup");
}

/* =====================================================================
   STARTING AND RESTARTING
   ===================================================================== */

function startGame() {
  sfx.play("click");
  const teamCount = parseInt($("teamCount").value, 10);
  const rounds = parseInt($("roundCount").value, 10);
  if (!rounds) return;

  state.teams = [];
  for (let i = 0; i < teamCount; i++) {
    const typed = $("teamName" + i).value.trim();
    state.teams.push({ name: typed || "Team " + (i + 1), score: 0 });
  }

  state.settings = readSettings();
  state.rounds = rounds;
  state.level = currentLevel();
  state.plan = buildPlan(teamCount, rounds, state.level);
  state.round = 0;
  state.team = 0;

  const timerActive = state.settings.timeLimit > 0 || state.settings.bonus;
  $("timerBox").hidden = !timerActive;
  $("pauseBtn").hidden = !timerActive;

  showScreen("game");
  loadTurn();
}

function restartGame(skipConfirm) {
  if (!skipConfirm && state.phase !== "ranking") {
    if (!window.confirm("Restart the game? Scores will be lost.")) return;
  }

  timerStop();
  state.phase = "setup";
  setTheme("purple");
  $("rankingList").innerHTML = "";
  showScreen("setup");
}

/* =====================================================================
   TIMER  (stopwatch with pause; counts elapsed time, not wall-clock)
   ===================================================================== */

const timer = { elapsed: 0, last: 0, handle: null, lastTick: null };

function timerSync() {
  if (timer.handle === null) return;
  const now = performance.now();
  timer.elapsed += now - timer.last;
  timer.last = now;
}

function timerStart() {
  timerStop();
  timer.last = performance.now();
  timer.handle = setInterval(timerTick, 100);
}

function timerStop() {
  timerSync();
  if (timer.handle !== null) clearInterval(timer.handle);
  timer.handle = null;
}

function timerTick() {
  timerSync();
  renderTimer();

  const limit = state.settings.timeLimit;
  if (limit) {
    // tick during the last five seconds
    const left = Math.ceil(limit - timer.elapsed / 1000);
    if (left > 0 && left <= 5 && left !== timer.lastTick) {
      timer.lastTick = left;
      sfx.play("tick");
    }
    if (timer.elapsed >= limit * 1000) resolveTurn({ timedOut: true });
  }
}

function renderTimer() {
  const { timeLimit, bonus, bonusWindow } = state.settings;
  const box = $("timerBox");
  const seconds = timer.elapsed / 1000;

  box.classList.toggle("no-bar", !timeLimit);
  box.classList.toggle("stopped", state.phase !== "asking");

  if (state.paused) {
    $("timerText").textContent = "PAUSED";
  } else if (timeLimit) {
    const remaining = Math.max(0, timeLimit - seconds);
    $("timerText").textContent = Math.ceil(remaining) + "s";

    const ratio = remaining / timeLimit;
    $("timerFill").style.width = ratio * 100 + "%";
    box.classList.toggle("warn", ratio <= 0.5 && ratio > 0.25);
    box.classList.toggle("danger", ratio <= 0.25);
  } else {
    $("timerText").textContent = Math.floor(seconds) + "s";
  }

  const bonusOpen = bonus && state.phase === "asking" && seconds < bonusWindow;
  $("bonusTag").innerHTML = bonusOpen ? ICONS.bolt + " BONUS +" + formatScore(CONFIG.bonusPoints) : "";
}

function togglePause() {
  if (state.phase !== "asking") return;

  if (!state.paused) {
    timerStop();
    state.paused = true;
  } else {
    state.paused = false;
    timerStart();
  }

  $("pauseBtn").textContent = state.paused ? "Resume" : "Pause";
  setOptionsDisabled(state.paused);
  renderTimer();
}

/* =====================================================================
   TURNS
   ===================================================================== */

function isLastTurn() {
  return state.round === state.rounds - 1 && state.team === state.teams.length - 1;
}

function setOptionsDisabled(disabled) {
  document.querySelectorAll("#options .option").forEach((btn) => { btn.disabled = disabled; });
}

// "Round 2/4" + a row of squares (hidden in very long games)
function renderRound() {
  const box = $("roundDisplay");
  box.textContent = "";

  const label = document.createElement("span");
  label.textContent = `Round ${state.round + 1}/${state.rounds}`;
  box.appendChild(label);

  if (state.rounds <= 12) {
    const pips = document.createElement("span");
    pips.className = "pips";
    for (let i = 0; i < state.rounds; i++) {
      const pip = document.createElement("i");
      pip.className = "pip" + (i < state.round ? " done" : i === state.round ? " now" : "");
      pips.appendChild(pip);
    }
    box.appendChild(pips);
  }
}

function loadTurn() {
  const entry = state.plan[state.round].questions[state.team];
  const isTf = entry.kind === "tf";
  const q = entry.data;

  state.phase = "asking";
  state.paused = false;
  state.feedbackRevealed = false;

  // true/false questions can carry their own button labels, e.g. CORRECT / INCORRECT
  const tfLabels = q.labels || ["TRUE", "FALSE"];
  const labels = isTf ? tfLabels : (q.keepOrder ? q.options : shuffle(q.options));
  state.turn = {
    kind: entry.kind,
    data: q,
    correctLabel: isTf ? (q.answer ? tfLabels[0] : tfLabels[1]) : q.answer
  };

  setTheme("purple");

  // header
  renderRound();
  restartAnimation(document.querySelector(".dialogue-box"), "enter");
  timer.lastTick = null;
  $("typeLabel").textContent = isTf ? tfLabels.join(" or ") + "?" : "CHOOSE THE ANSWER";
  $("promptLine").textContent = q.prompt || "";
  $("situation").textContent = q.q;

  // answer buttons
  const optionsDiv = $("options");
  optionsDiv.innerHTML = "";
  optionsDiv.classList.toggle("true-false", isTf);

  labels.forEach((label) => {
    const btn = document.createElement("button");
    btn.className = "option";
    btn.textContent = label;
    btn.dataset.label = label;
    btn.addEventListener("click", () => resolveTurn({ choice: label }));
    optionsDiv.appendChild(btn);
  });

  // feedback + buttons
  const feedback = $("feedback");
  feedback.textContent = "Discuss and choose an answer.";
  feedback.className = "";
  feedback.onclick = null;

  $("nextBtn").disabled = true;
  $("nextBtn").textContent = isLastTurn() ? "Finish" : "Next";
  $("pauseBtn").disabled = false;
  $("pauseBtn").textContent = "Pause";

  updateScoreboard();

  // timer
  timer.elapsed = 0;
  const timerActive = state.settings.timeLimit > 0 || state.settings.bonus;
  if (timerActive) {
    $("timerFill").style.width = "100%";
    $("timerBox").classList.remove("warn", "danger");
    renderTimer();
    timerStart();
  }
}

function resolveTurn({ choice = null, timedOut = false }) {
  if (state.phase !== "asking") return;

  state.phase = "answered";
  state.paused = false;
  timerStop();

  const turn = state.turn;
  const team = state.teams[state.team];
  const { bonus, bonusWindow } = state.settings;

  const correct = !timedOut && choice === turn.correctLabel;

  // scoring
  let points = 0;
  let bonusEarned = false;
  if (correct) {
    points = 1;
    if (bonus && timer.elapsed <= bonusWindow * 1000) {
      points += CONFIG.bonusPoints;
      bonusEarned = true;
    }
  }
  team.score += points;

  // mark the buttons (the correct one is only highlighted once feedback is revealed)
  setOptionsDisabled(true);
  const picked = Array.from(document.querySelectorAll("#options .option"))
    .find((btn) => btn.dataset.label === choice);
  if (picked) picked.classList.add("selected");
  turn.pickedLabel = choice;

  // theme
  setTheme(timedOut ? "yellow" : correct ? "green" : "red");

  // feedback: a coloured verdict, the correct answer if they missed it, then the explanation
  let verdict;
  if (timedOut) {
    verdict = "TIME'S UP!";
  } else if (correct) {
    verdict = `CORRECT! +${formatScore(points)}`;
  } else {
    verdict = "WRONG";
  }
  state.feedbackParts = {
    verdict,
    bonus: Boolean(correct && bonusEarned),
    answerLine: correct ? "" : "Correct answer: " + turn.correctLabel,
    why: turn.data.why
  };

  const feedback = $("feedback");
  feedback.textContent = "Click here to reveal feedback.";
  feedback.className = "clickable";
  feedback.onclick = revealFeedback;

  $("pauseBtn").disabled = true;
  $("nextBtn").disabled = false;
  renderTimer();
  updateScoreboard();

  // effects
  if (correct) {
    sfx.play(bonusEarned ? "bonus" : "correct");
    burstFrom(picked);
    popScore(document.querySelectorAll("#scoreboard .team-box")[state.team], "+" + formatScore(points));
  } else {
    sfx.play(timedOut ? "timeup" : "wrong");
    restartAnimation(document.querySelector(".game-box"), "shake");
  }
}

function renderFeedback(feedback) {
  const { verdict, answerLine, why } = state.feedbackParts;
  feedback.textContent = "";

  const chip = document.createElement("span");
  chip.className = "verdict";
  chip.textContent = verdict;
  if (state.feedbackParts.bonus) chip.insertAdjacentHTML("beforeend", " " + ICONS.bolt + " SPEED BONUS");
  feedback.appendChild(chip);

  if (answerLine) {
    const answer = document.createElement("span");
    answer.className = "answer-line";
    answer.textContent = answerLine;
    feedback.appendChild(answer);
  }

  feedback.appendChild(document.createTextNode("\n" + why));
}

function revealFeedback() {
  if (state.feedbackRevealed) return;
  state.feedbackRevealed = true;

  const feedback = $("feedback");
  renderFeedback(feedback);
  feedback.className = "revealed";
  feedback.onclick = null;

  const turn = state.turn;
  document.querySelectorAll("#options .option").forEach((btn) => {
    if (btn.dataset.label === turn.correctLabel) btn.classList.add("correct");
    else if (btn.dataset.label === turn.pickedLabel) btn.classList.add("wrong");
  });
}

function nextTurn() {
  if (state.phase !== "answered") return;
  sfx.play("click");

  if (isLastTurn()) {
    showRanking();
    return;
  }

  state.team++;
  if (state.team >= state.teams.length) {
    state.team = 0;
    state.round++;
  }
  loadTurn();
}

function updateScoreboard() {
  const container = $("scoreboard");
  container.innerHTML = "";

  state.teams.forEach((team, index) => {
    const box = document.createElement("div");
    box.className = "team-box";
    box.style.setProperty("--team", CONFIG.teamColors[index % CONFIG.teamColors.length]);
    if (index === state.team) box.classList.add("active-team");

    const band = document.createElement("div");
    band.className = "team-band";

    const name = document.createElement("div");
    name.className = "team-name";
    name.textContent = team.name;

    const score = document.createElement("div");
    score.className = "team-score";
    score.textContent = formatScore(team.score);

    box.append(band, name, score);
    container.appendChild(box);
  });
}

/* =====================================================================
   RANKING SCREEN  (revealed from last place up to the winner)
   ===================================================================== */

let revealQueue = [];

function showRanking() {
  state.phase = "ranking";
  setTheme("purple");
  showScreen("ranking");

  // Group teams with equal scores; position = 1 + number of teams scoring higher.
  const scores = [...new Set(state.teams.map((t) => t.score))].sort((a, b) => b - a);
  const groups = scores.map((score) => ({
    score,
    position: 1 + state.teams.filter((t) => t.score > score).length,
    teams: state.teams.filter((t) => t.score === score)
  }));
  revealQueue = groups.reverse(); // lowest first, winner last

  const list = $("rankingList");
  list.innerHTML = "";

  const button = document.createElement("button");
  button.id = "revealBtn";
  button.textContent = "Click to reveal ranking";
  button.addEventListener("click", () => {
    button.remove();
    revealNextGroup();
  });
  list.appendChild(button);
}

function positionLabel(position, isTie) {
  const label = document.createElement("span");
  if (position <= 3) {
    const medal = document.createElement("span");
    medal.className = "medal medal-" + position;
    medal.textContent = position;
    label.appendChild(medal);
  } else {
    label.textContent = position + "th";
  }
  if (isTie) label.appendChild(document.createTextNode(" (tie)"));
  return label;
}

function makeRankCard(team, group) {
  const card = document.createElement("div");
  card.className = "rank-card";

  const medalClass = { 1: "gold", 2: "silver", 3: "bronze" }[group.position];
  if (medalClass) card.classList.add(medalClass);

  const emoji = document.createElement("div");
  emoji.className = "rank-emoji";
  emoji.appendChild(positionLabel(group.position, group.teams.length > 1));

  const name = document.createElement("div");
  name.className = "rank-name";
  name.textContent = team.name;

  const score = document.createElement("div");
  score.className = "rank-score";
  score.textContent = formatScore(team.score) + (team.score === 1 ? " pt" : " pts");

  card.append(emoji, name, score);
  return card;
}

function revealNextGroup() {
  const group = revealQueue.shift();
  if (!group) return;

  const list = $("rankingList");
  const isWinnerGroup = revealQueue.length === 0;
  sfx.play(isWinnerGroup ? "win" : "reveal");
  const cards = group.teams.map((team) => makeRankCard(team, group));
  cards.forEach((card) => list.prepend(card));

  if (isWinnerGroup) {
    setTimeout(launchConfetti, 400);
    setTimeout(() => {
      const again = document.createElement("button");
      again.id = "playAgainBtn";
      again.textContent = "Restart Game";
      again.addEventListener("click", () => restartGame(true));
      list.appendChild(again);
    }, 600);
    return;
  }

  // Click the newest card to reveal the next place.
  let advanced = false;
  cards.forEach((card) => {
    card.classList.add("clickable");
    card.addEventListener("click", () => {
      if (advanced) return;
      advanced = true;
      cards.forEach((c) => c.classList.remove("clickable"));
      setTimeout(revealNextGroup, revealQueue.length === 1 ? 1200 : 700);
    });
  });
}

function launchConfetti() {
  for (let i = 0; i < 40; i++) {
    const piece = document.createElement("div");
    piece.className = "confetti";
    piece.style.left = Math.random() * 100 + "%";
    piece.style.animationDuration = Math.random() + 1 + "s";
    document.body.appendChild(piece);
    setTimeout(() => piece.remove(), 2000);
  }
}

/* ========= INIT ========= */

window.addEventListener("DOMContentLoaded", initSetup);
