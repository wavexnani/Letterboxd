"use client";

import { useRouter } from "next/navigation";

export default function SearchPage() {
    const router = useRouter();

    const pushTohome = () => {
        router.push("/home")
      };

    return(
        <div>

            <button onClick={pushTohome} className="text-2xl font-bold p-10 ">Back</button>

            <div className="relative mx-44 to-5% mt-10 w-3/4 h-10 rounded-2xl bg-white">
                <form action="#">
                <input type="text" className="absolute px-4 top-0 w-full  h-10 rounded-2xl text-black bg-white"/>
                <button className="absolute right-0 w-fit rounded-2xl font-bold h-10 bg-amber-300 pt-1 px-6 pb-1 text-black">Search</button>
                </form>
            </div> 
            <div className="m-6 bg-amber-300">
            </div>
        </div>
    );
}
