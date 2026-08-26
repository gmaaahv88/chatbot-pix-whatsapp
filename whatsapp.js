// whatsapp.js
// Stub simplificado — substitua pela sua implementação real com Twilio,
// que já existe no seu projeto chatbot-saas.

// const twilio = require('twilio');
// const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

async function notificarCliente(clienteId, mensagem) {
  // Exemplo de como ficaria com Twilio de verdade:
  //
  // await client.messages.create({
  //   from: 'whatsapp:+14155238886',
  //   to: `whatsapp:+${clienteId}`,
  //   body: mensagem,
  // });

  console.log(`[WhatsApp -> ${clienteId}]: ${mensagem}`);
}

module.exports = { notificarCliente };
