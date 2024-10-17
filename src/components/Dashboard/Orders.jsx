/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import axiosInstance from "../../axiosInstance";
import { useLoaderData, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import OrderInvoicePdf from "./OrderInvoicePdf";
import { PDFViewer } from "@react-pdf/renderer";

const OrderInvoice = ({ orderDetails }) => {
  const getFormatedDate = (dateTimeString) => {
    // Create a Date object from the string
    const date = new Date(dateTimeString);

    // Format the date using Intl.DateTimeFormat
    const options = {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    };

    const formattedDate = new Intl.DateTimeFormat("en-US", options).format(
      date
    );

    return formattedDate;
  };

  return (
    <div className="bg-white w-full">
      <h2 className="text-2xl font-bold mb-4">Order Invoice</h2>

      {/* Invoice Header */}
      <div className="mb-6">
        <p>
          <span className="font-semibold">Bill To:</span>{" "}
          {orderDetails.customerName}
        </p>
        <p>
          <span className="font-semibold">Order ID:</span>{" "}
          {orderDetails.orderId}
        </p>
        <p>
          <span className="font-semibold">Order Date:</span>{" "}
          {getFormatedDate(orderDetails.createdAt)}
        </p>
      </div>

      {/* Product List Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="w-full border-b">
              <th className="py-2 px-4 text-left font-semibold">Product</th>
              <th className="py-2 px-4 text-center font-semibold">Quantity</th>
              <th className="py-2 px-4 text-right font-semibold">Price</th>
              <th className="py-2 px-4 text-right font-semibold">Total</th>
            </tr>
          </thead>
          <tbody>
            {orderDetails.orderItems.map((product, index) => (
              <tr key={index} className="border-b">
                <td className="py-2 px-4">{product.productName}</td>
                <td className="py-2 px-4 text-center">
                  {product.orderQuantity}
                </td>
                <td className="py-2 px-4 text-right">
                  {product.productPrice.toFixed(2)}
                </td>
                <td className="py-2 px-4 text-right">
                  {product.totalPrice.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals Section */}
      <div className="mt-6 flex justify-end">
        <div className="w-1/2">
          <div className="flex justify-between py-2 border-t">
            <span className="font-semibold">Subtotal:</span>
            <span>{orderDetails.totalAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-2 border-t">
            <span className="font-semibold">Grand Total:</span>
            <span>{orderDetails.totalAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Order Status and Payment Mode */}
      <div className="mt-8 flex justify-between">
        <p>
          <span className="font-semibold">Order Status:</span>{" "}
          {orderDetails.orderStatus}
        </p>
        <p>
          <span className="font-semibold">Payment Mode:</span>{" "}
          {orderDetails.paymentMode}
        </p>
      </div>
    </div>
  );
};

const AllOrders = () => {
  const response = useLoaderData();
  const navigate = useNavigate();
  const [isLoggedIN, setIsLoggedIn] = useState(true);

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);

  const [selectedDate, setSelectedDate] = useState(getISTDate());

  const [isPrintingInvoice, setIsPrintingInvoice] = useState(false);
  const [printingPdfDetails, setPrintingPdfDetails] = useState(null);
  const pdfViewerRef = useRef();

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

  const haldleOpenViewModal = (item) => {
    setIsViewModalOpen(true);
    setOrderDetails(item);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setOrderDetails(null);
  };

  function getISTDate() {
    const date = new Date();

    // Convert to IST by adding 5 hours and 30 minutes
    const istOffset = 5.5 * 60 * 60 * 1000; // 5 hours 30 minutes in milliseconds
    const istDate = new Date(date.getTime() + istOffset);

    // Format the IST date as YYYY-MM-DD
    return istDate.toISOString().split("T")[0];
  }

  // Handle change event for the input field
  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const getOrders = async () => {
    try {
      const url = `${
        import.meta.env.VITE_BACKEND_URL
      }/dashboard/orders/date/${selectedDate}`;
      const response = await axiosInstance.get(url);
      // console.log(response);
      if (response.status === 200) {
        setData(response.data.body);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const haldlePrintInvoice = (item) => {
    setIsPrintingInvoice(true);
    setPrintingPdfDetails(item);
    if (pdfViewerRef.current) {
      window.print();
    }
  };

  const closePdfViewer = () => {
    setIsPrintingInvoice(false);
    setOrderDetails(null);
  };

  const handlePrintFromModel = () => {
    setIsPrintingInvoice(true);
    setPrintingPdfDetails(orderDetails);
    if (pdfViewerRef.current) {
      window.print();
    }
    setIsViewModalOpen(false);
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="bg-slate-200 border border-1 p-2 rounded-t-md flex justify-between">
          <h1 className="text-xl">Orders</h1>
          <div className="flex gap-3">
            <input
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              className="border border-1 p-1 rounded-md"
              placeholder="Enter quantity"
            />
            <div className="flex gap-3">
              <button
                className="bg-sky-500 px-4 py-2 rounded-md text-white font-semibold "
                onClick={getOrders}
              >
                Search
              </button>
              {/* <button className="bg-red-500 px-4 py-2 rounded-md text-white font-semibold">
                Reset
              </button> */}
            </div>
          </div>
        </div>

        <div className="border border-1 p-4 rounded-b-md flex">
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
            <div className="p-4 w-full border border-1 rounded-md flex flex-col items-center gap-2">
              <h1 className="text-xl font-semibold">Total Orders</h1>
              <h1 className="text-xl font-semibold">{data?.totalOrderCount}</h1>
            </div>
            <div className="p-4 w-full border border-1 rounded-md flex flex-col items-center gap-2">
              <h1 className="text-xl font-semibold">Total Order Amount</h1>
              <h1 className="text-xl font-semibold">
                {data?.totalOrderAmount}
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

      {data?.orderDetails.length > 0 ? (
        <div className="relative rounded-md border border-1 overflow-x-auto">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500">
            <thead className="text-lg text-gray-700 bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Order ID
                </th>
                <th scope="col" className="px-6 py-3">
                  Customer name
                </th>
                <th scope="col" className="px-6 py-3">
                  Total Amount
                </th>
                <th scope="col" className="px-6 py-3">
                  Order Status
                </th>
                <th scope="col" className="px-6 py-3">
                  Payment mode
                </th>
                <th scope="col" className="px-6 py-3">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {data?.orderDetails.map((item) => (
                <tr
                  key={item.id}
                  className="odd:bg-white even:bg-gray-50 border-b "
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap "
                  >
                    {item.orderId}
                  </th>
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap ">
                    {item.customerName}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap ">
                    {item.totalAmount}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap ">
                    {item.orderStatus}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap ">
                    {item.paymentMode}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-3">
                      <button
                        className="bg-sky-500 px-4 py-2 rounded-md text-white font-semibold "
                        onClick={() => haldleOpenViewModal(item)}
                      >
                        View
                      </button>
                      <button
                        className="bg-sky-500 px-4 py-2 rounded-md text-white font-semibold "
                        onClick={() => haldlePrintInvoice(item)}
                      >
                        Print
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center font-semibold text-xl">No orders found</div>
      )}

      {isViewModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 overflow-y-scroll overflow-x-hidden pb-4 pt-20">
          <div className="relative bg-white rounded-lg shadow-lg p-6 w-2/5">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-800"
              onClick={handleCloseViewModal}
            >
              &times;
            </button>

            <div className=" flex items-center justify-center">
              <OrderInvoice orderDetails={orderDetails} />
            </div>

            <div className="flex justify-center gap-2 mt-2">
              <button
                className="bg-sky-500 px-4 py-2 rounded-md text-white font-semibold hover:bg-sky-600 w-full"
                onClick={() => handlePrintFromModel()}
              >
                Print
              </button>
              <button
                className="px-4 py-2 text-white font-semibold bg-red-500 rounded-md hover:bg-red-600 w-full"
                onClick={handleCloseViewModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {isPrintingInvoice && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 overflow-y-scroll overflow-x-hidden p-5">
          <div className="relative bg-white p-4 rounded-lg shadow-lg w-full h-full">
            {/* max-w-3xl */}
            <button
              onClick={closePdfViewer}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-700"
            >
              X
            </button>

            <PDFViewer width="100%" height="100%" ref={pdfViewerRef}>
              <OrderInvoicePdf orderDetails={printingPdfDetails} />
            </PDFViewer>
          </div>
        </div>
      )}
    </div>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export async function loader() {
  try {
    const response = await axiosInstance.get("/dashboard/orders");
    // console.log(response);
    return response;
  } catch (err) {
    // console.log(err);
    return err.response || err;
  }
}

export default AllOrders;
