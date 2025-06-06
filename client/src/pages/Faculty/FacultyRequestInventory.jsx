import { useEffect, useState } from "react";
import Instance from "../../AxiosConfig";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FacultyRequestInventory = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [filteredItems, setFilteredItems] = useState({});
  const [allItems, setAllItems] = useState([]);
  const [fname, setFname] = useState("");
  

useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await Instance.get("/auth/checkToken", {
        withCredentials: true,
      });
      setFname(res.data.fname);
      console.log(res.data.fname);
    } catch (error) {
      console.error("Error fetching user first name:", error);
    }
  };

const getDepartmentHeading = () => {
    if (!fname) return "Faculty Request Inventory";
    return `${fname.charAt(0).toUpperCase() + fname.slice(1)} Request Inventory`;
  };


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


useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await Instance.get("/add/getTable");
        console.log("Full API Response:", res.data);
        
        if (Array.isArray(res.data) && res.data.length > 0) {
          const categories = res.data.map(categoryObj => categoryObj.category).filter(Boolean);
          console.log("Extracted Categories:", categories);
          setCategories(categories);
          
          const groupedItems = {};
          res.data.forEach(categoryObj => {
            if (categoryObj.category && categoryObj.items) {
              groupedItems[categoryObj.category] = categoryObj.items.map(item => item.name);
            }
          });
          
          console.log("Final Grouped Items:", groupedItems);
          setFilteredItems(groupedItems);
          
          const allItems = [];
          res.data.forEach(categoryObj => {
            if (categoryObj.items) {
              allItems.push(...categoryObj.items);
            }
          });
          setAllItems(allItems);
          
        } else {
          console.warn("Unexpected response format:", res.data);
          toast.warn("No data available");
        }
        
      } catch (error) {
        console.error("Failed to fetch categories and items", error);
        toast.error("Failed to load categories and items.");
      }
    };

    fetchData();
  }, []);



  //  Update form data
  const handleChange = (e, index = null) => {
    const { name, value } = e.target;
    if (index !== null) {
      const updatedItems = [...formData.requestItems];
      updatedItems[index][name] = value;

 if (name === "category") {
        updatedItems[index].itemName = "";
      }
      
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
    const { facultyName, department, event, requestReason, requestItems } =
      formData;

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
        },
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
         {getDepartmentHeading()}
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
                {/* <input
                  name="category"
                  value={requestItem.category}
                  onChange={(e) => handleChange(e, index)}
                  placeholder="Category"
                  required
                  className="border text-black border-gray-400 rounded-md px-4 py-2"
                ></input> */}




  <select
                  name="category"
                  value={requestItem.category}
                  onChange={(e) => handleChange(e, index)}
                  required
                  className="border text-black border-gray-400 rounded-md px-4 py-2"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>

                <select
                  name="itemName"
                  value={requestItem.itemName}
                  onChange={(e) => handleChange(e, index)}
                  required
                  disabled={!requestItem.category}
                  className="border text-black border-gray-400 rounded-md px-4 py-2"
                >
                  <option value="">Select Item</option>
                  {(filteredItems[requestItem.category] || []).map((itemName, itemIndex) => (
                    <option key={itemIndex} value={itemName}>
                      {itemName}
                    </option>
                  ))}
                </select>

                {/* <input
                  name="itemName"
                  value={requestItem.itemName}
                  onChange={(e) => handleChange(e, index)}
                  placeholder="Item Name"
                  required
                  className="border text-black border-gray-400 rounded-md px-4 py-2"
                > */}
                  {/* <option value="">Select Item</option>
                  {(items[item.category] || []).map((itemName) => (
                    <option key={itemName} value={itemName}>
                      {itemName}
                    </option>
                  ))} */}
                {/* </input> */}

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
