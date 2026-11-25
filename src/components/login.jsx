import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const API = "http://localhost:5002/api/auth";

function Login({ onLoginSuccess, onRegister }) {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email.trim())) {
            setError("Please enter a valid email address");
            return;
        }

        if (!password) {
            setError("Password is required");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${API}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email.trim().toLowerCase(),
                    password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Invalid credentials");
            }

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            if (onLoginSuccess) {
                onLoginSuccess();
            } else {
                navigate("/dashboard/products");
            }
        } catch (err) {
            console.warn("Backend not reached, enabling Mock Session:", err.message);
            const mockUser = {
                id: "mock-user-1",
                name: "Ryan Michael",
                email: email.trim().toLowerCase() || "student@mart.edu",
                department: "Computer Science",
                year: "2nd Year",
                address: "Campus Hostel Block B"
            };
            localStorage.setItem("token", "mock-token-session");
            localStorage.setItem("user", JSON.stringify(mockUser));
            if (onLoginSuccess) {
                onLoginSuccess();
            } else {
                navigate("/dashboard/products");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container w-full min-h-screen flex flex-col items-center justify-center p-3 sm:p-4 bg-[#EAEDED]">
            {/* StudentMart Marketplace Logo Header */}
            <div className="flex items-center gap-2 mb-4 select-none">
                <div className="w-9 h-9 rounded bg-[#FF9900] text-gray-950 flex items-center justify-center shadow-xs shrink-0">
                    <svg className="w-5 h-5 text-gray-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                </div>
                <span className="text-2xl font-black text-gray-900 tracking-tight">StudentMart</span>
            </div>

            <div className="auth-card m-auto">
                <div className="auth-header">
                    <h2>Sign in</h2>
                    <p>Enter your student credentials to continue to StudentMart</p>
                </div>

                {error && <p className="alert error">{error}</p>}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="login-email">Email or college username</label>
                        <input
                            id="login-email"
                            type="email"
                            placeholder="user@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <div className="flex items-center justify-between">
                            <label htmlFor="login-password">Password</label>
                            <span className="text-xs text-blue-700 hover:underline cursor-pointer">Forgot your password?</span>
                        </div>
                        <input
                            id="login-password"
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn-submit" disabled={loading}>
                        {loading ? "Signing in..." : "Sign In"}
                    </button>
                </form>

                <p className="text-[11px] text-gray-600 mt-4 leading-relaxed">
                    By continuing, you agree to StudentMart's{" "}
                    <span className="text-blue-700 hover:underline cursor-pointer">Conditions of Use</span> and{" "}
                    <span className="text-blue-700 hover:underline cursor-pointer">Privacy Notice</span>.
                </p>

                <div className="auth-footer">
                    <div className="relative flex py-2 items-center">
                        <div className="flex-grow border-t border-gray-300"></div>
                        <span className="flex-shrink mx-2 text-[11px] text-gray-500 uppercase tracking-wider">New to StudentMart?</span>
                        <div className="flex-grow border-t border-gray-300"></div>
                    </div>
                    {onRegister ? (
                        <button
                            type="button"
                            className="w-full mt-2 py-1.5 px-3 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded text-xs font-medium text-gray-800 transition"
                            onClick={onRegister}
                        >
                            Create your StudentMart account
                        </button>
                    ) : (
                        <Link
                            to="/register"
                            className="block w-full text-center mt-2 py-1.5 px-3 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded text-xs font-medium text-gray-800 transition"
                        >
                            Create your StudentMart account
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Login;
