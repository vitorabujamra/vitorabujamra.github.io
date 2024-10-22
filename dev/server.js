const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Serve arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Rota padrão para enviar o index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rota para home
app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// Exemplo de outras rotas - você pode adicionar mais conforme necessário
app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'about.html')); // ajuste conforme o nome do arquivo
});

// Rota para páginas específicas
app.get('/pages/:page', (req, res) => {
    const page = req.params.page;
    res.sendFile(path.join(__dirname, 'public', 'pages', `${page}.html`), (err) => {
        if (err) {
            res.status(404).sendFile(path.join(__dirname, 'public', 'pages', '404.html'));
        }
    });
});

// Rota para arquivos 404
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', 'pages', '404.html'));
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
