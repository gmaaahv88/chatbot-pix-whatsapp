// produtos.js
// Rotas para cadastrar/atualizar produtos e sua quantidade em estoque.

const express = require('express');
const router = express.Router();
const db = require('./db');

router.post('/', async (req, res) => {
  const { nome, quantidade, quantidadeMinima } = req.body;

  if (!nome || quantidade === undefined) {
    return res.status(400).json({
      erro: 'Campos obrigatórios: nome, quantidade',
    });
  }

  try {
    await db.definirProduto({ nome, quantidade, quantidadeMinima });
    return res.status(201).json({ mensagem: 'Produto salvo com sucesso' });
  } catch (erro) {
    console.error('Erro ao salvar produto:', erro);
    return res.status(500).json({ erro: 'Falha ao salvar produto' });
  }
});

module.exports = router;