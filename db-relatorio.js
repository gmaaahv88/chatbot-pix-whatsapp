// db-relatorio.js
// Função de consulta para montar o resumo do dia.
// Adicione este código dentro do seu db.js existente (não precisa criar
// um arquivo novo — veja as instruções no final).

/**
 * Busca o resumo das cobranças Pix criadas HOJE.
 * Retorna: total de cobranças, quantas foram aprovadas, quantas
 * ainda estão pendentes, e o valor total recebido (só das aprovadas).
 */
function obterResumoDoDia() {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT status, valor
       FROM cobrancas_pix
       WHERE date(criado_em) = date('now')`,
      [],
      (erro, linhas) => {
        if (erro) return reject(erro);

        const resumo = {
          totalCobrancas: linhas.length,
          aprovadas: 0,
          pendentes: 0,
          valorRecebido: 0,
        };

        linhas.forEach((linha) => {
          if (linha.status === 'approved') {
            resumo.aprovadas += 1;
            resumo.valorRecebido += linha.valor;
          } else if (linha.status === 'pending') {
            resumo.pendentes += 1;
          }
        });

        resolve(resumo);
      }
    );
  });
}

// Não esqueça de adicionar "obterResumoDoDia" no module.exports do seu db.js
