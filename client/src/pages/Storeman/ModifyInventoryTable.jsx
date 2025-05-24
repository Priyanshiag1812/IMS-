import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Instance from "../../AxiosConfig";

const ModifyInventoryTable = () => {
  const [inventory, setInventory] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 20;
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await Instance.get("/add/getTable", {
        withCredentials: true,
      });
      setInventory(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching inventory:", error);
      setLoading(false);
    }
  };

  const handleDelete = async (category, itemName , qty) => {
    try {
      const response = await Instance.post("/add/delete-inventory", {
        data: { category, itemName , qty  },
      });
      alert(response.data.message);

      fetchData();
    } catch (error) {
      console.error("Error deleting inventory item:", error);
      alert("Failed to delete item");
    }
  };

  const uniqueCategories = [...new Set(inventory.map((cat) => cat.category))];

  const filteredInventory = inventory
    .filter((cat) =>
      selectedCategory ? cat.category === selectedCategory : true
    )
    .map((cat) => {
      return {
        ...cat,
        items: cat.items
          .filter((item) =>
            item?.name?.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .filter((item) =>
            selectedStatus
              ? item?.status?.toLowerCase() === selectedStatus.toLowerCase()
              : true
          )
          .sort((a, b) => a.name.localeCompare(b.name)),
      };
    })
    .filter(
      (cat) =>
        cat.items.length > 0 ||
        cat.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const allItems = filteredInventory.flatMap((cat, catIndex) =>
    cat.items.map((item, itemIndex) => ({
      ...item,
      category: cat.category,
      serial: `${catIndex + 1}.${item.name?.charAt(0).toUpperCase()}.${
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

  // Reset page if filters/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedStatus]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-center text-black">
       Edit Inventory Table
      </h1>

      {/* Filters */}
      <div className="flex flex-col md:flex-row justify-center mb-4 gap-4">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border border-gray-400 rounded-md px-4 ml-5 py-2 text-black w-full md:w-1/6"
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
          className="border border-gray-400 rounded-md px-12 py-2 text-black w-full md:w-4/6"
        />

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="border border-gray-400 rounded-md px-4 py-2 text-black w-full md:w-1/6"
        >
          <option value="">All Status</option>
          <option value="Available">Available</option>
          <option value="Low Stock">Low Stock</option>
          <option value="Out of Stock">Out of Stock</option>
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <>
          <div className="overflow-x-auto mx-4">
            <table className="min-w-full border bg-blue-100 border-gray-300">
              <thead>
                <tr className="text-center bg-blue-800 text-white">
                  <th className="border px-4 py-2">Serial No</th>
                  <th className="border px-4 py-2">Category</th>
                  <th className="border px-4 py-2">Item Name</th>
                  <th className="border px-4 py-2">Quantity</th>
                  <th className="border px-4 py-2">Status</th>
                  <th className="border px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedItems.map((item, index) => (
                  <tr key={`${item.category}-${item.name}-${index}`} className="text-center">
                    <td className="border px-4 py-2 text-black">{item.serial}</td>
                    <td className="border px-4 py-2 text-black">{item.category}</td>
                    <td className="border px-4 py-2 text-black">{item.name}</td>
                    <td className="border px-4 py-2 text-black">{item.qty}</td>
                    <td
                      className={`border text-black px-4 py-2 ${
                        item.status === "Available"
                          ? "text-green-600 border-black"
                          : "text-red-600  border-black"
                      }`}
                    >
                      {item.status}
                    </td>
                   
                    <td className="border  text-black px-4 py-2">
                      <button
                        className="bg-yellow-500 text-white mx-1 px-5 py-2 rounded-md"
                        onClick={() =>
                          navigate("/update-inventory", {
                            state: { category: item.category, ...item },
                          })
                        }
                      >
                        Update
                      </button>
                      <button
                        className="bg-blue-800 text-white px-5 py-2 rounded-md"
                        onClick={() =>
                             handleDelete(item.category, item.name , item.qty)
                          // navigate("/delete-inventory", {
                          //    state: { category: item.category, ...item },
                          // })
                       
                        }
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
        </>
      )}
    </div>
  );
};

export default ModifyInventoryTable;
