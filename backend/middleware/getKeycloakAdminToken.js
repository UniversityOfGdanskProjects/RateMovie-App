import axios from "axios";

const getKeycloakAdminToken = async () => {
  const url = `${process.env.KEYCLOAK_URL}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/token`;

  const params = new URLSearchParams();

  params.append("client_id", process.env.KEYCLOAK_MANAGE_CLIENT);
  params.append("grant_type", "client_credentials");
  params.append("client_secret", process.env.KEYCLOAK_MANAGE_CLIENT_SECRET);

  const response = await axios.post(url, params, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  return response.data.access_token;
};

export default getKeycloakAdminToken;
