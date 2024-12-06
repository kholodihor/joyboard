import Image from "next/image";

const Hero = () => {
  return (
    <div className="px-[10%] items-center py-16 grid grid-cols-1 lg:grid-cols-2 bg-gradient-to-b min-h-screen from-purple-700 to-pink-500">
      <div className="text-white p-2">
        <h1 className="font-extrabold text-5xl">
          JoyBoard brings all your tasks, teammates, and tools together
        </h1>
        <p className="text-lg mt-3 leading-10">
          Simple, flexible, and powerful. All it takes are boards, lists, and
          cards to get a clear view of who’s doing what and what needs to get
          done.
        </p>
      </div>
      <div>
        <Image src="/pokemons1.png" alt="pokemons" width={500} height={500} />
      </div>
    </div>
  );
};

export default Hero;
