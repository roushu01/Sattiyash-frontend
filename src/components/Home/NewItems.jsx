import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingBag, ArrowRight, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import axios from "axios";



const NewItems = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(4.5);
  const [products,setProducts]=useState([]);
  const [loading,setLoading]=useState(true);

  useEffect(() => {
  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        "https://sattiyash-backend.onrender.com/getProduct"
      );

      console.log(response.data);

      // Adjust according to your backend response
      setProducts(response.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  fetchProducts();
}, []);


  const navigate = useNavigate();
  const { addToCart } = useCart();

  const colors = {
    studioWhite: "#FDFDFD", 
    midnight: "#111111",    
    slate: "#666666",       
    divider: "#EEEEEE",     
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setItemsPerPage(1.2);
      else if (window.innerWidth < 1024) setItemsPerPage(2.5);
      else setItemsPerPage(4.5);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const nextSlide = () => {
    if (currentIndex < products.length - Math.floor(itemsPerPage))
      setCurrentIndex((prev) => prev + 1);
  };

  const prevSlide = () => {
    if (currentIndex > 0) setCurrentIndex((prev) => prev - 1);
  };
if (loading) {
  return (
    <div className="h-screen flex items-center justify-center">
      Loading Products...
    </div>
  );
}
  return (
    <section
      style={{
        backgroundColor: "#ffffff",
        marginLeft: window.innerWidth >= 1024 ? "220px" : "0",
        width: window.innerWidth >= 1024 ? "calc(100% - 220px)" : "100%",
      }}
      className="relative min-h-screen flex flex-col justify-center py-14 px-6 md:px-12 lg:px-16 overflow-hidden font-jakarta"
    >
      <div className="max-w-[1400px] mx-auto w-full">
        <div
          className="flex flex-row justify-between items-end mb-10 border-b pb-6"
          style={{ borderColor: colors.divider }}
        >
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span
                className="w-5 h-[2px]"
                style={{ backgroundColor: colors.midnight }}
              ></span>
              <p
                style={{ color: colors.slate }}
                className="font-black tracking-[0.3em] text-[10px] uppercase"
              >
                Fresh Drop
              </p>
            </div>
            <h2
              style={{ color: colors.midnight }}
              className="text-3xl md:text-5xl font-black leading-none uppercase tracking-tighter"
            >
              New{" "}
              <span style={{ fontWeight: 300, fontStyle: "normal", color: colors.slate }} className="italic">
                Items.
              </span>
            </h2>
          </motion.div>

          <div className="flex gap-2">
            <button
              onClick={prevSlide}
              style={{ borderColor: colors.divider }}
              className="w-10 h-10 flex items-center justify-center rounded-full border hover:bg-black hover:text-white transition-all active:scale-90 disabled:opacity-30 disabled:pointer-events-none"
              disabled={currentIndex === 0}
            >
              <ArrowLeft size={18} />
            </button>
            <button
              onClick={nextSlide}
              style={{ borderColor: colors.divider }}
              className="w-10 h-10 flex items-center justify-center rounded-full border hover:bg-black hover:text-white transition-all active:scale-90 disabled:opacity-30 disabled:pointer-events-none"
              disabled={
                currentIndex >= products.length - Math.floor(itemsPerPage)
              }
            >
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 100 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative mb-20 overflow-hidden"
        >
          <motion.div
            className="flex gap-4 md:gap-6"
            animate={{
              x: `calc(-${currentIndex * (100 / itemsPerPage)}% - ${currentIndex * 24}px)`,
            }}
            transition={{ type: "spring", stiffness: 60, damping: 15 }}
          >
            {products.map((item) => (
              <motion.div
                key={item._id}
                className="min-w-[80%] sm:min-w-[calc(40%-12px)] lg:min-w-[calc(22%-18px)] group"
              >
                <div
                  onClick={() => navigate(`/products/${item._id}`)}
                  style={{ backgroundColor: colors.studioWhite }}
                  className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-black/5 shadow-sm group-hover:shadow-md transition-all cursor-pointer"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover grayscale-[15%] group-hover:grayscale-0 transition-all duration-700"
                  />

                  <div className="absolute bottom-0 left-0 w-full p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <button
                      onClick={async(e)=>{
                        e.stopPropagation();
                        try{
                          console.log("Adding to cart:", item._id);
                          console.log("Product details:", item);
                          const response=await axios.post(
                            "https://sattiyash-backend.onrender.com/addtocart",
                            {
                              productId: item._id
                            },{
                              withCredentials: true
                            }
                          )

                        }catch(error){
                          console.log(error);
                        }
                      }}
                      style={{ backgroundColor: colors.midnight }}
                      className="w-full text-white py-3 rounded-full flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest hover:opacity-90 active:scale-95 shadow-lg transition-all"
                    >
                      <ShoppingBag size={14} /> Quick Add
                    </button>
                  </div>
                </div>

                <div
                  className="mt-4 px-1 flex justify-between items-start cursor-pointer"
                  onClick={() => navigate(`/products/${item._id}`)}
                >
                  <h3
                    style={{ color: colors.midnight }}
                    className="text-[11px] font-bold uppercase truncate pr-2 group-hover:opacity-60 transition-opacity"
                  >
                    {item.name}
                  </h3>
                  <span
                    style={{ color: colors.midnight }}
                    className="font-black text-sm tracking-tighter"
                  >
                    {item.price}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative pt-12 border-t"
          style={{ borderColor: colors.divider }}
        >
          <div className="flex items-center gap-4 mb-10">
            <span
              style={{ color: colors.slate }}
              className="text-[9px] font-bold uppercase tracking-[0.3em] opacity-60"
            >
              Industry Staples
            </span>
            <div
              className="flex-1 h-[1px]"
              style={{ backgroundColor: colors.divider }}
            ></div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default NewItems;