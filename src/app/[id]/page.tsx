import Image from 'next/image';
export default function DefaultPage({ params } : { params: { id: string } }) {
    return (
        <div>

                <div className="relative w-fill h-[330px] overflow-hidden opacity-10">
                    <Image  src="/welcome.jpg" alt="logo"  layout="fill" objectFit="cover" />
                </div>
                <div className="flex-wrap absolute top-0 right-10 flex justify-between gap-x-10 pt-5 px-1">
                  <div className="font-bold text-xl">Watch List</div>
                  <div className="font-bold text-xl">Setting</div>
                  <div className="font-bold text-xl">Logout</div>
                  <Image className="rounded-lg" src="/logo.png" alt="logo"  width={110} height={100} />
                </div>
                <div className="absolute top-35 w-100 left-10 text-5xl font-bold ">
                  <div>Welcome to</div> 
                  <div className="absolute left-40 w-100 pt-5">Letter boxd</div>
                </div>
                <div className="absolute top-52.5 right-10 w-full max-w-[485] mx-auto">
                  <input type="text" placeholder="Hinted search text" className="w-full h-10 py-3 pl-4 pr-10 bg-gray-100 text-gray-700 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-800"/>
                  <div className="absolute inset-y-0 right-3 flex items-center">
                    🔍 {/* Replace with an actual icon */}
                  </div>
                </div>

            <div className="text-3xl font-bold text-center pt-72">
                hello {params.id}
            </div>
    </div>
    );
}
