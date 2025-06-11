const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <div className="z-1000 relative overflow-hidden">
      <div className="mx-auto h-full min-h-[10vh] min-w-[100vw] max-w-screen-xl justify-center gap-2 bg-[url(/header-bg.jpg)] p-4 md:flex md:items-center">
        <span className="flex text-sm sm:text-center">
          © {currentYear}{' '}
          <li className="mx-2 list-none hover:underline">JoyBoard</li> All
          Rights Reserved.
        </span>
      </div>
    </div>
  );
};

export default Footer;
