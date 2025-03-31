import React from "react";

const NavBar = () => {
    return (
        <nav className="bg-blue-600 text-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <span className="text-xl font-bold">MyApp</span>
                    </div>
                    <div className="hidden md:flex space-x-4">
                        <a href="add-user" className="hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium">
                            Add User
                        </a>
                        <a href="list-user" className="hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium">
                            List User
                        </a>
                        
                    </div>
                    <div className="md:hidden">
                        <button
                            type="button"
                            className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-blue-700 focus:outline-none"
                            aria-controls="mobile-menu"
                            aria-expanded="false"
                        >
                            <svg
                                className="h-6 w-6"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                aria-hidden="true"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16m-7 6h7"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            <div className="md:hidden" id="mobile-menu">
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                    <a href="#" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700">
                        Home
                    </a>
                    <a href="#" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700">
                        About
                    </a>
                    <a href="#" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700">
                        Services
                    </a>
                    <a href="#" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700">
                        Contact
                    </a>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;