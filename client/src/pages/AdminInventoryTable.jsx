import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Instance from "../AxiosConfig";

const AdminInventoryTable = () => {
  const [inventory, setInventory] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [loading, setLoading] = useState(true);
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

  const handleDelete = async (category, itemName) => {
    try {
      const response = await Instance.delete("/add/removeInventory", {
        data: { category, itemName },
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
      let letterGroups = {};
      let alphabetOrder = [];

      cat.items.forEach((item) => {
        const firstLetter = (item?.name?.charAt(0) || "#").toUpperCase();
        if (!letterGroups[firstLetter]) {
          letterGroups[firstLetter] = 1;
          alphabetOrder.push(firstLetter);
        } else {
          letterGroups[firstLetter]++;
        }
      });

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
        letterGroups,
        alphabetOrder: alphabetOrder.sort(),
      };
    })
    .filter(
      (cat) =>
        cat.items.length > 0 ||
        cat.category.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => a.category.localeCompare(b.category));

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-center text-black">
        Inventory Table
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
        <div className="overflow-x-auto mx-4">
          <table className="min-w-full border bg-blue-100 border-gray-300">
            <thead>
              <tr className="text-center bg-blue-800 text-white">
                <th className="border px-4 py-2">Serial No</th>
                <th className="border px-4 py-2">Category</th>
                <th className="border px-4 py-2">Item Name</th>
                <th className="border px-4 py-2">Quantity</th>
                <th className="border px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredInventory.map((catData, catIndex) => {
                let letterCount = {};

                return catData.items.map((item) => {
                  const firstLetter = (
                    item?.name?.charAt(0) || "#"
                  ).toUpperCase();
                  if (!letterCount[firstLetter]) {
                    letterCount[firstLetter] = 1;
                  } else {
                    letterCount[firstLetter]++;
                  }
                  const serialNumber = `${catIndex + 1}.${firstLetter}.${
                    letterCount[firstLetter]
                  }`;

                  return (
                    <tr
                      key={`${catData._id}-${item.name}`}
                      className="border text-center"
                    >
                      <td className="border px-4 py-2 text-black">
                        {serialNumber}
                      </td>
                      <td className="border px-4 py-2 text-black">
                        {catData.category}
                      </td>
                      <td className="border px-4 py-2 text-black">
                        {item.name}
                      </td>
                      <td className="border px-4 py-2 text-black">
                        {item.qty}
                      </td>
                      <td
                        className={`border px-4 py-2 text-black ${
                          item.status === "Available"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {item.status}
                      </td>
                    </tr>
                  );
                });
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminInventoryTable;
