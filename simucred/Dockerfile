# ---- Build stage ----
FROM node:20-alpine AS build
WORKDIR /app

# Cache de dependências (camada separada para builds mais rápidos)
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ---- Runtime stage ----
# O build SSR já empacota as dependências do servidor no server.mjs,
# então a imagem final não precisa de node_modules.
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=4000

COPY --from=build --chown=node:node /app/dist/simucred_web ./dist/simucred_web
COPY --chown=node:node docker-entrypoint.sh /app/docker-entrypoint.sh
# Remove \r caso o arquivo tenha sido salvo com quebra de linha do Windows
RUN sed -i 's/\r$//' /app/docker-entrypoint.sh && chmod +x /app/docker-entrypoint.sh

USER node
EXPOSE 4000
ENTRYPOINT ["/app/docker-entrypoint.sh"]
