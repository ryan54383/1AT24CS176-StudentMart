import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

const STORAGE_KEY = "studentmart_mock_products";

function ViewProducts() {
    const [searchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");

    // Modal state for view & edit
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        name: "",
        category: "",
        price: "",
        stock: "",
        description: "",
        imageUrl: ""
    });

    const [statusMessage, setStatusMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const initialMockProducts = [
        {
            _id: "demo-1",
            name: "Operating System Concepts (Silberschatz - 10th Ed)",
            category: "Textbooks",
            price: 450,
            stock: 1,
            description: "Pristine condition, used for 4th sem CSE. No pencil marks. Great for university exams.",
            imageUrl: "",
            seller: { name: "Ryan Michael", department: "Computer Science", email: "ryan@studentmart.edu" },
            createdAt: new Date().toISOString()
        },
        {
            _id: "demo-2",
            name: "Casio fx-991EX Scientific Calculator",
            category: "Lab Equipment & Calculators",
            price: 800,
            stock: 2,
            description: "ClassWiz natural textbook display scientific calculator. Working with protective cover and dual solar power.",
            imageUrl: "",
            seller: { name: "Sneha Rao", department: "Electronics & Comm", email: "sneha@studentmart.edu" },
            createdAt: new Date().toISOString()
        },
        {
            _id: "demo-3",
            name: "Arduino Uno R3 Starter Kit with Sensors",
            category: "Electronics & Gadgets",
            price: 950,
            stock: 1,
            description: "Includes jumper wires, 830-point breadboard, ultrasonic sensor, servo motor, and USB interface cable.",
            imageUrl: "",
            seller: { name: "Arjun Verma", department: "Information Science", email: "arjun@studentmart.edu" },
            createdAt: new Date().toISOString()
        }
    ];

    // Load products from local mock storage
    const loadProducts = () => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    setProducts(parsed);
                    setLoading(false);
                    return;
                }
            }
            localStorage.setItem(STORAGE_KEY, JSON.stringify(initialMockProducts));
            setProducts(initialMockProducts);
        } catch {
            setProducts(initialMockProducts);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProducts();
    }, []);

    useEffect(() => {
        const query = searchParams.get("search");
        if (query) {
            setSearch(query);
        }
    }, [searchParams]);

    const categories = [
        "All",
        "Textbooks",
        "Electronics & Gadgets",
        "Lab Equipment & Calculators",
        "Stationery & Notes",
        "Hostel Essentials",
        "Other"
    ];

    const filtered = products.filter((p) => {
        const matchesCat = category === "All" || p.category === category;
        const matchesSearch =
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            (p.description && p.description.toLowerCase().includes(search.toLowerCase()));
        return matchesCat && matchesSearch;
    });

    // Open detail modal
    const handleCardClick = (product) => {
        setSelectedProduct(product);
        setIsEditing(false);
        setEditForm({
            name: product.name,
            category: product.category || "Textbooks",
            price: product.price,
            stock: product.stock !== undefined ? product.stock : 1,
            description: product.description || "",
            imageUrl: product.imageUrl || ""
        });
        setStatusMessage("");
        setErrorMessage("");
    };

    // Close modal
    const closeModal = () => {
        setSelectedProduct(null);
        setIsEditing(false);
        setErrorMessage("");
    };

    // Start editing
    const handleStartEdit = (e) => {
        if (e) e.stopPropagation();
        setIsEditing(true);
        setStatusMessage("");
        setErrorMessage("");
    };

    // Save Edited Product locally without endpoint
    const handleSaveEdit = (e) => {
        e.preventDefault();
        setErrorMessage("");

        if (!editForm.name.trim()) {
            setErrorMessage("Product name is required");
            return;
        }

        if (editForm.price === "" || isNaN(editForm.price) || Number(editForm.price) < 0) {
            setErrorMessage("Please enter a valid price");
            return;
        }

        const updated = {
            ...selectedProduct,
            name: editForm.name.trim(),
            category: editForm.category,
            price: Number(editForm.price),
            stock: Number(editForm.stock) || 1,
            description: editForm.description.trim(),
            imageUrl: editForm.imageUrl.trim()
        };

        const updatedList = products.map((p) => (p._id === selectedProduct._id ? updated : p));
        setProducts(updatedList);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));

        setSelectedProduct(updated);
        setIsEditing(false);
        setStatusMessage(`"${updated.name}" updated successfully!`);
    };

    // Remove Product locally without endpoint
    const handleDelete = (productId, e) => {
        if (e) e.stopPropagation();

        const confirmDelete = window.confirm("Are you sure you want to remove this product listing?");
        if (!confirmDelete) return;

        const remaining = products.filter((p) => p._id !== productId);
        setProducts(remaining);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(remaining));

        closeModal();
        setStatusMessage("Product listing removed successfully!");
    };

    // Reset to demo defaults
    const handleResetDemoData = () => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialMockProducts));
        setProducts(initialMockProducts);
        closeModal();
        setStatusMessage("Reset to sample student products.");
    };

    return (
        <div className="space-y-4 max-w-7xl mx-auto">
            {/* Global Status Message */}
            {statusMessage && (
                <div className="p-3 rounded bg-[#F0FFF4] border border-[#007600] text-[#007600] text-xs sm:text-sm flex items-center justify-between shadow-xs">
                    <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-[#007600] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="font-semibold">{statusMessage}</span>
                    </div>
                    <button onClick={() => setStatusMessage("")} className="text-[#007600] font-bold hover:text-black p-1">✕</button>
                </div>
            )}

            {/* Top Toolbar: Search & Action Buttons (Responsive Flex) */}
            <div className="bg-white p-3 sm:p-4 border border-gray-300 shadow-sm rounded-none sm:rounded flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                <div className="relative w-full sm:w-80">
                    <svg className="w-4 h-4 text-gray-500 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Filter marketplace items..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-9 pr-3 py-1.5 rounded border border-gray-400 focus:border-[#e77600] focus:ring-1 focus:ring-[#e77600] outline-none text-xs sm:text-sm transition"
                    />
                </div>

                <div className="flex items-center gap-2 sm:gap-2.5 w-full sm:w-auto justify-between sm:justify-end flex-wrap">
                    <button
                        onClick={handleResetDemoData}
                        className="flex-1 sm:flex-initial text-center px-3 py-1.5 rounded border border-gray-300 hover:bg-gray-100 text-gray-700 text-xs font-medium transition"
                        title="Reset to default mock listings"
                    >
                        Reset Demo Data
                    </button>
                    <Link
                        to="/dashboard/add-product"
                        className="flex-1 sm:flex-initial justify-center bg-[#FF9900] hover:bg-[#fa9000] text-gray-950 font-medium shadow-sm border border-[#cc7a00] px-3.5 sm:px-4 py-1.5 rounded text-xs sm:text-sm flex items-center gap-1.5 transition whitespace-nowrap"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        <span>Add Product</span>
                    </Link>
                </div>
            </div>

            {/* Category Filter Sub-Menu Bar (Horizontal scrolling on small screens) */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none items-center -mx-1 px-1">
                <span className="text-xs font-bold text-gray-700 mr-1 sm:mr-2 whitespace-nowrap shrink-0">Departments:</span>
                {categories.map((c) => (
                    <button
                        key={c}
                        onClick={() => setCategory(c)}
                        className={`px-2.5 sm:px-3 py-1 rounded text-xs font-medium whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                            category === c
                                ? "bg-[#232F3E] text-white font-bold shadow-xs"
                                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
                        }`}
                    >
                        {c}
                    </button>
                ))}
            </div>

            {/* Results count & Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-gray-600 px-1 gap-1">
                <span>1-{filtered.length} of {products.length} results for <span className="font-bold text-[#C7511F]">"{category}"</span></span>
                <span className="text-xs text-gray-500">Sorted by: <span className="font-semibold text-gray-800">Featured Student Picks</span></span>
            </div>

            {/* Product Cards Grid: Highly Responsive (1 col on mobile, 2 on tablet, 3 on desktop, 4 on xl) */}
            {loading ? (
                <div className="flex items-center justify-center py-24">
                    <div className="w-8 h-8 border-4 border-[#FF9900] border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : filtered.length === 0 ? (
                <div className="bg-white border border-gray-300 shadow-sm rounded-none sm:rounded p-8 sm:p-12 text-center">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mx-auto mb-3">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-gray-900">No matching student products found</h3>
                    <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1 mb-5">
                        Try adjusting your keywords, selecting a different department, or create a new student listing.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-3">
                        <button
                            onClick={handleResetDemoData}
                            className="px-4 py-2 bg-gray-100 text-gray-800 border border-gray-300 rounded text-xs font-medium hover:bg-gray-200 transition"
                        >
                            Reset Demo Listings
                        </button>
                        <Link
                            to="/dashboard/add-product"
                            className="bg-[#FF9900] hover:bg-[#fa9000] text-gray-950 font-medium shadow-sm border border-[#cc7a00] px-4 py-2 rounded text-xs transition text-center"
                        >
                            Add Product
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                    {filtered.map((item) => (
                        <div
                            key={item._id}
                            onClick={() => handleCardClick(item)}
                            className="group bg-white border border-gray-300 shadow-sm rounded-none sm:rounded hover:shadow-md transition cursor-pointer overflow-hidden flex flex-col justify-between p-3.5 sm:p-4"
                        >
                            <div>
                                {/* Product Image area */}
                                <div className="w-full h-40 sm:h-44 bg-[#EAEDED]/40 border border-gray-200 rounded flex items-center justify-center overflow-hidden mb-2.5">
                                    {item.imageUrl ? (
                                        <img
                                            src={item.imageUrl}
                                            alt={item.name}
                                            className="w-full h-full object-cover group-hover:scale-102 transition duration-200"
                                            onError={(e) => {
                                                e.target.style.display = "none";
                                            }}
                                        />
                                    ) : (
                                        <div className="text-center p-3">
                                            <svg className="w-10 h-10 text-gray-300 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <span className="text-[10px] text-gray-400 font-medium">Campus Marketplace</span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center justify-between gap-1.5 mb-1">
                                    <span className="text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 rounded bg-gray-100 text-gray-700 border border-gray-200 truncate">
                                        {item.category || "General"}
                                    </span>
                                </div>

                                <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2 mb-1 group-hover:text-[#C7511F] transition-colors">
                                    {item.name}
                                </h3>

                                {/* Amazon rating stars */}
                                <div className="flex items-center gap-1 mb-1.5">
                                    <span className="text-[#FFA41C] text-xs font-bold">★★★★☆</span>
                                    <span className="text-[11px] text-blue-700 hover:underline">4.8 (34)</span>
                                </div>

                                <p className="text-xs text-gray-500 line-clamp-2 mb-3">
                                    {item.description || "Student-listed item in good working condition."}
                                </p>
                            </div>

                            <div className="pt-2 border-t border-gray-100">
                                <div className="flex items-baseline gap-1 mb-0.5">
                                    <span className="text-xs font-semibold text-gray-900">₹</span>
                                    <span className="text-xl sm:text-2xl font-bold text-gray-950">
                                        {item.price}
                                    </span>
                                    <span className="text-[11px] text-gray-500 ml-1">M.R.P: <span className="line-through">₹{Math.round(item.price * 1.35)}</span></span>
                                </div>

                                <p className="text-[11px] text-gray-600 mb-2.5 flex items-center gap-1">
                                    <span className="font-semibold text-gray-800">FREE Campus Pickup</span>
                                </p>

                                <div className="flex items-center justify-between gap-2 pt-1">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleCardClick(item);
                                        }}
                                        className="bg-[#FF9900] hover:bg-[#fa9000] text-gray-950 font-medium shadow-sm border border-[#cc7a00] text-xs px-3 py-1.5 rounded transition flex-1 text-center"
                                    >
                                        View Details
                                    </button>

                                    <div className="flex items-center gap-1 shrink-0">
                                        <button
                                            onClick={(e) => {
                                                handleCardClick(item);
                                                handleStartEdit(e);
                                            }}
                                            className="p-1.5 rounded text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition"
                                            title="Edit Listing"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={(e) => handleDelete(item._id, e)}
                                            className="p-1.5 rounded text-gray-500 hover:text-red-700 hover:bg-red-50 transition"
                                            title="Delete Listing"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* PRODUCT DETAILS & EDIT MODAL DIALOG (Fully Responsive Overlay with Scrolling) */}
            {selectedProduct && (
                <div
                    className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto"
                    onClick={closeModal}
                >
                    <div
                        className="bg-white w-full max-w-lg lg:max-w-2xl border border-gray-300 shadow-2xl rounded-none sm:rounded overflow-hidden my-auto max-h-[92vh] flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="px-4 sm:px-5 py-3 border-b border-gray-800 flex items-center justify-between bg-[#131921] text-white shrink-0">
                            <span className="text-sm font-semibold text-gray-200 truncate">
                                Department: {selectedProduct.category}
                            </span>
                            <button
                                onClick={closeModal}
                                className="w-7 h-7 rounded flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/10 transition"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Modal Body with Scrollable Area */}
                        <div className="p-4 sm:p-6 overflow-y-auto">
                            {errorMessage && (
                                <div className="mb-4 p-3 rounded bg-[#FFF5F5] border border-[#C40000] text-[#C40000] text-xs font-semibold flex items-center gap-2">
                                    <svg className="w-4 h-4 shrink-0 text-[#C40000]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>{errorMessage}</span>
                                </div>
                            )}

                            {isEditing ? (
                                /* EDIT FORM */
                                <form onSubmit={handleSaveEdit} className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-800 mb-1">
                                            Product Name *
                                        </label>
                                        <input
                                            type="text"
                                            value={editForm.name}
                                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                            className="w-full px-3 py-1.5 rounded border border-gray-400 focus:border-[#e77600] focus:ring-1 focus:ring-[#e77600] outline-none text-xs sm:text-sm transition"
                                            required
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-800 mb-1">
                                                Department *
                                            </label>
                                            <select
                                                value={editForm.category}
                                                onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                                                className="w-full px-2.5 py-1.5 rounded border border-gray-400 focus:border-[#e77600] focus:ring-1 focus:ring-[#e77600] outline-none text-xs sm:text-sm transition bg-white"
                                            >
                                                {categories.filter((c) => c !== "All").map((c) => (
                                                    <option key={c} value={c}>{c}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-gray-800 mb-1">
                                                Price (₹ INR) *
                                            </label>
                                            <input
                                                type="number"
                                                min="0"
                                                value={editForm.price}
                                                onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                                                className="w-full px-3 py-1.5 rounded border border-gray-400 focus:border-[#e77600] focus:ring-1 focus:ring-[#e77600] outline-none text-xs sm:text-sm transition"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-gray-800 mb-1">
                                                Available Quantity
                                            </label>
                                            <input
                                                type="number"
                                                min="0"
                                                value={editForm.stock}
                                                onChange={(e) => setEditForm({ ...editForm, stock: e.target.value })}
                                                className="w-full px-3 py-1.5 rounded border border-gray-400 focus:border-[#e77600] focus:ring-1 focus:ring-[#e77600] outline-none text-xs sm:text-sm transition"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-800 mb-1">
                                            Image URL (Optional)
                                        </label>
                                        <input
                                            type="url"
                                            placeholder="https://images.unsplash.com/..."
                                            value={editForm.imageUrl}
                                            onChange={(e) => setEditForm({ ...editForm, imageUrl: e.target.value })}
                                            className="w-full px-3 py-1.5 rounded border border-gray-400 focus:border-[#e77600] focus:ring-1 focus:ring-[#e77600] outline-none text-xs sm:text-sm transition"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-800 mb-1">
                                            Description
                                        </label>
                                        <textarea
                                            rows={3}
                                            value={editForm.description}
                                            onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                            className="w-full px-3 py-1.5 rounded border border-gray-400 focus:border-[#e77600] focus:ring-1 focus:ring-[#e77600] outline-none text-xs sm:text-sm transition"
                                        />
                                    </div>

                                    <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 pt-3 border-t border-gray-200">
                                        <button
                                            type="button"
                                            onClick={() => setIsEditing(false)}
                                            className="px-4 py-2 rounded text-xs font-medium text-gray-800 bg-gray-100 hover:bg-gray-200 border border-gray-300 transition text-center"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="bg-[#FF9900] hover:bg-[#fa9000] text-gray-950 font-medium shadow-sm border border-[#cc7a00] px-5 py-2 rounded text-xs transition text-center"
                                        >
                                            Save Changes
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                /* VIEW DETAILS */
                                <div className="space-y-4">
                                    {selectedProduct.imageUrl && (
                                        <div className="w-full h-44 sm:h-52 rounded overflow-hidden bg-gray-100 border border-gray-300 mb-2">
                                            <img
                                                src={selectedProduct.imageUrl}
                                                alt={selectedProduct.name}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.style.display = "none";
                                                }}
                                            />
                                        </div>
                                    )}

                                    <div>
                                        <h2 className="text-base sm:text-lg font-bold text-gray-900 leading-snug mb-1">
                                            {selectedProduct.name}
                                        </h2>
                                        <div className="flex flex-wrap items-baseline gap-2 sm:gap-3">
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-xs text-gray-900 font-bold">₹</span>
                                                <span className="text-2xl font-black text-gray-950">
                                                    {selectedProduct.price}
                                                </span>
                                            </div>
                                            <span className="text-xs text-gray-600 bg-gray-100 border border-gray-200 px-2 py-0.5 rounded">
                                                In Stock: {selectedProduct.stock !== undefined ? selectedProduct.stock : 1} available
                                            </span>
                                            <span className="text-xs text-[#007600] font-semibold">FREE Campus Pickup</span>
                                        </div>
                                    </div>

                                    <div className="bg-[#EAEDED]/40 p-3 rounded border border-gray-200">
                                        <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                                            Product Details
                                        </h4>
                                        <p className="text-xs text-gray-800 leading-relaxed whitespace-pre-wrap">
                                            {selectedProduct.description || "No detailed description provided by the student."}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div className="p-3 rounded border border-gray-200 bg-white">
                                            <span className="text-[11px] text-gray-500 block">Sold By (Student Seller)</span>
                                            <span className="text-xs font-bold text-gray-900 block truncate">
                                                {selectedProduct.seller?.name || "Student Seller"}
                                            </span>
                                            <span className="text-[11px] text-gray-500 block truncate">
                                                {selectedProduct.seller?.department ? `${selectedProduct.seller.department} Dept` : "Campus Student"}
                                            </span>
                                        </div>

                                        <div className="p-3 rounded border border-gray-200 bg-white">
                                            <span className="text-[11px] text-gray-500 block">Contact Information</span>
                                            <span className="text-xs font-medium text-gray-800 block truncate">
                                                {selectedProduct.seller?.email || "student@mart.edu"}
                                            </span>
                                            <span className="text-[11px] text-blue-700 font-semibold block">
                                                Mutual Campus Verification
                                            </span>
                                        </div>
                                    </div>

                                    {/* Modal Actions (Responsive Stack on Mobile) */}
                                    <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-3 border-t border-gray-200">
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(selectedProduct._id)}
                                            className="text-xs font-semibold text-red-700 hover:text-red-900 border border-red-200 hover:bg-red-50 px-3 py-2 rounded transition text-center"
                                        >
                                            Remove Listing
                                        </button>

                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={handleStartEdit}
                                                className="flex-1 sm:flex-initial px-3 py-2 rounded text-xs font-medium text-gray-800 bg-gray-100 hover:bg-gray-200 border border-gray-300 transition text-center"
                                            >
                                                Edit Listing
                                            </button>
                                            <button
                                                type="button"
                                                onClick={closeModal}
                                                className="flex-1 sm:flex-initial bg-[#FF9900] hover:bg-[#fa9000] text-gray-950 font-medium shadow-sm border border-[#cc7a00] px-4 py-2 rounded text-xs transition text-center"
                                            >
                                                Done
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ViewProducts;
