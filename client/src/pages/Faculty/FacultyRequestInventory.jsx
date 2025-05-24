import React, { useState, useEffect } from "react";
import Instance from "../../AxiosConfig";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css"; // Import styles

function facultyRequestInventory() {
  const location = useLocation();
  const { category, name } = location.state || {};
  const [formData, setFormData] = useState({
    category: category || "",
    itemName: name || "",
    requestByDept: "",
    requestQty: "",
    returnStatus: "",
    requestByFaculty: "",
    requireDate: "",
    requestReason: "",
    event:"",
  });
  const [requestInventory, setRequestInventory] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequestInventory = async () => {
      try {
        const response = await Instance.post("/add/getViewRequestInventory");

        setRequestInventory(response.data);
      } catch (error) {
        console.error("Error fetching requesting inventory:", error);
      }
    };
    fetchRequestInventory();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleRequestInventory = async (e) => {
    e.preventDefault();

    const {
      category,
      itemName,
      requestByDept,
      requestQty,
      returnStatus,
      requestByFaculty,
      requireDate,
      requestReason,
      event,
    } = formData;
    if (
      !category ||
      !itemName ||
      !requestByDept ||
      !requestByFaculty ||
      !requestReason ||
      !requireDate ||
      !returnStatus ||
      !event ||
      Number(requestQty) <= 0
    ) {
      toast.error(
        "All fields are required, and quantity must be greater than zero."
      );
      return;
    }

    setLoading(true);
    try {
      const response = await Instance.post(
        "/add/faculty-request-inventory",
        formData
      );
      if (response.status === 200 || response.status === 201) {
        toast.success("Request Inventory Successfully!");
        setFormData({
          category: category,
          itemName: itemName,
          requestByDept: "",
          requestQty: "",
          returnStatus: "",
          requestByFaculty: "",
          requireDate: "",
          requestReason: "",
          event:"",
        });
        navigate("/faculty-view-request-table");
      }
    } catch (error) {
      console.error(
        "Request Inventory error:",
        error.response?.data || error.message
      );
      toast.error(
        error.response?.data?.message || "Error requesting inventory"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="wrapper">
      <ToastContainer />
      <div className="main flex items-start justify-center">
        <div className="request_inventory rounded-2xl bg-blue-100 border-blue-950 w-5/6 m-auto my-8 px-10 py-8 shadow-[10px_10px_30px_rgba(0,0,0,0.3)]">
          <h1 className="text-blue-950 text-3xl font-bold text-center px-8 py-2">
            Request Inventory
          </h1>
          <form onSubmit={handleRequestInventory} className="text-black">
            <div className="grid grid-cols-3 gap-12 px-12 py-10">
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
                <label htmlFor="requestQty text-blue-900">
                  Request Quantity
                </label>
                <input
                  type="number"
                  name="requestQty"
                  placeholder=""
                  min="1"
                  value={formData.requestQty}
                  onChange={handleChange}
                  className="border-2 my-2 px-5 py-2 w-full text-gray-500 rounded-md"
                  required
                />
              </div>
              <div className="font-bold text-blue-900">
                <label htmlFor="requestByDept text-blue-900">
                  Department Name
                </label>
                <select
                  placeholder="Department Name"
                  name="requestByDept"
                  value={formData.requestByDept}
                  onChange={handleChange}
                  className="border-2 my-2 px-5 py-2 w-full text-gray-500 rounded-md"
                  required
                >
                  <option value="Department Name">Select Department</option>
                  <option value="Fashion & Textiles">Fashion & Textiles</option>
                  <option value="Jewellery Design">Jewellery Design</option>
                  <option value="Fine Arts">Fine Arts</option>
                  <option value="Performing Arts">Performing Arts</option>
                  <option value="English Literature & Language">
                    English Literature & Language
                  </option>
                  <option value="Indian Literature & Languages (Hindi/Sanskrit)">
                    Indian Literature & Languages (Hindi/Sanskrit)
                  </option>
                  <option value="Foreign Literature & Languages (French/German)">
                    Foreign Literature & Languages (French/German)
                  </option>
                  <option value="Economics">Economics</option>
                  <option value="History & Indian Culture">
                    History & Indian Culture
                  </option>
                  <option value="Sociology & Social Work">
                    Sociology & Social Work
                  </option>
                  <option value="Political Science and International Relations">
                    Political Science and International Relations
                  </option>
                  <option value="Public Administration">
                    Public Administration
                  </option>
                  <option value="Library & Information Science">
                    Library & Information Science
                  </option>
                  <option
                    value="Psychology
"
                  >
                    Psychology
                  </option>
                  <option value="Clinical Psychology">
                    Clinical Psychology
                  </option>
                  <option
                    value="Journalism and Mass Communication
"
                  >
                    Journalism and Mass Communication
                  </option>
                  <option value="Education">Education</option>
                  <option
                    value="Physical Education
"
                  >
                    Physical Education
                  </option>
                  <option value="Zoology ">Zoology </option>
                  <option
                    value="Botany
"
                  >
                    Botany
                  </option>
                  <option value="Microbiology & Biotechnology">
                    Microbiology & Biotechnology
                  </option>
                  <option value="Environmental Science">
                    Environmental Science
                  </option>
                  <option value="Home Science">Home Science</option>
                  <option
                    value="Physics
"
                  >
                    Physics
                  </option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Geography">Geography</option>
                  <option value="Mathematics">Mathematics</option>
                  <option
                    value="Statistics
"
                  >
                    Statistics
                  </option>
                  <option value="Computer Science & Information Technology">
                    Computer Science & Information Technology
                  </option>
                  <option
                    value="Accounting & Taxation
"
                  >
                    Accounting & Taxation
                  </option>
                  <option
                    value="Business Studies
"
                  >
                    Business Studies
                  </option>
                  <option
                    value="Financial Studies
"
                  >
                    Financial Studies
                  </option>
                  <option
                    value="Tourism and Aviation
"
                  >
                    Tourism and Aviation
                  </option>
                  <option
                    value="Management Studies
"
                  >
                    Management Studies
                  </option>
                </select>
              </div>

              <div className="font-bold text-blue-900">
                <label htmlFor="requestByFaculty text-blue-900">
                  Faculty Name
                </label>
                <input
                  type="text"
                  name="requestByFaculty"
                  placeholder=""
                  value={formData.requestByFaculty}
                  onChange={handleChange}
                  className="border-2 my-2 px-5 py-2 w-full text-gray-500 rounded-md"
                  required
                />
              </div>

              <div className="font-bold text-blue-900">
                <label htmlFor="requireDate text-blue-900">Required Date</label>
                <input
                  type="date"
                  name="requireDate"
                  placeholder=""
                  value={formData.requireDate}
                  onChange={handleChange}
                  className="border-2 my-2 px-5 py-2 w-full text-gray-500 rounded-md"
                  required
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
                  required
                >
                  <option value="Select Status">Select Status</option>
                  <option value="Returnable">Returnable</option>
                  <option value="Non Returnable">Non-Returnable</option>
                </select>
              </div>

              <div className="font-bold text-blue-900">
                <label htmlFor="requestReason text-blue-900">
                  Request Reason
                </label>
                <input
                  type="text"
                  name="requestReason"
                  placeholder=""
                  value={formData.requestReason}
                  onChange={handleChange}
                  className="border-2 my-2 px-5 py-2 w-full text-gray-500 rounded-md"
                  required
                />
              </div>


  <div className="font-bold text-blue-900">
                <label htmlFor="eventName text-blue-900">
                  Event Name
                </label>
                <input
                  type="text"
                  name="event"
                  placeholder=""
                  value={formData.event}
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
                onClick={handleRequestInventory}
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
              <button
                className="px-8 py-3 bg-gray-900 text-white rounded-lg mx-4"
                type="reset"
                onClick={() =>
                  setFormData({
                    requestByDept: "",
                    requestQty: "",
                    returnStatus: "",
                    requestByFaculty: "",
                    requireDate: "",
                    requestReason: "",
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

export default facultyRequestInventory;
