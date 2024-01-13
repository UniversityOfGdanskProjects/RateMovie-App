'use client'

import { Formik, useFormik } from 'formik';
import * as Yup from 'yup';
import ReactStars from "react-stars";
import { FaHeart } from "react-icons/fa6";
import { TbEyePlus, TbBellPlus, TbCirclePlus } from "react-icons/tb";
import { useContext, useEffect, useState } from "react";
import Link from 'next/link'

import { UserContext } from "@/context/userContextProvider";

export default function RateCard({ movieId }) {
    const { user, setUser } = useContext(UserContext);
    const [showReviewSection, setShowReviewSection] = useState(false);
    const [existingReview, setExistingReview] = useState(null);

    const formik = useFormik({
        initialValues: {
            review: '',
            rating: 0,
        },
        validationSchema: Yup.object({
            review: Yup.string()
                .max(200, 'Review cannot exceed 200 characters'),
            rating: Yup.number()
                .min(0.5, 'Rating must be at least 0.5')
                .max(5, 'Rating cannot exceed 5')
        }),
    });

    useEffect(() => {
      const fetchReview = async () => {
        try {
          if (user && movieId) {
            const response = await fetch(`http://localhost:7000/api/review?userId=${user.id}&movieId=${movieId}`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            });
    
            if (response.ok) {
              const reviewData = await response.json();
              setExistingReview(reviewData);
              console.log('Review data:', reviewData);
              formik.setValues({
                review: reviewData ? reviewData.review : '',
                rating: reviewData ? reviewData.rating : 0,
            });
            } else {
              console.log('Failed to fetch review:', response.status, response.statusText);
            }
          }
        } catch (error) {
          console.error('Error fetching review:', error);
        }
      };
    
      fetchReview();
    }, [user, movieId]);

  
    const ratingChanged = (newRating) => {
        formik.setFieldValue('rating', newRating);
    };
  
    return (
      <div className="bg-slate-600 rounded-lg flex flex-col h-min items-center p-2 gap-4">
        <div
          className="review-btn"
          onClick={() => setShowReviewSection((prev) => !prev)}
        >
          Add Review <TbCirclePlus className="text-2xl" />
        </div>
        <div className="flex flex-row text-3xl gap-4">
          <FaHeart />
          <TbEyePlus />
          <TbBellPlus />
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
                <button className="big-btn">SAVE</button>
              </>
            ) : (
              <p>
                  <Link href='/login'><button className="big-btn">Sign In</button></Link> to add a review!
              </p>
            )}
          </>
        )}
      </div>
    );
  }