import { Fragment } from "react";
import Card from "@/components/ui/Card";
import { Tab, TabGroup, TabList, TabPanels, TabPanel } from "@headlessui/react";
import DetailProfile from "./components/DetailProfile";
import PersonalData from "./components/PersonalData";
import PasswordChange from "./components/PasswordChange";
import { handleGetProfile } from "@/api/Profile/ProfileApi";
import { useQuery } from "@tanstack/react-query";
import Loading from "@/components/Loading";
import ErrorPage from "@/components/error/ErrorPage";

const buttons = [
  {
    title: "Detail profile",
    icon: "heroicons-outline:home",
  },
  {
    title: "Personal Data",
    icon: "heroicons-outline:user",
  },
  {
    title: "Password",
    icon: "heroicons-outline:cog",
  },
];

const index = () => {
  const {
    error: errorUserProfile,
    isLoading: isPendingUserProfile,
    data: userProfile,
  } = useQuery({
    queryKey: ["getProfile"],
    queryFn: handleGetProfile,
  });

  if (isPendingUserProfile) return <Loading />;
  if (errorUserProfile) return <ErrorPage />;

  console.log("userProfile", userProfile);

  return (
    <div className="w-full">
      <Card title="Update Your Profile">
        <TabGroup>
          <div className="grid grid-cols-12 md:gap-2">
            <div className="lg:col-span-3 md:col-span-5 col-span-12">
              <TabList>
                {buttons.map((item, i) => (
                  <Tab key={i} as={Fragment}>
                    {({ selected }) => (
                      <button
                        className={`text-sm font-medium md:block inline-block mb-4 last:mb-0 capitalize ring-0 foucs:ring-0 focus:outline-none px-6 rounded-md py-2 transition duration-150 ${
                          selected ? "text-white bg-primary-500 " : "text-slate-500 bg-white dark:bg-slate-700 dark:text-slate-300"
                        }`}
                      >
                        {item.title}
                      </button>
                    )}
                  </Tab>
                ))}
              </TabList>
            </div>
            <div className="lg:col-span-9 md:col-span-7 col-span-12">
              <TabPanels>
                <TabPanel>
                  <DetailProfile userProfile={userProfile} />
                </TabPanel>
                <TabPanel>
                  <PersonalData userProfile={userProfile} />
                </TabPanel>
                <TabPanel>
                  <PasswordChange userProfile={userProfile} />
                </TabPanel>
              </TabPanels>
            </div>
          </div>
        </TabGroup>
      </Card>
    </div>
  );
};

export default index;
