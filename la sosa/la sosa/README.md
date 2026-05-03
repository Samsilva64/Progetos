# Restaurante La Rosa

Aplicacao front-end para um restaurante, com cardapio digital, formulario de pedido e envio da mensagem pelo WhatsApp.

## Funcionalidades

- Exibicao de pratos cadastrados no cardapio.
- Formulario para cliente informar nome, telefone, endereco, prato e quantidade.
- Abertura do WhatsApp com a mensagem do pedido ja formatada.
- Salvamento de rascunho do pedido no `localStorage`.
- Painel do dono protegido por senha local.
- Cadastro, edicao e remocao de pratos.
- Upload de imagem do prato, salvo localmente no navegador.
- Lista local de pedidos recebidos.
- Importacao e exportacao dos dados em JSON.

## Tecnologias

- HTML5
- CSS3
- JavaScript
- LocalStorage

## Como executar

1. Abra a pasta `la sosa/la sosa`.
2. Abra o arquivo `index.html` no navegador.
3. Use o cardapio e o formulario normalmente.

## Acesso ao painel

A senha atual do painel esta definida no arquivo `script.js`:

```js
const ADMIN_PASS = 'larosa123';
```

Para alterar, edite esse valor no JavaScript.

## Estrutura

```text
la sosa/
  index.html
  style.css
  script.js
```

## Observacao

Este projeto salva dados apenas no navegador. Para uso real em producao, o ideal e adicionar backend, banco de dados e autenticacao segura.
