// import { useState, useEffect } from "react";
// import Instance from "../../AxiosConfig";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { useNavigate } from "react-router-dom";
// import {
//   PencilLine,
//   CheckCircle2,
//   XCircle,
// } from "lucide-react"; 

// function RequestInventoryTable() {
//   const navigate = useNavigate();
//   const [viewRequestInventory, setViewRequestInventory] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("");
//   const [selectedDepartment, setSelectedDepartment] = useState("");

//   const rowsPerPage = 20;

//   useEffect(() => {
//     const fetchViewRequestInventory = async () => {
//       try {
//         const response = await Instance.get("/add/getViewRequestInventory", {
//           withCredentials: true,
//         });
//         console.log("Fetched data:", response.data);
//         setViewRequestInventory(response.data);
//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching request inventory:", error);
//         setLoading(false);
//       }
//     };

//     fetchViewRequestInventory();
//   }, []);

//   const formatDate = (isoDate) => {
//     const date = new Date(isoDate);
//     const day = String(date.getDate()).padStart(2, "0");
//     const month = String(date.getMonth() + 1).padStart(2, "0");
//     const year = date.getFullYear();
//     return `${day}-${month}-${year}`;
//   };

//   // Prepare filtered and flattened items
//   const filteredInventory = viewRequestInventory
//     .filter((cat) =>
//       selectedCategory ? cat.category === selectedCategory : true
//     )
  
//     .map((cat) => ({
//       ...cat,
//       requestItems: cat.requestItems
//         ?.filter((requestItem) =>
//           requestItem?.itemName?.toLowerCase().includes(searchQuery.toLowerCase()) &&
//           (selectedDepartment
//             ? requestItem?.requestByDept
//                 ?.toLowerCase()
//                 .includes(selectedDepartment.toLowerCase())
//             : true)
//         ) || [],
      

//     }))
//     .filter((cat) => cat.requestItems.length > 0);

//   const allItems = filteredInventory.flatMap((cat, catIndex) =>
//     cat.requestItems.map((requestItem, itemIndex) => ({
//       ...requestItem,
//       category: cat.category,
//       serial: `${catIndex + 1}.${requestItem.itemName?.charAt(0).toUpperCase()}.${
//         itemIndex + 1
//       }`,
//     }))
//   );

//   const totalPages = Math.ceil(allItems.length / rowsPerPage);
//   const paginatedItems = allItems.slice(
//     (currentPage - 1) * rowsPerPage,
//     currentPage * rowsPerPage
//   );

//   const handlePageChange = (page) => {
//     setCurrentPage(page);
//   };

//   useEffect(() => {
//     setCurrentPage(1);
//   }, [searchQuery, selectedCategory]);

//   const uniqueCategories = [
//     ...new Set(viewRequestInventory.map((cat) => cat.category)),
//   ];

//   return (
//     <div className="wrapper">
//       <ToastContainer />
//       <div className="mt-1 text-black p-10">
//         <h2 className="text-2xl font-bold text-center mb-3 text-blue-900">
//           View Request Inventory Table
//         </h2>

//         <div className="flex flex-col md:flex-row justify-center mb-4 gap-2">
//           <select
//             value={selectedCategory}
//             onChange={(e) => setSelectedCategory(e.target.value)}
//             className="border border-gray-400 rounded-md px-4 ml-5 py-2 text-black w-full md:w-1/6"
//           >
//             <option value="">All Categories</option>
//             {uniqueCategories.map((cat, index) => (
//               <option key={index} value={cat}>
//                 {cat}
//               </option>
//             ))}
//           </select>
//           <input
//             type="text"
//             placeholder="Search by item name"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="border border-gray-400 rounded-md px-4 ml-5 py-2 text-black w-full md:w-3/6"
//           />

//              <input
//             type="text"
//             placeholder="Search by Department name"
//             value={selectedDepartment}
//             onChange={(e) => setSelectedDepartment(e.target.value)}
//             className="border border-gray-400 rounded-md px-4 ml-5 py-2 text-black w-full md:w-2/6"
//           />
          
//         </div>

//         {loading ? (
//           <p className="text-center mt-4">Loading...</p>
//         ) : (
//           <>
//             <div className="overflow-x-auto mt-6">
//               <table className="w-full border-collapse border border-blue-900 text-black">
//                 <thead>
//                   <tr className="bg-blue-800 text-white">
//                     <th className="border px-4 py-2">S.No</th>
//                     <th className="border px-4 py-2">Item Name</th>
//                     <th className="border px-4 py-2">Category</th>
//                     <th className="border px-4 py-2">Department</th>
//                     <th className="border px-4 py-2">Event</th>
//                     <th className="border px-4 py-2">Qty</th>
//                     <th className="border px-4 py-2">Required Date</th>
//                     <th className="border px-4 py-2">Reason</th>
//                     <th className="border px-4 py-2">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {paginatedItems.length > 0 ? (
//                     paginatedItems.map((item, index) => (
//                       <tr
//                         key={`${item.category}-${item.name}-${index}`}
//                         className="text-center bg-blue-100"
//                       >
//                         <td className="border border-blue-900 px-4 py-2">
//                           {(currentPage - 1) * rowsPerPage + index + 1}
//                         </td>
//                         <td className="border border-blue-900 px-4 py-2">
//                           {item.itemName}
//                         </td>
//                         <td className="border border-blue-900 px-4 py-2">
//                           {item.category}
//                         </td>
//                         <td className="border border-blue-900 px-4 py-2">
//                           {item.requestByDept}
//                         </td>
//                         <td className="border border-blue-900 px-4 py-2">
//                           {item.event}
//                         </td>
//                         <td className="border border-blue-900 px-4 py-2">
//                           {item.requestQty}
//                         </td>
//                         <td className="border border-blue-900 px-4 py-2">
//                           {formatDate(item.requireDate)}
//                         </td>
//                         <td className="border border-blue-900 px-4 py-2">
//                           {item.requestReason}
//                         </td>
//                         <td className="border border-blue-900 px-4 py-2">
//                           <button
//                             className="bg-yellow-500 text-white mx-1 px-3 py-1 rounded-md"
//                             onClick={() =>
//                               navigate("/modify-request", {
//                                 state: { category: item.category, ...item },
//                               })
//                             }
//                           >
//                             {/* Modify */}
//                           <PencilLine size={15} />
//                           </button>
//                           <button
//                             className="bg-green-600 text-white mx-1 px-3 py-1 rounded-md"
//                             onClick={() =>
//                               navigate("/issue-inventory", {
//                                 state: { category: item.category, ...item },
//                               })
//                             }
//                           >
//                             <CheckCircle2 size={15} />
                            
//                             {/* Approve */}
//                           </button>
//                           <button className="bg-red-600 text-white mx-1 px-3 py-1 rounded-md">

//                              < XCircle size={15} />

//                             {/* Decline */}
//                           </button>
//                         </td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td
//                         colSpan="9"
//                         className="text-center py-4 text-gray-600"
//                       >
//                         No request inventory found.
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>

//             {/* Pagination Controls */}
//             <div className="flex justify-center mt-6 flex-wrap gap-2">
//               {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
//                 <button
//                   key={num}
//                   onClick={() => handlePageChange(num)}
//                   className={`px-4 py-2 rounded-md ${
//                     currentPage === num
//                       ? "bg-blue-700 text-white"
//                       : "bg-gray-200 text-black"
//                   }`}
//                 >
//                   {num}
//                 </button>
//               ))}
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

// export default RequestInventoryTable;


import React, { useState, useEffect } from "react";
import Instance from "../../AxiosConfig";

function RequestInventoryTable() {
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
              <th className="border text-white px-4 py-2">Faculty</th>
              <th className="border text-white px-4 py-2">Department</th>
              <th className="border text-white px-4 py-2">Event</th>
              <th className="border text-white px-4 py-2">Request Date</th>
              <th className="border text-white px-4 py-2">Reason</th>
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
                          {item.requestReason}
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
                                                                    <th className="border px-2 py-1">Actions</th>

                                </tr>
                              </thead>
                              <tbody>
{item.requestItems.map((subItem, i) => (
  <React.Fragment key={i}>
    <tr className="text-center">
      <td className="border px-2 py-1">
        {i + 1}
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
       <td className="border px-2 py-1">
        <button className="bg-yellow-500  text-white mx-1 px-3 py-1 rounded-md">
          Modify
        </button>
        <button className="bg-green-600 text-white mx-1 px-3 py-1 rounded-md">
          Approve
        </button>
        <button className="bg-red-600 text-white mx-1 px-3 py-1 rounded-md">
          Decline
        </button>
      </td>
    </tr>
    <tr>
     
    </tr>
  </React.Fragment>
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

export default RequestInventoryTable;
