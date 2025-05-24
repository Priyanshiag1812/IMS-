import React, { useState, useEffect } from "react";
import Instance from "../../AxiosConfig";

function FacultyViewRequestTable() {
  const [viewRequestInventory, setViewRequestInventory] = useState([]);

  useEffect(() => {
    const fetchViewRequestInventory = async () => {
      try {
        const response = await Instance.get("/add/getViewRequestInventory");
        console.log("Fetched data:", response.data);
        setViewRequestInventory(response.data);
      } catch (error) {
        console.error("Error fetching request inventory:", error);
      }
    };

    fetchViewRequestInventory();
  }, []);
  console.log(viewRequestInventory);

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
          View Request Inventory Table
        </h2>
        <table className="w-full border-collapse border border-blue-900 mt-4 text-black">
          <thead>
            <tr className="bg-blue-800">
              <th className="border text-white px-4 py-2">S.No</th>
              <th className="border text-white px-4 py-2">Item Name</th>
              <th className="border text-white px-4 py-2">Category</th>
              <th className="border text-white px-4 py-2">Requested By</th>
              <th className="border text-white px-4 py-2">Event</th>
              <th className="border text-white px-4 py-2">Request Qty</th>
              <th className="border text-white px-4 py-2">Requested Date</th>
              <th className="border text-white px-4 py-2">Required Date</th>
              <th className="border text-white px-4 py-2">Status</th>


            </tr>
          </thead>
          <tbody>
            {viewRequestInventory.length > 0 ? (
              viewRequestInventory.map((category, categoryIndex) => {
                if (
                  !category.requestItems ||
                  !Array.isArray(category.requestItems)
                ) {
                  return null; // Skip this category if requestItems is not an array
                }
                return category.requestItems.map((item, itemIndex) => {
                  return (
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
                        {item.requestByFaculty}
                      </td>
                        <td className="border border-blue-900 px-4 py-2">
                        {item.event}
                      </td>
                      <td className="border border-blue-900 px-4 py-2">
                        {item.requestQty}
                      </td>

                      
                      <td className="border border-blue-900 px-4 py-2">
                        {formatDate(item.requestDate)}
                      </td>
                      <td className="border border-blue-900 px-4 py-2">
                        {formatDate(item.requireDate)}
                      </td>

<td className="border border-blue-900 px-4 py-2">
                        
                      </td>

                    </tr>
                  );
                });
              })
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-4">
                  No request inventory
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default FacultyViewRequestTable;
