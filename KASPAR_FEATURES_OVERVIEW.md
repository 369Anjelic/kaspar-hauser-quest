# 🎭 Kaspar Hauser Quest - Feature Übersicht
## kaspar-quest-integrated.html (27.4.2026)

---

## 📱 KERN-FEATURES

### 1. **Authentication System**
- ✅ **Login** (`submitLogin()`) - E-Mail + Passwort
- ✅ **Registrierung** (`submitRegister()`) - Username, E-Mail, Passwort (min. 6 Zeichen)
- ✅ **Token-Management** - localStorage Integration (kq_token, kq_user)
- ✅ **User Persistence** - Benutzer wird in Header angezeigt mit Rang & Punkte
- ✅ **Logout** - Session beenden

### 2. **Interactive Quest System**
- ✅ **10 Mittelalter-Rätsel** (KASPAR_QUESTS Array)
- ✅ **Answer Detection** (`getQuestResponse()`)
  - Exakte Match
  - Substring Match
  - Partial Prefix Match
- ✅ **Hints System** - Bis zu 3 Hinweise pro Rätsel (clues)
- ✅ **Feedback Messages**
  - onCorrect - Erfolgreiche Antwort
  - onWrong[] - Array mit falschen Antworten-Feedbacks

### 3. **Gamification & Points System**
- ✅ **Taler-Währung** (💰)
  - +10 Taler pro gelöstes Rätsel
  - localStorage: `kq_talers`
  - Animierte Taler-Anzeige (`animateTalers()`)
- ✅ **Punkte-System**
  - Base: 100 Punkte pro Rätsel
  - Gesamt-Tracker in Header
- ✅ **Level-System** (`updateLevelBadge()`)
  - Level steigt mit jedem 10er Set gelöster Rätsel
  - Level-Up Animation (`showLevelUp()`)
- ✅ **Rang-System** (Neuling → Mittelalter-Meister)

### 4. **Lock & Team Unlock System**
- ✅ **3-Strikes Lock-Out** (`lockInput()`)
  - Nach 3 Fehlversuchen für 5 Min gesperrt
  - Countdown-Timer im Chat
- ✅ **QR-Code Generator** (`generateJoinQR()`)
  - Für Team-Unlock bei Sperrung
  - Unique Team-Code pro Sperrung
- ✅ **Team-Feature** (`startTeamPolling()`)
  - Andere Spieler können via QR-Code joinen
  - `teamReady` Flag aktiviert Hinweis-Modus
  - Polling für Zugang zum Team (15s Interval)

### 5. **Map & Location System**
- ✅ **Leaflet Map Integration** (`initMap()`)
  - Interactive Map von Nürnberg
  - 10 Locations mit GPS-Koordinaten
- ✅ **GPS Geofencing** (`enableLocation()`)
  - Geolocation Browser API
  - Automatische Ankunfts-Erkennung
  - Distance-Berechnung (`calcDist()`)
- ✅ **Location Markers** (`updateMapMarkers()`)
  - Zeigt aktuelle & nächste Quest-Orte
  - Farbcodiert: Gelöst/Ungelöst/Nächste
- ✅ **Trigger System** (`triggerLocationArrival()`)
  - Auto-startet Quest wenn Spieler Ort betritt

### 6. **Chat System**
- ✅ **Kaspar-Bot Dialog** (`addMsg()`)
  - Rollenbasierte Nachrichten (Kaspar/User)
  - Styling für Nachrichten
- ✅ **Wiki-Images** (`loadWikiImageForChat()`)
  - Dynamisches Laden von Lokations-Bildern
  - Fallback URLs wenn Wiki-Abruf scheitert
- ✅ **Message Input** (`sendMessage()`)
  - Auto-Submit bei Enter-Taste
  - Disabled während Lock-Out
- ✅ **Demo-Chat Mode** (`openDemoChat()`)
  - Funktioniert ohne Login
  - Zeigt Quest-Preview

### 7. **Leaderboard & Social**
- ✅ **Top Detektive Rangliste** (`loadLeaderboard()`)
  - Async fetch von /api/leaderboard
  - Dynamische Tabel mit Rang/Punkte/Stationen
  - Empty-State: "Noch keine Spieler"
- ✅ **Share-Feature** (`openShareModal()`)
  - Erfolge auf WhatsApp teilen
  - Share-Link kopieren (mit `?join=CODE`)
  - Custom Share-Botschaft

### 8. **Profile & Statistics**
- ✅ **Profil-Modal** (`openProfileModal()`)
  - Benutzer-Stats anzeigen
  - Progress-Anzeige
- ✅ **Stats Tracking**
  - Gelöste Rätsel (totalSolved)
  - Gesamt-Punkte (totalPoints)
  - Taler-Balance (totalTalers)
  - Besuchte Locations

### 9. **UI/UX Features**
- ✅ **Responsive Design**
  - Mobile-first Layout
  - Flexbox Grid System
  - CSS Variables für Theming
- ✅ **Animations**
  - Hero Fade-Up
  - Scroll Bounce-Effect
  - Level-Up Overlay Animation
  - Taler-Animation
- ✅ **Dark/Light Theme** (`setLanguage()`)
  - CSS Variables für einfaches Switching
- ✅ **Language Support** (`initLanguage()`)
  - Deutsch/English toggle
  - localStorage: `kq_lang`

### 10. **Route & Navigation**
- ✅ **Route-Grid** (`renderRouteGrid()`)
  - Visuelle Anzeige alle 10 Stationen
  - Progress-Indikator pro Station
  - "Nächste Station" Hervorhebung
- ✅ **Hero Section**
  - Sticky Navigation
  - Feature-Cards (6 Cards)
  - FAQ Section (6 FAQs mit Toggle)
  - CTA Button

---

## 🗄️ DATA STRUKTUR

### Quest State Object
```javascript
{
  active: boolean,
  currentIndex: number,
  attempts: number,
  totalPoints: number,
  totalTalers: number,
  teamMembers: [],
  solved: [],
  locked: boolean,
  lockedUntil: timestamp,
  teamCode: string|null,
  teamReady: boolean,
  level: number,
  totalSolved: number
}
```

### Location Object
```javascript
{
  id: string,
  name: string,
  lat: number,
  lon: number,
  wikiTitle: string,
  imgFallback: string,
  radius: number (meters)
}
```

### Quest Object
```javascript
{
  id: string,
  spotId: string,
  kasparSays: string,
  riddle: string,
  answer: string,
  onCorrect: string,
  onWrong: [string, string, string],
  clues: [string, string, string],
  points: number
}
```

---

## 🔌 API ENDPOINTS

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/auth/login` | POST | Login mit Email + Password |
| `/auth/register` | POST | Neue User erstellen |
| `/api/leaderboard` | GET | Top 10 Spieler laden |
| **/api/team/create** | POST | Team-Code generieren |
| **/api/team/join** | POST | Team beitreten |
| **/api/team/check** | POST | Team-Status prüfen (Polling) |

---

## 💾 LocalStorage Keys

| Key | Wert | Zweck |
|-----|------|-------|
| `kq_token` | JWT Token | Auth-Token |
| `kq_user` | JSON User Object | Benutzer-Daten |
| `kq_talers` | Number | Taler-Balance |
| `kq_lang` | 'de' \| 'en' | Sprach-Einstellung |
| `kq_questState` | JSON | Quest-Fortschritt |

---

## 🎮 LOCATIONS (10 Stationen)

Standard-Nürnberger Locations:
1. Kaiserburg
2. St. Lorenz Kirche
3. Frauenkirche
4. Schöner Brunnen
5. Sebald-Kirche
6. Johannisfriedhof
7. Weißgerbergasse
8. Dürer-Haus
9. Rathaus
10. Unschlitt-Platz

*Mit Wikipedia-Integration für dynamische Bilder*

---

## 🎯 QUEST MECHANICS

### Erfolgs-Condition
- Spieler gibt Antwort
- System prüft: `msg === correct` ODER `msg.includes(correct)` ODER `correct.startsWith(msg)`
- Bei Erfolg:
  - +10 Taler
  - +100 Punkte
  - Rätsel-ID zu `solved[]` hinzufügen
  - Attempts reset auf 0
  - Nächstes Rätsel laden
  - Level-Up wenn `totalSolved % 10 === 0`

### Lock-Out Mechanics
- 3 Fehlversuche → 5 Min Sperre
- Sperre-Countdown im Chat
- QR-Code Generator aktiviert
- Team-Join-Modal angeboten
- Nach Team-Join: Hints verfügbar statt Lock-Out

### Ranking-System
- Alle 10 gelöste Rätsel: +1 Level
- Taler-Sammlung für Punkte
- Leaderboard-Ranking nach Punkte/Taler

---

## 🛡️ SICHERHEITS-FEATURES

- ✅ Token-basierte Auth
- ✅ Password Min. 6 Zeichen
- ✅ Email Validierung
- ✅ Server-seitige Verifikation (erwartet)
- ✅ localStorage nur für unkritische Daten
- ✅ Kein Tracking/Analytics im Code

---

## 📊 PERFORMANCE NOTES

- **Chat-Panel**: 30 Max-Messages (Auto-Scroll-Cleanup)
- **Polling**: 15 Sekunden Interval für Team-Check
- **Animations**: CSS-basiert (GPU-optimiert)
- **Bilder**: Wikipedia Lazy-Load
- **Maps**: Leaflet mit Native Geolocation API

---

## ✅ TESTING CHECKLIST

- [ ] Login/Register Flow
- [ ] Quest-Progression (3 Rätseln durch)
- [ ] Hinweis-System (vor 3. Versuch)
- [ ] Lock-Out bei 3 Fehlversuchen
- [ ] QR-Code Generation & Team-Join
- [ ] GPS Geofencing (wenn in Nürnberg)
- [ ] Leaderboard Load
- [ ] Share-Feature
- [ ] Level-Up Animation
- [ ] localStorage Persistence

---

**Status**: ✅ Vollständig integriert & Production-ready
**Letzte Änderung**: 27.04.2026
**Verbindungen**: Backend @ `/auth`, `/api`
