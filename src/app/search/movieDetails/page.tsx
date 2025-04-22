"use client";
import { addToWatchlist } from "@/utils/watchlist";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function MovieDetails() {
  const router = useRouter();
  const [personalMovie, setPersonalMovie] = useState<any>(null);
  const [reviewText, setReviewText] = useState<string>("");

  useEffect(() => {
    const storedMovie = localStorage.getItem("selectedMovie");
    if (storedMovie) {
      setPersonalMovie(JSON.parse(storedMovie));
    }
  }, []);




  const addMovieToWatchlist = async (movieData: any) => {
    try {
      const res = await axios.post(
        "http://127.0.0.1:5000/movies",
        {
          title: movieData.title,
          backdrop: movieData.backdrop,
          year: movieData.year || "2025",
          rating: movieData.rating,
          trailer: movieData.trailer,
          description: movieData.description,
          image: movieData.image,
          adult: movieData.adult || false,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res.status === 200 || res.status === 201) {
        const user_id = localStorage.getItem("email");
        if (!user_id) {
          alert("Please log in to add to your watchlist.");
          return;
        }

        const res2 = await axios.post(
          "http://127.0.0.1:5000/movies_id",
          {
            movieTitle: movieData.title,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const movieId = res2.data.id;
        addToWatchlist(user_id, movieId);
        alert("Movie added to watchlist!");
      } else {
        alert("Failed to add movie.");
      }
    } catch (error: any) {
      console.error("Error posting movie:", error.response?.data || error.message);
      alert("Failed to add movie.");
    }
  };

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
          <div onClick={() => router.push("/watchlist")} className="cursor-pointer">Watch List</div>
          <div>Setting</div>
          <div onClick={() => router.back()} className="cursor-pointer">Back</div>
          <div onClick={() => router.push("/login")} className="cursor-pointer">Logout</div>
        </div>
        <Image className="rounded-lg" src="/logo.png" alt="logo" width={90} height={80} />
      </div>

      {/* Content */}
      <div className="flex flex-wrap flex-col md:flex-row items-center md:items-start justify-center gap-10 md:gap-28 px-6 md:px-16 mt-[-100px] md:mt-[-200px] relative z-10">
        {/* Poster */}
        <div className="w-48 md:w-64 h-auto">
          <img
            src={personalMovie?.image || "/movies/inception.jpg"}
            alt="poster"
            className="w-full h-auto rounded-lg"
          />
        </div>

        {/* Details */}
        <div className="flex flex-col text-lg md:text-2xl text-center md:text-left max-w-lg md:max-w-2xl p-4 md:p-6 rounded-lg shadow-lg">
          <div className="pb-4 md:pb-6 text-2xl md:text-3xl font-bold">
            {personalMovie?.title || "Movie Title"}
          </div>
          {personalMovie?.trailer !== "0" ? (
            <div className="pb-4 md:pb-6 flex font-bold justify-center md:justify-start items-center gap-2">
              Watch Trailer
              <Image
                className="text-amber-300 text-2xl cursor-pointer"
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
        <button
          onClick={() => addMovieToWatchlist(personalMovie)}
          className="px-6 md:px-8 py-2 text-lg md:text-2xl rounded-lg text-amber-300 font-bold bg-[#191919] cursor-pointer
           hover:bg-[#292929] transition duration-300 shadow-lg hover:shadow-xl"
        >
          Watchlist
        </button>
      </div>

      {/* Review Form */}
      <form
        className="w-full md:w-[90%] lg:w-[80%] mx-auto mt-10 bg-[#191919] rounded-lg p-4 md:p-6 relative z-10"
      >
        <div className="font-bold text-lg md:text-2xl text-amber-300">Reviews</div>
        <input
          type="text"
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          placeholder="Write your review..."
          className="m-0 p-2 mt-2 w-full outline-none focus:outline-none bg-[#101010] rounded text-white"
        />
        <hr className="my-4 border-amber-300" />
        <button
          type="submit"
          className="bg-amber-300 text-black font-bold py-2 px-4 rounded hover:bg-yellow-400 transition"
        >
          Submit Review
        </button>
      </form>
    </div>
  );
}