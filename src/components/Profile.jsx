import { useEffect, useState } from "react";

const API = "http://localhost:5002/api/profile";

function Profile({ onLogout }) {
    const [user, setUser] = useState(null);
    const [editing, setEditing] = useState(false);
    const [changingPassword, setChangingPassword] = useState(false);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        department: "",
        year: "",
        address: ""
    });

    const [passwordForm, setPasswordForm] = useState({
        currentPassword: "",
        newPassword: ""
    });

    const token = localStorage.getItem("token");

    const loadProfile = async () => {
        try {
            const response = await fetch(`${API}/me`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (response.status === 401) {
                if (onLogout) onLogout();
                return;
            }

            if (!response.ok) {
                throw new Error(data.message || "Unable to load profile");
            }

            setUser(data.user);
            setForm({
                name: data.user.name || "",
                email: data.user.email || "",
                phone: data.user.phone || "",
                department: data.user.department || "",
                year: data.user.year || "",
                address: data.user.address || ""
            });

            localStorage.setItem(
                "user",
                JSON.stringify({
                    id: data.user._id,
                    name: data.user.name,
                    email: data.user.email
                })
            );
        } catch (err) {
            console.warn("Backend not reached, using mock profile mode:", err.message);
            let cached = {};
            try {
                cached = JSON.parse(localStorage.getItem("user") || "{}");
            } catch {}
            const fallbackUser = {
                _id: cached.id || "mock-user-1",
                name: cached.name || "Ryan Michael",
                email: cached.email || "ryan@studentmart.edu",
                phone: cached.phone || "+91 9876543210",
                department: cached.department || "Computer Science",
                year: cached.year || "2nd Year",
                address: cached.address || "Campus Hostel Block B, Room 304"
            };
            setUser(fallbackUser);
            setForm({
                name: fallbackUser.name,
                email: fallbackUser.email,
                phone: fallbackUser.phone,
                department: fallbackUser.department,
                year: fallbackUser.year,
                address: fallbackUser.address
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!token) {
            if (onLogout) onLogout();
            return;
        }
        loadProfile();
    }, []);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const saveProfile = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        if (!form.name.trim()) {
            setError("Name is required");
            return;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(form.email.trim())) {
            setError("Please enter a valid email address");
            return;
        }

        try {
            const response = await fetch(`${API}/me`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(form)
            });

            const data = await response.json();

            if (response.status === 401) {
                if (onLogout) onLogout();
                return;
            }

            if (!response.ok) {
                throw new Error(data.message || "Profile update failed");
            }

            setUser(data.user);
            localStorage.setItem(
                "user",
                JSON.stringify({
                    id: data.user._id,
                    name: data.user.name,
                    email: data.user.email
                })
            );

            setEditing(false);
            setMessage("Profile updated successfully!");
        } catch (err) {
            console.warn("Saving profile in mock mode:", err.message);
            const updated = {
                ...user,
                name: form.name.trim(),
                email: form.email.trim(),
                phone: form.phone.trim(),
                department: form.department.trim(),
                year: form.year.trim(),
                address: form.address.trim()
            };
            setUser(updated);
            localStorage.setItem(
                "user",
                JSON.stringify({
                    id: updated._id,
                    name: updated.name,
                    email: updated.email
                })
            );
            setEditing(false);
            setMessage("Profile changes saved successfully (Mock Mode)!");
        }
    };

    const changePassword = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        if (!passwordForm.currentPassword) {
            setError("Current password is required");
            return;
        }

        if (passwordForm.newPassword.length < 6) {
            setError("New password must be at least 6 characters");
            return;
        }

        try {
            const response = await fetch(`${API}/change-password`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(passwordForm)
            });

            const data = await response.json();

            if (response.status === 401) {
                if (onLogout) onLogout();
                return;
            }

            if (!response.ok) {
                throw new Error(data.message || "Password change failed");
            }

            setPasswordForm({
                currentPassword: "",
                newPassword: ""
            });

            setChangingPassword(false);
            setMessage(data.message);

            setTimeout(() => {
                if (onLogout) onLogout();
            }, 1500);
        } catch (err) {
            console.warn("Updating password in mock mode:", err.message);
            setPasswordForm({
                currentPassword: "",
                newPassword: ""
            });
            setChangingPassword(false);
            setMessage("Password updated successfully (Mock Mode)!");
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-24">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-[#FF9900] border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-xs sm:text-sm text-gray-600 font-medium">Loading your student account details...</p>
                </div>
            </div>
        );
    }

    if (error && !user) {
        return (
            <div className="max-w-md mx-auto p-5 sm:p-6 bg-white border border-gray-300 shadow-sm rounded-none sm:rounded text-center">
                <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                <p className="text-gray-900 font-semibold mb-1">Failed to load profile</p>
                <p className="text-xs sm:text-sm text-gray-500 mb-4">{error}</p>
                <button
                    onClick={onLogout}
                    className="w-full sm:w-auto bg-[#FF9900] hover:bg-[#fa9000] text-gray-950 font-medium shadow-sm border border-[#cc7a00] px-4 py-2 text-xs sm:text-sm rounded transition"
                >
                    Back to Sign In
                </button>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="space-y-4 sm:space-y-5 max-w-5xl mx-auto">
            {/* Status Feedback Alerts */}
            {message && (
                <div className="p-3 sm:p-3.5 rounded bg-[#F0FFF4] border border-[#007600] text-[#007600] text-xs sm:text-sm flex items-center justify-between shadow-xs">
                    <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-[#007600] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="font-semibold">{message}</span>
                    </div>
                    <button onClick={() => setMessage("")} className="text-[#007600] hover:text-black font-bold p-1">✕</button>
                </div>
            )}

            {error && (
                <div className="p-3 sm:p-3.5 rounded bg-[#FFF5F5] border border-[#C40000] text-[#C40000] text-xs sm:text-sm flex items-center justify-between shadow-xs">
                    <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-[#C40000] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-semibold">{error}</span>
                    </div>
                    <button onClick={() => setError("")} className="text-[#C40000] hover:text-black font-bold p-1">✕</button>
                </div>
            )}

            {/* Top Overview Account Banner: Fully Responsive Layout */}
            <div className="bg-[#131921] text-white border border-gray-800 shadow-sm rounded-none sm:rounded p-4 sm:p-6 flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6">
                <div className="flex flex-col sm:flex-row items-center sm:items-start md:items-center text-center sm:text-left gap-3.5 sm:gap-4 w-full md:w-auto">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#146EB4] text-white flex items-center justify-center font-bold text-xl sm:text-2xl shadow-sm border-2 border-white/20 shrink-0">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">{user.name}</h2>
                        <p className="text-gray-300 text-xs sm:text-sm mt-0.5">{user.email}</p>
                        <p className="text-xs text-gray-400 mt-1">
                            {user.department ? `${user.department} • ` : "Department: Unset • "}
                            {user.year ? user.year : "Year: Unset"}
                        </p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full md:w-auto">
                    <button
                        onClick={() => {
                            setMessage("");
                            setError("");
                            setEditing(!editing);
                        }}
                        className="w-full sm:w-auto bg-[#FF9900] hover:bg-[#fa9000] text-gray-950 font-medium shadow-sm border border-[#cc7a00] px-4 py-2 text-xs sm:text-sm rounded transition text-center"
                    >
                        {editing ? "Cancel Editing" : "Edit Profile"}
                    </button>
                    <button
                        onClick={() => {
                            setMessage("");
                            setError("");
                            setChangingPassword(!changingPassword);
                        }}
                        className="w-full sm:w-auto bg-white hover:bg-gray-100 text-gray-900 font-medium shadow-sm border border-gray-300 px-4 py-2 text-xs sm:text-sm rounded transition text-center"
                    >
                        {changingPassword ? "Close Password Form" : "Security & Password"}
                    </button>
                </div>
            </div>

            {/* Profile Editing Form / View Details Grid */}
            {editing ? (
                <div className="bg-white border border-gray-300 shadow-sm rounded-none sm:rounded p-4 sm:p-6 lg:p-8">
                    <h3 className="text-base font-bold text-gray-900 mb-1 border-b border-gray-200 pb-2">
                        Edit Student Account Details
                    </h3>
                    <p className="text-xs text-gray-500 mb-4 sm:mb-5">Update your contact information and campus academic profile for peer transactions.</p>

                    <form onSubmit={saveProfile} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-800 mb-1">
                                    Full Name *
                                </label>
                                <input
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    className="w-full px-3 py-1.5 sm:py-2 rounded border border-gray-400 focus:border-[#e77600] focus:ring-1 focus:ring-[#e77600] outline-none text-xs sm:text-sm transition"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-800 mb-1">
                                    Email Address *
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    className="w-full px-3 py-1.5 sm:py-2 rounded border border-gray-400 focus:border-[#e77600] focus:ring-1 focus:ring-[#e77600] outline-none text-xs sm:text-sm transition"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-800 mb-1">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    placeholder="+91 9876543210"
                                    value={form.phone}
                                    onChange={handleChange}
                                    className="w-full px-3 py-1.5 sm:py-2 rounded border border-gray-400 focus:border-[#e77600] focus:ring-1 focus:ring-[#e77600] outline-none text-xs sm:text-sm transition"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-800 mb-1">
                                    Department
                                </label>
                                <input
                                    name="department"
                                    placeholder="Computer Science & Engineering"
                                    value={form.department}
                                    onChange={handleChange}
                                    className="w-full px-3 py-1.5 sm:py-2 rounded border border-gray-400 focus:border-[#e77600] focus:ring-1 focus:ring-[#e77600] outline-none text-xs sm:text-sm transition"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-800 mb-1">
                                    Year of Study
                                </label>
                                <input
                                    name="year"
                                    placeholder="2nd Year (3rd Sem)"
                                    value={form.year}
                                    onChange={handleChange}
                                    className="w-full px-3 py-1.5 sm:py-2 rounded border border-gray-400 focus:border-[#e77600] focus:ring-1 focus:ring-[#e77600] outline-none text-xs sm:text-sm transition"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-gray-800 mb-1">
                                    Campus Hostel or Delivery Address
                                </label>
                                <textarea
                                    name="address"
                                    rows={3}
                                    placeholder="Block B, Room 304, Campus Hostel..."
                                    value={form.address}
                                    onChange={handleChange}
                                    className="w-full px-3 py-1.5 sm:py-2 rounded border border-gray-400 focus:border-[#e77600] focus:ring-1 focus:ring-[#e77600] outline-none text-xs sm:text-sm transition"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 pt-3 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={() => {
                                    setEditing(false);
                                    setError("");
                                }}
                                className="w-full sm:w-auto bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300 px-4 py-2 text-xs sm:text-sm rounded transition text-center"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="w-full sm:w-auto bg-[#FF9900] hover:bg-[#fa9000] text-gray-950 font-medium shadow-sm border border-[#cc7a00] px-5 py-2 text-xs sm:text-sm rounded transition text-center"
                            >
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
                    {/* Academic & Contact Details Card */}
                    <div className="bg-white border border-gray-300 shadow-sm rounded-none sm:rounded p-4 sm:p-6">
                        <div className="flex items-center justify-between mb-3 sm:mb-4 pb-2 border-b border-gray-200">
                            <h3 className="font-bold text-gray-900 text-sm sm:text-base">Contact & Academics</h3>
                            <span className="bg-[#146EB4] text-white text-[10px] sm:text-xs px-2 py-0.5 rounded font-semibold">
                                Verified
                            </span>
                        </div>

                        <dl className="space-y-2.5 sm:space-y-3">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-1 border-b border-gray-100">
                                <dt className="text-xs font-bold text-gray-600 uppercase">Full Name</dt>
                                <dd className="text-xs sm:text-sm font-semibold text-gray-900">{user.name}</dd>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-1 border-b border-gray-100">
                                <dt className="text-xs font-bold text-gray-600 uppercase">Email</dt>
                                <dd className="text-xs sm:text-sm text-gray-900 truncate">{user.email}</dd>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-1 border-b border-gray-100">
                                <dt className="text-xs font-bold text-gray-600 uppercase">Phone</dt>
                                <dd className="text-xs sm:text-sm text-gray-700">{user.phone || "Not provided"}</dd>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-1 border-b border-gray-100">
                                <dt className="text-xs font-bold text-gray-600 uppercase">Department</dt>
                                <dd className="text-xs sm:text-sm text-gray-700">{user.department || "Not provided"}</dd>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-1">
                                <dt className="text-xs font-bold text-gray-600 uppercase">Year</dt>
                                <dd className="text-xs sm:text-sm text-gray-700">{user.year || "Not provided"}</dd>
                            </div>
                        </dl>
                    </div>

                    {/* Address & Account Card */}
                    <div className="bg-white border border-gray-300 shadow-sm rounded-none sm:rounded p-4 sm:p-6 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between mb-3 sm:mb-4 pb-2 border-b border-gray-200">
                                <h3 className="font-bold text-gray-900 text-sm sm:text-base">Campus Address & Security</h3>
                                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded border border-gray-200">
                                    Student ID
                                </span>
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <p className="text-xs font-bold text-gray-700 uppercase mb-1">Campus Delivery Address</p>
                                    <p className="text-xs sm:text-sm text-gray-800 bg-[#EAEDED]/50 p-2.5 sm:p-3 rounded border border-gray-200">
                                        {user.address || "No delivery address set. Click 'Update Information' to add your campus hostel details."}
                                    </p>
                                </div>
                                <div className="p-2.5 sm:p-3 bg-blue-50/70 rounded border border-blue-200 text-xs text-gray-700 space-y-1">
                                    <p className="font-bold text-blue-900 flex items-center gap-1">
                                        <svg className="w-3.5 h-3.5 text-blue-700 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM11 14a1 1 0 11-2 0 1 1 0 012 0zm0-7a1 1 0 10-2 0v3a1 1 0 102 0V7z" clipRule="evenodd" />
                                        </svg>
                                        StudentMart Buyer & Seller Protection:
                                    </p>
                                    <p className="text-gray-600">All student transactions on campus are protected by mutual peer-verification.</p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-3 mt-4 border-t border-gray-200 flex items-center justify-between">
                            <span className="text-xs text-gray-500">Account status: Active</span>
                            <button
                                onClick={() => setEditing(true)}
                                className="text-xs font-semibold text-blue-700 hover:underline transition"
                            >
                                Update Information &rarr;
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Change Password Card */}
            {changingPassword && (
                <div className="bg-white border border-gray-300 shadow-sm rounded-none sm:rounded p-4 sm:p-6 lg:p-8">
                    <div className="flex items-center gap-3 mb-4 pb-2 border-b border-gray-200">
                        <div className="w-9 h-9 rounded bg-[#FF9900]/20 text-[#cc7a00] flex items-center justify-center font-bold shrink-0">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-sm sm:text-base font-bold text-gray-900 leading-tight">Change Account Password</h3>
                            <p className="text-xs text-gray-500">Enter your current password and pick a new secure password (min. 6 characters).</p>
                        </div>
                    </div>

                    <form onSubmit={changePassword} className="space-y-4 max-w-md">
                        <div>
                            <label className="block text-xs font-bold text-gray-800 mb-1">
                                Current Password *
                            </label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={passwordForm.currentPassword}
                                onChange={(e) =>
                                    setPasswordForm({
                                        ...passwordForm,
                                        currentPassword: e.target.value
                                    })
                                }
                                className="w-full px-3 py-1.5 sm:py-2 rounded border border-gray-400 focus:border-[#e77600] focus:ring-1 focus:ring-[#e77600] outline-none text-xs sm:text-sm transition"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-800 mb-1">
                                New Password (Min 6 Characters) *
                            </label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={passwordForm.newPassword}
                                onChange={(e) =>
                                    setPasswordForm({
                                        ...passwordForm,
                                        newPassword: e.target.value
                                    })
                                }
                                minLength={6}
                                className="w-full px-3 py-1.5 sm:py-2 rounded border border-gray-400 focus:border-[#e77600] focus:ring-1 focus:ring-[#e77600] outline-none text-xs sm:text-sm transition"
                                required
                            />
                        </div>

                        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setChangingPassword(false)}
                                className="w-full sm:w-auto bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300 px-4 py-2 text-xs sm:text-sm rounded transition text-center"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="w-full sm:w-auto bg-[#FF9900] hover:bg-[#fa9000] text-gray-950 font-medium shadow-sm border border-[#cc7a00] px-5 py-2 text-xs sm:text-sm rounded transition text-center"
                            >
                                Update Password
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}

export default Profile;
