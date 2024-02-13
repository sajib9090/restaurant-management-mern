import { useState } from "react";
import { RiLoader2Fill } from "react-icons/ri";
import { getApiRequest } from "../../../../api/apiRequest";
import toast from "react-hot-toast";
import Invoice from "../../../../Components/Invoice/Invoice";

const FindSellInvoice = () => {
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [invoice, setInvoice] = useState({});

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchValue) {
      setLoading(true);
      if (searchValue?.length > 23) {
        getApiRequest(`/api/v2/sold-invoice/id/${searchValue}`)
          .then((res) => {
            setInvoice(res?.invoice);
          })
          .catch((err) => {
            if (err) {
              toast.error("Something went wrong!");
            }
          })
          .finally(() => {
            setLoading(false);
          });
      } else {
        getApiRequest(`/api/v2/sold-invoice/fr_id/${searchValue}`)
          .then((res) => {
            setInvoice(res?.invoice);
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
    }
  };

  return (
    <div>
      <div className="max-w-lg mx-auto mt-6">
        <p className="text-lg font-bold my-1">
          Find invoice by id or serial number{" "}
        </p>
        <form onSubmit={handleSearch}>
          <input
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="h-[40px] w-full border-2 border-blue-600 rounded px-2"
            type="search"
            placeholder="Enter id or serial number"
            required
          />
          <button
            type="submit"
            className="h-[40px] w-full bg-blue-600 mt-2 rounded text-white flex items-center justify-center"
          >
            Search{" "}
            {loading ? (
              <RiLoader2Fill className="w-6 h-6 animate-spin text-white ml-2" />
            ) : null}
          </button>
        </form>
      </div>
      {/* invoice */}
      <div className="mt-16">
        {invoice?._id ? (
          <Invoice
            soldInvoice={invoice}
            backButton={false}
            grandTotal={invoice?.total_bill}
          />
        ) : null}
      </div>
    </div>
  );
};

export default FindSellInvoice;
