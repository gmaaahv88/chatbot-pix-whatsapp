// routes/webhook.js
// O Mercado Pago chama essa rota automaticamente quando o status
// de um pagamento muda (ex: pendente -> aprovado).

const express = require('express');
const router = express.Router();
const { payment } = require('./mercadoPagoClient');
const db = require('./db');
const { notificarCliente } = require('./whatsapp'); // seu módulo Twilio já existente

/**
 * POST /pix/webhook
 * Formato de notificação do Mercado Pago:
 * { "action": "payment.updated", "data": { "id": "123456789" } }
 */
router.post('/webhook', async (req, res) => {
  try {
    const { action, data } = req.body;

    // Responde 200 imediatamente é importante — o Mercado Pago
    // reenvia a notificação se não receber resposta rápida.
    res.sendStatus(200);

    if (action !== 'payment.updated' && action !== 'payment.created') {
      return;
    }

    const paymentId = data?.id;
    if (!paymentId) return;

    // Busca os detalhes atualizados do pagamento na API do Mercado Pago
    const detalhes = await payment.get({ id: paymentId });
    const { status } = detalhes; // pending, approved, rejected, etc.

    // Atualiza o status no seu banco (SQLite)
    const cobranca = await db.atualizarStatusCobranca(paymentId, status);

    if (status === 'approved' && cobranca?.clienteId) {
      // Avisa o cliente no WhatsApp que o pagamento foi confirmado
      await notificarCliente(
        cobranca.clienteId,
        `Pagamento confirmado! ✅ Seu pedido já está sendo processado.`
      );
    }
  } catch (erro) {
    console.error('Erro ao processar webhook:', erro);
    // Já respondemos 200 antes, então só logamos o erro
  }
});

module.exports = router;
