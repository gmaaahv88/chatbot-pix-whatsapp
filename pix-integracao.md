# Chatbot Pix — Integração de Pagamento via Mercado Pago

Exemplo funcional de como adicionar cobrança e confirmação automática de
pagamento Pix ao seu chatbot com IA (chatbot-saas).

## Fluxo completo

```
Cliente pede algo no WhatsApp
        ↓
Bot chama POST /pix/cobranca
        ↓
API gera QR code + código "copia e cola"
        ↓
Bot envia isso pro cliente no WhatsApp
        ↓
Cliente paga o Pix
        ↓
Mercado Pago chama POST /pix/webhook automaticamente
        ↓
Status é atualizado no banco (SQLite)
        ↓
Bot avisa o cliente: "Pagamento confirmado! ✅"
```

## Como rodar

1. Instale as dependências:
   ```bash
   npm install
   ```

2. Copie o arquivo de ambiente e preencha com seu access token:
   ```bash
   cp .env.example .env
   ```
   Pegue seu `MP_ACCESS_TOKEN` de teste em:
   https://www.mercadopago.com.br/developers/panel/app

3. Para testar o webhook localmente, exponha seu servidor com ngrok
   (o Mercado Pago precisa de uma URL pública para te notificar):
   ```bash
   npx ngrok http 3000
   ```
   Copie a URL gerada (ex: `https://abcd1234.ngrok.app`) para `BASE_URL` no `.env`.

4. Rode o servidor:
   ```bash
   npm run dev
   ```

## Testando a criação de uma cobrança

```bash
curl -X POST http://localhost:3000/pix/cobranca \
  -H "Content-Type: application/json" \
  -d '{
    "valor": 49.90,
    "descricao": "Pedido #123",
    "clienteId": "5511999999999",
    "email": "cliente@email.com"
  }'
```

Resposta esperada:
```json
{
  "paymentId": "123456789",
  "status": "pending",
  "qrCode": "00020126...",
  "qrCodeBase64": "iVBORw0KGgo..."
}
```

Envie o `qrCode` (texto copia-e-cola) ou renderize o `qrCodeBase64` como
imagem para o cliente pagar.

## Estrutura dos arquivos

```
chatbot-saas/
├── docs/
│   └── pix-integracao.md       (este arquivo)
├── src/
│   ├── routes/
│   │   ├── pix.js
│   │   └── webhook.js
│   ├── mercadoPagoClient.js
│   ├── db.js
│   └── whatsapp.js
├── server.js
├── package.json
└── .env.example
```

| Arquivo | Responsabilidade |
|---|---|
| `server.js` | Entrada da aplicação, registra as rotas |
| `src/mercadoPagoClient.js` | Configuração do SDK do Mercado Pago |
| `src/routes/pix.js` | Cria cobrança Pix + consulta status |
| `src/routes/webhook.js` | Recebe notificação automática de pagamento |
| `src/db.js` | Persistência das cobranças (SQLite) |
| `src/whatsapp.js` | Stub de envio de mensagem (troque pela sua integração Twilio real) |

## Como integrar no seu chatbot-saas existente

- Troque o `db.js` deste exemplo pelas funções que você já tem no seu
  projeto (só adicione a tabela `cobrancas_pix`).
- Troque o `whatsapp.js` pela sua implementação real com Twilio.
- Chame `POST /pix/cobranca` a partir da sua lógica de conversação,
  quando o bot identificar que o cliente quer fechar um pedido.

## Próximos passos sugeridos

- Adicionar expiração de cobrança (Pix expira em X minutos)
- Tratar o caso de pagamento rejeitado/cancelado
- Se for marketplace (dividir valor entre plataforma e prestador), pesquisar
  o recurso de **split de pagamento** — Asaas tem isso mais pronto que o Mercado Pago
