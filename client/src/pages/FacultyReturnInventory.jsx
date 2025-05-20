import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Instance from "../AxiosConfig";

const FacultyReturnInventory = () => {
  const navigate = useNavigate();
  // const [category, setCategory] = useState("");
  const [returnQty, setReturnQty] = useState("");
  // const [itemName, setItemName] = useState("");
  const [returnDate, setRequiredDate] = useState("");

   const { category,itemName } = location.state || {};

  // useEffect(() => {
  //   if (!category || !itemName) {
  //     alert("Invalid inventory item.");
  //     navigate("/request-inventory-table");
  //    }
  // }, [category, itemName, navigate]);

  const handleRequest = async (e) => {
    e.preventDefault();
    try {
      await Instance.put("/add/faculty-request-inventory", {
        category:category,
        returnQty,
        itemName:itemName,
        returnDate,
      });

      alert("Inventory Request send successfully!");
      navigate("/faculty-request-inventory-table");
    } catch (error) {
      console.error(
        "Request Inventory error:",
        error.response?.data || error.message
      );
      alert("Error requesting inventory.");
    }
  };

  return (
    <div className="wrapper">
      <div className="main flex items-start justify-center">
        <div className="add_inventory rounded-2xl bg-blue-100 w-4/5 m-auto my-8 px-10 py-8">
          <h1 className="text-blue-900 text-3xl font-bold text-center px-8 py-2">
            Return Inventory
          </h1>
          <form onSubmit={handleRequest}>
            <div className="grid grid-cols-2 gap-8 px-8 py-10">
              <div className="font-bold text-blue-900">
                <label>Item Name</label>
                <input
                  className="border-2 my-2 px-5 py-2 w-full"
                  type="text"
                  value={itemName}
                  disabled
                />
              </div>
              <div className="font-bold text-blue-900">
                <label>Category</label>
                <input
                  className="border-2 my-2 px-5 py-2 w-full"
                  type="text"
                  value={category}
                  disabled
                />
              </div>

              <div className="font-bold text-blue-900">
                <label>Return Quantity</label>
                <input
                  className="border-2 my-2 px-5 py-2 w-full"
                  type="number"
                  value={returnQty}
                  onChange={(e) => setReturnQty(e.target.value)}
                  required
                />
              </div>

              <div className="font-bold text-blue-900">
                <label>Return Date</label>
                <input
                  className="border-2 my-2 px-5 py-2 w-full"
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex justify-center items-center">
              <button
                className="px-8 py-3 bg-blue-900 text-white rounded-2xl mx-4"
                type="submit"
              >
                Return
              </button>
              <button
                className="px-8 py-3 bg-gray-900 text-white rounded-2xl mx-4"
                type="button"
                onClick={() => navigate("/")}
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

export default FacultyReturnInventory;
