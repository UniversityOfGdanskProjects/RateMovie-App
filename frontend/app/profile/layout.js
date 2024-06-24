"use client";
import React, { useContext, useEffect } from "react";
import Link from "next/link";
import { FaHeart } from "react-icons/fa6";
import { TbEye, TbUser, TbStar, TbMessage } from "react-icons/tb";
import { AiOutlineStop } from "react-icons/ai";
import { UserContext } from "@/context/userContextProvider";
import { useRouter } from "next/navigation";

export default function ProfileLayout({ children }) {
  const { user } = useContext(UserContext);
  const router = useRouter();
  useEffect(() => {
    if (!user) {
      console.log("wybombiaj niunia");
      router.push("/");
      return;
    }
  });

  return (
    <>
      {user && (
        <>
          <section className="bg-slate-800 border-2 border-slate-600 rounded-lg flex items-center justify-between p-4 my-2">
            <div className="profile border-2 border-slate-600 rounded-lg p-2 flex flex-row gap-2 items-center">
              {/* <img src="/assets/images/actor.png" width={80} /> */}
              <TbUser className="text-xl" />
              <h2>{user.username}</h2>
            </div>
            <nav className="flex flex-wrap p-2 gap-2">
              <Link href="/profile/reviewed">
                <button className="big-btn">
                  Reviewed <TbStar className="text-xl" />
                </button>
              </Link>
              <Link href="/profile/watchlist">
                <button className="big-btn">
                  Watchlist <TbEye className="text-xl" />
                </button>
              </Link>
              <Link href="/profile/favourites">
                <button className="big-btn">
                  Favourites <FaHeart className="text-xl" />
                </button>
              </Link>
              <Link href="/profile/ignored">
                <button className="big-btn">
                  Ignored <AiOutlineStop className="text-xl" />
                </button>
              </Link>
              <Link href="/profile/commented">
                <button className="big-btn">
                  Commented <TbMessage className="text-xl" />
                </button>
              </Link>
              <Link href="/profile/quotes">
                <button className="big-btn">Quotes</button>
              </Link>
            </nav>
          </section>
          {children}
        </>
      )}
    </>
  );
}
