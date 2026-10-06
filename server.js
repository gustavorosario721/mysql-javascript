const express = require('express');
const path = require('path');
const pool = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/usuarios', async (req, res) => {
    const { nome, email } = req.body;
    if (!nome || !email) {
        return res.status(400).json({ error: 'Informe o nome e o e-mail' });
    }
    try {
        const sql = 'INSERT INTO usuarios (nome, email) VALUES (?, ?)';
        const [result] = await pool.execute(sql, [nome, email]);
        res.status(201).json({ id: result.insertId, nome, email });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Não foi possível cadastrar o usuário.' });
    }
});

app.get('/usuarios', async (req, res) => {
    try {
        const [usarios] = await pool.execute(
            'SELECT id, nome, email, criado_em FROM usuarios ORDER BY id DESC'
        );
        res.json(usarios);
    } catch (error) {
        res.status(500).json({ error: 'Não foi possível obter os usuários.' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});