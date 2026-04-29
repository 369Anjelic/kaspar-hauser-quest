# Das Kaspar Hauser Spiel v4

Eine 3-6 Spieler GPS-gesteuerte narrative Stadtadventure in Nürnberg mit Mysterium-Lösung.

## 📁 Projektstruktur

```
4 kaspar hauser 27.4.2026/
├── kaspar-spiel-v4.html          ⭐ Hauptspiel (Single-File App)
├── kaspar-mittelalter-quest.html  Landingpage / Homepage
├── server.js                      Express Backend + Claude API
├── package.json                   NPM Konfiguration
├── .env                          API Keys & Config
└── node_modules/                 Dependencies
```

## 🎮 Spiel starten

### Option 1: Direkt ohne Server (Offline)
Einfach öffnen: `kaspar-spiel-v4.html` im Browser

### Option 2: Mit Server & Claude AI (Online)
1. **API Key hinzufügen:**
   - Öffne `.env`
   - Ersetze `sk-ant-YOUR_KEY_HERE` mit deinem echten ANTHROPIC_API_KEY
   - Speichern

2. **Server starten:**
   ```bash
   npm start
   ```
   Server läuft dann auf `http://localhost:3000`

3. **Spiel öffnen:**
   Öffne `http://localhost:3000/kaspar-spiel-v4.html`

## ✨ Features

- ✓ 3-6 Spieler-Setup mit Namensvergabe
- ✓ Rollen: Ritter (⚔️), Hexe (🔮), Narr (🃏), Spieler (👤)
- ✓ Geheimer "Unbekannter" - Eine Rolle ist der Nachfahre des Mörders
- ✓ 10 historische Orte in Nürnberg
- ✓ Rollen-spezifische Aufgaben & exklusive Hinweise
- ✓ Gold-Münzen-Wetten mit Einfluss-Berechnung
- ✓ Hexe kann 4x Kaspar befragen (exklusiv)
- ✓ Narr kann Mehrheit widersprechen (50% Münzen an Gruppe)
- ✓ Abstimmung: Wer ist der Unbekannte?
- ✓ Finale mit Mörder-Enthüllung & Ranking
- ✓ Mehrsprachig: Deutsch, English, Español

## 🌍 Sprachen

Die App unterstützt DE/EN/ES. Sprachauswahl über Dropdown oben rechts.

## 📱 Responsive Design

Funktioniert auf Desktop, Tablet & Mobile.

## 🔧 Technologie

- Frontend: HTML5 + CSS3 + JavaScript (Vanilla)
- Backend: Node.js + Express
- AI: Anthropic Claude API (für dynamische Kaspar-Antworten)
- Design: Medieval Gothic Theme mit Gold-Akzenten

## 📝 Nächste Schritte

1. Teste das Spiel offline (`kaspar-spiel-v4.html`)
2. Konfiguriere `.env` mit deinem Claude API Key
3. Starte Server und teste Online-Integration
4. Verfeinere Hinweise, Gold-Werte, oder Ort-Inhalte nach Bedarf

---

🎭 **Das Kaspar Hauser Spiel - Version 4 (27.4.2026)**
Powered by Unwritten Studio
