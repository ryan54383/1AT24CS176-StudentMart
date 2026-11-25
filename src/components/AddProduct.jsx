import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AddProduct() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        category: "Textbooks",
        price: "",
        stock: "1",
        description: "",
        imageUrl: ""
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const categories = [
        "Textbooks",
        "Electronics & Gadgets",
        "Lab Equipment & Calculators",
        "Stationery & Notes",
        "Hostel Essentials",
        "Other"
    ];

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        if (!form.name.trim()) {
            setError("Product title is required");
            return;
        }

        if (!form.price || isNaN(form.price) || Number(form.price) < 0) {
            setError("Please enter a valid price");
            return;
        }

        setLoading(true);

        try {
            let currentUser = {};
            try {
                currentUser = JSON.parse(localStorage.getItem("user") || "{}");
            } catch {}

            const newProduct = {
                _id: `mock-prod-${Date.now()}`,
                name: form.name.trim(),
                category: form.category || "Textbooks",
                price: Number(form.price),
                stock: Number(form.stock) || 1,
                description: form.description.trim(),
                imageUrl: form.imageUrl.trim(),
                seller: {
                    name: currentUser.name || "Ryan Michael",
                    department: currentUser.department || "Computer Science",
                    email: currentUser.email || "ryan@studentmart.edu"
                },
                createdAt: new Date().toISOString()
            };

            const STORAGE_KEY = "studentmart_mock_products";
            let existing = [];
            try {
                const stored = localStorage.getItem(STORAGE_KEY);
                existing = stored ? JSON.parse(stored) : [];
            } catch {
                existing = [];
            }

            const updatedList = [newProduct, ...existing];
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));

            setMessage("Product listing published successfully to StudentMart!");
            setForm({
                name: "",
                category: "Textbooks",
                price: "",
                stock: "1",
                description: "",
                imageUrl: ""
            });
        } catch (err) {
            setError(err.message || "Unable to save product");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-4 sm:space-y-5">
            {message && (
                <div className="p-3 sm:p-3.5 rounded bg-[#F0FFF4] border border-[#007600] text-[#007600] text-xs sm:text-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 shadow-xs">
                    <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-[#007600] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="font-semibold">{message}</span>
                    </div>
                    <button
                        onClick={() => navigate("/dashboard/products")}
                        className="text-xs font-bold text-blue-700 hover:underline transition self-end sm:self-center"
                    >
                        View in Marketplace &rarr;
                    </button>
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

            {/* Amazon Content Card: Responsive Padding & Typography */}
            <div className="bg-white border border-gray-300 shadow-sm rounded-none sm:rounded p-4 sm:p-6 lg:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-5 pb-3 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded bg-[#FF9900]/20 text-[#cc7a00] flex items-center justify-center font-bold shrink-0">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-base sm:text-lg font-bold text-gray-900 leading-tight">Create a Product Listing</h2>
                            <p className="text-xs text-gray-500">List an item for sale or exchange with fellow campus students.</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-gray-800 mb-1">
                                Product Title *
                            </label>
                            <input
                                name="name"
                                placeholder="e.g. Engineering Mathematics Volume 2 (Erwin Kreyszig)"
                                value={form.name}
                                onChange={handleChange}
                                className="w-full px-3 py-1.5 sm:py-2 rounded border border-gray-400 focus:border-[#e77600] focus:ring-1 focus:ring-[#e77600] outline-none text-xs sm:text-sm transition"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-800 mb-1">
                                Category *
                            </label>
                            <select
                                name="category"
                                value={form.category}
                                onChange={handleChange}
                                className="w-full px-3 py-1.5 sm:py-2 rounded border border-gray-400 focus:border-[#e77600] focus:ring-1 focus:ring-[#e77600] outline-none text-xs sm:text-sm transition bg-white"
                            >
                                {categories.map((c) => (
                                    <option key={c} value={c}>
                                        {c}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-800 mb-1">
                                Price (₹ INR) *
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1.5 sm:top-2 text-gray-500 text-sm font-semibold">₹</span>
                                <input
                                    type="number"
                                    min="0"
                                    step="1"
                                    name="price"
                                    placeholder="250"
                                    value={form.price}
                                    onChange={handleChange}
                                    className="w-full pl-7 pr-3 py-1.5 sm:py-2 rounded border border-gray-400 focus:border-[#e77600] focus:ring-1 focus:ring-[#e77600] outline-none text-xs sm:text-sm transition"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-800 mb-1">
                                Available Quantity
                            </label>
                            <input
                                type="number"
                                min="1"
                                name="stock"
                                value={form.stock}
                                onChange={handleChange}
                                className="w-full px-3 py-1.5 sm:py-2 rounded border border-gray-400 focus:border-[#e77600] focus:ring-1 focus:ring-[#e77600] outline-none text-xs sm:text-sm transition"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-800 mb-1">
                                Image URL (Optional)
                            </label>
                            <input
                                type="url"
                                placeholder="https://images.unsplash.com/photo-..."
                                value={form.imageUrl}
                                onChange={handleChange}
                                className="w-full px-3 py-1.5 sm:py-2 rounded border border-gray-400 focus:border-[#e77600] focus:ring-1 focus:ring-[#e77600] outline-none text-xs sm:text-sm transition"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-gray-800 mb-1">
                                Description & Condition Notes
                            </label>
                            <textarea
                                rows={4}
                                name="description"
                                placeholder="Describe condition (e.g. pristine condition, textbook unmarked, includes original charging cable, price negotiable)..."
                                value={form.description}
                                onChange={handleChange}
                                className="w-full px-3 py-1.5 sm:py-2 rounded border border-gray-400 focus:border-[#e77600] focus:ring-1 focus:ring-[#e77600] outline-none text-xs sm:text-sm transition"
                            />
                        </div>
                    </div>

                    {/* Responsive Action Buttons (Full width on mobile) */}
                    <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 pt-3 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={() => navigate("/dashboard/products")}
                            className="w-full sm:w-auto bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300 px-4 py-2 rounded text-xs sm:text-sm font-medium transition cursor-pointer text-center"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full sm:w-auto bg-[#FF9900] hover:bg-[#fa9000] text-gray-950 font-medium shadow-sm border border-[#cc7a00] px-6 py-2 rounded text-xs sm:text-sm disabled:bg-gray-300 disabled:border-gray-300 transition cursor-pointer text-center"
                        >
                            {loading ? "Publishing..." : "Add Product Listing"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddProduct;
