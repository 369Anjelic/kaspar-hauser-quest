require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Anthropic = require('@anthropic-ai/sdk');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('./'));

const apiKey = process.env.ANTHROPIC_API_KEY || '';

const client = new Anthropic({
  apiKey: apiKey
});

// Kaspar Hauser Quests Data
const QUESTS = [
  { id:1, name:"Handwerkerhof", answer:"gold", context:"Das goldene Nürnberg" },
  { id:2, name:"St. Lorenz Kirche", answer:"verkündigung", context:"Engelssalutation" },
  { id:3, name:"Nassauer Haus", answer:"geschlechterturm", context:"Stadtturm" },
  { id:4, name:"Schöner Brunnen", answer:"wunsch", context:"Wunschring" },
  { id:5, name:"Frauenkirche", answer:"männleinlaufen", context:"Männleinlaufen" },
  { id:6, name:"Altes Rathaus", answer:"eiserne jungfrau", context:"Foltergerät" },
  { id:7, name:"St. Sebald", answer:"sebaldus", context:"Schutzpatron" },
  { id:8, name:"Kaiserburg", answer:"reichskleinodien", context:"Kaiser-Schätze" },
  { id:9, name:"Weinstadel", answer:"lepra", context:"Ausatz" },
  { id:10, name:"Henkersteg", answer:"folter", context:"Hinrichtung" }
];

const userSessions = new Map();

// Bot response handler
app.post('/api/bot', async (req, res) => {
  try {
    const { message, history, userId = 'default' } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message required' });
    }

    // Get or create user session
    if (!userSessions.has(userId)) {
      userSessions.set(userId, {
        activeQuest: 0,
        solved: [],
        questStarted: false,
        conversationState: 'initial'
      });
    }
    const session = userSessions.get(userId);

    // Build conversation context
    const systemPrompt = `Du bist Kaspar Hauser, ein rätselhafter Charakter aus dem Mittelalter von Nürnberg.
Du führst Spieler durch eine Schnitzeljagd mit 10 historischen Rätseln an realen Orten in Nürnberg.

Deine Persönlichkeit:
- Mysteriös, einfühlsam, nachdenklich
- Du erzählst von Nürnberg im Mittelalter mit authentischen Details
- Du gibst Hinweise, wenn der Spieler falsch antwortet (bis zu 3 Versuche)
- Nach 3 falschen Versuchen: "Du brauchst Hilfe — scanne den QR-Code"

Aktuelle Quest: ${session.activeQuest < QUESTS.length ? QUESTS[session.activeQuest].name : 'ABGESCHLOSSEN'}
Gelöste Rätsel: ${session.solved.length}/10

Wichtig:
- Antworte auf Deutsch
- Halte Antworten konzise (2-3 Sätze)
- Sei kreativ aber historisch akkurat`;

    // Check if user is answering a quiz question
    const currentQuest = session.activeQuest < QUESTS.length ? QUESTS[session.activeQuest] : null;
    let response;

    if (currentQuest) {
      const msgLower = message.toLowerCase().trim();
      const answerLower = currentQuest.answer.toLowerCase();

      // Check if answer is correct
      if (msgLower === answerLower || msgLower.includes(answerLower)) {
        session.solved.push(currentQuest.id);
        session.activeQuest++;

        const isLast = session.activeQuest >= QUESTS.length;
        if (isLast) {
          response = `✓ Richtig! "${currentQuest.context}"\n\n🏆 ALLE 10 RÄTSEL GELÖST! Du bist Mittelalter-Meister von Nürnberg! 🎉`;
        } else {
          const nextQuest = QUESTS[session.activeQuest];
          response = `✓ Richtig! "${currentQuest.context}"\n\n📍 Station ${session.activeQuest + 1}: ${nextQuest.name}\nScreib "weiter" um das nächste Rätsel zu hören.`;
        }
        return res.json({ response, correct: true, progress: `${session.solved.length}/10` });
      }
    }

    // For non-quiz messages, use Claude AI
    try {
      const messages = history.slice(-5).map(h => ({
        role: h.role,
        content: h.content
      }));
      messages.push({ role: 'user', content: message });

      const completion = await client.messages.create({
        model: 'claude-opus-4-7',
        max_tokens: 300,
        system: systemPrompt,
        messages: messages
      });

      response = completion.content[0].text;
    } catch (apiError) {
      console.error('Claude API error:', apiError);
      response = `Kaspar antwortet mysteriös: "Die Zeit scheint zu verschwinden... Versuche es später erneut."`;
    }

    res.json({
      response,
      progress: `${session.solved.length}/10`
    });

  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Leaderboard endpoint
app.get('/leaderboard', (req, res) => {
  const leaderboard = Array.from(userSessions.entries())
    .map(([userId, session]) => ({
      username: userId === 'default' ? 'Anonymous' : userId,
      rank: 'Detektiv',
      points: session.solved.length * 100,
      locations_visited: session.solved.length
    }))
    .sort((a, b) => b.points - a.points)
    .slice(0, 10);

  res.json({ leaderboard });
});

// Reset session
app.post('/api/reset', (req, res) => {
  const { userId = 'default' } = req.body;
  userSessions.set(userId, { activeQuest: 0, solved: [] });
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`\n🚀 Kaspar Hauser Bot Server läuft auf http://localhost:${PORT}`);
  console.log(`📍 API Endpoint: http://localhost:${PORT}/api/bot`);
  console.log(`\n💡 Browser öffnen: http://localhost:${PORT}/kaspar-mittelalter-quest.html\n`);
});
