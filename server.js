// server.js - ንፁህ የደራሽ እቁብ ባክኤንድ ሰርቨር
const express = require('express');
const cors = require('cors');
const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

let totalFund = 0;
let pool = [];

app.post('/api/buy-ticket', (req, res) => {
    const { name, amount } = req.body;
    if (!name || !amount) return res.status(400).json({ error: "መረጃ ጎድሏል!" });
    
    totalFund += amount;
    let ticketCount = amount / 10;
    for (let i = 0; i < ticketCount; i++) pool.push(name);
    
    res.json({ success: true, totalFund });
});

app.get('/api/status', (req, res) => {
    res.json({ totalFund, poolSize: pool.length, members: [...new Set(pool)] });
});

app.post('/api/draw', (req, res) => {
    if (pool.length < 3) return res.status(400).json({ error: "ቢያንስ 3 እጣ ያስፈልጋል!" });
    
    let winner1 = pool[Math.floor(Math.random() * pool.length)];
    let temp = pool.filter(n => n !== winner1);
    let winner2 = temp[Math.floor(Math.random() * temp.length)] || winner1;
    let finalP = temp.filter(n => n !== winner2);
    let winner3 = finalP[Math.floor(Math.random() * finalP.length)] || winner2;

    const results = {
        winner1, prize1: totalFund * 0.5,
        winner2, prize2: totalFund * 0.3,
        winner3, prize3: totalFund * 0.2
    };
    totalFund = 0; pool = [];
    res.json({ success: true, results });
});

app.get('/', (req, res) => { res.send("ሰርቨር Live ነው!"); });

app.listen(PORT, () => { 
    console.log(`🚀 የደራሽ እቁብ ሰርቨር በፖርት ${PORT} ላይ በራ!`); 
});
