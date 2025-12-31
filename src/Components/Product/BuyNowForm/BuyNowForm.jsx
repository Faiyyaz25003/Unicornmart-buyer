

"use client";
import React, { useState } from "react";
import {
  X,
  ShoppingCart,
  Package,
  Phone,
  User,
  MapPin,
  Mail,
} from "lucide-react";
import axios from "axios";

const BuyNowForm = ({ product, onClose }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    quantity: product.quantity > 0 ? 1 : 0, // default 1 if available
    address: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/api/orders", {
        name: form.name,
        email: form.email,
        phone: form.phone,
        quantity: Number(form.quantity),
        address: form.address,
        productName: product.scrapName,
        productPrice: product.price,
      });

      alert(`Order Placed ✅\nTotal: ₹${response.data.order.total}`);
      onClose();
    } catch (error) {
      console.error(error);
      alert("Failed to place order. Please try again!");
    }
  };

  const totalPrice = Number(form.quantity) * product.price;

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black/60 backdrop-blur-sm z-50 flex justify-center items-start overflow-auto p-4">
      <div className="bg-white w-full max-w-2xl mt-10 mb-10 rounded-2xl shadow-2xl relative animate-slideIn">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 rounded-t-2xl relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-1.5 transition-all"
          >
            <X size={24} />
          </button>

          <div className="flex items-center gap-3 text-white">
            <div className="bg-white/20 p-3 rounded-full">
              <ShoppingCart size={28} />
            </div>
            <div>
              <h2 className="text-3xl font-bold">Complete Your Order</h2>
              <p className="text-green-100 text-sm mt-1">
                Fill in your details below
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Product Details Card */}
          <div className="mb-6 bg-gradient-to-br from-gray-50 to-gray-100 p-5 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-start gap-3 mb-3">
              <Package className="text-green-600 mt-1" size={24} />
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-800">
                  {product.scrapName}
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                <p className="text-gray-500 text-xs mb-1">Price per Kg</p>
                <p className="text-green-600 font-bold text-lg">
                  ₹{product.price}
                </p>
              </div>
              <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                <p className="text-gray-500 text-xs mb-1">Available</p>
                <p className="text-blue-600 font-bold text-lg">
                  {product.quantity} Kg
                </p>
              </div>
              <div className="text-center p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg shadow-md">
                <p className="text-green-50 text-xs mb-1">Total Amount</p>
                <p className="text-white font-bold text-lg">₹{totalPrice}</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Row 1: Name, Email, Phone */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Name Input */}
              <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    required
                    className="w-full border-2 border-gray-200 pl-11 pr-4 py-3 rounded-lg focus:border-green-500 focus:outline-none transition-colors"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
              </div>

              {/* Email Input */}
              <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    required
                    className="w-full border-2 border-gray-200 pl-11 pr-4 py-3 rounded-lg focus:border-green-500 focus:outline-none transition-colors"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Phone Input */}
              <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="tel"
                    placeholder="Enter your phone number"
                    required
                    className="w-full border-2 border-gray-200 pl-11 pr-4 py-3 rounded-lg focus:border-green-500 focus:outline-none transition-colors"
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            {/* Row 2: Quantity and Address */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Quantity Input */}
              <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Quantity (Kg)
                </label>
                <input
                  type="number"
                  min="1"
                  max={product.quantity}
                  className="w-full border-2 border-gray-200 px-4 py-3 rounded-lg focus:border-green-500 focus:outline-none transition-colors"
                  value={form.quantity}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      quantity:
                        e.target.value > product.quantity
                          ? product.quantity
                          : e.target.value,
                    })
                  }
                />
                <p className="text-xs text-gray-500 mt-1">
                  Max: {product.quantity} Kg available
                </p>
              </div>

              {/* Address Input */}
              <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Pickup / Delivery Address
                </label>
                <div className="relative">
                  <MapPin
                    className="absolute left-3 top-3 text-gray-400"
                    size={20}
                  />
                  <textarea
                    placeholder="Enter your complete address"
                    required
                    rows="3"
                    className="w-full border-2 border-gray-200 pl-11 pr-4 py-3 rounded-lg focus:border-green-500 focus:outline-none transition-colors resize-none"
                    value={form.address}
                    onChange={(e) =>
                      setForm({ ...form, address: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-lg font-bold text-lg hover:from-green-700 hover:to-emerald-700 transform hover:scale-[1.02] transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <ShoppingCart size={22} />
              Confirm Purchase - ₹{totalPrice}
            </button>
          </form>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default BuyNowForm;
