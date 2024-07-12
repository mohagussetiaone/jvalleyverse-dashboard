import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Icon from "@/components/ui/Icon";
import Card from "@/components/ui/Card";
import { useQuery } from "@tanstack/react-query";
import { handleGetProfile } from "@/api/Profile/ProfileApi";
import Loading from "@/components/Loading";
import ErrorPage from "@/components/error/ErrorPage";
import dayjs from "dayjs";

const profile = () => {
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

  console.log("userProfile", userProfile);

  return (
    <>
      <div className="space-y-5 profile-page">
        <div className="px-4 md:px-[35px] pb-10 md:pt-[84px] pt-10 rounded-lg bg-white dark:bg-slate-800 lg:flex lg:space-y-0 space-y-2 md:space-y-6 justify-between items-end relative z-[1]">
          <div className="bg-slate-900 dark:bg-slate-700 absolute left-0 top-0 md:h-1/2 h-[150px] w-full z-[-1] rounded-t-lg"></div>
          <div className="flex-none md:text-start text-center">
            <div className="flex flex-row gap-4 md:gap-12 mt-32 md:mt-14">
              <div className="flex-none">
                <div className="md:h-[186px] md:w-[186px] h-[80px] w-[80px] md:ml-0 md:mr-0 ml-auto mr-auto md:mb-0 mb-4 rounded-full ring-4 ring-slate-100 relative">
                  <img src={`${import.meta.env.VITE_CDN_GET_IMAGE}/jvalleyverseImg/${userProfile?.profile_image_url}`} alt="imageProfile.jpg" className="w-full h-full object-cover rounded-full" />
                  <Link to="/profile/setting" className="absolute -right-2 top-[50px] md:right-2 h-8 w-8 bg-slate-50 text-slate-600 rounded-full shadow-sm flex flex-col items-center justify-center md:top-[140px] ">
                    <Icon icon="heroicons:pencil-square" />
                  </Link>
                </div>
              </div>
              <div className="flex flex-col text-start justify-start md:justify-center">
                <div className="text-2xl font-medium text-slate-900 dark:text-slate-200 mb-[3px]">{userProfile?.name}</div>
                <div className="text-slate-600 dark:text-slate-400">{userProfile?.roles?.role_name}</div>
                <div className="text-sm font-light text-slate-600 dark:text-slate-400">Bergabung sejak {dayjs(userProfile?.created_at).format("DD MMMM YYYY")}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full gap-6">
          <Card title="Info">
            <ul className="list space-y-8">
              <li className="flex space-x-3 rtl:space-x-reverse">
                <div className="flex-none text-2xl text-slate-600 dark:text-slate-300">
                  <Icon icon="heroicons:envelope" />
                </div>
                <div className="flex-1">
                  <div className="uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]">EMAIL</div>
                  <a href="mailto:someone@example.com" className="text-base text-slate-600 dark:text-slate-50">
                    {userProfile?.email}
                  </a>
                </div>
              </li>

              <li className="flex space-x-3 rtl:space-x-reverse">
                <div className="flex-none text-2xl text-slate-600 dark:text-slate-300">
                  <Icon icon="heroicons:phone-arrow-up-right" />
                </div>
                <div className="flex-1">
                  <div className="uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]">PHONE</div>
                  <a href="tel:0189749676767" className="text-base text-slate-600 dark:text-slate-50">
                    {userProfile?.phone ? userProfile?.phone : "N/A"}
                  </a>
                </div>
              </li>

              <li className="flex space-x-3 rtl:space-x-reverse">
                <div className="flex-none text-2xl text-slate-600 dark:text-slate-300">
                  <Icon icon="heroicons:map" />
                </div>
                <div className="flex-1">
                  <div className="uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]">LOCATION</div>
                  <div className="text-base text-slate-600 dark:text-slate-50">{userProfile?.address ? userProfile?.address : "N/A"}</div>
                </div>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </>
  );
};

export default profile;
