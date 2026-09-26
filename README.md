# 🏦 Simucred — Credit Simulation Platform

O **Simucred** é uma plataforma de simulação e análise de concessão de crédito desenvolvida para automatizar etapas do processo de avaliação financeira, proporcionando uma experiência simples, transparente e orientada à tomada de decisão.

Este repositório contém o **frontend da aplicação**, responsável pela interface de interação com os usuários, apresentação dos resultados das simulações, visualização das análises de crédito e integração com a API do Simucred.

A aplicação foi desenvolvida utilizando **Angular 20+**, seguindo práticas modernas de Engenharia de Software, arquitetura baseada em componentes, integração com APIs REST e preparação para execução em ambientes containerizados.

---

## 🧠 Inteligência Artificial

O frontend possui suporte à camada de Inteligência Artificial do Simucred, apresentando ao usuário informações geradas a partir das análises realizadas pelo backend.

A IA atua como uma camada de **explicabilidade e apoio à decisão**, não sendo responsável diretamente pela aprovação ou reprovação de uma operação de crédito.

### 🔎 AI Credit Explanation

Apresenta uma explicação em linguagem natural sobre o resultado da análise de crédito.

> ❌ Crédito não aprovado porque o comprometimento de renda ultrapassou o limite permitido.

### 💡 AI Alternative Loan

Quando uma proposta não é aprovada, apresenta alternativas de crédito potencialmente mais adequadas às condições financeiras informadas.

> 💡 Uma alternativa seria aumentar o prazo do financiamento para reduzir o valor das parcelas.

### 📊 AI Credit Insights

Apresenta insights baseados no histórico de simulações, permitindo visualizar informações relevantes sobre comportamento de crédito, risco e conversão.

---

## 🚀 Principais funcionalidades

- 🧮 Simulação de crédito
- 📋 Consulta dos dados da proposta
- ✅ Visualização de aprovação ou reprovação
- 🔎 Explicação da decisão de crédito
- 💡 Sugestão de alternativas para propostas reprovadas
- 📊 Visualização de insights e indicadores
- 🔗 Integração com API REST
- 📱 Interface responsiva
- ⚡ Arquitetura baseada em componentes Angular

---

## 🛠️ Stack Tecnológica

### Frontend

- Angular 20 (SSR com servidor Node/Express)
- TypeScript
- HTML5 e CSS3
- RxJS e Signals
- Keycloak (login via `keycloak-angular`)
- Testes com Jasmine + Karma

### Backend (repositório [simucred-api](https://github.com/Simucred/simucred-api))

- Java 21
- Spring Boot 4.1
- PostgreSQL 16
- Flyway

### Infraestrutura

- Docker (imagem multi-stage, usuário não-root)
- Docker Compose (stack completa fica no `simucred-api`)
- GitHub Actions (CI/CD)
- Docker Hub (imagem publicada em [`alezzin/simucred-web`](https://hub.docker.com/r/alezzin/simucred-web))

### Qualidade

- SonarCloud (análise estática e cobertura de testes)

---

## 🏗️ Arquitetura

O frontend atua como camada de apresentação da plataforma e se comunica com o backend através de APIs REST.

```text
                 👤 Usuário (navegador)
                    │                     │
          telas     │                     │  login (OAuth2 / OIDC)
                    ▼                     ▼
        ┌──────────────────────┐   ┌──────────────────────┐
        │  🖥️ Simucred Web      │   │  🔐 Keycloak          │
        │  Angular 20 (SSR)    │   │  porta 8081          │
        │  porta 4200          │   └──────────────────────┘
        └──────────┬───────────┘
                   │ REST / JSON + token JWT
                   ▼
        ┌──────────────────────┐
        │  ⚙️ Simucred API      │
        │  Java 21 + Spring    │
        │  porta 8080          │
        └──────────┬───────────┘
                   ▼
        ┌──────────────────────┐
        │  🗄️ PostgreSQL 16     │
        └──────────────────────┘
```

---

## 🖥️ Telas

| Rota | Tela |
| --- | --- |
| `/inicio` | Início com resumo e simulações recentes |
| `/nova-simulacao` | Formulário de simulação de crédito |
| `/simulacoes` | Minhas Simulações (listagem e modal de detalhes) |

---

## ⚙️ Como executar o frontend (sem Docker)

Pré-requisito: Node.js 20.19 ou superior.

```bash
cd simucred
npm install
```

**Modo mock (sem API e sem Keycloak)**, útil para desenvolver as telas:

```bash
npm run start:mock
```

**Modo normal (com API e Keycloak rodando)**:

```bash
npm start
```

A aplicação fica disponível em http://localhost:4200. As URLs da API e do Keycloak ficam em `public/env-config.js`.

**Testes:**

```bash
npm test -- --no-watch
```

---

## 🐳 Rodando com Docker (stack completa)

O jeito mais simples de subir **front, API, banco e Keycloak juntos** é pelo `docker-compose.yml` do repositório [simucred-api](https://github.com/Simucred/simucred-api). Não é preciso clonar este repositório: o compose constrói o front direto do GitHub (branch `main`).

```bash
git clone https://github.com/Simucred/simucred-api.git
cd simucred-api
docker compose up -d --build
```

Ou, usando as imagens já publicadas no Docker Hub (sem compilar nada):

```bash
docker compose -f docker-compose.prod.yml up -d
```

Detalhes no README do [simucred-api](https://github.com/Simucred/simucred-api).

### A imagem do front

A imagem (`simucred/Dockerfile`) faz o build do Angular num estágio e, no estágio final, roda só o servidor SSR em Node, com o usuário `node` (sem root). Na subida do container, o `docker-entrypoint.sh` gera o `env-config.js` a partir das variáveis de ambiente:

| Variável | Para que serve | Padrão |
| --- | --- | --- |
| `URL_API` | URL da API acessada pelo navegador | `http://localhost:8080/v1` |
| `KEYCLOAK_URL` | URL do Keycloak acessada pelo navegador | `http://localhost:8081` |
| `KEYCLOAK_REALM` | Realm do Keycloak | `simucred` |
| `KEYCLOAK_CLIENT_ID` | Client do front no Keycloak | `simucred-web` |
| `NG_ALLOWED_HOSTS` | Hosts aceitos pelo SSR do Angular (proteção contra SSRF) | `localhost,127.0.0.1` |

Assim a mesma imagem funciona em qualquer máquina, trocando só as variáveis.

Para testar só a imagem do front:

```bash
cd simucred
docker build -t simucred-web:local .
docker run --rm -p 4200:4000 simucred-web:local
```

Ou a imagem publicada:

```bash
docker pull alezzin/simucred-web:latest
docker run --rm -p 4200:4000 alezzin/simucred-web:latest
```

---

## 🔁 Pipeline CI/CD (GitHub Actions)

Definido em `.github/workflows/simucred-front-pipeline.yml`. As execuções ficam na aba **Actions** do repositório.

**CI** — em todo Pull Request e push para `dev` e `main`:

1. Instala as dependências (`npm ci`)
2. Roda os testes com cobertura — **se algum falhar, o pipeline para**
3. Análise no SonarCloud
4. Build da imagem Docker (sem publicar)
5. Smoke test: sobe o container e confere se o front responde e se o `env-config.js` foi gerado com a URL informada
6. Salva a imagem validada como artefato

**CD** — só em push na `main`, depois do CI passar:

1. Carrega a **mesma imagem** validada no CI (não reconstrói)
2. Autentica no Docker Hub com os secrets `DOCKERHUB_USERNAME` e `DOCKERHUB_TOKEN`
3. Publica `alezzin/simucred-web:<sha-do-commit>` e `alezzin/simucred-web:latest`

---

## 🛟 Troubleshooting

| Sintoma | Causa | Como resolver |
| --- | --- | --- |
| `npm start` abre uma página de erro ou fica tentando redirecionar | O modo normal exige o Keycloak rodando em `localhost:8081` | Suba a stack pelo `simucred-api` ou use `npm run start:mock` |
| A tela mostra "Não foi possível conectar com a API" depois de trocar a porta da API | O navegador guardou uma versão antiga do `env-config.js` | Recarregue com **Ctrl + F5** |
| O Angular CLI reclama da versão do Node | O projeto exige Node 20.19+ ou 22.12+ | Atualize o Node |
