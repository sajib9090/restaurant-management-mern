import { NavLink, Outlet } from "react-router-dom";
import { IoPersonAddSharp } from "react-icons/io5";
import { MdEmergencyRecording } from "react-icons/md";

const StaffRecord = () => {
  const menu = [
    {
      id: 0,
      title: "Add Staff",
      link: "add-staff",
      icon: <IoPersonAddSharp className="w-5 h-5" />,
    },
    {
      id: 2,
      title: "Staff Sell Record",
      link: "staff-sell-record",
      icon: <MdEmergencyRecording className="w-6 h-6" />,
    },
  ];

  return (
    <div>
      <div className="min-h-[50px] w-full flex flex-wrap gap-2 items-center justify-center border-b border-blue-200 py-2">
        {menu.map((item) => (
          <NavLink
            to={item.link}
            key={item.id}
            title={item.title}
            className={({ isActive }) =>
              isActive
                ? "bg-blue-600 border border-blue-600 px-2 rounded-md text-white text-base flex items-center"
                : "bg-white border border-blue-600 px-2 rounded-md text-blue-600 text-base hover:bg-blue-600 hover:text-white transition-all duration-500 flex items-center"
            }
          >
            <div className="mr-1">{item.icon}</div>
            <div>{item.title}</div>
          </NavLink>
        ))}
      </div>
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default StaffRecord;
