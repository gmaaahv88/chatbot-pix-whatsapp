// relatorio.js
// Monta a mensagem do relatório diário e envia via WhatsApp.

const db = require('./db');
const { notificarCliente } = require('./whatsapp');

function formatarMoeda(valor) {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

function montarMensagem(resumo) {
  const hoje = new Date().toLocaleDateString('pt-BR');

  return (
    `📊 *Relatório do dia ${hoje}*\n\n` +
    `Cobranças criadas: ${resumo.totalCobrancas}\n` +
    `✅ Aprovadas: ${resumo.aprovadas}\n` +
    `⏳ Pendentes: ${resumo.pendentes}\n\n` +
    `💰 Total recebido: ${formatarMoeda(resumo.valorRecebido)}`
  );
}

async function enviarRelatorioDiario() {
  try {
    const resumo = await db.obterResumoDoDia();
    const mensagem = montarMensagem(resumo);

    const donoWhatsapp = process.env.DONO_WHATSAPP;
    if (!donoWhatsapp) {
      console.error(
        'DONO_WHATSAPP não configurado no .env — relatório não enviado.'
      );
      return;
    }

    await notificarCliente(donoWhatsapp, mensagem);
    console.log('Relatório diário enviado com sucesso.');
  } catch (erro) {
    console.error('Erro ao gerar/enviar relatório diário:', erro);
  }
}

module.exports = { enviarRelatorioDiario };