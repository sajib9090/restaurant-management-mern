/* eslint-disable no-unused-vars */
import { useNavigate, useParams } from "react-router-dom";
import { FiLoader } from "react-icons/fi";
import { Fragment, useContext, useEffect, useRef, useState } from "react";
import { ItemsContext } from "../../GlobalContext/ItemsContext";
import SelectStaff from "../../Components/StaffSelect/SelectStaff";
import CurrencyFormatter from "../../Components/CurrencyFormatter/CurrencyFormatter";
import { CartContext, useCartContext } from "../../GlobalContext/CartContext";
import toast from "react-hot-toast";
import { MdDelete } from "react-icons/md";
import { MdCancel } from "react-icons/md";
import { Dialog, Transition } from "@headlessui/react";
import { RiLoader2Line } from "react-icons/ri";
import {
  getApiRequest,
  patchApiRequest,
  postApiRequest,
} from "../../api/apiRequest";
import DateFormatter from "../../Components/DateFormatter/DateFormatter";
import ReactToPrint from "react-to-print";
import KitchenModal from "../../Components/KitchenModal/KitchenModal";
import CustomerModal from "../../Components/CustomerModal/CustomerModal";
import ModalData from "../../Components/ModalData/ModalData";
import Swal from "sweetalert2";

const SelectOrders = () => {
  const { name: table_name } = useParams();
  let [isOpen, setIsOpen] = useState(false);
  let [isKitchenModalOpen, setIsKitchenModalOpen] = useState(false);
  let [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const { staffs, categories, menuItems } = useContext(ItemsContext);
  const {
    handleAddToBill,
    carts,
    itemQuantityDecrease,
    itemQuantityIncrease,
    itemRemove,
    handleRemoveAllSoldCart,
  } = useCartContext(CartContext);

  const navigate = useNavigate();

  // membership related state
  const [memberShipError, setMemberShipError] = useState("");
  const [toggleMemberShipOption, setToggleMemberShipOption] = useState(false);
  const [memberLoading, setMemberLoading] = useState(false);
  const [discountValue, setDiscountValue] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState(0);
  const [mobileValue, setMobileValue] = useState("");
  const [member, setMember] = useState({});

  //cart related state
  const [tableWiseCart, setTableWiseCart] = useState([]);

  // staff related states
  const [selectedStaff, setSelectedStaff] = useState("");
  const [staffError, setStaffError] = useState("");
  const [isStaffSelected, setIsStaffSelected] = useState(false);

  // menu items states
  const [menuItemsSearchValue, setMenuItemsSearchValue] = useState("");
  const [filterMenuItemError, setFilterMenuItemError] = useState("");

  // calculate total price
  const totalPrice = tableWiseCart?.reduce((sum, currentItem) => {
    const itemTotal =
      currentItem?.item_price_per_unit * currentItem?.item_quantity;
    return sum + itemTotal;
  }, 0);

  // calculate total price without discount
  const withoutDiscountItemsPrice = tableWiseCart?.reduce(
    (sum, currentItem) => {
      if (!currentItem.discount) {
        const itemTotal =
          currentItem.item_price_per_unit * currentItem.item_quantity;
        return sum + itemTotal;
      }
      return sum;
    },
    0
  );

  // membership management
  const handleMembershipChecking = (e) => {
    e.preventDefault();
    if (!mobileValue) {
      setMemberShipError("Mobile number is required");
      setTotalDiscount(0);
      setMember(null);
    }
    if (mobileValue?.length != 11) {
      setMemberShipError("Mobile number must be 11 digits");
      setTotalDiscount(0);
      setMember(null);
    } else {
      setMemberLoading(true);
      setMemberShipError("");

      getApiRequest(`/api/v2/member/${mobileValue}`)
        .then((res) => {
          setMember(res.member);
          setDiscountValue(res?.member?.discountValue);
          setTotalDiscount(0);
        })
        .catch((err) => {
          setMemberShipError(err?.response?.data?.message);
          setTotalDiscount(0);
          setMember(null);
        })
        .finally(() => {
          setMemberLoading(false);
        });
    }
  };

  const handleApplyDiscount = () => {
    if (discountValue > 0) {
      const discount =
        ((totalPrice - withoutDiscountItemsPrice) * discountValue) / 100;
      setTotalDiscount(discount);
    }
  };

  // staff selection management
  useEffect(() => {
    const existingData = JSON.parse(localStorage.getItem("order-log")) || [];
    const existingEntry = existingData.find(
      (entry) => entry.table_name === table_name
    );

    if (existingEntry) {
      setSelectedStaff(existingEntry);
      setIsStaffSelected(true);
    }
  }, [table_name]);

  const handleStaffRemove = ({ table_name }) => {
    const existingData = JSON.parse(localStorage.getItem("order-log"));

    const filteredLog = existingData.filter(
      (item) => item.table_name !== table_name
    );

    localStorage.setItem("order-log", JSON.stringify(filteredLog));
    setIsStaffSelected(false);
    setSelectedStaff("");
  };

  // filter menu item management
  const filteredMenuItems = menuItems?.filter((item) =>
    item?.item_name?.includes(menuItemsSearchValue.toLowerCase())
  );
  useEffect(() => {
    if (filteredMenuItems?.length === 0) {
      setFilterMenuItemError("Oops! No menu items found.");
    } else {
      setFilterMenuItemError("");
    }
  }, [filteredMenuItems]);

  // bill management
  const handleCart = (item, table_name, selectedStaff) => {
    if (isStaffSelected) {
      setStaffError("");
      const tableName = table_name;
      const staffName = selectedStaff?.selectedStaff;
      const orderTime = selectedStaff?.time;
      handleAddToBill(item, tableName, staffName, orderTime);
      toast.success(item.item_name + " added", {
        autoClose: 500,
      });
    } else {
      setStaffError("Please select a staff first");
    }
  };

  const handleSingleItemRemove = (item) => {
    if (carts.length === 1) {
      window.location.reload();
    }
    itemRemove(item);
  };

  // calculate total quantity
  const totalQuantity =
    tableWiseCart?.length > 0
      ? tableWiseCart.reduce(
          (total, currentItem) => total + currentItem.item_quantity,
          0
        )
      : 0;

  useEffect(() => {
    const filterTableWiseData = (table_name) => {
      if (carts?.length > 0) {
        const data = carts?.filter((item) => item?.table_name === table_name);
        setTableWiseCart(data);
      }
    };
    filterTableWiseData(table_name);
  }, [table_name, carts, handleAddToBill, itemRemove]);

  //money back ang get function and state
  const [gotMoney, setGotMoney] = useState("");
  const [backMoney, setBackMoney] = useState("");

  const handleGotMoney = (e) => {
    const value = e.target.value;
    setGotMoney(value);
    if (totalDiscount) {
      setBackMoney(parseFloat(value) - (totalPrice - totalDiscount));
    } else {
      setBackMoney(parseFloat(value) - totalPrice);
    }
  };

  // Updated handleCross function
  const handleCross = (item) => {
    const updatedTableWiseCart = tableWiseCart.map((cartItem) => {
      if (cartItem._id === item._id) {
        return { ...cartItem, showDeleteTag: !cartItem.showDeleteTag };
      }
      return cartItem;
    });

    setTableWiseCart(updatedTableWiseCart);
  };

  const handleSell = async (invoiceData, tableName) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You got payment?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#001529",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    });

    if (result.isConfirmed) {
      const data = {
        table_name: tableName,
        served_by: selectedStaff?.selectedStaff,
        member: member?.mobile,
        total_bill: totalPrice,
        total_discount: totalDiscount,
        items: invoiceData,
      };

      try {
        const res = await postApiRequest("/api/v2/sold-invoice/add", data);

        await Swal.fire({
          title: "Success!",
          html: `Items have been sold<br>ID: ${res?.data?.fr_id}`,
          icon: "success",
        });
        handleStaffRemove({ table_name });
        const memberData = {
          total_discount: parseFloat(totalDiscount),
          total_spent: parseFloat(totalPrice),
          invoices_code: res?.data?._id,
        };

        if (totalDiscount && totalPrice) {
          console.log(memberData);
          const response = await patchApiRequest(
            `/api/v2/member/edit/${member?.mobile}`,
            memberData
          );

          handleRemoveAllSoldCart(table_name);
          navigate(`${res?.data?.fr_id}`);
        } else {
          handleStaffRemove({ table_name });
          handleRemoveAllSoldCart(table_name);
          navigate(`${res?.data?.fr_id}`);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="py-2 px-2 bg-slate-400 text-lg font-semibold rounded-md flex sticky top-6 z-50"
      >
        Check Invoice{" "}
        <p className="ml-2 px-2 bg-blue-300 rounded-full">{totalQuantity}</p>
      </button>
      <h1 className="capitalize font-bold text-center text-2xl mb-4 mt-0 text-[#001529]">
        Order For {table_name}
      </h1>
      <div className="mt-0">
        <SelectStaff
          staffs={staffs}
          selectedStaff={selectedStaff}
          setSelectedStaff={setSelectedStaff}
          staffError={staffError}
          setStaffError={setStaffError}
          isStaffSelected={isStaffSelected}
          setIsStaffSelected={setIsStaffSelected}
          table_name={table_name}
          handleStaffRemove={handleStaffRemove}
        />
      </div>
      {/* menu items search */}
      <div className="max-w-md mx-auto mb-8 relative">
        <input
          value={menuItemsSearchValue}
          onChange={(e) => setMenuItemsSearchValue(e.target.value)}
          className="h-[45px] w-full border-2 border-gray-500 rounded px-2 text-xl shadow-inner"
          type="search"
          placeholder="search menu item here..."
        />
        <p className="text-base text-red-600 absolute">{filterMenuItemError}</p>
      </div>

      <div className="min-h-screen grid grid-cols-4 gap-2">
        {categories?.map((category, index) => (
          <div
            key={category?._id}
            className="min-h-screen border border-gray-200 shadow-xl rounded-md"
          >
            <div
              className={`capitalize text-center rounded-md py-2 font-bold text-xl ${
                index === 0
                  ? "bg-[#070f17] bg-opacity-75 text-white"
                  : index === 1
                  ? "bg-[#502a14] bg-opacity-75 text-white"
                  : index === 2
                  ? "bg-[#21380e] bg-opacity-75 text-white"
                  : "bg-pink-700 bg-opacity-75 text-white"
              }`}
            >
              {category.category}
            </div>
            {/* display menu items by category */}
            {filteredMenuItems
              ?.filter((item) => item?.category === category?.category)
              .map((menuItem, i) => (
                <div
                  onClick={() =>
                    handleCart(menuItem, table_name, selectedStaff)
                  }
                  key={menuItem?._id}
                  className="flex justify-between items-center py-4 shadow-md px-2 border-b border-gray-300 cursor-pointer hover:shadow-md hover:bg-gray-200 hover:text-red-700"
                >
                  <div className="flex font-bold text-black hover:text-red-700 text-base">
                    <div>
                      <p className="mr-1">{i + 1}.</p>
                    </div>
                    <div>
                      <p className="wrapped-text capitalize hover:text-red-700">
                        {menuItem?.item_name}
                      </p>
                    </div>
                  </div>
                  <div>
                    <button
                      className={`hover:bg-opacity-70 px-2 py-1 text-white rounded-md text-base ${
                        index == 0
                          ? "bg-[#001529]"
                          : index == 1
                          ? "bg-[#aa5f34]"
                          : index == 2
                          ? "bg-[#457322]"
                          : "bg-pink-700"
                      }`}
                    >
                      <CurrencyFormatter value={menuItem?.item_price} />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        ))}
      </div>
      {/* modal */}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setIsOpen(!isOpen)}
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
            <div className="fixed inset-0 bg-black/50" />
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
                <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-md bg-white text-left align-middle shadow-xl transition-all relative">
                  <div className="absolute right-0">
                    <MdCancel
                      onClick={() => setIsOpen(!isOpen)}
                      className="h-8 w-8 cursor-pointer"
                    />
                  </div>
                  {/* modal data */}
                  <ModalData
                    table_name={table_name}
                    tableWiseCart={tableWiseCart}
                    itemQuantityDecrease={itemQuantityDecrease}
                    itemQuantityIncrease={itemQuantityIncrease}
                    handleSingleItemRemove={handleSingleItemRemove}
                    handleGotMoney={handleGotMoney}
                    gotMoney={gotMoney}
                    totalPrice={totalPrice}
                    discountValue={discountValue}
                    memberShipError={memberShipError}
                    handleApplyDiscount={handleApplyDiscount}
                    totalDiscount={totalDiscount}
                    withoutDiscountItemsPrice={withoutDiscountItemsPrice}
                    backMoney={backMoney}
                    toggleMemberShipOption={toggleMemberShipOption}
                    setToggleMemberShipOption={setToggleMemberShipOption}
                    handleMembershipChecking={handleMembershipChecking}
                    mobileValue={mobileValue}
                    setMobileValue={setMobileValue}
                    memberLoading={memberLoading}
                    setIsKitchenModalOpen={setIsKitchenModalOpen}
                    isKitchenModalOpen={isKitchenModalOpen}
                    setIsCustomerModalOpen={setIsCustomerModalOpen}
                    isCustomerModalOpen={isCustomerModalOpen}
                    handleSell={handleSell}
                  />
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* kitchen modal */}
      <KitchenModal
        tableWiseCart={tableWiseCart}
        handleCross={handleCross}
        totalPrice={totalPrice}
        table_name={table_name}
        isKitchenModalOpen={isKitchenModalOpen}
        setIsKitchenModalOpen={setIsKitchenModalOpen}
      />

      {/* customer copy modal */}
      <CustomerModal
        isCustomerModalOpen={isCustomerModalOpen}
        setIsCustomerModalOpen={setIsCustomerModalOpen}
        tableWiseCart={tableWiseCart}
        totalDiscount={totalDiscount}
        totalPrice={totalPrice}
        selectedStaff={selectedStaff?.selectedStaff}
        table_name={table_name}
      />
    </div>
  );
};

export default SelectOrders;
