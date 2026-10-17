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

function isFeasible(teamCount, rounds) {
  const { tf, mc } = splitRounds(rounds);
  return teamCount * tf <= TRUE_FALSE.length &&
         teamCount * mc <= MULTIPLE_CHOICE.length;
}

function maxRounds(teamCount) {
  let rounds = 0;
  while (isFeasible(teamCount, rounds + 1)) rounds++;
  return rounds;
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

function buildPlan(teamCount, rounds) {
  const types = makeRoundTypes(rounds);

  const mcPool = shuffle(MULTIPLE_CHOICE);
  const truePool = shuffle(TRUE_FALSE.filter((q) => q.answer === true));
  const falsePool = shuffle(TRUE_FALSE.filter((q) => q.answer === false));
  const usedTopics = new Set();

  // Take a question from a pool, preferring one that shares no fact with the
  // questions already used (so one question never gives away another).
  function take(pool) {
    let index = pool.findIndex((q) => !q.topics.some((t) => usedTopics.has(t)));
    if (index === -1) index = 0; // not enough distinct facts left: unavoidable repeat
    const [question] = pool.splice(index, 1);
    question.topics.forEach((t) => usedTopics.add(t));
    return question;
  }

  let tfRoundNumber = 0;

  return types.map((type) => {
    const questions = [];

    for (let team = 0; team < teamCount; team++) {
      if (type === "mc") {
        questions.push({ kind: "mc", data: take(mcPool) });
      } else {
        // Alternate true/false statements so each team sees a balanced mix.
        const wantTrue = (team + tfRoundNumber) % 2 === 0;
        let pool = wantTrue ? truePool : falsePool;
        if (pool.length === 0) pool = wantTrue ? falsePool : truePool;
        questions.push({ kind: "tf", data: take(pool) });
      }
    }

    if (type === "tf") tfRoundNumber++;
    return { type, questions };
  });
}

// How often does a game of this size have to repeat a fact? (0 to 1)
function repeatRate(teamCount, rounds, trials = 40) {
  let repeats = 0;
  for (let i = 0; i < trials; i++) {
    const seen = new Set();
    let clash = false;
    buildPlan(teamCount, rounds).forEach((round) => round.questions.forEach((entry) => {
      if (entry.data.topics.some((t) => seen.has(t))) clash = true;
      entry.data.topics.forEach((t) => seen.add(t));
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
  });

  return problems;
}

/* =====================================================================
   SETUP SCREEN
   ===================================================================== */

function showScreen(name) {
  document.body.dataset.screen = name;
  $("setup").hidden = name !== "setup";
  $("game").hidden = name !== "game";
  $("ranking").hidden = name !== "ranking";
}

function setTheme(name) {
  document.body.dataset.theme = name;

  const box = document.querySelector(".game-box");
  box.classList.remove("theme-flash");
  void box.offsetWidth; // restart the animation
  box.classList.add("theme-flash");
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

function updateRoundOptions() {
  const teamCount = parseInt($("teamCount").value, 10);
  const max = maxRounds(teamCount);
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
  if (repeatRate(teamCount, rounds) > 0.1) {
    text += " ⚠ Long game: some facts will repeat, which can give answers away.";
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

  $("teamCount").addEventListener("change", () => { generateNameInputs(); updateRoundOptions(); });
  $("roundCount").addEventListener("change", updatePlanSummary);
  $("mode").addEventListener("change", updateModeUi);
  $("timeLimit").addEventListener("change", () => { updateBonusWindowOptions(); updateRulesLine(); });
  $("bonusOn").addEventListener("change", updateModeUi);
  $("bonusWindow").addEventListener("change", updateRulesLine);

  $("startBtn").addEventListener("click", startGame);
  $("nextBtn").addEventListener("click", nextTurn);
  $("pauseBtn").addEventListener("click", togglePause);
  $("restartBtn").addEventListener("click", () => restartGame(false));

  generateNameInputs();
  updateRoundOptions();
  updateModeUi();

  const problems = validateBank();
  if (problems.length === 0 && maxRounds(CONFIG.minTeams) === 0) {
    problems.push("Not enough questions for even one round.");
  }
  if (problems.length > 0) {
    $("bankErrors").hidden = false;
    $("bankErrors").textContent = "Problem in questions.js:\n" + problems.join("\n");
    $("bankErrors").style.whiteSpace = "pre-line";
    $("startBtn").disabled = true;
  }

  showScreen("setup");
}

/* =====================================================================
   STARTING AND RESTARTING
   ===================================================================== */

function startGame() {
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
  state.plan = buildPlan(teamCount, rounds);
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

const timer = { elapsed: 0, last: 0, handle: null };

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
  if (limit && timer.elapsed >= limit * 1000) {
    resolveTurn({ timedOut: true });
  }
}

function renderTimer() {
  const { timeLimit, bonus, bonusWindow } = state.settings;
  const box = $("timerBox");
  const seconds = timer.elapsed / 1000;

  box.classList.toggle("no-bar", !timeLimit);
  box.classList.toggle("stopped", state.phase !== "asking");

  if (state.paused) {
    $("timerText").textContent = "⏸ PAUSED";
  } else if (timeLimit) {
    const remaining = Math.max(0, timeLimit - seconds);
    $("timerText").textContent = "⏱ " + Math.ceil(remaining) + "s";

    const ratio = remaining / timeLimit;
    $("timerFill").style.width = ratio * 100 + "%";
    box.classList.toggle("warn", ratio <= 0.5 && ratio > 0.25);
    box.classList.toggle("danger", ratio <= 0.25);
  } else {
    $("timerText").textContent = "⏱ " + Math.floor(seconds) + "s";
  }

  const bonusOpen = bonus && state.phase === "asking" && seconds < bonusWindow;
  $("bonusTag").textContent = bonusOpen ? "⚡ BONUS +" + formatScore(CONFIG.bonusPoints) : "";
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
  $("roundDisplay").textContent =
    `Round ${state.round + 1} of ${state.rounds} · Turn: ${state.teams[state.team].name}`;
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

  // feedback text: verdict (and correct answer) on one line, then the explanation
  let verdict;
  if (timedOut) {
    verdict = "⏰ TIME'S UP!";
  } else if (correct) {
    verdict = `✅ CORRECT! +${formatScore(points)}${bonusEarned ? "  ⚡ speed bonus!" : ""}`;
  } else {
    verdict = "❌ WRONG";
  }
  if (!correct) verdict += "   ·   Correct answer: " + turn.correctLabel;
  const lines = [verdict, turn.data.why];
  state.feedbackText = lines.join("\n");

  const feedback = $("feedback");
  feedback.textContent = "Click here to reveal feedback.";
  feedback.className = "clickable";
  feedback.onclick = revealFeedback;

  $("pauseBtn").disabled = true;
  $("nextBtn").disabled = false;
  renderTimer();
  updateScoreboard();
}

function revealFeedback() {
  if (state.feedbackRevealed) return;
  state.feedbackRevealed = true;

  const feedback = $("feedback");
  feedback.textContent = state.feedbackText;
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
    if (state.phase === "asking" && index === state.team) box.classList.add("active-team");

    const name = document.createElement("div");
    name.className = "team-name";
    name.textContent = team.name;

    const score = document.createElement("div");
    score.className = "team-score";
    score.textContent = formatScore(team.score);

    box.append(name, score);
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
  const medals = { 1: "🥇", 2: "🥈", 3: "🥉" };
  const base = medals[position] || position + "th";
  return isTie ? base + " (tie)" : base;
}

function makeRankCard(team, group) {
  const card = document.createElement("div");
  card.className = "rank-card";

  const medalClass = { 1: "gold", 2: "silver", 3: "bronze" }[group.position];
  if (medalClass) card.classList.add(medalClass);

  const emoji = document.createElement("div");
  emoji.className = "rank-emoji";
  emoji.textContent = positionLabel(group.position, group.teams.length > 1);

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
  const cards = group.teams.map((team) => makeRankCard(team, group));
  cards.forEach((card) => list.prepend(card));

  if (isWinnerGroup) {
    setTimeout(launchConfetti, 400);
    setTimeout(() => {
      const again = document.createElement("button");
      again.id = "playAgainBtn";
      again.textContent = "Restart Game";
      again.style.marginTop = "20px";
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
