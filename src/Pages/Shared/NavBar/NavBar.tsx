import { useState } from "react";
import { Link } from "react-router-dom";
import {
  logout,
  selectCurrentUser,
} from "../../../redux/features/auth/authSlice";
import { IoLanguage } from "react-icons/io5";
import { useAppDispatch, useAppSelector } from "../../../redux/hook";
import { User } from "../../../types/user.type";
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser) as User | null;

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  const handleLogOut = () => {
    dispatch(logout());
    localStorage.clear();
    window.location.reload();
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-white text-black shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between relative">
        <div className="flex items-center">
          <IoLanguage className="mr-2 text-3xl" />{" "}
          <span className="text-2xl font-bold">Japify</span>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex space-x-6 font-semibold">
          {user ? (
            <>
              <Link to="/lessons" className="hover:text-gray-200">
                Lessons
              </Link>
              <Link to="/tutorials" className="hover:text-gray-200">
                Tutorials
              </Link>
              <Link
                to="/"
                onClick={handleLogOut}
                className="focus:outline-none"
              >
                Logout
              </Link>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-gray-200">
                Login
              </Link>
            </>
          )}

          {user?.role === "admin" && (
            <Link to="/dashboard" className="hover:text-gray-200">
              Dashboard
            </Link>
          )}
        </div>

        {/* Hamburger Icon for Mobile */}
        <div className="md:hidden absolute top-4 right-4 z-50">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-black focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden ${
          isMenuOpen ? "block" : "hidden"
        } absolute top-0 left-0 w-full bg-white text-black z-40`}
      >
        <div className="px-6 py-4 space-y-4">
          {user ? (
            <>
              <Link
                to="/dashboard/profile"
                className="block text-black hover:bg-gray-700 rounded-md px-4 py-2"
                onClick={handleLinkClick}
              >
                Dashboard
              </Link>
              <Link
                to="/"
                onClick={handleLogOut}
                className="block text-black hover:bg-gray-700 rounded-md px-4 py-2"
              >
                Logout
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="block text-black hover:bg-gray-700 rounded-md px-4 py-2"
                onClick={handleLinkClick}
              >
                Login
              </Link>
            </>
          )}
          {user?.role === "admin" && (
            <Link
              to="/dashboard"
              className="block text-black hover:bg-gray-700 rounded-md px-4 py-2"
              onClick={handleLinkClick}
            >
              Dashboard
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
