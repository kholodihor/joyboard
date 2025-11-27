import Image from 'next/image';

const Hero = () => {
  return (
    <div className="grid h-[80vh] grid-cols-1 items-center bg-gradient-to-b from-purple-700 to-pink-500 px-[10%] py-16 lg:grid-cols-2 2xl:h-[85vh]">
      <div className="p-2 text-white">
        <h1 className="text-5xl font-extrabold">
          JoyBoard brings all your tasks, teammates, and tools together
        </h1>
        <p className="mt-3 text-lg leading-10">
          Simple, flexible, and powerful. All it takes are boards, lists, and
          cards to get a clear view of who’s doing what and what needs to get
          done.
        </p>
      </div>
      <div>
        <Image src="/pokemons.png" alt="pokemons" width={500} height={500} />
      </div>
    </div>
  );
};

export default Hero;
