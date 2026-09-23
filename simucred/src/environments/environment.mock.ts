// Usado por "npm run start:mock": roda o front sem API e sem Keycloak.
export const environment = {
  production: false,
  apiUrl: '',
  mockApi: true,
  authEnabled: false,
  keycloak: {
    url: '',
    realm: '',
    clientId: ''
  }
};
