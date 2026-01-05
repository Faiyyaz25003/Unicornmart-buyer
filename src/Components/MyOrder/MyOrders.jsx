// // "use client";

// // import { useEffect, useState } from "react";
// // import axios from "axios";
// // import {
// //   Package,
// //   Calendar,
// //   IndianRupee,
// //   MapPin,
// //   Phone,
// //   Mail,
// // } from "lucide-react";

// // export default function MyOrdersPage() {
// //   const [orders, setOrders] = useState([]);
// //   const [loading, setLoading] = useState(true);

// //   // 🔐 Logged in user
// //   const user =
// //     typeof window !== "undefined"
// //       ? JSON.parse(localStorage.getItem("user"))
// //       : null;

// //   useEffect(() => {
// //     if (!user?._id) return;

// //     const fetchMyOrders = async () => {
// //       try {
// //         const res = await axios.get(
// //           `http://localhost:5000/api/orders/my-orders/${user._id}`
// //         );
// //         setOrders(res.data);
// //       } catch (error) {
// //         console.error("Error fetching orders", error);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchMyOrders();
// //   }, [user]);

// //   if (loading) {
// //     return <p className="text-center mt-10">Loading orders...</p>;
// //   }

// //   return (
// //     <div className="max-w-6xl mx-auto p-6">
// //       <h1 className="text-2xl font-bold mb-6">🛒 My Orders</h1>

// //       {orders.length === 0 ? (
// //         <p className="text-gray-500">No orders found.</p>
// //       ) : (
// //         <div className="grid md:grid-cols-2 gap-6">
// //           {orders.map((order) => (
// //             <div
// //               key={order._id}
// //               className="border rounded-xl p-5 shadow-sm hover:shadow-md transition"
// //             >
// //               <div className="flex justify-between items-center mb-3">
// //                 <h2 className="font-semibold flex items-center gap-2">
// //                   <Package size={18} /> {order.productName}
// //                 </h2>
// //                 <span className="text-sm text-gray-500 flex items-center gap-1">
// //                   <Calendar size={14} />
// //                   {new Date(order.createdAt).toLocaleDateString()}
// //                 </span>
// //               </div>

// //               <p className="flex items-center gap-2 text-sm">
// //                 <Mail size={14} /> {order.email}
// //               </p>

// //               <p className="flex items-center gap-2 text-sm">
// //                 <Phone size={14} /> {order.phone}
// //               </p>

// //               <p className="flex items-center gap-2 text-sm">
// //                 <MapPin size={14} /> {order.address}
// //               </p>

// //               <div className="flex justify-between mt-4 text-sm">
// //                 <p>Qty: {order.quantity}</p>
// //                 <p className="flex items-center gap-1 font-semibold">
// //                   <IndianRupee size={14} />
// //                   {order.total}
// //                 </p>
// //               </div>
// //             </div>
// //           ))}
// //         </div>
// //       )}
// //     </div>
// //   );
// // }


// "use client";

// import { useEffect, useState } from "react";
// import axios from "axios";
// import { Package, Calendar, IndianRupee } from "lucide-react";

// export default function MyOrders() {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const token = localStorage.getItem("token");

//     if (!token) return;

//     const fetchOrders = async () => {
//       try {
//         const res = await axios.get(
//           "http://localhost:5000/api/orders/my-orders",
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//         setOrders(res.data);
//       } catch (error) {
//         console.error(error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOrders();
//   }, []);

//   if (loading) return <p className="text-center mt-10">Loading...</p>;

//   return (
//     <div className="max-w-5xl mx-auto p-6">
//       <h1 className="text-2xl font-bold mb-6">🛒 My Orders</h1>

//       {orders.length === 0 ? (
//         <p>No orders found</p>
//       ) : (
//         <div className="grid md:grid-cols-2 gap-6">
//           {orders.map((order) => (
//             <div key={order._id} className="border p-4 rounded-lg shadow-sm">
//               <h2 className="font-semibold flex gap-2 items-center">
//                 <Package size={18} />
//                 {order.productName}
//               </h2>

//               <p className="text-sm text-gray-500 flex items-center gap-1">
//                 <Calendar size={14} />
//                 {new Date(order.createdAt).toLocaleDateString()}
//               </p>

//               <p>Qty: {order.quantity}</p>

//               <p className="font-bold flex items-center gap-1">
//                 <IndianRupee size={14} />
//                 {order.total}
//               </p>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }



import React from 'react'

const MyOrders = () => {
  return (
    <div>
      My Order
    </div>
  )
}

export default MyOrders
