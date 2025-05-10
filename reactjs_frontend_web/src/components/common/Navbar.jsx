import { useState } from "react";
import MobileMenu from "../mobile/MobileMenu";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow p-4 flex justify-between items-center relative">
      <div className="flex items-center space-x-4">
        <img
          src="https://wac-cdn.atlassian.com/assets/img/favicons/atlassian/favicon.png"
          alt="logo"
          className="h-6"
        />
        <span className="text-xl font-semibold">ZoneDev</span>
      </div>

      {/* Desktop Nav */}
      <nav className="hidden md:flex space-x-6 text-gray-700">
        {/* <a href="#">About</a> */}
        {/* <a href="#">Product guide</a>
        <a href="#">Templates</a>
        <a href="#">Pricing</a>
        <a href="#">Enterprise</a> */}
      </nav>

      {/* Hamburger Icon */}
      <div className="md:hidden">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-gray-700 focus:outline-none"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {menuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      <MobileMenu menuOpen={menuOpen} />
    </header>
  );
};

export default Header;
