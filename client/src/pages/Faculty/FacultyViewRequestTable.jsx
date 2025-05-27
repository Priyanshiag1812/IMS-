import React, { useState, useEffect } from "react";
import Instance from "../../AxiosConfig";

function FacultyViewRequestTable() {
  const [viewRequestInventory, setViewRequestInventory] = useState([]);
  const [expandedRows, setExpandedRows] = useState({}); // 🔄 For toggling

  useEffect(() => {
    const fetchViewRequestInventory = async () => {
      try {
        const response = await Instance.get("/add/getViewRequestInventory");
        setViewRequestInventory(response.data);
      } catch (error) {
        console.error("Error fetching request inventory:", error);
      }
    };

    fetchViewRequestInventory();
  }, []);

  const toggleRow = (key) => {
    setExpandedRows((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return `${date.getDate().toString().padStart(2, "0")}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${date.getFullYear()}`;
  };

  return (
    <div className="wrapper">
      <div className="mt-10 text-black p-10">
        <h2 className="text-3xl font-bold text-center text-blue-900">
          View Request Inventory Table
        </h2>
        <table className="w-full border-collapse border border-blue-900 mt-4 text-black">
          <thead>
            <tr className="bg-blue-800">
              <th className="border text-white px-4 py-2">S.No</th>
              {/* <th className="border text-white px-4 py-2">Category</th> */}
              <th className="border text-white px-4 py-2">Requested By</th>
              <th className="border text-white px-4 py-2">Department</th>
              <th className="border text-white px-4 py-2">Event</th>
              <th className="border text-white px-4 py-2">Request Date</th>
              <th className="border text-white px-4 py-2">Status</th>
              <th className="border text-white px-4 py-2">Items</th>
            </tr>
          </thead>
          <tbody>
            {viewRequestInventory.length > 0 ? (
              viewRequestInventory.map((category, categoryIndex) =>
                category.multiRequestItems.map((item, itemIndex) => {
                  const rowKey = `${categoryIndex}-${itemIndex}`;
                  return (
                    <React.Fragment key={rowKey}>
                      <tr className="text-center bg-blue-100">
                        <td className="border border-blue-900 px-4 py-2">
                          {categoryIndex + 1}.{itemIndex + 1}
                        </td>
                        {/* <td className="border border-blue-900 px-4 py-2">
                          {category.category}
                        </td> */}
                        <td className="border border-blue-900 px-4 py-2">
                          {item.facultyName}
                        </td>
                        <td className="border border-blue-900 px-4 py-2">
                          {item.department}
                        </td>
                        <td className="border border-blue-900 px-4 py-2">
                          {item.event}
                        </td>
                        <td className="border border-blue-900 px-4 py-2">
                          {formatDate(item.requestDate)}
                        </td>
                        <td className="border border-blue-900 px-4 py-2">
                          {item.status}
                        </td>
                        <td className="border border-blue-900 px-4 py-2">
                          <button
                            onClick={() => toggleRow(rowKey)}
                            className="bg-blue-500 text-white px-2 py-1 rounded"
                          >
                            {expandedRows[rowKey] ? "Hide Items" : "Show Items"}
                          </button>
                        </td>
                      </tr>

                      {expandedRows[rowKey] && (
                        <tr>
                          <td colSpan="8" className="bg-white border px-4 py-2">
                            <table className="w-full  py-5 my-3 text-sm border border-gray-300">
                              <thead>
                                <tr className="bg-blue-200">
                                  <th className="border px-2 py-1">S.No</th>
                                  <th className="border  px-2 py-1">Category</th>
                                  <th className="border  px-2 py-1">Item Name</th>
                                  <th className="border px-2 py-1">Request Qty</th>
                                  <th className="border px-2 py-1">Required Date</th>
                                  <th className="border px-2 py-1">Return Status</th>
                                </tr>
                              </thead>
                              <tbody>
                                {item.requestItems.map((subItem, i) => (
                                  <tr key={i} className="text-center">
                                     <td className="border px-2 py-1">
                                      {++i}
                                    </td>
                                     <td className="border px-2 py-1">
                                      {subItem.category}
                                    </td>
                                    <td className="border px-2 py-1">
                                      {subItem.itemName}
                                    </td>
                                    <td className="border px-2 py-1">
                                      {subItem.requestQty}
                                    </td>
                                    <td className="border px-2 py-1">
                                      {formatDate(subItem.requireDate)}
                                    </td>
                                    <td className="border px-2 py-1">
                                      {subItem.returnStatus}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )
            ) : (
              <tr>
                <td colSpan="8" className="text-center py-4">
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
