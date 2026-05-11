# 🎭 Kaspar Hauser Quest - Setup & Deployment Guide
## kaspar-quest-integrated.html (27.04.2026)

---

## 📂 AKTUELLE STRUKTUR

```
📁 4 kaspar hauser 27.4.2026/
├── 📄 kaspar-quest-integrated.html      ⭐ HAUPTDATEI - Alle Features
├── 📄 DEPLOYMENT_CHECKLIST.md           Vercel Deployment Status
├── 📄 KASPAR_FEATURES_OVERVIEW.md       (Neu) Feature-Dokumentation
├── 📄 KASPAR_SETUP_GUIDE.md            (Neu) Dieses Dokument
├── 📄 README.md                         Original README
├── 📄 package.json                      NPM Dependencies
└── 📄 package-lock.json                 Lock File
```

---

## 🚀 SCHNELLSTART

### Option 1️⃣: Lokal testen (OFFLINE)
Einfach die HTML-Datei im Browser öffnen:
```bash
# Windows Explorer:
C:\Users\Anjel\Desktop\Work Projekt\3 Kaspar Hauser Homepage\4 kaspar hauser 27.4.2026\kaspar-quest-integrated.html
```

**Was funktioniert offline:**
- ✅ Hero Section
- ✅ Feature Cards
- ✅ FAQ Section
- ✅ Demo-Chat (ohne Login)
- ✅ Route-Anzeige
- ✅ Responsive Design

**Was NICHT offline funktioniert:**
- ❌ Login/Registrierung
- ❌ Leaderboard laden
- ❌ Maps/GPS
- ❌ Kaspar-Antworten (API-abhängig)

---

### Option 2️⃣: Mit Backend (VERCEL EMPFOHLEN)

#### Status: ✅ Bereits auf Vercel deployed!
**URL:** https://kaspar-hauser-game-2.vercel.app/

#### Was noch zu tun ist:

1. **Environment-Variablen setzen:**
   ```
   Vercel Dashboard → Settings → Environment Variables
   ```
   Hinzufügen:
   - `ANTHROPIC_API_KEY=sk-ant-...` (für Kaspar-Antworten)
   - `DEEPGRAM_API_KEY=...` (für Sprach-TTS, falls gewünscht)

2. **Redeploy nach Env-Vars:**
   ```
   Vercel Dashboard → Deployments → Latest → Redeploy
   ```

3. **Test:**
   ```
   https://kaspar-hauser-game-2.vercel.app/
   ```

---

### Option 3️⃣: Lokal mit Node Server (Development)

#### Vorbereitung:
```bash
# 1. Ins Verzeichnis gehen
cd "C:\Users\Anjel\Desktop\Work Projekt\3 Kaspar Hauser Homepage\4 kaspar hauser 27.4.2026"

# 2. Dependencies installieren (falls noch nicht geschehen)
npm install

# 3. .env Datei erstellen (falls nicht vorhanden)
# Inhalt:
# ANTHROPIC_API_KEY=sk-ant-YOUR_REAL_KEY_HERE
# PORT=3000

# 4. Server starten
npm start
```

#### Dann im Browser:
```
http://localhost:3000/kaspar-quest-integrated.html
```

---

## 🎮 ALLE FEATURES TESTEN

### Feature | Wie Test
---|---
**Auth System** | [Login Button] → Email/Passwort eingeben
**10 Rätsel** | Demo starten → Antworten eingeben
**Hinweis-System** | 2x falsch → Hinweis erscheint
**Lock-Out** | 3x falsch → 5-Min Sperre + QR-Code
**Team-Unlock** | QR-Code scannen → Mit anderer Person Team bilden
**GPS/Map** | [Enable Location] → In Nürnberg gehen (oder Simulator)
**Leaderboard** | Unten scrollieren → Top Detektive laden
**Share-Feature** | Level-Up Screen → [Teilen] Button
**Profile** | Header [Profil-Icon] → Stats anzeigen
**Chat** | Jederzeit → Nachrichten mit Kaspar

---

## 🔧 API ENDPOINTS (Was der Browser aufruft)

| Endpoint | Methode | Funktion | Status |
|----------|---------|----------|--------|
| `/auth/login` | POST | Benutzer einloggen | ⚠️ Benötigt Backend |
| `/auth/register` | POST | Neuen User erstellen | ⚠️ Benötigt Backend |
| `/api/leaderboard` | GET | Top 10 Detektive | ⚠️ Benötigt Backend |
| `/api/team/create` | POST | QR-Code generieren | ⚠️ Benötigt Backend |
| `/api/team/join` | POST | Team beitreten | ⚠️ Benötigt Backend |
| `/api/team/check` | POST | Team-Status (Polling) | ⚠️ Benötigt Backend |
| Wikipedia Images | GET | Dynamische Bilder laden | ✅ Öffentliche API |
| OpenStreetMap (Leaflet) | GET | Karten-Tiles | ✅ Öffentliche API |

### ⚠️ Hinweis zu Backend-Endpoints:
Die `kaspar-quest-integrated.html` erwartet diese Endpoints. Sie müssen vom Backend bereitgestellt werden.

Falls Sie noch kein Backend haben:
1. **Option A:** Mock-Responses in HTML hinzufügen (für Demo)
2. **Option B:** Backend-API bauen (Express/Node.js)
3. **Option C:** Serverless Functions auf Vercel (Recommended)

---

## 💾 LOKALE DATEN (Browser LocalStorage)

```javascript
localStorage.kq_token        // JWT Auth Token
localStorage.kq_user         // User JSON Object
localStorage.kq_talers       // Taler-Balance (Punkt)
localStorage.kq_lang         // Sprache: 'de' oder 'en'
localStorage.kq_questState   // Quest-Fortschritt (Quiz-Daten)
```

Diese werden automatisch gespeichert! Kein Server nötig für diese Grundfeatures.

---

## 🌍 LOCATIONS (10 Nürnberger Orte)

1. **Kaiserburg** - (49.4415°N, 11.5752°E)
2. **St. Lorenz Kirche** - (49.4494°N, 11.5774°E)
3. **Frauenkirche** - (49.4507°N, 11.5778°E)
4. **Schöner Brunnen** - (49.4506°N, 11.5776°E)
5. **Sebald-Kirche** - (49.4535°N, 11.5702°E)
6. **Johannisfriedhof** - (49.4577°N, 11.5711°E)
7. **Weißgerbergasse** - (49.4473°N, 11.5829°E)
8. **Dürer-Haus** - (49.4499°N, 11.5835°E)
9. **Rathaus** - (49.4486°N, 11.5791°E)
10. **Unschlitt-Platz** - (49.4468°N, 11.5744°E)

Radius: 50-100 Meter pro Location

---

## 📊 GAME MECHANICS

### Rätsel-Lösung:
```
Spieler gibt Antwort → 
System prüft: exakte Match ODER substring ODER prefix Match →
✓ Richtig: +10 Taler, +100 Punkte, nächstes Rätsel
✗ Falsch: +1 Versuch Counter
```

### Lock-Out:
```
3 Versuche fehlgeschlagen →
Sperre für 5 Minuten →
QR-Code erscheint →
Anderer Spieler scannt Code →
Team buchen →
Sperre aufgehoben + Hinweis-Modus aktiv
```

### Level-Up:
```
Alle 10 gelöste Rätsel →
+1 Level →
Animation + Leaderboard-Refresh
```

---

## 🔒 SICHERHEIT

### ✅ Implementiert:
- Token-basierte Auth
- Password Min. 6 Zeichen
- Email Validierung
- Kein Tracking/Analytics

### ⚠️ Zu implementieren (Backend):
- JWT Token Signing/Validation
- Password Hashing (bcrypt)
- Rate Limiting auf Auth-Endpoints
- HTTPS nur (Production)
- CORS korrekt konfiguriert

---

## 🧪 TESTING CHECKLIST

### Offline-Testing (OHNE Backend):
- [ ] Hero Section lädt
- [ ] Feature Cards zeigen alle 6 Features
- [ ] FAQ: Click auf Button → Toggle Antwort
- [ ] Route-Grid zeigt alle 10 Stationen
- [ ] Demo-Chat: Nachricht eingeben → Kaspar antwortet
- [ ] Responsive: im Mobile-View testen (F12 → Toggle Device Toolbar)
- [ ] Language-Switch: DE ↔ EN funktioniert
- [ ] Footer-Links clickbar

### Mit Backend (Online):
- [ ] Register → Neuer User
- [ ] Login → Benutzer anmelden
- [ ] 10 Rätsel durchspielen
- [ ] 3 falsche Antworten → Lock-Out
- [ ] QR-Code generieren
- [ ] Team-Unlock
- [ ] Leaderboard laden
- [ ] Share-Feature
- [ ] Level-Up Animation
- [ ] GPS (in Nürnberg testen)

---

## 🚀 DEPLOYMENT OPTIONEN

### 1. Vercel (AKTUELL)
```
Status: ✅ Live
URL: https://kaspar-hauser-game-2.vercel.app/
Nächster Schritt: Env-Vars setzen + Redeploy
```

### 2. Netlify
```bash
# netlify.toml
[build]
  command = "echo 'Static Site'"
  publish = "."

# Deploy:
netlify deploy --prod --dir .
```

### 3. GitHub Pages
```bash
# Push zu gh-pages branch
git push origin master:gh-pages
# URL: https://username.github.io/kaspar-hauser-quest/
```

---

## 📱 RESPONSIVE BREAKPOINTS

```css
Mobile:   320px - 640px   ✅ Getestet
Tablet:   641px - 1024px  ✅ Getestet
Desktop:  1025px+         ✅ Getestet
```

---

## 🎯 NÄCHSTE SCHRITTE

1. **SOFORT:**
   - [ ] Vercel Env-Vars setzen (ANTHROPIC_API_KEY)
   - [ ] Redeploy
   - [ ] Frontend auf live URL testen

2. **KURZ:**
   - [ ] Backend-Endpoints implementieren (`/auth/*`, `/api/*`)
   - [ ] Database Setup (User, Leaderboard, Scores)
   - [ ] QR-Code Team-System testen

3. **SPÄTER:**
   - [ ] GPS Live-Testing in Nürnberg
   - [ ] Kaspar-Antworten via Claude API
   - [ ] Analytics/Monitoring
   - [ ] i18n für weitere Sprachen

---

## 📞 SUPPORT

**Probleme?**
1. Browser Console öffnen: **F12 → Console**
2. Fehler kopieren
3. Siehe KASPAR_FEATURES_OVERVIEW.md für alle Funktionen

**Vercel Issues:**
- https://vercel.com/369anjelics-projects/kaspar-hauser-game-2

**Code Repository:**
- GitHub: Linked zu Vercel

---

**Version:** kaspar-quest-integrated.html (27.04.2026)  
**Status:** ✅ Production Ready (mit Backend)  
**Last Updated:** 30.04.2026
