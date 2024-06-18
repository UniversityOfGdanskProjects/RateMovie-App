"use client";
import React, { useContext, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Link from "next/link";

export default function RegisterForm({ isForAdmin }) {
  const [registerMessage, setRegisterMessage] = useState(null);
  const [registerError, setRegisterError] = useState(null);

  const registerUser = async (values, formik) => {
    console.log(values);
    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}users/register`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (response.status !== 201) {
        const data = await response.json();
        setRegisterError(data.error);
        return;
      }

      formik.resetForm();
      setRegisterMessage("Register successful. You can sign in now!");
      setRegisterError(null);
    } catch (error) {
      console.error("Error during registration:", error);
      setRegisterError("Internal Server Error");
    }
  };

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
      confirmPassword: "",
      email: "",
      acceptTerms: false,
      adminSecret: isForAdmin ? "" : undefined,
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .required("Name is required")
        .matches(
          /^[a-zA-Z0-9_-]{1,20}$/,
          'Username has to be 1-20 characters long and can only contain letters, numbers and "_", "-"'
        ),
      password: Yup.string()
        .required("Password is required")
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
          "Password must be at least 8 characters long and has to contain one lowercase letter, one uppercase letter, one number, and one special character"
        ),
      confirmPassword: Yup.string()
        .required("Confirm Password is required")
        .oneOf([Yup.ref("password"), null], "Passwords must match"),
      email: Yup.string()
        .required("Email is required")
        .matches(
          /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
          "Wrong email format"
        ),
      acceptTerms: Yup.bool().oneOf(
        [true],
        "You must accept the terms and conditions"
      ),
      adminSecret: isForAdmin
        ? Yup.string().required("Admin Secret is required")
        : undefined,
    }),
    onSubmit: (values, { resetForm }) => {
      registerUser(values, { resetForm });
    },
  });

  return (
    <>
      <form className="form" onSubmit={formik.handleSubmit}>
        {registerError && <div>{registerError}</div>}
        <label htmlFor="username">
          Username:
          <input
            id="username"
            type="text"
            {...formik.getFieldProps("username")}
          />
          {formik.touched.username && formik.errors.username ? (
            <div>{formik.errors.username}</div>
          ) : null}
        </label>
        <label htmlFor="password">
          Password:
          <input
            id="password"
            type="password"
            {...formik.getFieldProps("password")}
          />
          {formik.touched.password && formik.errors.password ? (
            <div>{formik.errors.password}</div>
          ) : null}
        </label>
        <label htmlFor="confirmPassword">
          Confirm Password:
          <input
            id="confirmPassword"
            type="password"
            {...formik.getFieldProps("confirmPassword")}
          />
          {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
            <div>{formik.errors.confirmPassword}</div>
          ) : null}
        </label>
        <label htmlFor="email">
          Email:
          <input id="email" type="email" {...formik.getFieldProps("email")} />
          {formik.touched.email && formik.errors.email ? (
            <div>{formik.errors.email}</div>
          ) : null}
        </label>
        {isForAdmin && (
          <label htmlFor="adminSecret">
            Admin Secret:
            <input
              id="adminSecret"
              type="password"
              {...formik.getFieldProps("adminSecret")}
            />
            {formik.touched.adminSecret && formik.errors.adminSecret ? (
              <div>{formik.errors.adminSecret}</div>
            ) : null}
          </label>
        )}
        <label className="checkbox">
          <input
            id="acceptTerms"
            type="checkbox"
            {...formik.getFieldProps("acceptTerms")}
          />
          Accept Terms and Conditions
        </label>
        {formik.touched.acceptTerms && formik.errors.acceptTerms ? (
          <div>{formik.errors.acceptTerms}</div>
        ) : null}
        <div className="buttons">
          <button className="big-btn" type="submit">
            Submit
          </button>
        </div>
      </form>
      {registerMessage && (
        <>
          <div className="msg">{registerMessage}</div>
          {!isForAdmin && (
            <Link href="/login">
              <button className="big-btn">Sign In</button>
            </Link>
          )}
        </>
      )}
    </>
  );
}
