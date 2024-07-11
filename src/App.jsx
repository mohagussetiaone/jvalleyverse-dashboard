import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { authLoader } from "@/lib/authLoader";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Dashboard from "@/pages/dashboard";
import Profile from "@/pages/utility/profile";
import Settings from "@/pages/utility/settings";
import Layout from "@/layout/Layout";

// Auth
import SignIn from "@/pages/auth/login";
import SignUp from "@/pages/auth/register";
import ResetPassword from "@/pages/auth/forgot-password";
import NotFound from "@/pages/404";

// Project
import CategoryProject from "@/pages/CategoryProject/components/CategoryProject";
import Project from "@/pages/Project";
import ChapterProject from "@/pages/ChapterProject";
import ChapterDetails from "@/pages/ChapterDetails";

const router = createBrowserRouter([
  {
    path: "/",
    loader: authLoader,
    element: <Layout />,
    children: [
      {
        path: "/dashboard",
        loader: authLoader,
        Component() {
          return <Dashboard />;
        },
      },
      {
        path: "/profile",
        loader: authLoader,
        Component() {
          return <Profile />;
        },
      },
      {
        path: "/pengaturan",
        loader: authLoader,
        Component() {
          return <Settings />;
        },
      },
      {
        path: "/category-project",
        loader: authLoader,
        Component() {
          return <CategoryProject />;
        },
      },
      {
        path: "/project",
        loader: authLoader,
        Component() {
          return <Project />;
        },
      },
      {
        path: "/chapter-project",
        loader: authLoader,
        Component() {
          return <ChapterProject />;
        },
      },
      {
        path: "/chapter-detail",
        loader: authLoader,
        Component() {
          return <ChapterDetails />;
        },
      },
    ],
  },
  {
    path: "/signin",
    loader: authLoader,
    Component: SignIn,
  },
  {
    path: "/signup",
    loader: authLoader,
    Component: SignUp,
  },
  { path: "/reset-password", loader: authLoader, Component: ResetPassword },
  {
    path: "*",
    element: <NotFound />,
  },
]);

const MINUTE = 1000 * 60;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * MINUTE,
      gcTime: 10 * MINUTE,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      retryOnMount: false,
    },
  },
});

export default function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Toaster
          position="top-center"
          reverseOrder={false}
          gutter={8}
          containerClassName=""
          containerStyle={{}}
          toastOptions={{
            style: {
              background: "#ffff",
              color: "#1577d6",
            },
          }}
        />
        <RouterProvider router={router} />
        <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
      </QueryClientProvider>
    </>
  );
}
