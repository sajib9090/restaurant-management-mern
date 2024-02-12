/* eslint-disable react/prop-types */
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useRef } from "react";
import DateFormatter from "../DateFormatter/DateFormatter";
import CurrencyFormatter from "../CurrencyFormatter/CurrencyFormatter";
import ReactToPrint from "react-to-print";

const KitchenModal = ({table_name, totalPrice, tableWiseCart, handleCross, isKitchenModalOpen, setIsKitchenModalOpen}) => {
    
    const componentRef = useRef();
    return (
        <>
           <Transition appear show={isKitchenModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setIsKitchenModalOpen(!isKitchenModalOpen)}
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
                  <div ref={componentRef} className="p-4 min-h-[400px]">
                    <h1 className="text-center font-bold text-xl">
                      Food Republic
                    </h1>
                    <h1 className="text-center font-semibold text-base mb-1 capitalize">
                      {table_name}
                    </h1>

                    <div className="text-center text-[10px]">
                      <DateFormatter dateString={new Date()} />
                    </div>
                    <h1 className="text-center font-bold">Kitchen Copy</h1>
                    <div>
                      <div className="min-h-[30px] border-b border-black flex items-center justify-between text-xs mt-2">
                        <div>Items</div>
                        <div className="flex items-center">
                          <p>Quantity</p>
                          <p className="mr-1 ml-6">Price</p>
                        </div>
                      </div>
                      <div>
                        {tableWiseCart
                          ?.sort((a, b) =>
                            a.item_name.localeCompare(b.item_name)
                          )
                          .map((item, index) => (
                            <div
                              onClick={() => handleCross(item)}
                              key={item._id}
                              className="min-h-[30px] w-full border-b border-gray-500 flex items-center cursor-pointer justify-between text-[10px]"
                            >
                              <div className="flex items-center min-w-[70%]">
                                <p className="">{index + 1}.</p>
                                {item.showDeleteTag ? (
                                  <del className=" wrapped-text capitalize">
                                    {item.item_name}
                                  </del>
                                ) : (
                                  <p className="wrapped-text capitalize">
                                    {item.item_name}
                                  </p>
                                )}
                              </div>
                              <div className="flex items-center min-w-[30%]">
                                <div className="ml-auto flex min-w-[30%]">
                                  <button className=" text-black">
                                    {item.item_quantity}
                                  </button>
                                  <button className="ml-2 text-black">-</button>
                                </div>
                                <div className="text-black min-w-[70%] flex justify-end">
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
                      <div className="text-base font-semibold mt-1">
                        <h1 className="flex justify-end">
                          Total Price:{" "}
                          <span className="ml-2">
                            <CurrencyFormatter value={totalPrice} />
                          </span>
                        </h1>
                      </div>
                    </div>
                  </div>
                  <div className="text-center space-x-4 my-4">
                    <ReactToPrint
                      trigger={() => (
                        <button className="h-[40px] w-[160px] bg-blue-500 rounded-md text-white">
                          Print Kitchen Copy
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

export default KitchenModal;