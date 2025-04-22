"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useState } from "react";
import React from "react";

export default function SearchPage() {
  const router = useRouter();

  const pushTohome = () => {
    router.push("/home");
  };

  const pushTomovie = () => {
    router.push("/movie");
  };

  const [loading, setLoading] = useState(false);
  const [quary, setquary] = useState("");
  const [searchedMovies, setSearchedMovies] = useState([]);

  const selectedMovie = (movie: any) => {
    localStorage.setItem("selectedMovie", JSON.stringify(movie));
    router.push("/search/movieDetails");
  };

  const onSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post(
        "http://127.0.0.1:5000/movie_search",
        { quary },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log("search success:", response.data.results);
      setSearchedMovies(response.data.results || []);
    } catch (error: any) {
      console.error("search error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={pushTohome} className="text-2xl font-bold p-10 ">
        Back
      </button>

      <div className="relative mx-44 to-5% mt-10 w-3/4 h-10 rounded-2xl bg-white">
        <form onSubmit={onSearch}>
          <input
            value={quary}
            type="text"
            className="absolute px-4 top-0 w-full  h-10 rounded-2xl text-black bg-white"
            onChange={(e) => setquary(e.target.value)}
            placeholder="Search for a movie..."
          />
          <button
            className="absolute right-0 w-fit rounded-2xl font-bold h-10 bg-amber-300 pt-1 px-6 pb-1 text-black flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <svg
                className="w-5 h-5 text-black animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
            ) : (
              "Search"
            )}
          </button>
        </form>
      </div>
      {searchedMovies.length > 0 ? (
        <div className="m-6 bg-[#1B2B2E]">
          <div className="container mx-auto text-center mt-20 ">
            <div className="flex flex-wrap overflow-y-hidden justify-center gap-6">
              {searchedMovies.map((movie: any) => (
                <div
                  key={movie.id}
                  className="bg-[#191919] mt-8 mb-8 rounded-lg p-10 flex flex-col items-center justify-center shrink-0 shadow-lg"
                >
                  <Image
                    onClick={() => selectedMovie(movie)}
                    src={movie.image}
                    alt={movie.title}
                    width={150}
                    height={300}
                    className="pt4 rounded-lg transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl"
                  />
                  <h2 className="mt-4 text-center font-bold w-full">
                    {movie.title}
                  </h2>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-[#1B2B2E] text-center m-10">NO MOVIES FOUND</div>
      )}
    </div>
  );
}
