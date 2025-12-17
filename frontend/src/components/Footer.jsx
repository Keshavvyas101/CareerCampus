import React from "react";

const Footer = () => {
  return (
    <footer className="bg-blue-900 text-white py-6 mt-12 text-center">
      <p className="text-sm">
        &copy; {new Date().getFullYear()} CareerCompass. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
