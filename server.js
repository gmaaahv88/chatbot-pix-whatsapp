require('dotenv').config();
const express = require('express');
const pixRoutes = require('./pix');
const webhookRoutes = require('./webhook');
const { iniciarAgendador } = require('./agendador');
const app = express();
app.use(express.json());
app.use('/pix', pixRoutes);
app.use('/pix', webhookRoutes);
app.get('/', (req, res) => {
  res.send('Chatbot Pix API rodando 🚀');
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
iniciarAgendador();