import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Instance from "../AxiosConfig";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AddNewInventory() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [itemName, setItemName] = useState("");
  const [qty, setQty] = useState("0");
  const [purchaseQty, setPurchaseQty] = useState("");
  const [pricePerUnit, setPricePerUnit] = useState("");
  const [partyName, setPartyName] = useState("");
  const [billNo, setBillNo] = useState("");
  const [billDate, setBillDate] = useState("");
  const [billAmount, setBillAmount] = useState("");
  const [gst , setGst] = useState("");
  const [threshold, setThreshold] = useState("");
  const [bill, setBill] = useState(""); // file object

  const navigate = useNavigate();

  useEffect(() => {
    // Calculate bill amount whenever purchaseQty or pricePerUnit changes
    const qty = parseFloat(purchaseQty) || 0;
    const price = parseFloat(pricePerUnit) || 0;
    const gstAmount = parseFloat(gst) || 0;
    setBillAmount(qty * price + (qty * price * gstAmount) / 100);
  }, [purchaseQty, pricePerUnit,gst]);

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

  const handleAddInventory = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("category", selectedCategory);
      formData.append("itemName", itemName);
      formData.append("threshold", parseInt(threshold, 10));
      formData.append("partyName", partyName);
      formData.append("billNo", billNo);
      formData.append("billDate", billDate);
      formData.append("pricePerUnit", parseInt(pricePerUnit, 10));
      formData.append("gst", parseInt(gst, 10));
      formData.append("billAmount", parseInt(billAmount, 10));
      formData.append("purchaseQty", parseInt(purchaseQty, 10));
      formData.append("qty", parseInt(qty, 10));
      formData.append("bill", bill); // file

      const response = await Instance.post("/add/purchase", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200 || response.status === 201) {
        toast.success("Inventory added successfully!");
      }
    } catch (error) {
      console.error(
        "Add Inventory error:",
        error.response?.data || error.message
      );
      toast.error("Error adding inventory");
    }
  };

  return (
    <div className="wrapper">
      <ToastContainer />
      <div className="main flex items-start justify-center">
        <div className="add_inventory rounded-2xl bg-blue-100 border-blue-950 w-5/6 m-auto my-8 px-10 py-8 shadow-[10px_10px_30px_rgba(0,0,0,0.3)]">
          <h1 className="text-blue-950 text-3xl font-bold text-center px-8 py-2">
            Add New Item to Inventory
          </h1>
          <form onSubmit={handleAddInventory}>
            <div className="grid grid-cols-4 gap-8 px-8 py-10">
              <div className="font-bold text-blue-900">
                <label>Inventory Name</label>
                <input
                  className="border-2 my-2 px-5 py-2 w-full rounded-md text-gray-500"
                  type="text"
                  placeholder="Item Name"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  required
                />
              </div>

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
                <label>Party Name</label>
                <input
                  className="border-2 my-2 text-gray-500 px-5 py-2 rounded-md w-full"
                  type="text"
                  value={partyName}
                  onChange={(e) => setPartyName(e.target.value)}
                  required
                />
              </div>

              <div className="font-bold text-blue-900">
                <label>Bill No.</label>
                <input
                  className="border-2 my-2 text-gray-500 px-5 py-2 rounded-md w-full"
                  type="text"
                  value={billNo}
                  onChange={(e) => setBillNo(e.target.value)}
                  required
                />
              </div>

              <div className="font-bold text-blue-900">
                <label>Quantity</label>
                <input
                  className="border-2 text-gray-500 my-2 px-5 py-2 rounded-md w-full"
                  type="number"
                  value={qty}
                  onChange={(e) => setQty(e.target.value)}
                  disabled
                />
              </div>

              <div className="font-bold text-blue-900">
                <label>Purchase Quantity</label>
                <input
                  className="border-2 text-gray-500 my-2 px-5 py-2 rounded-md w-full"
                  type="number"
                  value={purchaseQty}
                  onChange={(e) => setPurchaseQty(e.target.value)}
                  required
                />
              </div>

              <div className="font-bold text-blue-900">
                <label>Price Per Unit</label>
                <input
                  className="border-2 text-gray-500 my-2 px-5 py-2 rounded-md w-full"
                  type="number"
                      value={pricePerUnit}
                   onChange={(e) => setPricePerUnit(e.target.value)}
                   required
                  ></input>

              </div>


              <div className="font-bold text-blue-900">
                <label>GST Percentage </label>
                <input
                  className="border-2 text-gray-500 my-2 px-5 py-2 rounded-md w-full"
                  type="number"
                      value={gst}
                   onChange={(e) => setGst(e.target.value)}
                  ></input>

              </div>


              <div className="font-bold text-blue-900">
                <label>Bill Amount</label>
                <input
                  className="border-2 my-2 text-gray-500 px-5 py-2 rounded-md w-full"
                  type="number"
                  value={billAmount}
                  onChange={(e) => setBillAmount()}
                  disabled
                />
              </div>

              <div className="font-bold text-blue-900">
                <label>Threshold</label>
                <input
                  className="border-2 my-2 text-gray-500 px-5 py-2 rounded-md w-full"
                  type="number"
                  value={threshold}
                  onChange={(e) => setThreshold(e.target.value)}
                  required
                />
              </div>

              <div className="font-bold text-blue-900">
                <label>Bill Date</label>
                <input
                  className="border-2 my-2 text-gray-500 px-5 py-2 rounded-md w-full"
                  type="date"
                  value={billDate}
                  onChange={(e) => setBillDate(e.target.value)}
                  required
                />
              </div>

              <div className="font-bold text-blue-900">
                <label>Bill Photo</label>
                <input
                  className="border-2 my-2 text-gray-500 px-5 py-2 rounded-md w-full"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setBill(e.target.files[0])}
                />
              </div>
            </div>

            <div className="flex justify-center text-blue-900 items-center">
              <button
                className="px-8 py-3 bg-blue-900 text-white rounded-lg mx-8"
                type="submit"
              >
                Submit
              </button>
              <button
                className="px-8 py-3 bg-gray-900 text-white rounded-lg mx-8"
                type="reset"
                onClick={() => {
                  setItemName("");
                  setQty("");
                  setThreshold("");
                  setSelectedCategory(categories[0] || "");
                  setPartyName("");
                  setBillNo("");
                  setBillDate("");
                  setBillAmount("");
                  setPricePerUnit("");
                  setPurchaseQty("");
                  setBill(null);
                }}
              >
                Clear
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddNewInventory;
