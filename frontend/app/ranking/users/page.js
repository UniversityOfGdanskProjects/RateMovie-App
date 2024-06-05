"use client";
import React, { useContext, useState } from "react";
import { RankingContext } from "@/context/rankingsProvider";
import LoadingPage from "@/components/LoadingPage";
import { UserContext } from "@/context/userContextProvider";

export default function UsersRankingPage() {
  const { rankedUsers } = useContext(RankingContext);
  const { user } = useContext(UserContext);
  const [visibleUsers, setVisibleUsers] = useState(20);

  const handleLoadMore = () => {
    setVisibleUsers((prev) => prev + 20);
  };

  return (
    <section className="pb-2">
      {rankedUsers.length > 0 ? (
        <>
          <h1 className="msg text-3xl">Most Active Users</h1>
          <ul className="user-ranking">
            <li>
              <div>Username</div>
              <div>Rated movies count</div>
            </li>
            {rankedUsers.slice(0, visibleUsers).map((userRanked, index) => (
              <li key={index}>
                <div>
                  {index + 1}. {userRanked.username}{" "}
                  {user && user.isAdmin && `(id: ${userRanked.userId})`}
                </div>
                <div>{userRanked.activity}</div>
              </li>
            ))}
          </ul>
          {visibleUsers < rankedUsers.length && (
            <button className="big-btn m-auto my-3" onClick={handleLoadMore}>
              Load More
            </button>
          )}
        </>
      ) : (
        <LoadingPage />
      )}
    </section>
  );
}
