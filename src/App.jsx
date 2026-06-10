import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./components/AuthContext";
import { CartProvider } from "./context/CartContext"; 
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
import WishlistPage from "./pages/WishlistPage";
import ProductDetails from "./pages/ProductDetails";
import ContactPage from "./pages/ContactPage";
import CheckoutPage from "./pages/CheckoutPage";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import ScrollToTopButton from "./components/ScrollToTopButton";
import ReferPage from "./pages/ReferPage";
import OrdersPage from "./pages/order.jsx"
import { useUser,useClerk } from "@clerk/clerk-react";
import { useEffect } from "react";

function SessionCheck(){

const {isSignedIn}=useUser();
const {signOut}=useClerk();

useEffect(()=>{

if(!isSignedIn){

localStorage.clear();

sessionStorage.clear();

}

},[isSignedIn]);

return null;
}
function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <ScrollToTop /> 
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/products" element={<ProductPage />} />
            <Route path="/products/category/:category" element={<ProductPage />}/>
            <Route path="/cart" element={<CartPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/products/:id" element={<ProductDetails />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/refer" element={<ReferPage />} />
            <Route path="/orders" element={<OrdersPage />} />
          </Routes>
          <Footer />
          <ScrollToTopButton /> 
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;