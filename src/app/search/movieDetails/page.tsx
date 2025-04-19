"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function MovieDetails() {
  const router = useRouter();
  const [personalMovie, setPersonalMovie] = useState(null);

  useEffect(() => {
    const storedMovie = localStorage.getItem("selectedMovie");
    if (storedMovie) {
      setPersonalMovie(JSON.parse(storedMovie));
    }
  }, []);

  if (!personalMovie) return <div className="text-white p-6">Loading...</div>;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Background Image */}
      <div className="relative w-full h-[500px] md:h-[560px]">
        {personalMovie?.backdrop ? (
          <Image
            src={personalMovie.backdrop}
            alt="Big Poster"
            layout="fill"
            objectFit="cover"
            className="opacity-20"
          />
        ) : (
          <Image
            src="/bigPosters/ins.jpg"
            alt="Big Poster"
            layout="fill"
            objectFit="cover"
            className="opacity-20"
          />
        )}
      </div>

      {/* Navbar */}
      <div className="absolute top-0 left-0 right-0 flex flex-wrap justify-between items-center pt-6 p-4 md:p-6 lg:px-16">
        <div className="flex gap-4 md:gap-8 text-sm md:text-lg font-bold ">
          <div>Watch List</div>
          <div>Setting</div>
          <div onClick={() => router.back()} className="cursor-pointer">
            Back
          </div>
          <div>Logout</div>
        </div>
        <Image
          className="rounded-lg"
          src="/logo.png"
          alt="logo"
          width={90}
          height={80}
        />
      </div>

      {/* Content Wrapper - REMOVE absolute positioning */}
      <div className="flex flex-wrap flex-col md:flex-row items-center md:items-start justify-center gap-10 md:gap-28 px-6 md:px-16 mt-[-100px] md:mt-[-200px] relative z-10">
        {/* Movie Poster */}
        <div className="w-48 md:w-64 h-auto">
          {personalMovie?.image ? (
            <img
              src={personalMovie.image}
              alt="poster"
              className="w-full h-auto rounded-lg"
            />
          ) : (
            <img
              src="/movies/inception.jpg"
              alt="poster"
              className="w-full h-auto rounded-lg"
            />
          )}
        </div>

        {/* Movie Details */}
        <div className="flex flex-col text-lg md:text-2xl text-center md:text-left max-w-lg md:max-w-2xl  p-4 md:p-6 rounded-lg shadow-lg">
          <div className="pb-4 md:pb-6 text-2xl md:text-3xl font-bold">
            {personalMovie ? personalMovie.title : "Inception"}
          </div>
          {personalMovie?.trailer !== "0" ? (
            <div className="pb-4 md:pb-6 flex font-bold justify-center md:justify-start items-center gap-2">
              Watch Trailer
              <Image
                className="text-amber-300 text-2xl"
                onClick={() => window.open(personalMovie.trailer, "_blank")}
                src="/play.jpg"
                alt="play"
                width={30}
                height={30}
              />
            </div>
          ) : (
            <div className="pb-4 md:pb-6 font-bold text-gray-400">
              Trailer not available
            </div>
          )}
          <div className="pb-4 md:pb-6 font-bold">
            Movie Rating: {personalMovie?.rating ?? "N/A"}
          </div>

          {/* Overview */}
          <div>
            <div className="font-bold text-xl md:text-2xl">Overview :</div>
            <p className="pt-2 md:pt-4 text-sm md:text-lg leading-relaxed">
              {personalMovie?.description}
            </p>
          </div>
        </div>
      </div>

      {/* Watchlist Button */}
      <div className="flex justify-center md:justify-end px-6 md:px-16 mt-10">
        <button className="px-6 md:px-8 py-2 text-lg md:text-2xl rounded-lg text-amber-300 font-bold bg-[#191919]">
          Watchlist
        </button>
      </div>

      {/* Reviews Section */}
      <div className="w-full md:w-[90%] lg:w-[80%] mx-auto mt-10 bg-[#191919] rounded-lg p-4 md:p-6 relative z-10">
        <div className="font-bold text-lg md:text-2xl text-amber-300">
          Reviews
        </div>
        <hr className="border-amber-300 mt-4 md:mt-8" />
      </div>
    </div>
  );
}
