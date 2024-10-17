import Login from "../components/Auth/Login"
import Register from "../components/Auth/Register";

const DashboardRoutes = {
  path: "auth",
  children: [
    {
      path: "login",
      element: <Login />,
      index: true,
    },
    {
      path: "register",
      element: <Register />,
      index: true,
    },
  ],
};

export default DashboardRoutes;
