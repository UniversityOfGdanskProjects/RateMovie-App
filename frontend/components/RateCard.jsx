"use client";
import { useFormik } from "formik";
import * as Yup from "yup";
import ReactStars from "react-stars";
import { FaHeart } from "react-icons/fa6";
import { TbEyePlus, TbCirclePlus } from "react-icons/tb";
import { AiOutlineStop } from "react-icons/ai";
import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { UserContext } from "@/context/userContextProvider";

export default function RateCard({ movieId, movie }) {
  const { user } = useContext(UserContext);
  const [showReviewSection, setShowReviewSection] = useState(false);
  const [existingReview, setExistingReview] = useState(null);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [inIgnored, setInIgnored] = useState(false);
  const [inFavourites, setInFavourties] = useState(false);
  const [msg, setMsg] = useState("");
  const [deleteButton, setDeleteButton] = useState(false);

  const addReview = async (values) => {
    try {
      setMsg("...adding review");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}movies/${movieId}/rate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            userId: user.id,
            rating: values.rating,
            review: values.review,
          }),
        }
      );
      if (response.status === 404 || response.status === 400) {
        setMsg("problems");
        return;
      }
      setDeleteButton(true);
      setMsg("added review");
      setInWatchlist(false);
    } catch (error) {}
  };
  const formik = useFormik({
    initialValues: {
      review: "",
      rating: 0,
    },
    validationSchema: Yup.object({
      review: Yup.string()
        .max(200, "Review cannot exceed 200 chars")
        .matches(/\S/, "Review cannot consist of whitespace only")
        .required("Required"),
      rating: Yup.number()
        .min(0.5, "Rating must be at least 0.5")
        .max(5, "Rating cannot exceed 5"),
    }),
    onSubmit: (values) => {
      addReview(values);
    },
  });

  const handleIconClick = async (action, type, set) => {
    if (user) {
      try {
        const relationExists = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}${type}/${user.id}/${movieId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        if (relationExists.status === 204) {
          set(true);
          const addResponse = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}movies/${movieId}/addTo${action}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user.token}`,
              },
              body: JSON.stringify({ userId: user.id }),
            }
          );
          if (addResponse.status === 404 || addResponse.status === 400) {
            set(false);
            return;
          }
          console.log(`Successfully added to ${type}`);
          const data = await addResponse.json();
          set(true);

          return;
        } else {
          set(false);
          const removeResponse = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}removeFrom${action}/${user.id}/${movieId}`,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user.token}`,
              },
            }
          );
          if (removeResponse.status === 404 || removeResponse.status === 400) {
            set(true);
            return;
          }
          const data = await removeResponse.json();
          set(false);
          return;
        }
      } catch (error) {
        console.error(`Error adding to ${type}:`, error);
      }
    } else {
      setShowReviewSection((prev) => !prev);
    }
  };

  const handleDelete = async () => {
    setMsg("...deleting review");
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}removeFromReviewed/${user.id}/${movieId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (response.ok) {
        setMsg("deleted review succesfuly");
        setDeleteButton(false);
        formik.resetForm();
      } else {
        const data = await response.json();
        setMsg(data.error);
      }
    } catch (error) {}
  };

  useEffect(() => {
    const fetchReview = async () => {
      try {
        if (user && movieId) {
          const [isInReviewed, isInFav, isInIgnored, isInWatchlist] =
            await Promise.all([
              fetch(
                `${process.env.NEXT_PUBLIC_API_URL}review/${user.id}/${movieId}`,
                {
                  method: "GET",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                  },
                }
              ),
              fetch(
                `${process.env.NEXT_PUBLIC_API_URL}favourite/${user.id}/${movieId}`,
                {
                  method: "GET",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                  },
                }
              ),
              fetch(
                `${process.env.NEXT_PUBLIC_API_URL}ignored/${user.id}/${movieId}`,
                {
                  method: "GET",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                  },
                }
              ),
              fetch(
                `${process.env.NEXT_PUBLIC_API_URL}watchlist/${user.id}/${movieId}`,
                {
                  method: "GET",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                  },
                }
              ),
            ]);

          if (isInFav.status === 200) setInFavourties(true);
          if (isInIgnored.status === 200) setInIgnored(true);
          if (isInWatchlist.status === 200) setInWatchlist(true);

          if (isInReviewed.status === 200) {
            const reviewData = await isInReviewed.json();
            setExistingReview(reviewData);
            console.log("Review data:", reviewData);
            reviewData ? setDeleteButton(true) : setDeleteButton(false);
            formik.setValues({
              review: reviewData ? reviewData.review : "",
              rating: reviewData ? reviewData.rating : 0,
            });
          } else {
            console.log("nie mo");
          }
        }
      } catch (error) {
        console.error("Error fetching review:", error);
      }
    };

    if (user) fetchReview();
  }, [user, movieId]);

  const ratingChanged = (newRating) => {
    formik.setFieldValue("rating", newRating);
  };

  return (
    <div className="bg-slate-600 min-w-64 rounded-lg flex flex-col h-min items-center p-2 gap-4">
      <div
        className="review-btn"
        onClick={() => setShowReviewSection((prev) => !prev)}
      >
        Add Review <TbCirclePlus className="text-2xl" />
      </div>
      <div className="flex flex-row text-3xl gap-4">
        <FaHeart
          className={`${
            inFavourites
              ? "text-pink-600 hover:text-pink-700"
              : "text-slate-300 hover:text-slate-100"
          } hover:cursor-pointer`}
          onClick={() =>
            handleIconClick("Favourites", "favourite", setInFavourties)
          }
        />
        <TbEyePlus
          className={`${
            inWatchlist
              ? "text-blue-400 hover:text-blue-500"
              : "text-slate-300 hover:text-slate-100"
          } hover:cursor-pointer`}
          onClick={() =>
            handleIconClick("Watchlist", "watchlist", setInWatchlist)
          }
        />
        <AiOutlineStop
          className={`${
            inIgnored
              ? "text-red-600 hover:text-red-700"
              : "text-slate-300 hover:text-slate-100"
          } hover:cursor-pointer`}
          onClick={() => handleIconClick("Ignored", "ignored", setInIgnored)}
        />
      </div>
      {showReviewSection && (
        <>
          {user ? (
            <>
              <ReactStars
                size={40}
                count={5}
                value={formik.values.rating}
                type="number"
                onChange={ratingChanged}
                color2={"#ffd700"}
              />
              <textarea
                className="w-full"
                rows="6"
                {...formik.getFieldProps("review")}
              ></textarea>
              <p className="char-counter">{formik.values.review.length}/200</p>
              {formik.touched.review && (
                <p className="char-counter">{formik.errors.review}</p>
              )}
              {msg && <p className="char-counter">{msg}</p>}
              <button
                type="submit"
                className="big-btn"
                onClick={formik.handleSubmit}
              >
                SAVE
              </button>
              {deleteButton && (
                <button className="small-btn" onClick={() => handleDelete()}>
                  DELETE REVIEW
                </button>
              )}
            </>
          ) : (
            <>
              <Link href="/login">
                <button className="big-btn">Sign In</button>
              </Link>
              <p className=""> to add a review!</p>
            </>
          )}
        </>
      )}
    </div>
  );
}
