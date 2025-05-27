import { useEffect, useState } from "react";
import Instance from "../../AxiosConfig";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FacultyRequestInventory = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    facultyName: "",
    department: "",
    event: "",
    requestReason: "",
    requestItems: [
      {
        category: "",
        itemName: "",
        requestQty: "",
        returnStatus: "",
        requireDate: "",
      },
    ],
  });

  

  //  Update form data
  const handleChange = (e, index = null) => {
    const { name, value } = e.target;
    if (index !== null) {
      const updatedItems = [...formData.requestItems];
      updatedItems[index][name] = value;
      setFormData((prev) => ({ ...prev, requestItems: updatedItems }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  //  Add item row
  const handleAddItem = () => {
  setFormData((prev) => ({
    ...prev,
    requestItems: [
      ...prev.requestItems, 
      {
        category: "",
        itemName: "",
        requestQty: "",
        returnStatus: "",
        requireDate: "",
      },
    ],
  }));
};
  //  Remove item row
  const handleRemoveItem = (index) => {
    const updatedItems = formData.requestItems.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, requestItems: updatedItems }));
  };

  //  Submit request
  const handleRequestInventory = async (e) => {
    e.preventDefault();
    const { facultyName, department, event, requestReason, requestItems } = formData;

    // Validate main form
    if (!facultyName || !department || !event || !requestReason) {
      toast.error("Please fill in all required fields upper section.");
      return;
    }

    // Validate each item
    for (const item of requestItems) {
      // Check if all fields are filled

      if (
        !item.category ||
        !item.itemName ||
        !item.requestQty ||
        !item.returnStatus ||
        !item.requireDate 
      ) {
        toast.error("Please complete all item fields .");
        return;
      }

      if (item.requestQty <= 0) {
        toast.error("Quantity must be greater than zero.");
        return;
      }

      if (new Date(item.requireDate) < new Date()) {
        toast.error("Required date cannot be in the past.");
        return;
      }
    }

    try {
      await Instance.post("/add/faculty-request-inventory", {

        formData: {
          facultyName,
          department,
          event,
          requestReason,
          requestItems: requestItems.map((item) => ({
          category: item.category,
          itemName: item.itemName,
          requestQty: item.requestQty,
          returnStatus: item.returnStatus,
          requireDate: item.requireDate,
        })),
        }
        

      });

      toast.success("Request submitted successfully!");
      navigate("/faculty-view-request-table");
    } catch (error) {
      console.error("Error submitting request:", error);
      toast.error("Failed to submit request.");
    }
  };

  return (
    <div className="wrapper">
      <div className="pb-2 px-4 max-w-5xl mx-auto my-7 bg-white relative shadow-md rounded-xl">
        <ToastContainer />
        <h2 className="text-2xl font-bold mb-4 text-center text-blue-800">
          Faculty Inventory Request
        </h2>

        <form onSubmit={handleRequestInventory} className="space-y-1 pt-6">
          <div className="flex gap-4 flex-wrap">
            <label className="text-black">Faculty Name</label>
            <input
              type="text"
              name="facultyName"
              placeholder="Faculty Name"
              value={formData.facultyName}
              onChange={handleChange}
              required
              className="border text-black border-gray-400 rounded-md px-4 py-2 w-full md:w-[32%]"
            />

            <label className="text-black">Department Name</label>
            <input
              type="text"
              name="department"
              placeholder="Department"
              value={formData.department}
              onChange={handleChange}
              required
              className="border text-black border-gray-400 rounded-md px-4 py-2 w-full md:w-[32%]"
            />

            <label className="text-black">Event Name</label>

            <input
              type="text"
              name="event"
              placeholder="Event Name"
              value={formData.event}
              onChange={handleChange}
              required
              className="border text-black border-gray-400 rounded-md px-4 py-2 w-full md:w-[32%]"
            />

            <label className="text-black">Reason for Request</label>

            <input
              type="text"
              name="requestReason"
              placeholder="Reason for Request"
              value={formData.requestReason}
              onChange={handleChange}
              required
              className="border text-black border-gray-400 rounded-md px-4 py-2 w-full md:w-[32%]"
            />
          </div>

          <h3 className="text-lg text-black font-semibold mt-4">Items:</h3>

          {formData.requestItems.map((requestItem, index) => (
            <div
              key={index}
              className="border p-4 rounded-md bg-blue-100 text-black space-y-3 relative"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-1">
                 <input
                  name="category"
                  value={requestItem.category}
                  onChange={(e) => handleChange(e, index)}
                  placeholder="Category"
                  required
                  className="border text-black border-gray-400 rounded-md px-4 py-2"
                ></input>
               

                <input
                  name="itemName"
                  value={requestItem.itemName}
                  onChange={(e) => handleChange(e, index)}
                  placeholder="Item Name"
                  required
                  className="border text-black border-gray-400 rounded-md px-4 py-2"
                >
                  {/* <option value="">Select Item</option>
                  {(items[item.category] || []).map((itemName) => (
                    <option key={itemName} value={itemName}>
                      {itemName}
                    </option>
                  ))} */}
                </input>

                <input
                  type="number"
                  name="requestQty"
                  placeholder="Quantity"
                  min={1}
                  value={requestItem.requestQty}
                  onChange={(e) => handleChange(e, index)}
                  required
                  className="border text-black border-gray-400 rounded-md px-4 py-2"
                />

                <select
                  name="returnStatus"
                  value={requestItem.returnStatus}
                  onChange={(e) => handleChange(e, index)}
                  required
                  className="border text-black border-gray-400 rounded-md px-4 py-2"
                >
                  <option value="">Return Status</option>
                  <option value="Returnable">Returnable</option>
                  <option value="Non Returnable">Non Returnable</option>
                </select>

                <input
                  type="date"
                  name="requireDate"
                  value={requestItem.requireDate}
                  onChange={(e) => handleChange(e, index)}
                  required
                  className="border text-black border-gray-400 rounded-md px-4 py-2"
                />

               
              </div>

              {formData.requestItems.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveItem(index)}
                  className="absolute text-black top-2 right-4 hover:text-red-600"
                >
                  ✖
                </button>
              )}
            </div>
          ))}

          <div className="flex justify-end mt-4">
            <button
              type="button"
              onClick={handleAddItem}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
            >
              Add Another Item
            </button>
          </div>

          <div className="text-center mt-8">
            <button
              type="submit"
              className="bg-blue-700 text-white px-8 py-2 rounded-md hover:bg-blue-800"
            >
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FacultyRequestInventory;



