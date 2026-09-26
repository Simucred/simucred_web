const browserWindow = globalThis as any;

export const environment = {
  production: false,
  apiUrl: browserWindow.window?.env?.URL_API,
  mockApi: false,
  authEnabled: true,
  keycloak: {
    url: browserWindow.window?.env?.KEYCLOAK_URL,
    realm: browserWindow.window?.env?.KEYCLOAK_REALM,
    clientId: browserWindow.window?.env?.KEYCLOAK_CLIENT_ID
  }
};