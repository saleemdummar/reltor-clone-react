import { useLocation, useNavigate } from "react-router-dom";

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();

  function pathMatchRoute(route) {
    return location.pathname === route;
  }
  return (
    <div className='bg-white border-b shadow-sm sticky top-0 z-50'>
      <header className='flex justify-between items-center px-3 max-w-6xl mx-auto'>
        <div>
          <img
            className='h-5 cursor-pointer'
            src='https://static.rdc.moveaws.com/images/logos/rdc-logo-default.svg'
            alt='real-tor-logo'
            onClick={() => {
              navigate("/");
            }}
          />
        </div>
        <div>
          <ul className='flex space-x-10'>
            <li
              className={`cursor-pointer py-3 text-sm font-semibold ${
                pathMatchRoute("/")
                  ? "text-black border-b-2 border-red-500"
                  : "text-gray-400"
              }`}
              onClick={() => {
                navigate("/");
              }}>
              Home
            </li>
            <li
              className={`cursor-pointer py-3 text-sm font-semibold ${
                pathMatchRoute("/offers")
                  ? "text-black border-b-2 border-red-500"
                  : "text-gray-400"
              }`}
              onClick={() => {
                navigate("/offers");
              }}>
              Offers
            </li>
            <li
              className={`cursor-pointer py-3 text-sm font-semibold ${
                pathMatchRoute("/sign-in")
                  ? "text-black border-b-2 border-red-500"
                  : "text-gray-400"
              }`}
              onClick={() => {
                navigate("/sign-in");
              }}>
              Sign In
            </li>
          </ul>
        </div>
      </header>
    </div>
  );
}
