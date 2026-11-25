import { useState } from "react";
import { Outlet, useNavigate, Link } from "react-router-dom";
import Sidebar from "./Sidebar";

function DashboardLayout({ onLogout, user }) {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        navigate(`/dashboard/products${searchTerm.trim() ? `?search=${encodeURIComponent(searchTerm.trim())}` : ""}`);
    };

    const storedUser = user || (() => {
        try {
            return JSON.parse(localStorage.getItem("user") || "{}");
        } catch {
            return {};
        }
    })();

    return (
        <div className="h-screen w-screen overflow-hidden flex bg-[#EAEDED] relative">
            {/* Amazon Dark Navy Sidebar (Drawer on mobile, fixed column on desktop) */}
            <Sidebar
                onLogout={onLogout}
                user={user}
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            {/* Main Viewport Container */}
            <div className="flex-1 h-full overflow-y-auto flex flex-col bg-[#EAEDED] min-w-0">
                {/* Clean Top Navigation Bar */}
                <header className="sticky top-0 z-30 bg-[#131921] text-white px-3 sm:px-6 py-2.5 flex items-center justify-between gap-3 sm:gap-4 border-b border-black shadow-sm shrink-0">
                    {/* Left: Mobile Hamburger Toggle Button & Brand Title */}
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setSidebarOpen(true)}
                            className="md:hidden p-1.5 rounded text-gray-300 hover:text-white hover:bg-white/10 transition"
                            aria-label="Open navigation menu"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>

                        <div className="flex items-center gap-2 md:hidden">
                            <div className="w-7 h-7 rounded bg-[#FF9900] text-gray-950 flex items-center justify-center shadow-xs shrink-0">
                                <svg className="w-4 h-4 text-gray-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                            </div>
                            <span className="font-extrabold text-base text-white">StudentMart</span>
                        </div>
                    </div>

                    {/* Center: Search Bar */}
                    <div className="flex-1 max-w-2xl mx-1 sm:mx-3">
                        <form
                            onSubmit={handleSearchSubmit}
                            className="flex items-stretch w-full h-9 sm:h-10 rounded-md overflow-hidden bg-white focus-within:ring-2 focus-within:ring-[#FF9900] shadow-xs"
                        >
                            <input
                                type="text"
                                placeholder="Search student textbooks, calculators, lab devices, notes..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full min-w-0 px-3.5 text-xs sm:text-sm text-gray-900 bg-transparent focus:outline-none border-none h-full m-0"
                            />
                            <button
                                type="submit"
                                className="bg-[#FEBD69] hover:bg-[#f3a847] text-gray-900 w-10 sm:w-11 h-full flex items-center justify-center shrink-0 transition cursor-pointer border-none m-0 p-0"
                                title="Search Marketplace"
                            >
                                <svg className="w-4 h-4 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </button>
                        </form>
                    </div>

                    {/* Right: Profile Shortcut */}
                    <div className="flex items-center gap-3 shrink-0">
                        <Link
                            to="/dashboard/profile"
                            className="text-right text-gray-200 hover:text-white hover:underline transition hidden sm:block text-xs font-semibold"
                            title="View Profile"
                        >
                            {storedUser.name || "Student"}
                        </Link>
                    </div>
                </header>

                {/* Main Content Body */}
                <main className="flex-1 p-3 sm:p-5 lg:p-6 bg-[#EAEDED]">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default DashboardLayout;
