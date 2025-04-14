import Image from "next/image";

export default function MoviePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Background Image */}
      <div className="relative w-full h-[500px] md:h-[560px]">
        <Image
          src="/bigPosters/Biginception.jpg"
          alt="Big Poster"
          layout="fill"
          objectFit="cover"
          className="opacity-20"
        />
      </div>

      {/* Navbar */}
      <div className="absolute top-0 left-0 right-0 flex flex-wrap justify-between items-center pt-6 p-4 md:p-6 lg:px-16">
        <div className="flex gap-4 md:gap-8 text-sm md:text-lg font-bold ">
          <div>Watch List</div>
          <div>Setting</div>
          <div>Back</div>
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
          <img
            src="/movies/inception.jpg"
            alt="poster"
            className="w-full h-auto rounded-lg"
          />
        </div>

        {/* Movie Details */}
        <div className="flex flex-col text-lg md:text-2xl text-center md:text-left max-w-lg md:max-w-2xl  p-4 md:p-6 rounded-lg shadow-lg">
          <div className="pb-4 md:pb-6 text-2xl md:text-3xl font-bold">
            Inception
          </div>
          <div className="pb-4 md:pb-6 flex font-bold justify-center md:justify-start items-center gap-2">
            Watch Trailer <span className="text-amber-300 text-2xl">▶</span>
          </div>
          <div className="pb-4 md:pb-6 font-bold">IMDB rating: 8/10</div>

          {/* Overview */}
          <div>
            <div className="font-bold text-xl md:text-2xl">Overview :</div>
            <p className="pt-2 md:pt-4 text-sm md:text-lg leading-relaxed">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam
              rerum perferendis obcaecati minus eligendi repellendus nobis rem
              tempore, aperiam, voluptatibus deserunt est soluta aut illo
              excepturi?
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
