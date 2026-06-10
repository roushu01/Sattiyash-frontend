
import React, { useState, useRef, forwardRef, useEffect } from "react";
import { useCart } from "../context/CartContext";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";
import {
  ShoppingBag,
  X,
  Heart,
  ArrowRight,
} from "lucide-react";
import {
  motion,
  AnimatePresence,
} from "framer-motion";
import { useNavigate } from "react-router-dom";

const WishlistPage = () => {
  const { addToCart } = useCart();

const [wishlist, setWishlist] = useState([]);
const { isSignedIn } = useUser();
  const navigate = useNavigate();
 
  const colors = {
    studioWhite: "#FDFDFD",
    midnight: "#111111",
    slate: "#666666",
    divider: "#EEEEEE",
  };
useEffect(() => {

  if (!isSignedIn) {
    setWishlist([]);
    return;
  }

  fetchWishlist();

}, [isSignedIn]);

const fetchWishlist = async () => {
  try {

    const res = await axios.get(
      "https://sattiyash-backend.onrender.com/getallwishlist",
      {
        withCredentials: true,
      }
    );

    console.log("Wishlist:", res.data);

    setWishlist(
      Array.isArray(res.data.item)
        ? res.data.item
        : []
    );

  } catch (error) {

    console.log(error);

    // IMPORTANT
    setWishlist([]);

  }
};
const removeFromWishlist = async (productId) => {
  try {
    await axios.delete(
      `https://sattiyash-backend.onrender.com/deletwishlistitem/${productId}`,
      {
        withCredentials: true,
      }
    );

    // Refresh wishlist
    fetchWishlist();

  } catch (error) {
    console.log(error);
  }
};
  return (
    <div className="lg:ml-[220px] pt-24 px-6 md:px-10 min-h-screen bg-[#FDFDFD] font-jakarta relative overflow-hidden">

      {/* BACKGROUND GLOW */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-black/[0.03] blur-[140px] rounded-full pointer-events-none" />

      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-black/[0.02] blur-[120px] rounded-full pointer-events-none" />

      {/* HEADER */}
      <div className="mb-12 relative z-10 flex items-end justify-between">

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.5,
          }}
        >
          <span
            style={{
              color: colors.slate,
            }}
            className="text-[9px] font-black uppercase tracking-[0.45em] opacity-60"
          >
            Saved Collection
          </span>

          <h1
            style={{
              color: colors.midnight,
            }}
            className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter leading-none mt-2"
          >
            Wishlist
            <span className="opacity-40">.</span>
          </h1>
        </motion.div>

        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            delay: 0.2,
          }}
          style={{
            color: colors.slate,
          }}
          className="text-[9px] font-bold uppercase tracking-[0.3em] opacity-50"
        >
          {wishlist.length} Saved Pieces
        </motion.div>
      </div>

      {/* EMPTY STATE */}
      {wishlist.length === 0 ? (
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.96,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          transition={{
            duration: 0.5,
          }}
          style={{
            backgroundColor:
              colors.studioWhite,
            borderColor: colors.divider,
          }}
          className="relative overflow-hidden text-center py-36 border-2 border-dashed rounded-[3rem] backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.05)]"
        >

          {/* LIGHT EFFECT */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/[0.01] to-transparent pointer-events-none" />

          <motion.div
            animate={{
              y: [0, -8, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 3,
            }}
          >
            <Heart
              size={42}
              style={{
                color: colors.divider,
              }}
              className="mx-auto mb-6"
            />
          </motion.div>

          <p
            style={{
              color: colors.slate,
            }}
            className="text-[10px] font-black uppercase tracking-[0.35em] opacity-60"
          >
            Your Wishlist Is Empty
          </p>

          <motion.button
            whileHover={{
              y: -3,
              scale: 1.02,
            }}
            whileTap={{
              scale: 0.97,
            }}
            onClick={() =>navigate(`/products/${item.productId?._id}`)
            }
            style={{
              backgroundColor:
                colors.midnight,
            }}
            className="group relative overflow-hidden mt-8 inline-flex items-center gap-3 px-10 py-4 text-white text-[9px] font-black uppercase tracking-[0.25em] rounded-full shadow-[0_15px_35px_rgba(0,0,0,0.18)]"
          >

            {/* SHINE */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-120%] group-hover:translate-x-[120%] transition duration-1000" />

            Explore Collection

            <ArrowRight size={14} />
          </motion.button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6 relative z-10">

          <AnimatePresence mode="popLayout">
            {wishlist.map((item, index) => (
              <motion.div
                layout
                key={item.id}
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
                  scale: 0.9,
                }}
                transition={{
                  duration: 0.45,
                  delay: index * 0.03,
                }}
                whileHover={{
                  y: -8,
                }}
                className="relative group cursor-pointer"
                onClick={() =>
                  navigate(`/products/${item.productId?._id}`)
                }
              >

                {/* CARD */}
                <div
                  style={{
                    backgroundColor:
                      colors.studioWhite,
                    borderColor:
                      colors.divider,
                  }}
                  className="relative overflow-hidden aspect-[4/5] rounded-[2.2rem] mb-4 border bg-white/90 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_25px_50px_rgba(0,0,0,0.08)] transition-all duration-700"
                >

                  {/* IMAGE */}
                  <div className="absolute inset-0 overflow-hidden">
                    <img
                      src={item.productId.image}
                      alt={item.productId?.name}
                      className="w-full h-full object-cover scale-[1.02] grayscale-[10%] transition-all duration-700 group-hover:scale-110 group-hover:grayscale-0"
                    />
                  </div>

                  {/* OVERLAY */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700" />

                  {/* LIGHT EFFECT */}
                  <div className="absolute -top-20 -right-20 w-44 h-44 bg-white/20 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700" />

                  {/* REMOVE */}
                  <motion.button
                    whileHover={{
                      scale: 1.08,
                      y: -2,
                    }}
                    whileTap={{
                      scale: 0.9,
                    }}
                      onClick={(e) => {
                          e.stopPropagation();
                          removeFromWishlist(item.productId?._id);
                        }}
                    style={{
                      color: colors.midnight,
                    }}
                    className="absolute top-4 right-4 p-2.5 bg-white/80 backdrop-blur-xl rounded-full shadow-xl z-10 hover:bg-white transition-all duration-300"
                  >
                    <X size={14} />
                  </motion.button>

                  {/* CATEGORY TAG */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="bg-white/80 backdrop-blur-xl px-3 py-1 rounded-full text-[7px] font-black uppercase tracking-[0.25em] border border-white/40">
                      Saved
                    </span>
                  </div>

                  {/* MOVE TO BAG */}
                  <motion.button
                    whileHover={{
                      scale: 1.02,
                    }}
                    whileTap={{
                      scale: 0.97,
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(item);
                    }}
                    style={{
                      backgroundColor:
                        colors.midnight,
                    }}
                    className="group/btn absolute bottom-4 left-4 right-4 py-3 text-white text-[8px] font-black uppercase tracking-[0.25em] rounded-full opacity-0 translate-y-6 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center gap-2 z-10 shadow-[0_15px_35px_rgba(0,0,0,0.18)] overflow-hidden"
                  >

                    {/* SHINE */}
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-120%] group-hover/btn:translate-x-[120%] transition duration-1000" />

                    <ShoppingBag size={12} />

                    Move to Bag
                  </motion.button>
                </div>

                {/* DETAILS */}
                <div className="px-1">
                  <h3
                    style={{
                      color: colors.midnight,
                    }}
                    className="text-[11px] font-black uppercase tracking-tight truncate transition-all duration-300 group-hover:tracking-wide group-hover:opacity-60"
                  >
                    {item.productId?.name}
                  </h3>

                  <div className="flex items-center justify-between mt-1">
                    <span
                      style={{
                        color: colors.midnight,
                      }}
                      className="font-black text-sm tracking-tight italic"
                    >
                      {item.productId?.Discounted_price}
                    </span>

                    <span
                      style={{
                        color: colors.slate,
                      }}
                      className="text-[7px] font-bold uppercase tracking-[0.2em] opacity-40"
                    >
                      Studio
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default WishlistPage;