import { createBrowserRouter } from "react-router";
import { MenuPage } from "./pages/MenuPage";
import { TableSelection } from "./pages/TableSelection";
import { ServiceDashboard } from "./pages/ServiceDashboard";
import { RatingPage } from "./pages/RatingPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MenuPage />,
  },
  {
    path: "/table/:tableNumber",
    element: <MenuPage />,
  },
  {
    path: "/select",
    element: <TableSelection />,
  },
  {
    path: "/service",
    element: <ServiceDashboard />,
  },
  {
    path: "/rating/:tableNumber",
    element: <RatingPage />,
  },
]);
