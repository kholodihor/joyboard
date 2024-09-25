import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <div>
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
