import { createContext, useContext, useEffect, useState } from "react";
import axiosInstance from "../Hooks/useApiRequest";

const ItemsContext = createContext();

// eslint-disable-next-line react/prop-types
const ItemsProvider = ({ children }) => {
  const [productsKey, setProductsKey] = useState(0);
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [tables, setTables] = useState([]);
  const [staffs, setStaffs] = useState([]);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [menuItemsLoading, setMenuItemsLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);

  // ... other functions ...
  // Function to refetch products data
  const refetch = () => {
    setProductsKey((prevKey) => prevKey + 1);
  };

  const getCategories = async (url) => {
    setCategoryLoading(true);
    try {
      const res = await axiosInstance.get(url, { withCredentials: true });
      setCategories(res.data.data);
    } catch (err) {
      console.log(err);
    } finally {
      setCategoryLoading(false);
    }
  };

  const getMenus = async (url) => {
    setMenuItemsLoading(true);
    try {
      const res = await axiosInstance.get(url, { withCredentials: true });
      setMenuItems(res.data.data);
    } catch (err) {
      console.log(err);
    } finally {
      setMenuItemsLoading(false);
    }
  };

  const getTables = async (url) => {
    setTableLoading(true);
    try {
      const res = await axiosInstance.get(url, { withCredentials: true });
      setTables(res?.data?.tables);
    } catch (err) {
      console.error(err);
    } finally {
      setTableLoading(false);
    }
  };

  const getStaff = async (url) => {
    try {
      const res = await axiosInstance.get(url, { withCredentials: true });
      setStaffs(res?.data?.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getMenus(`${import.meta.env.VITE_API_URL}/api/v2//menu-items`);
    getCategories(`${import.meta.env.VITE_API_URL}/api/v2//categories`);
    getTables(`${import.meta.env.VITE_API_URL}/api/v2/tables`);
    getStaff(`${import.meta.env.VITE_API_URL}/api/v2/staffs`);
  }, [productsKey]);

  return (
    <ItemsContext.Provider
      value={{
        refetch,
        categories,
        categoryLoading,
        setCategoryLoading,
        menuItems,
        menuItemsLoading,
        setMenuItemsLoading,
        tables,
        tableLoading,
        setTableLoading,
        staffs,
      }}
    >
      {children}
    </ItemsContext.Provider>
  );
};

const useItemsContext = () => {
  return useContext(ItemsContext);
};

export { ItemsProvider, ItemsContext, useItemsContext };
