import { useState, useEffect } from "react";
import Instance from "../../AxiosConfig";

function IssueInventoryTable() {
  const [issuedInventory, setIssuedInventory] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 20;

  useEffect(() => {
    const fetchIssuedInventory = async () => {
      try {
        const response = await Instance.get("/add/getIssuedInventory", {
          withCredentials: true,
        });
        setIssuedInventory(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching issued inventory:", error);
        setLoading(false);
      }
    };
    fetchIssuedInventory();
  }, []);

  const uniqueCategories = [
    ...new Set(issuedInventory.map((cat) => cat.category)),
  ];

  const filteredIssuedInventory = issuedInventory
    .filter((cat) =>
      selectedCategory ? cat.category === selectedCategory : true
    )
    .map((cat) => ({
      ...cat,
      issuedItems: cat.issuedItems
        .filter(
          (issuedItem) =>
            issuedItem?.itemName
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase()) &&
            (selectedDepartment
              ? issuedItem?.issuedToDept
                  ?.toLowerCase()
                  .includes(selectedDepartment.toLowerCase())
              : true)
        )


        .filter((issuedItem) =>
          selectedStatus
            ? issuedItem?.returnStatus?.toLowerCase() ===
              selectedStatus.toLowerCase()
            : true
        )
        .sort((a, b) => a.itemName.localeCompare(b.itemName)),
    }))
    .filter(
      (cat) =>
        cat.issuedItems.length > 0 ||
        cat.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const allItems = filteredIssuedInventory.flatMap((cat, catIndex) =>
    cat.issuedItems.map((item, itemIndex) => ({
      ...item,
      category: cat.category,
      serial: `${catIndex + 1}.${item.itemName?.charAt(0).toUpperCase()}.${
        itemIndex + 1
      }`,
    }))
  );

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  };

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
  }, [searchQuery, selectedCategory, selectedStatus , selectedDepartment]);

  let serialNumber = 1;

  return (
    <div className="wrapper">
      <div className="main flex items-start justify-center"></div>
      <div className="mt-5 text-black px-10">
        <h2 className="text-2xl mb-4 font-bold text-center text-black">
          Issued Inventory Table
        </h2>

        {/* Filters */}
        <div className="flex flex-col md:flex-row justify-center my-4 gap-3">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border border-gray-400 rounded-md px-4 ml-3 py-2 text-black w-full md:w-1/6"
          >
            <option value="">All Categories</option>
            {uniqueCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Search by item name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-gray-400 rounded-md px-12 py-2 text-black w-full md:w-2/6"
          />

          <input
            type="text"
            placeholder="Search by Department name"
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="border border-gray-400 rounded-md px-4  py-2 text-black w-full md:w-2/6"
          />

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="border border-gray-400 rounded-md px-4 py-2 text-black w-full md:w-1/6"
          >
            <option value="">All Status</option>
            <option value="Returnable">Returnable</option>
            <option value="Non Returnable">Non Returnable</option>
          </select>
        </div>

        {loading ? (
          <p className="text-center">Loading...</p>
        ) : (
          <div>
            <div className="overflow-x-auto mx-4">
              <table className="w-full border-collapse border border-blue-900 mt-2 text-black">
                <thead>
                  <tr className="bg-blue-800">
                    <th className="border text-white px-4 py-2">S.No</th>
                    <th className="border text-white px-4 py-2">Item Name</th>
                    <th className="border text-white px-4 py-2">Category</th>
                    <th className="border text-white px-4 py-2">
                      Department Name
                    </th>
                    <th className="border text-white px-4 py-2">
                      Faculty Name
                    </th>
                    <th className="border text-white px-4 py-2">Event</th>
                    <th className="border text-white px-4 py-2">Issued Qty</th>
                    <th className="border text-white px-4 py-2">Issued Date</th>
                    <th className="border text-white px-4 py-2">Return Date</th>
                    <th className="border text-white px-4 py-2">
                      Return Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedItems.length > 0 ? (
                    paginatedItems.map((item, index) => {
                      return (
                        <tr
                          key={`${item.category}-${item.itemName}-${index}`}
                          className="text-center bg-blue-100 text-black"
                        >
                          <td className="border border-blue-900 px-4 py-2">
                            {serialNumber++}
                          </td>
                          <td className="border border-blue-900 px-4 py-2">
                            {item.itemName}
                          </td>
                          <td className="border border-blue-900 px-4 py-2">
                            {item.category}
                          </td>
                          <td className="border border-blue-900 px-4 py-2">
                            {item.issuedToDept}
                          </td>
                          <td className="border border-blue-900 px-4 py-2">
                            {item.issuedToFaculty}
                          </td>
                          <td className="border border-blue-900 px-4 py-2">
                            {item.event}
                          </td>
                          <td className="border border-blue-900 px-4 py-2">
                            {item.issuedQty}
                          </td>
                          <td className="border border-blue-900 px-4 py-2">
                            {formatDate(item.issuedDate)}
                          </td>
                          <td className="border border-blue-900 px-4 py-2">
                            {formatDate(item.returnDate)}
                          </td>
                          <td className="border border-blue-900 px-4 py-2">
                            {item.returnStatus}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="10" className="text-center py-4">
                        No issued inventory
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Page Numbers */}
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
    </div>
  );
}

export default IssueInventoryTable;
