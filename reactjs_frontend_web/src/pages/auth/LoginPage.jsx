import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

    const LoginPage = () => {
        const [email, setEmail] = useState("");
        const [password, setPassword] = useState("");
        const [showPassword, setShowPassword] = useState(false); // 👁️ Thêm state
        const navigate = useNavigate();

        const handleSubmit = async (e) => {
            e.preventDefault();
            
            try {
                const response = await axios.post("http://localhost:8080/authentication", {
                    email,
                    password,
                });
                if(                    response.status === 200) {
                const token = response.data.jwt;
                localStorage.setItem("token", token);
                localStorage.setItem("email", email);

                toast.success("Đăng nhập thành công!");
                navigate("/home");
                }
            } catch (error) {
                if (error.response && error.response.data) {
                    toast.error("Đăng nhập thất bại. Vui lòng kiểm tra lại tài khoản.");
                } else {
                    toast.error("Có lỗi xảy ra. Vui lòng thử lại!");
                }
            }
        };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center text-gray-800 sm:text-3xl">
                    Login
                </h2>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="w-full px-4 py-2 mt-1 text-gray-900 bg-gray-100 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                className="w-full px-4 py-2 mt-1 text-gray-900 bg-gray-100 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 pr-10"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-2 flex items-center text-gray-500"
                                onClick={() => setShowPassword(!showPassword)}
                                tabIndex={-1}
                            >
                                {showPassword ? "🙈" : "👁️"}
                            </button>
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="remember"
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
                                Remember me
                            </label>
                        </div>
                        <a href="#" className="text-sm text-blue-600 hover:underline">
                            Forgot password?
                        </a>
                    </div>
                    <button
                        type="submit"
                        className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-500"
                    >
                        Login
                    </button>
                </form>
                <p className="text-sm text-center text-gray-600">
                    Don't have an account?{" "}
                    <a href="/register" className="text-blue-600 hover:underline">
                        Sign up
                    </a>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
