import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Instance from "../../AxiosConfig";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import styles

const RestockInventory = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { category, name, qty } = location.state || {};

  const [updatedPurchaseQty, setUpdatedPurchaseQty] = useState("");
  const [updatePartyName, setUpdatedPartyName] = useState("");
  const [updatedBillNo, setUpdatedBillNo] = useState("");
  const [updatedBillDate, setUpdatedBillDate] = useState("");
  const [updatedBillAmount, setUpdatedBillAmount] = useState("");
  const [updatedPricePerUnit, setUpdatedPricePerUnit] = useState("");
  const [updatedBill, setUpdatedBill] = useState(null);
  const [updatedGst, setUpdatedGst] = useState("");

    useEffect(() => {
        // Calculate bill amount whenever purchaseQty or pricePerUnit changes
        const qty = parseFloat(updatedPurchaseQty) || 0;
        const price = parseFloat(updatedPricePerUnit) || 0;
        const gstAmount = parseFloat(updatedGst) || 0;
        setUpdatedBillAmount(qty * price + (qty * price * gstAmount) / 100);
      }, [updatedPurchaseQty, updatedPricePerUnit, updatedGst]);

  useEffect(() => {
    if (!category || !name) {
      toast.error("Invalid inventory item.");
       navigate("/threshold");
    }
  }, [category, name, navigate]);

  const handleRestock = async (e) => {
    e.preventDefault();
    try {
      await Instance.put("/add/restock-inventory", {
        
        // category:category,
        category:category,
        itemName:name,
        purchaseQty: updatedPurchaseQty,
        partyName: updatePartyName,
        billNo: updatedBillNo,
        billDate: updatedBillDate,
        billAmount: updatedBillAmount,
        pricePerUnit: updatedPricePerUnit,
        qty:qty,
        bill:updatedBill,
        gst :updatedGst ,
        
      }
      
    );

      toast.success("Inventory Restocked successfully!");
    
        // window.location.reload();
        // navigate("/inventory-table");
      
    } catch (error) {
      console.error(
        "Restock Inventory error:",
        error.response?.data || error.message
      );
      toast.error("Error restocking inventory.");
    }
  };

  return (
    <div className="wrapper">
       <ToastContainer /> 
      <div className="main flex items-start justify-center">
        <div className="add_inventory rounded-2xl bg-blue-100 w-4/5 m-auto my-8 px-10 py-8">
          <h1 className="text-blue-950 text-3xl font-bold text-center px-8 py-2">
            Restocking Inventory
          </h1>
          <form onSubmit={handleRestock}>
            <div className="grid grid-cols-4 gap-8 px-6 py-10">
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
                <label>Party Name</label>
                <input
                  className="border-2 my-2 px-5 py-2 w-full text-gray-500"
                  type="text"
                  value={updatePartyName}
                  onChange={(e) => setUpdatedPartyName(e.target.value)}
                  required
                />
              </div>

              <div className="font-bold text-blue-900">
                <label>Bill No</label>
                <input
                  className="border-2 my-2 px-5 py-2 w-full text-gray-500"
                  type="number"
                  value={updatedBillNo}
                  onChange={(e) => setUpdatedBillNo(e.target.value)}
                  required
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
                <label>Purchase Quantity</label>
                <input
                  className="border-2 my-2 px-5 py-2 w-full text-gray-500"
                  type="number"
                  value={updatedPurchaseQty}
                  onChange={(e) => setUpdatedPurchaseQty(e.target.value)}
                  required
                />
              </div>

              <div className="font-bold text-blue-900">
                <label>Price Per Unit</label>
                <input
                  className="border-2 my-2 px-5 py-2 w-full text-gray-500"
                  type="number"
                  value={updatedPricePerUnit}
                  onChange={(e) => setUpdatedPricePerUnit(e.target.value)}
                  required
                />
              </div>


 <div className="font-bold text-blue-900">
                <label>GST Percentage</label>
                <input
                  className="border-2 my-2 px-5 py-2 w-full text-gray-500"
                  type="number"
                  value={updatedGst}
                  onChange={(e) => setUpdatedGst(e.target.value)}
                  required
                />
              </div>

              <div className="font-bold text-blue-900">
                <label>Bill Amount</label>
                <input
                  className="border-2 my-2 px-5 py-2 w-full text-gray-500"
                  type="number"
                  value={updatedBillAmount}
                  onChange={(e) => setUpdatedBillAmount()}
                  disabled
                />
              </div>
              <div className="font-bold text-blue-900">
                <label>Bill Date</label>
                <input
                  className="border-2 my-2 px-5 py-2 w-full text-gray-500"
                  type="date"
                  value={updatedBillDate}
                  onChange={(e) => setUpdatedBillDate(e.target.value)}
                  required
                />
              </div>

              <div className="font-bold text-blue-900">
                <label>Bill Photo</label>
                <input
                  className="border-2 my-2 px-5 py-2 w-full text-gray-500"
                  type="file"
                  //  value={updatedBill}
                  accept="image/*"
                  onChange={(e) => setUpdatedBill(e.target.files[0])}
                  
                />
              </div>
            </div>

            <div className="flex justify-center items-center">
              <button
                className="px-8 py-3 bg-blue-900 text-white rounded-2xl mx-4"
                type="submit"
              >
                Restock
              </button>
              <button
                className="px-8 py-3 bg-gray-900 text-white rounded-2xl mx-4"
                type="button"
                onClick={() => handleRestock()}
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

export default RestockInventory;
