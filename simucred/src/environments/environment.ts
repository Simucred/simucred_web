export const environment = {
  production: false,
  apiUrl: (window as any).env?.URL_API,
  keycloak: {
    url: (window as any).env?.KEYCLOAK_URL,
    realm: (window as any).env?.KEYCLOAK_REALM,
    clientId: (window as any).env?.KEYCLOAK_CLIENT_ID
  }
};