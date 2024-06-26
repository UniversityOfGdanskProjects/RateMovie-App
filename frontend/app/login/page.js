"use client";
import React, { useEffect, useState, useRef, useContext } from "react";
import axios from "axios";
import useAuth from "@/hooks/useAuth";
import { UserContext } from "@/context/userContextProvider";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { user, setUser, setKeycloak } = useContext(UserContext);
  const { authenticated, token, ogKeycloak } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (token) {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const url = `${process.env.NEXT_PUBLIC_API_URL}users/register`;
      axios
        .post(url, {}, config)
        .then((res) => {
          setUser({
            username: res.data.username,
            id: res.data.userId,
            roles: res.data.roles,
            token: token,
          });
          setKeycloak(ogKeycloak);
          router.push("/");
        })
        .catch((err) => console.error(err));
    }
  }, [token]);

  return (
    <section className="p-3">
      <h1 className="msg">Login</h1>
      {authenticated ? (
        <div className="text-center p-3">
          <p>
            Login successful {user && <span>{user.username}</span>}! Redirecting
            to Home Page...
          </p>
        </div>
      ) : (
        <p className="text-center p-3">Redirecting to Sign In page...</p>
      )}
    </section>
  );
}
