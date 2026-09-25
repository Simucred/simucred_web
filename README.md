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

- Angular 20+
- TypeScript
- HTML5
- CSS3
- Angular CLI
- RxJS

### Backend

- Java 21
- Spring Boot 3.2
- PostgreSQL
- Flyway

### Infraestrutura

- Docker
- Docker Compose
- GitHub Actions

### Qualidade e Segurança

- SonarCloud
- Trivy

### Observabilidade

- Prometheus
- Grafana

---

## 🏗️ Arquitetura

O frontend atua como camada de apresentação da plataforma e se comunica com o backend através de APIs REST.

```text
┌──────────────────────────┐
│        👤 Usuário        │
└────────────┬─────────────┘
             │
                          ▼
                          ┌──────────────────────────┐
                          │     🖥️ Simucred Web      │
                          │       Angular 20+         │
                          └────────────┬─────────────┘
                                       │
                                                    │ REST / JSON
                                                                 ▼
                                                                 ┌──────────────────────────┐
                                                                 │      ⚙️ Simucred API     │
                                                                 │   Java 21 + Spring Boot  │
                                                                 └────────────┬─────────────┘
                                                                              │
                                                                                     ┌─────┴─────┐
                                                                                            ▼           ▼
                                                                                            ┌────────────┐ ┌────────────┐
                                                                                            │ PostgreSQL │ │ AI Layer   │
                                                                                            └────────────┘ └────────────┘
---

## 🖥️ Telas

| Rota | Tela |
| --- | --- |
| `/inicio` | Início com resumo e simulações recentes |
| `/nova-simulacao` | Formulário de simulação de crédito |
| `/simulacoes` | Minhas Simulações (listagem e modal de detalhes) |

## ⚙️ Como executar o frontend

Pré-requisito: Node.js 20+.

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

## 🐳 Rodando com Docker (stack completa)

O jeito mais simples de subir **front, API, banco e Keycloak juntos** é pelo `docker-compose.yml` do repositório [simucred-api](https://github.com/Simucred/simucred-api). Clone os dois repositórios lado a lado e siga o README da API:

```text
pasta-qualquer/
├── simucred-api/   ← tem o docker-compose.yml
└── simucred_web/   ← este repositório
```

A imagem do front (`simucred/Dockerfile`) faz o build do Angular e roda o servidor SSR em Node, com usuário sem privilégios. Na subida do container, o `docker-entrypoint.sh` gera o `env-config.js` a partir das variáveis de ambiente:

| Variável | Padrão |
| --- | --- |
| `URL_API` | `http://localhost:8080/v1` |
| `KEYCLOAK_URL` | `http://localhost:8081` |
| `KEYCLOAK_REALM` | `simucred` |
| `KEYCLOAK_CLIENT_ID` | `simucred-web` |

Assim a mesma imagem funciona em qualquer máquina, trocando só as variáveis.

Para testar só a imagem do front:

```bash
cd simucred
docker build -t simucred-web:local .
docker run --rm -p 4200:4000 simucred-web:local
```
