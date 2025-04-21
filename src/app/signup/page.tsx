"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import React, { useEffect } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";

export default function LoginPage() {
  const [user, setUser] = React.useState({
    email: "",
    username: "",
    password: "",
  });

  

  const [buttonDisabled, setButtonDisabled] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  
  const onSignup = async () => {
    try {
      setLoading(true);
      localStorage.setItem("username", user.username);
      const response = await axios.post("http://127.0.0.1:5000/signup", user);
      console.log("signup sucess", response.data);
      router.push("/login");
    } catch (error: any) {
      console.log("there is a problem in signup", error.message);
      toast.error("Error signing up", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setButtonDisabled(!(user.email && user.username && user.password));
  }, [user]);

  const router = useRouter();
  const handleLogin = () => {
    router.push("/login");
  };

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

      <div className="m-0 p-0 flex flex-col items-center justify-center h-screen">
        {/* Login Button */}
        <div className="w-11/12 max-w-md mx-auto bg-neutral-800/90 rounded-xl py-4 px-6 text-xl flex items-center justify-between  z-10 ">
          <span>Already have an account?</span>
          <button
            onClick={handleLogin}
            className="bg-yellow-400 text-black px-4 py-1 rounded hover:bg-yellow-300"
          >
            Login
          </button>
        </div>

        {/* Signup Form */}
        <div className="w-11/12 max-w-md mx-auto mt-6 bg-neutral-900/90 backdrop-blur-md rounded-2xl py-10 px-8 z-10 relative shadow-lg border border-neutral-700">
          <h2 className="text-3xl font-semibold text-center mb-6">
            {loading ? "Processing" : "Create an Account"}
          </h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSignup();
            }}
            className="space-y-5"
          >

            {/* Username */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium mb-1"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                placeholder="Choose a username"
                value={user.username}
                onChange={(e) => setUser({ ...user, username: e.target.value })}
                className="w-full px-4 py-3 rounded-md bg-neutral-100 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
              />
            </div>


            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
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
                placeholder="Create a password"
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
              {buttonDisabled ? "Please fill all fields" : "Sign Up"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
