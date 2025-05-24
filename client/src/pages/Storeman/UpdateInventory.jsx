import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Instance from "../../AxiosConfig";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import styles

const UpdateInventory = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { category, name, qty, threshold } = location.state || {};

  const [updatedQty, setUpdatedQty] = useState("");
  const [updatedThreshold, setUpdatedThreshold] = useState("");
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (!category || !name) {
      toast.error("Invalid inventory item.");
    }
  }, [category, name, navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await Instance.put("/add/update-inventory", {
        category: category,
        itemName: name,
        qty: qty,
        threshold: threshold,
        updatedQty: updatedQty,
        updatedThreshold: updatedThreshold,
        reason: reason,
      });

      toast.success("Inventory updated successfully!");

    } catch (error) {
      console.error(
        "Update Inventory error:",
        error.response?.data || error.message
      );
      toast.error("Error Updating inventory.");
    }
  };

  return (
    <div className="wrapper">
      <ToastContainer />
      <div className="main flex items-start justify-center">
        <div className="add_inventory rounded-2xl bg-blue-100 w-4/5 m-auto my-8 px-10 py-8">
          <h1 className="text-blue-950 text-3xl font-bold text-center px-8 py-2">
            Updating Inventory
          </h1>
          <form onSubmit={handleUpdate}>
            <div className="grid grid-cols-4 gap-8 px-6 py-10">

                <div className="font-bold text-blue-900">
                <label>Category</label>
                <input
                  type="text"
                  className="border-2 my-2 px-5 py-2 w-full rounded-md text-gray-500"
                  value={category}
                  placeholder="Selected Category"
                  disabled
                />
              </div>

              <div className="font-bold text-blue-900">
                <label>Inventory Name</label>
                <input
                  className="border-2 my-2 px-5 py-2 w-full rounded-md text-gray-500 "
                  type="text"
                  placeholder="Item Name"
                  value={name}
                  disabled
                />
              </div>
            

              <div className="font-bold text-blue-900">
                <label>Quantity</label>
                <input
                  className="border-2 my-2 px-5 py-2 w-full text-gray-500"
                  type="number"
                  placeholder="Current Quantity"
                  value={qty}
                  disabled
                />
              </div>

              <div className="font-bold text-blue-900">
                <label>Update Quantity</label>
                <input
                  className="border-2 my-2 px-5 py-2 w-full text-gray-500"
                  type="number"
                  value={updatedQty}
                  onChange={(e) => setUpdatedQty(e.target.value)}
                  required
                />
              </div>

              <div className="font-bold text-blue-900">
                <label>Threshold</label>
                <input
                  className="border-2 my-2 px-5 py-2 w-full text-gray-500"
                  type="number"
                  value={threshold}
                  disabled
                />
              </div>

              <div className="font-bold text-blue-900">
                <label>Update Threshold</label>
                <input
                  className="border-2 my-2 px-5 py-2 w-full text-gray-500"
                  type="number"
                  value={updatedThreshold}
                  onChange={(e) => setUpdatedThreshold(e.target.value)}
                  required
                />
              </div>

              <div className="font-bold text-blue-900">
                <label>Update Reason</label>
                <input
                  className="border-2 my-2 px-5 py-2 w-full text-gray-500"
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex justify-center items-center">
              <button
                className="px-8 py-3 bg-blue-900 text-white rounded-2xl mx-4"
                type="submit"
              >
                Update
              </button>
              <button
                className="px-8 py-3 bg-gray-900 text-white rounded-2xl mx-4"
                type="button"
                onClick={() => handleUpdate()}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateInventory;
