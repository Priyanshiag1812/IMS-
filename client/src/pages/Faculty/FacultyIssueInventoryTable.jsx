import React, { useState, useEffect } from "react";
import Instance from "../../AxiosConfig";
import { useNavigate } from "react-router-dom";

function FacultyIssueInventoryTable() {
  const [issuedInventory, setIssuedInventory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchIssuedInventory = async () => {
      try {
        const response = await Instance.get("/add/getIssuedInventory");
        setIssuedInventory(response.data);
      } catch (error) {
        console.error("Error fetching issued inventory:", error);
      }
    };

    fetchIssuedInventory();
  }, []);

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    const hour12 = hours % 12 || 12;

    // return `${day}-${month}-${year} ${hour12}:${minutes} ${ampm}`;
    return `${day}-${month}-${year}`; // Only date in dd-mm-yyyy format
  };

  return (
    <div className="wrapper">
      <div className="main flex items-start justify-center"></div>
      <div className="mt-10 text-black p-10">
        <h2 className="text-3xl font-bold text-center text-blue-900">
          Issued Inventory Table
        </h2>
        <table className="w-full border-collapse border border-blue-900 mt-4 text-black">
          <thead>
            <tr className="bg-blue-800">
              <th className="border text-white px-4 py-2">S.No</th>
              <th className="border text-white px-4 py-2">Item Name</th>
              <th className="border text-white px-4 py-2">Category</th>
              <th className="border text-white px-4 py-2">Quantity</th>

              <th className="border text-white px-4 py-2">Issue Date</th>
              <th className="border text-white px-4 py-2">Faculty Name</th>
                            <th className="border text-white px-4 py-2">Event Name</th>

              <th className="border text-white px-4 py-2">Return Status</th>
              <th className="border text-white px-4 py-2">Return</th>
            </tr>
          </thead>
          <tbody>
            {issuedInventory.length > 0 ? (
              issuedInventory.flatMap((category, categoryIndex) =>
                category.issuedItems.length > 0
                  ? category.issuedItems.map((item, itemIndex) => (
                      <tr
                        key={`${categoryIndex}-${itemIndex}`}
                        className="text-center bg-blue-100 text-black"
                      >
                        <td className="border border-blue-900 px-4 py-2">
                          {categoryIndex + 1} . {itemIndex + 1}
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
                          {formatDate(item.issuedDate)}
                        </td>{" "}
                        <td className="border border-blue-900 px-4 py-2">
                          {item.issuedToFaculty}
                        </td>

  <td className="border border-blue-900 px-4 py-2">
                          {item.event}
                        </td>

                        <td className="border border-blue-900 px-4 py-2">
                          {item.returnStatus}
                        </td>
                        <td className="border px-4 py-2 text-black">
                          <button
                            className="bg-blue-700 text-white mx-2 px-5 py-2 rounded-md"
                            onClick={() =>
                              navigate("/faculty-return-inventory", {
                                 state: {  issuedItem: item,
        category: category.category},
                              })
                            }
                          >
                            Return
                          </button>
                        </td>
                      </tr>
                    ))
                  : null
              )
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-4">
                  No issued inventory
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default FacultyIssueInventoryTable;
