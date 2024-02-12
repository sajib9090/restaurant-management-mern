import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getApiRequest } from "../../api/apiRequest";
import Invoice from "../../Components/Invoice/Invoice";

const SoldInvoice = () => {
  const { id } = useParams();

  const [soldInvoice, setSoldInvoice] = useState({});

  const navigate = useNavigate();

  let grandTotal =
    soldInvoice?.items && Array.isArray(soldInvoice?.items)
      ? soldInvoice.items.reduce(
          (sum, item) =>
            sum + (item?.item_price_per_unit * item?.item_quantity || 0),
          0
        )
      : 0;

  useEffect(() => {
    if (id !== undefined && id !== null) {
      getApiRequest(`/api/v2/sold-invoice/fr_id/${id}`)
        .then((res) => {
          setSoldInvoice(res?.invoice);
        })
        .catch((err) => {
          if (err) {
            toast.error("Something went wrong!");
          }
        });
    }
  }, [id]);

  const handleBackToSell = () => {
    navigate("/sell");
  };
  return (
    <>
      <Invoice
        soldInvoice={soldInvoice}
        grandTotal={grandTotal}
        handleBackToSell={handleBackToSell}
        backButton={true}
      />
    </>
  );
};

export default SoldInvoice;
