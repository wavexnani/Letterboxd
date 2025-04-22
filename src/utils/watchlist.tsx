import axios from "axios";

export const addToWatchlist = async (username: string, movieId: number) => {
  try {
    const res = await axios.post(
      "http://127.0.0.1:5000/watchlist",
      { username, movie_id: movieId },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (res.status === 200) {
      alert("Added to watchlist!");
    } else {
      alert("Failed to add to watchlist.");
    }
  } catch (error: any) {
    console.error(
      "Error adding to watchlist:",
      error.response?.data || error.message
    );
    alert("Failed to add to watchlist.");
  }
};