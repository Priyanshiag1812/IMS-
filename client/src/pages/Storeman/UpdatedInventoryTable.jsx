import React, { useState, useEffect } from "react";
import Instance from "../../AxiosConfig";

function UpdatedInventoryTable() {
  const [updatedInventory, setUpdatedInventory] = useState([]);

  useEffect(() => {
    const fetchUpdatedInventory = async () => {
      try {
        const response = await Instance.get("/add/getUpdatedInventory");
        setUpdatedInventory(response.data);
      } catch (error) {
        console.error("Error fetching updated inventory:", error);
      }
    };

    fetchUpdatedInventory();
  }, []);

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  let serialNumber = 1;

  return (
    <div className="wrapper">
      <div className="main flex items-start justify-center"></div>
      <div className="mt-10 text-black p-10">
        <h2 className="text-3xl font-bold text-center text-blue-900">
          Updated Inventory Table
        </h2>
        <table className="w-full border-collapse border border-blue-900 mt-4 text-black">
          <thead>
            <tr className="bg-blue-800">
              <th className="border text-white px-4 py-2">S.No</th>
              <th className="border text-white px-4 py-2">Date </th>
              <th className="border text-white px-4 py-2">Item Name</th>
              <th className="border text-white px-4 py-2">Category</th>
              <th className="border text-white px-4 py-2">Quantity</th>
              <th className="border text-white px-4 py-2">Updated Quantity</th>
              <th className="border text-white px-4 py-2">Threshold</th>
              <th className="border text-white px-4 py-2">Updated Threshold</th>
              <th className="border text-white px-4 py-2">Reason</th>
            </tr>
          </thead>
          <tbody>
            {updatedInventory.length > 0 ? (
              updatedInventory.map((category, categoryIndex) =>
                category.items.map((item, itemIndex) =>
                  item.updatedItems.map((updated, updatedItemIndex) => (
                    <tr
                      key={`${categoryIndex}-${itemIndex}-${updatedItemIndex}`}
                      className="text-center bg-blue-100 text-black"
                    >
                      <td className="border border-blue-900 px-4 py-2">
                        {serialNumber++}
                      </td>
                      <td className="border border-blue-900 px-4 py-2">
                        {formatDate(updated.DateOfUpdation)}
                      </td>
                      <td className="border border-blue-900 px-4 py-2">
                        {item.name}
                      </td>
                      <td className="border border-blue-900 px-4 py-2">
                        {category.category}
                      </td>
                      <td className="border border-blue-900 px-4 py-2">
                        {updated.qty}
                      </td>
                      <td className="border border-blue-900 px-4 py-2">
                        {updated.updatedQty}
                      </td>
                      <td className="border border-blue-900 px-4 py-2">
                        {updated.threshold}
                      </td>
                      <td className="border border-blue-900 px-4 py-2">
                        {updated.updatedThreshold}
                      </td>
                      <td className="border border-blue-900 px-4 py-2">
                        {updated.reason}
                      </td>
                    </tr>
                  ))
                )
              )
            ) : (
              <tr>
                <td colSpan="9" className="text-center py-4">
                  No updated inventory available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UpdatedInventoryTable;
