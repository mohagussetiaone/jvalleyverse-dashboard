import Icon from "@/components/ui/Icon";
import useMenulayout from "@/hooks/useMenulayout";
import useMobileMenu from "@/hooks/useMobileMenu";
import useNavbarType from "@/hooks/useNavbarType";
import useRtl from "@/hooks/useRtl";
import useSidebar from "@/hooks/useSidebar";
import useSkin from "@/hooks/useSkin";
import useWidth from "@/hooks/useWidth";
import React from "react";
import HorizentalMenu from "./Tools/HorizentalMenu";
// import Language from "./Tools/Language";
import Logo from "./Tools/Logo";
import Message from "./Tools/Message";
import MonoChrome from "./Tools/MonoChrome";
import Notification from "./Tools/Notification";
import Profile from "./Tools/Profile";
import SearchModal from "./Tools/SearchModal";
import SwitchDark from "./Tools/SwitchDark";
import { useQuery } from "@tanstack/react-query";
import { handleGetProfile } from "@/api/Profile/ProfileApi";
import Loading from "@/components/Loading";
import ErrorPage from "@/components/error/ErrorPage";

const Header = ({ className = "custom-class" }) => {
  const [collapsed, setMenuCollapsed] = useSidebar();
  const { width, breakpoints } = useWidth();
  const [navbarType] = useNavbarType();

  const navbarTypeClass = () => {
    switch (navbarType) {
      case "floating":
        return "floating  has-sticky-header";
      case "sticky":
        return "sticky top-0 z-[999]";
      case "static":
        return "static";
      case "hidden":
        return "hidden";
      default:
        return "sticky top-0";
    }
  };

  const [menuType] = useMenulayout();
  const [skin] = useSkin();
  const [isRtl] = useRtl();

  const [mobileMenu, setMobileMenu] = useMobileMenu();

  const handleOpenMobileMenu = () => {
    setMobileMenu(!mobileMenu);
  };

  const borderSwicthClass = () => {
    if (skin === "bordered" && navbarType !== "floating") {
      return "border-b border-slate-200 dark:border-slate-700";
    } else if (skin === "bordered" && navbarType === "floating") {
      return "border border-slate-200 dark:border-slate-700";
    } else {
      return "dark:border-b dark:border-slate-700 dark:border-opacity-60";
    }
  };

  const {
    error: errorUserProfile,
    isLoading: isPendingUserProfile,
    data: userProfile,
  } = useQuery({
    queryKey: ["getProfile"],
    queryFn: handleGetProfile,
  });

  if (errorUserProfile) return <ErrorPage />;
  if (isPendingUserProfile) return <Loading />;

  return (
    <header className={className + " " + navbarTypeClass()}>
      <div
        className={` app-header md:px-6 px-[15px]  dark:bg-slate-800 shadow-base dark:shadow-base3 bg-white
        ${borderSwicthClass()}
             ${menuType === "horizontal" && width > breakpoints.xl ? "py-1" : "md:py-6 py-3"}
        `}
      >
        <div className="flex justify-between items-center h-full">
          {/* For Vertical  */}

          {menuType === "vertical" && (
            <div className="flex items-center md:space-x-4 space-x-2 rtl:space-x-reverse">
              {collapsed && width >= breakpoints.xl && (
                <button className="text-xl text-slate-900 dark:text-white" onClick={() => setMenuCollapsed(!collapsed)}>
                  {isRtl ? <Icon icon="akar-icons:arrow-left" /> : <Icon icon="akar-icons:arrow-right" />}
                </button>
              )}
              {width <= breakpoints.md && (
                <div className="cursor-pointer text-slate-900 dark:text-white text-2xl" onClick={handleOpenMobileMenu}>
                  <Icon icon="heroicons-outline:menu-alt-3" />
                </div>
              )}
              {/* open mobile menu handlaer*/}
              {width < breakpoints.md && width >= breakpoints.md && (
                <div className="cursor-pointer text-slate-900 dark:text-white text-2xl" onClick={handleOpenMobileMenu}>
                  <Icon icon="heroicons-outline:menu-alt-3" />
                </div>
              )}
              <SearchModal />
            </div>
          )}
          {/* For Horizontal  */}
          {menuType === "horizontal" && (
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <Logo />
              {/* open mobile menu handlaer*/}
              {width <= breakpoints.xl && (
                <div className="cursor-pointer text-slate-900 dark:text-white text-2xl" onClick={handleOpenMobileMenu}>
                  <Icon icon="heroicons-outline:menu-alt-3" />
                </div>
              )}
            </div>
          )}
          {/*  Horizontal  Main Menu */}
          {menuType === "horizontal" && width >= breakpoints.xl ? <HorizentalMenu /> : null}
          {/* Nav Tools  */}
          <div className="nav-tools flex items-center lg:space-x-6 space-x-3 rtl:space-x-reverse">
            {/* <Language /> */}
            <SwitchDark />
            <MonoChrome />
            {width >= breakpoints.md && <Message />}
            {width >= breakpoints.md && <Notification />}
            <Profile userProfile={userProfile} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
