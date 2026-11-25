import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const API = "http://localhost:5002/api/auth";

function Register({ onRegisterSuccess, onLogin }) {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        if (!name.trim()) {
            setError("Full name is required");
            return;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email.trim())) {
            setError("Please enter a valid email address");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${API}/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: name.trim(),
                    email: email.trim().toLowerCase(),
                    password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Registration failed");
            }

            setMessage("Registration successful! Redirecting to sign in...");
            setTimeout(() => {
                if (onRegisterSuccess) {
                    onRegisterSuccess();
                } else {
                    navigate("/login");
                }
            }, 1200);
        } catch (err) {
            setError(err.message || "Unable to connect to server");
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
                    <h2>Create Account</h2>
                    <p>Enter your student details to join StudentMart</p>
                </div>

                {message && <p className="alert success">{message}</p>}
                {error && <p className="alert error">{error}</p>}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="reg-name">Your name</label>
                        <input
                            id="reg-name"
                            type="text"
                            placeholder="First and last name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="reg-email">College / University Email</label>
                        <input
                            id="reg-email"
                            type="email"
                            placeholder="student@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="reg-password">Password</label>
                        <input
                            id="reg-password"
                            type="password"
                            placeholder="At least 6 characters"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            minLength={6}
                            required
                        />
                        <p className="text-[11px] text-gray-500 mt-0.5">Passwords must be at least 6 characters.</p>
                    </div>

                    <button type="submit" className="btn-submit" disabled={loading}>
                        {loading ? "Creating your account..." : "Continue"}
                    </button>
                </form>

                <p className="text-[11px] text-gray-600 mt-4 leading-relaxed">
                    By creating an account, you agree to StudentMart's{" "}
                    <span className="text-blue-700 hover:underline cursor-pointer">Conditions of Use</span> and{" "}
                    <span className="text-blue-700 hover:underline cursor-pointer">Privacy Notice</span>.
                </p>

                <div className="auth-footer">
                    <p>
                        Already have an account?{" "}
                        {onLogin ? (
                            <button type="button" className="text-blue-700 hover:underline font-semibold" onClick={onLogin}>
                                Sign in &rarr;
                            </button>
                        ) : (
                            <Link to="/login" className="text-blue-700 hover:underline font-semibold">
                                Sign in &rarr;
                            </Link>
                        )}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Register;
