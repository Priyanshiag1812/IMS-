import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Instance from "../AxiosConfig";

const FacultyRequestInventoryTable = () => {
  const [inventory, setInventory] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await Instance.get("/add/getTable");
      setInventory(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching inventory:", error);
      setLoading(false);
    }
  };

  const uniqueCategories = [...new Set(inventory.map((item) => item.category))];

  const filteredInventory = inventory
    .filter((category) =>
      selectedCategory ? category.category === selectedCategory : true
    )
    .map((category) => {
      return {
        ...category,
        items: (category.items || [])
          .filter((item) =>
            item?.name?.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .sort((a, b) => a.name.localeCompare(b.name)),
      };
    })
    .filter(
      (category) =>
        category.items.length > 0 ||
        category.category.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => a.category.localeCompare(b.category));

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-center text-black">
        Request Inventory Table
      </h1>
      <div className="flex flex-col md:flex-row justify-center mb-4 gap-4">
        <input
          type="text"
          placeholder="Search by item name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border border-gray-400 rounded-md px-12 py-2 text-black w-full md:w-4/6"
        />

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border border-gray-400 rounded-md px-4 ml-5 py-2 text-black w-full md:w-1/6"
        >
          <option value="">All Categories</option>
          {uniqueCategories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <div className="overflow-x-auto mx-4">
          <table className="min-w-full border bg-blue-100 border-gray-300">
            <thead>
              <tr className="text-center bg-blue-800 text-white">
                <th className="border px-4 py-2">Serial No</th>
                <th className="border px-4 py-2">Item Name</th>
                <th className="border px-4 py-2">Category</th>
                <th className="border px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredInventory.map((categoryData, categoryIndex) => {
                let letterCount = {};
                return categoryData.items.map((item) => {
                  const firstLetter =
                    item?.name?.charAt(0)?.toUpperCase() || "#";
                  if (!letterCount[firstLetter]) {
                    letterCount[firstLetter] = 1;
                  } else {
                    letterCount[firstLetter]++;
                  }
                  const serialNumber = `${categoryIndex + 1}.${firstLetter}.${
                    letterCount[firstLetter]
                  }`;

                  return (
                    <tr
                      key={`${categoryData._id}-${item.name}`}
                      className="border text-center"
                    >
                      <td className="border px-4 py-2 text-black">
                        {serialNumber}
                      </td>
                      <td className="border px-4 py-2 text-black">
                        {item.name}
                      </td>
                      <td className="border px-4 py-2 text-black">
                        {categoryData.category}
                      </td>
                      <td className="border px-4 py-2 text-black">
                        <button
                          className="bg-blue-700 text-white mx-2 px-5 py-2 rounded-md"
                          onClick={() =>
                            navigate("/faculty-request-inventory", {
                              state: {
                                category: categoryData.category,
                                ...item,
                              },
                            })
                          }
                        >
                          Request
                        </button>
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

export default FacultyRequestInventoryTable;
