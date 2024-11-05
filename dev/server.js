const express = require('express');
const path = require('path');
const fs = require('fs');
const session = require('express-session');

const app = express();
const PORT = 3000;

// Configuração do middleware de sessão
app.use(session({
    secret: 'seu_segredo_aqui', // Use um segredo forte para produção
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Ajuste para true se estiver usando HTTPS
}));

// Middleware para verificar se o usuário está autenticado
function authMiddleware(req, res, next) {
    if (req.session.user) {
        next(); // Usuário autenticado, continue
    } else {
        res.redirect('/login'); // Redirecionar para a página de login
    }
}

// Middleware para processar formulários
app.use(express.urlencoded({ extended: true }));

// Serve arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Rota para o dashboard com verificação de sessão
app.get('/dashboard', authMiddleware, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pages', 'dashboard.html'));
});

// Rota de login (exemplo simples)
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pages', 'login.html'));
});

// Rota para processar o login
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Aqui você deve verificar o nome de usuário e a senha
    // Para este exemplo, vamos considerar que o usuário e a senha corretos são 'admin' e 'senha'
    if (username === 'admin' && password === 'senha') {
        req.session.user = { name: username }; // Armazenar dados do usuário na sessão
        res.redirect('/dashboard'); // Redirecionar para o dashboard
    } else {
        res.redirect('/login'); // Redirecionar para o login se falhar
    }
});

// Rota para páginas específicas com verificação de sessão
app.get('/pages/:page', authMiddleware, (req, res) => {
    const page = req.params.page;
    const pagePath = path.join(__dirname, 'public', 'pages', `${page}.html`);

    if (fs.existsSync(pagePath)) {
        res.sendFile(pagePath);
    } else {
        res.sendFile(path.join(__dirname, 'public', 'pages', '404.html'));
    }
});

// Middleware para lidar com rotas que não existem
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', 'pages', '404.html'));
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
