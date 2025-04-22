"use client";
import { addToWatchlist } from "@/utils/watchlist";
import Image from "next/image";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";

export default function MoviePage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const [personalMovie, setPersonalMovie] = useState<any>(null);
  const [reviewText, setReviewText] = useState<string>("");

  const handleReviews = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = localStorage.getItem("email");

    if (!email || !personalMovie?.id) {
      alert("Please login to submit a review.");
      return;
    }

    try {
      const res = await axios.post("http://127.0.0.1:5000/submit_review", {
        username: email,
        movie_id: personalMovie.id,
        review: reviewText,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.status === 200) {
        alert("Review submitted successfully!");
        setReviewText(""); // Clear input
      } else {
        alert("Failed to submit review.");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Error while submitting review.");
    }
  };

  useEffect(() => {
    if (!id) return;

    axios
      .get(`http://127.0.0.1:5000/movies/${id}`) // ✅ Template string works now
      .then((res) => {
        setPersonalMovie(res.data);
        console.log("Fetched movie:", res.data);
      })
      .catch((error) => {
        console.error("Error fetching movie details:", error);
      });
  }, [id]);

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
          <div
            onClick={() => router.push("/watchlist")}
            className="cursor-pointer"
          >
            Watch List
          </div>
          <div>Setting</div>
          <div onClick={() => router.back()} className="cursor-pointer">
            Back
          </div>
          <div onClick={() => router.push("/login")} className="cursor-pointer">
            Logout
          </div>
        </div>
        <Image
          onClick={() => router.push("/home")}
          className="rounded-lg cursor-pointer"
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
        <button
          onClick={() => {
            const user_id = localStorage.getItem("email");
            console.log("user_id from localStorage:", user_id);
            if (!user_id) {
              alert("Please log in to add to your watchlist.");
              return;
            }
            addToWatchlist(user_id, personalMovie.id);
          }}
          className="px-6 md:px-8 py-2 text-lg md:text-2xl rounded-lg text-amber-300 font-bold bg-[#191919] cursor-pointer
           hover:bg-[#292929] transition duration-300 shadow-lg hover:shadow-xl"
        >
          Watchlist
        </button>
      </div>

      {/* Reviews Section */}
      {/* Reviews Section */}
      <form
        onSubmit={handleReviews}
        className="w-full md:w-[90%] lg:w-[80%] mx-auto mt-10 bg-[#191919] rounded-lg p-4 md:p-6 relative z-10"
      >
        <div className="font-bold text-lg md:text-2xl text-amber-300">
          Reviews
        </div>
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
