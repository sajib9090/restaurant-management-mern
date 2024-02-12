/* eslint-disable react/prop-types */
import DateFormatter from "../DateFormatter/DateFormatter";
import CurrencyFormatter2 from "../CurrencyFormatter2/CurrencyFormatter2";
import ReactToPrint from "react-to-print";
import CurrencyFormatter from "../CurrencyFormatter/CurrencyFormatter";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useRef } from "react";


const CommonModal = ({
  tableWiseCart,
  totalDiscount,
  totalPrice,
  table_name,
  selectedStaff,
  isCustomerModalOpen,
  setIsCustomerModalOpen,
}) => {
  const componentRef = useRef();
  return (
    <>
      <Transition appear show={isCustomerModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setIsCustomerModalOpen(!isCustomerModalOpen)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/75" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-2 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-[310px] transform overflow-hidden rounded-md bg-white text-left align-middle shadow-xl transition-all relative">
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

                      <p className="text-xs mb-1">
                        <DateFormatter dateString={new Date()} />
                      </p>
                      <p className="capitalize text-xs">{table_name}</p>
                    </div>
                    <p className="text-[8px] pl-2">
                      Served by:{" "}
                      <span className="capitalize">{selectedStaff}</span>
                    </p>
                    <div className="mt-2 px-1">
                      <div className="min-h-[30px] border-b border-black flex justify-between items-center px-3 text-[10px]">
                        <div>Items</div>
                        <div className="flex">
                          <div className="mr-8">Quantity</div>
                          <div>Price</div>
                        </div>
                      </div>
                      {tableWiseCart &&
                        tableWiseCart?.map((item, index) => (
                          <div
                            key={item._id}
                            className="min-h-[27px] w-full border-b border-gray-600 flex items-center justify-between text-[10px] pr-1"
                          >
                            <div className="flex items-center w-[70%]">
                              <p className="mr-1">{index + 1}.</p>
                              <p className="wrapped-text3 capitalize">
                                {item?.item_name}
                              </p>
                            </div>
                            <div className="flex items-center justify-end w-[30%]">
                              <div className="flex items-center w-[30%]">
                                <div className="mr-3">{item.item_quantity}</div>
                                <div>-</div>
                              </div>
                              <div className="ml-1 w-[70%] text-end">
                                <CurrencyFormatter
                                  value={
                                    item.item_price_per_unit *
                                    item.item_quantity
                                  }
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                    <div className="w-[210px] flex flex-col justify-end ml-auto mt-2 pr-1">
                      <div className="flex justify-end text-sm font-medium min-w-full">
                        <p className="w-[50%] text-end">Total Bill:</p>
                        <div className="w-[50%] text-end">
                          <CurrencyFormatter2 value={totalPrice} />
                        </div>
                      </div>
                      <div className="min-w-[50%]">
                        {totalDiscount ? (
                          <>
                            <div className="flex justify-end text-sm font-medium w-full">
                              <p className="w-[50%] text-end">Discount:</p>
                              <div className="w-[50%] text-end">
                                <CurrencyFormatter2
                                  value={
                                    totalPrice - (totalPrice - totalDiscount)
                                  }
                                />
                              </div>
                            </div>
                            <div className="flex justify-end text-sm font-bold w-full">
                              <p className="w-[50%] text-end">Net Bill:</p>
                              <div className="w-[50%] text-end">
                                <CurrencyFormatter2
                                  value={totalPrice - totalDiscount}
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
                  <div className="text-center space-x-4 my-4">
                    <ReactToPrint
                      trigger={() => (
                        <button className="h-[40px] w-[160px] bg-blue-500 rounded-md text-white">
                          Print Customer Copy
                        </button>
                      )}
                      content={() => componentRef.current}
                    />
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default CommonModal;
