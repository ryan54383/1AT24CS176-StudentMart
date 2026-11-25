import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import DashboardLayout from "./components/DashboardLayout";
import Profile from "./components/Profile";
import AddProduct from "./components/AddProduct";
import ViewProducts from "./components/ViewProducts";
import "./App.css";

function ProtectedRoute({ children }) {
    const token = localStorage.getItem("token");
    if (!token) {
        return <Navigate to="/login" replace />;
    }
    return children;
}

function PublicRoute({ children }) {
    const token = localStorage.getItem("token");
    if (token) {
        return <Navigate to="/dashboard/products" replace />;
    }
    return children;
}

function App() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <div className="h-screen w-screen overflow-hidden flex bg-[#EAEDED]">
            <Routes>
                {/* Public Authentication Routes */}
                <Route
                    path="/login"
                    element={
                        <PublicRoute>
                            <Login />
                        </PublicRoute>
                    }
                />
                <Route
                    path="/register"
                    element={
                        <PublicRoute>
                            <Register />
                        </PublicRoute>
                    }
                />

                {/* Authenticated Full-Screen Dashboard Routes */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <DashboardLayout onLogout={handleLogout} />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<Navigate to="products" replace />} />
                    <Route path="profile" element={<Profile onLogout={handleLogout} />} />
                    <Route path="add-product" element={<AddProduct />} />
                    <Route path="products" element={<ViewProducts />} />
                </Route>

                {/* Default Fallback Redirect */}
                <Route path="/" element={<Navigate to="/dashboard/products" replace />} />
                <Route path="*" element={<Navigate to="/dashboard/products" replace />} />
            </Routes>
        </div>
    );
}

export default App;
