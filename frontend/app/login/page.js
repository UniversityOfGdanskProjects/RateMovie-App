"use client";
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import useAuth from "@/hooks/useAuth";

export default function LoginPage() {
  const [isLogin, token] = useAuth();
  const [data, setData] = useState({});
  // const isRun = useRef(false);

  useEffect(() => {
    // if (isRun.current) return;
    // isRun.current = true;
    console.log(token, "tutaj");

    if (token) {
      console.log("mamy token", token);
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const url = `${process.env.NEXT_PUBLIC_API_URL}users/register`;
      console.log(url);
      axios
        .post(url, {}, config)
        .then((res) => {
          setData({ username: res.data.username, userId: res.data.userId });
          console.log(res.data);
        })
        .catch((err) => console.error(err));
    }
  }, [token]);

  return (
    <section className="p-3">
      <h1 className="msg">Login</h1>
      {isLogin ? (
        <div className="text-center p-3">
          <p>
            Login successful <span>{data.username}</span>! Redirecting to Home
            Page...
          </p>
        </div>
      ) : (
        <p className="text-center p-3">Redirecting to Sign In page...</p>
      )}
    </section>
  );
}

// export default function LoginPage() {
//   return (
//     <section className="p-3">
//       <h1 className="msg">Login</h1>
//       <LoginForm />
//       <p className="text-center p-3">
//         Doesn't have an account? Register down below!
//       </p>
//       <Link href="/register" className="my-2">
//         <button className="big-btn m-auto">REGISTER</button>
//       </Link>
//     </section>
//   );
// }
