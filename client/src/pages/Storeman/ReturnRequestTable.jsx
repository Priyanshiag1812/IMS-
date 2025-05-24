import React, { useState, useEffect } from "react";
import Instance from "../../AxiosConfig";

function ReturnRequestTable() {
  const [returnRequestInventory, setReturnRequestInventory] = useState([]);

  useEffect(() => {
    const fetchReturnRequestInventory = async () => {
      try {
        const response = await Instance.get("/add/getReturnRequestInventory");
        console.log("Fetched data:", response.data);
        setReturnRequestInventory(response.data);
      } catch (error) {
        console.error("Error fetching return inventory:", error);
      }
    };

    fetchReturnRequestInventory();
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
          Return Request Table
        </h2>
        <table className="w-full border-collapse border border-blue-900 mt-4 text-black">
          <thead>
            <tr className="bg-blue-800">
              <th className="border text-white px-4 py-2">S.No</th>
              <th className="border text-white px-4 py-2">Item Name</th>
              <th className="border text-white px-4 py-2">Category</th>
              <th className="border text-white px-4 py-2">Issued Qty</th>
              <th className="border text-white px-4 py-2">Return Qty</th>
              <th className="border text-white px-4 py-2">Issued Date</th>
              <th className="border text-white px-4 py-2">Return Date</th>
              <th className="border text-white px-4 py-2">Restock</th>

            </tr>
          </thead>
          <tbody>
            {returnRequestInventory.length > 0 ? (
              returnRequestInventory.map((category, categoryIndex) => {
                if (
                  !category.issuedItems ||
                  !Array.isArray(category.issuedItems)
                ) {
                  return null;
                }

                const filteredItems = category.issuedItems.filter(
                  (item) => item.returnQty && item.returnQty > 0
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
                      {item.issuedQty}
                    </td>
                    <td className="border border-blue-900 px-4 py-2">
                      {item.returnQty}
                    </td>
                    <td className="border border-blue-900 px-4 py-2">
                      {formatDate(item.issuedDate)}
                    </td>
                    <td className="border border-blue-900 px-4 py-2">
                      {formatDate(item.returnDate)}
                    </td>
                     <td className="border border-blue-900 px-4 py-2">
                          <button
                            className="bg-green-700 text-white mx-2 px-5 py-2 rounded-md"
                          >
                            Restock
                          </button>
                        </td>
                  </tr>
                ));
              })
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-4">
                  No return request inventory
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ReturnRequestTable;
