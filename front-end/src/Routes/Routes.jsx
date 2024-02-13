/* eslint-disable react-refresh/only-export-components */
import { createBrowserRouter } from "react-router-dom";
import Main from "../Layout/Main";
import Home from "../Pages/Home/Home";
import Login from "../Pages/Login/Login";
import PrivateRoute from "./PrivateRoute";
import { Suspense, lazy } from "react";
const Sell = lazy(() => import("../Pages/Sell/Sell"));
const SelectOrders = lazy(() => import("../Pages/SelectOrders/SelectOrders"));
const SoldInvoice = lazy(() => import("../Pages/SoldInvoice/SoldInvoice"));
const Admin = lazy(() => import("../Pages/Admin/Admin"));
const SellReport = lazy(() => import("../Pages/Admin/SellReport/SellReport"));
const SellCalculation = lazy(() =>
  import("../Pages/Admin/SellReport/SellCalculation/SellCalculation")
);

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <PrivateRoute>
        <Main />
      </PrivateRoute>
    ),
    errorElement: <h1>Error</h1>,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/sell",
        element: (
          <Suspense fallback={<p>Loading...</p>}>
            <Sell />
          </Suspense>
        ),
      },
      {
        path: "/sell/:name",
        element: (
          <Suspense fallback={<p>Loading...</p>}>
            <SelectOrders />
          </Suspense>
        ),
      },
      {
        path: "/sell/:name/:id",
        element: (
          <Suspense fallback={<p>Loading...</p>}>
            <SoldInvoice />
          </Suspense>
        ),
      },
      {
        path: "/admin",
        element: (
          <Suspense fallback={<p>Loading...</p>}>
            <Admin />
          </Suspense>
        ),
        children: [
          {
            path: "sell-report",
            element: (
              <Suspense fallback={<p>Loading...</p>}>
                <SellReport />
              </Suspense>
            ),
            children: [
              {
                path: "sell-calculation",
                element: (
                  <Suspense fallback={<p>Loading...</p>}>
                    <SellCalculation />
                  </Suspense>
                ),
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
]);
