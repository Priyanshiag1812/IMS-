import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Instance from "../AxiosConfig";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UpdateInventory = () => {
  const navigate = useNavigate();

  // const location = useLocation();
  // const { category, name, qty, threshold, status } = location.state || {};
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState("");

  const [qty, setQty] = useState("");
  const [threshold, setThreshold] = useState("");
  const [updatedQty, setUpdatedQty] = useState(qty);
  const [updatedThreshold, setUpdatedThreshold] = useState(threshold);
  const [updatedStatus, setUpdatedStatus] = useState(status);

  // useEffect(() => {
  //   if (!category || !name) {
  //     toast.error("Invalid inventory item.");
  //     // navigate("/inventory-table");
  //   }
  // }, [category, name, navigate]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await Instance.get("/add/getTable");
        if (response.data.length > 0) {
          const uniqueCategories = [
            ...new Set(response.data.map((cat) => cat.category)),
          ];
          setCategories(uniqueCategories);
          setSelectedCategory(uniqueCategories[0] || "");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);



  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await Instance.get("/add/getTable");
        if (response.data.length > 0) {
          const uniqueItems = [
            ...new Set(response.data.map((ite) => ite.item)),
          ];
          setItems(uniqueItems);
          setSelectedItem(uniqueItems[0] || "");
        }
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };
    fetchItems();
  }, []);



  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await Instance.put("/add/update-inventory", {
        category: category,
        item: item,
        qty: updatedQty,
        threshold: updatedThreshold,
        status: updatedStatus,
      });

      toast.success("Inventory updated successfully!");
      setInterval(() => {
        window.location.reload();
        navigate("/inventory-table");
      }, 8000);
    } catch (error) {
      console.error(
        "Update Inventory error:",
        error.response?.data || error.message
      );
      toast.error("Error updating inventory.");
    }
  };

  return (
    <div className="wrapper">
      <ToastContainer></ToastContainer>
      <div className="main flex items-start justify-center">
        <div className="add_inventory rounded-2xl bg-blue-100 w-4/5 m-auto my-8 px-10 py-8">
          <h1 className="text-blue-900 text-3xl font-bold text-center px-8 py-2">
            Update Inventory
          </h1>
          <form onSubmit={handleUpdate}>
            <div className="grid grid-cols-4 gap-8 px-8 py-10">
              <div className="font-bold text-blue-900">
                <label>Category</label>
                <select
                  name="category"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="border-2 my-2 px-5 py-2 w-full text-gray-500 rounded-md"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((category, index) => (
                    <option key={index} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>



<div className="font-bold text-blue-900">
                <label>Item Name</label>
                <select
                  name="item"
                  value={selectedItem}
                  onChange={(e) => setSelectedItem(e.target.value)}
                  className="border-2 my-2 px-5 py-2 w-full text-gray-500 rounded-md"
                  required
                >
                  <option value="">Select Item</option>
                  {items.map((item, index) => (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div className="font-bold text-blue-900">
                <label>Current Quantity</label>
                <input
                  className="border-2 my-2 px-5 py-2 w-full text-gray-500"
                  type="number"
                  value={qty}
                  onChange={(e) => setQty(e.target.value)}
                  required
                />
              </div>

              <div className="font-bold text-blue-900">
                <label>Quantity</label>
                <input
                  className="border-2 my-2 px-5 py-2 w-full text-gray-500"
                  type="number"
                  value={updatedQty}
                  onChange={(e) => setUpdatedQty(e.target.value)}
                  required
                />
              </div>

              <div className="font-bold text-blue-900">
                <label> Current Threshold</label>
                <input
                  className="border-2 my-2 px-5 py-2 w-full text-gray-500"
                  type="number"
                  value={threshold}
                  onChange={(e) => setThreshold(e.target.value)}
                  required
                />
              </div>

              <div className="font-bold text-blue-900">
                <label>Threshold</label>
                <input
                  className="border-2 my-2 px-5 py-2 w-full text-gray-500"
                  type="number"
                  value={updatedThreshold}
                  onChange={(e) => setUpdatedThreshold(e.target.value)}
                  required
                />
              </div>

              <div className="font-bold text-blue-900">
                <label>Status</label>
                <select
                  className="border-2 my-2 px-5 py-2 w-full text-gray-500 "
                  value={updatedStatus}
                  onChange={(e) => setUpdatedStatus(e.target.value)}
                  required
                >
                  <option value="Available">Available</option>
                  <option value="Available">Low Stock</option>
                  <option value="Out of Stock">Out of Stock</option>
                </select>
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
