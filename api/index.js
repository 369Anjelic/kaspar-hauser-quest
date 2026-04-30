const express = require('express');
const cors = require('cors');
const Anthropic = require('@anthropic-ai/sdk');
const axios = require('axios');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

const apiKey = process.env.ANTHROPIC_API_KEY;
const deepgramKey = process.env.DEEPGRAM_API_KEY;

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
      userSessions.set(userId, { activeQuest: 0, solved: [], questStarted: false, conversationState: 'initial' });
    }
    const session = userSessions.get(userId);

    const systemPrompt = `Du bist Kaspar Hauser, rätselhafter Charakter aus Nürnberg. Antworte auf Deutsch, konzise (2-3 Sätze). Sei mysteriös und einfühlsam.`;
    const currentQuest = session.activeQuest < QUESTS.length ? QUESTS[session.activeQuest] : null;
    let response;

    if (currentQuest && message.toLowerCase().trim().length < 50) {
      const msgLower = message.toLowerCase().trim();
      if (msgLower === currentQuest.answer.toLowerCase() || msgLower.includes(currentQuest.answer.toLowerCase())) {
        session.solved.push(currentQuest.id);
        session.activeQuest++;
        const isLast = session.activeQuest >= QUESTS.length;
        if (isLast) {
          response = `✓ Richtig! "${currentQuest.context}"\n\n🏆 ALLE 10 RÄTSEL GELÖST!`;
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

    let audioBase64 = null;
    try {
      if (deepgramKey && response) {
        const ttsResponse = await axios.post(
          'https://api.deepgram.com/v1/speak?model=aura-asteria-de&encoding=linear16',
          { text: response },
          {
            headers: { 'Authorization': `Token ${deepgramKey}`, 'Content-Type': 'application/json' },
            responseType: 'arraybuffer',
            timeout: 10000
          }
        );
        audioBase64 = Buffer.from(ttsResponse.data).toString('base64');
      }
    } catch (ttsError) {
      console.error('TTS Error:', ttsError.message);
    }

    res.json({ response, audio: audioBase64 ? `data:audio/wav;base64,${audioBase64}` : null, progress: `${session.solved.length}/10` });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
});

app.post('/api/tts', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'No text' });
    if (!deepgramKey) return res.status(500).json({ error: 'Deepgram not configured' });

    const response = await axios.post('https://api.deepgram.com/v1/speak?model=aura-asteria-de&encoding=linear16',
      { text },
      {
        headers: { 'Authorization': `Token ${deepgramKey}`, 'Content-Type': 'application/json' },
        responseType: 'arraybuffer',
        timeout: 10000
      }
    );
    res.setHeader('Content-Type', 'audio/wav');
    res.send(response.data);
  } catch (error) {
    res.status(500).json({ error: 'TTS Error: ' + error.message });
  }
});

app.get('/api/leaderboard', (req, res) => {
  const leaderboard = Array.from(userSessions.entries())
    .map(([userId, session]) => ({ username: userId === 'default' ? 'Anonymous' : userId, rank: 'Detektiv', points: session.solved.length * 100, locations_visited: session.solved.length }))
    .sort((a, b) => b.points - a.points)
    .slice(0, 10);
  res.json({ leaderboard });
});

app.post('/api/reset', (req, res) => {
  const { userId = 'default' } = req.body;
  userSessions.set(userId, { activeQuest: 0, solved: [], questStarted: false, conversationState: 'initial' });
  res.json({ success: true });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', anthropic: !!apiKey ? 'configured' : 'missing', deepgram: !!deepgramKey ? 'configured' : 'missing' });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/kaspar-quest-integrated.html'));
});

app.get('/:file(\\w+\\.html)', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', req.params.file));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/kaspar-quest-integrated.html'));
});

module.exports = app;
