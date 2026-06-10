
import React, { useState, useEffect } from "react";
import {
  ShoppingCart,
  Menu,
  X,
  Heart,
  Home,
  User,
  Share2,
  ShoppingBag,
  CreditCard,
  LayoutGrid,
  ChevronDown,
} from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import LoginModal from "./LoginModal";
import SignupModal from "./SignupModal";

import {useUser,useClerk,useAuth} from "@clerk/clerk-react";
import axios from "axios";
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [topTextIndex, setTopTextIndex] = useState(0);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { cart, wishlist } = useCart();
  const { isSignedIn, user,isLoaded } = useUser();
  const {signOut}=useClerk();
  const colors = {
    studioWhite: "#FDFDFD",
    midnight: "#111111",
    slate: "#666666",
    divider: "#EEEEEE",
  };
   
  const topBarMessages = [
    { text: "Premium Studio Quality Gear", link: "Learn More" },
    { text: "Limited Edition Drop 2026", link: "Shop Now" },
    { text: "Complimentary Shipping over ₹2499", link: "Details" },
  ];

  const navLinks = [
    { name: "Home", type: "link", icon: <Home size={14} />, path: "/" },
    {
      name: "About Us",
      type: "link",
      icon: <User size={14} />,
      path: "/about",
    },
    {
      name: "Refer & Earn",
      type: "link",
      icon: <Share2 size={14} />,
      path: "/refer",
    },
    {
      name: "Product",
      type: "mega",
      icon: <ShoppingBag size={14} />,
      categories: [
        {
          title: "Top Wear",
          items: [
            "Oversized T-Shirts",
            "Premium Cotton Shirts",
            "Graphic Tees",
            "Hoodies & Jackets",
          ],
        },
        {
          title: "Bottom Wear",
          items: ["Baggy Jeans", "Cargo Pants"],
        },
        {
          title: "Trending",
          items: [
            "Streetwear Essentials",
            "Best Sellers",
            "New Drops",
          ],
        },
      ],
    },
    {
      name: "Cart",
      type: "link",
      icon: <ShoppingCart size={14} />,
      path: "/cart",
    },
    {
      name: "Checkout",
      type: "link",
      icon: <CreditCard size={14} />,
      path: "/checkout",
    },
    {
      name: "Wishlist",
      type: "link",
      icon: <Heart size={14} />,
      path: "/wishlist",
    },
    {
      name: "Contact",
      type: "link",
      icon: <LayoutGrid size={14} />,
      path: "/contact",
    },
    {
      name:"Orders",
      type:"link",
      icon:<LayoutGrid size={14}/>,
      path:"/orders"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setTopTextIndex((prev) => (prev + 1) % 3);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);

    return () =>
      window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* HEADER */}
      <header
        className={`fixed top-0 left-0 right-0 z-[70] flex items-center justify-between lg:justify-start px-4 md:px-6 transition-all duration-500 ${
          scrolled
            ? "h-14 backdrop-blur-2xl bg-white/85 shadow-lg shadow-black/5"
            : "h-16 bg-[#FDFDFD]"
        }`}
        style={{
          borderBottom: `1px solid ${colors.divider}`,
        }}
      >
        {/* LOGO */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-auto lg:w-[220px]"
        >
          <Link
            to="/"
            style={{ color: colors.midnight }}
            className="text-lg md:text-xl font-black tracking-tighter uppercase italic transition-all duration-500 hover:tracking-normal hover:scale-105 hover:opacity-80"
          >
            Sattiyas
            <span className="text-red-500 animate-pulse">.</span>
          </Link>
        </motion.div>

        {/* TOP TEXT */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="hidden sm:flex flex-1 items-center justify-center px-4"
        >
          <AnimatePresence mode="wait">
            <motion.p
              key={topTextIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              style={{ color: colors.slate }}
              className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-center truncate"
            >
              {topBarMessages[topTextIndex].text}
            </motion.p>
          </AnimatePresence>
        </motion.div>

        {/* RIGHT */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3 md:gap-5"
        >
          {/* LOGIN */}
         <div className="hidden lg:flex items-center gap-4 border-r border-black/5 pr-4">

          <div className="hidden lg:flex items-center gap-4 border-r border-black/5 pr-4">

          {
          isLoaded && isSignedIn && user ? (

          <>
          <span className="text-[10px] font-black uppercase">
          {
          user?.fullName ||
          user?.firstName ||
          user?.emailAddresses?.[0]?.emailAddress
          }
          </span>

          <motion.button
          onClick={async () => {
          try {
            // 1. Logout from your backend
            await axios.post(
              "https://sattiyash-backend.onrender.com/logout",
              {},
              { withCredentials: true }
            );

            // 2. Logout from Clerk (VERY IMPORTANT)
            await signOut();

            // 3. Clear local storage
            localStorage.clear();
            sessionStorage.clear();

            // 4. Redirect
            window.location.replace("/");
          } catch (err) {
            console.log("Logout failed:", err);
          }
        }}
  className="bg-red-500 text-white px-5 py-1.5 rounded-full text-[10px] font-black uppercase"
>
  Logout
</motion.button>

          </>

          ) : (

          <>

          <motion.button
          onClick={() => setIsLoginOpen(true)}
          className="text-[10px] font-black uppercase"
          >
          Login
          </motion.button>

          <motion.button
          onClick={() => setIsSignupOpen(true)}
          className="bg-black text-white px-5 py-1.5 rounded-full text-[10px] font-black uppercase"
          >
          Sign Up
          </motion.button>

          </>

          )

        }

          </div>

          </div>

          {/* WISHLIST */}
          <motion.div
            whileHover={{
              scale: 1.12,
              y: -2,
            }}
            whileTap={{ scale: 0.9 }}
          >
            <Link to="/wishlist" className="relative">
              <Heart
                size={18}
                style={{ color: colors.midnight }}
              />

              {wishlist.length > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 text-white text-[8px] font-black w-4 h-4 flex items-center justify-center rounded-full bg-black"
                >
                  {wishlist.length}
                </motion.span>
              )}
            </Link>
          </motion.div>

          {/* CART */}
          <motion.div
            whileHover={{
              scale: 1.12,
              y: -2,
            }}
            whileTap={{ scale: 0.9 }}
          >
            <Link to="/cart" className="relative">
              <ShoppingCart
                size={18}
                style={{ color: colors.midnight }}
              />

              {cart.length > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 text-white text-[8px] font-black w-4 h-4 flex items-center justify-center rounded-full bg-black"
                >
                  {cart.length}
                </motion.span>
              )}
            </Link>
          </motion.div>

          {/* MOBILE MENU */}
          <motion.button
            onClick={() => setIsOpen(true)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="lg:hidden p-1"
          >
            <Menu size={24} />
          </motion.button>
        </motion.div>
      </header>

      {/* SIDEBAR */}
      <motion.aside
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        style={{
          backgroundColor: colors.studioWhite,
          borderRight: `1px solid ${colors.divider}`,
        }}
        className={`hidden lg:flex fixed left-0 ${
          scrolled ? "top-14" : "top-16"
        } bottom-0 w-[220px] flex-col z-[60] overflow-y-auto transition-all duration-500`}
      >
        <nav className="flex-1 py-8 px-4 space-y-1">
          {navLinks.map((link, index) => (
            <motion.div
              key={link.name}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onMouseEnter={() =>
                link.type === "mega" &&
                setActiveDropdown(link.name)
              }
              onMouseLeave={() =>
                setActiveDropdown(null)
              }
            >
              {link.type === "link" ? (
                <Link
                  to={link.path}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 hover:bg-black hover:text-white hover:translate-x-1 hover:shadow-lg hover:shadow-black/20 group relative overflow-hidden"
                >
                  <span className="relative z-10">
                    {link.icon}
                  </span>

                  <span className="relative z-10">
                    {link.name}
                  </span>

                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-r from-white/10 via-white/5 to-transparent" />
                </Link>
              ) : (
                <motion.button
                  whileHover={{
                    backgroundColor: "#111111",
                    color: "#ffffff",
                  }}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                >
                  <div className="flex items-center gap-3">
                    {link.icon}
                    {link.name}
                  </div>

                  <motion.div
                    animate={{
                      rotate:
                        activeDropdown === link.name
                          ? 180
                          : 0,
                    }}
                  >
                    <ChevronDown size={12} />
                  </motion.div>
                </motion.button>
              )}
            </motion.div>
          ))}
        </nav>
      </motion.aside>

      {/* MEGA MENU */}
      <AnimatePresence>
        {activeDropdown === "Product" && (
          <motion.div
            onMouseEnter={() =>
              setActiveDropdown("Product")
            }
            onMouseLeave={() =>
              setActiveDropdown(null)
            }
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.25 }}
            className="hidden lg:grid fixed left-[220px] top-16 p-8 grid-cols-5 gap-6 z-[100] w-[calc(100%-250px)] max-w-[1100px] rounded-br-[2rem] shadow-2xl bg-white border-l-4 border-black"
          >
            <div className="flex flex-col justify-center border-r border-black/5 pr-4 text-center">
              <h4 className="text-[10px] font-black mb-4 uppercase italic">
                Studio Collection
              </h4>

              <Link
                to="/products"
                onClick={() =>
                  setActiveDropdown(null)
                }
                className="bg-black text-white text-[9px] font-black uppercase tracking-widest p-4 rounded-full hover:scale-105 transition-transform"
              >
                View All Collection
              </Link>
            </div>

            {navLinks
              .find((l) => l.name === "Product")
              .categories.map((cat) => (
                <div key={cat.title}>
                  <h4 className="text-[10px] font-black mb-4 uppercase pb-2 border-b border-black/5">
                    {cat.title}
                  </h4>

                  <ul className="space-y-2.5">
                    {cat.items.map((item) => (
                      <li key={item}>
                        <Link
                          to={`/products?category=${item}`}
                          onClick={() =>
                            setActiveDropdown(null)
                          }
                          className="text-[9px] text-gray-500 hover:text-black uppercase font-bold flex items-center gap-2 group transition-colors"
                        >
                          <span className="w-0 group-hover:w-3 h-[1px] bg-black transition-all" />
                          {item}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{
              duration: 0.45,
              ease: "easeInOut",
            }}
            className="fixed inset-0 z-[100] lg:hidden flex flex-col bg-white"
          >
            <div className="flex justify-between items-center px-6 h-16 border-b border-black/5">
              <span className="text-xl font-black uppercase italic">
                Sattiyas.
              </span>

              <button
                onClick={() => setIsOpen(false)}
                className="p-2 bg-black/5 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 flex flex-col items-center justify-center text-center">
              <div className="space-y-2 w-full max-w-sm">
                {navLinks.map((l) => (
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    key={l.name}
                  >
                    <Link
                      to={
                        l.type === "link"
                          ? l.path
                          : "/products"
                      }
                      onClick={() => setIsOpen(false)}
                      className="w-full py-5 text-lg font-black uppercase italic flex items-center justify-center gap-4 hover:bg-black/5 px-2 transition-all rounded-xl"
                    >
                      {l.icon}
                      {l.name}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODALS */}
      <AnimatePresence>
        {isLoginOpen && (
          <LoginModal
            key="login-modal"
            isOpen={isLoginOpen}
            onClose={() => setIsLoginOpen(false)}
            onSwitch={() => {
              setIsLoginOpen(false);
              setIsSignupOpen(true);
            }}
          />
        )}

        {isSignupOpen && (
          <SignupModal
            key="signup-modal"
            isOpen={isSignupOpen}
            onClose={() => setIsSignupOpen(false)}
            onSwitch={() => {
              setIsSignupOpen(false);
              setIsLoginOpen(true);
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;