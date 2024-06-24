import Keycloak from "keycloak-connect";
import { config } from "dotenv";

config();

const keycloakConfig = {
  realm: process.env.KEYCLOAK_REALM,
  "auth-server-url": `${process.env.KEYCLOAK_URL}`,
  "ssl-required": "external",
  // resource: process.env.KEYCLOAK_CLIENT,
  resource: process.env.KEYCLOAK_CLIENT,
  "bearer-only": true,
  credentials: {
    secret: process.env.KEYCLOAK_CLIENT_SECRET,
  },
  // "enable-cors": true,
  // "cors-allowed-methods": "POST, PUT, DELETE, GET",
};

export default new Keycloak({}, keycloakConfig);
