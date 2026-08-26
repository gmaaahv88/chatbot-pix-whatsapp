// mercadoPagoClient.js
// VERSÃO SIMULADA (MOCK) — usada enquanto você não tem o Access Token real.
// Troque pelo arquivo real assim que conseguir acessar o painel do Mercado Pago.

let contador = 1000;

const payment = {
  // Simula a criação de uma cobrança Pix
  create: async ({ body }) => {
    const id = String(contador++);
    console.log(`[MOCK] Cobrança criada: id=${id}, valor=${body.transaction_amount}`);

    return {
      id,
      status: 'pending',
      point_of_interaction: {
        transaction_data: {
          qr_code: '00020126FAKE-PIX-CODE-PARA-TESTE-5303986540510.005802BR',
          qr_code_base64: '', // vazio no mock, no real vem uma imagem em base64
        },
      },
    };
  },

  // Simula a consulta de status — sempre retorna "approved" pra você ver o fluxo completo
  get: async ({ id }) => {
    console.log(`[MOCK] Consultando status do pagamento ${id} -> approved`);
    return { id, status: 'approved' };
  },
};

module.exports = { payment };