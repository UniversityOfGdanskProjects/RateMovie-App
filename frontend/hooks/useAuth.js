"use client";
import { useState, useEffect, useRef } from "react";

const useAuth = () => {
  const isRun = useRef(false);
  const [keycloak, setKeycloak] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [token, setToken] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined" && !isRun.current) {
      isRun.current = true;

      import("keycloak-js").then((KeycloakModule) => {
        const Keycloak = KeycloakModule.default;
        console.log("secret", process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_SECRET);
        const client = new Keycloak({
          url: process.env.NEXT_PUBLIC_KEYCLOAK_URL,
          realm: process.env.NEXT_PUBLIC_KEYCLOAK_REALM,
          clientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT,
        });
        client
          .init({
            onLoad: "login-required",
          })
          .then((authenticated) => {
            console.log("tu token", token);
            // console.log(client);
            setKeycloak(client);
            setAuthenticated(authenticated);
            setToken(client.token);
          });
      });
    }
  }, []);

  return { authenticated, token, ogKeycloak: keycloak };
};

export default useAuth;
