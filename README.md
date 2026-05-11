# 🎭 Kaspar Hauser - Mittelalter Rätselspiel

Interaktives Rätselabenteuer durch Nürnbergs Geschichte mit KI-gesteuertem Guide (Claude AI).

## 🚀 Quick Start

### Installation
```bash
npm install
```

### Environment Setup
Kopiere `.env.example` zu `.env` und füge deine API Keys ein:
```env
ANTHROPIC_API_KEY=sk-ant-...
DEEPGRAM_API_KEY=...
PORT=3000
```

**APIs erforderlich:**
- [Anthropic Claude API](https://console.anthropic.com/) - KI-Guide
- [Deepgram API](https://console.deepgram.com/) - Text-to-Speech

### Server starten
```bash
npm start          # Production
npm run dev        # Development (mit Nodemon)
```

Server läuft auf: **http://localhost:3000**

## 🎮 Spielablauf

1. **Profil erstellen** - Eindeutigen Code eingeben
2. **Quests lösen** - 10 mittelalterliche Rätsel in Nürnberg
3. **Mit Claude chatten** - Hinweise und Lore erhalten
4. **Punkte sammeln** - Erfolgreiche Lösungen belohnen

### Quest-Beispiele
- 🏛️ **Handwerkerhof** → "gold"
- ⛪ **St. Lorenz Kirche** → "verkündigung"
- 🏰 **Kaiserburg** → "reichskleinodien"

## 📁 Projektstruktur

```
.
├── api/index.js              # Express Backend
├── kaspar-mittelalter-quest.html # Hauptspiel-UI
├── public/                   # Alternative HTML-Versionen
├── text_info/               # Lore & Dokumentation
├── package.json             # Dependencies
└── .env                      # Secrets (nicht commiten!)
```

## 🔌 API Endpoints

| Methode | Endpoint | Beschreibung |
|---------|----------|-------------|
| POST | `/api/profiles` | Profil erstellen |
| GET | `/api/profiles/:code` | Profil + Logs abrufen |
| POST | `/api/profiles/:code/log` | Event loggen |
| POST | `/api/bot` | KI-Chat mit Kaspar |
| POST | `/api/tts` | Text-to-Speech |

## 🛠️ Tech Stack

- **Backend**: Express.js (Node.js 20+)
- **AI**: Anthropic Claude API
- **TTS**: Deepgram
- **Frontend**: HTML5 + Vanilla JS
- **CORS**: Enabled

## 📋 Requirements

- Node.js 20.x+
- npm/npx
- Anthropic API Key
- Deepgram API Key (optional)

## 🧪 Test

```bash
curl -X POST http://localhost:3000/api/profiles \
  -H "Content-Type: application/json" \
  -d '{"code":"test123"}'
```

---

**Setup**: ✅ Complete
**Status**: Ready for testing (25.5.2026)
