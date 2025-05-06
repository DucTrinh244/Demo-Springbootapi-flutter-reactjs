// src/routes/PrivateRoute.jsx
import axios from "axios";
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const [isValid, setIsValid] = useState(null); // Track token validity
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      // Make an API request to validate the token
      axios
        .post("http://localhost:8080/validate-token", token, {
          headers: {
            "Content-Type": "text/plain", // Set content type to plain text
          },
        })
        .then((response) => {
          if (response.status === 200) {
            setIsValid(true); // Token is valid
          }
        })
        .catch(() => {
          setIsValid(false); // Token is invalid or expired
        });
    } else {
      setIsValid(false); // No token found
    }
  }, [token]);

  // Check token validity
  if (isValid === null) {
    // Optionally show a loading indicator while checking the token
    return <div>Loading...</div>;
  }

  return isValid ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
