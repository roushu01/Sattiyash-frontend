import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";

import {
  Wallet,
  Users,
  ArrowUpRight,
  History,
  Copy,
  CheckCircle2,
  ArrowDownLeft,
  Plus,
  Gift,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const ReferPage = () => {
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const [referralData,setReferralData]=useState(null);
  const colors = {
    studioWhite: "#FDFDFD",
    midnight: "#111111",
    slate: "#666666",
    divider: "#EEEEEE",
  };
 useEffect(()=>{
  fetchReferralData()
 },[]);
 const fetchReferralData = async () => {
  try {
   
      const ans = await axios.get(
        "https://sattiyash-backend.onrender.com/referral-code",
        {
          withCredentials: true,
        }
      );

      setReferralData(ans.data);
    
  } catch (error) {
    console.log(error);
  }
};
  const transactions = [
    {
      id: 1,
      type: "Credit",
      amount: "500",
      date: "24 Mar 2026",
      status: "Completed",
      note: "Referral Bonus",
    },
    {
      id: 2,
      type: "Debit",
      amount: "1200",
      date: "20 Mar 2026",
      status: "Redeemed",
      note: "Product Purchase",
    },
    {
      id: 3,
      type: "Credit",
      amount: "100",
      date: "15 Mar 2026",
      status: "Completed",
      note: "Signup Bonus",
    },
  ];

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralData?.referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  const handleInvite = async () => {
  const shareData = {
    title: "Join Sattiyas",
    text: "Join Sattiyas and get exclusive studio rewards using my referral code SATTIYAS500",
    url: window.location.origin,
  };

  try {
    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      navigator.clipboard.writeText(
        `${shareData.text} ${shareData.url}`
      );

      alert("Referral link copied!");
    }
  } catch (error) {
    console.log(error);
  }
};

  return (
    <div
      style={{ backgroundColor: colors.studioWhite }}
      className="min-h-screen lg:ml-[220px] pb-24 lg:pb-12 pt-20 lg:pt-12 px-4 md:px-12 font-sans text-[#111] overflow-x-hidden"
    >
      <div className="min-h-screen flex flex-col">
        <header className="mt-auto mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p
              style={{ color: colors.slate }}
              className="mt-4 text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] mb-4"
            >
              Studio Rewards & Network
            </p>
            <h1 className="text-3xl md:text-6xl font-black uppercase tracking-tighter italic leading-none">
              Referral{" "}
              <span className="text-gray-300 font-light">
                Hub<span>.</span>
              </span>
            </h1>
          </motion.div>

         <button
            onClick={handleInvite}
            className="w-fit flex items-center gap-2 text-[10px] font-black uppercase tracking-widest border-b-2 border-black pb-1 hover:opacity-50 transition-all"
          >
            Invite Friends <Plus size={14} />
          </button>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-12">
        
          <motion.div
            whileTap={{ scale: 0.98 }}
            className="p-6 md:p-8 rounded-[2rem] bg-black text-white relative overflow-hidden shadow-xl"
          >
            <Gift size={20} className="opacity-40 mb-8 md:mb-10" />
            <p className="text-[9px] uppercase tracking-widest opacity-60 mb-1 font-bold">
              Reward Points
            </p>
            <div className="flex items-center justify-between">
              <h3 className="text-3xl md:text-4xl font-black tracking-tighter">
                {referralData?.walletBalance||0}{" "}
                <span className="text-[10px] opacity-50 uppercase">pts</span>
              </h3>
              <ArrowUpRight size={18} className="opacity-40" />
            </div>
            <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-white/5 rounded-full blur-2xl"></div>
          </motion.div>

          <div
            style={{ borderColor: colors.divider }}
            className="p-6 md:p-8 rounded-[2rem] border bg-white flex flex-col justify-between"
          >
            <Users
              size={20}
              style={{ color: colors.midnight }}
              className="mb-8 md:mb-10 opacity-30"
            />
            <div>
              <p
                style={{ color: colors.slate }}
                className="text-[9px] uppercase tracking-widest mb-1 font-bold"
              >
                Total Network
              </p>
              <h3 className="text-3xl md:text-4xl font-black tracking-tighter">
                {referralData?.totalReferrals ||0}
              </h3>
            </div>
          </div>

          <div
            style={{ backgroundColor: "#F9F9F9" }}
            className="sm:col-span-2 lg:col-span-1 p-6 md:p-8 rounded-[2rem] flex flex-col justify-center border border-dashed border-gray-200"
          >
            <p
              style={{ color: colors.slate }}
              className="text-[9px] uppercase tracking-[0.2em] mb-4 font-black text-center"
            >
              Your Studio Code
            </p>
            <button
              onClick={copyToClipboard}
              className="w-full flex items-center justify-between bg-white px-5 py-4 rounded-xl border shadow-sm active:scale-95 transition-all group"
            >
              <span className="font-black tracking-[0.1em] text-lg font-mono">
                {referralData?.referralCode}
              
              </span>
              <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-black group-hover:text-white transition-colors">
                {copied ? (
                  <CheckCircle2 size={16} className="text-green-500" />
                ) : (
                  <Copy size={16} />
                )}
              </div>
            </button>
          </div>
        </div>

        <section className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <History size={16} />
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em]">
              History
            </h2>
            <div className="flex-1 h-[1px] bg-gray-100"></div>
          </div>

          <div className="space-y-3">
            {transactions.map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between p-4 md:p-6 rounded-2xl border border-gray-50 bg-white/50"
              >
                <div className="flex items-center gap-3 md:gap-4">
                  <div
                    className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center ${t.type === "Credit" ? "bg-black text-white" : "bg-gray-100 text-gray-400"}`}
                  >
                    {t.type === "Credit" ? (
                      <ArrowDownLeft size={14} />
                    ) : (
                      <ArrowUpRight size={14} />
                    )}
                  </div>
                  <div>
                    <h4 className="font-black text-[10px] md:text-[11px] uppercase leading-tight">
                      {t.note}
                    </h4>
                    <p className="text-[8px] text-gray-400 font-bold uppercase tracking-tighter">
                      {t.date}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-black text-sm md:text-lg tracking-tighter">
                    {t.type === "Credit" ? "+" : "-"}
                    {t.amount}{" "}
                    <span className="text-[8px] opacity-40">PTS</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="bg-[#111] p-8 md:p-14 rounded-[2.5rem] md:rounded-[3.5rem] text-white flex flex-col lg:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden">
          <div className="text-center lg:text-left z-10">
            <h4 className="text-2xl md:text-4xl font-black tracking-tighter uppercase mb-2">
              Share the{" "}
              <span className="text-gray-500 italic font-light">Vibe.</span>
            </h4>
            <p className="text-[8px] text-gray-500 font-black uppercase tracking-[0.3em]">
              10 Points = ₹1.00 Studio Credit
            </p>
          </div>

          <button
            onClick={() => navigate("/products")}
            className="z-10 w-full lg:w-auto bg-white text-black px-10 py-4 rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all active:scale-95"
          >
            Start Shopping
          </button>

          <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
        </div>
      </div>
    </div>
  );
};

export default ReferPage;
