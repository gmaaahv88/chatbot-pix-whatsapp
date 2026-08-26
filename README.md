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

## Estrutura do projeto

```
chatbot-pix-whatsapp/
├── docs/
│   └── pix-integracao.md      → detalhes técnicos da integração
├── server.js                  → entrada da aplicação
├── mercadoPagoClient.js        → configuração do SDK do Mercado Pago
├── pix.js                     → cria cobrança Pix + consulta status
├── webhook.js                  → recebe confirmação automática de pagamento
├── db.js                      → persistência das cobranças (SQLite)
└── whatsapp.js                → envio de notificação ao cliente
```

## Como rodar localmente

```bash
npm install
cp .env.example .env   # preencha com seu MP_ACCESS_TOKEN
npm run dev
```

Veja o passo a passo completo em [`docs/pix-integracao.md`](docs/pix-integracao.md).

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
