import { useEffect, useState } from "react";
import axiosInstance from "../../axiosInstance";
import { useLoaderData, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Main() {
  const response = useLoaderData();
  const navigate = useNavigate();
  const [isLoggedIN, setIsLoggedIn] = useState(true);

  const [data, setData] = useState(null);

  useEffect(() => {
    if (!isLoggedIN) {
      navigate("/auth/login");
    }
  }, [isLoggedIN, navigate]);

  useEffect(() => {
    if (response?.status) {
      if (response.status === 401 || response.status === 403) {
        toast.error("Please log in to continue.");
        setIsLoggedIn(false);
      } else if (response.status === 200) {
        setData(response.data.body);
        setTimeout(() => {}, [1500]);
      }
    }
  }, [response]);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="bg-slate-200 border border-1 p-2 rounded-t-md flex justify-between">
          <h1 className="text-xl">Orders - Today</h1>
        </div>
        <div className="border border-1 p-4 rounded-b-md flex">
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
            <div className="p-4 w-full border border-1 rounded-md flex flex-col items-center gap-2">
              <h1 className="text-xl font-semibold">Total Orders</h1>
              <h1 className="text-xl font-semibold">
                {data?.orderDetailsForToday.totalOrderCount}
              </h1>
            </div>
            <div className="p-4 w-full border border-1 rounded-md flex flex-col items-center gap-2">
              <h1 className="text-xl font-semibold">Total Order Amount</h1>
              <h1 className="text-xl font-semibold">
                {data?.orderDetailsForToday.totalOrderAmount}
              </h1>
            </div>
            {/* <div className="p-4 w-full border border-1 rounded-md flex flex-col items-center gap-2">
              <h1 className="text-xl font-semibold">Total Amount Recived</h1>
              <h1 className="text-xl font-semibold">1246</h1>
            </div>
            <div className="p-4 w-full border border-1 rounded-md flex flex-col items-center gap-2">
              <h1 className="text-xl font-semibold">Total Amount Due</h1>
              <h1 className="text-xl font-semibold">{1545 - 1246}</h1>
            </div> */}
          </div>
        </div>
      </div>
      <div>
        <div className="bg-slate-200 border border-1 p-2 rounded-t-md flex justify-between">
          <h1 className="text-xl">Orders - This month</h1>
        </div>
        <div className="border border-1 p-4 rounded-b-md flex">
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
            <div className="p-4 w-full border border-1 rounded-md flex flex-col items-center gap-2">
              <h1 className="text-xl font-semibold">Total Orders</h1>
              <h1 className="text-xl font-semibold">
                {data?.orderDetailsForThisMonth.totalOrderCount}
              </h1>
            </div>
            <div className="p-4 w-full border border-1 rounded-md flex flex-col items-center gap-2">
              <h1 className="text-xl font-semibold">Total Order Amount</h1>
              <h1 className="text-xl font-semibold">
                {data?.orderDetailsForThisMonth.totalOrderAmount}
              </h1>
            </div>
            {/* <div className="p-4 w-full border border-1 rounded-md flex flex-col items-center gap-2">
              <h1 className="text-xl font-semibold">Total Amount Recived</h1>
              <h1 className="text-xl font-semibold">22530</h1>
            </div>
            <div className="p-4 w-full border border-1 rounded-md flex flex-col items-center gap-2">
              <h1 className="text-xl font-semibold">Total Amount Due</h1>
              <h1 className="text-xl font-semibold">{24156 - 22530}</h1>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export async function loader() {
  try {
    const response = await axiosInstance.get("/dashboard/home");
    // console.log(response);
    return response;
  } catch (err) {
    // console.log(err);
    return err.response || err;
  }
}

export default Main;
