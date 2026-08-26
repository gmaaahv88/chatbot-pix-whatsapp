// routes/pix.js
// Rotas responsáveis por criar cobranças Pix e consultar status.

const express = require('express');
const router = express.Router();
const { payment } = require('./mercadoPagoClient');
const db = require('./db');
// (ambos ficam agora dentro de src/, um nível acima de src/routes/)

/**
 * POST /pix/cobranca
 * Cria uma cobrança Pix e retorna o QR code + código "copia e cola".
 *
 * Body esperado:
 * {
 *   "valor": 49.90,
 *   "descricao": "Pedido #123",
 *   "clienteId": "5511999999999",   // ex: telefone do WhatsApp
 *   "email": "cliente@email.com"
 * }
 */
router.post('/cobranca', async (req, res) => {
  const { valor, descricao, clienteId, email } = req.body;

  if (!valor || !clienteId || !email) {
    return res.status(400).json({
      erro: 'Campos obrigatórios: valor, clienteId, email',
    });
  }

  try {
    const resultado = await payment.create({
      body: {
        transaction_amount: Number(valor),
        description: descricao || 'Pagamento via chatbot',
        payment_method_id: 'pix',
        payer: { email },
        // notification_url é o endpoint que o Mercado Pago vai chamar
        // quando o status do pagamento mudar (webhook)
        notification_url: `${process.env.BASE_URL}/pix/webhook`,
      },
    });

    const {
      id: paymentId,
      status,
      point_of_interaction: pontoInteracao,
    } = resultado;

    const qrCode = pontoInteracao?.transaction_data?.qr_code;
    const qrCodeBase64 = pontoInteracao?.transaction_data?.qr_code_base64;

    // Salva a cobrança no banco pra rastrear depois pelo webhook
    await db.salvarCobranca({
      paymentId,
      clienteId,
      valor,
      status,
    });

    return res.status(201).json({
      paymentId,
      status,
      qrCode, // código "copia e cola"
      qrCodeBase64, // imagem do QR code em base64 (pra exibir no WhatsApp/painel)
    });
  } catch (erro) {
    console.error('Erro ao criar cobrança Pix:', erro);
    return res.status(500).json({ erro: 'Falha ao gerar cobrança Pix' });
  }
});

/**
 * GET /pix/status/:paymentId
 * Consulta manual do status (útil para debug ou fallback caso o webhook falhe)
 */
router.get('/status/:paymentId', async (req, res) => {
  try {
    const resultado = await payment.get({ id: req.params.paymentId });
    return res.json({ status: resultado.status });
  } catch (erro) {
    console.error('Erro ao consultar pagamento:', erro);
    return res.status(500).json({ erro: 'Falha ao consultar status' });
  }
});

module.exports = router;
