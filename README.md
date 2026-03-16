# 🏏 Cricket Score Dashboard

![HTML5](https://img.shields.io/badge/HTML5-E34C26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

A modern, responsive web app that displays live cricket scores, match status, and team information.

## 🌟 Features

- ✅ Fetches live cricket match data from a public API
- ✅ Displays ongoing matches with scores, overs, and status
- ✅ Search for a team or match by name
- ✅ Responsive design for desktop and mobile
- ✅ Auto-refresh option to keep scores up-to-date
- ✅ Graceful error handling for API failures with sample data fallback
- ✅ Persistent UI state (search query & auto-refresh preference saved in browser)
- ✅ Modern dark theme with smooth animations
- ✅ Accessibility features (ARIA labels, semantic HTML)

## 🧰 Technologies Used

- **HTML5** (semantic markup)
- **CSS3** (Flexbox/Grid, animations)
- **JavaScript (ES6+)** (fetch API, async/await)

## 🚀 Setup & Usage

1. Clone the repository:

```bash
git clone https://github.com/your-username/cricket-score-dashboard.git
cd cricket-score-dashboard
```

2. Open the project in your browser:

- Option A: Double-click `index.html` in the project folder.
- Option B: Serve via a local HTTP server (recommended):

```bash
# Python 3
python -m http.server 8000
```

Then open: `http://localhost:8000`

3. Configure the API key:

- Open `script.js`
- Locate the `config` object at the top
- Set `apiKey` to your cricket API key

```js
const config = {
  apiKey: "YOUR_API_KEY_HERE",
  apiUrl: "https://cricapi.com/api/matches",
  refreshIntervalMs: 30000,
};
```

4. Reload the page and view live scores.

### 💾 Local Storage

Your app automatically saves:
- **Last search query** — quickly resume your searches
- **Auto-refresh preference** — toggle stays on/off across reloads

These settings are stored in the browser's localStorage and cleared only when browser data is wiped.

## 🧩 API Information

This project uses a public cricket API endpoint:

- **Endpoint:** `https://cricapi.com/api/matches`
- **API Key:** Required for access.

### Getting an API key

1. Visit a cricket API provider such as:
   - [CricAPI](https://www.cricapi.com) (example)
   - [CricketAPI](https://www.cricketapi.com) (example)
2. Sign up for an account and generate an API key.
3. Paste the key into `script.js`.

> Note: The free tiers may have rate limits, so avoid refreshing too frequently.

## 🖼️ Screenshots (Placeholders)

![Dashboard Screenshot](./images/screenshot-1.png)

## 🌐 Live Demo (Placeholder)

> Add your live demo URL here once deployed (GitHub Pages, Netlify, Vercel, etc.)

## 📌 Notes & Security

- **Frontend-only:** This project is frontend-only and depends on an external API.
- **API Keys:** Never commit your API key to GitHub! The `.gitignore` file is configured to exclude sensitive files.
- **CORS:** If you encounter CORS errors, ensure your API provider allows cross-origin requests or use a CORS proxy.
- **Rate Limits:** Check your API provider's rate limits to avoid exceeding quotas.

## 📁 Project Structure

```
cricket-score-dashboard/
├── index.html          # Main HTML page
├── style.css           # Responsive styling
├── script.js           # Fetch API, DOM logic, localStorage
├── README.md           # Documentation
├── .gitignore          # Git ignore rules (protects secrets)
└── images/             # Optional: screenshots and icons
```

---

**Enjoy building your cricket score dashboard!** ⚡
