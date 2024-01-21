"use client";
import React, { useContext, useLayoutEffect } from "react";
import { UserContext } from "@/context/userContextProvider";
import { FaHeart } from "react-icons/fa6";
import { TbEyePlus, TbBellPlus, TbCirclePlus } from "react-icons/tb";
import { AiOutlineStop } from "react-icons/ai";

export default function ProfilePage() {
  const { user } = useContext(UserContext);

  return (
    <section>
      {user && user.username && (
        <h1 className="msg">Welcome {user.username}!</h1>
      )}
    </section>
  );
}
