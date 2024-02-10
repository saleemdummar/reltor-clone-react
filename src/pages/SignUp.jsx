import React, { useState } from "react";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import Auth from "../components/Auth";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore"; // Import serverTimestamp
import { db } from "../firebase";
import { toast } from "react-toastify";
export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  function onChange(e) {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  }
  const { name, email, password } = formData;
  const navigate = useNavigate();
  async function onSubmit(e) {
    e.preventDefault();
    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      updateProfile(auth.currentUser, {
        displayName: name,
      });
      const user = userCredential.user;
      // know we will delete the password from the formdata
      const formDataCopy = { ...formData };
      delete formDataCopy.password;
      // know we will add the timestamp to the form data
      formDataCopy.timestamp = serverTimestamp();
      // after adding the timestamp know we will save it to the data base
      await setDoc(doc(db, "users", user.uid), formDataCopy);
      toast.success("Sign up was Successful");
      navigate("/");
    } catch (error) {
      toast.error("something went wrong");
    }
  }
  return (
    <section>
      <h1 className='text-3xl text-center mt-6 font-bold'>Sign Up</h1>
      <div className='flex justify-center flex-wrap items-center px-6 py-12 max-w-6xl mx-auto'>
        <div className='md:w-[67%] lg:w-[50%] mb-12 md:mb-6'>
          <img
            src='https://media.istockphoto.com/id/1455463867/photo/buying-a-new-house.jpg?s=1024x1024&w=is&k=20&c=MdLpGQ1X3ABaOtIqdHd8L5Bq8z6QF2MSUvGrSn_OC3w='
            alt='key'
            className='w-full rounded-2xl'
          />
        </div>
        <div className='w-full md:w-[67%] lg:w-[40%] lg:ml-20'>
          <form onSubmit={onSubmit}>
            <input
              className=' mb-6 w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded  transition ease-in-out'
              type='text'
              id='name'
              value={name}
              onChange={onChange}
              placeholder='Full Name'
            />
            <input
              className=' mb-6 w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded  transition ease-in-out'
              type='email'
              id='email'
              value={email}
              onChange={onChange}
              placeholder='Email address'
            />
            <div className='relative mb-6'>
              <input
                className='w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded  transition ease-in-out'
                type={showPassword ? "text" : "password"}
                id='password'
                value={password}
                onChange={onChange}
                placeholder='Password'
              />
              {showPassword ? (
                <AiFillEyeInvisible
                  className='absolute right-3 top-3 text-xl cursor-pointer'
                  onClick={() => setShowPassword((prev) => !prev)}
                />
              ) : (
                <AiFillEye
                  className='absolute right-3 top-3 text-xl cursor-pointer'
                  onClick={() => setShowPassword((prev) => !prev)}
                />
              )}
            </div>
            <div className='flex justify-between whitespace-nowrap text-sm sm:text-lg'>
              <p className='mb-6'>
                Have a account?
                <Link
                  to='/sign-in'
                  className='text-red-600 hover:text-red-700 transition duration-200 ease-in-out ml-1'>
                  Sign In
                </Link>
              </p>
              <p>
                <Link
                  to='/forgot-password'
                  className='text-blue-600 hover:text-blue-800 transition duration-200 ease-in-out'>
                  Forgot Password?
                </Link>
              </p>
            </div>
            <button
              type='submit'
              className='w-full bg-blue-600
           text-white px-7 py-3 text-sm font-medium uppercase rounded
           shadow-md hover:bg-blue-800 transition duration-150 ease-in-out
           hover:shadow-lg active:bg-blue-900'>
              Sign Up
            </button>
            <div
              className='my-4 items-center flex before:border-t 
          before:flex-1  before:border-gray-300 after:border-t 
          after:flex-1  after:border-gray-300
          '>
              <p className='text-center font-semibold mx-4'>OR</p>
            </div>
            <Auth />
          </form>
        </div>
      </div>
    </section>
  );
}
