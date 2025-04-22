"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type Review = {
  review: string;
  movie_id: number;
  movie_title: string;
  backdrop: string;
};

export default function ReviewsPage() {
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    const storedUsername = localStorage.getItem("email");
    setUsername(storedUsername);
  }, []);

  useEffect(() => {
    if (!username) return;

    fetch("http://127.0.0.1:5000/get_reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setReviews(data);
        } else {
          console.error("Unexpected response:", data);
        }
      })
      .catch((error) => console.error("Error fetching reviews:", error));
  }, [username]);

  return (
    <div className="min-h-screen bg-black text-white px-4 py-8">
      <button
        onClick={() => router.back()}
        className="cursor-pointer text-2xl font-bold p-10"
      >
        Back
      </button>

      <h1 className="text-center font-bold text-4xl text-amber-300 mb-12">
        Your Reviews
      </h1>

      {reviews.length === 0 ? (
        <div className="text-center text-gray-400">
          <p className="text-lg">You haven't submitted any reviews yet.</p>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto flex flex-col gap-6">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="bg-[#191919] flex items-center rounded-lg shadow-lg p-4 relative hover:-translate-y-1 hover:shadow-xl transition-transform"
            >
              <Image
                src={review.backdrop || "/default.jpg"}
                alt={review.movie_title}
                width={180}
                height={180}
                className="rounded-lg"
              />
              <div className="ml-8 flex-grow">
                <h2 className="text-xl font-semibold text-white">
                  {review.movie_title}
                </h2>
                <p className="text-gray-300 mt-3"> Review: {review.review}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}