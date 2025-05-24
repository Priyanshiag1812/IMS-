import { useState, useEffect } from "react";
import Instance from "../../AxiosConfig";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

function AdminRequestTable() {
  const navigate = useNavigate();
  const [viewRequestInventory, setViewRequestInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");


  const rowsPerPage = 20;

  useEffect(() => {
    const fetchViewRequestInventory = async () => {
      try {
        const response = await Instance.get("/add/getViewRequestInventory", {
          withCredentials: true,
        });
        console.log("Fetched data:", response.data);
        setViewRequestInventory(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching request inventory:", error);
        setLoading(false);
      }
    };

    fetchViewRequestInventory();
  }, []);

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Prepare filtered and flattened items
  const filteredInventory = viewRequestInventory
    .filter((cat) =>
      selectedCategory ? cat.category === selectedCategory : true
    )

    .map((cat) => ({
      ...cat,
      requestItems: cat.requestItems
        ?.filter((requestItem) =>
          requestItem?.itemName?.toLowerCase().includes(searchQuery.toLowerCase()) &&
          (selectedDepartment
            ? requestItem?.requestByDept
                ?.toLowerCase()
                .includes(selectedDepartment.toLowerCase())
            : true)
        ) || [],
    }))
    .filter((cat) => cat.requestItems.length > 0);

  const allItems = filteredInventory.flatMap((cat, catIndex) =>
    cat.requestItems.map((requestItem, itemIndex) => ({
      ...requestItem,
      category: cat.category,
      serial: `${catIndex + 1}.${requestItem.itemName?.charAt(0).toUpperCase()}.${
        itemIndex + 1
      }`,
    }))
  );

  const totalPages = Math.ceil(allItems.length / rowsPerPage);
  const paginatedItems = allItems.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

  const uniqueCategories = [
    ...new Set(viewRequestInventory.map((cat) => cat.category)),
  ];

  return (
    <div className="wrapper">
      <ToastContainer />
      <div className="mt-1 text-black p-10">
        <h2 className="text-2xl font-bold text-center mb-3 text-blue-900">
          View Request Inventory Table
        </h2>

        <div className="flex flex-col md:flex-row justify-center mb-4 gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border border-gray-400 rounded-md px-4 ml-5 py-2 text-black w-full md:w-1/6"
          >
            <option value="">All Categories</option>
            {uniqueCategories.map((cat, index) => (
              <option key={index} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Search by item name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-gray-400 rounded-md px-4 ml-5 py-2 text-black w-full md:w-3/6"
          />

           <input
            type="text"
            placeholder="Search by Department name"
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="border border-gray-400 rounded-md px-4 ml-5 py-2 text-black w-full md:w-2/6"
          />
          
        </div>

        {loading ? (
          <p className="text-center mt-4">Loading...</p>
        ) : (
          <>
            <div className="overflow-x-auto mt-6">
              <table className="w-full border-collapse border border-blue-900 text-black">
                <thead>
                  <tr className="bg-blue-800 text-white">
                    <th className="border px-4 py-2">S.No</th>
                    <th className="border px-4 py-2">Item Name</th>
                    <th className="border px-4 py-2">Category</th>
                    <th className="border px-4 py-2">Department</th>
                    <th className="border px-4 py-2">Event</th>
                    <th className="border px-4 py-2">Qty</th>
                    <th className="border px-4 py-2">Required Date</th>
                    <th className="border px-4 py-2">Reason</th>
                    <th className="border px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedItems.length > 0 ? (
                    paginatedItems.map((item, index) => (
                      <tr
                        key={`${item.category}-${item.name}-${index}`}
                        className="text-center bg-blue-100"
                      >
                        <td className="border border-blue-900 px-4 py-2">
                          {(currentPage - 1) * rowsPerPage + index + 1}
                        </td>
                        <td className="border border-blue-900 px-4 py-2">
                          {item.itemName}
                        </td>
                        <td className="border border-blue-900 px-4 py-2">
                          {item.category}
                        </td>
                        <td className="border border-blue-900 px-4 py-2">
                          {item.requestByDept}
                        </td>
                        <td className="border border-blue-900 px-4 py-2">
                          {item.event}
                        </td>
                        <td className="border border-blue-900 px-4 py-2">
                          {item.requestQty}
                        </td>
                        <td className="border border-blue-900 px-4 py-2">
                          {formatDate(item.requireDate)}
                        </td>
                        <td className="border border-blue-900 px-4 py-2">
                          {item.requestReason}
                        </td>
                        <td className="border border-blue-900 px-4 py-2">
                        
                          <button
                            className="bg-green-600 text-white mx-1 px-3 py-1 rounded-md"
                            onClick={() =>
                              navigate("/issue-inventory", {
                                state: { category: item.category, ...item },
                              })
                            }
                          >
                            
                            Approve
                          </button>
                          <button className="bg-red-600 text-white mx-1 px-3 py-1 rounded-md">


                            Decline
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="9"
                        className="text-center py-4 text-gray-600"
                      >
                        No request inventory found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center mt-6 flex-wrap gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                <button
                  key={num}
                  onClick={() => handlePageChange(num)}
                  className={`px-4 py-2 rounded-md ${
                    currentPage === num
                      ? "bg-blue-700 text-white"
                      : "bg-gray-200 text-black"
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default AdminRequestTable;
