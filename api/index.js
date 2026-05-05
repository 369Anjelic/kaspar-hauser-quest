const express = require('express');
const cors = require('cors');
const Anthropic = require('@anthropic-ai/sdk');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

const apiKey = process.env.ANTHROPIC_API_KEY;
const client = new Anthropic({ apiKey: apiKey || '' });

const QUESTS = [
  { id: 1, name: "Handwerkerhof", answer: "gold", context: "Das goldene Nürnberg" },
  { id: 2, name: "St. Lorenz Kirche", answer: "verkündigung", context: "Engelssalutation" },
  { id: 3, name: "Nassauer Haus", answer: "geschlechterturm", context: "Stadtturm" },
  { id: 4, name: "Schöner Brunnen", answer: "wunsch", context: "Wunschring" },
  { id: 5, name: "Frauenkirche", answer: "männleinlaufen", context: "Männleinlaufen" },
  { id: 6, name: "Altes Rathaus", answer: "eiserne jungfrau", context: "Foltergerät" },
  { id: 7, name: "St. Sebald", answer: "sebaldus", context: "Schutzpatron" },
  { id: 8, name: "Kaiserburg", answer: "reichskleinodien", context: "Kaiser-Schätze" },
  { id: 9, name: "Weinstadel", answer: "lepra", context: "Ausatz" },
  { id: 10, name: "Henkersteg", answer: "folter", context: "Hinrichtung" }
];

const userSessions = new Map();

app.post('/api/bot', async (req, res) => {
  try {
    const { message, history = [], userId = 'default' } = req.body;
    if (!message) return res.status(400).json({ error: 'Message required' });

    if (!userSessions.has(userId)) {
      userSessions.set(userId, { activeQuest: 0, solved: [], questStarted: false });
    }
    const session = userSessions.get(userId);

    const systemPrompt = `Du bist Kaspar Hauser, ein rätselhafter Charakter aus dem Mittelalter von Nürnberg.
Du führst Spieler durch eine Schnitzeljagd mit 10 historischen Rätseln an realen Orten in Nürnberg.

Deine Persönlichkeit:
- Mysteriös, einfühlsam, nachdenklich
- Du erzählst von Nürnberg im Mittelalter mit authentischen Details
- Du gibst Hinweise, wenn der Spieler falsch antwortet (bis zu 3 Versuche)

Aktuelle Quest: ${session.activeQuest < QUESTS.length ? QUESTS[session.activeQuest].name : 'ABGESCHLOSSEN'}
Gelöste Rätsel: ${session.solved.length}/10`;

    const currentQuest = session.activeQuest < QUESTS.length ? QUESTS[session.activeQuest] : null;
    let response;

    if (currentQuest && message.toLowerCase().trim().length < 50) {
      const msgLower = message.toLowerCase().trim();
      if (msgLower === currentQuest.answer.toLowerCase() || msgLower.includes(currentQuest.answer.toLowerCase())) {
        session.solved.push(currentQuest.id);
        session.activeQuest++;
        const isLast = session.activeQuest >= QUESTS.length;
        if (isLast) {
          response = `✓ Richtig! "${currentQuest.context}"\n\n🏆 ALLE 10 RÄTSEL GELÖST! Du bist Mittelalter-Meister von Nürnberg!`;
        } else {
          const nextQuest = QUESTS[session.activeQuest];
          response = `✓ Richtig! "${currentQuest.context}"\n\n📍 Station ${session.activeQuest + 1}: ${nextQuest.name}`;
        }
        return res.json({ response, correct: true, progress: `${session.solved.length}/10` });
      }
    }

    try {
      if (!apiKey) return res.status(500).json({ error: 'API Key not configured' });
      const messages = (history || []).slice(-5).map(h => ({ role: h.role || 'user', content: h.content || '' }));
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
      response = `Kaspar: "Die Zeit scheint zu verschwinden..."`;
    }

    res.json({ response, progress: `${session.solved.length}/10` });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
});

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

app.post('/api/reset', (req, res) => {
  const { userId = 'default' } = req.body;
  userSessions.set(userId, { activeQuest: 0, solved: [], questStarted: false });
  res.json({ success: true });
});

module.exports = app;
