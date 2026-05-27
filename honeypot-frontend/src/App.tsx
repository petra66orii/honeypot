import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Toaster } from "react-hot-toast";

// --- EAGER LOAD (Critical pages needed immediately) ---
import Home from "./pages/Home";

// --- LAZY LOAD (Heavy pages loaded only when clicked) ---
const ProductGrid = lazy(() => import("./components/ProductGrid"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const PasswordResetConfirm = lazy(() => import("./pages/PasswordResetConfirm"));
const VerifyEmail = lazy(() => import("./pages/VerifyEmail"));
const Profile = lazy(() => import("./pages/Profile"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const ShoppingBag = lazy(() => import("./pages/ShoppingBag"));
const Checkout = lazy(() => import("./pages/Checkout"));
const CheckoutSuccess = lazy(() => import("./pages/CheckoutSuccess"));
const BlogList = lazy(() => import("./pages/BlogList"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const GiftsDeals = lazy(() => import("./pages/GiftsDeals"));
const Contact = lazy(() => import("./pages/Contact"));
const About = lazy(() => import("./pages/About"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Forbidden = lazy(() => import("./pages/Forbidden"));
const ServerError = lazy(() => import("./pages/ServerError"));
const ProtectedRoute = lazy(() => import("./components/ProtectedRoute"));

// Admin - DEFINITELY Lazy Load this
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const AdminProducts = lazy(() => import("./pages/admin/AdminProducts"));
const AdminProductForm = lazy(() => import("./pages/admin/AdminProductForm"));
const AdminOrders = lazy(() => import("./pages/admin/AdminOrders"));
const AdminUsers = lazy(() => import("./pages/admin/AdminUsers"));
const AdminContent = lazy(() => import("./pages/admin/AdminContent"));

// A simple loading spinner for the transitions
const PageLoader = () => (
  <div className="flex justify-center items-center min-h-[50vh]">
    <div className="w-12 h-12 border-4 border-honey-gold border-t-transparent rounded-full animate-spin"></div>
  </div>
);

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: "#FFF7ED",
            color: "#7C2D12",
            border: "1px solid #FDE68A",
            borderRadius: "14px",
            boxShadow: "0 10px 30px rgba(120, 53, 15, 0.12)",
          },
          success: {
            style: {
              background: "#ECFDF5",
              color: "#065F46",
              border: "1px solid #A7F3D0",
            },
          },
          error: {
            style: {
              background: "#FEF2F2",
              color: "#991B1B",
              border: "1px solid #FECACA",
            },
          },
        }}
      />
      <div className="bg-gray-50 min-h-screen font-sans text-gray-900">
        <Navbar />

        {/* Wrap Routes in Suspense to handle the lazy loading state */}
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Standard Routes (Instant Load) */}
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<ProductGrid />} />
            <Route path="/login" element={<Login />} />

            {/* Lazy Routes */}
            <Route path="/register" element={<Register />} />
            <Route path="/password-reset" element={<ForgotPassword />} />
            <Route
              path="/password-reset/confirm/:uid/:token"
              element={<PasswordResetConfirm />}
            />
            <Route path="/verify-email/:key" element={<VerifyEmail />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/gifts" element={<GiftsDeals />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/bag" element={<ShoppingBag />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/checkout/success" element={<CheckoutSuccess />} />
            <Route path="/blog" element={<BlogList />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/forbidden" element={<Forbidden />} />
            <Route path="/server-error" element={<ServerError />} />

            {/* Admin Routes */}
            <Route element={<ProtectedRoute adminOnly={true} />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="products/new" element={<AdminProductForm />} />
                <Route
                  path="products/edit/:id"
                  element={<AdminProductForm />}
                />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="content" element={<AdminContent />} />
              </Route>
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>

        <Footer />
      </div>
    </>
  );
}

export default App;
