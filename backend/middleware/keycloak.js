import Keycloak from "keycloak-connect";
import { config } from "dotenv";

config();

const keycloakConfig = {
  realm: process.env.KEYCLOAK_REALM,
  "auth-server-url": `${process.env.KEYCLOAK_URL}`,
  "ssl-required": "external",
  resource: process.env.KEYCLOAK_CLIENT,
  "bearer-only": true,
};

export default new Keycloak({}, keycloakConfig);
