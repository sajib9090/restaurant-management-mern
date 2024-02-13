/* eslint-disable react/prop-types */
import { useRef } from "react";
import DateFormatter from "../DateFormatter/DateFormatter";
import CurrencyFormatter from "../CurrencyFormatter/CurrencyFormatter";
import CurrencyFormatter2 from "../CurrencyFormatter2/CurrencyFormatter2";
import ReactToPrint from "react-to-print";

const Invoice = ({ soldInvoice, grandTotal, handleBackToSell, backButton }) => {
  const componentRef = useRef();

  return (
    <div>
      <div
        ref={componentRef}
        className="max-w-[310px] min-h-[300px] shadow-md mx-auto rounded-md pb-1"
      >
        <div className="text-center mt-6">
          <div className="mx-auto w-full">
            <img
              src="https://i.ibb.co/CvZ6N5H/food-republic-bw-logo.png"
              alt=""
              className="h-[50px] text-center mx-auto"
            />
          </div>
          <h1 className="text-2xl font-bold">Food Republic</h1>
          <p className="text-[8.5px] -mt-0.5">
            Mazhi Plaza 2nd floor, Naria, Shariatpur
          </p>
          <div className="text-[8.5px] flex justify-center space-x-1">
            <p>+8801770 940333,</p>
            <p>+8801903 390050</p>
          </div>
          <p className="text-[8px] text-black mt-2">
            InvoiceID: <span className="ml-1">{soldInvoice?.fr_id}</span>
          </p>
          <p className="text-xs mb-1">
            <DateFormatter dateString={soldInvoice?.createdAt} />
          </p>
          <p className="capitalize text-xs">{soldInvoice?.table_name}</p>
        </div>
        <p className="text-[8px] pl-2">
          Served by:{" "}
          <span className="capitalize">
            {soldInvoice && soldInvoice?.served_by
              ? soldInvoice?.served_by
              : "Anonymous"}
          </span>
        </p>
        <div className="mt-2 px-1">
          <div className="min-h-[30px] border-b border-black flex justify-between items-center px-3 text-[10px]">
            <div>Items</div>
            <div className="flex">
              <div className="mr-8">Quantity</div>
              <div>Price</div>
            </div>
          </div>
          {soldInvoice &&
            soldInvoice?.items?.map((item, index) => (
              <div
                key={item._id}
                className="min-h-[27px] w-full border-b border-gray-600 flex items-center justify-between text-[10px]"
              >
                <div className="flex items-center w-[70%]">
                  <p className="mr-1">{index + 1}.</p>
                  <div className="wrapped-text3 capitalize">
                    {item?.item_name}
                  </div>
                </div>
                <div className="flex items-center justify-end w-[30%]">
                  <div className="flex items-center w-[30%]">
                    <div className="mr-3">{item.item_quantity}</div>
                    <div>-</div>
                  </div>
                  <div className="ml-1 w-[70%] text-end">
                    <CurrencyFormatter
                      value={item.item_price_per_unit * item.item_quantity}
                    />
                  </div>
                </div>
              </div>
            ))}
        </div>
        <div className="w-[210px] flex flex-col justify-end ml-auto mt-2">
          <div className="flex justify-end text-sm font-medium min-w-full">
            <p className="w-[50%] text-end">Total Bill:</p>
            <div className="w-[50%] text-end">
              <CurrencyFormatter2 value={grandTotal} />
            </div>
          </div>
          <div className="min-w-[50%]">
            {soldInvoice?.total_discount && soldInvoice?.total_discount > 0 ? (
              <>
                <div className="flex justify-end text-sm font-medium w-full">
                  <p className="w-[50%] text-end">Discount:</p>
                  <div className="w-[50%] text-end">
                    <CurrencyFormatter2 value={soldInvoice?.total_discount} />
                  </div>
                </div>
                <div className="flex justify-end text-sm font-bold w-full">
                  <p className="w-[50%] text-end">Net Bill:</p>
                  <div className="w-[50%] text-end">
                    <CurrencyFormatter2
                      value={grandTotal - soldInvoice?.total_discount}
                    />
                  </div>
                </div>
              </>
            ) : null}
          </div>
        </div>
        <div className="text-[7px] text-start ml-2 mt-2 font-medium">
          Software Developed by Saif Sajib
        </div>
      </div>
      <div className="max-w-[310px] mx-auto text-right">
        {backButton ? (
          <button
            onClick={() => handleBackToSell()}
            className="mt-2 px-6 py-2 bg-black rounded-md text-white hover:bg-opacity-80 duration-500 transition-all mr-2"
          >
            Back to sell
          </button>
        ) : null}
        <ReactToPrint
          trigger={() => (
            <button className="mt-2 px-6 py-2 bg-purple-800 rounded-md text-white hover:bg-opacity-80 duration-500 transition-all">
              Print
            </button>
          )}
          content={() => componentRef.current}
        />
      </div>
    </div>
  );
};

export default Invoice;
