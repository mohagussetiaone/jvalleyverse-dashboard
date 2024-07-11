import React from "react";
import { Link } from "react-router-dom";
import LoginForm from "./common/login-form";
// import Social from "./common/social";
import useDarkMode from "@/hook/useDarkMode";

// image import
import LogoWhite from "@/assets/images/logo/logosmalldark.png";
import Logo from "@/assets/images/logo/logosmall.png";
import Illustration from "@/assets/images/auth/ils1.svg";

const login = () => {
  const { darkMode } = useDarkMode();

  return (
    <>
      <div className="loginwrapper">
        <div className="lg-inner-column">
          <div className="left-column relative z-[1]">
            <div>
              <img src={Illustration} alt="bannerLogin.jpg" className="h-auto w-full object-contain" />
            </div>
          </div>
          <div className="right-column relative">
            <div className="inner-content h-full flex flex-col bg-white dark:bg-slate-800">
              <div className="auth-box h-full flex flex-col justify-center">
                <div className="mobile-logo text-center mb-6 lg:hidden block">
                  <Link to="/">
                    <img src={darkMode ? Logo : LogoWhite} alt="logoJvalley.jpg" className="mx-auto w-[60px]" />
                  </Link>
                </div>
                <div className="text-center 2xl:mb-10 mb-4">
                  <h4 className="font-medium">Selamat datang</h4>
                  <div className="text-slate-500 text-base">Sign in kedalam akun anda</div>
                </div>
                <LoginForm />
                {/* <div className="relative border-b-[#9AA2AF] border-opacity-[16%] border-b pt-6">
                  <div className="absolute inline-block bg-white dark:bg-slate-800 dark:text-slate-400 left-1/2 top-1/2 transform -translate-x-1/2 px-4 min-w-max text-sm text-slate-500 font-normal">Or continue with</div>
                </div> */}
                {/* <div className="max-w-[242px] mx-auto mt-8 w-full">
                  <Social />
                </div> */}
                {/* <div className="md:max-w-[345px] mx-auto font-normal text-slate-500 dark:text-slate-400 mt-12 uppercase text-sm">
                  Dont have an account?{" "}
                  <Link to="/register" className="text-slate-900 dark:text-white font-medium hover:underline">
                    Sign up
                  </Link>
                </div> */}
              </div>
              <div className="auth-footer text-center">Copyright {new Date().getFullYear()},Jvalleyverse All Rights Reserved.</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default login;
