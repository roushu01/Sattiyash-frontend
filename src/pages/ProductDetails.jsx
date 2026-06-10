import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import {
  ShoppingBag,
  Heart,
  ArrowLeft,
  Truck,
  RefreshCcw,
  Star,
  CreditCard,
} from "lucide-react";
import { useCart } from "../context/CartContext";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
 const allSizes=["XS","S","M","L","XL", "XXL"]
  const [selectedSize, setSelectedSize] = useState("");
  const { addToCart, addToWishlist } = useCart();
      const [wishlistItems, setWishlistItems] = useState([]);
      const [wishlist, setWishlist] = useState([]);
      const isInWishlist =
        wishlist?.some(
          (item) => item.productId?._id === product?._id
        ) || false;
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
  fetchWishlist();
}, []);

  const colors = {
    studioWhite: "#FDFDFD",
    midnight: "#111111",
    slate: "#666666",
    divider: "#EEEEEE",
  };
  useEffect(() => {
  const fetchProduct = async () => {
    try {
      console.log("ID from URL:", id);

      const response = await axios.get(
        `https://sattiyash-backend.onrender.com/products/${id}`
      );

      console.log("Response:", response.data);

      setProduct(response.data.products);
    } catch (error) {
      console.log("Error:", error.response?.data || error.message);
    }
  };

  fetchProduct();
}, [id]);
  


  if (!product)
    return (
      <div className="h-screen flex items-center justify-center font-black uppercase text-gray-400">
        Product Not Found
      </div>
    );
 const handleWishlist = async (e, productId) => {
  e.stopPropagation();

  try {
    const isAlreadyWishlisted = wishlist?.some(
      (item) => item.productId?._id === productId
    );
   console.log("Already in wishlist",isAlreadyWishlisted)
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
        { productId },
        {
          withCredentials: true,
        }
      );
    }

    // Refresh wishlist
    fetchWishlist();

  } catch (error) {
    console.log(error);
  }
};
  return (
    <div className="min-h-screen lg:ml-[220px] bg-[#FDFDFD] font-jakarta flex flex-col pt-16 lg:pt-20 overflow-hidden relative">

      {/* BACKGROUND GLOW */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-black/[0.03] blur-[140px] rounded-full pointer-events-none" />

      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-black/[0.02] blur-[120px] rounded-full pointer-events-none" />

      <div className="flex-1 max-w-7xl mx-auto w-full px-4 lg:px-12 flex flex-col justify-center py-6 lg:py-10 relative z-10">

        {/* BACK BUTTON */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          style={{ color: colors.slate }}
          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest mb-8 hover:text-black transition-all duration-300"
        >
          <ArrowLeft size={14} />
          Back to {product.parentCategory}
        </motion.button>

        <div className="flex flex-col lg:flex-row gap-10 lg:gap-20 items-center">

          {/* IMAGE SECTION */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{
              duration: 0.8,
              ease: "easeOut",
            }}
            className="w-full lg:w-[45%] flex justify-center"
          >
            <motion.div
              whileHover={{
                y: -10,
              }}
              transition={{
                type: "spring",
                stiffness: 120,
              }}
              style={{
                backgroundColor: colors.studioWhite,
                borderColor: colors.divider,
              }}
              className="group relative w-full max-w-[420px] lg:max-w-none aspect-[4/5] rounded-[2.5rem] overflow-hidden border shadow-[0_25px_60px_rgba(0,0,0,0.08)]"
            >

              {/* IMAGE */}
              <motion.img
                src={product.image}
                alt={product.name}
                whileHover={{
                  scale: 1.1,
                  rotate: -1,
                }}
                transition={{ duration: 1 }}
                className="w-full h-full object-cover transition-all duration-1000"
              />

              {/* OVERLAY */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-700" />

              {/* FLOAT LIGHT */}
              <div className="absolute -top-16 -right-16 w-40 h-40 bg-white/20 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition duration-700" />

              {/* CATEGORY */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="absolute top-6 left-6"
              >
                <span className="bg-white/90 backdrop-blur-xl px-4 py-2 rounded-full text-[8px] font-black uppercase tracking-[0.3em] shadow-lg border border-white/40">
                  {product.Category}
                </span>
              </motion.div>

              {/* FLOATING INFO */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="absolute bottom-6 right-6 bg-white/60 backdrop-blur-2xl px-5 py-4 rounded-[1.5rem] shadow-[0_10px_30px_rgba(0,0,0,0.08)] border border-white/40"
              >
                <p className="text-[8px] uppercase tracking-[0.3em] font-black text-gray-400 mb-1">
                  Studio Quality
                </p>

                <p className="text-[10px] font-black uppercase">
                  Premium Fabric
                </p>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* DETAILS */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.7,
              ease: "easeOut",
            }}
            className="w-full lg:w-[55%] flex flex-col justify-center"
          >

            {/* RATING */}
            <div className="flex items-center gap-2 mb-3">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={10}
                    fill={colors.midnight}
                    color={colors.midnight}
                  />
                ))}
              </div>

              <span className="text-[8px] font-black uppercase tracking-widest text-gray-400">
                Premium {product.parentCategory} Collection
              </span>
            </div>

            {/* TITLE */}
            <h1
              style={{ color: colors.midnight }}
              className="text-4xl lg:text-7xl font-black uppercase italic leading-[0.95] mb-4 tracking-tighter"
            >
              {product.name}
              <span className="opacity-40"></span>
            </h1>

            {/* PRICE */}
            <p className="text-2xl lg:text-4xl font-black mb-6 tracking-tighter drop-shadow-sm">
              ₹{product.Discounted_price}{" "}
            </p>

            {/* DESCRIPTION */}
            <p className="text-[13px] lg:text-sm leading-relaxed mb-10 max-w-lg font-medium text-gray-500">
              {product.Description}
            </p>

            {/* SIZE */}
            <div className="mb-10">
              <h4 className="text-[9px] font-black uppercase tracking-widest mb-4 text-gray-400">
                Select Size
              </h4>

              <div className="flex items-center justify-between w-full lg:max-w-md">

                {/* SIZE BUTTONS */}
                <div className="flex gap-3 mt-4">
                  {allSizes.map((size) => {
                    const available =
                      product?.Size?.includes(size) &&
                      product?.Quantity > 0;

                    return (
                      <button
                        key={size}
                        disabled={!available}
                        onClick={() => available && setSelectedSize(size)}
                        className={`
                          w-12 h-12 rounded-lg border
                          transition-all

                          ${
                            selectedSize === size
                              ? "bg-black text-white"
                              : ""
                          }

                          ${
                            available
                              ? "hover:border-black cursor-pointer"
                              : "opacity-30 cursor-not-allowed"
                          }
                        `}
                      >
                        {size}

                        {!available && (
                          <span className="ml-1 text-red-500">
                            
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* ACTIONS */}
                <div className="flex items-center gap-3">

                  {/* CART */}
                  <motion.button
                    whileHover={{
                      scale: 1.08,
                      y: -2,
                    }}
                    whileTap={{
                      scale: 0.9,
                    }}
                    onClick={async(e)=>{
                        e.stopPropagation();
                        try{
                          console.log("Adding to cart:", product._id);
                          console.log("Product details:", product);
                          const response=await axios.post(
                            "https://sattiyash-backend.onrender.com/addtocart",
                            {
                              productId: product._id
                            },{
                              withCredentials: true
                            }
                          )

                        }catch(error){
                          console.log(error);
                        }
                      }}
                    style={{
                      backgroundColor: colors.midnight,
                    }}
                    className="p-4 rounded-full text-white shadow-2xl"
                  >
                    <ShoppingBag size={18} />
                  </motion.button>

                  {/* WISHLIST */}
                  <motion.button
                    whileHover={{
                      scale: 1.08,
                      y: -2,
                    }}
                    whileTap={{
                      scale: 0.9,
                    }}
                    onClick={(e) => handleWishlist(e, product._id)}
                    
                    style={{
                      borderColor: colors.divider,
                    }}
                    className="p-4 rounded-full border-2 text-gray-300 hover:text-black bg-white shadow-lg"
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
              </div>
            </div>

            {/* BUY BUTTON */}
            <motion.button
              whileHover={{
                y: -6,
                scale: 1.01,
              }}
              whileTap={{
                scale: 0.98,
              }}
              onClick={() => {
                addToCart(product);
                navigate("/cart");
              }}
              style={{
                backgroundColor: colors.midnight,
              }}
              className="group relative overflow-hidden w-full lg:max-w-md py-4 lg:py-5 rounded-full text-white text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 shadow-[0_20px_40px_rgba(0,0,0,0.18)] hover:shadow-[0_30px_60px_rgba(0,0,0,0.28)] transition-all duration-500"
            >

              {/* SHINE EFFECT */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-120%] group-hover:translate-x-[120%] transition duration-1000" />

              <CreditCard size={18} />

              Buy it Now
            </motion.button>

            {/* FEATURES */}
            <div
              style={{ borderColor: colors.divider }}
              className="pt-8 mt-8 border-t grid grid-cols-2 gap-5"
            >

              <motion.div
                whileHover={{ y: -3 }}
                className="flex items-center gap-3"
              >
                <Truck size={16} />

                <p className="text-[8px] font-black uppercase tracking-widest">
                  Free Shipping
                </p>
              </motion.div>

              <motion.div
                whileHover={{ y: -3 }}
                className="flex items-center gap-3"
              >
                <RefreshCcw size={16} />

                <p className="text-[8px] font-black uppercase tracking-widest">
                  Easy Return
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;