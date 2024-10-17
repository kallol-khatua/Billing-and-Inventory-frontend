import { useEffect, useState } from "react";
import axiosInstance from "../../axiosInstance";
import { useLoaderData, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const CreateOrder = () => {
  const response = useLoaderData();
  const navigate = useNavigate();
  const [isLoggedIN, setIsLoggedIn] = useState(true);

  const [orderItems, setOrderItems] = useState([]);
  const [order, setorder] = useState({
    totalAmount: "",
    customerName: "",
    orderStatus: "",
    paymentMode: "",
  });
  // const [total, setTotal] = useState("");

  const [products, setProducts] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState("");
  const [quantity, setQuantity] = useState("");
  const [currItem, setCurrItem] = useState(null);

  // to send to the login page while not logged in
  useEffect(() => {
    if (!isLoggedIN) {
      navigate("/auth/login");
    }
  }, [isLoggedIN, navigate]);

  // To set product from the loader function
  useEffect(() => {
    if (response?.status) {
      if (response.status === 401 || response.status === 403) {
        toast.error("Please log in to continue.");
        setIsLoggedIn(false);
      } else if (response.status === 200) {
        // console.log(response);
        setProducts(response.data.body);
        // setFilteredData(response.data.body);
      }
    }
  }, [response]);

  // console.log(products);
  // console.log(filteredData);

  // Function to filter product according to the input
  const handleFilterChange = (e) => {
    setSearch(e.target.value);

    // Filter data based on input
    const filtered = products.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase())
    );

    setFilteredData(filtered);
  };

  const handleChooseItem = (item) => {
    setCurrItem(item);
    setSearch(item.name);
    setFilteredData([]);
  };

  const handleAddItem = () => {
    if (!currItem) {
      toast.error("Choose product");
      return;
    }
    if (quantity === "") {
      toast.error("Enter quantity");
      return;
    }
    if (quantity > currItem.quantity) {
      toast.error(`Only ${currItem.quantity} ${currItem.name} left`);
      return;
    }

    const newProductArray = products.filter((product) => {
      return product.id != currItem.id;
    });

    setProducts(newProductArray);

    setOrderItems((prev) => [
      ...prev,
      {
        productName: currItem.name,
        productPrice: currItem.price,
        orderQuantity: quantity,
        totalPrice: currItem.price * quantity,
        product: currItem,
      },
    ]);

    setSearch("");
    setCurrItem(null);
    setQuantity("");
    // setFilteredData(newProductArray);
  };

  useEffect(() => {
    let priceSum = 0;
    orderItems.forEach((item) => {
      priceSum += item.totalPrice;
    });

    setorder((prev) => ({ ...prev, totalAmount: priceSum }));
  }, [orderItems]);

  // function to fetch inventory details
  const fetchInventoryDetails = async () => {
    try {
      const url = `${
        import.meta.env.VITE_BACKEND_URL
      }/dashboard/manage-inventory`;
      const response = await axiosInstance.get(url);

      if (response.status === 200) {
        // console.log(response);
        setProducts(response.data.body);
        // setFilteredData(response.data.body);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Function to create an order
  const handleCreateOrder = async () => {
    if (order.totalAmount === 0) {
      return;
    }

    try {
      const url = `/dashboard/create-order`;
      const response = await axiosInstance.post(url, {
        orderItems,
        order,
      });
      if (response.status === 200) {
        // console.log(response);
        toast.success(response.data.message);
        setOrderItems([]);
        setorder({
          totalAmount: "",
          customerName: "",
          orderStatus: "",
          paymentMode: "",
        });
        setSearch("");
        setQuantity("");
        setCurrItem(null);
        fetchInventoryDetails();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setorder((prev) => ({ ...prev, [name]: value }));
  };

  const handleRemoveProduct = (idx) => {
    // console.log(idx);
    const amount = orderItems[idx].totalPrice;
    const removedProduct = orderItems.splice(idx, 1);

    setProducts((prev) => [...prev, removedProduct[0].product]);
    // setFilteredData((prev) => [...prev, removedProduct[0].product]);
    setOrderItems(orderItems);

    const totalAmount = order.totalAmount - amount;
    setorder((prev) => ({ ...prev, totalAmount: totalAmount }));
  };

  // console.log(orderItems)

  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="bg-slate-200 border border-1 p-2 rounded-t-md">
          <h1 className="text-xl">Create Order</h1>
        </div>
        <div className="border border-1 p-4 rounded-b-md flex gap-2">
          <div className="relative">
            <label htmlFor="products">Select product</label>
            <br />
            <input
              id="products"
              type="text"
              className="border border-1 p-1 rounded-md"
              placeholder="Enter product name here"
              value={search}
              onChange={(e) => handleFilterChange(e)}
            />
            {/* <ul>
              {filteredData.map((item) => (
                <li
                  key={item.id}
                  onClick={() => handleChooseItem(item)}
                  className="cursor-pointer"
                >
                  {item.name}
                </li>
              ))}
            </ul> */}
            {filteredData.length > 0 && (
              <div className="absolute z-10 w-full mt-2 bg-white border border-gray-300 rounded-md max-h-40 overflow-y-auto shadow-lg">
                {filteredData.map((item) => (
                  <div
                    key={item.id}
                    className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                    onClick={() => handleChooseItem(item)}
                  >
                    {item.name}
                  </div>
                ))}
              </div>
            )}
          </div>
          {currItem && (
            <div>
              <label htmlFor="quantity-in-stock">Quantity in stock</label>
              <br />
              <input
                id="quantity-in-stock"
                readOnly
                type="number"
                className="border border-1 p-1 rounded-md"
                placeholder="Quantity in stock"
                value={currItem.quantity}
              />
            </div>
          )}
          <div>
            <label htmlFor="quantity">Enter Quantity</label>
            <br />
            <input
              type="number"
              className="border border-1 p-1 rounded-md"
              placeholder="Enter quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>
          <div className="flex items-center ml-20">
            <button
              className="bg-sky-500 px-4 py-2 rounded-md text-white font-semibold "
              onClick={handleAddItem}
            >
              Add Item
            </button>
          </div>
        </div>
      </div>

      <div>
        <div className="bg-slate-200 border border-1 p-2 rounded-t-md">
          <h1 className="text-xl">Order Items</h1>
        </div>
        <div className="border border-1 p-4 rounded-b-md">
          <div className="relative rounded-md border border-1 overflow-x-auto">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500">
              <thead className="text-lg text-gray-700 bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Product name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Price
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Quantity
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Total Price
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {orderItems.map((item, idx) => (
                  <tr
                    key={idx}
                    className="odd:bg-white even:bg-gray-50 border-b "
                  >
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap "
                    >
                      {item.productName}
                    </th>
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap ">
                      {item.productPrice}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap ">
                      {item.orderQuantity}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap ">
                      {item.totalPrice}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap ">
                      {/* remove all - cancel order */}
                      {/* save to draft */}
                      <button
                        className="bg-red-600 px-4 py-2 rounded-md text-white font-semibold "
                        onClick={() => handleRemoveProduct(idx)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div>
        <div className="bg-slate-200 border border-1 p-2 rounded-t-md">
          <h1 className="text-xl">Order Summary</h1>
        </div>
        {/* {total && ( */}
        <div className="border border-1 p-4 rounded-b-md">
          <div className="flex flex-col items-end pr-20">
            <div>Subtotal : {order.totalAmount}</div>
            {/* <div>GST : {1000 * 0.18} </div>
            <div>Total : {1000 + 1000 * 0.18} </div>
            <div>Discount : {1000 * 0.05} </div>
            <div>Grand Total : {1000 + 1000 * 0.18 - 1000 * 0.05} </div> */}
          </div>

          <div className="mt-2">
            <div className="bg-white rounded-lg  w-full p-6 flex gap-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="customerName">Enter customer name</label>
                <input
                  id="customerName"
                  type="text"
                  name="customerName"
                  value={order.customerName}
                  onChange={handleEditInputChange}
                  className="border border-1 p-1 rounded-md"
                  placeholder="Enter customer name"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="orderStatus">Enter order status</label>
                <input
                  id="orderStatus"
                  type="text"
                  name="orderStatus"
                  value={order.orderStatus}
                  onChange={handleEditInputChange}
                  className="border border-1 p-1 rounded-md"
                  placeholder="Enter order status"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="paymentMode">Enter payment mode</label>
                <input
                  id="paymentMode"
                  type="text"
                  name="paymentMode"
                  value={order.paymentMode}
                  onChange={handleEditInputChange}
                  className="border border-1 p-1 rounded-md"
                  placeholder="Enter payment mode"
                />
              </div>
            </div>
            <button
              className="bg-sky-500 px-4 py-2 rounded-md text-white font-semibold relative left-10"
              onClick={handleCreateOrder}
            >
              Create order
            </button>
          </div>
        </div>
        {/* )} */}

        {/* TODO: */}
        {/* 
        customer mobile, name - auto fill mobile
        payment mode - cash, online, due
        order status - fully paid, partially paid (due option always due)
        */}
      </div>
    </div>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export async function loader() {
  try {
    const response = await axiosInstance.get("/dashboard/manage-inventory");
    // console.log(response);
    return response;
  } catch (err) {
    // console.log(err);
    return err.response || err;
  }
}

export default CreateOrder;
