"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useEffect } from "react";

export default function LoginPage() {
  const [user, setUser] = useState({ email: "", password: "" });
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
 
  localStorage.setItem("email", user.email);

  
  const onLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      const response = await axios.post(
        "http://127.0.0.1:5000/fetch_movies",
        user,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log("Login success:", response.data);
      router.push("/home");
    } catch (error: any) {
      console.error("Login error:", error.message);
      toast.error("Error logging in", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = () => router.push("/signup");

  useEffect(() => {
    setButtonDisabled(!(user.email && user.email && user.password));
  }, [user]);

  return (
    <div className="relative min-h-screen text-white font-sans">
      {/* Background Image */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/netflix.jpg"
          alt="background"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black opacity-70" />
      </div>

      {/* Header */}
      <div className="flex justify-between items-center px-6 py-8 md:px-16 text-2xl md:text-4xl font-bold z-10 relative">
        <div>Letter Boxd</div>
        <Image
          src="/logo.png"
          alt="logo"
          width={90}
          height={90}
          className="rounded-xl"
        />
      </div>

      {/* Signup Button */}
      <div className="w-11/12 max-w-md mx-auto mt-20 bg-neutral-800/90 rounded-xl py-4 px-6 text-xl flex items-center justify-between z-10 relative">
        <span>New here?</span>
        <button
          onClick={handleSignup}
          className="bg-yellow-400 text-black px-4 py-1 rounded hover:bg-yellow-300"
        >
          Register
        </button>
      </div>

      {/* Login Form */}
      <div className="w-11/12 max-w-md mx-auto mt-6 bg-neutral-900/90 backdrop-blur-md rounded-2xl py-10 px-8 z-10 relative shadow-lg border border-neutral-700">
        <h2 className="text-3xl font-semibold text-center mb-6">
          {loading ? "Logging In..." : "Login to Your Account"}
        </h2>
        <form onSubmit={onLogin} className="space-y-5">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              id="email"
              type="text"
              placeholder="Enter your email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              className="w-full px-4 py-3 rounded-md bg-neutral-100 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              className="w-full px-4 py-3 rounded-md bg-neutral-100 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className={`w-full py-3 text-lg rounded-md font-semibold transition duration-200 ${
              buttonDisabled
                ? "bg-gray-600 cursor-not-allowed text-white"
                : "bg-yellow-400 text-black hover:bg-yellow-300"
            }`}
            disabled={buttonDisabled}
          >
            {buttonDisabled ? "Please fill all fields" : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
