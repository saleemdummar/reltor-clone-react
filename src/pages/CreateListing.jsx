import React, { useState } from "react";
export default function CreateListing() {
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
  });
  function onChange() {}
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
  } = formData;
  return (
    <main className='max-w-md px-2 mx-auto'>
      <h1 className='text-center font-bold mt-6 text-3xl'>Create a Listing</h1>
      <form>
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
            value='sale'
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
          Create Listing
        </button>
      </form>
    </main>
  );
}
