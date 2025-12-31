
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { User } from "lucide-react";

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      router.push("/login");
      return;
    }

    const loggedUser = JSON.parse(storedUser);

    axios
      .get(`http://localhost:5000/api/users/${loggedUser._id}`)
      .then((res) => setUser(res.data))
      .catch((err) => console.error(err));
  }, [router]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-md max-w-3xl w-full p-6">
        {/* HEADER */}
        <div className="flex items-center gap-2 mb-6">
          <User className="text-gray-700" />
          <h2 className="text-xl font-semibold capitalize">
            {user.role} Profile
          </h2>
        </div>

        {/* CONTENT */}
        <div className="flex items-start gap-6">
          {/* LEFT IMAGE */}
          <img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            alt="profile"
            className="w-24 h-24 rounded-full object-cover border"
          />

          {/* RIGHT DATA – 2 COLUMNS */}
          <div className="grid grid-cols-2 gap-x-10 gap-y-3 text-gray-800 w-full">
            {/* COLUMN 1 (5 ITEMS) */}
            <p>
              <b>Name:</b> {user.name}
            </p>

            <p>
              <b>Email:</b> {user.email}
            </p>

            <p>
              <b>Phone:</b> {user.phone || "-"}
            </p>

            <p>
              <b>Gender:</b> {user.gender || "-"}
            </p>

            <p>
              <b>Role:</b> {user.role}
            </p>

            {/* COLUMN 2 (4 ITEMS) */}
            {user.shopName && (
              <p>
                <b>Shop / Company:</b> {user.shopName}
              </p>
            )}

            {user.businessType && (
              <p>
                <b>Business Type:</b> {user.businessType}
              </p>
            )}

            {user.gstNumber && (
              <p>
                <b>GST Number:</b> {user.gstNumber}
              </p>
            )}

            {user.joinDate && (
              <p>
                <b>Joined On:</b> {new Date(user.joinDate).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
