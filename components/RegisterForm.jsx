'use client'
import React, { useContext, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Link from 'next/link'

export default function RegisterForm() {
  const [registerMessage, setRegisterMessage] = useState(null);
  const [registerError, setRegisterError] = useState(null);

  const registerUser = async (values, formik) => {
    try {
      const response = await fetch("http://localhost:7000/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (response.status === 400) {
        const data = await response.json();
        setRegisterError(data.error);
        return;
      }

      formik.resetForm();
      setRegisterMessage("Register successful. You can sign in now!");
      setRegisterError(null)

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
    },
    validationSchema: Yup.object({
      username: Yup.string().required("Name is required").matches(
        /^[a-zA-Z0-9_-]{1,20}$/,
        'Username has to be 1-20 characters long and can only contain letters, numbers and "_", "-"'
      ),
      password: Yup.string().required("Password is required").matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        'Password must be at least 8 characters long and has to contain one lowercase letter, one uppercase letter, one number, and one special character'
      ),
      confirmPassword: Yup.string()
        .required("Confirm Password is required")
        .oneOf([Yup.ref("password"), null], "Passwords must match"),
      email: Yup.string().required("Email is required").matches(
        /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
        'Wrong email format'
      ),
      acceptTerms: Yup.bool().oneOf([true], "You must accept the terms and conditions"),
    }),
    onSubmit: (values, { resetForm }) => {
      registerUser(values, { resetForm });
    },
  });

  return (
    <div>
      <h2>Register form</h2>
      {registerError && <div>{registerError}</div>}
      <form onSubmit={formik.handleSubmit}>
        <label htmlFor="username">Username: </label>
        <input id="username" type="text" {...formik.getFieldProps('username')} />
        {formik.touched.username && formik.errors.username ? (
          <div>{formik.errors.username}</div>
        ) : null}
        <br />
        <label htmlFor="password">Password: </label>
        <input
          id="password"
          type="password"
          {...formik.getFieldProps('password')}
        />
        {formik.touched.password && formik.errors.password ? (
          <div>{formik.errors.password}</div>
        ) : null}
        <br />
        <label htmlFor="confirmPassword">Confirm Password: </label>
        <input
          id="confirmPassword"
          type="password"
          {...formik.getFieldProps('confirmPassword')}
        />
        {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
          <div>{formik.errors.confirmPassword}</div>
        ) : null}
        <br />
        <label htmlFor="email">Email: </label>
        <input
          id="email"
          type="email"
          {...formik.getFieldProps('email')}
        />
        {formik.touched.email && formik.errors.email ? (
          <div>{formik.errors.email}</div>
        ) : null}
        <br />
        <label>
          <input
            id="acceptTerms"
            type="checkbox"
            {...formik.getFieldProps('acceptTerms')}
          />
          Accept Terms and Conditions
        </label>
        {formik.touched.acceptTerms && formik.errors.acceptTerms ? (
          <div>{formik.errors.acceptTerms}</div>
        ) : null}
        <br />
        <button className='small-btn' type="submit">Submit</button>
      </form>
      {registerMessage && (<>
        <div>{registerMessage}</div>
        <Link href='/login'>
          <button className='small-btn'>Sign In</button>
        </Link>
      </>
      )}
    </div>
  );
}