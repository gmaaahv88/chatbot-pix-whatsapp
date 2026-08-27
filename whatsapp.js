// whatsapp.js
// Envio real de mensagens via Twilio (WhatsApp API).

const twilio = require('twilio');

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

async function notificarCliente(clienteId, mensagem) {
  try {
    await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_FROM,
      to: `whatsapp:+${clienteId}`,
      body: mensagem,
    });
    console.log(`Mensagem enviada com sucesso para ${clienteId}`);
  } catch (erro) {
    console.error(`Erro ao enviar mensagem para ${clienteId}:`, erro.message);
  }
}

module.exports = { notificarCliente };