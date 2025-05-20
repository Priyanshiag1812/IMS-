import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Instance from "../AxiosConfig";

const Threshold = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Instance.get("/add/getTable")
      .then((res) => {
        const filteredInventory = res.data
          .map((category) => ({
            ...category,
            items: category.items.filter((item) => item.qty < item.threshold),
          }))
          .filter((category) => category.items.length > 0);

        setInventory(filteredInventory);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching inventory:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mt-8 p-5 text-center text-blue-900">
        Threshold Inventory Table
      </h1>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : inventory.length === 0 ? (
        <p className="text-center text-red-600">
          No items with threshold below 5.
        </p>
      ) : (
        <div className="overflow-x-auto ml-5">
          <table className="min-w-full p-4 border border-gray-300">
            <thead>
              <tr className="bg-blue-800 text-white text-center">
                <th className="border px-4 py-2">Serial No</th>
                <th className="border px-4 py-2">Category</th>
                <th className="border px-4 py-2">Item Name</th>
                <th className="border px-4 py-2">Qty</th>
                <th className="border px-4 py-2">Threshold</th>
                <th className="border px-4 py-2">Status</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((categoryData, categoryIndex) =>
                categoryData.items.map((item, itemIndex) => (
                  <tr
                    key={`${categoryData._id}-${itemIndex}`}
                    className="border text-center  bg-blue-100"
                  >
                    <td className="border px-4 py-2 text-black">
                      {categoryIndex * categoryData.items.length +
                        itemIndex +
                        1}
                    </td>
                    <td className="border px-4 py-2 text-black">
                      {categoryData.category}
                    </td>
                    <td className="border px-4 py-2 text-black">{item.name}</td>
                    <td className="border px-4 py-2 text-black">{item.qty}</td>
                    <td className="border px-4 py-2 text-black">
                      {item.threshold}
                    </td>
                    <td
                      className={`border text-black px-4 py-2 ${
                        item.status === "Available"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {item.status}
                    </td>
                    <td className="border text-black px-4 py-2">
                      <button
                        className="bg-green-700 text-white px-4 py-2 rounded-md"
                        onClick={() =>
                          navigate("/restock-inventory", {
                            state: { category: categoryData.category, ...item },
                          })
                        }
                      >
                        Restock
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Threshold;
