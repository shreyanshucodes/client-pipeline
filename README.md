<div align="center">

# ⚡ Client Pipeline

### A visual Kanban CRM for freelancers. Track every client from first contact to closed deal.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)
[![Deploy](https://img.shields.io/badge/Deploy-GitHub_Pages-222?style=for-the-badge&logo=github)](https://shreyanshucodes.github.io/client-pipeline)
[![Made with JS](https://img.shields.io/badge/Made_with-JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=000)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Zero Dependencies](https://img.shields.io/badge/Dependencies-Zero-22c55e?style=for-the-badge)](https://github.com/shreyanshucodes/client-pipeline)

<br>

**[🚀 Live Demo →](https://shreyanshucodes.github.io/client-pipeline)**

</div>

---

## 🎯 What Is This?

A **drag-and-drop client pipeline tracker** built for freelancers, editors, and consultants who need a simple CRM without the bloat of Salesforce or HubSpot.

Track your clients through every stage of your sales process:

```
Lead → Contacted → Meeting Scheduled → Proposal Sent → Negotiating → Won ✅ / Lost ❌
```

**No backend. No login. No subscription.** Just open it and start tracking.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🖱️ **Drag & Drop** | Move client cards between pipeline stages with smooth drag-and-drop |
| 📊 **Live Stats** | See total leads, pipeline value (₹), and conversion rate in real-time |
| 🌓 **Dark/Light Mode** | Toggle between themes for your preferred look |
| 🔍 **Search & Filter** | Instantly find any client by name or company |
| 📤 **CSV Export** | Export your entire pipeline as a spreadsheet |
| 💾 **Auto-Save** | Everything persists in your browser's localStorage |
| 📱 **Responsive** | Works on desktop, tablet, and mobile |
| ⚡ **Zero Dependencies** | Pure HTML, CSS, and vanilla JavaScript — no frameworks, no npm |

---

## 🏗️ Pipeline Stages

| Stage | Color | Meaning |
|---|---|---|
| 🟦 **Lead** | Blue | New potential client identified |
| 🟩 **Contacted** | Green | You've reached out (email, DM, call) |
| 🟨 **Meeting Scheduled** | Yellow | A meeting/call is booked |
| 🟪 **Proposal Sent** | Purple | You've sent a quote or proposal |
| 🟧 **Negotiating** | Orange | Discussing terms, pricing, scope |
| ✅ **Won** | Green | Deal closed! Client is paying |
| ❌ **Lost** | Red | Client chose not to proceed |

---

## 🚀 Quick Start

### Option 1: Use the live demo
👉 **[shreyanshucodes.github.io/client-pipeline](https://shreyanshucodes.github.io/client-pipeline)**

### Option 2: Run locally
```bash
git clone https://github.com/shreyanshucodes/client-pipeline.git
cd client-pipeline
# Just open index.html in your browser — that's it!
start index.html
```

### Option 3: Deploy your own
Fork this repo → Go to Settings → Pages → Source: main branch → Your live URL is ready!

---

## 📁 Project Structure

```
client-pipeline/
├── index.html          # Main app UI
├── style.css           # All styling (dark/light themes)
├── app.js              # Full app logic (drag & drop, CRUD, stats)
├── data.json           # Sample client data
├── LICENSE             # MIT License
├── CONTRIBUTING.md     # How to contribute
└── .github/
    └── workflows/
        └── deploy.yml  # Auto-deploy to GitHub Pages
```

---

## 🎨 How It Works

1. **Click "Add Client"** → Fill in name, company, deal value, stage, and notes
2. **Drag cards** between columns as your relationship with the client progresses
3. **Watch your stats** update in real-time (total leads, pipeline value, conversion rate)
4. **Export to CSV** when you need the data in a spreadsheet
5. **Load Sample Data** to see the board in action with pre-filled clients

---

## 🛠️ Tech Stack

- **HTML5** — Semantic structure
- **CSS3** — Custom properties, flexbox, grid, transitions, dark mode
- **JavaScript** — Vanilla ES6+, HTML5 Drag and Drop API, localStorage
- **GitHub Actions** — Automated deployment to GitHub Pages
- **Font Awesome** — Icons

---

## 🤝 Contributing

Contributions are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

Some ideas:
- [ ] Add email/WhatsApp reminder integration
- [ ] Add client notes history timeline
- [ ] Add deal probability percentage
- [ ] Add monthly revenue chart
- [ ] Add import from CSV

---

## 📄 License

[MIT](LICENSE) — Free to use, modify, and distribute.

---

<div align="center">

### Built by [Shreyanshu Srivastava](https://github.com/shreyanshucodes)

*Stop losing clients to messy spreadsheets. Track them visually.* ⚡

</div>
