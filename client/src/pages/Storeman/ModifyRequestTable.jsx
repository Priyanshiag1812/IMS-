import React, { useState, useEffect } from "react";
import Instance from "../../AxiosConfig";

function ModifyRequestTable() {
  const [modifyRequestInventory, setModifyRequestInventory] = useState([]);

  useEffect(() => {
    const fetchModifyRequestInventory = async () => {
      try {
        const response = await Instance.get("/add/getModifyRequestInventory");
        console.log("Fetched data:", response.data);
        setModifyRequestInventory(response.data);
      } catch (error) {
        console.error("Error fetching modify  inventory Table:", error);
      }
    };

    fetchModifyRequestInventory();
  }, []);

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <div className="wrapper">
      <div className="main flex items-start justify-center"></div>
      <div className="mt-10 text-black p-10">
        <h2 className="text-3xl font-bold text-center text-blue-900">
          Modify Request Table
        </h2>
        <table className="w-full border-collapse border border-blue-900 mt-4 text-black">
          <thead>
            <tr className="bg-blue-800">
              <th className="border text-white px-4 py-2">S.No</th>
              <th className="border text-white px-4 py-2">Item Name</th>
              <th className="border text-white px-4 py-2">Category</th>
              <th className="border text-white px-4 py-2">Request Qty</th>
              <th className="border text-white px-4 py-2">Modify Qty</th>
              <th className="border text-white px-4 py-2">Modify Date</th>
              <th className="border text-white px-4 py-2">Modify Reason</th>
            </tr>
          </thead>
          <tbody>
            {modifyRequestInventory.length > 0 ? (
              modifyRequestInventory.map((category, categoryIndex) => {
                if (
                  !category.requestItems ||
                  !Array.isArray(category.requestItems)
                ) {
                  return null;
                }

                const filteredItems = category.requestItems.filter(
                  (item) => item.requestQty && item.modifyQty > 0
                );

                if (filteredItems.length === 0) return null;

                return filteredItems.map((item, itemIndex) => (
                  <tr
                    key={`${categoryIndex}-${itemIndex}`}
                    className="text-center bg-blue-100 text-black"
                  >
                    <td className="border border-blue-900 px-4 py-2">
                      {categoryIndex + 1}.{itemIndex + 1}
                    </td>
                    <td className="border border-blue-900 px-4 py-2">
                      {item.itemName}
                    </td>
                    <td className="border border-blue-900 px-4 py-2">
                      {category.category}
                    </td>
                    <td className="border border-blue-900 px-4 py-2">
                      {item.requestQty}
                    </td>
                    <td className="border border-blue-900 px-4 py-2">
                      {item.modifyQty}
                    </td>
                    <td className="border border-blue-900 px-4 py-2">
                      {formatDate(item.modifyDate)}
                    </td>
                    <td className="border border-blue-900 px-4 py-2">
                      {item.modifyReason}
                    </td>
                  </tr>
                ));
              })
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-4">
                  No modify request inventory
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ModifyRequestTable;
