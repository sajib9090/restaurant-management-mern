import { useState } from "react";
import toast from "react-hot-toast";
import { RiLoader2Line } from "react-icons/ri";
import CurrencyFormatter from "../../../../Components/CurrencyFormatter/CurrencyFormatter";
import { getApiRequest } from "../../../../api/apiRequest";

const StaffSellRecord = () => {
  const [loading, setLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [findDataByMonthWithServedBy, setFindDataByMonthWithServedBy] =
    useState([]);

  const handleFindData = () => {
    if (selectedMonth) {
      setLoading(true);
      getApiRequest(`/api/v2/sold-invoices/month/${selectedMonth}`)
        .then((res) => {
          setFindDataByMonthWithServedBy(res.staffSellRecord);
        })
        .catch((err) => {
          if (err) {
            toast.error("Fetched invoices failed!");
          }
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      toast.error("Pick a month first");
    }
  };

  const tableData = findDataByMonthWithServedBy.reduce(
    (result, staffRecord) => {
      const { staff, sellRecord } = staffRecord;
      result[staff] = { staff };

      sellRecord.forEach(({ createdAt, sum }) => {
        if (!result[staff][createdAt]) {
          result[staff][createdAt] = sum;
        }
      });

      return result;
    },
    {}
  );

  // Extract unique dates from the sellRecord
  const uniqueDates = Array.from(
    new Set(
      findDataByMonthWithServedBy.flatMap(({ sellRecord }) =>
        sellRecord.map(({ createdAt }) => createdAt)
      )
    )
  );

  // Calculate sum for each staff
  const staffSum = Object.values(tableData).reduce((sums, row) => {
    uniqueDates.forEach((date) => {
      sums[row.staff] = (sums[row.staff] || 0) + (row[date] || 0);
    });
    return sums;
  }, {});

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
          required
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="h-[30px] w-[70%] bg-blue-600 rounded-l text-white px-2"
        />
        <button
          onClick={handleFindData}
          disabled={loading}
          className="h-[30px] w-[30%] border-l border-white text-white bg-blue-600 rounded-r flex items-center justify-center"
        >
          Search{" "}
          {loading ? (
            <RiLoader2Line className="h-5 w-5 animate-spin text-white " />
          ) : null}
        </button>
      </div>

      {/* Display the table */}
      {Object.keys(tableData)?.length > 0 ? (
        <table className="table-auto my-4 mx-auto">
          <thead>
            <tr>
              <th className="border px-4 py-2"></th>
              {Object.values(tableData).map((row, index) => (
                <th key={index} className="border px-4 py-2 capitalize">
                  {row.staff}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {uniqueDates.map((date, dateIndex) => (
              <tr key={dateIndex}>
                <td className="border px-6 py-4">{date}</td>
                {Object.values(tableData).map((row, rowIndex) => (
                  <td key={rowIndex} className="border px-6 py-4">
                    <CurrencyFormatter value={row[date] || 0} />
                  </td>
                ))}
              </tr>
            ))}
            {/* Display sum row for each staff */}
            <tr>
              <td className="border px-6 py-4">Total</td>
              {Object.values(tableData).map((row, rowIndex) => (
                <td key={rowIndex} className="border px-6 py-4">
                  <CurrencyFormatter value={staffSum[row.staff] || 0} />
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      ) : null}
    </div>
  );
};

export default StaffSellRecord;
