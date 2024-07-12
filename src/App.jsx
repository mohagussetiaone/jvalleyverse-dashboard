import React from "react";
import { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { authLoader } from "@/lib/authLoader";

// Layout
import Layout from "@/layout/Layout";

// Auth
import SignIn from "@/pages/auth/login";
import SignIn2 from "@/pages/auth/login2";
import SignIn3 from "@/pages/auth/login3";
import SignUp from "@/pages/auth/register";
import SignUp2 from "@/pages/auth/register2";
import SignUp3 from "@/pages/auth/register3";
import ResetPassword from "@/pages/auth/forgot-password";
import ResetPassword2 from "@/pages/auth/forgot-password2";
import ResetPassword3 from "@/pages/auth/forgot-password3";
import LockScreen from "@/pages/auth/lock-screen";
import LockScreen2 from "@/pages/auth/lock-screen2";
import LockScreen3 from "@/pages/auth/lock-screen3";

// Home & Dashboard
import Dashboard from "@/pages/dashboard";
import Ecommerce from "@/pages/dashboard/ecommerce";
import CrmPage from "@/pages/dashboard/crm";
import ProjectPage from "@/pages/dashboard/project";
import BankingPage from "@/pages/dashboard/banking";

// Components
import Button from "@/pages/components/button";
import Dropdown from "@/pages/components/dropdown";
import Badges from "@/pages/components/badges";
import Colors from "@/pages/components/colors";
import Typography from "@/pages/components/typography";
import Alert from "@/pages/components/alert";
import Progressbar from "@/pages/components/progress-bar";
import Card from "@/pages/components/card";
import Image from "@/pages/components/image";
import Placeholder from "@/pages/components/placeholder";
import Tooltip from "@/pages/components/tooltip-popover";
import Modal from "@/pages/components/modal";
import Carousel from "@/pages/components/carousel";
import Pagination from "@/pages/components/pagination";
import TabsAc from "@/pages/components/tab-accordion";
import Video from "@/pages/components/video";

// Forms
import InputPage from "@/pages/forms/input";
import TextareaPage from "@/pages/forms/textarea";
import CheckboxPage from "@/pages/forms/checkbox";
import RadioPage from "@/pages/forms/radio-button";
import SwitchPage from "@/pages/forms/switch";
import InputGroupPage from "@/pages/forms/input-group";
import InputLayoutPage from "@/pages/forms/input-layout";
import InputMask from "@/pages/forms/input-mask";
import FormValidation from "@/pages/forms/form-validation";
import FileInput from "@/pages/forms/file-input";
import FormRepeater from "@/pages/forms/form-repeater";
import FormWizard from "@/pages/forms/form-wizard";
import SelectPage from "@/pages/forms/select";
import Flatpicker from "@/pages/forms/date-time-picker";

// Charts
import AppexChartPage from "@/pages/chart/appex-chart";
import ChartJs from "@/pages/chart/chartjs";
import Recharts from "@/pages/chart/recharts";

// Map
import MapPage from "@/pages/map";

// Tables
import BasicTablePage from "@/pages/table/table-basic";
import TanstackTable from "@/pages/table/react-table";

// Utility Pages
import InvoicePage from "@/pages/utility/invoice";
import InvoiceAddPage from "@/pages/utility/invoice-add";
import InvoicePreviewPage from "@/pages/utility/invoice-preview";
import InvoiceEditPage from "@/pages/utility/invoice-edit";
import PricingPage from "@/pages/utility/pricing";
import BlankPage from "@/pages/utility/blank-page";
// import ComingSoonPage from "@/pages/utility/coming-soon";
// import UnderConstructionPage from "@/pages/utility/under-construction";
import BlogPage from "@/pages/utility/blog";
import BlogDetailsPage from "@/pages/utility/blog/blog-details";
import FaqPage from "@/pages/utility/faq";
import Profile from "@/pages/Profile";
import Settings from "@/pages/Profile/components/Settings";
import IconPage from "@/pages/icons";
import NotificationPage from "@/pages/utility/notifications";
import ChangelogPage from "@/pages/changelog";
import NotFound from "@/pages/404";

// Widgets
import BasicWidget from "@/pages/widget/basic-widget";
import StatisticWidget from "@/pages/widget/statistic-widget";

// App Pages
import TodoPage from "@/pages/app/todo";
import EmailPage from "@/pages/app/email";
import ChatPage from "@/pages/app/chat";
import ProjectPostPage from "@/pages/app/projects";
import ProjectDetailsPage from "@/pages/app/projects/project-details";
import KanbanPage from "@/pages/app/kanban";
import CalenderPage from "@/pages/app/calender";

const router = createBrowserRouter([
  {
    path: "/",
    loader: authLoader,
    element: <Layout />,
    children: [
      { path: "dashboard", element: <Dashboard /> },
      { path: "ecommerce", element: <Ecommerce /> },
      { path: "crm", element: <CrmPage /> },
      { path: "project", element: <ProjectPage /> },
      { path: "banking", element: <BankingPage /> },
      { path: "todo", element: <TodoPage /> },
      { path: "email", element: <EmailPage /> },
      { path: "chat", element: <ChatPage /> },
      { path: "projects", element: <ProjectPostPage /> },
      { path: "projects/:id", element: <ProjectDetailsPage /> },
      { path: "kanban", element: <KanbanPage /> },
      { path: "calender", element: <CalenderPage /> },
      { path: "button", element: <Button /> },
      { path: "dropdown", element: <Dropdown /> },
      { path: "badges", element: <Badges /> },
      { path: "colors", element: <Colors /> },
      { path: "typography", element: <Typography /> },
      { path: "alert", element: <Alert /> },
      { path: "progress-bar", element: <Progressbar /> },
      { path: "card", element: <Card /> },
      { path: "image", element: <Image /> },
      { path: "placeholder", element: <Placeholder /> },
      { path: "tooltip-popover", element: <Tooltip /> },
      { path: "modal", element: <Modal /> },
      { path: "carousel", element: <Carousel /> },
      { path: "pagination", element: <Pagination /> },
      { path: "tab-accordion", element: <TabsAc /> },
      { path: "video", element: <Video /> },
      { path: "input", element: <InputPage /> },
      { path: "textarea", element: <TextareaPage /> },
      { path: "checkbox", element: <CheckboxPage /> },
      { path: "radio-button", element: <RadioPage /> },
      { path: "switch", element: <SwitchPage /> },
      { path: "input-group", element: <InputGroupPage /> },
      { path: "input-layout", element: <InputLayoutPage /> },
      { path: "input-mask", element: <InputMask /> },
      { path: "form-validation", element: <FormValidation /> },
      { path: "file-input", element: <FileInput /> },
      { path: "form-repeater", element: <FormRepeater /> },
      { path: "form-wizard", element: <FormWizard /> },
      { path: "select", element: <SelectPage /> },
      { path: "date-time-picker", element: <Flatpicker /> },
      { path: "appex-chart", element: <AppexChartPage /> },
      { path: "chartjs", element: <ChartJs /> },
      { path: "recharts", element: <Recharts /> },
      { path: "map", element: <MapPage /> },
      { path: "table-basic", element: <BasicTablePage /> },
      { path: "react-table", element: <TanstackTable /> },
      { path: "invoice", element: <InvoicePage /> },
      { path: "invoice-add", element: <InvoiceAddPage /> },
      { path: "invoice-preview", element: <InvoicePreviewPage /> },
      { path: "invoice-edit", element: <InvoiceEditPage /> },
      { path: "pricing", element: <PricingPage /> },
      { path: "blank-page", element: <BlankPage /> },
      { path: "blog", element: <BlogPage /> },
      { path: "blog-details", element: <BlogDetailsPage /> },
      { path: "faq", element: <FaqPage /> },
      { path: "profile/setting", element: <Settings /> },
      { path: "profile", element: <Profile /> },
      { path: "basic", element: <BasicWidget /> },
      { path: "statistic", element: <StatisticWidget /> },
      { path: "icons", element: <IconPage /> },
      { path: "notifications", element: <NotificationPage /> },
      { path: "changelog", element: <ChangelogPage /> },
    ],
  },
  { path: "signin", element: <SignIn /> },
  { path: "signin2", element: <SignIn2 /> },
  { path: "signin3", element: <SignIn3 /> },
  { path: "signup", element: <SignUp /> },
  { path: "signup2", element: <SignUp2 /> },
  { path: "signup3", element: <SignUp3 /> },
  { path: "reset-password", element: <ResetPassword /> },
  { path: "reset-password2", element: <ResetPassword2 /> },
  { path: "reset-password3", element: <ResetPassword3 /> },
  { path: "lock-screen", element: <LockScreen /> },
  { path: "lock-screen2", element: <LockScreen2 /> },
  { path: "lock-screen3", element: <LockScreen3 /> },
  { path: "*", element: <NotFound /> },
]);

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
    </>
  );
}
