/*
  Cricket Score Dashboard
  Fetches live match data from a public cricket API and renders it.

  NOTE: Replace `API_KEY` with your own key and ensure the API endpoint is valid.
*/

const config = {
  apiKey: "7b825f9584mshdb20fb5b597196cp1711d3jsncd6b3ebd173e", // <-- Set your API key here (do NOT commit your key into a public repo)
  // Example: https://cricapi.com/api/matches?apikey=YOUR_KEY
  apiUrl: "https://cricapi.com/api/matches",
  refreshIntervalMs: 30_000, // auto-refresh every 30 seconds
};

const state = {
  matches: [],
  lastFetch: null,
  isAutoRefreshEnabled: false,
  refreshTimer: null,
};

const elements = {
  matchesContainer: document.getElementById("matches"),
  statusMessage: document.getElementById("statusMessage"),
  searchInput: document.getElementById("search"),
  clearSearchBtn: document.getElementById("clearSearch"),
  refreshBtn: document.getElementById("refreshBtn"),
  autoRefreshToggle: document.getElementById("autoRefresh"),
};

function setStatus(message, type = "info") {
  if (!elements.statusMessage) return;
  elements.statusMessage.textContent = message;
  elements.statusMessage.style.color = type === "error" ? "#ff7c7c" : "var(--muted)";
}

function formatScore(score) {
  if (!score) return "-";
  // Example score string may already be formatted
  return score;
}

function formatMatchStatus(match) {
  if (match.matchStarted === false) {
    return "Upcoming";
  }

  if (match.matchStarted === true && match.score) {
    return "Live";
  }

  return match.matchStarted ? "Ongoing" : "TBD";
}

function buildMatchCard(match) {
  const card = document.createElement("article");
  card.className = "match-card";

  const title = document.createElement("h2");
  title.className = "match-title";
  title.textContent = match['team-1'] && match['team-2'] ? `${match['team-1']} vs ${match['team-2']}` : match.description || "Unknown Match";
  card.appendChild(title);

  const meta = document.createElement("div");
  meta.className = "match-meta";

  const statusLabel = document.createElement("span");
  statusLabel.className = "label";
  statusLabel.innerHTML = `<span>${formatMatchStatus(match)}</span>`;
  meta.appendChild(statusLabel);

  if (match.date) {
    const dateLabel = document.createElement("span");
    dateLabel.className = "label";
    dateLabel.innerHTML = `<span>${new Date(match.date).toLocaleDateString()}</span>`;
    meta.appendChild(dateLabel);
  }

  if (match.type) {
    const typeLabel = document.createElement("span");
    typeLabel.className = "label";
    typeLabel.innerHTML = `<span>${match.type.toUpperCase()}</span>`;
    meta.appendChild(typeLabel);
  }

  card.appendChild(meta);

  if (match.score) {
    const scoreRows = document.createElement("div");
    scoreRows.className = "score-rows";
    scoreRows.style.display = "grid";
    scoreRows.style.gap = "0.4rem";

    const scores = Array.isArray(match.score) ? match.score : [match.score];
    scores.forEach((line) => {
      const row = document.createElement("div");
      row.className = "team-row";

      const teamName = document.createElement("div");
      teamName.className = "team-name";
      teamName.textContent = line;
      row.appendChild(teamName);

      scoreRows.appendChild(row);
    });

    card.appendChild(scoreRows);
  }

  return card;
}

function renderMatches(matches, query = "") {
  elements.matchesContainer.innerHTML = "";

  const normalizedQuery = query.trim().toLowerCase();
  const visibleMatches = matches.filter((match) => {
    if (!normalizedQuery) return true;
    const team1 = (match["team-1"] || "").toLowerCase();
    const team2 = (match["team-2"] || "").toLowerCase();
    const desc = (match.description || "").toLowerCase();
    return team1.includes(normalizedQuery) || team2.includes(normalizedQuery) || desc.includes(normalizedQuery);
  });

  if (visibleMatches.length === 0) {
    const empty = document.createElement("p");
    empty.style.color = "var(--muted)";
    empty.textContent = normalizedQuery ? "No matches found for that search." : "No live matches are available right now.";
    elements.matchesContainer.appendChild(empty);
    return;
  }

  visibleMatches.forEach((match) => {
    const card = buildMatchCard(match);
    elements.matchesContainer.appendChild(card);
  });
}

const mockMatches = [
  {
    id: 1,
    "team-1": "India",
    "team-2": "Australia",
    description: "India vs Australia - ODI",
    type: "ODI",
    date: new Date().toISOString(),
    matchStarted: true,
    score: ["India: 285/7 (50 overs)", "Australia: 180/5 (42 overs)"],
  },
  {
    id: 2,
    "team-1": "Pakistan",
    "team-2": "England",
    description: "Pakistan vs England - T20",
    type: "T20",
    date: new Date().toISOString(),
    matchStarted: true,
    score: ["Pakistan: 165/8 (20 overs)", "England: 142/6 (18 overs)"],
  },
  {
    id: 3,
    "team-1": "West Indies",
    "team-2": "South Africa",
    description: "West Indies vs South Africa - Test",
    type: "Test",
    date: new Date().toISOString(),
    matchStarted: true,
    score: ["West Indies: 320/4 (85 overs)", "South Africa: Not Started"],
  },
  {
    id: 4,
    "team-1": "Sri Lanka",
    "team-2": "New Zealand",
    description: "Sri Lanka vs New Zealand - ODI",
    type: "ODI",
    date: new Date().toISOString(),
    matchStarted: false,
    score: null,
  },
  {
    id: 5,
    "team-1": "Bangladesh",
    "team-2": "Ireland",
    description: "Bangladesh vs Ireland - T20",
    type: "T20",
    date: new Date().toISOString(),
    matchStarted: true,
    score: ["Bangladesh: 178/9 (20 overs)", "Ireland: 162/8 (20 overs)"],
  },
];

async function fetchMatches() {
  if (!config.apiKey) {
    setStatus("📌 Using sample data. Add an API key to fetch live scores.", "info");
    state.matches = mockMatches;
    state.lastFetch = Date.now();
    renderMatches(state.matches, elements.searchInput.value);
    return;
  }

  setStatus("Fetching latest scores...");

  try {
    const endpoint = `${config.apiUrl}?apikey=${encodeURIComponent(config.apiKey)}`;
    const response = await fetch(endpoint);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();

    if (!data || !Array.isArray(data.matches)) {
      throw new Error("Unexpected API response format.");
    }

    state.matches = data.matches;
    state.lastFetch = Date.now();

    setStatus(`Updated ${state.matches.length} matches. Last updated ${new Date().toLocaleTimeString()}.`);
    renderMatches(state.matches, elements.searchInput.value);
  } catch (error) {
    console.error(error);
    setStatus(`Failed to fetch live API, showing sample data instead.`, "info");
    // Fallback to mock data
    state.matches = mockMatches;
    renderMatches(state.matches, elements.searchInput.value);
  }
}

// LocalStorage helpers
const storage = {
  saveSearch(query) {
    localStorage.setItem("cricketDashboard_search", query);
  },
  getSearch() {
    return localStorage.getItem("cricketDashboard_search") || "";
  },
  saveAutoRefresh(enabled) {
    localStorage.setItem("cricketDashboard_autoRefresh", enabled ? "true" : "false");
  },
  getAutoRefresh() {
    return localStorage.getItem("cricketDashboard_autoRefresh") === "true";
  },
};

function toggleAutoRefresh(enabled) {
  state.isAutoRefreshEnabled = enabled;
  storage.saveAutoRefresh(enabled);
  
  if (state.refreshTimer) {
    clearInterval(state.refreshTimer);
    state.refreshTimer = null;
  }

  if (enabled) {
    state.refreshTimer = setInterval(fetchMatches, config.refreshIntervalMs);
  }
}

function initEvents() {
  elements.refreshBtn.addEventListener("click", () => fetchMatches());

  elements.autoRefreshToggle.addEventListener("change", (event) => {
    toggleAutoRefresh(event.target.checked);
  });

  elements.searchInput.addEventListener("input", (event) => {
    const query = event.target.value;
    storage.saveSearch(query);
    renderMatches(state.matches, query);
  });

  elements.clearSearchBtn.addEventListener("click", () => {
    elements.searchInput.value = "";
    storage.saveSearch("");
    renderMatches(state.matches, "");
    elements.searchInput.focus();
  });

  // Refresh on enter key pressed in the search input
  elements.searchInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      fetchMatches();
    }
  });
}

function restoreState() {
  // Restore search input
  const savedSearch = storage.getSearch();
  if (savedSearch) {
    elements.searchInput.value = savedSearch;
  }

  // Restore auto-refresh toggle
  const savedAutoRefresh = storage.getAutoRefresh();
  if (savedAutoRefresh) {
    elements.autoRefreshToggle.checked = true;
  }
}

function init() {
  restoreState();
  initEvents();
  fetchMatches();
  
  // Apply auto-refresh if it was enabled before
  if (storage.getAutoRefresh()) {
    toggleAutoRefresh(true);
  }
}

window.addEventListener("DOMContentLoaded", init);
