import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { RiLoader2Line } from "react-icons/ri";
import { getApiRequest } from "../../../../api/apiRequest";
import CurrencyFormatter from "../../../../Components/CurrencyFormatter/CurrencyFormatter";
import Chart from "../../../../Components/Chart/Chart";

const SellHistory = () => {
  const [selectedMonth, setSelectedMonth] = useState("");
  const [findDataByMonth, setFindDataByMonth] = useState([]);
  const [allItemNames, setAllItemNames] = useState([]);
  const [totalDaysInMonth, setTotalDaysInMonth] = useState(0);
  const [sellData, setSellData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalBillByMonth, setTotalBillByMonth] = useState({});
  const [totalDiscountByMonth, setTotalDiscountByMonth] = useState({});
  const [allData, setAllData] = useState({});

  const [averageDailySell, setAverageDailySell] = useState(0);

  useEffect(() => {
    const calculateTotals = () => {
      const totalBillResult = findDataByMonth?.reduce((acc, item) => {
        acc += item.total_bill;
        return acc;
      }, 0);

      const totalDiscountResult = findDataByMonth?.reduce((acc, item) => {
        acc += item.total_discount;
        return acc;
      }, 0);

      // Set the results as new states
      setTotalBillByMonth(totalBillResult);
      setTotalDiscountByMonth(totalDiscountResult);

      // Calculate the number of days that have passed in the selected month
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1;
      const [, selectedMonthNumber] = selectedMonth.split("-");
      const daysPassed =
        currentMonth === parseInt(selectedMonthNumber)
          ? currentDate.getDate()
          : totalDaysInMonth;

      // Calculate the average daily sell
      const averageDailySell = totalBillResult / daysPassed;
      // Set the average daily sell as a state
      setAverageDailySell(averageDailySell);
    };

    calculateTotals();
  }, [findDataByMonth, selectedMonth, totalDaysInMonth]);

  const handleSelectDate = () => {
    if (selectedMonth) {
      setLoading(true);
      getApiRequest(`/api/v2/sold-invoices/month/${selectedMonth}`)
        .then((res) => {
          if (res) {
            setFindDataByMonth(res?.invoices);
            setAllData(res);
          }
        })
        .catch((err) => {
          if (err) {
            toast.error("Something went wrong");
          }
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      toast.error("Select a month first");
    }
  };

  useEffect(() => {
    const uniqueItemNames = [
      ...new Set(
        findDataByMonth.flatMap((invoice) =>
          invoice?.items?.map((item) => item.item_name)
        )
      ),
    ];
    setAllItemNames(uniqueItemNames);

    // Calculate total days in the selected month
    if (selectedMonth) {
      const [year, month] = selectedMonth.split("-");
      const lastDayOfMonth = new Date(year, month, 0).getDate();
      setTotalDaysInMonth(lastDayOfMonth);
    }

    // Create a data structure to hold sell quantities for each item and each day
    const sellDataStructure = uniqueItemNames.map((itemName) => ({
      itemName,
      sellQuantities: Array(totalDaysInMonth).fill(0),
    }));

    // Fill the sellDataStructure with actual sell quantities
    findDataByMonth?.forEach((invoice) => {
      const dayOfMonth = new Date(invoice.createdAt).getDate();
      invoice?.items?.forEach((item) => {
        const itemIndex = uniqueItemNames.indexOf(item?.item_name);
        if (itemIndex !== -1) {
          sellDataStructure[itemIndex].sellQuantities[dayOfMonth - 1] +=
            item?.item_quantity;
        }
      });
    });

    setSellData(sellDataStructure);
  }, [findDataByMonth, selectedMonth, totalDaysInMonth]);

  return (
    <div>
      {selectedMonth ? (
        <h1 className="text-center my-2 font-semibold text-white">
          Pick a month
        </h1>
      ) : (
        <h1 className="text-center my-2 font-semibold">Pick a month</h1>
      )}
      <div className="max-w-xs mx-auto flex">
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="h-[30px] w-[70%] bg-blue-600 rounded-l text-white px-2"
        />
        <button
          onClick={handleSelectDate}
          disabled={loading}
          className="h-[30px] w-[30%] border-l border-white text-white bg-blue-600 rounded-r flex items-center justify-center"
        >
          Search{" "}
          {loading ? (
            <RiLoader2Line className="h-5 w-5 animate-spin text-white " />
          ) : null}
        </button>
      </div>
      <>
        {loading ? (
          <h1 className="text-center font-semibold text-xl mt-6">
            Please wait...
          </h1>
        ) : (
          <div>
            <h1 className="text-center text-lg mt-4">{selectedMonth}</h1>
            <>
              {allItemNames ? (
                <>
                  {allItemNames?.length > 0 && (
                    <>
                      <table className="mt-4 border-collapse border border-gray-300">
                        <thead>
                          <tr>
                            <th className="border border-gray-300 p-2"></th>
                            {[...Array(totalDaysInMonth).keys()].map((day) => (
                              <th
                                key={day + 1}
                                className="border border-gray-300 p-2 text-center font-bold bg-blue-100"
                              >
                                {day + 1}
                              </th>
                            ))}
                            <th className="border border-gray-300 p-2 text-center bg-blue-200">
                              Total
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {sellData &&
                            sellData?.map((sellDataRow, index) => (
                              <tr key={sellDataRow.itemName}>
                                <td className="border border-gray-300 p-2 bg-green-200 font-bold capitalize">
                                  <span className="mr-1">{index + 1}.</span>
                                  {sellDataRow.itemName}
                                </td>
                                {sellDataRow?.sellQuantities?.map(
                                  (sellQuantity, index) => (
                                    <td
                                      key={index + 1}
                                      className="border border-gray-300 p-3 bg-slate-100"
                                    >
                                      {sellQuantity == 0 ? "-" : sellQuantity}
                                    </td>
                                  )
                                )}
                                <td className="border border-gray-300 p-2 font-bold bg-purple-300">
                                  {sellDataRow.sellQuantities.reduce(
                                    (sum, qty) => sum + qty,
                                    0
                                  )}
                                </td>
                              </tr>
                            ))}

                          {/* Add a row for the totals */}
                          <tr>
                            <td className="border border-gray-300 p-2 font-bold bg-blue-200">
                              Daily Sell Quantity
                            </td>
                            {sellData &&
                              sellData[0]?.sellQuantities?.map((_, index) => (
                                <td
                                  key={index + 1}
                                  className="border border-gray-300 p-3 font-bold bg-blue-200"
                                >
                                  {sellData.reduce(
                                    (sum, sellDataRow) =>
                                      sum + sellDataRow.sellQuantities[index],
                                    0
                                  )}
                                </td>
                              ))}
                            <td className="border border-gray-300 p-2 font-bold bg-blue-300">
                              {sellData.reduce(
                                (sum, sellDataRow) =>
                                  sum +
                                  sellDataRow.sellQuantities.reduce(
                                    (qtySum, qty) => qtySum + qty,
                                    0
                                  ),
                                0
                              )}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <div className="space-y-2 mt-4 mb-2 ml-2 text-xl w-[600px] flex flex-col">
                        <div className="flex items-center font-bold w-full">
                          <div className="w-[70%] text-left">Total Sell: </div>
                          <div className="w-[30%] text-left">
                            <CurrencyFormatter value={totalBillByMonth} />
                          </div>
                        </div>
                        <hr />
                        <div className="flex items-center font-bold text-yellow-700 w-full">
                          <div className="w-[70%] text-left">
                            Average Daily Sell:{" "}
                          </div>
                          <div className="w-[30%] text-left">
                            <CurrencyFormatter value={averageDailySell} />
                          </div>
                        </div>
                        <hr />
                        <div className="flex items-center w-full font-bold text-red-600">
                          <div className="w-[70%] text-left">
                            Total Discount:{" "}
                          </div>
                          <div className="w-[30%] text-left">
                            <CurrencyFormatter value={totalDiscountByMonth} />
                          </div>
                        </div>
                        <hr />
                        <div className="flex items-center font-bold text-green-600">
                          <div className="w-[70%] text-left">
                            Average Discount (%):{" "}
                          </div>
                          <div className="w-[30%] text-left">
                            {totalDiscountByMonth !== undefined &&
                            totalDiscountByMonth !== null
                              ? (
                                  (totalDiscountByMonth /
                                    (totalBillByMonth - totalDiscountByMonth)) *
                                  100
                                ).toFixed(2) + "%"
                              : "N/A"}
                          </div>
                        </div>
                        <hr />
                        <div className="flex items-center font-bold text-orange-500">
                          <div className="w-[70%] text-left flex items-center">
                            Minimum Sell Day:
                            <div className="ml-2 text-gray-500 text-base">
                              <span>
                                ({allData?.minMaxSummary?.minSellDate})
                              </span>
                            </div>
                          </div>
                          <div className="w-[30%] text-left">
                            <CurrencyFormatter
                              value={allData?.minMaxSummary?.minSell}
                            />
                          </div>
                        </div>
                        <hr />
                        <div className="flex items-center font-bold text-fuchsia-500">
                          <div className="w-[70%] text-left flex items-center">
                            Maximum Sell Day:
                            <div className="ml-2 text-gray-500 text-base">
                              <span>
                                ({allData?.minMaxSummary?.maxSellDate})
                              </span>
                            </div>
                          </div>
                          <div className="w-[30%] text-left">
                            <CurrencyFormatter
                              value={allData?.minMaxSummary?.maxSell}
                            />
                          </div>
                        </div>
                        <hr />
                        <div className="flex items-center font-bold text-blue-700">
                          <div className="w-[70%] text-left text-[25px]">
                            Net Sell:{" "}
                          </div>
                          <div className="text-[28px] font-extrabold w-[30%] text-left">
                            <CurrencyFormatter
                              value={totalBillByMonth - totalDiscountByMonth}
                            />
                          </div>
                        </div>
                        <hr />
                      </div>

                      <div className="mb-8 mt-16">
                        <h1 className="text-center text-xl mt-8 mb-2 text-blue-600">
                          Details Sell Report day by day
                        </h1>
                        <p className="text-center">{selectedMonth}</p>
                        {/* Table */}
                        <table className="border-collapse w-full">
                          <tr className="w-full">
                            <th className="border border-gray-200 p-4 bg-slate-500 text-white w-[20%]">
                              Day
                            </th>
                            <th className="border border-gray-200 p-4 bg-slate-500 text-white w-[50%]">
                              Daily Sell
                            </th>
                            <th className="border border-gray-200 p-4 bg-slate-500 text-white w-[30%]">
                              Daily Discount
                            </th>
                          </tr>
                          {allData?.dailySellSummary?.map((item, index) => (
                            <tr
                              key={item?.createdDate}
                              className={
                                index % 2 == 0 ? "bg-blue-200" : "bg-gray-200"
                              }
                            >
                              <td className="border border-gray-300 text-center p-4 text-black">
                                {item.createdDate}
                              </td>
                              <td className="border border-gray-300 text-center p-4 text-black">
                                <CurrencyFormatter value={item?.daily_sell} />
                              </td>
                              <td className="border border-gray-300 text-center p-4 text-black">
                                <CurrencyFormatter
                                  value={item?.daily_discount}
                                />
                              </td>
                            </tr>
                          ))}
                        </table>
                      </div>
                      {/* chart */}
                      <Chart data={allData?.dailySellSummary} />
                    </>
                  )}
                </>
              ) : (
                <h1 className="text-center font-semibold mt-6 text-red-600 text-2xl">
                  No data found
                </h1>
              )}
            </>
          </div>
        )}
      </>
    </div>
  );
};

export default SellHistory;
