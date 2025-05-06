
import { Link } from "react-router-dom"; // nếu bạn dùng react-router

const NotFoundPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white px-4">
      <div className="text-center">
        <h1 className="text-9xl font-extrabold text-blue-600 tracking-widest">404</h1>
        <div className="bg-blue-200 px-2 text-sm rounded rotate-12 absolute mt-[-4rem] ml-[-1rem]">
          Page Not Found
        </div>

        <p className="mt-6 text-lg text-gray-600">
          Oops! The page you’re looking for doesn’t exist.
        </p>

        <Link
          to="/"
          className="mt-8 inline-block px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
