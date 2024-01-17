'use client';
import React, { useState, useContext } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { UserContext } from '@/context/userContextProvider';
import RegisterForm from '@/components/RegisterForm';

export default function ManageUsersPage() {
  const { user } = useContext(UserContext);
  const [userId, setUserId] = useState('');
  const [userData, setUserData] = useState(null);
  const [msg, setMsg] = useState('')

  const formik = useFormik({
    initialValues: {
      userId: '',
      username: '',
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      username: Yup.string().required("username is required").matches(
        /^[a-zA-Z0-9_-]{1,20}$/,
        'Username has to be 1-20 characters long and can only contain letters, numbers and "_", "-"'
      ),
      email: Yup.string().required("Email is required").matches(
        /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
        'Wrong email format'
      ),
      password: Yup.string().required("Password is required").matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        'Password must be at least 8 characters long and has to contain one lowercase letter, one uppercase letter, one number, and one special character')
    }),
    onSubmit: (values) => {
      handleEditUser(values);
    },
  });

  const handleSearchUser = async () => {
    setMsg('searching...')
    try {
      const response = await fetch(`http://localhost:7000/api/admin/getUser?userId=${userId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${user.token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserData(data.user);
        formik.setValues({
          userId: data.user.userId,
          username: data.user.username,
          email: data.user.email,
          password: '',
        });
        setMsg('user found')
      } else if (response.status === 404) {
        setUserData(null);
        setMsg('User not found');
      } else {
        setMsg('Error fetching user data');
      }
    } catch (error) {
      setMsg('Error fetching user data', error);
    }
  };

  const handleEditUser = async (updatedUserData) => {
    setMsg('updating user...')
    try {
      const response = await fetch('http://localhost:7000/api/admin/editUser', {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${user.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          ...updatedUserData,
        }),
      });

      if (response.ok) {
        setMsg('User updated successfully');
      } else if (response.status === 404) {
        setMsg('User not found');
      } else {
        setMsg('Error updating user');
      }
    } catch (error) {
      setMsg('Error updating user', error);
    }
  };

  const handleDeleteUser = async () => {
    setMsg('deleting...')
    try {
      const response = await fetch(`http://localhost:7000/api/admin/deleteUser?userId=${userId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${user.token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setMsg('User deleted successfully');
        setUserData(null);
        setUserId('');
        formik.resetForm();
      } else if (response.status === 404) {
        setMsg('User not found');
      } else {
        setMsg('Error deleting user');
      }
    } catch (error) {
      setMsg('Error deleting user', error);
    }
  };

  return (
    <section className='flex flex-col gap-3 p-3'>
      <h1 className='msg'>Add New User</h1>
      <RegisterForm isForAdmin={false}/>
      {msg && <p className='msg'>{msg}</p>}
      <div className='form'>
      <h1>Find User</h1>
        <label>
          User ID:
          <input type="text" value={userId} onChange={(e) => setUserId(e.target.value)} />
        </label>
        <div className='buttons'>
        <button className="small-btn" onClick={handleSearchUser}>
          Search
        </button>
        </div>
      </div>
      {userData && (
        <>
          <form className="form" onSubmit={formik.handleSubmit}>
          <h2>User Details</h2>
            <label>
              Username:
              <input
                type="text"
                name="username"
                value={formik.values.username}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.username && formik.errors.username ? (
                <div className="error">{formik.errors.username}</div>
              ) : null}
            </label>
            <label>
              Email:
              <input
                type="text"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.email && formik.errors.email ? (
                <div className="error">{formik.errors.email}</div>
              ) : null}
            </label>
            <label>
              Password:
              <input
                type="text"
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.password && formik.errors.password ? (
                <div className="error">{formik.errors.password}</div>
              ) : null}
            </label>
            <div className='buttons'>
            <button type="submit" className="small-btn">
              Save Changes
            </button>
            <button className="small-btn bg-red-900" onClick={handleDeleteUser}>
              Delete User
            </button>
            </div>
          </form>
        </>
      )}
    </section>
  );
}
