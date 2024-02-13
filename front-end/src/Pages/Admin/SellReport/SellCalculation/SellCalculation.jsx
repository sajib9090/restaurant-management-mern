import { useEffect, useState } from "react";
import { RiLoader2Line } from "react-icons/ri";
import SellReportTable from "../../../../Components/SellReportTable/SellReportTable";
import CurrencyFormatter from "../../../../Components/CurrencyFormatter/CurrencyFormatter";
import { getApiRequest } from "../../../../api/apiRequest";
import toast from "react-hot-toast";

const SellCalculation = () => {
  const [allSoldData, setAllSoldData] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [totalBillSum, setTotalBillSum] = useState(0);
  const [totalDiscountSum, setTotalDiscountSum] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedDate) {
      setLoading(true);
      getApiRequest(`/api/v2/sold-invoices/date/${selectedDate}`)
        .then((res) => {
          setAllSoldData(res?.invoices);
        })
        .catch((err) => {
          if (err) {
            toast.error("Something went wrong!");
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [selectedDate]);

  useEffect(() => {
    const totalBillSum = allSoldData?.reduce(
      (total, invoice) => total + invoice.total_bill,
      0
    );
    setTotalBillSum(totalBillSum);

    const totalDiscountSum = allSoldData?.reduce(
      (total, invoice) => total + invoice.total_discount,
      0
    );
    setTotalDiscountSum(totalDiscountSum);
  }, [allSoldData]);

  return (
    <div className="max-w-[1050px] mx-auto">
      <div className="mt-8">
        {selectedDate ? (
          <h1 className="text-center font-semibold text-lg text-white">
            Select a date first
          </h1>
        ) : (
          <h1 className="text-center font-semibold text-lg">
            Select a date first
          </h1>
        )}
        <div className="flex justify-center">
          <input
            type="date"
            className="h-[40px] w-[220px] bg-blue-500 px-4 rounded-md text-white"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
        {loading ? (
          <div className="flex flex-col justify-center items-center mt-2">
            <RiLoader2Line className="w-6 h-6 animate-spin" />
            <p className="text-center text-red-600 text-lg font-bold">
              Please wait...
            </p>
          </div>
        ) : null}
      </div>
      {allSoldData?.length > 0 ? (
        <>
          {" "}
          <div className="mb-6">
            <h1 className="text-center text-xl font-semibold mt-4">
              Total Invoice Found:{" "}
              <span>{allSoldData && allSoldData?.length}</span>
            </h1>
          </div>
          <h1 className="text-base font-bold text-center mb-2">
            Date: {selectedDate}
          </h1>
        </>
      ) : null}

      <>
        {selectedDate ? (
          <>
            {allSoldData && allSoldData?.length > 0 ? (
              <>
                {allSoldData &&
                  allSoldData?.map((item, index) => (
                    <SellReportTable
                      key={item._id}
                      index={index}
                      id={item?._id}
                      tableName={item?.table_name}
                      items={item?.items}
                      totalBill={item?.total_bill}
                      totalDiscount={item?.total_discount}
                      date={item?.createdAt}
                      serial={item?.fr_id}
                    />
                  ))}

                <div className="max-w-sm ml-auto">
                  <h1 className="text-lg text-bold flex mt-3 justify-end border-b border-gray-300 pr-2">
                    Total Sell:{" "}
                    <span className="ml-auto">
                      <CurrencyFormatter value={totalBillSum} />
                    </span>
                  </h1>
                  <h1 className="text-lg text-bold flex justify-end mt-1 border-b border-gray-300 pr-2">
                    Total Discount:{" "}
                    <span className="ml-auto">
                      <CurrencyFormatter value={totalDiscountSum} />
                    </span>
                  </h1>
                  <h1 className="text-xl text-bold flex justify-end mt-1 border-b border-gray-300 pr-2">
                    Grand Total:{" "}
                    <span className="ml-auto">
                      <CurrencyFormatter
                        value={totalBillSum - totalDiscountSum}
                      />
                    </span>
                  </h1>
                </div>
              </>
            ) : (
              <>
                {loading ? null : (
                  <h1 className="text-center font-semibold text-lg text-red-600 mt-4">
                    No data found.
                  </h1>
                )}
              </>
            )}
          </>
        ) : null}
      </>
    </div>
  );
};

export default SellCalculation;
