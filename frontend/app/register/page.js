import React from "react";
import RegisterForm from "@/components/RegisterForm";

export default function RegisterPage() {
  return (
    <section className="p-3">
      <h1 className="msg">Register</h1>
      <RegisterForm isForAdmin={false} />
    </section>
  );
}
