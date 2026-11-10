import { motion } from "framer-motion";
import React, { useState } from "react";
import axios from "axios";


import {
  X,
  Mail,
  Lock,
  User,
  ArrowRight,
  Phone,
} from "lucide-react";

const SignupModal = ({
  isOpen,
  onClose,
  onSwitch,
}) => {
 
  // const {signOut}=useClerk();
  const [formData, setFormData] = useState({
      name: "",
      email: "",
      phone: "",
      refferalCode: "",
});
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState("");
const [loading,setLoading]=useState(false);
  const { signUp, isLoaded, setActive } = useSignUp();
  const colors = {
    studioWhite: "#FDFDFD",
    midnight: "#111111",
    slate: "#666666",
    divider: "#EEEEEE",
  };
  const resetSignupState = async () => {
  setShowOtp(false);
  setOtp("");
  setLoading(false);

  setFormData({
    name: "",
    email: "",
    phone: "",
    refferalCode: "",
    countryCode: "+91",
  });

  
};
const handleSignup = async (e) => {
  e.preventDefault();

  if (!isLoaded) return;

  try {
   

    const result = await signUp.create({
      emailAddress: formData.email,
      firstName: formData.name,
      username: formData.email.split("@")[0],
    });

   
  } catch (err) {
    console.log(err);
  }
};
const resendOtp = async () => {
  try {

    setLoading(true);

    await signUp.prepareEmailAddressVerification({
      strategy: "email_code",
    });

    setOtp("");

    alert(
      "New OTP sent successfully. Enter the latest OTP."
    );

  } catch (err) {

    alert(
      err.errors?.[0]?.message ||
      "Failed to resend OTP"
    );

  } finally {
    setLoading(false);
  }
};


if (!isOpen) return null;
if (showOtp) {
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center">
      <div className="bg-white p-8 rounded-3xl w-[400px]">

        <h2 className="text-xl font-bold mb-6">
          Verify Email
        </h2>

        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full border p-3 rounded-xl mb-4"
        />

        <button
          disabled={loading}
          onClick={verifyOtp}
          className="w-full bg-black text-white py-3 rounded-xl disabled:opacity-50"
          >
          {
          loading
          ? "VERIFYING..."
          : "VERIFY OTP"
          }
          </button>

          <button
          disabled={loading}
          onClick={resendOtp}
          className="w-full mt-3 border py-3 rounded-xl disabled:opacity-50"
          >
          Resend OTP
          </button>

      </div>
    </div>
  );
}

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">

      {/* BACKDROP */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={async () => {
          await resetSignupState();
          onClose();
        }}
        style={{
          backgroundColor:
            "rgba(0, 0, 0, 0.4)",
        }}
        className="absolute inset-0 backdrop-blur-md"
      />

      {/* MODAL */}
      <motion.div
        initial={{
          scale: 0.9,
          opacity: 0,
          y: 20,
        }}
        animate={{
          scale: 1,
          opacity: 1,
          y: 0,
        }}
        exit={{
          scale: 0.9,
          opacity: 0,
          y: 20,
        }}
        transition={{
          type: "spring",
          damping: 25,
          stiffness: 300,
        }}
        style={{
          backgroundColor: "#ffffff",
        }}
        className="relative w-full max-w-[400px] rounded-[2.5rem] p-10 shadow-2xl border border-black/5"
      >

        {/* CLOSE BUTTON */}
        <button
           onClick={async () => {
                await resetSignupState();
                onClose();
              }}
          style={{
            color: colors.midnight,
          }}
          className="absolute top-8 right-8 opacity-20 hover:opacity-100 transition-opacity"
        >
          <X size={20} />
        </button>

        {/* HEADER */}
        <div className="text-center mb-10">
          <h2
            style={{
              color: colors.midnight,
            }}
            className="text-2xl font-black uppercase tracking-tighter italic"
          >
            Sattiyas<span>.</span>
          </h2>

          <p
            style={{
              color: colors.slate,
            }}
            className="text-[10px] font-bold uppercase tracking-[0.3em] mt-2 opacity-60"
          >
            Create Studio Account
          </p>
        </div>
        
        {/* FORM */}
        <form
          onSubmit={handleSignup}
          className="space-y-6"
        >

          {/* NAME */}
          <div
            style={{
              borderColor:
                colors.divider,
            }}
            className="relative border-b pb-3 flex items-center gap-3 group"
          >
            <User
              size={16}
              style={{
                color:
                  colors.midnight,
              }}
              className="opacity-20 group-focus-within:opacity-100 transition-opacity"
            />

            <input
              required
              type="text"
              placeholder="FULL NAME"
              value={formData.name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  name:
                    e.target.value,
                })
              }
              style={{
                color:
                  colors.midnight,
              }}
              className="bg-transparent flex-1 outline-none text-[10px] font-bold tracking-widest uppercase placeholder:text-gray-300"
            />
          </div>

          {/* EMAIL */}
          <div
            style={{
              borderColor:
                colors.divider,
            }}
            className="relative border-b pb-3 flex items-center gap-3 group"
          >
            <Mail
              size={16}
              style={{
                color:
                  colors.midnight,
              }}
              className="opacity-20 group-focus-within:opacity-100 transition-opacity"
            />

            <input
              required
              type="email"
              placeholder="EMAIL ADDRESS"
              value={formData.email}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  email:
                    e.target.value,
                })
              }
              style={{
                color:
                  colors.midnight,
              }}
              className="bg-transparent flex-1 outline-none text-[10px] font-bold tracking-widest uppercase placeholder:text-gray-300"
            />
          </div>

          {/* PHONE NUMBER */}
 {/* PHONE NUMBER */}
<div
  style={{
    borderColor:
      colors.divider,
  }}
  className="relative border-b pb-3 flex items-center gap-3 group"
>
  <Phone
    size={16}
    style={{
      color:
        colors.midnight,
    }}
    className="opacity-20 group-focus-within:opacity-100 transition-opacity"
  />

  {/* COUNTRY CODE */}
  <select
    value={formData.countryCode || "+91"}
    onChange={(e) =>
      setFormData({
        ...formData,
        countryCode:
          e.target.value,
      })
    }
    className="bg-transparent outline-none text-[10px] font-bold tracking-widest uppercase pr-2"
    style={{
      color:
        colors.midnight,
    }}
  >
    <option value="+91">
      +91
    </option>

    <option value="+1">
      +1
    </option>

    <option value="+44">
      +44
    </option>

    <option value="+971">
      +971
    </option>

    <option value="+61">
      +61
    </option>
  </select>

  {/* INPUT */}
  <input
    required
    type="tel"
    placeholder="PHONE NUMBER"
    value={formData.phone}
    maxLength={10}
    onChange={(e) =>
      setFormData({
        ...formData,
        phone:
          e.target.value
            .replace(/\D/g, "")
            .slice(0, 10),
      })
    }
    style={{
      color:
        colors.midnight,
    }}
    className="bg-transparent flex-1 outline-none text-[10px] font-bold tracking-widest uppercase placeholder:text-gray-300"
  />
</div>
          {/* PASSWORD */}
          <div
            style={{
              borderColor:
                colors.divider,
            }}
            className="relative border-b pb-3 flex items-center gap-3 group"
          >
            <Lock
              size={16}
              style={{
                color:
                  colors.midnight,
              }}
              className="opacity-20 group-focus-within:opacity-100 transition-opacity"
            />

            <input
        type="text"
        placeholder="Referral Code (Optional)"
        value={formData.refferalCode}
        onChange={(e) =>
          setFormData({
            ...formData,
            refferalCode: e.target.value,
          })
        }
        style={{
          color: colors.midnight,
        }}
        className="bg-transparent flex-1 outline-none text-[10px] font-bold tracking-widest uppercase placeholder:text-gray-300"
      />
          </div>
           <div id="clerk-captcha"></div>
          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            style={{
              backgroundColor:
                colors.midnight,
            }}
            className="w-full text-white py-4 rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-xl shadow-black/10"
          >
            Create account

            <ArrowRight size={14} />
          </button>
        </form>

        {/* LOGIN SWITCH */}
        <div
          className="mt-10 text-center border-t pt-6"
          style={{
            borderColor:
              colors.divider,
          }}
        >
          <button
            type="button"
            onClick={onSwitch}
            style={{
              color: colors.slate,
            }}
            className="text-[9px] font-bold uppercase tracking-widest hover:text-black transition-colors opacity-60 hover:opacity-100"
          >
            Already a member? Login Here
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default SignupModal;