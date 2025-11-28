# Aplicacao2

Projeto React (Vite + React Router) com integração Web Bluetooth e jogo estilo Guitar Hero.

## Scripts

- `npm install`: instala dependências
- `npm run dev`: inicia o servidor de desenvolvimento
- `npm run build`: gera build de produção
- `npm run preview`: serve a build gerada

## Estrutura

- `app/` componentes e rotas
- `public/` assets estáticos (ex.: `public/audio`)
- `vite.config.ts` configuração do Vite

## Backend API e Variáveis de Ambiente

O jogo envia um POST com o resultado ao fim da música. A URL da API pode ser configurada via variável de ambiente `VITE_API_URL`.

### Como configurar

1. Crie um arquivo `.env` na raiz do projeto com:

```
VITE_API_URL=https://seu-backend.exemplo.com
```

2. Se não configurar `VITE_API_URL`, o app usa o caminho relativo `/api/scores`.

3. Para desenvolvimento, você pode rodar seu backend local (por exemplo `http://localhost:3000`) e usar o proxy do Vite para evitar CORS:

```
VITE_PROXY_TARGET=http://localhost:3000
```

Com isso, requisições a `/api/*` durante `npm run dev` serão encaminhadas para o backend.

Após alterar `.env`, reinicie o servidor de desenvolvimento.

### Payload enviado

`POST {API_BASE}/scores` com corpo JSON:

```
{
	"userIdentifier": string,
	"score": number,
	"music": string
}
```

## Áudio

Coloque seus arquivos `.mp3` em `public/audio`. Exemplo de uso no código:

```ts
const SONGS = [{ audioUrl: "/audio/MinhaMusica.mp3" }];
```
