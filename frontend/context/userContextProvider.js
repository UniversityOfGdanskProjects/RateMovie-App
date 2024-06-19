"use client";
import { createContext, useEffect, useState } from "react";

export const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [keycloak, setKeycloak] = useState(null);

  const clearContext = () => {
    setUser(null);
    if (keycloak) {
      keycloak.logout();
    }
  };

  useEffect(() => {
    return () => {
      clearContext();
    };
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, keycloak, setKeycloak }}>
      {children}
    </UserContext.Provider>
  );
};
