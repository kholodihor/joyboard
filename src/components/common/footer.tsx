const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <div className="overflow-hidden relative z-1000 py-4">
      <footer>
        <div className="w-full mx-auto max-w-screen-xl p-4 gap-2 md:flex md:items-center justify-center bg-[url(/header-bg.jpg)]">
          <span className="flex text-sm sm:text-center">
            © {currentYear}{" "}
            <li className="hover:underline list-none mx-2">JoyBoard</li> All
            Rights Reserved.
          </span>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
