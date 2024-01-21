"use client";
import React, { useContext, useEffect } from "react";
import Link from "next/link";
import { FaHeart } from "react-icons/fa6";
import { TbEye, TbBell, TbUser, TbStar, TbMessage } from "react-icons/tb";
import { AiOutlineStop } from "react-icons/ai";
import { UserContext } from "@/context/userContextProvider";
import { useRouter } from "next/navigation";

export default function ProfileLayout({ children }) {
  const { user } = useContext(UserContext);
  const router = useRouter();
  useEffect(() => {
    if (!user) {
      router.push("/");
      return;
    }
  });

  return (
    <>
      {user && (
        <>
          <section>
            <nav className="bg-slate-700 flex flex-wrap p-2 gap-2">
              <Link href="/profile">
                <button className="big-btn">
                  Profile <TbUser className="text-xl" />
                </button>
              </Link>
              <Link href="/profile/watchlist">
                <button className="big-btn">
                  Watchlist <TbEye className="text-xl" />
                </button>
              </Link>
              <Link href="/profile/reviewed">
                <button className="big-btn">
                  Reviewed <TbStar className="text-xl" />
                </button>
              </Link>
              <Link href="/profile/followed">
                <button className="big-btn">
                  Followed <TbBell className="text-xl" />
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
            </nav>
          </section>
          {children}
        </>
      )}
    </>
  );
}
