import { Link } from "react-router-dom";
import RegForm from "./common/reg-from";
import Social from "./common/social";
// image import
import Logo from "@/assets/images/logo/logosmalldark.png";
import Illustration from "@/assets/images/auth/ils1.svg";

const register = () => {
  return (
    <>
      <div className="loginwrapper">
        <div className="lg-inner-column">
          <div className="left-column relative z-[1]">
            <div className="absolute left-0 top-0 h-full w-full z-[-1]">
              <img src={Illustration} alt="" className="h-full w-full object-contain" />
            </div>
          </div>
          <div className="right-column relative bg-white dark:bg-slate-800">
            <div className="inner-content h-full flex flex-col bg-white dark:bg-slate-800">
              <div className="auth-box h-full flex flex-col justify-center">
                <div className="mobile-logo text-center lg:hidden block">
                  <Link to="/">
                    <img src={Logo} alt="logoJvalley.jpg" className="mx-auto w-[60px]" />
                  </Link>
                </div>
                <div className="text-center">
                  <h4 className="font-medium">Sign up</h4>
                  <div className="text-slate-500 dark:text-slate-400 text-base">Create an account</div>
                </div>
                <RegForm />
                {/* <div className=" relative border-b-[#9AA2AF] border-opacity-[16%] border-b pt-6">
                  <div className=" absolute inline-block  bg-white dark:bg-slate-800 left-1/2 top-1/2 transform -translate-x-1/2 px-4 min-w-max text-sm  text-slate-500  dark:text-slate-400font-normal ">Or continue with</div>
                </div>
                <div className="max-w-[242px] mx-auto mt-8 w-full">
                  <Social />
                </div> */}
                <div className="mx-auto font-normal text-slate-500 dark:text-slate-400 mt-4 uppercase text-sm">
                  Already registered?{" "}
                  <Link to="/" className="text-slate-900 dark:text-white font-medium hover:underline">
                    Sign In
                  </Link>
                </div>
              </div>
              <div className="auth-footer text-center">Copyright {new Date().getFullYear()}, Dashcode All Rights Reserved.</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default register;
