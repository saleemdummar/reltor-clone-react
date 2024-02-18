import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import Spinner from "../components/Spinner";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Autoplay, Navigation, Pagination } from "swiper/modules";
import SwiperCore from "swiper";
import "swiper/css/bundle";
import {
  FaShare,
  FaMapMarkerAlt,
  FaBed,
  FaBath,
  FaParking,
  FaChair,
} from "react-icons/fa";

export default function Listing() {
  const params = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shareLinkCopied, setshareLinkCopied] = useState(false);
  SwiperCore.use([Autoplay, Navigation, Pagination]);
  useEffect(() => {
    async function fetchListing() {
      const docRef = doc(db, "listings", params.listingId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setListing(docSnap.data());
        setLoading(false);
        console.log(listing);
      }
    }
    fetchListing();
  }, [params.listingId]);
  if (loading) {
    return <Spinner />;
  }
  return (
    <main className=''>
      <Swiper
        slidesPerView={1}
        navigation
        pagination={{ type: "progressbar" }}
        effect='fade'
        modules={[EffectFade]}
        autoplay={{ delay: 3000 }}>
        {listing.imgUrls.map((url, index) => (
          <SwiperSlide key={index}>
            <img
              className='relative w-full overflow-hidden h-[300px]'
              style={{ center: "no-repeat", backgroundSize: "cover" }}
              src={listing.imgUrls[index]}
              alt=''
            />
          </SwiperSlide>
        ))}
      </Swiper>
      <div
        className='fixed top-[13%] z-10 right-[3%] bg-white cursor-pointer
      border-2 border-gray-400 rounded-full w-12 h-12 flex justify-center items-center'
        onClick={() => {
          navigator.clipboard.writeText(window.location.href);
          setshareLinkCopied(true);
          setTimeout(() => {
            setshareLinkCopied(false);
          }, 2000);
        }}>
        <FaShare className='text-lg text-slate-500 ' />
      </div>
      {shareLinkCopied && (
        <p
          className='fixed top-[23%] right-[5%] z-10 font-semibold border-2 border-gray-400
        rounded-md bg-white p-2'>
          Link Copied
        </p>
      )}
      <div
        className='m-4 flex flex-col md:flex-row max-w-6xl lg:mx-auto 
      p-4 rounded-lg  shadow-lg bg-white md:space-x-5 space-y-2'>
        <div className='w-full h-[200px] lg:h-[400px]'>
          <p className='text-2xl font-bold mb-3 text-blue-900'>
            {listing.name} - ${" "}
            {listing.offer
              ? listing.discountedPrice
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              : listing.regularPrice
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            {listing.type === "rent" ? " / Month" : ""}
          </p>
          <p className='flex items-center mt-6 mb-3 font-semibold'>
            <FaMapMarkerAlt className='text-green-700 mr-1' />
            {listing.address}
          </p>
          <div className='flex justify-start items-center space-x-4 w-[75%]'>
            <p
              className='bg-red-800 w-full p-1 max-w-[200px] rounded-md text-white 
            text-center font-semibold shadow-md '>
              {listing.type === "rent" ? "For Rent" : "For Sale"}
            </p>
            {listing.offer && (
              <p
                className='bg-green-800 w-full p-1 max-w-[200px] rounded-md text-white
              text-center font-semibold shadow-md'>
                ${listing.regularPrice - listing.discountedPrice} Discount
              </p>
            )}
          </div>
          <p className='mt-3 mb-3'>
            <span className='font-semibold'>Description - </span>
            {listing.description}
          </p>
          <ul className='flex items-center space-x-2 lg:space-x-10 text-sm font-semibold'>
            <li className='flex items-center whitespace-nowrap '>
              <FaBed className='text-lg mr-2' />
              {+listing.bedrooms > 1 ? `${listing.bedrooms} Beds` : "1 Bed"}
            </li>
            <li className='flex  items-center whitespace-nowrap'>
              <FaBath className='text-lg mr-2' />
              {+listing.bathrooms > 1
                ? `${listing.bathrooms} Bathrooms`
                : "1 Bathroom"}
            </li>
            <li className='flex  items-center whitespace-nowrap'>
              <FaParking className='text-lg mr-2' />
              {listing.parking ? "Parking spot" : "No parking"}
            </li>
            <li className='flex  items-center whitespace-nowrap'>
              <FaChair className='text-lg mr-2' />
              {listing.furnished ? "Furnished" : "Not furnished"}
            </li>
          </ul>
        </div>
        <div className='bg-blue-300 w-full h-[200px] lg:h-[400px] z-10 overflow-x-hidden'></div>
      </div>
    </main>
  );
}
