import { getAuth, updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function Profile() {
  const auth = getAuth();
  const navigate = useNavigate();
  const [changeDetail, setChangeDetatil] = useState(false);
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });
  const { name, email } = formData;
  function onLogout() {
    auth.signOut();
    navigate("/");
  }
  function onChange(e) {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  }
  async function onSubmit() {
    try {
      if (auth.currentUser.displayName !== name) {
        // update the display name in firebase auth
        await updateProfile(auth.currentUser, {
          displayName: name,
        });

        // update the name in the fireStore
        const docRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(docRef, {
          name,
        });
      }
      toast.success("Profile detail updated successfully");
    } catch (error) {
      toast.error("Something went wrong Could not update the profile detail");
    }
  }
  return (
    <>
      <section className='max-w-6xl mx-auto flex justify-center items-center flex-col'>
        <h1 className='text-3xl text-center mt-6 font-bold'>My Profile</h1>
        <div className='w-full md:w-[50%] mt-6 px-3'>
          <form>
            {/*input for name */}
            <input
              type='text'
              id='name'
              value={name}
              onChange={onChange}
              disabled={!changeDetail}
              className={`w-full mb-6 px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out ${
                changeDetail && "bg-red-200 focus:bg-red-200"
              }`}
            />
            {/* input for email */}
            <input
              type='email'
              id='email'
              value={email}
              // onChange={onChange}
              disabled
              className='w-full mb-6 px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out'
            />
            <div className='mb-6 flex justify-between whitespace-nowrap sm:text-lg'>
              <p className='flex items-center'>
                Do you want to change your name?
                <span
                  onClick={() => {
                    changeDetail && onSubmit();
                    setChangeDetatil((prevState) => !prevState);
                  }}
                  className='text-red-600 hover:text-red-700 cursor-pointer transition ease-in-out duration-200 ml-1'>
                  {changeDetail ? "Apply change" : "Edit"}
                </span>
              </p>
              <p
                onClick={onLogout}
                className='text-blue-600 hover:text-blue-800 cursor-pointer transition ease-in-out duration-200'>
                Sign Out
              </p>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
