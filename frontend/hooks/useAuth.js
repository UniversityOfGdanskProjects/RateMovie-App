"use client";
import { useState, useEffect, useRef } from "react";

const useAuth = () => {
  const isRun = useRef(false);
  const [token, setToken] = useState(null);
  const [isLogin, setLogin] = useState(false);

  useEffect(() => {
    // Sprawdzenie, czy jesteśmy w środowisku przeglądarki
    if (typeof window !== "undefined" && !isRun.current) {
      console.log("jesteśmy w oknie przeglądarki :)");
      isRun.current = true;

      // Dynamiczny import Keycloak, aby upewnić się, że jest używany tylko po stronie klienta
      import("keycloak-js").then((KeycloakModule) => {
        const Keycloak = KeycloakModule.default;

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
            setLogin(authenticated);
            setToken(client.token);
          });
      });
    } else {
      console.log("sraka");
    }
  }, []);

  return [isLogin, token];
};

export default useAuth;
