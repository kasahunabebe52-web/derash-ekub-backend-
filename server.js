// server.js - Render Hosting Edition
const express = require('express');
const cors = require('cors');
const app = express();

// Render ራሱ የሚሰጠውን ፖርት እንዲጠቀም ወሳኝ ማስተካከያ
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

let totalFund = 0;
let pool = [];

app.post('/api/buy-ticket', (req, res) => {
    const { name, amount } = req.body;
    if (!name || !amount) {
        return res.status(400).json({ error: "ስም እና የብር መጠን ያስፈልጋል!" });
    }
    totalFund += amount;
    let ticketCount = amount / 10;
    for (let i = 0; i < ticketCount; i++) {
        pool.push(name);
    }
    console.log(`[የአዲስ እጣ] ስም: ${name}, ያዋጣው: ${amount} ETB`);
    res.json({ success: true, totalFund });
});

app.get('/api/status', (req, res) => {
    res.json({ totalFund, poolSize: pool.length, members: [...new Set(pool)] });
});

app.post('/api/draw', (req, res) => {
    if (pool.length < 3) {
        return res.status(400).json({ error: "እጣ ለመቁረጥ ቢያንስ 3 እጣዎች መሸጥ አለባቸው!" });
    }
    let idx1 = Math.floor(Math.random() * pool.length);
    let winner1 = pool[idx1];
    let tempPool = pool.filter(name => name !== winner1);
    let idx2 = Math.floor(Math.random() * tempPool.length);
    let winner2 = tempPool[idx2];
    let finalPool = tempPool.filter(name => name !== winner2);
    let idx3 = Math.floor(Math.random() * finalPool.length);
    let winner3 = finalPool[idx3];

    const results = {
        winner1, prize1: totalFund * 0.5,
        winner2, prize2: totalFund * 0.3,
        winner3, prize3: totalFund * 0.2
    };
    totalFund = 0;
    pool = [];
    res.json({ success: true, results });
});

// Render ላይ ሰርቨሩ በጤና መኖሩን ማረጋገጫ (Health Check)
app.get('/', (req, res) => {
    res.send("የደራሽ እቁብ ሰርቨር በኢንተርኔት ላይ በተሳካ ሁኔታ እየሰራ ነው!");
});

app.listen(PORT, () => {
    console.log(`🚀 ሰርቨሩ በፖርት ${PORT} ላይ መስራት ጀምሯል!`);
});
