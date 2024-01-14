'use client'

import { Formik, useFormik } from 'formik';
import * as Yup from 'yup';
import ReactStars from "react-stars";
import { FaHeart } from "react-icons/fa6";
import { TbEyePlus, TbBellPlus, TbCirclePlus } from "react-icons/tb";
import { AiOutlineStop } from "react-icons/ai";
import { useContext, useEffect, useState } from "react";
import Link from 'next/link'
import { UserContext } from "@/context/userContextProvider";

export default function RateCard({ movieId }) {
    const { user, setUser } = useContext(UserContext);
    const [showReviewSection, setShowReviewSection] = useState(false);
    const [existingReview, setExistingReview] = useState(null);
    const [inWatchlist, setInWatchlist] = useState(false)
    const [inFollowed, setInFollowed] = useState(false)
    const [inIgnored, setInIgnored] = useState(false)
    const [inFavourites, setInFavourties] = useState(false)
    const [msg, setMsg] = useState('')

    const handleIconClick = async (action, type, set) => {
      if (user) {
        try {
            const relationExists = await fetch(`http://localhost:7000/api/${type}/${user.id}/${movieId}`)
            if (relationExists.status === 404) {
              set(true)
              const addResponse = await fetch(`http://localhost:7000/api/movies/${movieId}/addTo${action}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId: user.id })
              });
              if (addResponse.status === 404 || addResponse.status === 400) {
                  // console.error(`Error adding to ${type}`);
                  set(false)
                  return;
              }
              console.log(`Successfully added to ${type}`);
              const data = await addResponse.json();
              set(true)
              return;
          } else {
            set(false)
            const removeResponse = await fetch(`http://localhost:7000/api/removeFrom${action}/${user.id}/${movieId}`, {
              method: "DELETE"
            })
            if (removeResponse.status === 404 || removeResponse.status === 400) {
              // console.error(`Error adding to ${type}`);
              set(true)
              return;
            }
            console.log(`Successfully removed ${type}`);
            const data = await removeResponse.json();
            set(false)
            return;
          }
        } catch (error) {
            console.error(`Error adding to ${type}:`, error);
        }
      } else {
        setShowReviewSection(prev => !prev)
      }
  }

    const addReview = async (values) => {
        try {
            setMsg('...adding review')

            const response = await fetch(`http://localhost:7000/api/movies/${movieId}/rate`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId: user.id, rating: values.rating, review: values.review})
            })
            if (response.status === 404 || response.status === 400) {
                setMsg('problems')
                // console.error('błąąąąąąąąąąąąąąąąąąąąąąd')
                return;
            }

            console.log('successful adding review')
            setMsg('added review')
            
        } catch (error) {
            // console.error('Error fetching movie:', error);
        }
    }

    const formik = useFormik({
        initialValues: {
            review: '',
            rating: 0,
        },
        validationSchema: Yup.object({
            review: Yup.string()
                .max(200, 'Review cannot exceed 200 chars'),
            rating: Yup.number()
                .min(0.5, 'Rating must be at least 0.5')
                .max(5, 'Rating cannot exceed 5')
        }),
        onSubmit: (values) => {
            addReview(values)
        }
    });



    useEffect(() => {
      const fetchReview = async () => {
        try {
          if (user && movieId) {
            const isInReviewed = await fetch(`http://localhost:7000/api/review/${user.id}/${movieId}`);
            const isInFav = await fetch(`http://localhost:7000/api/favourite/${user.id}/${movieId}`)
            const isInIgnored = await fetch(`http://localhost:7000/api/ignored/${user.id}/${movieId}`)
            const isInFollowed = await fetch(`http://localhost:7000/api/followed/${user.id}/${movieId}`)
            const isInWatchtlist = await fetch(`http://localhost:7000/api/watchlist/${user.id}/${movieId}`)
            if (isInFav.ok) setInFavourties(true)
            if (isInIgnored.ok) setInIgnored(true)
            if (isInFollowed.ok) setInFollowed(true)
            if (isInWatchtlist.ok) setInWatchlist(true)
            if (isInReviewed.ok) {
              const reviewData = await isInReviewed.json();
              setExistingReview(reviewData);
              console.log('Review data:', reviewData);
              formik.setValues({
                review: reviewData ? reviewData.review : '',
                rating: reviewData ? reviewData.rating : 0,
            });
              } 
              // else {
              //   console.log('Failed to fetch review:', isInReviewed.status, isInReviewed.statusText);
              // }
          }
        } catch (error) {
          // console.error('Error fetching review:', error);
        }
      };
    
      fetchReview();
    }, [user, movieId]);

  
    const ratingChanged = (newRating) => {
        formik.setFieldValue('rating', newRating);
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
          <FaHeart className={`${inFavourites ? 'text-pink-600 hover:text-pink-700' : 'text-slate-300 hover:text-slate-100'} hover:cursor-pointer`} onClick={() => handleIconClick('Favourites', 'favourite', setInFavourties)} />
          <TbEyePlus className={`${inWatchlist ? 'text-blue-400 hover:text-blue-500' : 'text-slate-300 hover:text-slate-100'} hover:cursor-pointer`} onClick={() => handleIconClick('Watchlist', 'watchlist', setInWatchlist)} />
          <TbBellPlus className={`${inFollowed ? 'text-yellow-300 hover:text-yellow-500' : 'text-slate-300 hover:text-slate-100'} hover:cursor-pointer`}onClick={() => handleIconClick('Followed', 'followed', setInFollowed)} />
          <AiOutlineStop className={`${inIgnored ? 'text-red-600 hover:text-red-700' : 'text-slate-300 hover:text-slate-100'} hover:cursor-pointer`} onClick={() => handleIconClick('Ignored', 'ignored', setInIgnored)} />
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
                  {...formik.getFieldProps('review')}
                ></textarea>
                <p className='char-counter'>{formik.values.review.length}/200</p>
                {formik.touched.review && <p className='char-counter'>{formik.errors.review}</p>}
                {msg && <p className='char-counter'>{msg}</p>}
                <button type="submit" className="big-btn" onClick={formik.handleSubmit}>SAVE</button>
                
              </>
            ) : (
              <>
              <Link href='/login'><button className="big-btn">Sign In</button></Link>
              <p className=''> to add a review!</p>
              </>
            )}
          </>
        )}
      </div>
    );
  }