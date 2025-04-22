"use client";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function WatchlistPage() {
  const router = useRouter();
  const [movies, setMovies] = useState<any[]>([]);
  const [username, setUsername] = useState<string | null>(null);

  // 1. Get username from localStorage after the component mounts
  useEffect(() => {
    const storedUsername = localStorage.getItem("email"); // Assuming email is used as username
    setUsername(storedUsername);
  }, []);

  // 2. Call API when username is available
  useEffect(() => {
    if (!username) return;

    axios
      .post("http://127.0.0.1:5000/get_watchlist", { username })
      .then((res) => {
        setMovies(res.data);
      })
      .catch((error) => {
        console.error("Error fetching watchlist:", error);
      });
  }, [username]);

  const removeFromWatchlist = async (movieId: number) => {
    try {
      const username = localStorage.getItem("email");
      if (!username) {
        alert("User not logged in.");
        return;
      }
  
      const res = await axios.post("http://127.0.0.1:5000/delete_watchlist", {
        username: username,
        movie_id: movieId,
      });
  
      if (res.status === 200) {
        setMovies((prev) => prev.filter((movie) => movie.id !== movieId));
        alert("Removed from watchlist!");
      } else {
        alert("Failed to remove from watchlist.");
      }
    } catch (error) {
      console.error("Error removing from watchlist:", error);
      alert("Failed to remove from watchlist.");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white px-4 py-8">
      <button
        onClick={() => router.back()}
        className="cursor-pointer text-2xl font-bold p-10"
      >
        Back
      </button>

      <h1 className="text-center font-bold text-4xl text-amber-300 mb-12">
        Watch List
      </h1>

      {movies.length === 0 ? (
        <div className="text-center text-gray-400">
          <p className="text-lg">No movies in your watchlist.</p>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto flex flex-col gap-6">
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="bg-[#191919] flex items-center rounded-lg shadow-lg p-4 relative hover:-translate-y-1 hover:shadow-xl transition-transform"
            >
              <Image
                src={movie.backdrop || "/default.jpg"}
                alt={movie.title}
                width={180}
                height={180}
                className="rounded-lg"
              />
              <div className="ml-8 flex-grow">
                <h2 className="text-xl font-semibold text-white">
                  {movie.title}
                </h2>
                <p className="text-sm text-gray-400 mt-2">{movie.year}</p>
                <p className="text-sm text-gray-400 mt-1">
                  Rating: {movie.rating}
                </p>
              </div>
              <div
                className="absolute right-4 top-1/2 -translate-y-1/2"
                onClick={() => removeFromWatchlist(movie.id)
                
                }
              >
                <h3 className="cursor-pointer text-orange-600">Remove</h3>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
