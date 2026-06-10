import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";
import {
  ShoppingBag,
  Heart,
  ChevronRight,
} from "lucide-react";
import { useCart } from "../context/CartContext";

// const allProducts = [
//   {
//     id: 1,
//     name: "Street Oversized Tee",
//     category: "Oversized T-Shirts",
//     price: "₹1,499",
//     img: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=600",
//   },
//   {
//     id: 2,
//     name: "Premium Cotton Shirt",
//     category: "Premium Cotton Shirts",
//     price: "₹2,199",
//     img: "https://images.unsplash.com/photo-1598033129183-c4f50c717658?q=80&w=600",
//   },
//   {
//     id: 3,
//     name: "Baggy Blue Jeans",
//     category: "Baggy Jeans",
//     price: "₹3,499",
//     img: "https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=600",
//   },
//   {
//     id: 4,
//     name: "Urban Cargo Pants",
//     category: "Cargo Pants",
//     price: "₹2,899",
//     img: "https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=1000",
//   },
//   {
//     id: 5,
//     name: "Old Money Polo",
//     category: "Old Money Aesthetic",
//     price: "₹1,899",
//     img: "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?q=80&w=600",
//   },
//   {
//     id: 7,
//     name: "Graphic Street Tee",
//     category: "Graphic Tees",
//     price: "₹1,299",
//     img: "https://images.unsplash.com/photo-1554568212-3c16f5c75050?q=80&w=600",
//   },
//   {
//     id: 8,
//     name: "Summer Linen Chinos",
//     category: "Tailored Chinos",
//     price: "₹2,499",
//     img: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?q=80&w=600",
//   },
// ];

const categories = [
  "All Collection",
  "Oversized T-Shirts",
  "Premium Cotton Shirts",
  "Graphic Tees",
  "Hoodies & Jackets",
  "Baggy Jeans",
  "Cargo Pants",
  "Streetwear Essentials",
  "Best Sellers",
  "New Drops",
];

const ProductPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [products,setProducts]=useState([]);
  const [loading,setLoading]=useState(true);
  const { isSignedIn } = useUser();
  useEffect(() => {
  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        "https://sattiyash-backend.onrender.com/getProduct"
      );
      console.log(response.data.data)
      setProducts(response.data.data);
      
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  fetchProducts();
}, []);
  const [selectedCategory, setSelectedCategory] =
    useState("All Collection");

  const { addToCart, addToWishlist } = useCart();
   const [wishlistItems, setWishlistItems] = useState([]);
      const [wishlist, setWishlist] = useState([]);
      
const fetchWishlist = async () => {
  try {
    const res = await axios.get(
      "https://sattiyash-backend.onrender.com/getallwishlist",
      {
        withCredentials: true,
      }
    );

    console.log("Backend Response:", res.data);

    setWishlist(res.data.item || []);
  } catch (error) {
    console.log(
      "Wishlist Fetch Error:",
      error.response?.data
    );
  }
};
useEffect(() => {

if (!isSignedIn) {

setWishlist([]);

return;

}

fetchWishlist();

}, [isSignedIn]);

  const colors = {
    studioWhite: "#FDFDFD",
    midnight: "#111111",
    slate: "#666666",
    divider: "#EEEEEE",
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cat = params.get("category");

    if (cat) {
      setSelectedCategory(cat);
    } else {
      setSelectedCategory("All Collection");
    }

    window.scrollTo(0, 0);
  }, [location]);

  const handleCategoryClick = (cat) => {
    if (cat === "All Collection") {
      navigate("/products");
    } else {
      navigate(`/products?category=${cat}`);
    }
  };

  const filteredProducts =
  selectedCategory === "All Collection"
    ? products
    : products.filter(
        (p) => p.Category === selectedCategory
      );
  if (loading) {
  return (
    <div className="h-screen flex items-center justify-center">
      Loading Products...
    </div>
  );
} 
const handleWishlist = async (e, productId) => {

  e.stopPropagation();

  if (!isSignedIn) {
    alert("Please login to add items to wishlist");
    return;
  }

  try {

    const isAlreadyWishlisted =
      wishlist?.some(
        (item) =>
          item.productId?._id === productId
      );

    if (isAlreadyWishlisted) {

      await axios.delete(
        `https://sattiyash-backend.onrender.com/deletwishlistitem/${productId}`,
        {
          withCredentials: true,
        }
      );

    } else {

      await axios.post(
        "https://sattiyash-backend.onrender.com/addtowishlist",
        {
          productId,
        },
        {
          withCredentials: true,
        }
      );

    }

    fetchWishlist();

  } catch (error) {

    console.log(error);

    if (
      error.response?.status === 401
    ) {
      alert(
        "Please login first"
      );
    }

  }

};
  return (
    <div className="min-h-screen lg:ml-[220px] bg-[#FDFDFD]">
      {/* HEADER */}
      <div
        className="pt-20 pb-6 px-6 md:px-10 border-b sticky top-14 z-20 bg-white/80 backdrop-blur-xl"
        style={{ borderColor: colors.divider }}
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <div
              className="w-6 h-[1.5px]"
              style={{
                backgroundColor: colors.midnight,
              }}
            />

            <span
              style={{ color: colors.slate }}
              className="text-[8px] font-black uppercase tracking-[0.4em] opacity-60"
            >
              SATTIYAS CATALOG
            </span>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5">
            <div>
              <h1
                style={{ color: colors.midnight }}
                className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic leading-none"
              >
                {selectedCategory}
                <span className="opacity-40">.</span>
              </h1>

              <p
                style={{ color: colors.slate }}
                className="text-[9px] mt-3 font-bold uppercase tracking-[0.3em] opacity-50"
              >
                Curated Premium Streetwear Collection
              </p>
            </div>

            <p
              style={{ color: colors.slate }}
              className="text-[9px] font-bold uppercase tracking-widest opacity-40"
            >
              Showing {filteredProducts.length} Items
            </p>
          </div>
        </motion.div>

        {/* CATEGORY */}
        <div className="flex overflow-x-auto pb-3 gap-3 no-scrollbar scroll-smooth">
          {categories.map((cat) => (
            <motion.button
              whileHover={{
                y: -2,
              }}
              whileTap={{ scale: 0.96 }}
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              style={{
                backgroundColor:
                  selectedCategory === cat
                    ? colors.midnight
                    : "transparent",
                color:
                  selectedCategory === cat
                    ? "#fff"
                    : colors.midnight,
                borderColor:
                  selectedCategory === cat
                    ? colors.midnight
                    : colors.divider,
              }}
              className="whitespace-nowrap px-5 py-2.5 rounded-full border text-[9px] font-black uppercase tracking-[0.25em] transition-all duration-300 hover:border-black hover:shadow-md"
            >
              {cat}
            </motion.button>
          ))}
        </div>
      </div>

      {/* PRODUCTS */}
      <div className="pt-20 pb-14 px-6 md:px-10 relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.6,
            delay: 0.2,
          }}
          className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-5 md:gap-7"
        >
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product, index) => {
                const isInWishlist = wishlist.some(
                  (item) => item.productId?._id === product._id
                );
              return(  
              <motion.div
                layout
                key={product._id}
                initial={{
                  opacity: 0,
                  y: 30,
                  scale: 0.96,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  y: 20,
                  scale: 0.96,
                }}
                transition={{
                  duration: 0.45,
                  ease: "easeOut",
                  delay: index * 0.03,
                }}
                whileHover={{
                  y: -10,
                }}
                className="group cursor-pointer will-change-transform relative"
               onClick={() => {
                  console.log(product);
                  console.log("ID:", product._id);

                  navigate(`/products/${product._id}`);
                }}
              >
                <div
                  style={{
                    backgroundColor:
                      colors.studioWhite,
                    borderColor: colors.divider,
                  }}
                  className="relative aspect-[4/5] overflow-hidden rounded-[2.3rem] mb-4 border bg-white/90 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_30px_60px_rgba(0,0,0,0.12)] transition-all duration-700 group-hover:-translate-y-3"
                >
                  {/* IMAGE */}
                  <div className="absolute inset-0 overflow-hidden">
                    <motion.img
                      src={product.image}
                      alt={product.name}
                      whileHover={{
                        scale: 1.1,
                      }}
                      transition={{
                        duration: 0.8,
                      }}
                      className="w-full h-full object-cover transition-all duration-1000 ease-out scale-[1.02] group-hover:scale-[1.12] grayscale-[8%] group-hover:grayscale-0"
                    />
                  </div>

                  {/* OVERLAY */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 flex items-center justify-center gap-3">
                    {/* CART */}
                    <motion.button
                      whileHover={{
                        y: -2,
                        scale: 1.08,
                      }}
                      whileTap={{
                        scale: 0.9,
                      }}
                      onClick={async (e) => {

                      e.stopPropagation();

                      if (!isSignedIn) {

                      alert(
                      "Please login to add items to cart"
                      );

                      return;

                      }

                      try {

                      await axios.post(
                      "https://sattiyash-backend.onrender.com/addtocart",
                      {
                      productId:
                      product._id
                      },
                      {
                      withCredentials:true
                      }
                      );

                      alert(
                      "Added to cart"
                      );

                      }
                      catch(error){

                      console.log(error);

                      if(
                      error.response?.status===401
                      ){

                      alert(
                      "Please login first"
                      );

                      }

                      }

                      }}
                      style={{
                        backgroundColor:
                          colors.midnight,
                      }}
                      className="p-3 rounded-full text-white shadow-2xl transition-all"
                    >
                      <ShoppingBag size={16} />
                    </motion.button>

                    {/* WISHLIST */}
                    <motion.button
                      whileHover={{
                        y: -2,
                        scale: 1.08,
                      }}
                      whileTap={{
                        scale: 0.9,
                      }}
                      onClick={(e) => handleWishlist(e, product._id)}
                      style={{
                        backgroundColor: "#ffffff",
                        color: colors.midnight,
                      }}
                      className="p-3 rounded-full shadow-2xl border border-black/5 transition-all"
                    >
                       <Heart
                          size={14}
                          className={`transition-all duration-300 ${
                            isInWishlist
                              ? "fill-red-500 text-red-500"
                              : "text-black"
                          }`}
                        />
                    </motion.button>
                  </div>

                  {/* CATEGORY TAG */}
                  <span
                    className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-xl rounded-full text-[7px] font-black uppercase tracking-[0.25em] border border-black/5"
                    style={{
                      color: colors.midnight,
                    }}
                  >
                    {product.Category?.split(" ")[0]}
                  </span>

                  {/* FLOATING LIGHT */}
                  <div className="absolute -top-24 -right-24 w-52 h-52 bg-white/20 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700" />

                  {/* GLOW */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-700 pointer-events-none">
                    <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-40 h-40 bg-white/10 blur-3xl rounded-full" />
                  </div>
                </div>

                {/* DETAILS */}
                <div className="px-1">
                  <h3
                    style={{
                      color: colors.midnight,
                    }}
                    className="text-[11px] font-black uppercase tracking-tight truncate transition-all duration-300 group-hover:tracking-wide group-hover:opacity-60"
                  >
                    {product.name}
                  </h3>

                  <div className="flex justify-between items-center mt-1">
                    <span
                      style={{
                        color: colors.midnight,
                      }}
                      className="font-black text-sm tracking-tight italic"
                    >
                      {product.price}
                    </span>

                    <motion.div
                      whileHover={{ x: 3 }}
                      className="flex items-center gap-1"
                    >
                      <p
                        style={{
                          color: colors.slate,
                        }}
                        className="text-[7px] font-bold uppercase tracking-[0.2em] opacity-40"
                      >
                        Studio
                      </p>

                      <ChevronRight
                        size={10}
                        className="opacity-40"
                      />
                    </motion.div>
                  </div>
                </div>
              </motion.div>
)})}
          </AnimatePresence>
        </motion.div>

        {/* EMPTY */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-24">
            <motion.h3
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ color: colors.slate }}
              className="text-xl font-black uppercase italic opacity-40"
            >
              No Items Found
            </motion.h3>
          </div>
        )}
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }

        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default ProductPage;