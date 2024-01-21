import React from "react";
import Link from "next/link";
import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <section className="p-3">
      <h1 className="msg">Login</h1>
      <LoginForm />
      <p className="text-center p-3">
        Doesn't have an account? Register down below!
      </p>
      <Link href="/register" className="my-2">
        <button className="big-btn m-auto">REGISTER</button>
      </Link>
    </section>
  );
}
