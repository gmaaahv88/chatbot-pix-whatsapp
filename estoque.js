// estoque.js
// Verifica quais produtos estão com estoque baixo e envia alerta via WhatsApp.

const db = require('./db');
const { notificarCliente } = require('./whatsapp');

function montarMensagem(produtos) {
  const linhas = produtos.map(
    (p) => `- ${p.nome}: ${p.quantidade} un. (mínimo: ${p.quantidade_minima})`
  );

  return `⚠️ *Alerta de estoque baixo*\n\n${linhas.join('\n')}`;
}

async function verificarEstoqueBaixo() {
  try {
    const produtos = await db.obterProdutosComEstoqueBaixo();

    if (produtos.length === 0) {
      console.log('Estoque ok — nenhum produto abaixo do mínimo.');
      return;
    }

    const mensagem = montarMensagem(produtos);

    const donoWhatsapp = process.env.DONO_WHATSAPP;
    if (!donoWhatsapp) {
      console.error(
        'DONO_WHATSAPP não configurado no .env — alerta não enviado.'
      );
      return;
    }

    await notificarCliente(donoWhatsapp, mensagem);
    console.log('Alerta de estoque baixo enviado com sucesso.');
  } catch (erro) {
    console.error('Erro ao verificar estoque baixo:', erro);
  }
}

module.exports = { verificarEstoqueBaixo };