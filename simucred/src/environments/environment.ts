const browserWindow = globalThis as any;
const env = browserWindow.window?.env || {};

export const environment = {
  production: false,
  apiUrl: env.URL_API,
  mockApi: false,
  authEnabled: true,
  keycloak: {
    url: env.KEYCLOAK_URL,
    realm: env.KEYCLOAK_REALM,
    clientId: env.KEYCLOAK_CLIENT_ID
  }
};