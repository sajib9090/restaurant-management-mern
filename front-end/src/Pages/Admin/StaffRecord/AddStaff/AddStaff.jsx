import { RiLoader2Line } from "react-icons/ri";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import DateFormatter from "../../../../Components/DateFormatter/DateFormatter";
import {
  deleteApiRequest,
  getApiRequest,
  postApiRequest,
} from "../../../../api/apiRequest";

const AddStaff = () => {
  const [loading, setLoading] = useState(false);
  const [allStaff, setAllStaff] = useState([]);

  const fetchAllStaff = () => {
    getApiRequest(`/api/v2/staffs`)
      .then((res) => {
        setAllStaff(res?.data);
      })
      .catch((err) => {
        if (err) {
          toast.error("Can't fetch staff");
        }
      });
  };

  const handleSubmit = (e) => {
    setLoading(true);
    e.preventDefault();
    const staffName = e.target.staffName.value;

    const data = {
      name: staffName.toLowerCase(),
    };

    postApiRequest(`/api/v2/staff/add-staff`, data)
      .then((res) => {
        if (res) {
          toast.success("Staff Added Successfully");
          // Refetch data after successful post
          fetchAllStaff();
        }
      })
      .catch((err) => {
        if (err?.response?.data?.message) {
          toast.error(err?.response?.data?.message);
        } else {
          toast.error("Something went wrong!");
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleDelete = (id) => {
    deleteApiRequest(`/api/v2/staff/delete/${id}`)
      .then((res) => {
        if (res) {
          fetchAllStaff();
        }
      })
      .catch((err) => {
        if (err) {
          toast.error("Something went wrong");
        }
      });
  };

  useEffect(() => {
    fetchAllStaff();
  }, []);
  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="max-w-xs mx-auto bg-gray-100 p-4 space-y-2"
      >
        <div>
          <label>Write Name*</label>
          <input
            type="text"
            name="staffName"
            required
            placeholder="Enter full name...."
            className="h-[40px] w-full border-2 border-blue-600 rounded px-2"
          />
        </div>
        <div>
          <button
            type="submit"
            className="h-[40px] w-full bg-blue-600 rounded text-white flex justify-center items-center"
          >
            Submit{" "}
            {loading ? (
              <RiLoader2Line className="h-5 w-5 animate-spin text-white" />
            ) : null}
          </button>
        </div>
      </form>
      <div className="max-w-md mx-auto mt-6">
        {allStaff?.map((item, index) => (
          <div
            key={item?._id}
            className="min-h-[40px] w-full border-b border-gray-300 flex items-center justify-between"
          >
            <div>
              <p>
                {index + 1}. <span className="capitalize">{item?.name}</span>
              </p>
            </div>
            <div className="flex items-center space-x-6">
              <div>
                <DateFormatter dateString={item?.createdAt} />
              </div>
              <div>
                <MdDelete
                  onClick={() => handleDelete(item?._id)}
                  title="Remove"
                  className="h-6 w-6 text-red-600 cursor-pointer"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddStaff;
