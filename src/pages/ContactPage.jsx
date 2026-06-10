import React, { useState, useRef, forwardRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Send, Phone } from "lucide-react";
import axios from "axios";
const ContactPage = () => {
  
  const colors = {
    studioWhite: "#FDFDFD", 
    midnight: "#111111", 
    slate: "#666666",      
    divider: "#EEEEEE",   
  };
  const [formData,setFormData]=useState({
    name:"",
    email:"",
    message:""

  })
  const handleChange=(e)=>{
    setFormData({
      ...formData,
      [e.target.name]:e.target.value,
    });
  };
  const handleSubmit=async(e)=>{
    e.preventDefault();
    try{
      const response=await axios.post(
          "https://sattiyash-backend.onrender.com/createcontact",
          formData,
          {
            withCredentials: true,
          }
        );
      console.log(response.data);
      alert("Message sent successfully")
      setFormData({
        name:"",
        email:"",
        message:"",
      });
    }catch(error){
      console.log(error);
    
    }
  }
  return (
    <div className="min-h-screen lg:ml-[220px] bg-white font-jakarta pt-20">
   
      <div className="py-12 px-6 md:px-12 border-b" style={{ borderColor: colors.divider }}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl"
        >
          <span style={{ color: colors.slate }} className="text-[10px] font-black uppercase tracking-[0.4em] mb-4 block opacity-60">Get In Touch</span>
          <h1 style={{ color: colors.midnight }} className="text-4xl md:text-6xl font-black uppercase italic leading-none mb-6">
            Contact Us<span>.</span>
          </h1>
          <p style={{ color: colors.slate }} className="text-sm md:text-base max-w-2xl font-medium leading-relaxed">
            Have a question about our <span className="font-bold italic" style={{ color: colors.midnight }}>Studio Collection</span> or need help with an order? Our team in Jaipur is here to assist you.
          </p>
        </motion.div>
      </div>

      <div className="flex flex-col lg:flex-row">
       
        <div className="w-full lg:w-1/2 p-6 md:p-12 border-r" style={{ borderColor: colors.divider }}>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label style={{ color: colors.midnight }} className="text-[10px] font-black uppercase tracking-widest opacity-60">Full Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange}placeholder="Your Name" style={{ backgroundColor: colors.studioWhite, border: `1px solid ${colors.divider}` }} className="w-full rounded-xl px-5 py-4 text-sm focus:ring-1 focus:ring-black transition-all outline-none" />
              </div>
              <div className="space-y-2">
                <label style={{ color: colors.midnight }} className="text-[10px] font-black uppercase tracking-widest opacity-60">Email Address</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="email@example.com" style={{ backgroundColor: colors.studioWhite, border: `1px solid ${colors.divider}` }} className="w-full rounded-xl px-5 py-4 text-sm focus:ring-1 focus:ring-black transition-all outline-none" />
              </div>
            </div>

            <div className="space-y-2">
              <label style={{ color: colors.midnight }} className="text-[10px] font-black uppercase tracking-widest opacity-60">Message</label>
              <textarea rows="5" name="message" value={formData.message} onChange={handleChange} placeholder="How can we help you?" style={{ backgroundColor: colors.studioWhite, border: `1px solid ${colors.divider}` }} className="w-full rounded-xl px-5 py-4 text-sm focus:ring-1 focus:ring-black transition-all outline-none resize-none"></textarea>
            </div>

            <button 
            type="submit"
              style={{ backgroundColor: colors.midnight }}
              className="w-full py-5 rounded-full text-white text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:opacity-80 transition-all shadow-xl active:scale-95 shadow-black/10"
            >
              <Send size={16} /> Send Message
            </button>
          </form>
        </div>

        <div className="w-full lg:w-1/2 flex flex-col">
       
          <div className="p-6 md:p-12 space-y-8">
            <div className="flex items-start gap-5">
              <div style={{ backgroundColor: colors.studioWhite, border: `1px solid ${colors.divider}` }} className="p-4 rounded-2xl">
                <MapPin size={24} style={{ color: colors.midnight }} />
              </div>
              <div>
                <h4 style={{ color: colors.midnight }} className="text-[11px] font-black uppercase tracking-widest mb-1">Our Studio</h4>
                <p style={{ color: colors.slate }} className="text-sm font-medium leading-relaxed opacity-80">
                  C-Scheme, Near Statue Circle<br />
                  Jaipur, Rajasthan 302001
                </p>
              </div>
            </div>

            <div className="flex items-start gap-5">
              <div style={{ backgroundColor: colors.studioWhite, border: `1px solid ${colors.divider}` }} className="p-4 rounded-2xl">
                <Mail size={24} style={{ color: colors.midnight }} />
              </div>
              <div>
                <h4 style={{ color: colors.midnight }} className="text-[11px] font-black uppercase tracking-widest mb-1">Email Support</h4>
                <p style={{ color: colors.slate }} className="text-sm font-medium opacity-80">hello@sattiyas.com</p>
              </div>
            </div>

            <div className="flex items-start gap-5">
              <div style={{ backgroundColor: colors.studioWhite, border: `1px solid ${colors.divider}` }} className="p-4 rounded-2xl">
                <Phone size={24} style={{ color: colors.midnight }} />
              </div>
              <div>
                <h4 style={{ color: colors.midnight }} className="text-[11px] font-black uppercase tracking-widest mb-1">Call Us</h4>
                <p style={{ color: colors.slate }} className="text-sm font-medium opacity-80">+91 98765 43210</p>
              </div>
            </div>
          </div>

          <div className="flex-1 min-h-[350px] w-full grayscale contrast-125 opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-1000">
            <iframe 
              title="Jaipur Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d113911.30971033235!2d75.71111666991097!3d26.84838615694291!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396db61232b11511%3A0xf3a02796195727a!2sJaipur%2C%20Rajasthan!5e0!3m2!1sen!2sin!4v1711894000000!5m2!1sen!2sin" 
              className="w-full h-full border-none"
              allowFullScreen="" 
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;