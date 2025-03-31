import React from "react";

const HomePage = () => {
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to Home Page</h1>
                <p className="text-gray-600 text-lg">
                    This is a simple home page styled with Tailwind CSS.
                </p>
                <button className="mt-6 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                    Get Started
                </button>
            </div>
        </div>
    );
};

export default HomePage;