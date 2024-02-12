import { useContext, useEffect, useState } from "react";
import { MdDining } from "react-icons/md";
import { Link } from "react-router-dom";
import { ItemsContext } from "../../GlobalContext/ItemsContext";
import { CartContext } from "../../GlobalContext/CartContext";
import LiveTimeCounter from "../../Components/LiveTimeCounter/LiveTimeCounter";

const Sell = () => {
  const { tables, tableLoading } = useContext(ItemsContext);
  const { carts } = useContext(CartContext);
  const [orderLog, setOrderLog] = useState([]);

  const uniqueTableNames =
    carts && carts?.length > 0
      ? [...new Set(carts?.map((item) => item?.table_name))]
      : [];

  useEffect(() => {
    const orderLogData = JSON.parse(localStorage.getItem("order-log")) || [];
    setOrderLog(orderLogData);
  }, []);

  const getOrderStaffNameByTable = (tableName) => {
    const orderLogData = orderLog.find(
      (order) => order.table_name === tableName
    );
    return orderLogData ? orderLogData?.selectedStaff : "";
  };
  const getOrderTimeByTable = (tableName) => {
    const orderLogData = orderLog.find(
      (order) => order.table_name === tableName
    );
    return orderLogData ? orderLogData?.time : "";
  };

  return (
    <>
      {tableLoading ? (
        <div className="min-h-[calc(100vh-120px)] flex justify-center items-center">
          loading...
        </div>
      ) : (
        <div>
          <h1 className="text-center font-bold text-3xl text-[#1677FF] my-4">
            Select a Table First
          </h1>
          <div className="grid grid-cols-4 gap-6">
            {tables?.map((table) => (
              <Link
                to={`${table?.name}`}
                key={table._id}
                className={`h-[200px] border border-gray-200 rounded-full shadow-xl flex flex-col justify-center items-center ${
                  uniqueTableNames?.includes(table?.name)
                    ? "bg-red-300"
                    : "hover:bg-[#1677ff1f] cursor-pointer hover:text-[#1677FF] duration-700"
                }`}
              >
                <MdDining className="h-12 w-12 mb-2" />
                <h1 className="text-lg font-bold capitalize">{table?.name}</h1>
                {getOrderStaffNameByTable(table?.name) ? (
                  <div className="text-sm text-gray-600 mt-1">
                    <p className="capitalize text-center">
                      Pending by{" "}
                      <span className="text-purple-900 font-extrabold">
                        {getOrderStaffNameByTable(table?.name)}
                      </span>
                    </p>
                    <div className="text-center text-xs text-red-900 font-medium">
                      <LiveTimeCounter
                        startTime={getOrderTimeByTable(table?.name)}
                      />
                    </div>
                  </div>
                ) : null}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Sell;
