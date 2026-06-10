import React from "react";
import { motion } from "framer-motion";
import { useCart } from "../context/CartContext";
import axios from "axios";
import { useEffect, useState } from "react";

import {
  Trash2,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Truck,
  Minus,
  Plus,
  Star,
  Heart,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";


const CartPage = () => {

   const navigate = useNavigate();
    const {
       
        wishlist,
        
        addToCart,
        addToWishlist,
        removeFromWishlist,
      } = useCart();
  const [cartItems, setCartItems] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [sizes, setSizes] = useState({});
  const [suggestedProducts, setSuggestedProducts] = useState([]);
  

  useEffect(() => {
  const fetchCart = async () => {
    try {
      const response = await axios.get(
        "https://sattiyash-backend.onrender.com/getcartitems",
        { withCredentials: true }
      );

      setCartItems(response.data.cartItems || []);
    } catch (error) {
      console.log("Cart fetch failed:", error);

      // IMPORTANT: clear cart on auth failure
      setCartItems([]);
    }
  };

  fetchCart();
}, []);

  const removeFromCart = async (productId) => {
  try {
    console.log("Remove cart envoked")
    await axios.delete(
      `https://sattiyash-backend.onrender.com/deletefromcart/${productId}`,
      {
        withCredentials: true,
      }
    );

    setCartItems((prev) =>
      prev.filter(
        (item) =>
          item.productId._id !== productId
      )
    );
  } catch (error) {
    console.log(error);
  }
};

  const colors = {
    studioWhite: "#FDFDFD",
    midnight: "#111111",
    slate: "#666666",
    divider: "#EEEEEE",
  };

  // ================= QUANTITY STATE =================
React.useEffect(() => {
  const initialQuantities = {};

  cartItems.forEach((item) => {
    const id = item.productId?._id;

    initialQuantities[id] =
      item.quantity || 1;
  });

  setQuantities(initialQuantities);
}, [cartItems]);

  // ================= SIZE STATE =================


  React.useEffect(() => {
    const initialSizes = {};

    cartItems.forEach((item) => {
      const id = item.productId?._id || item._id;
      initialSizes[id] = "M";
    });

    setSizes(initialSizes);
  }, [cartItems]);

  // ================= UNIQUE PRODUCTS =================
  const uniqueCart = [
  ...new Map(
    cartItems.map((item) => [
      item.productId?._id || item._id,
      item,
    ])
  ).values(),
];

  // ================= TOTAL ITEMS =================
  const totalItems = Object.values(
    quantities
  ).reduce(
    (acc, qty) => acc + qty,
    0
  );

  // ================= SUBTOTAL =================
const subtotal = uniqueCart.reduce(
  (total, item) => {
    const cleanPrice =
      item.productId?.Discounted_price || 0;

    const quantity =
      quantities[item.productId?._id] || 1;

    return total + cleanPrice * quantity;
  },
  0
);

  // ================= RECOMMENDED =================
  

  return (
    <div className="lg:ml-[220px] pt-24 px-6 md:px-10 min-h-screen bg-[#FDFDFD] font-jakarta relative overflow-hidden">

      {/* BACKGROUND */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-black/[0.03] blur-[140px] rounded-full pointer-events-none" />

      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-black/[0.02] blur-[120px] rounded-full pointer-events-none" />

      {/* HEADER */}
      <div className="mb-10 flex justify-between items-end relative z-10">

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
        >
          <span className="text-[9px] font-black uppercase tracking-[0.4em] opacity-50">
            Shopping Bag
          </span>

          <h1 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter mt-2">
            Your Bag.
          </h1>
        </motion.div>

        <p className="text-[9px] font-black uppercase tracking-[0.25em] opacity-50">
          {totalItems} Products
        </p>
      </div>

      {/* EMPTY */}
      {uniqueCart.length === 0 ? (
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.96,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          className="text-center py-40 border-2 border-dashed rounded-[3rem]"
        >
          <ShoppingBag
            size={50}
            className="mx-auto mb-6 opacity-20"
          />

          <h2 className="text-xl font-black uppercase mb-3">
            Your Bag Is Empty
          </h2>

          <Link
            to="/products"
            className="inline-flex items-center gap-3 px-8 py-4 bg-black text-white rounded-full text-[10px] font-black uppercase tracking-[0.25em]"
          >
            Start Shopping
            <ArrowRight size={14} />
          </Link>
        </motion.div>
      ) : (
        <div className="max-w-[1700px] mx-auto relative z-10">

          <div className="flex flex-col lg:flex-row gap-10">

            {/* LEFT SIDE */}
            <div className="flex-1 space-y-5 max-h-[calc(100vh-120px)] overflow-y-auto overflow-x-hidden pr-3 custom-scrollbar">

              {uniqueCart.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{
                    opacity: 0,
                    y: 30,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay: idx * 0.05,
                  }}
                  className="group relative overflow-hidden rounded-[2.8rem] border border-black/5 bg-white p-5 shadow-[0_15px_45px_rgba(0,0,0,0.05)] hover:shadow-[0_30px_70px_rgba(0,0,0,0.08)] transition-all duration-700"
                >

                  <div className="flex gap-5">

                    {/* IMAGE */}
                    <div className="w-36 h-44 rounded-[2rem] overflow-hidden shrink-0 bg-gray-100">

                      <img
                         src={
                            item.productId?.image ||
                            "fallback"
                          }
                          alt={item.productId?.name}
                        className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                      />
                    </div>

                    {/* DETAILS */}
                    <div className="flex-1 min-w-0">

                      <div className="flex justify-between gap-4">

                        <div>
                          <p className="text-[8px] uppercase tracking-[0.3em] opacity-40 mb-2">
                            {item.productId?.Category || "Studio"}
                          </p>

                          <h2 className="text-[18px] md:text-[22px] font-black uppercase leading-tight">
                            {item.productId?.name}
                          </h2>

                          <p className="text-[11px] opacity-50 mt-4 leading-relaxed max-w-[700px]">
                            Premium heavyweight luxury
                            streetwear crafted for modern
                            oversized aesthetics and
                            everyday comfort.
                          </p>
                        </div>

                        {/* REMOVE */}
                        <button
                          onClick={async() =>{
                            try{
                              await removeFromCart(item.productId._id);
                              setCartItems((prev)=>prev.filter((cartItem)=>cartItem.productId._id !== item.productId._id));
                            }catch(error){
                              console.log(error);
                            }
                          }}
                          className="w-14 h-14 rounded-full border border-black/10 flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all duration-300"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>

                      {/* PRICE */}
                      <div className="flex items-center justify-between mt-8">

                        <div>
                          <p className="text-4xl font-black italic tracking-tighter">
                            ₹{item.productId?.Discounted_price}
                          </p>

                          <div className="flex items-center gap-1 text-[10px] font-black opacity-50 mt-2">
                            <Star
                              size={12}
                              fill="currentColor"
                            />
                            4.8 Rating
                          </div>
                        </div>

                        <div className="text-[12px] uppercase tracking-[0.35em] opacity-40">
                          Studio Fit
                        </div>
                      </div>

                      {/* SIZE */}
                      
                      {/* QUANTITY */}
                      <div className="flex items-center justify-between mt-8">

                        <div className="flex items-center gap-6 border border-black/10 rounded-full px-6 py-4">

                          <button
                            onClick={() =>
                              setQuantities({
                                ...quantities,
                                [item.productId._id]: Math.max(
                                  1,
                                  (quantities[
                                    item.productId._id
                                  ] || 1) - 1
                                ),
                              })
                            }
                          >
                            <Minus size={18} />
                          </button>

                          <span className="text-[14px] font-black min-w-[20px] text-center">
                            {
                              quantities[
                                item.productId._id
                              ] || 1
                            }
                          </span>

                          <button
                            onClick={() =>
                              setQuantities({
                                ...quantities,
                                [item.productId._id]:
                                  (quantities[
                                    item.productId._id
                                  ] || 1) + 1,
                              })
                            }
                          >
                            <Plus size={18} />
                          </button>
                        </div>

                        <p className="text-[12px] uppercase tracking-[0.35em] opacity-40">
                          Size:{" "}
                          {
                            sizes[item.productId._id]
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* RECOMMENDED */}
              <div className="overflow-hidden w-full">
<motion.div
  animate={{
    x: ["0%", "-50%"],
  }}
  transition={{
    duration: 26,
    repeat: Infinity,
    ease: "linear",
  }}
  className="recommended-slider flex gap-5 w-max"
>

  {[...suggestedProducts, ...suggestedProducts].map(
    (item, idx) => (
      <motion.div
        key={`${item.productId._id}-${idx}`}
        whileHover={{
          y: -8,
        }}
        className="group relative w-[220px] min-w-[220px] shrink-0"
      >

        <div className="relative overflow-hidden rounded-[2rem] border border-black/5 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_22px_55px_rgba(0,0,0,0.10)] transition-all duration-700">

          {/* IMAGE */}
          <div className="relative h-[250px] overflow-hidden">

            <img
  src={item.productId?.image}
  alt={item.productId?.name}
/>

            {/* OVERLAY */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700" />

            {/* CATEGORY */}
            <div className="absolute top-4 left-4 px-4 py-2 rounded-full bg-white/95 backdrop-blur-xl text-[7px] font-black uppercase tracking-[0.22em] shadow-lg">
              {item.productId?.Category}
            </div>

         {/* WISHLIST */}
{/* WISHLIST */}
<motion.button
  whileTap={{
    scale: 0.85,
  }}
  whileHover={{
    scale: 1.08,
  }}
  onClick={(e) => {
    e.preventDefault();
    e.stopPropagation();

    const alreadyWishlisted =
  wishlist?.some(
    (wish) =>
      wish.id === item.productId._id
  );

if (alreadyWishlisted) {
  removeFromWishlist(item.productId._id);
} else {
  addToWishlist({
    ...item,
    img:
      item.image ||
      item.img,
  });
}
  }}
  className={`absolute top-4 right-4 z-[100] w-10 h-10 rounded-full backdrop-blur-xl flex items-center justify-center shadow-xl transition-all duration-500 cursor-pointer
  ${
    wishlist?.some(
      (wish) =>
        wish.id === item.productId._id
    )
      ? "bg-black text-white opacity-100"
      : "bg-white/95 text-black opacity-0 group-hover:opacity-100 hover:bg-black hover:text-white"
  }`}
>
  <Heart
    size={15}
    fill={
      wishlist?.some(
        (wish) =>
          wish.id === item.productId._id
      )
        ? "currentColor"
        : "none"
    }
  />
</motion.button>

            {/* ADD TO CART */}
            <motion.button
              whileTap={{
                scale: 0.96,
              }}
              onClick={(e) => {
                e.stopPropagation();
                addToCart(item);
              }}
              className="absolute left-4 right-4 bottom-4 z-20 py-3 rounded-full bg-black text-white text-[8px] font-black uppercase tracking-[0.24em] flex items-center justify-center gap-2 opacity-0 translate-y-8 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 shadow-2xl"
            >
              <ShoppingBag size={13} />

              Add To Bag
            </motion.button>
          </div>

          {/* CONTENT */}
          <div className="p-5">

            <div className="flex items-center justify-between mb-3">

              <p className="text-[7px] uppercase tracking-[0.28em] opacity-40">
                Matching Combo
              </p>

              <div className="flex items-center gap-1 text-[7px] font-black opacity-60">
                ★ 4.8
              </div>
            </div>

            {/* NAME */}
            <h3 className="text-[11px] font-black uppercase leading-tight min-h-[34px]">
              {item.name}
            </h3>

            {/* DESC */}
            <p className="text-[8px] opacity-50 leading-5 mt-3 min-h-[40px]">
              Premium luxury streetwear
              crafted for oversized
              aesthetics.
            </p>

            {/* PRICE */}
            <div className="flex items-end justify-between mt-5">

              <div>
                <p className="text-xl font-black italic tracking-tight">
                  {item.Discounted_price}
                </p>

                <p className="text-[7px] uppercase tracking-[0.2em] opacity-40 mt-1">
                  Studio Quality
                </p>
              </div>

              {/* BUTTON */}
              <motion.button
                whileHover={{
                  rotate: -10,
                  scale: 1.05,
                }}
                className="w-11 h-11 rounded-full bg-black text-white flex items-center justify-center shadow-xl"
              >
                <ArrowRight size={15} />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    )
  )}
</motion.div>
 </div>
 </div>

            {/* RIGHT SIDE */}
            <motion.div
              initial={{
                opacity: 0,
                x: 30,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              className="w-full lg:w-[450px] xl:w-[500px] shrink-0"
            >

              <div className="overflow-hidden p-10 rounded-[3rem] border sticky top-28 bg-white/90 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.06)]">

                <h2 className="text-[14px] font-black uppercase mb-10 tracking-[0.3em]">
                  Order Summary
                </h2>

                <div className="space-y-7 mb-12">

                  <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest opacity-60">
                    <span>
                      Subtotal
                    </span>

                    <span>
                      ₹{subtotal}
                    </span>
                  </div>

                  <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest opacity-60">
                    <span>
                      Shipping
                    </span>

                    <span className="italic">
                      Complimentary
                    </span>
                  </div>

                  <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest opacity-60">
                    <span>
                      Estimated Tax
                    </span>

                    <span>
                      ₹0.00
                    </span>
                  </div>

                  <div className="pt-7 border-t flex justify-between items-center">

                    <span className="text-[13px] font-black uppercase italic tracking-tighter">
                      Total Payable
                    </span>

                    <span className="text-4xl font-black tracking-tighter italic leading-none">
                      ₹{subtotal}
                    </span>
                  </div>
                </div>

                <div className="space-y-5 mb-12">

                  <div className="flex items-center gap-4 opacity-60">
                    <ShieldCheck
                      size={18}
                    />

                    <span className="text-[10px] font-bold uppercase tracking-widest">
                      Studio Secured Checkout
                    </span>
                  </div>

                  <div className="flex items-center gap-4 opacity-60">
                    <Truck size={18} />

                    <span className="text-[10px] font-bold uppercase tracking-widest">
                      Express Logistics:
                      3-5 Days
                    </span>
                  </div>
                </div>

                <button
                  onClick={() =>
                    navigate("/checkout", {
                      state: {
                        cartItems: cartItems,
                      },
                    })
                  }
                  className="group relative overflow-hidden w-full py-6 bg-black text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-full transition-all duration-500 shadow-[0_20px_40px_rgba(0,0,0,0.18)] hover:shadow-[0_30px_60px_rgba(0,0,0,0.28)] active:scale-[0.98] flex items-center justify-center gap-3"
                >

                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-120%] group-hover:translate-x-[120%] transition duration-1000" />

                  Proceed To Checkout

                  <ArrowRight
                    size={16}
                  />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;