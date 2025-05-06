// import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import { Toaster } from "react-hot-toast";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./configs/routes";

ReactDOM.createRoot(document.getElementById("root")).render(
		<BrowserRouter>
			<Toaster position="top-right" />
			<AppRoutes />
		</BrowserRouter>
);
