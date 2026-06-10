import React, { useState, useRef, forwardRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Heart,
  ShoppingBag,
  ArrowRight,
  Star,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useCart } from "../../context/CartContext";


/* ---------------- DATA ---------------- */



const categories = [
  "All",
  "Oversized T-Shirts",
  "Premium Cotton Shirts",
  "Baggy Jeans",
  "Cargo Pants",
];

/* ---------------- CARD ---------------- */

const ProductCard = forwardRef(
  ({ product, isActive, onHover, onLeave }, ref) => {
    const navigate = useNavigate();
    const { addToCart, addToWishlist } = useCart();
      const [wishlistItems, setWishlistItems] = useState([]);
      const [wishlist, setWishlist] = useState([]);
        const isInWishlist = wishlist?.some(
      (item) => item.productId?._id === product._id
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

    const discountedPrice = Math.round(
      product.price * (1 - product.discount / 100)
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
      <motion.div
        ref={ref}
        layout
        onMouseEnter={onHover}
        onMouseLeave={onLeave}
        initial={{ opacity: 0, y: 20 }}
        animate={{
          opacity: 1,
          scale: isActive ? 1.08 : 0.94,
          y: isActive ? -8 : 0,
          zIndex: isActive ? 10 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 220,
          damping: 18,
        }}
        className="flex-shrink-0 w-[200px] sm:w-[240px] md:w-[260px] group relative cursor-pointer snap-center"
        onClick={() => navigate(`/products/${product._id}`)}
      >
        <div className="relative rounded-[2rem] overflow-hidden border bg-white transition-all duration-500 hover:border-black/20 shadow-sm hover:shadow-2xl">

          {/* IMAGE */}
          <div className="relative aspect-[3/4] overflow-hidden">
            <motion.img
              src={product.image}
              className="w-full h-full object-cover transition-all duration-700 grayscale-[10%] group-hover:grayscale-0"
              whileHover={{ scale: 1.05 }}
            />

            {/* Discount */}
            <span className="absolute top-4 left-4 text-white bg-black text-[8px] px-2 py-1 rounded-md font-black uppercase">
              -{product.Discount}%
            </span>

            {/* Wishlist */}
            <button
  onClick={(e) => handleWishlist(e, product._id)}
  className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center bg-white/80"
>
  <Heart
    size={14}
    className={`transition-all duration-300 ${
      isInWishlist
        ? "fill-red-500 text-red-500"
        : "text-black"
    }`}
  />
</button>

            {/* Add To Cart */}
            <motion.div className="absolute inset-x-0 bottom-0 p-3 translate-y-full group-hover:translate-y-0 transition">
              <button
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
                className="w-full bg-black text-white py-3 rounded-full text-[10px] uppercase tracking-widest flex items-center justify-center gap-2"
              >
                <ShoppingBag size={14} />
                Add to bag
              </button>
            </motion.div>
          </div>

          {/* DETAILS */}
          <div className="p-5">
            <div className="flex justify-between mb-1">
              <span className="text-[8px] uppercase text-gray-400 tracking-widest">
                {product.Category}
              </span>

              <div className="flex items-center text-[9px] font-bold">
                <Star size={10} />
                {product.rating}
              </div>
            </div>

            <h3 className="font-bold text-[12px] mb-3 group-hover:opacity-60">
              {product.name}
            </h3>

            <div className="flex justify-between items-end">
              <div>
                <span className="font-black text-sm">
                  ₹{product.Discounted_price}
                </span>

                <div className="text-[9px] line-through opacity-40">
                  ₹{product.price}
                </div>
              </div>

              <div className="w-8 h-8 border rounded-full flex items-center justify-center group-hover:bg-black transition">
                <ArrowRight
                  size={14}
                  className="group-hover:text-white"
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }
);

ProductCard.displayName = "ProductCard";

/* ---------------- MAIN ---------------- */

export default function FeaturedItems() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeIndex, setActiveIndex] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);
  const navigate = useNavigate();
  useEffect(() => {
  const fetchProducts = async () => {
    try {
      const response = await fetch(
        "https://sattiyash-backend.onrender.com/getbyParent/FeaturesItems"
      );
     
      const result= await response.json();

      setProducts(result.products);
      console.log(result.products);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchProducts();
}, []);
if (loading) {
  return (
    <div className="text-center py-20">
      Loading Products...
    </div>
  );
}
  const filtered = products.filter(
  (p) =>
    activeCategory === "All" ||
    p.Category === activeCategory
);

  const scroll = (dir) => {
    scrollRef.current.scrollBy({
      left: dir === "left" ? -400 : 400,
      behavior: "smooth",
    });
  };

  return (
    <section className="lg:ml-[220px] pt-24 pb-20 px-6 bg-[#FDFDFD]">

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex justify-between items-end mb-12">
          <div>
            <p className="text-xs text-gray-400 uppercase mb-2">
              Studio Selects
            </p>

            <h2 className="text-5xl font-black italic">
              Featured Pieces
            </h2>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => scroll("left")}
              className="btn"
            >
              <ChevronLeft />
            </button>

            <button
              onClick={() => scroll("right")}
              className="btn"
            >
              <ChevronRight />
            </button>
          </div>
        </div>

        {/* CATEGORY */}
        <div className="flex gap-3 overflow-x-auto no-scrollbar mb-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2 rounded-full text-xs uppercase font-bold border ${
                activeCategory === cat
                  ? "bg-black text-white"
                  : "bg-white text-black"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* PRODUCTS */}
        <motion.div
          ref={scrollRef}
          className="flex gap-8 overflow-x-auto no-scrollbar pb-10 pt-6"
          drag="x"
          dragConstraints={{ left: -1000, right: 0 }}
          dragElastic={0.1}
        >
          <AnimatePresence>
            {filtered.map((p, i) => (
              <ProductCard
                key={p._id}
                product={p}
                isActive={activeIndex === i}
                onHover={() => setActiveIndex(i)}
                onLeave={() => setActiveIndex(null)}
              />
            ))}
          </AnimatePresence>

          {/* VIEW ALL */}
          <div
            onClick={() => navigate("/products")}
            className="w-[220px] flex items-center justify-center border-2 border-dashed rounded-2xl cursor-pointer hover:bg-black hover:text-white transition"
          >
            <ArrowRight />
          </div>
        </motion.div>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }

        .btn {
          width: 45px;
          height: 45px;
          border: 1px solid #eee;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .btn:hover {
          background: black;
          color: white;
        }
      `}</style>
    </section>
  );
}