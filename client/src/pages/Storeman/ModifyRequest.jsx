import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Instance from "../../AxiosConfig";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import styles

const ModifyRequest = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { category, itemName, requestQty  } = location.state || {};

  const [modifyQty, setModifyQty] = useState("");
  const [modifyReason, setModifyReason] = useState("");
 
  useEffect(() => {
    if (!category || !itemName) {
      toast.error("Invalid inventory item.");
      //  navigate("/request-inventory-table");
    }
  }, [category, itemName, navigate]);

  const handleModifyRequest = async (e) => {
    e.preventDefault();
    try {
      await Instance.post("/add/modify-request", {
        category:category,
        itemName:itemName,
        requestQty:requestQty,
        modifyQty:modifyQty,
        modifyReason:modifyReason
      }
      
    );

      toast.success("Inventory Modify successfully!");
    
        // window.location.reload();
        // navigate("/inventory-table");
      
    } catch (error) {
      console.error(
        "Modify Inventory error:",
        error.response?.data || error.message
      );
      toast.error("Error modifying  request inventory.");
    }
  };

  return (
    <div className="wrapper">
       <ToastContainer /> 
      <div className="main flex items-start justify-center">
        <div className="modifyrequest rounded-2xl bg-blue-100 w-4/5 m-auto my-8 px-10 py-8">
          <h1 className="text-blue-950 text-3xl font-bold text-center px-8 py-2">
            Modifying Request Inventory
          </h1>
          <form onSubmit={handleModifyRequest}>
            <div className="grid grid-cols-3 gap-8 px-6 py-10">
              <div className="font-bold text-blue-900">
                <label>Inventory Name</label>
                <input
                  className="border-2 my-2 px-5 py-2 w-full rounded-md text-gray-500 "
                  type="text"
                  placeholder="Item Name"
                  value={itemName}
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
                <label>Request Quantity</label>
                <input
                  className="border-2 my-2 px-5 py-2 w-full text-gray-500"
                  type="number"
                  placeholder="Request Quantity"
                  value={requestQty}
                  disabled
                />
              </div>

              <div className="font-bold text-blue-900">
                <label>Modify Qty</label>
                <input
                  className="border-2 my-2 px-5 py-2 w-full text-gray-500"
                  type="text"
                  value={modifyQty}
                  onChange={(e) => setModifyQty(e.target.value)}
                  required
                />
              </div>

               <div className="font-bold text-blue-900">
                <label>Modify Reason</label>
                <input
                  className="border-2 my-2 px-5 py-2 w-full text-gray-500"
                  type="text"
                  value={modifyReason}
                  onChange={(e) => setModifyReason(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex justify-center items-center">
              <button
                className="px-8 py-3 bg-blue-900 text-white rounded-2xl mx-4"
                type="submit"
              >
                Modify
              </button>
              <button
                className="px-8 py-3 bg-gray-900 text-white rounded-2xl mx-4"
                type="button"
                onClick={() => handleModifyRequest()}
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

export default ModifyRequest;
