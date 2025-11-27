const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <div className="z-1000 relative overflow-hidden bg-[#232323] py-4 text-white">
      <footer>
        <div className="mx-auto w-full max-w-screen-xl justify-center gap-2 p-4 md:flex md:items-center">
          <span className="flex text-sm sm:text-center">
            © {currentYear}{' '}
            <li className="mx-2 list-none hover:underline">JoyBoard</li> All
            Rights Reserved.
          </span>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
