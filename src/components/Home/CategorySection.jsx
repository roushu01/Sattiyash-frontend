import React, { useState,useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useSearchParams, useParams } from "react-router-dom";
import {
  Truck,
  CreditCard,
  Headphones,
  ShieldCheck,
  ArrowUpRight,
  ChevronRight,
} from "lucide-react";
import axios from "axios";
const Features = [
  { icon: Truck, title: "FREE SHIPPING", desc: "On all clothing", num: "01" },
  {
    icon: CreditCard,
    title: "EASY PAYMENT",
    desc: "Secure checkout",
    num: "02",
  },
  {
    icon: Headphones,
    title: "24/7 SUPPORT",
    desc: "Stylist assistance",
    num: "03",
  },
  {
    icon: ShieldCheck,
    title: "QUALITY CHECK",
    desc: "Premium fabrics",
    num: "04",
  },
];

const Categories = [
  {
    name: "ESSENTIAL",
    sub: "TOP WEAR",
    img: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=800", // Oversized Tee Image
    tag: "Oversized & Shirts",
    count: "150+ styles",
    query: "topwear",
  },
  {
    name: "SIGNATURE",
    sub: "BOTTOM WEAR",
    img: "https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=800", // Baggy Jeans Image
    tag: "Jeans & Cargos",
    count: "120+ styles",
    query: "bottomwear",
  },
  {
    name: "SEASONAL",
    sub: "Hoodies & Jackets",
    img: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800", // Hoodie/Trending Image
    tag: "New Arrivals",
    count: "80+ styles",
    query: "Hoodies & Jackets",
  },
];

const CategorySection = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const navigate = useNavigate();

  const colors = {
    studioWhite: "#FDFDFD", 
    midnight: "#111111",    
    slate: "#666666",       
    divider: "#EEEEEE",     
  };
 const handleCategoryClick = (categoryQuery) => {
    navigate(
 `/products/category/${encodeURIComponent(categoryQuery)}`
)
  };
  const { category } = useParams();
  const [product,setProducts]=useState([]);

  useEffect(() => {
  if (!category) return;

  const fetchProducts = async () => {
    try {
      console.log("Fetching:", category);

      const response = await axios.get(
        `https://sattiyash-backend.onrender.com/getproductbycategory/${encodeURIComponent(category)}`
      );

      setProducts(response.data.products);

    } catch (error) {
      console.log(error);
    }
  };

  fetchProducts();

}, [category]);
  return (
    <section
      style={{ backgroundColor: "#ffffff" }}
      className="lg:ml-[220px] pt-16 min-h-screen font-jakarta overflow-hidden relative"
    >
    
      <div
        className="absolute top-32 left-1/2 -translate-x-1/2 text-[clamp(60px,12vw,140px)] font-black italic tracking-tighter select-none pointer-events-none z-0 text-transparent whitespace-nowrap"
        style={{ WebkitTextStroke: `1px ${colors.midnight}08` }}
      >
        CLOTHING
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative z-10 px-4 md:px-10 pt-8"
      >
        <div
          style={{ backgroundColor: colors.studioWhite }}
          className="max-w-7xl mx-auto rounded-3xl overflow-hidden grid grid-cols-2 lg:grid-cols-4 border border-black/5 shadow-sm"
        >
          {Features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className={`flex items-center gap-3 px-5 py-6 relative transition-colors hover:bg-white 
                  ${i < Features.length - 1 ? "border-r" : ""} 
                  ${i < 2 ? "border-b lg:border-b-0" : ""}`}
                style={{ borderColor: colors.divider }}
              >
                <div
                  style={{ backgroundColor: colors.midnight }}
                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                >
                  <Icon size={18} color="#fff" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] font-black tracking-widest uppercase italic" style={{ color: colors.midnight }}>
                    {f.title}
                  </div>
                  <div
                    style={{ color: colors.slate }}
                    className="text-[9px] mt-0.5 uppercase opacity-70"
                  >
                    {f.desc}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 md:px-10 pt-16 pb-8 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-8 h-[2px]"
              style={{ backgroundColor: colors.midnight }}
            />
            <span
              style={{ color: colors.slate }}
              className="text-[10px] font-black tracking-[0.4em] uppercase"
            >
              Studio Edition
            </span>
          </div>
          <h2
            style={{ color: colors.midnight }}
            className="text-[clamp(32px,6vw,56px)] font-black italic tracking-tighter leading-none uppercase"
          >
            The{" "}
            <span style={{ color: colors.slate }} className="font-light not-italic">
              Collections.
            </span>
          </h2>
        </motion.div>

        <motion.button
          onClick={() => navigate("/products")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{ backgroundColor: colors.midnight }}
          className="flex items-center gap-3 text-white px-8 py-3.5 rounded-full text-[10px] font-black tracking-[0.2em] uppercase shadow-xl transition-all"
        >
          Shop All <ChevronRight size={14} />
        </motion.button>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-10 pb-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
        {Categories.map((cat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            onMouseEnter={() => setHoveredCard(i)}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={() => handleCategoryClick(cat.query)}
            className="relative h-[500px] lg:h-[580px] rounded-[2.5rem] overflow-hidden cursor-pointer shadow-2xl border border-black/5 group"
          >
            <motion.img
              src={cat.img}
              alt={cat.name}
              animate={{
                scale: hoveredCard === i ? 1.05 : 1,
                filter:
                  hoveredCard === i ? "brightness(0.8) grayscale(0%)" : "brightness(0.6) grayscale(15%)",
              }}
              className="absolute inset-0 w-full h-full object-cover transition-all duration-700"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-" />

            <div className="absolute inset-0 z-10 p-8 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <span className="bg-white/10 backdrop-blur-md border border-white/20 text-white text-[8px] font-black tracking-widest px-4 py-2 rounded-full uppercase">
                  {cat.tag}
                </span>
                <div className="bg-white w-10 h-10 rounded-full flex items-center justify-center shadow-2xl group-hover:rotate-45 transition-transform duration-500">
                  <ArrowUpRight
                    size={18}
                    color={colors.midnight}
                    strokeWidth={3}
                  />
                </div>
              </div>

              <div>
                <motion.div
                  animate={{ width: hoveredCard === i ? "100%" : "30px" }}
                  style={{ backgroundColor: "#ffffff" }}
                  className="h-[1.5px] mb-4 rounded-full opacity-50"
                />
                <h3 className="text-white font-black italic text-3xl lg:text-4xl tracking-tighter leading-none uppercase mb-4">
                  {cat.name} <br />
                  <span
                    className="not-italic font-light opacity-80"
                  >
                    {cat.sub}
                  </span>
                </h3>

                <motion.div
                  animate={{
                    opacity: hoveredCard === i ? 1 : 0,
                    y: hoveredCard === i ? 0 : 10,
                  }}
                  className="inline-block"
                >
                  <button
                    style={{
                      backgroundColor: "#ffffff",
                      color: colors.midnight,
                    }}
                    className="px-6 py-3 rounded-full text-[9px] font-black uppercase tracking-widest hover:opacity-90 transition-all"
                  >
                    View Products
                  </button>
                </motion.div>
              </div>
            </div>

            <div className="absolute bottom-4 right-8 text-8xl font-black italic text-white/[0.05] pointer-events-none">
              0{i + 1}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default CategorySection;