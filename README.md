# Chatbot Pix WhatsApp

Integração de pagamento via Pix (Mercado Pago) em um chatbot de atendimento
com IA no WhatsApp — do pedido à confirmação automática, sem intervenção manual.

## O que esse projeto resolve

Pequenos negócios que atendem clientes pelo WhatsApp geralmente enfrentam o
mesmo problema: confirmar manualmente se um Pix caiu antes de liberar um
pedido. Este projeto automatiza isso de ponta a ponta.

## Fluxo completo

```
Cliente pede algo no WhatsApp
        ↓
Bot gera cobrança Pix (QR code + código copia-e-cola)
        ↓
Cliente paga
        ↓
Mercado Pago notifica automaticamente via webhook
        ↓
Status é atualizado no banco de dados
        ↓
Bot confirma para o cliente: "Pagamento confirmado! ✅"
```

## Stack utilizada

- **Node.js + Express** — servidor e rotas da API
- **Mercado Pago SDK** — geração de cobrança Pix e consulta de status
- **SQLite** — persistência das cobranças
- **Twilio (WhatsApp API)** — notificação automática ao cliente

## Relatório automático diário

Além da cobrança e confirmação de pagamento, o sistema também envia
automaticamente, todo dia num horário configurável, um resumo por WhatsApp
para o dono do negócio — sem precisar abrir nenhum painel:

```
📊 Relatório do dia 26/08/2026

Cobranças criadas: 5
✅ Aprovadas: 4
⏳ Pendentes: 1

💰 Total recebido: R$ 340,00
```

O horário é configurado via variável de ambiente (`REPORT_CRON_TIME`),
usando o formato padrão de agendamento cron.

## Alerta automático de estoque baixo

O sistema também monitora o estoque de produtos cadastrados e avisa
automaticamente, todo dia num horário configurável, quando algum item
está abaixo da quantidade mínima definida:

```
⚠️ Alerta de estoque baixo

- Creatina 300g: 2 un. (mínimo: 5)
```

Se nenhum produto estiver abaixo do mínimo, nenhuma mensagem é enviada
— evitando notificações desnecessárias.

## Estrutura do projeto

```
chatbot-pix-whatsapp/
├── docs/
│   └── pix-integracao.md      → detalhes técnicos da integração
├── server.js                  → entrada da aplicação
├── mercadoPagoClient.js        → configuração do SDK do Mercado Pago
├── pix.js                     → cria cobrança Pix + consulta status
├── webhook.js                  → recebe confirmação automática de pagamento
├── db.js                      → persistência das cobranças, produtos e estoque
├── whatsapp.js                → envio de notificação ao cliente
├── relatorio.js                → monta e envia o resumo diário
├── produtos.js                 → cadastra/atualiza produtos e quantidade
├── estoque.js                  → verifica produtos com estoque baixo
└── agendador.js                → dispara relatório e alerta automaticamente (cron)
```

## Como rodar localmente

```bash
npm install
cp .env.example .env   # preencha com seu MP_ACCESS_TOKEN
npm run dev
```

Veja o passo a passo completo em [`pix-integracao.md`](pix-integracao.md).

## Endpoints principais

| Rota | Método | O que faz |
|---|---|---|
| `/pix/cobranca` | POST | Cria uma cobrança Pix e retorna QR code |
| `/pix/status/:paymentId` | GET | Consulta manual do status de um pagamento |
| `/pix/webhook` | POST | Recebido automaticamente pelo Mercado Pago quando o status muda |

## Sobre este projeto

Desenvolvido como evolução de um chatbot de atendimento com IA já existente,
adicionando a camada de pagamento que aparece com frequência em demandas reais
de automação para pequenos negócios.

---

Desenvolvido por [Marcela Vieira](https://github.com/gmaaahv88)
