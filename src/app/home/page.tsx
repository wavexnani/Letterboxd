"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function HomePage() {
  const router = useRouter();

  const pushTomovie = () => {
    router.push("/movie");
  };

  const pushTosearch = () => {
    router.push("/search");
  };

  const handleLogin = () => {
    router.push("/login");
  };

  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  console.log(apiKey); // Check if it logs correctly

  return (
    <div className="min-h-screen bg-black text-white">
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
          <div className="flex-wrap absolute top-0 right-10 flex justify-between gap-x-10 pt-5 px-1">
            <button className="font-bold text-xl">Watch List</button>
            <button className="font-bold text-xl">Setting</button>
            <button onClick={handleLogin} className="font-bold text-xl">
              Logout
            </button>
            <Image
              className="rounded-lg "
              src="/logo.png"
              alt="logo"
              width={110}
              height={100}
            />
          </div>

          <div className="pt-32 flex flex-row flex-wrap justify-between gap-5 items-stretch ">
            {/*welcome*/}
            <div className="flex flex-col items-center w-1/3  text-5xl z-10 font-bold ">
              <div>Welcome to </div>
              <div className="pl-30"> Letter boxd</div>
            </div>

            {/* search bar */}
            <div className="relative mx-44 to-5% mt-10 w-3/4 h-10 rounded-2xl bg-white">
              <form action="#">
                <input
                  onClick={pushTosearch}
                  type="text"
                  className="absolute px-4 top-0 w-full  h-10 rounded-2xl text-black bg-white"
                />
                <button className="absolute right-0 w-fit rounded-2xl font-bold h-10 bg-amber-300 pt-1 px-6 pb-1 text-black">
                  Search
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Top rated Movies */}
      <div className="container mx-auto mt-20 p-4 ">
        <h1 className="text-3xl font-bold text-center mb-6">Movies</h1>
        <div className="flex flex-wrap justify-center gap-6 ">
          {movies.map(
            (movie) =>
              movie.id <= 3 && (
                <div
                  key={movie.id}
                  className="bg-[#191919] rounded-lg p-10 shadow-lg"
                >
                  <Image
                    onClick={pushTomovie}
                    src={movie.poster}
                    alt={movie.title}
                    width={150}
                    height={300}
                    className="rounded-lg"
                  />
                  <h2 className="text-xl font-semibold mt-2 text-white text-center">
                    {movie.title}
                  </h2>
                </div>
              )
          )}
        </div>
      </div>

      <div className="mt-10 mx-10 flex flex-col">
        <div className="text-3xl pb-3">Trending</div>
        <div className=" overflow-x-auto max-w-full h-70 rounded-2xl bg-[#191919] ">
          {/* we have to add boxes */}
          <div className="flex flex-nowrap px-10 pt-7 gap-6">
            {movies.map((movie) => (
              <div key={movie.id} className="shrink-0">
                <Image
                  onClick={pushTomovie}
                  src={movie.poster}
                  alt={movie.title}
                  width={150}
                  height={300}
                  className="rounded-lg"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-10  flex flex-col">
        <div className=" mx-10 text-3xl pb-3">Latest Trailers</div>
        <div
          className=" max-w-full h-90 bg-[#191919] "
          style={{ boxShadow: "inset 0 4px 10px rgba(0, 0, 0, 0.4)" }}
        >
          <div className="m-10 max-w-full h-70 rounded-2xl overflow-auto  ">
            {/* we have to add boxes */}
            <div className="flex flex-nowrap pt-7 gap-6">
              {movies.map((movie) => (
                <div key={movie.id} className="shrink-0">
                  <Image
                    onClick={pushTomovie}
                    src={movie.poster}
                    alt={movie.title}
                    width={150}
                    height={300}
                    className="rounded-lg"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 mx-10 flex flex-col">
        <div className="text-3xl pb-3">English</div>
        <div className=" max-w-full h-70 rounded-2xl overflow-auto bg-[#191919] ">
          {/* we have to add boxes */}
          <div className="flex flex-nowrap px-10 pt-7 gap-6">
            {movies.map((movie) => (
              <div key={movie.id} className="shrink-0">
                <Image
                  onClick={pushTomovie}
                  src={movie.poster}
                  alt={movie.title}
                  width={150}
                  height={300}
                  className="rounded-lg"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const movies = [
  {
    id: 1,
    title: "Spiderman",
    year: 2002,
    director: "Sam Raimi",
    description: "A story of Peter Parker becoming Spiderman.",
    poster: "/movies/spiderman.jpg",
  },
  {
    id: 2,
    title: "Inception",
    year: 2010,
    director: "Christopher Nolan",
    description: "A skilled thief enters dreams to steal secrets.",
    poster: "/movies/inception.jpg",
  },
  {
    id: 3,
    title: "Joker",
    year: 2019,
    director: "Todd Phillips",
    description: "Arthur Fleck transforms into the Joker.",
    poster: "/movies/joker.jpg",
  },
  {
    id: 4,
    title: "Spiderman",
    year: 2002,
    director: "Sam Raimi",
    description: "A story of Peter Parker becoming Spiderman.",
    poster: "/movies/spiderman.jpg",
  },
  {
    id: 5,
    title: "Inception",
    year: 2010,
    director: "Christopher Nolan",
    description: "A skilled thief enters dreams to steal secrets.",
    poster: "/movies/inception.jpg",
  },
  {
    id: 6,
    title: "Joker",
    year: 2019,
    director: "Todd Phillips",
    description: "Arthur Fleck transforms into the Joker.",
    poster: "/movies/joker.jpg",
  },
  {
    id: 7,
    title: "Spiderman",
    year: 2002,
    director: "Sam Raimi",
    description: "A story of Peter Parker becoming Spiderman.",
    poster: "/movies/spiderman.jpg",
  },
  {
    id: 8,
    title: "Inception",
    year: 2010,
    director: "Christopher Nolan",
    description: "A skilled thief enters dreams to steal secrets.",
    poster: "/movies/inception.jpg",
  },
  {
    id: 9,
    title: "Joker",
    year: 2019,
    director: "Todd Phillips",
    description: "Arthur Fleck transforms into the Joker.",
    poster: "/movies/joker.jpg",
  },
];
