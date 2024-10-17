import { createBrowserRouter } from "react-router-dom";

// project import
import DashboardRoutes from "./DashboardRoutes";
import AuthRoutes from "./AuthRoutes";
import NotFound from "../components/notFoundPage/NotFound";

// import NotFound from "../pages/404-page.jsx";

const router = createBrowserRouter([
  DashboardRoutes,
  AuthRoutes,
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
