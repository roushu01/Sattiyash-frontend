import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import {useSignIn} from "@clerk/clerk-react";
import axios from "axios";
const LoginModal = ({ isOpen, onClose, onSwitch }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState("");
  const {signIn,setActive,isLoaded}=useSignIn();
  const [emailAddressId, setEmailAddressId] = useState("");
  const colors = {
    studioWhite: "#FDFDFD",
    midnight: "#111111",
    slate: "#666666",
    divider: "#EEEEEE",
  };

  const handleLogin = async (e) => {
  e.preventDefault();
  if (!isLoaded) return;

  try {
    const signInAttempt = await signIn.create({
      identifier: formData.email,
    });

    console.log(signInAttempt);

    const emailId = signInAttempt.supportedFirstFactors.find(
      (factor) => factor.strategy === "email_code"
    )?.emailAddressId;

    if (!emailId) {
      throw new Error("EMAIL_NOT_FOUND");
    }

    setEmailAddressId(emailId);

    await signIn.prepareFirstFactor({
      strategy: "email_code",
      emailAddressId: emailId,
    });

    setShowOtp(true);
  } catch (err) {
    console.log(err);

   
    if (
      err?.errors?.[0]?.code === "form_identifier_not_found" ||
      err?.message?.includes("identifier_not_found") ||
      err?.message?.includes("not found")
    ) {
      alert("User not found. Please register first with this email.");
      setIsSignupOpen(true); // open signup modal
      return;
    }

    alert("Login failed. Please try again.");
  }
};
const verifyOtp = async () => {
  try {

    const result = await signIn.attemptFirstFactor({
      strategy: "email_code",
      code: otp,
    });

    console.log(result);

    if (result.status === "complete") {

     

      await axios.post(
        "https://sattiyash-backend.onrender.com/login",
        {
          email: formData.email,
        },
        {
          withCredentials: true,
        }
      );

      alert("Login Successful");
      await setActive({
        session: result.createdSessionId,
      });
      onClose();
    }

  } catch (err) {
    console.log(err);
  }
};
if (showOtp) {
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center">
      <div className="bg-white p-8 rounded-3xl w-[400px]">

        <h2 className="text-xl font-bold mb-6">
          Verify Login OTP
        </h2>

        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full border p-3 rounded-xl mb-4"
        />

        <button
          onClick={verifyOtp}
          className="w-full bg-black text-white py-3 rounded-xl"
        >
          Verify OTP
        </button>

      </div>
    </div>
  );
}
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
   
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}
        className="absolute inset-0 backdrop-blur-md"
      />

      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        style={{ backgroundColor: "#ffffff" }}
        className="relative w-full max-w-[400px] rounded-[2.5rem] p-10 shadow-2xl z- border border-black/5"
      >
        <button
          onClick={onClose}
          style={{ color: colors.midnight }}
          className="absolute top-8 right-8 opacity-20 hover:opacity-100 transition-opacity"
        >
          <X size={20} />
        </button>

        <div className="text-center mb-10">
          <h2
            style={{ color: colors.midnight }}
            className="text-2xl font-black uppercase tracking-tighter italic"
          >
            Sattiyas<span>.</span>
          </h2>
          <p
            style={{ color: colors.slate }}
            className="text-[10px] font-bold uppercase tracking-[0.3em] mt-2 opacity-60"
          >
            Studio Authentication
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div
            style={{ borderColor: colors.divider }}
            className="relative border-b pb-3 flex items-center gap-3 group"
          >
            <Mail
              size={16}
              style={{ color: colors.midnight }}
              className="opacity-20 group-focus-within:opacity-100 transition-opacity"
            />
            <input
              required
              type="email"
              placeholder="EMAIL ADDRESS"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              style={{ color: colors.midnight }}
              className="bg-transparent flex-1 outline-none text-[10px] font-bold tracking-widest uppercase placeholder:text-gray-300"
            />
          </div>

          {/* <div
            style={{ borderColor: colors.divider }}
            className="relative border-b pb-3 flex items-center gap-3 group"
          >
            {/* <Lock
              size={16}
              style={{ color: colors.midnight }}
              className="opacity-20 group-focus-within:opacity-100 transition-opacity"
            /> */}
            {/* Remove the password input field*}
            {/* <input
              required
              type={showPassword ? "text" : "password"}
              placeholder="PASSWORD"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              style={{ color: colors.midnight }}
              className="bg-transparent flex-1 outline-none text-[10px] font-bold tracking-widest uppercase placeholder:text-gray-300"
            /> */}
            {/* <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{ color: colors.midnight }}
              className="opacity-20 hover:opacity-100 transition-opacity"
            >
              {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div> */} 

          <button
            type="submit"
            style={{ backgroundColor: colors.midnight }}
            className="w-full text-white py-4 rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-xl shadow-black/10"
          >
            Sign In <ArrowRight size={14} />
          </button>
        </form>

        <div
          className="mt-10 text-center border-t pt-6"
          style={{ borderColor: colors.divider }}
        >
          <button
            onClick={onSwitch}
            style={{ color: colors.slate }}
            className="text-[9px] font-bold uppercase tracking-widest hover:text-black transition-colors opacity-60 hover:opacity-100"
          >
            New to Sattiyas? Create Account
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginModal;