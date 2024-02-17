import { getAuth, updateProfile } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  doc,
  updateDoc,
  collection,
  query,
  where,
  orderBy,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { FcHome } from "react-icons/fc";
import ListingItem from "../components/ListingItem";

export default function Profile() {
  const auth = getAuth();
  const navigate = useNavigate();
  const [changeDetail, setChangeDetatil] = useState(false);
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
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
  // Here we will use the useEffect hook to fetch the data from the server
  // once the profile page is loaded
  useEffect(() => {
    // as the data is coming from the server we will make the async function inside the useEffect beacuse
    // we cann't make the arrow function async in the above useeffect
    const fetchUserListings = async () => {
      const listingRef = collection(db, "listings");
      const q = query(
        listingRef,
        where("userRef", "==", auth.currentUser.uid),
        orderBy("timeStamp", "desc")
      );
      //  after the query we will get the documents
      const querySnap = await getDocs(q);
      // now we will make empty array and loop through the querySnap to add the data to the listing variable
      let listings = [];
      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setListings(listings);
      setLoading(false);
    };
    fetchUserListings();
  }, [auth.currentUser.uid]); // the empty bracket means to run the useEffect once

  async function onDelete(listingID) {
    if (window.confirm("Are You Sure To Delete?")) {
      //  here we will delete the item from the doc
      await deleteDoc(doc(db, "listings", listingID));
      // here we will filter the deleted item
      const updatedListings = listings.filter(
        (listing) => listing.id !== listingID
      );
      // after deleting from the doc we have to update the state as well
      setListings(updatedListings);
      toast.success("Successfully Updated the listings");
    }
  }
  function onEdit(listingID) {
    navigate(`/edit-listing/${listingID}`);
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
          <button
            type='submit'
            className='w-full bg-blue-600 text-white
          uppercase px-7 py-3 text-sm font-medium rounded shadow-md
          hover:bg-blue-700 transition duration-200 ease-in-out
          hover:shadow-lg active:bg-blue-800'>
            <Link
              to='/create-listing'
              className='flex justify-center items-center'>
              <FcHome className='mr-2 bg-red-200 text-3xl rounded-full p-1 border-2' />
              Sell Or Rent Your Home
            </Link>
          </button>
        </div>
      </section>
      <div className='max-w-6xl px-3 mt-6 mx-auto'>
        {!loading && listings.length > 0 && (
          <>
            <h2 className='text-2xl text-center font-semibold mb-6'>
              My Listings
            </h2>
            <ul className='sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 mt-6 mb-6'>
              {listings.map((listing) => (
                <ListingItem
                  key={listing.id}
                  id={listing.id}
                  listing={listing.data}
                  onDelete={() => onDelete(listing.id)}
                  onEdit={() => onEdit(listing.id)}
                />
              ))}
            </ul>
          </>
        )}
      </div>
    </>
  );
}
