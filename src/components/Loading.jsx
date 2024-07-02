import React from "react";
import useDarkMode from "@/hooks/useDarkMode";
import LogoWhite from "@/assets/images/logo/logosmalldark.png";
import Logo from "@/assets/images/logo/logosmalldark.png";
import { useSelector } from "react-redux";

const Loading = () => {
  const [isDark] = useDarkMode();
  return (
    <div className="flex flex-col items-center justify-center app_height">
      <div className="mb-3 mr-3">
        <img src={isDark ? LogoWhite : Logo} alt="Logo" className="h-20 w-20" />
      </div>
      <svg className="animate-spin mt-4 ltr:-ml-1 ltr:mr-3 rtl:-mr-1 rtl:ml-3 h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <span className="inline-block mt-2 font-medium text-sm"> Loading, please wait...</span>
    </div>
  );
};

export default Loading;
