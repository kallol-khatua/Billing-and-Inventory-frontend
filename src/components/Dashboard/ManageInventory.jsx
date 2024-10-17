import { useEffect, useState } from "react";
import axiosInstance from "../../axiosInstance";
import { useLoaderData, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ManageInventry = () => {
  const response = useLoaderData();

  const navigate = useNavigate();
  const [isLoggedIN, setIsLoggedIn] = useState(true);
  const [products, setProducts] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [formValues, setFormValues] = useState({
    name: "",
    quantity: "",
    price: "",
  });
  // const [error, setError] = useState({
  //   name: false,
  //   quantity: false,
  //   price: false,
  // });

  // Fetch all products
  const fetchProducts = async () => {
    try {
      const response = await axiosInstance.get("/dashboard/manage-inventory");
      if (response.status === 200) {
        // console.log(response.data.body);
        setProducts(response.data.body);
      }
    } catch (error) {
      console.error(error);
    }
  };

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
        // console.log(response);
        setProducts(response.data.body);
      }
    }
  }, [response]);
  // console.log(products);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
    // setError((prev) => ({ ...prev, [name]: false }));
  };

  const handleAddProduct = async () => {
    // console.log(formValues);
    try {
      const url = `${
        import.meta.env.VITE_BACKEND_URL
      }/dashboard/manage-inventory`;
      let response = await axiosInstance.post(url, formValues);

      if (response?.status === 201) {
        toast.success(response.data.message);
        // console.log(response);
        setFormValues({
          name: "",
          quantity: "",
          price: "",
        });
        fetchProducts();
      }
    } catch (err) {
      // TODO: error message setup
      console.error(err);
      // if (err?.response?.data?.message) {
      //   toast.error(err?.response?.data.message.replace(/"/g, ""));
      // }
      // if (err?.response) {
      //   console.log(err);
      //   toast.error(err?.response?.status);
      // }
    }
  };

  // Edit product data
  const [editProductDetails, setEditProductDetails] = useState({});

  const haldleOpenEditModal = (item) => {
    // console.log(item);
    setIsEditModalOpen(true);
    setEditProductDetails(item);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditProductDetails({});
  };

  // Edit data input handel
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditProductDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditChangeData = async () => {
    // circular loader, after updating ,  fetch all products,
    try {
      const url = `${
        import.meta.env.VITE_BACKEND_URL
      }/dashboard/manage-inventory/${editProductDetails.id}`;

      let response = await axiosInstance.put(url, editProductDetails);

      if (response?.status === 200) {
        toast.success(response.data.message);
        fetchProducts();
      }
    } catch (err) {
      // TODO: error message setup
      console.error(err);
    }
    handleCloseEditModal();
  };

  // Remove product by id
  const handleRemoveProduct = async (item) => {
    // console.log(item.id);
    try {
      const url = `${
        import.meta.env.VITE_BACKEND_URL
      }/dashboard/manage-inventory/${item.id}`;

      let response = await axiosInstance.delete(url);

      if (response?.status === 200) {
        toast.success(response.data.message);
        fetchProducts();
      }
    } catch (err) {
      // TODO: error message setup
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="bg-slate-200 border border-1 p-2 rounded-t-md">
          <h1 className="text-xl">Add new product</h1>
        </div>
        <div className="border border-1 p-4 rounded-b-md flex">
          <div className="flex flex-col gap-2">
            <label htmlFor="newProductName">Enter product name</label>
            <input
              id="newProductName"
              type="text"
              name="name"
              value={formValues.name}
              onChange={handleChange}
              className="border border-1 p-1 rounded-md"
              placeholder="Enter product name"
            />
          </div>

          <div className="flex flex-col gap-2 ml-10">
            <label htmlFor="newProductQuantity">Enter quantity</label>
            <input
              id="newProductQuantity"
              type="number"
              name="quantity"
              value={formValues.quantity}
              onChange={handleChange}
              className="border border-1 p-1 rounded-md"
              placeholder="Enter quantity"
            />
          </div>
          <div className="flex flex-col gap-2 ml-10">
            <label htmlFor="newProductPrice">Enter price</label>
            <input
              id="newProductPrice"
              type="number"
              name="price"
              value={formValues.price}
              onChange={handleChange}
              className="border border-1 p-1 rounded-md"
              placeholder="Enter price"
            />
          </div>
          <div className="flex items-center ml-10">
            <button
              className="bg-sky-500 px-4 py-2 rounded-md text-white font-semibold "
              onClick={handleAddProduct}
            >
              Add product
            </button>
          </div>
        </div>
      </div>

      {isEditModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="relative bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              onClick={handleCloseEditModal}
            >
              &times;
            </button>

            <h2 className="text-lg font-semibold">Edit product details</h2>

            <div className="flex flex-col gap-2">
              <label htmlFor="editProductName">Enter product name</label>
              <input
                id="editProductName"
                type="text"
                name="name"
                value={editProductDetails.name}
                onChange={handleEditInputChange}
                className="border border-1 p-1 rounded-md"
                placeholder="Enter product name"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="editProductQuantity">Enter quantity</label>
              <input
                id="editProductQuantity"
                type="number"
                name="quantity"
                value={editProductDetails.quantity}
                onChange={handleEditInputChange}
                className="border border-1 p-1 rounded-md"
                placeholder="Enter quantity"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="editProductPrice">Enter price</label>
              <input
                id="editProductPrice"
                type="number"
                name="price"
                value={editProductDetails.price}
                onChange={handleEditInputChange}
                className="border border-1 p-1 rounded-md"
                placeholder="Enter price"
              />
            </div>

            <div className="flex justify-center gap-2 mt-2">
              <button
                className="bg-sky-500 px-4 py-2 rounded-md text-white font-semibold hover:bg-sky-600 w-full"
                onClick={handleEditChangeData}
              >
                Save
              </button>
              <button
                className="px-4 py-2 text-white font-semibold bg-red-500 rounded-md hover:bg-red-600 w-full"
                onClick={handleCloseEditModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div>
        <div className="bg-slate-200 border border-1 p-2 rounded-t-md">
          <h1 className="text-xl">All products</h1>
        </div>
        <div className="border border-1 p-4 rounded-b-md">
          {products.length > 0 && (
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
                      Quantity left
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((item) => (
                    <tr
                      key={item.id}
                      className="odd:bg-white even:bg-gray-50 border-b "
                    >
                      <th
                        scope="row"
                        className="px-6 py-4 text-base text-gray-900 whitespace-nowrap "
                      >
                        {item.name}
                      </th>
                      <td className="px-6 py-4 text-base text-gray-900 whitespace-nowrap">
                        {item.price}
                      </td>
                      <td className="px-6 py-4 text-base text-gray-900 whitespace-nowrap">
                        {item.quantity}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-3">
                          <button
                            className="bg-sky-500 px-4 py-2 rounded-md text-white font-semibold "
                            onClick={() => haldleOpenEditModal(item)}
                          >
                            Edit
                          </button>
                          <button
                            className="bg-red-500 px-4 py-2 rounded-md text-white font-semibold"
                            onClick={() => handleRemoveProduct(item)}
                          >
                            Remove
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
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

export default ManageInventry;
