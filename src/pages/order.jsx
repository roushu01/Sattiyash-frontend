import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  MapPin,
  CreditCard,
} from "lucide-react";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(
        "https://sattiyash-backend.onrender.com/getorder",
        {
          withCredentials: true,
        }
      );

      if (res.data.order) {
        setOrders(
          Array.isArray(res.data.order)
            ? res.data.order
            : [res.data.order]
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case "Delivered":
        return <CheckCircle size={18} />;
      case "Shipped":
        return <Truck size={18} />;
      case "Confirmed":
        return <Package size={18} />;
      default:
        return <Clock size={18} />;
    }
  };

  return (
    <div className="min-h-screen lg:ml-[220px] bg-[#F8F8F8] pt-24 pb-20 px-4 md:px-10 font-jakarta">

      {/* Header */}
      <div className="max-w-7xl mx-auto mb-12">
        <h1 className="text-4xl font-black tracking-tight">
          MY ORDERS
        </h1>

        <p className="text-sm mt-3 opacity-60">
          Track and manage your purchases
        </p>
      </div>

      <div className="max-w-7xl mx-auto space-y-8">

        {orders.map((order) => (
          <motion.div
            key={order._id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[3rem] p-8 shadow-[0_20px_80px_rgba(0,0,0,0.06)] border border-black/5"
          >

            {/* Top Section */}
            <div className="flex flex-col lg:flex-row justify-between gap-6 border-b border-black/10 pb-8">

              <div>
                <h2 className="text-sm uppercase font-black tracking-[0.25em] mb-3">
                  Order #{order._id.slice(-6)}
                </h2>

                <p className="text-xs opacity-60">
                  {new Date(
                    order.createdAt
                  ).toLocaleDateString()}
                </p>
              </div>

              <div className="flex flex-wrap gap-4">

                <div className="px-5 py-3 rounded-full bg-black text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                  {getStatusIcon(
                    order.orderStatus
                  )}

                  {order.orderStatus}
                </div>

                <div className="px-5 py-3 rounded-full bg-black/5 text-[10px] font-black uppercase tracking-widest">
                  {order.paymentStatus}
                </div>
              </div>
            </div>

            {/* Products */}
            <div className="mt-8 space-y-5">

              {order.products.map((item) => (
                <div
                  key={item._id}
                  className="flex flex-col md:flex-row gap-5 border border-black/5 rounded-[2rem] p-5"
                >
                  <div className="w-full md:w-28 h-48 md:h-28 rounded-[1.5rem] overflow-hidden bg-gray-100">
                    <img
                      src={item.image}
                      alt={item.productName}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1">

                    <h3 className="font-black uppercase text-sm">
                      {item.productName}
                    </h3>

                    <p className="mt-2 opacity-60 text-xs">
                      Size : {item.size}
                    </p>

                    <p className="mt-1 opacity-60 text-xs">
                      Quantity : {item.quantity}
                    </p>

                    <p className="mt-3 font-black italic">
                      ₹{item.price}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Grid */}
            <div className="grid lg:grid-cols-3 gap-6 mt-10">

              {/* Address */}
              <div className="border border-black/5 rounded-[2rem] p-6">

                <div className="flex items-center gap-3 mb-4">
                  <MapPin size={18} />
                  <h3 className="font-black uppercase text-xs tracking-widest">
                    Shipping Address
                  </h3>
                </div>

                <p className="text-sm leading-7 opacity-70">
                  {order.shippingAddress.firstName}{" "}
                  {order.shippingAddress.lastName}
                  <br />
                  {
                    order.shippingAddress
                      .address
                  }
                  <br />
                  {order.shippingAddress.city},{" "}
                  {
                    order.shippingAddress
                      .state
                  }
                  <br />
                  {
                    order.shippingAddress
                      .country
                  }{" "}
                  -
                  {
                    order.shippingAddress
                      .pincode
                  }
                </p>
              </div>

              {/* Payment */}
              <div className="border border-black/5 rounded-[2rem] p-6">

                <div className="flex items-center gap-3 mb-4">
                  <CreditCard size={18} />

                  <h3 className="font-black uppercase text-xs tracking-widest">
                    Payment
                  </h3>
                </div>

                <div className="space-y-3">

                  <div className="flex justify-between text-sm">
                    <span>
                      Method
                    </span>

                    <span className="font-black">
                      {
                        order.paymentMethod
                      }
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span>
                      Status
                    </span>

                    <span className="font-black">
                      {
                        order.paymentStatus
                      }
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span>
                      Coins Used
                    </span>

                    <span className="font-black">
                      {order.coins || 0}
                    </span>
                  </div>
                </div>
              </div>

              {/* Total */}
              <div className="bg-black text-white rounded-[2rem] p-6 flex flex-col justify-center">

                <p className="text-[10px] uppercase tracking-[0.3em] opacity-70">
                  Order Total
                </p>

                <h2 className="text-5xl font-black italic mt-3">
                  ₹
                  {order.totalAmount}
                </h2>
              </div>
            </div>

            {/* Progress Timeline */}
            <div className="mt-10">

              <h3 className="text-xs font-black uppercase tracking-[0.25em] mb-8">
                Order Progress
              </h3>

              <div className="flex justify-between relative">

                <div className="absolute top-5 left-0 w-full h-[2px] bg-black/10" />

                {[
                  "Pending",
                  "Confirmed",
                  "Packed",
                  "Shipped",
                  "Delivered",
                ].map((step) => {
                  const completed =
                    [
                      "Pending",
                      "Confirmed",
                      "Packed",
                      "Shipped",
                      "Delivered",
                    ].indexOf(
                      order.orderStatus
                    ) >=
                    [
                      "Pending",
                      "Confirmed",
                      "Packed",
                      "Shipped",
                      "Delivered",
                    ].indexOf(step);

                  return (
                    <div
                      key={step}
                      className="relative z-10 flex flex-col items-center"
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          completed
                            ? "bg-black text-white"
                            : "bg-white border border-black/20"
                        }`}
                      >
                        ✓
                      </div>

                      <span className="mt-3 text-[10px] uppercase font-black tracking-widest">
                        {step}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        ))}

      </div>
    </div>
  );
};

export default OrdersPage;