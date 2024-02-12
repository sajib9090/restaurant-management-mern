import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./Routes/Routes";
import "./index.css";
import { Toaster } from "react-hot-toast";
import AuthProvider from "./GlobalContext/AuthProvider";
import { ItemsProvider } from "./GlobalContext/ItemsContext";
import { CartProvider } from "./GlobalContext/CartContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <>
    <Toaster />
    <AuthProvider>
      <ItemsProvider>
        <CartProvider>
          <RouterProvider router={router}></RouterProvider>
        </CartProvider>
      </ItemsProvider>
    </AuthProvider>
  </>
);
