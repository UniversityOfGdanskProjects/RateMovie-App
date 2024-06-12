"use client";
import React, { useContext, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { UserContext } from "@/context/userContextProvider";

export default function LoginForm({ isForAdmin }) {
  const { user, setUser } = useContext(UserContext);
  const [loginMessage, setLoginMessage] = useState(null);

  const loginUser = async (username, password, formik) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}${
          isForAdmin ? "admin" : "users"
        }/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        }
      );

      if (response.status === 401) {
        setLoginMessage("Invalid username or password");
        return;
      }

      const data = await response.json();
      // console.log({ ...data.user, token: data.token });
      setUser({ ...data.user, token: data.token });

      formik.resetForm();
      setLoginMessage("Login successful");
    } catch (error) {
      setLoginMessage("Internal Server Error");
    }
  };

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: Yup.object({
      username: Yup.string().required("Name is required"),
      password: Yup.string().required("Password is required"),
    }),
    onSubmit: (values, { resetForm }) => {
      loginUser(values.username, values.password, { resetForm });
    },
  });
  return (
    <>
      <form className="form" onSubmit={formik.handleSubmit}>
        {loginMessage && <div>{loginMessage}</div>}
        <label htmlFor="username1">
          Username:
          <input
            id="username1"
            type="text"
            {...formik.getFieldProps("username")}
          />
          {formik.touched.username && formik.errors.username ? (
            <div>{formik.errors.username}</div>
          ) : null}
        </label>
        <label htmlFor="password1">
          Password:
          <input
            id="password1"
            type="password"
            {...formik.getFieldProps("password")}
          />
          {formik.touched.password && formik.errors.password ? (
            <div>{formik.errors.password}</div>
          ) : null}
        </label>
        <div className="buttons">
          <button className="big-btn" type="submit">
            Submit
          </button>
        </div>
      </form>
    </>
  );
}
