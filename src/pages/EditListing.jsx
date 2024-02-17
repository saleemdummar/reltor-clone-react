import React, { useEffect, useState } from "react";
import Spinner from "../components/Spinner";
import { v4 as uuidv4 } from "uuid";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../firebase";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { toast } from "react-toastify";
import { getAuth } from "firebase/auth";
export default function EditListing() {
  const navigate = useNavigate();
  const auth = getAuth();
  const [geoLocationEnabled, setGeoLocationEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [listing, setListing] = useState(null);
  const [formData, setFormData] = useState({
    type: "rent",
    name: "",
    bedrooms: 1,
    bathrooms: 1,
    parking: false,
    furnished: false,
    address: "",
    description: "",
    offer: true,
    regularPrice: 0,
    discountedPrice: 0,
    latitude: 0,
    longitude: 0,
    images: {},
  });
  const {
    type,
    name,
    bedrooms,
    regularPrice,
    bathrooms,
    parking,
    furnished,
    address,
    description,
    offer,
    discountedPrice,
    latitude,
    longitude,
    images,
  } = formData;
  // we need id of the item which we can get form the url ,, we will use react-router-dom useParams
  const params = useParams();
  // this useEffect is for user identification who can edit the page
  useEffect(() => {
    if (listing && listing.userRef !== auth.currentUser.uid) {
      toast.error("You can't Eidt this");
      navigate("/");
    }
  }, [auth.currentUser.uid, listing, navigate]);

  useEffect(() => {
    setLoading(true);
    async function fetchListing() {
      // first off all we need reference to the doc which take "db" , " collection " and id
      const docRef = doc(db, "listings", params.listingId);
      // know we need snapshot of the doc
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setListing(docSnap.data());
        setFormData({ ...docSnap.data() });
        setLoading(false);
      } else {
        navigate("/");
        toast.error("Listing doesn't Exists");
      }
    }
    fetchListing();
  }, [navigate, params.listingId]);

  function onChange(e) {
    let boolean = null;
    if (e.target.value === "true") {
      boolean = true;
    }
    if (e.target.value === "false") {
      boolean = false;
    }
    if (e.target.files) {
      setFormData((preState) => ({
        ...preState,
        images: e.target.files,
      }));
    }
    if (!e.target.files) {
      setFormData((preState) => ({
        ...preState,
        [e.target.id]: boolean ?? e.target.value,
      }));
    }
  }
  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    if (+discountedPrice >= +regularPrice) {
      setLoading(false);
      toast.error("Discounted Price must be Less than Regular Price");
      return;
    }
    if (images.length > 6) {
      setLoading(false);
      toast.error("Maximum 6 Images are Allowed");
      return;
    }
    // in this variable we will set the latitude and longitude
    let geoLocation = {};
    // in this variable we will get location from google api
    let location;
    if (geoLocationEnabled) {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.REACT_APP_GEOCODE_API_KEY}`
      );
      const data = await response.json();
      console.log(data);
      geoLocation.lat = data.results[0]?.geometry.location.lat ?? 0;
      geoLocation.lng = data.results[0]?.geometry.location.lng ?? 0;
      location = data.status === "ZERO_RESULTS" && undefined;
      if (location === undefined) {
        setLoading(false);
        toast.error("Please enter the correct address");
        return;
      }
    } else {
      geoLocation.lat = latitude;
      geoLocation.lng = longitude;
    }
    async function storeImage(image) {
      return new Promise((resolve, reject) => {
        const storage = getStorage();
        const filename = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;
        const storageRef = ref(storage, filename);
        const uploadTask = uploadBytesResumable(storageRef, image);
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            switch (snapshot.state) {
              case "paused":
                console.log("Upload is paused");
                break;
              case "running":
                console.log("Upload is running");
                break;
            }
          },
          (error) => {
            // Handle unsuccessful uploads
            reject(error);
          },
          () => {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            });
          }
        );
      });
    }
    const imgUrls = await Promise.all(
      [...images].map((image) => storeImage(image))
    ).catch((error) => {
      setLoading(false);
      toast.error("Images not uploaded");
      return;
    });
    const formDataCopy = {
      ...formData,
      imgUrls,
      geoLocation,
      timeStamp: serverTimestamp(),
      userRef: auth.currentUser.uid,
    };

    delete formDataCopy.images;
    !formDataCopy.offer && delete formDataCopy.discountedPrice;
    delete formDataCopy.latitude;
    delete formDataCopy.longitude;
    const docRef = doc(db, "listings", params.listingId);
    await updateDoc(docRef, formDataCopy);
    setLoading(false);
    toast.success("Listing Successfully Eidted");
    navigate(`/category/${formDataCopy.type}/${docRef.id}`);
  }

  if (loading) {
    return <Spinner />;
  }
  return (
    <main className='max-w-md px-2 mx-auto'>
      <h1 className='text-center font-bold mt-6 text-3xl'>Edit Listing</h1>
      <form onSubmit={onSubmit}>
        <p className='text-lg mt-6 font-semibold'>Sell / Rent</p>
        <div className='flex'>
          <button
            type='button'
            id='type'
            value='sale'
            onClick={onChange}
            className={` mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg 
            transition duration-150 ease-in-out w-full ${
              type === "rent"
                ? "bg-white text-black"
                : "bg-slate-600 text-white"
            }`}>
            sell
          </button>
          <button
            type='button'
            id='type'
            value='rent'
            onClick={onChange}
            className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg 
            transition duration-150 ease-in-out w-full ${
              type === "sale"
                ? "bg-white text-black"
                : "bg-slate-600 text-white"
            }`}>
            rent
          </button>
        </div>
        <p className='mt-6 text-lg font-semibold'>Name</p>
        <input
          type='text'
          value={name}
          id='name'
          placeholder='Name'
          maxLength='32'
          minLength='10'
          required
          onChange={onChange}
          className='w-full px-4 py-2 text-gray-700 text-xl bg-white border border-gray-300 rounded transition duration-150 ease-in-out
           focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6'
        />
        <div className='flex space-x-6 mb-6'>
          <div>
            <p className='text-lg font-semibold'>Beds</p>
            <input
              type='number'
              value={bedrooms}
              onChange={onChange}
              id='bedrooms'
              min='1'
              max='50'
              required
              className='w-full px-4 py-2 text-gray-700 text-xl bg-white
              border border-gray-300 text-center rounded transition duration-150
              ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600'
            />
          </div>
          <div>
            <p className='text-lg font-semibold'>Baths</p>
            <input
              type='number'
              value={bathrooms}
              onChange={onChange}
              id='bathrooms'
              min='1'
              max='50'
              required
              className='w-full px-4 py-2 text-gray-700 text-xl bg-white
              border border-gray-300 text-center rounded transition duration-150
              ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600'
            />
          </div>
        </div>
        <p className='text-lg mt-6 font-semibold'>Parking Spot</p>
        <div className='flex'>
          <button
            type='button'
            id='parking'
            value={true}
            onClick={onChange}
            className={` mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg 
            transition duration-150 ease-in-out w-full ${
              !parking ? "bg-white text-black" : "bg-slate-600 text-white"
            }`}>
            yes
          </button>
          <button
            type='button'
            id='parking'
            value={false}
            onClick={onChange}
            className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg 
            transition duration-150 ease-in-out w-full ${
              parking ? "bg-white text-black" : "bg-slate-600 text-white"
            }`}>
            no
          </button>
        </div>
        <p className='text-lg mt-6 font-semibold'>Furnished</p>
        <div className='flex'>
          <button
            type='button'
            id='furnished'
            value={true}
            onClick={onChange}
            className={` mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg 
            transition duration-150 ease-in-out w-full ${
              !furnished ? "bg-white text-black" : "bg-slate-600 text-white"
            }`}>
            yes
          </button>
          <button
            type='button'
            id='furnished'
            value={false}
            onClick={onChange}
            className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg 
            transition duration-150 ease-in-out w-full ${
              furnished ? "bg-white text-black" : "bg-slate-600 text-white"
            }`}>
            no
          </button>
        </div>
        <p className='mt-6 text-lg font-semibold'>Address</p>
        <textarea
          type='text'
          value={address}
          id='address'
          placeholder='address'
          required
          onChange={onChange}
          className='w-full px-4 py-2 text-gray-700 text-xl bg-white border border-gray-300 rounded transition duration-150 ease-in-out
           focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6'
        />
        {!geoLocationEnabled && (
          <div className='flex space-x-6 mb-6 justify-start'>
            <div className=''>
              <p className='text-xl font-semibold'>Latitide</p>
              <input
                type='number'
                id='latitude'
                value={latitude}
                onChange={onChange}
                required
                min='-90'
                max='90'
                className='w-full px-4 py-4 rounded text-xl text-gray-700 bg-white
                border border-gray-300 transition duration-150 ease-in-out
                focus:text-gray-700 focus:bg-white focus:border-slate-600
                text-center'
              />
            </div>
            <div className=''>
              <p className='text-xl font-semibold'>Longitude</p>
              <input
                type='number'
                id='longitude'
                value={longitude}
                onChange={onChange}
                required
                min='-180'
                max='180'
                className='w-full px-4 py-4 rounded text-xl text-gray-700 bg-white
                border border-gray-300 transition duration-150 ease-in-out
                focus:text-gray-700 focus:bg-white focus:border-slate-600
                text-center'
              />
            </div>
          </div>
        )}
        <p className=' text-lg font-semibold'>Description</p>
        <textarea
          type='text'
          value={description}
          id='description'
          placeholder='Description'
          required
          onChange={onChange}
          className='w-full px-4 py-2 text-gray-700 text-xl bg-white border border-gray-300 rounded transition duration-150 ease-in-out
           focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6'
        />
        <p className='text-lg font-semibold'>Offer</p>
        <div className='flex mb-6'>
          <button
            type='button'
            id='offer'
            value={true}
            onClick={onChange}
            className={` mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg 
            transition duration-150 ease-in-out w-full ${
              !offer ? "bg-white text-black" : "bg-slate-600 text-white"
            }`}>
            yes
          </button>
          <button
            type='button'
            id='offer'
            value={false}
            onClick={onChange}
            className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg 
            transition duration-150 ease-in-out w-full ${
              offer ? "bg-white text-black" : "bg-slate-600 text-white"
            }`}>
            no
          </button>
        </div>
        <div className='items-center mb-6'>
          <div className=''>
            <p className='text-lg font-semibold'>Regular Price</p>
          </div>
          <div className='flex w-full justify-center items-center space-x-6'>
            <input
              type='number'
              id='regularPrice'
              value={regularPrice}
              onChange={onChange}
              min='1'
              max='400000000'
              required
              className='w-full px-4 py-4 rounded text-xl text-gray-700 bg-white
              border border-gray-300 transition duration-150 ease-in-out
              focus:text-gray-700 focus:bg-white focus:border-slate-600
              text-center'
            />
            {type === "rent" && (
              <div className='div'>
                <p className='text-md w-full whitespace-nowrap'>$ / Month</p>
              </div>
            )}
          </div>
        </div>
        {offer && (
          <div className='items-center mb-6'>
            <div className=''>
              <p className='text-lg font-semibold'>Discounted Price</p>
            </div>
            <div className='flex w-full justify-center items-center space-x-6'>
              <input
                type='number'
                id='discountedPrice'
                value={discountedPrice}
                onChange={onChange}
                min='1'
                max='400000000'
                required={offer}
                className='w-full px-4 py-4 rounded text-xl text-gray-700 bg-white
                  border border-gray-300 transition duration-150 ease-in-out
                  focus:text-gray-700 focus:bg-white focus:border-slate-600
                  text-center'
              />
              {type === "rent" && (
                <div className='div'>
                  <p className='text-md w-full whitespace-nowrap'>$ / Month</p>
                </div>
              )}
            </div>
          </div>
        )}
        <div className='mb-6'>
          <p className='text-lg font-semibold'>Images</p>
          <p className='text-gray-600'>
            The First Image Will Be The Cover (max 6)
          </p>
          <input
            type='file'
            id='images'
            onChange={onChange}
            accept='.jpg,.png,.jpeg'
            multiple
            required
            className='w-full px-3 py-1.5 text-gray-700 bg-white 
            border border-gray-300 rounded transition duration-150 ease-in-out
            focus:bg-white focus:border-slate-600'
          />
        </div>
        <button
          type='submit'
          className='mb-6 w-full bg-blue-600 px-7 py-3
        text-white font-medium text-sm uppercase rounded
        shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700
        focus:shadow-lg active:bg-blue-800 active:shadow-lg
        transition duration-150 ease-in-out'>
          edit Listing
        </button>
      </form>
    </main>
  );
}
