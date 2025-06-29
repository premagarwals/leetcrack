// Polyfill for browser.* APIs in Chrome
if (typeof browser === "undefined") {
  var browser = {};
  browser.storage = {
    local: {
      get: (keys) => new Promise(resolve => chrome.storage.local.get(keys, resolve)),
      set: (items) => new Promise(resolve => chrome.storage.local.set(items, resolve)),
      remove: (keys) => new Promise(resolve => chrome.storage.local.remove(keys, resolve)),
    }
  };
  browser.runtime = chrome.runtime;
  browser.tabs = {
    query: (queryInfo) => new Promise(resolve => chrome.tabs.query(queryInfo, resolve)),
    sendMessage: (tabId, msg) => new Promise(resolve => chrome.tabs.sendMessage(tabId, msg, resolve)),
  };
}

const companySelect = document.getElementById("company-select");
const form = document.getElementById("practice-form");
const output = document.getElementById("output");
const timerDiv = document.getElementById("timer");
const revokeBtn = document.getElementById("revoke-btn");

const storage = browser.storage;
const runtime = browser.runtime;
const tabs = browser.tabs;

let timerInterval = null;

// Utility: Load company names from companies.json
async function loadCompanies() {
  const url = runtime.getURL("company_questions/companies.json");
  const res = await fetch(url);
  const companies = await res.json();
  companySelect.innerHTML = companies.map(c => `<option value="${c}">${c}</option>`).join("");
}

// Utility: Fetch solved questions from content script
async function fetchSolved() {
  const tabArr = await tabs.query({ active: true, currentWindow: true });
  const tabId = tabArr[0].id;
  try {
    const response = await tabs.sendMessage(tabId, { action: "getSolved" });
    if (!response || !response.success) return [];
    return response.data.map(q => q.title);
  } catch {
    return [];
  }
}

// Utility: Load company questions from generated JSON
async function loadCompanyQuestions(company) {
  // You may need to fetch from your extension's assets or use a web-accessible resource
  // For demo, let's assume you have company_questions/Company.json as a web-accessible resource
  const url = runtime.getURL(`company_questions/${company.replace(/ /g, "_")}.json`);
  const res = await fetch(url);
  return res.json();
}

// Utility: Save state
function saveState(state) {
  return storage.local.set({ practiceState: state });
}

// Utility: Load state
function loadState() {
  return storage.local.get("practiceState").then(res => res.practiceState);
}

// Utility: Clear state
function clearState() {
  return storage.local.remove("practiceState");
}

// Utility: Shuffle array
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Show timer as a progress bar
function showTimer(endTime) {
  const timerBarWrap = document.getElementById("timer-bar-wrap");
  const timerBar = document.getElementById("timer-bar");
  const timerLabel = document.getElementById("timer-label");
  timerBarWrap.classList.remove("hidden");

  function update() {
    const now = Date.now();
    const diff = Math.max(0, endTime - now);
    const total = endTime - (window.practiceStartTime || (endTime - diff));
    const percent = Math.max(0, Math.min(100, (diff / total) * 100));
    timerBar.style.width = percent + "%";
    const min = Math.floor(diff / 60000);
    const sec = Math.floor((diff % 60000) / 1000);
    timerLabel.textContent = `${String(Math.floor(min / 60)).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
    if (diff <= 0) {
      clearInterval(timerInterval);
      clearState().then(() => location.reload());
    }
  }
  window.practiceStartTime = Date.now();
  update();
  timerInterval = setInterval(update, 1000);
}

// Render questions as cards with tags
function renderQuestions(questions, solvedTitles) {
  output.innerHTML = "";
  questions.forEach(q => {
    const card = document.createElement("div");
    card.className = "question-card" + (solvedTitles.includes(q.title) ? " solved " : "") + ` ${q.difficulty.toLowerCase()}-card`;
    card.innerHTML = `
      <a href="${q.link}" class="question-title" target="_blank">${q.title}</a>
      <div class="question-meta">
        <span class="${q.difficulty.toLowerCase()}">${q.difficulty}</span>
      </div>
      <div class="tags">
        ${(q.tags || []).map(tag => `<span class="tag">${tag}</span>`).join("")}
      </div>
    `;
    output.appendChild(card);
  });
}

// Bind revoke button ONCE, outside main()
revokeBtn.onclick = async () => {
  await clearState();
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  showFormView(); // <-- Show left panel after leaving test
};

// Utility: Show questions view
function showQuestionsView() {
  document.querySelector('.left-panel').classList.add('hidden');
  document.querySelector('.right-panel').classList.remove('hidden');
}

// Utility: Show form view
function showFormView() {
  document.querySelector('.left-panel').classList.remove('hidden');
  document.querySelector('.right-panel').classList.add('hidden');
}

// Main logic
async function main() {
  await loadCompanies();

  const timerBarWrap = document.getElementById("timer-bar-wrap");

  // Check for active state
  const state = await loadState();
  if (state && Date.now() < state.endTime) {
    showQuestionsView(); // <-- Show right panel
    revokeBtn.classList.remove("hidden");
    timerBarWrap.classList.remove("hidden");
    showTimer(state.endTime);

    // Check which questions are solved
    const solvedTitles = await fetchSolved();
    renderQuestions(state.questions, solvedTitles);
    return;
  } else {
    showFormView(); // <-- Show left panel
    revokeBtn.classList.add("hidden");
    timerBarWrap.classList.add("hidden");
    output.innerHTML = "";
    if (timerInterval) clearInterval(timerInterval);
    await clearState();
  }

  // Form submit
  form.onsubmit = async e => {
    e.preventDefault();
    const company = companySelect.value;
    const easy = parseInt(document.getElementById("easy-count").value, 10);
    const medium = parseInt(document.getElementById("medium-count").value, 10);
    const hard = parseInt(document.getElementById("hard-count").value, 10);
    const hh = parseInt(document.getElementById("duration-hh").value, 10) || 0;
    const mm = parseInt(document.getElementById("duration-mm").value, 10) || 0;
    const ss = parseInt(document.getElementById("duration-ss").value, 10) || 0;
    const duration = hh * 3600 + mm * 60 + ss; // duration in seconds

    // Fetch all questions for company
    const allQuestions = await loadCompanyQuestions(company);

    // Fetch solved
    const solvedTitles = await fetchSolved();

    // Filter out solved and premium questions
    const unsolved = allQuestions.filter(
      q => !solvedTitles.includes(q.title)
    );

    // Remove duplicates by title
    const uniqueUnsolved = [];
    const seenTitles = new Set();
    for (const q of unsolved) {
      if (!seenTitles.has(q.title)) {
        uniqueUnsolved.push(q);
        seenTitles.add(q.title);
      }
    }

    // Pick random questions by difficulty
    const easyQs = shuffle(uniqueUnsolved.filter(q => q.difficulty === "EASY")).slice(0, easy);
    const mediumQs = shuffle(uniqueUnsolved.filter(q => q.difficulty === "MEDIUM")).slice(0, medium);
    const hardQs = shuffle(uniqueUnsolved.filter(q => q.difficulty === "HARD")).slice(0, hard);

    const questions = [...easyQs, ...mediumQs, ...hardQs];
    if (questions.length === 0) {
      output.textContent = "No unsolved questions available for this selection.";
      return;
    }

    // Save state
    const endTime = Date.now() + duration * 1000;
    await saveState({ questions, endTime, company, easy, medium, hard, duration });

    // Show timer and questions
    showQuestionsView(); // <-- Show right panel after generating set
    revokeBtn.classList.remove("hidden");
    showTimer(endTime);
    renderQuestions(questions, []);
  };
}

main();
