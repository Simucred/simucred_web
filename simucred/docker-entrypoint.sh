#!/bin/sh
# Gera o env-config.js com as URLs do ambiente antes de subir o servidor.
# Assim a mesma imagem funciona em qualquer máquina, trocando só as variáveis.
cat > /app/dist/simucred_web/browser/env-config.js <<EOF
(function (window) {
  window.env = window.env || {};
  window.env.URL_API = '${URL_API:-http://localhost:8080/v1}';
  window.env.KEYCLOAK_URL = '${KEYCLOAK_URL:-http://localhost:8081}';
  window.env.KEYCLOAK_REALM = '${KEYCLOAK_REALM:-simucred}';
  window.env.KEYCLOAK_CLIENT_ID = '${KEYCLOAK_CLIENT_ID:-simucred-web}';
})(this);
EOF

exec node /app/dist/simucred_web/server/server.mjs
