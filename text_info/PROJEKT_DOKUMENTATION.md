# Kaspar Hauser — Mittelalter Quest
## Vollständige Projektdokumentation & Full-Stack Beschreibung

---

## 📋 ÜBERBLICK

**Kaspar Hauser — Das größte Rätsel Deutschlands** ist eine interaktive Web-Anwendung, die Benutzer auf eine geheimnisvoll-historische Reise durch das mittelalterliche Nürnberg mitnimmt. Die Anwendung kombiniert:

- **KI-gesteuerte Konversation** mit Claude (Anthropic API)
- **Text-to-Speech Audio** (Deepgram API für deutsche Stimme)
- **Geofencing & GPS-basierte Location Detection**
- **Profil-Management** mit 3-Wort-Code-System
- **Umfassende Event-Logging** für Analytics & Debugging
- **Responsive Web-Design** für Desktop & Mobile

---

## 🎮 WAS DIE SEITE ALLES KANN

### 1. **Benutzerinteraktion & Profile**
- **3-Wort-Profil-Codes**: Einzigartige Benutzerkennung (z.B. "Schatten Herz Schloss")
- **Automatische Profilerstellung**: Speichert Benutzerprofile mit Zeitstempel
- **Verfügbare Plätze-Counter**: Zeigt verfügbare Spots (max. 20) mit visuellen Warnsignalen
  - Grün: >5 Plätze frei
  - Orange: 1-5 Plätze frei
  - Rot: 0 Plätze (AUSGEBUCHT)

### 2. **Kaspar Hauser Bot-Interaktionen**
- **Intro-Chat**: "Kaspar Intro Modal" für erste Begegnung mit Kaspar Hauser
- **Quest-Intro Modal**: Einleitung vor Spielstart mit Code-Generierung
- **Zweisprachige KI-Antworten**: Deutsche & englische Responses
- **TTS Audio-Output**: Kaspar antwortet in deutscher Stimme (Deepgram Aura-Asteria-DE)

### 3. **Mittelalterliche Rätsel-Quest**
- **10 Historische Stationen**: 
  - Unschlittplatz, Handwerkerhof, St. Lorenz, Nassauer Haus, Schöner Brunnen
  - Frauenkirche, Altes Rathaus, St. Sebald, Kaiserburg, Weinstadel & Henkersteg
- **GPS-basierte Standort-Aktivierung**: Rätsel erscheinen nur bei geofence-Nähe
- **Progressive Rätsel-Lösung**: 10 Rätsel mit Hinweisen, Multi-Attempt-System
- **Punkte-System**: 100 Punkte pro gelöstem Rätsel (max. 1000 Punkte)

### 4. **Visuelle Features**
- **Interaktive Leaflet-Map**: Zeigt alle Stationen mit Routing
- **Hero-Section**: Großflächige Willkommensseite mit Call-to-Action
- **How-It-Works Section**: 6-Schritt-Anleitung mit Icons
- **Features-Grid**: 6 Feature-Cards (Sehenswürdigkeiten, Geofencing, Rätsel, QR-Code, Leaderboard, Speicherung)
- **Responsive Design**: Mobile-first Layout mit Breakpoints

### 5. **Event-Tracking & Logging**
- **Client-seitige Logs**: 
  - `generate-profile`: Code generiert
  - `profile-created`: Profil gespeichert
  - `open-kaspar-intro`, `close-kaspar-intro`: Modal Events
  - `open-quest-intro`, `close-quest-intro`: Quest-Event
  - Alle Logs mit Timestamps
- **Server-seitige Logs**: 
  - POST `/api/profiles/:code/log` speichert Events persistent
  - Strukturierte Event-Erfassung mit User-ID & Event-Typ
- **Debug-Panel**: Console-Output mit `[PROFILE]`, `[QUEST]`, `[INIT]` Tags

### 6. **Backend-Persistierung**
- **Profile Storage**: In-Memory Map mit Profil-Objekten
- **Event Storage**: Zeitgestempelte Logs pro User
- **Leaderboard**: Top 10 Detektive nach Punkten
- **Health-Check**: API-Status für Claude & Deepgram

---

## 🏗️ FULL-STACK ARCHITEKTUR

### **Frontend (HTML/CSS/JavaScript)**

#### HTML-Struktur
```
kaspar-mittelalter-quest.html (128 KB)
├── HEAD
│   ├── Meta-Tags (Charset, Viewport, Title)
│   ├── Google Fonts (Plus Jakarta Sans, Playfair Display)
│   ├── Leaflet CSS (für Kartenfunktion)
│   └── Inline <style> Tag (komplettes CSS)
├── BODY
│   ├── Header (sticky, mit Logo & Navigation removed)
│   ├── Hero Section (Full-Height mit Gradient)
│   ├── How-It-Works Section (6 Cards)
│   ├── Features Section (6 Feature-Cards)
│   ├── Footer
│   ├── Modals
│   │   ├── Kaspar Intro Modal
│   │   ├── Quest Intro Modal
│   │   ├── Profile Modal
│   │   ├── Share Modal
│   │   └── Character Modal (entfernt)
│   └── Inline JavaScript
```

#### CSS-System
- **CSS Variables**: `--bg`, `--surface`, `--primary`, `--text`, `--danger`, etc.
- **Responsive Breakpoints**: 
  - Mobile-first: 320px+
  - Tablet: 768px+
  - Desktop: 1100px (container max-width)
- **Component Styles**:
  - Button Variants: `.btn-gold`, `.btn-outline`, `.btn-ghost`
  - Cards: `.character-card`, `.feature-card`, `.step-card`
  - Modal System: Flexbox centering, `.modal-box` Pattern
  - Map Grid: 2-Column Grid (Map + Panel)

#### JavaScript Modules

**Profile System**
```javascript
const PROFILE_WORDS = [25 Wörter aus Mittelalter-Kontext]
const MAX_SPOTS = 20
let totalProfiles = 0

generateProfileCode()        // 3 zufällige Wörter
startQuestWithProfile()      // Profil zum Server senden
updateAvailableSpots()       // Counter aktualisieren
```

**Modal Management**
```javascript
openKasparIntro() / closeKasparIntro()
openQuestIntro() / closeQuestIntro()
openCharacterModal(character) / closeCharacterModal()
openProfileModal() / closeProfileModal()
openShareModal() / closeShareModal()
```

**Event Logging**
```javascript
logEvent(eventName, data)    // Client-side + Server POST
updateDebugPanel()           // Console Output
```

**Map Functions**
```javascript
initMap()                    // Leaflet-Initialisierung
updateMapMarkers()           // Marker nach Quest-Update
enableLocation()             // GPS Geofencing
```

**Internationalisierung**
```javascript
const TRANSLATIONS = {
  de: { ... },
  en: { ... },
  es: { ... }
}
setLanguage(lang)            // Dynamischer Language Switch
```

### **Backend (Node.js/Express.js)**

#### Server-Struktur
```
api/
└── index.js (7.8 KB)
    ├── Express App Setup
    │   ├── CORS enablement
    │   ├── JSON body parser (10mb limit)
    │   ├── Static file serving
    │   └── Environment variables
    │
    ├── Data Storage
    │   ├── userProfiles Map: { code → {profile-object} }
    │   ├── userLogs Map: { code → [log-entries] }
    │   ├── userSessions Map: { userId → {quest-state} }
    │   └── QUESTS Array: 10 Quest-Definitions
    │
    ├── REST API Endpoints
    │   ├── POST /api/profiles
    │   ├── GET /api/profiles/:code
    │   ├── POST /api/profiles/:code/log
    │   ├── POST /api/bot
    │   ├── POST /api/tts
    │   ├── GET /api/leaderboard
    │   ├── POST /api/reset
    │   └── GET /api/health
    │
    └── External API Integration
        ├── Anthropic Claude API
        └── Deepgram Text-to-Speech API
```

#### Datenmodelle

**Profile Object**
```javascript
{
  code: "Schatten Herz Schloss",        // 3-Wort-Code
  createdAt: "2026-05-10T10:30:00Z",  // ISO Timestamp
  questsCompleted: [1, 2, 3],          // Quest-IDs
  totalPoints: 300,                    // Summe aller Punkte
  logs: []                             // [log-entries]
}
```

**Log Entry**
```javascript
{
  timestamp: "2026-05-10T10:31:45Z",
  event: "generate-profile",
  data: {
    code: "Schatten Herz Schloss"
  }
}
```

**Session Object (für Quest-State)**
```javascript
{
  activeQuest: 0,              // Aktueller Rätsel-Index
  solved: [1, 2],              // Gelöste Rätsel-IDs
  questStarted: false,         // Flag
  conversationState: 'initial'
}
```

**Quest Definition**
```javascript
{
  id: 1,
  name: "Unschlittplatz",
  answer: "beuerle",           // Korrekte Antwort
  context: "Wo ich gefunden wurde"
}
```

#### API Endpoints Dokumentation

**POST /api/profiles**
- Input: `{ code: string }`
- Output: `{ success: true, profile: {...} }`
- Speichert neues Profil mit Timestamp

**GET /api/profiles/:code**
- Input: URL-Parameter `code`
- Output: `{ profile: {...}, logs: [...] }`
- Holt Profil + alle Logs für Code

**POST /api/profiles/:code/log**
- Input: `{ event: string, data: object }`
- Output: `{ success: true, log: {...} }`
- Speichert einzelnes Event

**POST /api/bot**
- Input: `{ message: string, history: array, userId: string }`
- Output: `{ response: string, audio: base64|null, progress: string }`
- Claude API Integration mit Deepgram TTS

**POST /api/tts**
- Input: `{ text: string }`
- Output: Audio WAV Stream
- Standalone Text-to-Speech Endpoint

**GET /api/leaderboard**
- Input: keine
- Output: `{ leaderboard: [{ username, rank, points, locations_visited }, ...] }`
- Top 10 sorted by points

**POST /api/reset**
- Input: `{ userId: string }`
- Output: `{ success: true }`
- Setzt Session zurück

**GET /api/health**
- Input: keine
- Output: `{ status: "ok", anthropic: "configured|missing", deepgram: "configured|missing" }`
- System-Status Check

---

## 📡 DATENFLUSS (End-to-End)

### **Szenario: Benutzer erstellt Profil**

```
1. Frontend: Button "Jetzt anmelden & spielen" click
   ↓
2. JavaScript: openQuestIntro()
   ├── Zeigt Quest Intro Modal
   └── Ruft generateProfileCode() auf
   ↓
3. generateProfileCode()
   ├── Wählt 3 zufällige Wörter aus PROFILE_WORDS
   ├── Zeigt Code im Modal an
   └── Aktiviert "Start Quest" Button
   ↓
4. Benutzer klickt "Start Quest"
   ↓
5. startQuestWithProfile()
   ├── Liest Code aus DOM
   ├── POST /api/profiles mit { code }
   ↓ (Server-Seite)
   6. Express API
      ├── Erstellt Profile Object
      ├── Speichert in userProfiles Map
      └── Returns { success: true, profile: {...} }
   ↓ (Zurück zu Frontend)
   7. Empfängt Response
      ├── Speichert in localStorage: kaspar_profile
      ├── totalProfiles++ (Spot-Counter)
      ├── updateAvailableSpots()
      ├── logEvent('profile-created', { code })
      └── Zeigt Bestätigungs-Alert
   ↓
8. Demo-Chat öffnet sich
```

### **Szenario: Benutzer spricht mit Kaspar**

```
1. Benutzer tippt Nachricht in Chat-Input
   ↓
2. sendMessage()
   ├── Liest Input-Text
   ├── Zeigt User-Message im Chat
   ├── Sammelt Chat-History (letzte 5 Messages)
   └── POST /api/bot mit { message, history, userId }
   ↓ (Server-Seite)
   3. Express API /bot Endpoint
      ├── Prüft auf korrekte Rätsel-Antwort
      ├── Falls RICHTIG:
      │  ├── session.solved.push(questId)
      │  └── Returns "✓ Richtig!" + nächstes Rätsel
      │
      └── Falls FALSCH oder normaler Chat:
         ├── Erstellt Claude API Message
         │  ├── system: Kaspar-Charakter Prompt
         │  ├── model: claude-opus-4-7
         │  └── max_tokens: 300
         ├── Claude antwortet (Deutsch, mysteriös)
         └── Optional: TTS via Deepgram
   ↓ (Zurück zu Frontend)
   4. Empfängt { response, audio, progress }
      ├── Zeigt Kaspar-Response im Chat
      ├── Spielt Audio ab (falls vorhanden)
      ├── Aktualisiert Progress (z.B. "3/10")
      └── logEvent('bot-message', { ... })
```

---

## 📁 DATEISTRUKTUR

```
C:\Users\Anjel\Desktop\Work Projekt\10 Portfolio\Kaspar hauser\
│
├── kaspar-mittelalter-quest.html      [128 KB] Main App File
│   ├── Full HTML5 + Inline CSS + JavaScript
│   ├── Alle Komponenten (Modals, Sections, etc.)
│   └── Keine externe JS-Dependencies außer Leaflet
│
├── api/
│   └── index.js                       [7.8 KB] Express Server
│       ├── REST Endpoints
│       ├── Claude Integration
│       ├── Deepgram TTS
│       └── In-Memory Data Storage
│
├── .env                               [Secrets]
│   ├── ANTHROPIC_API_KEY
│   ├── DEEPGRAM_API_KEY
│   ├── NODE_ENV
│   └── PORT
│
├── .env.example                       [Template]
│
├── package.json                       [Node Dependencies]
│   ├── express
│   ├── cors
│   ├── @anthropic-ai/sdk
│   ├── axios
│   └── dotenv
│
├── package-lock.json                  [Dependency Lock]
│
├── node_modules/                      [Installed Packages]
│
├── README.md                          [Project Info]
│
├── DEPLOYMENT_CHECKLIST.md            [Deploy Guide]
│
├── public/                            [Static Assets (optional)]
│
├── text_info/                         [Documentation]
│   └── PROJEKT_DOKUMENTATION.md      [Diese Datei]
│
└── .git/                              [Git Version Control]
```

---

## 🚀 TECHNOLOGIE-STACK

### **Frontend**
| Technologie | Version | Zweck |
|---|---|---|
| HTML5 | - | Struktur |
| CSS3 | - | Styling, Responsive Design |
| JavaScript | ES6+ | Logik, Interaktion |
| Leaflet | 1.9.4 | Kartenfunktion (OpenStreetMap) |
| Google Fonts | - | Typography |

### **Backend**
| Technologie | Version | Zweck |
|---|---|---|
| Node.js | 18+ | Runtime |
| Express.js | 4.x | HTTP Server |
| CORS | - | Cross-Origin Support |
| Dotenv | - | Environment Variables |

### **Externe APIs**
| Service | Zweck | API-Version |
|---|---|---|
| Anthropic Claude | KI-Chat (Kaspar) | claude-opus-4-7 |
| Deepgram | Text-to-Speech (Deutsch) | v1/speak (aura-asteria-de) |
| OpenStreetMap | Kartendaten | Via Leaflet |

### **Deployment**
| Platform | Zweck | Status |
|---|---|---|
| Vercel | (Optional) Production Hosting | - |
| Local Node | Development/Testing | Aktiv |

---

## ⚙️ SETUP & INSTALLATION

### **Voraussetzungen**
```bash
- Node.js 18+ installiert
- npm oder yarn Package Manager
- API Keys:
  - ANTHROPIC_API_KEY (https://console.anthropic.com/)
  - DEEPGRAM_API_KEY (https://console.deepgram.com/)
```

### **Installation Schritt-für-Schritt**
```bash
# 1. In Projekt-Verzeichnis navigieren
cd "C:\Users\Anjel\Desktop\Work Projekt\10 Portfolio\Kaspar hauser"

# 2. Dependencies installieren
npm install

# 3. .env erstellen (Kopie von .env.example)
cp .env.example .env

# 4. API Keys in .env eintragen
# ANTHROPIC_API_KEY=sk-ant-...
# DEEPGRAM_API_KEY=...

# 5. Server starten
npm start
# oder manuell:
# $env:ANTHROPIC_API_KEY="sk-ant-..."
# $env:DEEPGRAM_API_KEY="..."
# node api/index.js
```

### **Browser öffnen**
```
http://localhost:3000
```

---

## 🔐 SICHERHEITSFEATURES

- **API Key Verwaltung**: Keys in `.env` (nicht in Git)
- **CORS**: Konfiguriert für Cross-Origin Requests
- **Input Validation**: 
  - Quest-Antworten: Lowercase Vergleich
  - Message Length: Max 50 Zeichen für Rätsel
- **Body Size Limits**: 10MB JSON/URL-Encoded
- **Error Handling**: Try-catch auf kritischen Operationen

---

## 📊 PERFORMANCE-CHARAKTERISTIKEN

| Metrik | Wert | Details |
|---|---|---|
| HTML Größe | 128 KB | Inline CSS + JS |
| API Response Time | <2s (Claude) | Abhängig von Netzwerk |
| Map Init | <500ms | Leaflet + OSM Tiles |
| TTS Generation | 1-3s | Deepgram API |
| Database Query | <50ms | In-Memory Map |
| Mobile Bundle | ~200KB | HTML + Assets |

---

## 🐛 DEBUGGING

### **Console Logs**
```javascript
[PROFILE]       // Profil-Generierung & -Speicherung
[QUEST]         // Quest-Flow & Rätsel-Logik
[INIT]          // Initialization Events
[KASPAR LOG]    // Allgemeine Log-Einträge
```

### **Browser DevTools**
- F12 → Console Tab
- Filter nach `[PROFILE]`, `[QUEST]`, etc.
- Network Tab: API Requests tracken
- Local Storage: `kaspar_profile` anschauen

### **Server Logs**
```bash
✅ Kaspar Hauser Server läuft auf http://localhost:3000
🤖 Claude API: ✅ Konfiguriert
🎤 Deepgram API: ✅ Konfiguriert
```

### **API Health Check**
```bash
curl http://localhost:3000/api/health
# Output: { "status": "ok", "anthropic": "configured", "deepgram": "configured" }
```

---

## 🎯 ZUKUNFTSERWEITERUNGEN

- [ ] Persistente Datenbank (MongoDB/PostgreSQL)
- [ ] Benutzer-Authentifizierung & Sessions
- [ ] Real-time Leaderboard Updates (WebSockets)
- [ ] Mehrspieler-Modus mit Gruppen
- [ ] Erweiterte Statistiken & Analytics
- [ ] Mobile Native Apps (React Native/Flutter)
- [ ] Offline-Modus mit Service Worker
- [ ] Erweiterte Location Services
- [ ] Video-Content für Stationen
- [ ] Multiplayer Quest-Rätsel

---

## 📞 KONTAKT & SUPPORT

**Projekt**: Kaspar Hauser — Mittelalter Quest  
**Studio**: Unwritten Studio  
**Email**: angelica.gomez@unwritten.studio  
**Repository**: Local Git (`.git/`)  
**Last Updated**: 2026-05-10

---

**Status**: ✅ Production Ready | MVP Phase (Q2 2026)
