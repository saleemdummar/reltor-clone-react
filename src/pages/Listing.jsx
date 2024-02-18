import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import Spinner from "../components/Spinner";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Autoplay, Navigation, Pagination } from "swiper/modules";
import SwiperCore from "swiper";
import "swiper/css/bundle";
import { FaShare } from "react-icons/fa";

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
    </main>
  );
}
