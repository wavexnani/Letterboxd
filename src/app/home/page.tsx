"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useEffect, useState } from "react";
import React from "react";

export default function HomePage() {
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const storedUsername = localStorage.getItem("email");
    setUsername(storedUsername);
  }, []);

  const router = useRouter();

  const handleLogin = () => {
    router.push("/login");
  };

  const handlesearch = () => {
    router.push("/search");
  };

  const onClick = async (id: number) => {
    router.push(`/movie/${id}`);
  };

  const [movies, setMovies] = useState([]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/movies")
      .then((res) => {
        setMovies(res.data);
        console.log(res.data); // 👈 this updates the movies state
      })
      .catch((error) => {
        console.error("Error fetching movies:", error);
      });
  }, []);

  return (
    <div className="min-h-screen bg-black text-white ">
      <div>
        <div className="relative w-fill h-[430px] z-0">
          <Image
            className="opacity-30"
            src="/welcome.jpg"
            alt="logo"
            layout="fill"
            objectFit="cover"
          />

          {/*Nav bar*/}
          <div className="flex-wrap absolute top-0 left-10 right-10 flex justify-between items-center pt-5 px-4">
            <div className="flex gap-x-10">
              <button
                onClick={() => router.push("/watchlist")}
                className="font-bold text-xl cursor-pointer"
              >
                Watch List
              </button>
              <button className="font-bold text-xl cursor-pointer">
                Setting
              </button>
              <button
                onClick={handleLogin}
                className="font-bold text-xl cursor-pointer"
              >
                Logout
              </button>
            </div>

            <div className="flex items-center gap-4">
              <Image
                className="rounded-lg"
                src="/logo.png"
                alt="logo"
                width={110}
                height={100}
              />

              {username && (
                <div className="text-white font-semibold text-lg">
                  {username}
                </div>
              )}
            </div>
          </div>

          <div className="pt-32 flex flex-col flex-wrap justify-between gap-5 items-center">
            {/*welcome*/}
            <div className="flex flex-col md:items-start items-center w-3/4 md:text-5xl z-10 font-bold text-3xl">
              <div>Welcome.</div>
              <div className="pt-6">This is Letter boxd! Best for Movies.</div>
            </div>

            {/* search bar */}
            <div className="relative to-5% mt-10 w-3/4 h-10 rounded-2xl bg-white">
              <form onSubmit={handlesearch}>
                <input
                  onClick={handlesearch}
                  type="text"
                  className="absolute px-4 top-0 w-full  h-10 rounded-2xl text-black bg-white"
                />
                <button
                  type="submit"
                  className="absolute right-0 w-fit rounded-2xl font-bold h-10 bg-amber-300 pt-1 px-6 pb-1 text-black"
                >
                  Search
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Top rated Movies */}
      <div className="container mx-auto text-cente mt-20 p-4 ">
        <h1 className="text-3xl font-bold text-center mb-6">Movies</h1>
        <div className="flex flex-nowrap overflow-y-hidden justify-center gap-6 ">
          {movies.slice(0, 3).map((movie) => (
            <div
              key={movie.id}
              className="bg-[#191919] rounded-lg p-10 shrink-0 shadow-lg"
            >
              <Image
                onClick={() => onClick(movie.id)}
                src={movie.image}
                alt={movie.title}
                width={150}
                height={300}
                className="rounded-lg transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10 mx-10 flex flex-col">
        <div className="text-3xl pb-3">Trending</div>
        <div className=" overflow-x-auto overflow-y-hidden max-w-full h-70 rounded-2xl bg-[#191919] ">
          {/* we have to add boxes */}
          <div className="flex flex-nowrap overflow-y-hidden px-10 pt-7 gap-6">
            {movies.map((movie) => (
              <div key={movie.id} className="shrink-0">
                <Image
                  onClick={() => onClick(movie.id)}
                  src={movie.image}
                  alt={movie.title}
                  width={150}
                  height={300}
                  className="rounded-lg cursor-pointer transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-10  flex flex-col">
        <div className=" mx-10 text-3xl pb-3">Latest Trailers</div>
        <div
          className=" max-w-full h-90 bg-[#191919] z-0"
          style={{ boxShadow: "inset 0 4px 10px rgba(0, 0, 0, 0.4)" }}
        >
          <div className="m-10 max-w-full h-70 rounded-2xl z-10">
            {/* we have to add boxes */}
            <div className="flex flex-nowrap overflow-y-hidden pt-7 gap-6">
              {movies.map((movie) => (
                <div
                  key={movie.id}
                  className="shrink-0 relative z-10 w-[350px]"
                >
                  <Image
                    onClick={() => onClick(movie.id)}
                    src={movie.backdrop}
                    alt={movie.title}
                    width={350}
                    height={300}
                    className="rounded-lg transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl"
                  />

                  {/* Play Button */}
                  <Image
                    onClick={() => window.open(movie.trailer, "_blank")}
                    src="/play.jpg"
                    width={50}
                    height={50}
                    alt="play"
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer z-30"
                  />

                  <h2 className="text-lg text-center pt-3 font-bold">
                    {movie.title}
                  </h2>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
