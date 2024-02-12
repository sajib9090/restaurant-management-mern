/* eslint-disable react/prop-types */

import { CiCircleRemove } from "react-icons/ci";

const SelectStaff = ({
  staffs,
  selectedStaff,
  setSelectedStaff,
  isStaffSelected,
  setIsStaffSelected,
  table_name,
  staffError,
  setStaffError,
  handleStaffRemove,
}) => {
  const handleStaffSelection = () => {
    const existingData = JSON.parse(localStorage.getItem("order-log")) || [];

    const existingEntry = existingData.find(
      (entry) => entry.table_name === table_name
    );

    if (existingEntry) {
      setStaffError("Staff already selected for this table");
    } else if (!selectedStaff || !table_name) {
      setStaffError("Please select a staff");
    } else {
      setStaffError("");
      const newData = { selectedStaff, table_name, time: new Date() };
      const updatedData = [...existingData, newData];

      localStorage.setItem("order-log", JSON.stringify(updatedData));
      setSelectedStaff(newData);
      setIsStaffSelected(true);
    }
  };

  return (
    <>
      {isStaffSelected ? (
        <div className="flex items-center">
          <p className="capitalize">
            Order by:{" "}
            <span className="text-red-600 font-semibold ml-2">
              {selectedStaff.selectedStaff}
            </span>
          </p>
          <button onClick={() => handleStaffRemove({ table_name })}>
            <CiCircleRemove className="w-6 h-6 text-red-600 cursor-pointer ml-3" />
          </button>
        </div>
      ) : (
        <>
          <div className="flex items-center">
            <select
              onChange={(e) => setSelectedStaff(e.target.value)}
              value={selectedStaff}
              className="h-[40px] w-[120px] bg-gray-200 rounded text-black px-2"
            >
              <option value="" disabled selected>
                Select Staff
              </option>
              {staffs?.map((staff) => (
                <option
                  key={staff._id}
                  className="text-black font-semibold text-base capitalize cursor-pointer"
                  value={staff?.name}
                >
                  {staff?.name}
                </option>
              ))}
            </select>
            <button
              className="h-[40px] w-[70px] bg-blue-500 text-white rounded-r flex items-center justify-center cursor-pointer"
              onClick={handleStaffSelection}
            >
              Select
            </button>
          </div>
          <p className="text-red-600 text-sm">{staffError}</p>
        </>
      )}
    </>
  );
};

export default SelectStaff;
