import React, { useState, useEffect } from "react";
import Instance from "../../AxiosConfig";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css"; // Import styles

function FacultyReturnInventory() {
  const location = useLocation();
  const { category, issuedItem } = location.state || {};
  const [formData, setFormData] = useState({
    category: category || "",
    itemName: issuedItem?.itemName || "",
    issuedQty:issuedItem?.issuedQty || "",
    issuedDate:issuedItem?.issuedDate || "",
    returnQty: "",
    returnDate: "",
  });

  const [returnInventory, setReturnInventory] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();





  useEffect(() => {
    const fetchReturnInventory = async () => {
      try {
        const response = await Instance.post("/add/getReturnRequestInventory");

        setReturnInventory(response.data);
      } catch (error) {
        console.error("Error fetching returning inventory:", error);
      }
    };
    fetchReturnInventory();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleReturnInventory = async (e) => {
    e.preventDefault();

    const {
      category,
      itemName,
      issuedQty,
      issuedDate,
      returnQty,
      returnDate,
    } = formData;
    if (
      !category ||
      !itemName ||
      !issuedDate||
      !returnDate ||
      Number(returnQty) <= 0 ||
      Number(issuedQty) <= 0

    ) {
      toast.error(
        "All fields are required, and quantity must be greater than zero."
      );
      return;
    }

    setLoading(true);
    try {
      const response = await Instance.post(
        "/add/faculty-return-inventory",
        formData
      );
      if (response.status === 200 || response.status === 201) {
        toast.success("Return Inventory Successfully!");
        setFormData({
          category: category,
          itemName: itemName,
          issuedQty:issuedQty,
          issuedDate:issuedDate,
          returnQty:"",
          returnDate: "",
        });
        // navigate("/faculty-view-request-table");
      }
    } catch (error) {
      console.error(
        "Return Inventory error:",
        error.response?.data || error.message
      );
      toast.error(
        error.response?.data?.message || "Error returning inventory"
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <div className="wrapper">
      <ToastContainer />
      <div className="main flex items-start justify-center">
        <div className="request_inventory rounded-2xl bg-blue-100 border-blue-950 w-5/6 m-auto my-8 px-10 py-8 shadow-[10px_10px_30px_rgba(0,0,0,0.3)]">
          <h1 className="text-blue-950 text-3xl font-bold text-center px-8 py-2">
            Return Inventory
          </h1>
          <form onSubmit={handleReturnInventory} className="text-black">
            <div className="grid grid-cols-2 gap-12 px-12 py-10">
              <div className="font-bold  text-blue-900">
                <label htmlFor="category text-blue-900">Category</label>
                <input
                  type="text"
                  name="category"
                  placeholder=""
                  className="border-2 my-2 px-5 py-2 w-full  text-gray-500 rounded-md"
                  value={formData.category}
                  onChange={handleChange}
                  disabled
                />
              </div>

              <div className="font-bold text-blue-900">
                <label htmlFor="itemName text-blue-900">Inventory Name</label>
                <input
                  type="text"
                  name="itemName"
                  placeholder=""
                  value={formData.itemName}
                  onChange={handleChange}
                  className="border-2 my-2 px-5 py-2 w-full  text-gray-500 rounded-md"
                  disabled
                />
              </div>

                <div className="font-bold text-blue-900">
                <label htmlFor="itemName text-blue-900">Issued Quantity</label>
                <input
                  type="number"
                  name="issuedQty"
                  placeholder=""
                  value={formData.issuedQty}
                  onChange={handleChange}
                  className="border-2 my-2 px-5 py-2 w-full  text-gray-500 rounded-md"
                  disabled
                />
              </div>




              <div className="font-bold text-blue-900">
                <label htmlFor="requestQty text-blue-900">
                  Return Quantity
                </label>
                <input
                  type="number"
                  name="returnQty"
                  placeholder=""
                  min="1"
                  value={formData.returnQty}
                  onChange={handleChange}
                  className="border-2 my-2 px-5 py-2 w-full text-gray-500 rounded-md"
                  required
                />
              </div>
              

   <div className="font-bold text-blue-900">
                <label htmlFor="itemName text-blue-900">Issued Date</label>
                <input
                  type="text"
                  name="issuedDate"
                  placeholder=""
                  value={formatDate(formData.issuedDate)}
                  onChange={handleChange}
                  className="border-2 my-2 px-5 py-2 w-full  text-gray-500 rounded-md"
                  disabled
                />
              </div>

              <div className="font-bold text-blue-900">
                <label htmlFor="requireDate text-blue-900">Return Date</label>
                <input
                  type="date"
                  name="returnDate"
                  placeholder=""
                  value={formData.returnDate}
                  onChange={handleChange}
                  className="border-2 my-2 px-5 py-2 w-full text-gray-500 rounded-md"
                  required
                />
              </div>

              
            </div>
            <div className="flex justify-center items-center">
              <button
                className="px-8 py-3 bg-blue-900 text-white rounded-lg mx-4"
                type="submit"
                disabled={loading}
                onClick={handleReturnInventory}
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
              <button
                className="px-8 py-3 bg-gray-900 text-white rounded-lg mx-4"
                type="reset"
                onClick={() =>
                  setFormData({
                    category:category,
                    itemName:itemName,
                    issuedQty:issuedQty,
                    issuedDate:issuedDate,
                    returnQty: "",
                    returnDate: "",
                  })
                }
              >
                Clear
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="mt-10 text-black p-10"></div>
    </div>
  );
}

export default FacultyReturnInventory;
