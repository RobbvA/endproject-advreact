import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./components/Root";
import EventsPage from "./pages/EventsPage";
import EventPage from "./pages/EventPage";

//  Router config
const router = createBrowserRouter([
  {
    path: "/", // Homepage
    element: <Root />, // Layout component (Outlet)
    children: [
      {
        path: "/", // Events overview
        element: <EventsPage />,
      },
      {
        path: "/event/:eventId", // /event/1 or /event/abc
        element: <EventPage />,
      },
    ],
  },
]);

//  React app render
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ChakraProvider>
      <RouterProvider router={router} />
    </ChakraProvider>
  </React.StrictMode>
);
