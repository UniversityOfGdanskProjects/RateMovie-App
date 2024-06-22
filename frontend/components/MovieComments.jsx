"use client";
import React, { useState, useEffect, useContext, useRef } from "react";
import Link from "next/link";
import { UserContext } from "@/context/userContextProvider";
import { useFormik } from "formik";
import * as Yup from "yup";
import { MdDeleteOutline, MdEdit } from "react-icons/md";

const MovieComments = ({ movieId }) => {
  const [comments, setComments] = useState([]);
  const { user } = useContext(UserContext);
  const [msg, setMsg] = useState("");

  const editFormik = useFormik({
    initialValues: {
      comment: "",
      commentId: null,
      username: "",
    },
    validationSchema: Yup.object({
      comment: Yup.string()
        .trim()
        .required("Comment is required")
        .matches(/\S/, "Comment cannot consist of only whitespaces")
        .max(200, "Comment can be max 200 chars long"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        console.log(values.commentId);
        console.log(values.comment);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}movies/comment`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
            body: JSON.stringify({
              commentId: values.commentId,
              comment: values.comment,
              username: values.username,
            }),
          }
        );

        const data = await response.json();
        if (response.ok) {
          setComments((prev) =>
            prev.map((comment) =>
              comment.commentId === values.commentId
                ? { ...comment, comment: values.comment }
                : comment
            )
          );
          resetForm();
          editingCommentIdRef.current = null;
        } else {
          setMsg(data.error);
        }
      } catch (error) {
        setMsg(error);
      }
    },
  });

  const editingCommentIdRef = useRef(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}${movieId}/comments`
        );
        const data = await response.json();
        if (response.ok) {
          setComments(data);
        } else {
          setMsg(data.error);
        }
      } catch (error) {
        setMsg(error);
      }
    };

    if (comments.length === 0) fetchComments();
  }, []);

  const formik = useFormik({
    initialValues: {
      comment: "",
    },
    validationSchema: Yup.object({
      comment: Yup.string()
        .trim()
        .required("Comment is required")
        .matches(/\S/, "Comment cannot consist of only whitespaces")
        .max(200, "Comment can be max 200 chars long"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}movies/${movieId}/comment`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
            body: JSON.stringify({
              comment: values.comment,
              userId: user.id,
              username: user.username,
            }),
          }
        );
        const data = await response.json();
        if (response.ok) {
          resetForm();
          setComments([...comments, { ...data }]);
        } else {
          setMsg(data.error);
        }
      } catch (error) {
        setMsg(error);
      }
    },
  });

  const handleDeleteComment = async (commentId) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}movies/comment`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({ commentId }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        setComments((prev) =>
          prev.filter((comment) => comment.commentId !== commentId)
        );
      } else {
        setMsg(data.error);
      }
    } catch (error) {
      setMsg(error);
    }
  };

  const handleEditComment = (commentId, comment, username) => {
    editingCommentIdRef.current = commentId;
    editFormik.setValues({ commentId, comment, username });
  };

  const cancelEdit = () => {
    editingCommentIdRef.current = null;
    editFormik.resetForm();
  };

  return (
    <div className="mt-2">
      <h1>Comments</h1>
      {!user && (
        <h2 className="border-2 rounded-lg border-slate-600 bg-pink-800 p-2 my-2 flex flex-row items-center gap-2">
          <Link href="/login">
            <button className="small-btn">Sign In</button>
          </Link>
          <p>to leave a comment!</p>
        </h2>
      )}
      <ul className="comments">
        {comments &&
          comments.map((comment, index) => (
            <li
              key={`${comment.commentId}`}
              className={
                editingCommentIdRef.current === comment.commentId
                  ? "comment bg-gradient-to-r from-pink-900"
                  : "comment"
              }
            >
              <div className="comment-info">
                <p className="username">{comment.username}</p>
                <p>{comment.comment}</p>
                <p className="date">{comment.date}</p>
              </div>
              {user &&
                (user.id === comment.userId ||
                  user.roles.includes("admin")) && (
                  <div className="comment-buttons">
                    <button
                      className=""
                      onClick={() =>
                        handleEditComment(
                          comment.commentId,
                          comment.comment,
                          comment.username
                        )
                      }
                    >
                      <MdEdit className="text-2xl" />
                    </button>
                    <button
                      className=""
                      onClick={() => handleDeleteComment(comment.commentId)}
                    >
                      <MdDeleteOutline className="text-2xl" />
                    </button>
                  </div>
                )}
            </li>
          ))}
      </ul>

      {user && (
        <>
          {editingCommentIdRef.current !== null ? (
            <form className="form w-full" onSubmit={editFormik.handleSubmit}>
              <textarea
                name="comment"
                value={editFormik.values.comment}
                onChange={editFormik.handleChange}
                onBlur={editFormik.handleBlur}
                placeholder="Edit your comment"
              ></textarea>
              {editFormik.touched.comment && editFormik.errors.comment && (
                <div className="error-message">{editFormik.errors.comment}</div>
              )}
              <div className="buttons">
                <button className="big-btn" type="submit">
                  Save Edit
                </button>
                <button className="big-btn" type="button" onClick={cancelEdit}>
                  Cancel Edit
                </button>
              </div>
            </form>
          ) : (
            <form className="form w-full" onSubmit={formik.handleSubmit}>
              <textarea
                name="comment"
                value={formik.values.comment}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Add a new comment"
              ></textarea>
              <div className="buttons">
                <button className="big-btn" type="submit">
                  Add Comment
                </button>
              </div>
            </form>
          )}
        </>
      )}
    </div>
  );
};

export default MovieComments;
