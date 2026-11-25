import { NavLink } from "react-router-dom";

function Sidebar({ onLogout, user, isOpen, onClose }) {
    const navItems = [
        {
            to: "/dashboard/products",
            label: "Explore Marketplace",
            icon: (
                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
            )
        },
        {
            to: "/dashboard/add-product",
            label: "Sell / Add Products",
            icon: (
                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            )
        }
    ];

    const storedUser = user || (() => {
        try {
            return JSON.parse(localStorage.getItem("user") || "{}");
        } catch {
            return {};
        }
    })();

    const initial = (storedUser.name ? storedUser.name.charAt(0) : "U").toUpperCase();

    const handleNavClick = () => {
        if (onClose) onClose();
    };

    return (
        <>
            {/* Mobile Backdrop Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-xs transition-opacity"
                    onClick={onClose}
                    aria-label="Close sidebar overlay"
                />
            )}

            {/* Responsive Sidebar Drawer */}
            <aside
                className={`w-64 h-full bg-[#131921] text-white border-r border-[#232F3E] flex flex-col justify-between shrink-0 shadow-2xl z-50 select-none
                fixed inset-y-0 left-0 transition-transform duration-200 ease-in-out md:static md:translate-x-0 ${
                    isOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                {/* Top Brand Header */}
                <div>
                    <div className="p-4 sm:p-5 border-b border-[#232F3E]">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded bg-[#FF9900] text-gray-950 flex items-center justify-center shadow-sm shrink-0">
                                    <svg className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-gray-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                    </svg>
                                </div>
                                <div>
                                    <h1 className="font-extrabold text-base sm:text-lg leading-tight tracking-tight text-white">
                                        StudentMart
                                    </h1>
                                    <p className="text-[11px] text-gray-400">Campus Marketplace</p>
                                </div>
                            </div>

                            {/* Mobile Close Button */}
                            <button
                                type="button"
                                onClick={onClose}
                                className="md:hidden text-gray-400 hover:text-white p-1 rounded hover:bg-white/10"
                                aria-label="Close menu"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Navigation Links */}
                    <nav className="py-3 sm:py-4 space-y-1">
                        <p className="px-5 pb-2 text-[11px] font-bold tracking-wider uppercase text-gray-400">
                            Shop & Manage
                        </p>
                        {navItems.map((item) => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                onClick={handleNavClick}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 py-2.5 text-sm transition-all duration-150 ${
                                        isActive
                                            ? "bg-[#232F3E] text-white border-l-4 border-[#FF9900] font-semibold pl-4 pr-5"
                                            : "text-gray-300 hover:text-white hover:bg-[#232F3E]/60 pl-5 pr-5"
                                    }`
                                }
                            >
                                {item.icon}
                                <span>{item.label}</span>
                            </NavLink>
                        ))}
                    </nav>
                </div>

                {/* Bottom Account Profile Navigation & Logout Footer */}
                <div className="p-3 sm:p-4 border-t border-[#232F3E] bg-[#131921]">
                    {/* Account Button Navigating to Profile */}
                    <NavLink
                        to="/dashboard/profile"
                        onClick={handleNavClick}
                        className={({ isActive }) =>
                            `flex items-center gap-3 mb-3 p-2.5 rounded transition-all duration-150 border ${
                                isActive
                                    ? "bg-[#232F3E] text-white border-[#FF9900] shadow-xs"
                                    : "bg-[#232F3E]/80 text-gray-200 border-gray-700/60 hover:bg-[#232F3E] hover:border-gray-500 hover:text-white"
                            }`
                        }
                        title="View and edit profile"
                    >
                        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#FF9900] text-gray-950 font-bold flex items-center justify-center text-xs sm:text-sm shadow-xs shrink-0">
                            {initial}
                        </div>
                        <div className="overflow-hidden flex-1">
                            <p className="text-xs sm:text-sm font-semibold text-white truncate">
                                {storedUser.name || "Student"}
                            </p>
                        </div>
                        <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </NavLink>

                    {/* Sign Out Button */}
                    <button
                        type="button"
                        onClick={onLogout}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded bg-[#232F3E] text-gray-200 hover:bg-rose-900/60 hover:text-white border border-gray-700 hover:border-rose-700 transition duration-150 text-xs font-semibold cursor-pointer"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>
        </>
    );
}

export default Sidebar;
