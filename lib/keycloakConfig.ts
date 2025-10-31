export const keycloakConfig = {
  url: process.env.NEXT_PUBLIC_KEYCLOAK_URL || 'http://localhost:8080',
  realm: process.env.NEXT_PUBLIC_KEYCLOAK_REALM || 'atps',
  clientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || 'atps-frontend',
  backendUrl: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000',
};

export const authEndpoints = {
  login: `${keycloakConfig.backendUrl}/api/keycloak/login`,
  refresh: `${keycloakConfig.backendUrl}/api/keycloak/refresh`,
  logout: `${keycloakConfig.backendUrl}/api/keycloak/logout`,
  me: `${keycloakConfig.backendUrl}/api/keycloak/me`,
};
