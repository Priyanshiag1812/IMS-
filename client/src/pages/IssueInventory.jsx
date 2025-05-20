import React, { useState, useEffect } from "react";
import Instance from "../AxiosConfig";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import styles
import { useLocation } from "react-router-dom";

function IssueInventory() {
  const location = useLocation();
  const {
    category,
    itemName,
    requestByDept,
    requestByFaculty,
    requestQty,
    returnStatus,
  } = location.state || {};
  // const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    category: category || "",
    itemName: itemName || "",
    issuedToDept: requestByDept || "",
    issuedToFaculty: requestByFaculty || "",
    issuedQty: requestQty || "",
    returnStatus: returnStatus || "",
  });
  const [issuedInventory, setIssuedInventory] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchIssuedInventory = async () => {
      try {
        const response = await Instance.get("/add/getViewRequestTable");
        setIssuedInventory(response.data);
      } catch (error) {
        console.error("Error fetching issued inventory:", error);
      }
      fetchIssuedInventory();
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleIssueInventory = async (e) => {
    e.preventDefault();

    const {
      category,
      itemName,
      issuedToDept,
      issuedToFaculty,
      issuedQty,
      returnStatus,
    } = formData;
    if (
      !category ||
      !itemName ||
      !issuedToDept ||
      !issuedToFaculty ||
      Number(issuedQty) <= 0
    ) {
      toast.error(
        "All fields are required, and quantity must be greater than zero."
      );

      return;
    }

    setLoading(true);
    try {
      const response = await Instance.post("/add/issue-inventory", formData);
      if (response.status === 200 || response.status === 201) {
        toast.success("Issued Inventory Successfully!");
        setFormData({
          category: category,
          itemName: itemName,
          issuedToDept: requestByDept,
          issuedToFaculty: requestByFaculty,
          issuedQty: requestQty,
          returnStatus: returnStatus,
        });
        navigate("/issue-inventory");
      }
    } catch (error) {
      console.error(
        "Issued Inventory error:",
        error.response?.data || error.message
      );
      toast.error(error.response?.data?.message || "Error issuing inventory");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="wrapper">
      <ToastContainer />
      <div className="main flex items-start justify-center">
        <div className="add_inventory rounded-2xl bg-blue-100 border-blue-950 w-5/6 m-auto my-8 px-10 py-8 shadow-[10px_10px_30px_rgba(0,0,0,0.3)]">
          <h1 className="text-blue-950 text-3xl font-bold text-center px-8 py-2">
            Issue Inventory
          </h1>
          <form onSubmit={handleIssueInventory} className="text-black">
            <div className="grid grid-cols-3 gap-12 px-12 py-10">
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
                <label htmlFor="issuedQty text-blue-900">Quantity</label>
                <input
                  type="number"
                  name="issuedQty"
                  placeholder=""
                  min="1"
                  value={formData.issuedQty}
                  onChange={handleChange}
                  className="border-2 my-2 px-5 py-2 w-full text-gray-500 rounded-md"
                  disabled
                />
              </div>
              <div className="font-bold text-blue-900">
                <label htmlFor="issuedToDept text-blue-900">
                  Department Name
                </label>

                <input
                  type="text"
                  name="issuedToDept"
                  placeholder=""
                  min="1"
                  value={formData.issuedToDept}
                  onChange={handleChange}
                  className="border-2 my-2 px-5 py-2 w-full text-gray-500 rounded-md"
                  disabled
                />
              </div>

              <div className="font-bold text-blue-900">
                <label htmlFor="issuedToFaculty text-blue-900">
                  Faculty Name
                </label>
                <input
                  type="text"
                  name="issuedToFaculty"
                  placeholder=""
                  value={formData.issuedToFaculty}
                  onChange={handleChange}
                  className="border-2 my-2 px-5 py-2 w-full text-gray-500 rounded-md"
                  disabled
                />
              </div>

              <div className="font-bold text-blue-900">
                <label htmlFor="returnStatus text-blue-900">
                  Return Status
                </label>
                <select
                  name="returnStatus"
                  value={formData.returnStatus}
                  onChange={handleChange}
                  className="border-2 my-2 px-5 py-2 w-full text-gray-500 rounded-md"
                  disabled
                >
                  <option value="Select Status">Select Status</option>
                  <option value="Returnable">Returnable</option>
                  <option value="Non Returnable">Non-Returnable</option>
                </select>
              </div>
            </div>
            <div className="flex justify-center items-center">
              <button
                className="px-8 py-3 bg-blue-900 text-white rounded-lg mx-4"
                type="submit"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
              <button
                className="px-8 py-3 bg-gray-900 text-white rounded-lg mx-4"
                type="reset"
                onClick={() =>
                  setFormData({
                    category: category,
                    itemName: itemName,
                    issuedToDept: "",
                    issuedToFaculty: "",
                    issuedQty: "",
                    returnStatus: "",
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

export default IssueInventory;
