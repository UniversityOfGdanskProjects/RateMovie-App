'use client'
import React, { useContext, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { UserContext } from "@/context/userContextProvider";

export default function LoginForm() {
  const { user, setUser } = useContext(UserContext);
  const [loginMessage, setLoginMessage] = useState(null);

  const loginUser = async (username, password, formik) => {
    try {
      const response = await fetch("http://localhost:7000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.status === 401) {
        setLoginMessage("Invalid username or password");
        return;
      }

      const data = await response.json();
      setUser(data.user);
      console.log(data.user.id, data.user.username);

      formik.resetForm();
      setLoginMessage("Login successful");

    } catch (error) {
      console.error("Error during login:", error);
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
    <div>
      <h2>Login form</h2>
      {loginMessage && <div>{loginMessage}</div>}
      <form onSubmit={formik.handleSubmit}>
        <label htmlFor="username">Username: </label>
        <input id="username" type="text" {...formik.getFieldProps('username')} />
        {formik.touched.username && formik.errors.username ? (
          <div>{formik.errors.username}</div>
        ) : null}
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
        <button className='small-btn' type="submit">Submit</button>
      </form>
    </div>
  )
}
