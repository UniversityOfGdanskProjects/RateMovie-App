"use client";

import { Formik, useFormik } from "formik";
import * as Yup from "yup";
import ReactStars from "react-stars";
import { FaHeart } from "react-icons/fa6";
import { TbEyePlus, TbBellPlus, TbCirclePlus } from "react-icons/tb";
import { AiOutlineStop } from "react-icons/ai";
import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { UserContext } from "@/context/userContextProvider";

export default function RateCard({ movieId }) {
  const { user, setUser } = useContext(UserContext);
  const [showReviewSection, setShowReviewSection] = useState(false);
  const [existingReview, setExistingReview] = useState(null);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [inFollowed, setInFollowed] = useState(false);
  const [inIgnored, setInIgnored] = useState(false);
  const [inFavourites, setInFavourties] = useState(false);
  const [msg, setMsg] = useState("");
  const [deleteButton, setDeleteButton] = useState(false);

  const addReview = async (values) => {
    try {
      setMsg("...adding review");

      const response = await fetch(
        `http://localhost:7000/api/movies/${movieId}/rate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
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
          `http://localhost:7000/api/${type}/${user.id}/${movieId}`
        );
        if (relationExists.status === 204) {
          set(true);
          const addResponse = await fetch(
            `http://localhost:7000/api/movies/${movieId}/addTo${action}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ userId: user.id }),
            }
          );
          if (addResponse.status === 404 || addResponse.status === 400) {
            // console.error(`Error adding to ${type}`);
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
            `http://localhost:7000/api/removeFrom${action}/${user.id}/${movieId}`,
            {
              method: "DELETE",
            }
          );
          if (removeResponse.status === 404 || removeResponse.status === 400) {
            // console.error(`Error adding to ${type}`);
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
    // console.log("usuwam");
    setMsg("...deleting review");
    try {
      const response = await fetch(
        `http://localhost:7000/api/removeFromReviewed/${user.id}/${movieId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
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
          const [
            isInReviewed,
            isInFav,
            isInIgnored,
            isInFollowed,
            isInWatchlist,
          ] = await Promise.all([
            fetch(`http://localhost:7000/api/review/${user.id}/${movieId}`),
            fetch(`http://localhost:7000/api/favourite/${user.id}/${movieId}`),
            fetch(`http://localhost:7000/api/ignored/${user.id}/${movieId}`),
            fetch(`http://localhost:7000/api/followed/${user.id}/${movieId}`),
            fetch(`http://localhost:7000/api/watchlist/${user.id}/${movieId}`),
          ]);

          if (isInFav.status === 200) setInFavourties(true);
          if (isInIgnored.status === 200) setInIgnored(true);
          if (isInFollowed.status === 200) setInFollowed(true);
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

    fetchReview();
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
        <TbBellPlus
          className={`${
            inFollowed
              ? "text-yellow-300 hover:text-yellow-500"
              : "text-slate-300 hover:text-slate-100"
          } hover:cursor-pointer`}
          onClick={() => handleIconClick("Followed", "followed", setInFollowed)}
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
