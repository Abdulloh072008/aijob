import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./pages/Layout";
import { Suspense } from "react";
import { AI, Analytics, Application, CV, Dashboard, EditProfile, ForgetPassword, Home, Job, Login, Massegee, MyApplication, MyNetwork, Notivigation, OrgProfile, PostJob, Profile, Register, ResetPasswoerd, Search } from "./router/router";
import { Toaster } from "./components/ui/toaster";

const App = () => {
  const route = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/home",
          element: <Suspense><Home /></Suspense>
        },
        {
          path: "/mynetwork",
          element: <Suspense><MyNetwork /></Suspense>
        },
        {
          path: "/jobs",
          element: <Suspense><Job /></Suspense>
        },
        {
          path: "/messages",
          element: <Suspense><Massegee /></Suspense>
        },
        {
          path: "/notifications",
          element: <Suspense><Notivigation /></Suspense>
        },
        {
          path: "/ai",
          element: <Suspense><AI /></Suspense>
        },
        {
          path: "/search",
          element: <Suspense><Search /></Suspense>
        },
        {
          path: "/profile",
          element: <Suspense><Profile /></Suspense>
        },
        {
          path: "/profile/:id",
          element: <Suspense><Profile /></Suspense>
        },
        {
          path: "/myapplication",
          element: <Suspense><MyApplication /></Suspense>
        },
        {
          path: "/cv",
          element: <Suspense><CV /></Suspense>
        },
        {
          path: "/editprofile",
          element: <Suspense><EditProfile /></Suspense>
        },
        {
          path: "dashboard",
          element: <Suspense><Dashboard /></Suspense>
        },
        {
          path: "postjob",
          element: <Suspense><PostJob /></Suspense>
        },

        {
          path: "/analytics",
          element: <Suspense><Analytics /></Suspense>
        },
        {
          path: "/application",
          element: <Suspense><Application /></Suspense>
        },
        {
          path: "/orgprofile", 
          element: <Suspense><OrgProfile /></Suspense>
        },
        {
          path: "/orgprofile/:id",
          element: <Suspense><OrgProfile /></Suspense>
        }
      ]
    },
    {
      index: true,
      element: <Suspense><Login /></Suspense>
    },
    {
      path: "/login",
      element: <Suspense><Login /></Suspense>
    },
    {
      path: "/register",
      element: <Suspense><Register /></Suspense>
    },
    {
      path: "/forget-password",
      element: <Suspense><ForgetPassword /></Suspense>
    },
    {
      path: "/reset-password",
      element: <Suspense><ResetPasswoerd /></Suspense>
    }
  ]);

  return (
    <>
      <RouterProvider router={route} />
      <Toaster />
    </>
  );
};

export default App;