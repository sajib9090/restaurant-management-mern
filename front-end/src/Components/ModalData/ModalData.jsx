/* eslint-disable react/prop-types */
import CurrencyFormatter from "../CurrencyFormatter/CurrencyFormatter";
import { RiLoader2Line } from "react-icons/ri";
import { MdDelete } from "react-icons/md";

const ModalData = ({
  table_name,
  tableWiseCart,
  itemQuantityDecrease,
  itemQuantityIncrease,
  handleSingleItemRemove,
  handleGotMoney,
  gotMoney,
  totalPrice,
  discountValue,
  memberShipError,
  handleApplyDiscount,
  totalDiscount,
  withoutDiscountItemsPrice,
  backMoney,
  toggleMemberShipOption,
  setToggleMemberShipOption,
  handleMembershipChecking,
  mobileValue,
  setMobileValue,
  memberLoading,
  setIsKitchenModalOpen,
  isKitchenModalOpen,
  setIsCustomerModalOpen,
  isCustomerModalOpen,
  handleSell,
}) => {
  return (
    <>
      <div className="p-4 min-h-[400px]">
        <h1 className="text-center font-bold text-3xl">Food Republic</h1>
        <h1 className="text-center font-semibold text-2xl mb-4 capitalize">
          {table_name}
        </h1>
        <div>
          {tableWiseCart?.length > 0 ? (
            <>
              <div className="min-h-[30px] border-b border-gray-200 flex items-center justify-between mb-2 font-bold">
                <div>
                  <p className="ml-4">Items</p>
                </div>
                <div className="flex items-center mr-16">
                  <p className="mr-[5.4rem]">Quantity</p>
                  <p>Price</p>
                </div>
              </div>
              <div>
                {tableWiseCart
                  ?.sort((a, b) => a.item_name.localeCompare(b.item_name))
                  .map((item, index) => (
                    <div
                      key={item._id}
                      title={item.item_name}
                      className={`min-h-[50px] w-full border-b border-gray-300 flex items-center justify-between pl-2 py-2 ${
                        item?.discount ? "bg-white" : "bg-purple-100"
                      }`}
                    >
                      <div className="flex items-center min-w-[65%]">
                        <p>{index + 1}.</p>
                        <div className="wrapped-text2 capitalize">
                          {item.item_name}
                        </div>
                      </div>
                      <div className="flex items-center min-w-[35%]">
                        <div className="min-w-[30%] flex justify-end">
                          <button
                            onClick={() => itemQuantityDecrease(item)}
                            className="bg-gray-300 px-2 rounded-l"
                          >
                            -
                          </button>
                          <p className="px-2 text-gray-500 flex">
                            {item?.item_quantity}
                          </p>
                          <button
                            onClick={() => itemQuantityIncrease(item)}
                            className="bg-gray-300 px-2 rounded-r"
                          >
                            +
                          </button>
                        </div>
                        <div className="min-w-[50%] flex justify-end">
                          <CurrencyFormatter
                            value={
                              item.item_price_per_unit * item.item_quantity
                            }
                          />
                        </div>
                        <div className="min-w-[20%] flex justify-end">
                          <MdDelete
                            onClick={() => handleSingleItemRemove(item)}
                            className="text-red-700 h-8 w-8 cursor-pointer mx-2"
                            title="remove"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </>
          ) : (
            <div>
              <h1 className="text-center mt-6">Empty...</h1>
            </div>
          )}
        </div>
        {tableWiseCart?.length > 0 ? (
          <div>
            <div>
              <div className="max-w-[28.5rem] ml-auto flex justify-end font-medium text-lg mt-2 mb-2">
                <span className="w-[65%] text-right">
                  Got Money from Customer ৳:
                </span>
                <span className="w-[35%] flex items-center justify-end">
                  <input
                    onChange={handleGotMoney}
                    value={gotMoney}
                    type="number"
                    className="h-[30px] w-[100px] border-2 border-red-300 rounded px-2"
                  />
                </span>
              </div>
              <div className="max-w-xs ml-auto flex items-center my-2 text-lg font-semibold text-black">
                <span className="w-[50%] text-right">Total Bill:</span>
                <span className="w-[50%] text-right">
                  <CurrencyFormatter value={totalPrice} />
                </span>
              </div>
              <div>
                {discountValue > 0 && !memberShipError ? (
                  <div className="flex justify-end space-x-4 mb-2">
                    <button>{discountValue}%</button>
                    <button
                      onClick={handleApplyDiscount}
                      className="bg-gray-200 px-2 hover:bg-gray-800 hover:text-white"
                    >
                      Apply
                    </button>
                  </div>
                ) : (
                  <div className="flex justify-end">
                    <p className="text-red-600">No Membership found</p>
                  </div>
                )}

                {discountValue > 0 && totalDiscount ? (
                  <>
                    <div className="max-w-xs ml-auto flex items-center mt-1 text-base text-purple-600">
                      <span className="w-[50%] text-right">
                        No Discount Amount:
                      </span>
                      <span className="w-[50%] text-right">
                        <CurrencyFormatter value={withoutDiscountItemsPrice} />
                      </span>
                    </div>
                    <div className="max-w-xs ml-auto flex items-center mt-1 text-base text-blue-600">
                      <span className="w-[50%] text-right">
                        Total Discount:
                      </span>
                      <span className="w-[50%] text-right">
                        <CurrencyFormatter
                          value={totalPrice - (totalPrice - totalDiscount)}
                        />
                      </span>
                    </div>
                    <div className="max-w-xs ml-auto flex items-center mt-1 text-lg font-extrabold">
                      <span className="w-[50%] text-right">
                        After Discount:
                      </span>
                      <span className="w-[50%] text-right">
                        <CurrencyFormatter value={totalPrice - totalDiscount} />
                      </span>
                    </div>
                  </>
                ) : null}
                <div
                  className={`max-w-xs ml-auto flex items-center justify-end text-lg font-bold ${
                    backMoney < 0
                      ? "text-red-600 border-t-2 border-red-600"
                      : "border-t-2 border-green-600 text-green-600"
                  } `}
                >
                  <span className="w-[50%] text-right">Customer will get:</span>
                  <span className="w-[50%] text-right">
                    <CurrencyFormatter value={backMoney} />
                  </span>
                </div>
              </div>

              <div>
                <p
                  onClick={() =>
                    setToggleMemberShipOption(!toggleMemberShipOption)
                  }
                  className="underline cursor-pointer"
                >
                  Membership offer
                </p>

                {toggleMemberShipOption ? (
                  <div className="relative">
                    <form
                      onSubmit={handleMembershipChecking}
                      className="flex mt-1"
                    >
                      <input
                        type="number"
                        value={mobileValue}
                        onChange={(e) => setMobileValue(e.target.value)}
                        className="h-[20px] w-[140px] border-2 border-gray-300"
                        placeholder="Enter mobile number"
                      />
                      <button
                        type="submit"
                        className="h-[20px] w-[100px] bg-slate-200 flex items-center justify-center"
                      >
                        Check{" "}
                        {memberLoading ? (
                          <RiLoader2Line className="h-3 w-3 animate-spin text-black " />
                        ) : null}
                      </button>
                    </form>
                    <p className="text-red-600 absolute">{memberShipError}</p>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        ) : null}

        {tableWiseCart?.length > 0 ? (
          <div className="text-center space-x-4 mt-8 mb-0">
            <button
              onClick={() => setIsKitchenModalOpen(!isKitchenModalOpen)}
              className="h-[40px] w-[130px] bg-blue-500 rounded-md text-white"
            >
              Kitchen Copy
            </button>
            <button
              onClick={() => setIsCustomerModalOpen(!isCustomerModalOpen)}
              className="h-[40px] w-[130px] bg-purple-800 rounded-md text-white"
            >
              Customer Copy
            </button>
            <button
              disabled={backMoney < 0}
              onClick={() => handleSell(tableWiseCart, table_name)}
              className={`h-[40px] w-[130px] bg-red-600 rounded-md text-white ${
                backMoney < 0 ? "cursor-not-allowed" : ""
              }`}
            >
              Payment Done
            </button>
          </div>
        ) : null}
      </div>
    </>
  );
};

export default ModalData;
