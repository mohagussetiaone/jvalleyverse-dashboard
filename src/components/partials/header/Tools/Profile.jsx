import React from "react";
import Dropdown from "@/components/ui/Dropdown";
import Icon from "@/components/ui/Icon";
import { MenuItem } from "@headlessui/react";
import { useNavigate } from "react-router-dom";
import supabase from "@/configs/supabaseConfig";
import UserAvatar from "@/assets/images/all-img/user.png";
import toast from "react-hot-toast";
import { clearAllStorage } from "@/store/local/Forage-Helper";

const profileLabel = (userProfile) => {
  const urlImageProfile = `${import.meta.env.VITE_CDN_GET_IMAGE}/jvalleyverseImg/${userProfile}`;
  return (
    <div className="flex items-center">
      <div className="flex-1">
        <div className="lg:h-8 lg:w-8 h-7 w-7 rounded-full">
          <img src={urlImageProfile || UserAvatar} alt="" className="block w-full h-full object-cover rounded-full" />
        </div>
      </div>
    </div>
  );
};

const Profile = ({ userProfile }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const logoutPromise = new Promise(async (resolve, reject) => {
      try {
        // Membuat pengguna baru admin dengan Supabase
        const { error } = await supabase.auth.signOut();
        if (error) {
          reject(error);
        } else {
          resolve(error);
          await clearAllStorage();
        }
      } catch (error) {
        console.log("catch error", error);
        if (error.message === "Network Error") {
          reject("Internal Server Error");
        } else {
          reject(error.message || "Email atau Password tidak valid");
        }
      }
    });

    toast.promise(
      logoutPromise,
      {
        loading: "Memproses logout...",
        success: () => {
          navigate("/signin");
          return "Logout Berhasil";
        },
        error: (error) => {
          console.log("error", error);
          return "Terjadi kesalahan saat logout";
        },
      },
      {
        success: {
          duration: 2000,
        },
        error: {
          duration: 4000,
        },
      }
    );
  };

  const ProfileMenu = [
    {
      label: "Profile",
      icon: "heroicons-outline:user",

      action: () => {
        navigate("/profile");
      },
    },
    // {
    //   label: "Chat",
    //   icon: "heroicons-outline:chat",
    //   action: () => {
    //     navigate("/chat");
    //   },
    // },
    // {
    //   label: "Email",
    //   icon: "heroicons-outline:mail",
    //   action: () => {
    //     navigate("/email");
    //   },
    // },
    // {
    //   label: "Todo",
    //   icon: "heroicons-outline:clipboard-check",
    //   action: () => {
    //     navigate("/todo");
    //   },
    // },
    {
      label: "Settings",
      icon: "heroicons-outline:cog",
      action: () => {
        navigate("/settings");
      },
    },
    // {
    //   label: "Price",
    //   icon: "heroicons-outline:credit-card",
    //   action: () => {
    //     navigate("/pricing");
    //   },
    // },
    // {
    //   label: "Faq",
    //   icon: "heroicons-outline:information-circle",
    //   action: () => {
    //     navigate("/faq");
    //   },
    // },
    {
      label: "Logout",
      icon: "heroicons-outline:login",
      action: () => {
        handleLogout();
      },
    },
  ];

  return (
    <Dropdown label={profileLabel(userProfile.profile_image_url)} classMenuItems="w-[180px] top-[58px]">
      {ProfileMenu.map((item, index) => (
        <MenuItem key={index}>
          {({ active }) => (
            <div
              onClick={() => item.action()}
              className={`${active ? "bg-slate-100 text-slate-900 dark:bg-slate-600 dark:text-slate-300 dark:bg-opacity-50" : "text-slate-600 dark:text-slate-300"} block ${
                item.hasDivider ? "border-t border-slate-100 dark:border-slate-700" : ""
              }`}
            >
              <div className={`block cursor-pointer px-4 py-2`}>
                <div className="flex items-center">
                  <span className="block text-xl ltr:mr-3 rtl:ml-3">
                    <Icon icon={item.icon} />
                  </span>
                  <span className="block text-sm">{item.label}</span>
                </div>
              </div>
            </div>
          )}
        </MenuItem>
      ))}
    </Dropdown>
  );
};

export default Profile;
