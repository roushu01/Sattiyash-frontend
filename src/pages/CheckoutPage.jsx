
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import axios from "axios";

import {
  ArrowLeft,
  CreditCard,
  Truck,
  ShieldCheck,
  CheckCircle2,
  Gift,
  Minus,
  Plus,
  Tag,
} from "lucide-react";

const API_URL = "https://sattiyash-backend.onrender.com";

const CheckoutPage = () => {
  const location = useLocation();
  const cartItems = location.state?.cartItems || [];

  const navigate = useNavigate();

  const [sizes, setSizes] = useState({});
  const [quantities, setQuantities] = useState({});

  const { cart } = useCart();

  const [walletBalance, setWalletBalance] = useState(0);
  const [useCoins, setUseCoins] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState("card");

  const [giftWrap, setGiftWrap] = useState(false);
  const [donation, setDonation] = useState(false);

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponMessage, setCouponMessage] = useState("");

  const [email, setEmail] = useState("");

  const [address, setAddress] = useState({
    firstName: "",
    lastName: "",
    landmark: "",
    city: "",
    state: "",
    country: "India",
    pincode: "",
  });

  const [loading, setLoading] = useState(false);

  // --------------------------------------------------
  // LOAD RAZORPAY SCRIPT
  // --------------------------------------------------

  useEffect(() => {
    const loadRazorpay = () => {
      return new Promise((resolve) => {
        if (window.Razorpay) {
          resolve(true);
          return;
        }

        const script = document.createElement("script");

        script.src = "https://checkout.razorpay.com/v1/checkout.js";

        script.onload = () => {
          resolve(true);
        };

        script.onerror = () => {
          resolve(false);
        };

        document.body.appendChild(script);
      });
    };

    loadRazorpay();
  }, []);

  // --------------------------------------------------
  // FETCH WALLET BALANCE
  // --------------------------------------------------

  useEffect(() => {
    fetchWalletBalance();
  }, []);

  const fetchWalletBalance = async () => {
    try {
      const res = await axios.get(
        `${API_URL}/referral-code`,
        {
          withCredentials: true,
        }
      );

      setWalletBalance(res.data.walletBalance || 0);
    } catch (error) {
      console.log(error);
    }
  };

  const canUseCoins = walletBalance > 10;

  const walletDiscount =
    useCoins && canUseCoins
      ? Math.floor(walletBalance / 10)
      : 0;

  // --------------------------------------------------
  // UNIQUE PRODUCTS
  // --------------------------------------------------

  const uniqueCart = [
    ...new Map(
      cartItems.map((item) => [
        item.productId._id,
        item,
      ])
    ).values(),
  ];

  // --------------------------------------------------
  // INITIAL SIZE + QUANTITY
  // --------------------------------------------------

  useEffect(() => {
    const initialSizes = {};
    const initialQuantities = {};

    uniqueCart.forEach((item) => {
      initialSizes[item.productId._id] =
        item.size || "M";

      initialQuantities[item.productId._id] =
        item.quantity || 1;
    });

    setSizes(initialSizes);
    setQuantities(initialQuantities);
  }, [cartItems]);

  // --------------------------------------------------
  // SUBTOTAL
  // --------------------------------------------------

  const subtotal = uniqueCart.reduce(
    (total, item) => {
      const price =
        item.productId?.Discounted_price || 0;

      return (
        total +
        price *
          (quantities[item.productId._id] || 1)
      );
    },
    0
  );

  // --------------------------------------------------
  // COUPON
  // --------------------------------------------------

  const applyCoupon = () => {
    const code = couponCode.trim().toUpperCase();

    const coupons = {
      SAVE10: {
        type: "percentage",
        value: 10,
        message: "10% discount applied successfully!",
      },

      WELCOME20: {
        type: "percentage",
        value: 20,
        message: "20% welcome discount applied!",
      },

      FLAT500: {
        type: "flat",
        value: 500,
        message: "₹500 flat discount applied!",
      },

      LUXURY15: {
        type: "percentage",
        value: 15,
        message: "15% luxury discount applied!",
      },
    };

    if (coupons[code]) {
      setAppliedCoupon(coupons[code]);
      setCouponMessage(coupons[code].message);
    } else {
      setAppliedCoupon(null);
      setCouponMessage("Invalid coupon code.");
    }
  };

  // --------------------------------------------------
  // REMOVE COUPON
  // --------------------------------------------------

  const removeCoupon = () => {
    setCouponCode("");
    setAppliedCoupon(null);
    setCouponMessage("");
  };

  // --------------------------------------------------
  // TOTAL CALCULATION
  // --------------------------------------------------

  const giftCharge = giftWrap ? 199 : 0;

  const donationCharge = donation ? 49 : 0;

  const baseTotal =
    subtotal +
    giftCharge +
    donationCharge;

  let discount = 0;

  if (appliedCoupon) {
    if (appliedCoupon.type === "percentage") {
      discount = Math.round(
        (baseTotal * appliedCoupon.value) / 100
      );
    } else if (appliedCoupon.type === "flat") {
      discount = appliedCoupon.value;
    }
  }

  if (discount > baseTotal) {
    discount = baseTotal;
  }

  const totalAfterCoupon =
    baseTotal - discount;

  const finalWalletDiscount =
    walletDiscount > totalAfterCoupon
      ? totalAfterCoupon
      : walletDiscount;

  const grandTotal =
    totalAfterCoupon -
    finalWalletDiscount;

  // --------------------------------------------------
  // BUILD ORDER DATA
  // --------------------------------------------------

  const getOrderData = () => {
    const coinsUsed = useCoins
      ? finalWalletDiscount * 10
      : 0;

    return {
      email,

      products: uniqueCart.map((item) => ({
        productID: item.productId._id,
        quantity:
          quantities[item.productId._id] || 1,
        size: String(
          sizes[item.productId._id]
        ).toUpperCase(),
      })),

      shippingAddress: {
        firstName: address.firstName,
        lastName: address.lastName,
        address: address.landmark,
        city: address.city,
        state: address.state,
        country: address.country,
        pincode: address.pincode,
      },

      totalAmount: grandTotal,

      coins: coinsUsed,
    };
  };

  // --------------------------------------------------
  // COD ORDER
  // --------------------------------------------------

  const createCODOrder = async () => {
    try {
      setLoading(true);

      const orderData = {
        ...getOrderData(),

        paymentMethod: "COD",

        paymentStatus: "Pending",

        orderStatus: "Pending",
      };

      const response = await axios.post(
        `${API_URL}/order`,
        orderData,
        {
          withCredentials: true,
        }
      );

      alert(
        response.data.message ||
          "Order placed successfully!"
      );

      navigate("/orders");
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
          "Order creation failed"
      );
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // RAZORPAY PAYMENT
  // --------------------------------------------------

  const handleRazorpayPayment = async () => {
    try {
      setLoading(true);

      // Check Razorpay script
      if (!window.Razorpay) {
        alert(
          "Razorpay failed to load. Please refresh the page."
        );

        setLoading(false);
        return;
      }

      // ------------------------------------------------
      // STEP 1:
      // CREATE RAZORPAY ORDER FROM BACKEND
      // ------------------------------------------------

      const paymentOrderResponse =
        await axios.post(
          `${API_URL}/create-payment-order`,
          {
            amount: grandTotal,
          },
          {
            withCredentials: true,
          }
        );

      const razorpayOrder =
        paymentOrderResponse.data;

      console.log(
        "Razorpay Order:",
        razorpayOrder
      );

      // ------------------------------------------------
      // STEP 2:
      // OPEN RAZORPAY CHECKOUT
      // ------------------------------------------------

      const options = {
        key: razorpayOrder.key,

        amount: razorpayOrder.amount,

        currency:
          razorpayOrder.currency || "INR",

        name: "Sattiyash",

        description:
          "Sattiyash Fashion Order",

        order_id:
          razorpayOrder.id,

        prefill: {
          email: email,
        },

        theme: {
          color: "#000000",
        },

        handler: async function (response) {
          console.log(
            "Razorpay Payment Response:",
            response
          );

          // ------------------------------------------------
          // STEP 3:
          // VERIFY PAYMENT ON BACKEND
          // ------------------------------------------------

          try {
            const verifyResponse =
              await axios.post(
                `${API_URL}/verify-payment`,
                {
                  razorpay_order_id:
                    response.razorpay_order_id,

                  razorpay_payment_id:
                    response.razorpay_payment_id,

                  razorpay_signature:
                    response.razorpay_signature,

                  orderData: getOrderData(),
                },
                {
                  withCredentials: true,
                }
              );

            console.log(
              "Payment Verification:",
              verifyResponse.data
            );

            if (
              verifyResponse.data.success
            ) {
              alert(
                "Payment successful! Your order has been placed."
              );

              navigate("/orders");
            } else {
              alert(
                "Payment verification failed."
              );
            }
          } catch (error) {
            console.log(
              "Payment verification error:",
              error
            );

            alert(
              error.response?.data?.message ||
                "Payment verification failed."
            );
          } finally {
            setLoading(false);
          }
        },

        modal: {
          ondismiss: function () {
            console.log(
              "Razorpay payment popup closed"
            );

            setLoading(false);
          },
        },
      };

      const razorpay =
        new window.Razorpay(options);

      // Payment failure
      razorpay.on(
        "payment.failed",
        function (response) {
          console.log(
            "Payment Failed:",
            response
          );

          alert(
            response.error?.description ||
              "Payment failed. Please try again."
          );

          setLoading(false);
        }
      );

      razorpay.open();
    } catch (error) {
      console.log(
        "Razorpay order creation error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Unable to start payment."
      );

      setLoading(false);
    }
  };

  // --------------------------------------------------
  // MAIN ORDER BUTTON
  // --------------------------------------------------

  const createOrder = async () => {
    // Basic validation
    if (!email) {
      alert("Please enter your email address.");
      return;
    }

    if (!address.firstName) {
      alert("Please enter your first name.");
      return;
    }

    if (!address.lastName) {
      alert("Please enter your last name.");
      return;
    }

    if (!address.landmark) {
      alert("Please enter your address.");
      return;
    }

    if (!address.city) {
      alert("Please enter your city.");
      return;
    }

    if (!address.state) {
      alert("Please enter your state.");
      return;
    }

    if (!address.pincode) {
      alert("Please enter your pincode.");
      return;
    }

    if (grandTotal <= 0) {
      alert("Invalid order amount.");
      return;
    }

    // COD
    if (paymentMethod === "cod") {
      await createCODOrder();
      return;
    }

    // CARD / UPI
    await handleRazorpayPayment();
  };

  // --------------------------------------------------
  // EMPTY CART
  // --------------------------------------------------

  if (cartItems.length === 0) {
    return (
      <div className="h-screen flex flex-col items-center justify-center lg:ml-[220px] bg-[#FDFDFD]">
        <h2 className="text-sm font-black uppercase tracking-widest text-gray-300 mb-6">
          Your bag is empty
        </h2>

        <button
          onClick={() =>
            navigate("/products")
          }
          className="px-8 py-4 rounded-full bg-black text-white text-[10px] font-black uppercase tracking-widest"
        >
          Go Shopping
        </button>
      </div>
    );
  }

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <div className="min-h-screen lg:ml-[220px] bg-[#F8F8F8] font-jakarta pt-24 pb-20 px-4 sm:px-6 md:px-12 relative overflow-hidden overflow-y-auto custom-scrollbar">

      {/* BACKGROUND */}

      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-black/[0.03] blur-[140px] rounded-full pointer-events-none" />

      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-black/[0.02] blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* BACK */}

        <motion.button
          initial={{
            opacity: 0,
            x: -20,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          onClick={() =>
            navigate(-1)
          }
          className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest mb-10 opacity-50 hover:opacity-100 transition-all duration-300"
        >
          <ArrowLeft size={14} />
          Back to Bag
        </motion.button>

        <div className="flex flex-col xl:flex-row gap-10 xl:gap-12 items-start w-full">

          {/* LEFT */}

          <motion.div
            initial={{
              opacity: 0,
              y: 30,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="flex-1 space-y-12 w-full min-w-0"
          >

            {/* CONTACT */}

            <section>

              <h2 className="text-[11px] font-black uppercase tracking-[0.35em] mb-8 flex items-center gap-4">

                <span className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center text-[10px]">
                  01
                </span>

                Contact Details

              </h2>

              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="Email Address for Invoice"
                className="w-full rounded-[1.7rem] px-5 md:px-6 py-4 md:py-5 text-sm md:text-xs outline-none border border-black/10 bg-white shadow-sm"
              />

            </section>

            {/* SHIPPING */}

            <section>

              <h2 className="text-[11px] font-black uppercase tracking-[0.35em] mb-8 flex items-center gap-4">

                <span className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center text-[10px]">
                  02
                </span>

                Shipping Address

              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">

                <input
                  type="text"
                  placeholder="First Name"
                  value={address.firstName}
                  onChange={(e) =>
                    setAddress({
                      ...address,
                      firstName:
                        e.target.value,
                    })
                  }
                  className="w-full rounded-[1.7rem] px-5 md:px-6 py-4 md:py-5 text-sm md:text-xs outline-none border border-black/10 bg-white shadow-sm"
                />

                <input
                  type="text"
                  placeholder="Last Name"
                  value={address.lastName}
                  onChange={(e) =>
                    setAddress({
                      ...address,
                      lastName:
                        e.target.value,
                    })
                  }
                  className="w-full rounded-[1.7rem] px-5 md:px-6 py-4 md:py-5 text-sm md:text-xs outline-none border border-black/10 bg-white shadow-sm"
                />

                <input
                  type="text"
                  placeholder="Address / House No."
                  value={address.landmark}
                  onChange={(e) =>
                    setAddress({
                      ...address,
                      landmark:
                        e.target.value,
                    })
                  }
                  className="sm:col-span-2 w-full rounded-[1.7rem] px-5 md:px-6 py-4 md:py-5 text-sm md:text-xs outline-none border border-black/10 bg-white shadow-sm"
                />

                <input
                  type="text"
                  placeholder="City"
                  value={address.city}
                  onChange={(e) =>
                    setAddress({
                      ...address,
                      city: e.target.value,
                    })
                  }
                  className="w-full rounded-[1.7rem] px-5 md:px-6 py-4 md:py-5 text-sm md:text-xs outline-none border border-black/10 bg-white shadow-sm"
                />

                <input
                  type="text"
                  placeholder="Pincode"
                  value={address.pincode}
                  onChange={(e) =>
                    setAddress({
                      ...address,
                      pincode:
                        e.target.value,
                    })
                  }
                  className="w-full rounded-[1.7rem] px-5 md:px-6 py-4 md:py-5 text-sm md:text-xs outline-none border border-black/10 bg-white shadow-sm"
                />

                <input
                  type="text"
                  placeholder="State"
                  value={address.state}
                  onChange={(e) =>
                    setAddress({
                      ...address,
                      state: e.target.value,
                    })
                  }
                  className="sm:col-span-2 w-full rounded-[1.7rem] px-5 md:px-6 py-4 md:py-5 text-sm md:text-xs outline-none border border-black/10 bg-white shadow-sm"
                />

              </div>

            </section>

            {/* PAYMENT */}

            <section>

              <h2 className="text-[11px] font-black uppercase tracking-[0.35em] mb-8 flex items-center gap-4">

                <span className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center text-[10px]">
                  03
                </span>

                Payment Method

              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">

                {/* CARD / UPI */}

                <motion.div
                  whileTap={{
                    scale: 0.98,
                  }}
                  whileHover={{
                    y: -6,
                    scale: 1.01,
                  }}
                  onClick={() =>
                    setPaymentMethod("card")
                  }
                  className={`w-full min-h-[120px] md:min-h-[140px] p-5 md:p-7 rounded-[2rem] border-2 cursor-pointer transition-all duration-500 flex items-center gap-4 justify-center ${
                    paymentMethod === "card"
                      ? "border-black bg-white shadow-xl"
                      : "border-black/10 bg-white/70"
                  }`}
                >

                  <CreditCard size={20} />

                  <span className="text-[10px] font-black uppercase tracking-widest">
                    Card / UPI
                  </span>

                </motion.div>

                {/* COD */}

                <motion.div
                  whileTap={{
                    scale: 0.98,
                  }}
                  whileHover={{
                    y: -6,
                    scale: 1.01,
                  }}
                  onClick={() =>
                    setPaymentMethod("cod")
                  }
                  className={`w-full min-h-[120px] md:min-h-[140px] p-5 md:p-7 rounded-[2rem] border-2 cursor-pointer transition-all duration-500 flex items-center gap-4 justify-center ${
                    paymentMethod === "cod"
                      ? "border-black bg-white shadow-xl"
                      : "border-black/10 bg-white/70"
                  }`}
                >

                  <Truck size={20} />

                  <span className="text-[10px] font-black uppercase tracking-widest">
                    Cash on Delivery
                  </span>

                </motion.div>

              </div>

            </section>

          </motion.div>

          {/* RIGHT */}

          <motion.div
            initial={{
              opacity: 0,
              x: 30,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            className="w-full xl:w-[520px] shrink-0 min-w-0"
          >

            <div className="overflow-hidden p-5 sm:p-6 md:p-8 rounded-[2.5rem] md:rounded-[3rem] border border-black/5 relative xl:sticky xl:top-28 bg-white/95 backdrop-blur-3xl shadow-[0_20px_80px_rgba(0,0,0,0.06)]">

              <h2 className="text-[14px] font-black uppercase mb-8 tracking-[0.25em] border-b border-black/10 pb-6">
                Order Summary
              </h2>

              {/* PRODUCTS */}

              <div className="space-y-5 max-h-none xl:max-h-[75vh] overflow-visible xl:overflow-y-auto pr-0 xl:pr-2 custom-scrollbar">

                {uniqueCart.map(
                  (item, idx) => (

                    <motion.div
                      key={idx}
                      whileHover={{
                        y: -4,
                      }}
                      className="border border-black/5 rounded-[2rem] md:rounded-[2.5rem] p-4 md:p-5 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.03)]"
                    >

                      <div className="flex flex-col sm:flex-row gap-5">

                        {/* IMAGE */}

                        <div className="w-full sm:w-24 h-[240px] sm:h-28 rounded-[1.5rem] overflow-hidden bg-[#f4f4f4] shrink-0">

                          <img
                            src={
                              item.productId?.image
                            }
                            className="w-full h-full object-cover"
                            alt={
                              item.productId?.name
                            }
                          />

                        </div>

                        {/* DETAILS */}

                        <div className="flex-1">

                          <p className="text-[16px] sm:text-[13px] font-black uppercase mb-2 leading-tight">
                            {item.productId?.name}
                          </p>

                          <p className="text-[13px] font-black opacity-60 mb-5">
                            ₹
                            {
                              item.productId
                                ?.Discounted_price
                            }
                          </p>

                          {/* SIZE */}

                          <div className="flex items-center gap-2 mb-5 flex-wrap justify-start">

                            {[
                              "S",
                              "M",
                              "L",
                              "XL",
                            ].map((size) => {

                              const availableSizes =
                                item.productId
                                  ?.Size || [];

                              const isAvailable =
                                availableSizes.includes(
                                  size
                                );

                              return (
                                <button
                                  key={size}
                                  disabled={
                                    !isAvailable
                                  }
                                  onClick={() => {

                                    if (
                                      isAvailable
                                    ) {

                                      setSizes({
                                        ...sizes,

                                        [item
                                          .productId
                                          ._id]:
                                          size,
                                      });

                                    }

                                  }}
                                  className={`
                                    w-12 h-12 md:w-11 md:h-11
                                    rounded-full
                                    text-[11px]
                                    md:text-[10px]
                                    font-black
                                    border
                                    transition-all
                                    duration-300

                                    ${
                                      sizes[
                                        item
                                          .productId
                                          ._id
                                      ] === size
                                        ? "bg-black text-white border-black shadow-lg"
                                        : ""
                                    }

                                    ${
                                      !isAvailable
                                        ? "opacity-30 cursor-not-allowed line-through border-red-300"
                                        : "bg-white border-black/10 hover:border-black"
                                    }
                                  `}
                                >
                                  {size}
                                </button>
                              );

                            })}

                          </div>

                          {/* QUANTITY */}

                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

                            <div className="w-full sm:w-fit flex items-center justify-center gap-5 border border-black/10 rounded-full px-5 py-3 bg-[#fcfcfc]">

                              <button
                                onClick={() =>
                                  setQuantities({
                                    ...quantities,

                                    [item.productId._id]:
                                      quantities[
                                        item.productId._id
                                      ] > 1
                                        ? quantities[
                                            item
                                              .productId
                                              ._id
                                          ] - 1
                                        : 1,
                                  })
                                }
                              >
                                <Minus size={15} />
                              </button>

                              <span className="text-[13px] font-black min-w-[16px] text-center">

                                {
                                  quantities[
                                    item.productId._id
                                  ]
                                }

                              </span>

                              <button
                                onClick={() =>
                                  setQuantities({
                                    ...quantities,

                                    [item.productId._id]:
                                      quantities[
                                        item.productId._id
                                      ] + 1,
                                  })
                                }
                              >
                                <Plus size={15} />
                              </button>

                            </div>

                            <span className="text-[14px] font-black italic">
                              ₹
                              {parseInt(
                                String(
                                  item.productId
                                    ?.Discounted_price
                                ).replace(
                                  /[^\d]/g,
                                  ""
                                )
                              ) *
                                quantities[
                                  item.productId._id
                                ]}
                            </span>

                          </div>

                        </div>

                      </div>

                    </motion.div>

                  )
                )}

              </div>

              {/* GIFT */}

              <motion.div
                whileHover={{
                  y: -2,
                }}
                onClick={() =>
                  setGiftWrap(!giftWrap)
                }
                className={`mt-8 mb-5 border rounded-[2rem] p-5 cursor-pointer transition-all ${
                  giftWrap
                    ? "border-black bg-black text-white"
                    : "border-black/10 bg-white/60"
                }`}
              >

                <div className="flex items-center justify-between gap-4">

                  <div className="flex items-center gap-4">

                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        giftWrap
                          ? "bg-white/10"
                          : "bg-black/5"
                      }`}
                    >
                      <Gift size={18} />
                    </div>

                    <div>

                      <p className="text-[10px] font-black uppercase tracking-widest">
                        Premium Gift Wrap
                      </p>

                      <p className="text-[9px] opacity-60 mt-1">
                        Luxury packaging &
                        message card
                      </p>

                    </div>

                  </div>

                  <span className="text-[12px] font-black italic">
                    + ₹199
                  </span>

                </div>

              </motion.div>

              {/* COINS */}

              <motion.div className="mb-5 border rounded-[2rem] p-5">

                <div className="flex justify-between items-center">

                  <div>

                    <p className="text-[10px] font-black uppercase">
                      Use Reward Coins
                    </p>

                    <p className="text-[9px] opacity-60">
                      Available Coins:{" "}
                      {walletBalance}
                    </p>

                    {walletBalance <= 10 && (
                      <p className="text-[9px] text-red-500 mt-1">
                        Minimum 10 coins required to redeem
                      </p>
                    )}

                    <p className="text-[9px] opacity-60">
                      Value: ₹
                      {Math.floor(
                        walletBalance * 0.5
                      )}
                    </p>

                  </div>

                  <input
                    type="checkbox"
                    checked={useCoins}
                    disabled={!canUseCoins}
                    onChange={() => {

                      if (canUseCoins) {
                        setUseCoins(
                          !useCoins
                        );
                      }

                    }}
                  />

                </div>

              </motion.div>

              {/* DONATION */}

              <motion.div
                whileHover={{
                  y: -2,
                }}
                onClick={() =>
                  setDonation(!donation)
                }
                className={`mb-8 border rounded-[2rem] p-5 cursor-pointer transition-all ${
                  donation
                    ? "border-black bg-black text-white"
                    : "border-black/10 bg-white/60"
                }`}
              >

                <div className="flex items-center justify-between gap-4">

                  <div className="flex items-center gap-4">

                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        donation
                          ? "bg-white/10"
                          : "bg-black/5"
                      }`}
                    >
                      ❤️
                    </div>

                    <div>

                      <p className="text-[10px] font-black uppercase tracking-widest">
                        Donate For Children
                      </p>

                      <p className="text-[9px] opacity-60 mt-1">
                        Support education &
                        meals
                      </p>

                    </div>

                  </div>

                  <span className="text-[12px] font-black italic">
                    + ₹49
                  </span>

                </div>

              </motion.div>

              {/* COUPON */}

              <motion.div
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                whileHover={{
                  y: -2,
                }}
                className="mb-8 border border-black/10 rounded-[2rem] p-5 bg-white/60 shadow-sm"
              >

                <div className="flex items-center gap-4 mb-5">

                  <div className="w-12 h-12 rounded-full bg-black/5 flex items-center justify-center">
                    <Tag size={18} />
                  </div>

                  <div>

                    <p className="text-[10px] font-black uppercase tracking-widest">
                      Apply Coupon
                    </p>

                    <p className="text-[9px] opacity-60 mt-1">
                      SAVE10 • WELCOME20 • FLAT500 • LUXURY15
                    </p>

                  </div>

                </div>

                <div className="flex flex-col sm:flex-row gap-3">

                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) =>
                      setCouponCode(
                        e.target.value.toUpperCase()
                      )
                    }
                    placeholder="Enter coupon code"
                    className="flex-1 px-5 py-4 rounded-full border border-black/10 bg-white text-[10px] font-black uppercase tracking-widest outline-none"
                  />

                  {appliedCoupon ? (

                    <motion.button
                      whileHover={{
                        scale: 1.03,
                      }}
                      whileTap={{
                        scale: 0.97,
                      }}
                      onClick={removeCoupon}
                      className="px-7 py-4 rounded-full bg-red-500 hover:bg-red-600 text-white text-[9px] font-black uppercase tracking-widest shadow-lg"
                    >
                      Remove
                    </motion.button>

                  ) : (

                    <motion.button
                      whileHover={{
                        scale: 1.03,
                      }}
                      whileTap={{
                        scale: 0.97,
                      }}
                      onClick={applyCoupon}
                      className="px-7 py-4 rounded-full bg-black text-white text-[9px] font-black uppercase tracking-widest shadow-lg"
                    >
                      Apply
                    </motion.button>

                  )}

                </div>

                {couponMessage && (
                  <p
                    className={`mt-4 text-[9px] font-bold uppercase tracking-widest ${
                      appliedCoupon
                        ? "text-green-600"
                        : "text-red-500"
                    }`}
                  >
                    {couponMessage}
                  </p>
                )}

              </motion.div>

              {/* TOTAL */}

              <div className="space-y-5 mb-8">

                <div className="flex justify-between text-[10px] font-bold uppercase opacity-60">

                  <span>Subtotal</span>

                  <span className="font-black">
                    ₹{subtotal}
                  </span>

                </div>

                <div className="flex justify-between text-[10px] font-bold uppercase opacity-60">

                  <span>Shipping</span>

                  <span className="italic">
                    Complimentary
                  </span>

                </div>

                <div className="flex justify-between text-[10px] font-bold uppercase opacity-60">

                  <span>Gift Wrap</span>

                  <span>
                    {giftWrap
                      ? `₹${giftCharge}`
                      : "Not Added"}
                  </span>

                </div>

                <div className="flex justify-between text-[10px] font-bold uppercase opacity-60">

                  <span>Donation</span>

                  <span>
                    {donation
                      ? `₹${donationCharge}`
                      : "Not Added"}
                  </span>

                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-[10px] font-bold uppercase text-green-600">

                    <span>Coupon Discount</span>

                    <span>
                      - ₹{discount}
                    </span>

                  </div>
                )}

                {finalWalletDiscount > 0 && (
                  <div className="flex justify-between text-[10px] font-bold uppercase text-green-600">

                    <span>Reward Discount</span>

                    <span>
                      - ₹{finalWalletDiscount}
                    </span>

                  </div>
                )}

                <div className="pt-6 border-t border-black/10 flex justify-between items-center">

                  <span className="text-[13px] font-black uppercase italic">
                    Grand Total
                  </span>

                  <span className="text-3xl md:text-4xl font-black italic tracking-tight">
                    ₹{grandTotal}
                  </span>

                </div>

              </div>

              {/* BUTTON */}

              <motion.button
                onClick={createOrder}
                disabled={loading}
                whileHover={{
                  y: loading ? 0 : -3,
                  scale: loading ? 1 : 1.01,
                }}
                whileTap={{
                  scale: loading ? 1 : 0.97,
                }}
                className={`w-full py-5 text-white text-[9px] md:text-[10px] font-black uppercase tracking-[0.25em] md:tracking-[0.3em] rounded-full shadow-[0_20px_40px_rgba(0,0,0,0.18)] ${
                  loading
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-black"
                }`}
              >

                {loading
                  ? "Processing..."
                  : paymentMethod === "cod"
                  ? "Place COD Order"
                  : "Pay with Razorpay"}

              </motion.button>

              {/* FEATURES */}

              <div className="mt-8 pt-8 border-t border-black/10 space-y-4">

                <div className="flex items-center gap-3 opacity-60">

                  <ShieldCheck size={15} />

                  <span className="text-[8px] font-bold uppercase tracking-widest">
                    Secure Razorpay Payment
                  </span>

                </div>

                <div className="flex items-center gap-3 opacity-60">

                  <CheckCircle2 size={15} />

                  <span className="text-[8px] font-bold uppercase tracking-widest">
                    Authenticity Assured
                  </span>

                </div>

              </div>

            </div>

          </motion.div>

        </div>

      </div>

    </div>
  );
};

export default CheckoutPage;

