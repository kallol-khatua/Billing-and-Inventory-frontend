import { lazy } from "react";
import DashBoardLayout from "../components/Dashboard/DashBoardLayout";
import Main from "../components/Dashboard/Main";
const CreateOrder = lazy(() => import("../components/Dashboard/CreateOrder"));
const Orders = lazy(() => import("../components/Dashboard/Orders"));
const ManageInventory = lazy(() =>
  import("../components/Dashboard/ManageInventory")
);

import { loader as ManageInventoryLoader } from "../components/Dashboard/ManageInventory";
import { loader as CreateOrderLoader } from "../components/Dashboard/CreateOrder";
import { loader as HomeLoader } from "../components/Dashboard/Main";
import { loader as OrdersLoader } from "../components/Dashboard/Orders";

const DashboardRoutes = {
  path: "/",
  element: <DashBoardLayout />,
  children: [
    {
      path: "",
      element: <Main />,
      index: true,
      loader: HomeLoader,
    },
    {
      path: "dashboard",
      children: [
        {
          path: "",
          element: <Main />,
          index: true,
          loader: HomeLoader,
        },
        {
          path: "home",
          element: <Main />,
          index: true,
          loader: HomeLoader,
        },
        {
          path: "create-order",
          element: <CreateOrder />,
          loader: CreateOrderLoader,
        },
        {
          path: "orders",
          element: <Orders />,
          loader: OrdersLoader,
        },
        {
          path: "manage-inventory",
          element: <ManageInventory />,
          loader: ManageInventoryLoader,
        },
      ],
    },
  ],
};

export default DashboardRoutes;
