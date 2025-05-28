// import React, { useState, useEffect } from "react";
// import Instance from "../../AxiosConfig";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { useNavigate } from "react-router-dom";

// function AdminRequestTable() {
//   const navigate = useNavigate();
//   const [approvalRequestInventory, setApprovalRequestInventory] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("");
//   const [selectedDepartment, setSelectedDepartment] = useState("");
//   const [expandedRows, setExpandedRows] = useState({});
//   const [modalData, setModalData] = useState(null);

//   const rowsPerPage = 20;

//   useEffect(() => {
//     const fetchApprovalRequestInventory = async () => {
//       try {
//         const response = await Instance.get(
//           "/add/getApprovalRequestInventory",
//           {
//             withCredentials: true,
//           }
//         );
//         console.log("Fetched data:", response.data);
//         setApprovalRequestInventory(response.data);
//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching request inventory:", error);
//         setLoading(false);
//       }
//     };

//     fetchApprovalRequestInventory();
//   }, []);

//   const formatDate = (isoDate) => {
//     const date = new Date(isoDate);
//     const day = String(date.getDate()).padStart(2, "0");
//     const month = String(date.getMonth() + 1).padStart(2, "0");
//     const year = date.getFullYear();
//     return `${day}-${month}-${year}`;
//   };

//   const toggleRow = (key) => {
//     setExpandedRows((prev) => ({
//       ...prev,
//       [key]: !prev[key],
//     }));
//   };

//   // Prepare filtered and flattened items
//   const filteredInventory = approvalRequestInventory
//     .filter((cat) =>
//       selectedCategory ? cat.category === selectedCategory : true
//     )

//     .map((cat) => ({
//       ...cat,
//       approvalItems:
//         cat.approvalItems?.filter(
//           (approvalItem) =>
//             approvalItem?.itemName
//               ?.toLowerCase()
//               .includes(searchQuery.toLowerCase()) &&
//             (selectedDepartment
//               ? approvalItem?.department
//                   ?.toLowerCase()
//                   .includes(selectedDepartment.toLowerCase())
//               : true)
//         ) || [],
//     }))
//     .filter((cat) => cat.approvalItems.length > 0);

//   const allItems = filteredInventory.flatMap((cat, catIndex) =>
//     cat.approvalItems.map((approvalItem, itemIndex) => ({
//       ...approvalItem,
//       category: cat.category,
//       serial: `${catIndex + 1}.${approvalItem.itemName
//         ?.charAt(0)
//         .toUpperCase()}.${itemIndex + 1}`,
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
//     ...new Set(approvalRequestInventory.map((cat) => cat.category)),
//   ];

//   const openModal = (parent, item) => {
//     setModalData({
//       parent,
//       item,
//       requestQty: item.requestQty,
//       itemName: item.itemName,
//       declineReason: item.declineReason,
//     });
//   };

//   const closeModal = () => setModalData(null);

//   const handleApprove = async () => {
//     try {
//       const { parent, item } = modalData;

//       const formData = {
//         facultyName: parent.facultyName,
//         department: parent.department,
//         event: parent.event,
//         category: item.category,
//         itemName: item.itemName,
//         requestQty: item.requestQty,
//         requireDate: item.requireDate,
//         requestReason: item.requestReason,
//         returnStatus: item.returnStatus,
//       }
//       await Instance.post("/add/admin-approval-request-inventory", formData);
//       toast.success("Request approved and sent to Approval Schema.");
//       closeModal();
//     } catch (error) {
//       console.error("Error approving request:", error);
//       toast.error("Failed to approve request.");
//     }
//   };
//       };

//       const handleDecline = async () => {
//     try {
//       const { parent, item } = modalData;

//       const formData = {
//         facultyName: parent.facultyName,
//         department: parent.department,
//         event: parent.event,
//         category: item.category,
//         itemName: item.itemName,
//         requestQty: item.requestQty,
//         requireDate: item.requireDate,
//         requestReason: item.requestReason,
//         returnStatus: item.returnStatus,
//         declineReason: item.declineReason,
//       };

//       await Instance.post("/add/admin-approval-request-inventory", formData);
//       toast.success("Request approved and sent to Approval Schema.");
//       closeModal();
//     } catch (error) {
//       console.error("Error approving request:", error);
//       toast.error("Failed to approve request.");
//     }
//   };
  

//   return (
//     <div className="wrapper">
//       <ToastContainer />
//       <div className="mt-1 text-black p-10">
//         <h2 className="text-2xl font-bold text-center mb-3 text-blue-900">
//           Request Inventory Table
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

//           <input
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
//               <table className="w-full border-collapse border border-blue-900 mt-4 text-black">
//                 <thead>
//                   <tr className="bg-blue-800 text-white">
//                     <th className="border px-4 py-2">S.No</th>
//                     <th className="border px-4 py-2">Faculty</th>
//                     <th className="border px-4 py-2">Department</th>
//                     <th className="border px-4 py-2">Event</th>
//                     <th className="border px-4 py-2">Request Date</th>
//                     <th className="border px-4 py-2">Reason</th>
//                     <th className="border px-4 py-2">Items</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {approvalRequestInventory.length > 0 ? (
//                     approvalRequestInventory.map((category, catIdx) =>
//                       category.approvalItems.map((item, itemIdx) => {
//                         const rowKey = `${catIdx}-${itemIdx}`;
//                         return (
//                           <React.Fragment key={rowKey}>
//                             <tr className="text-center bg-blue-100">
//                               <td className="border border-blue-900 px-4 py-2">
//                                 {catIdx + 1}.{itemIdx + 1}
//                               </td>
//                               <td className="border border-blue-900 px-4 py-2">
//                                 {item.facultyName}
//                               </td>
//                               <td className="border border-blue-900 px-4 py-2">
//                                 {item.department}
//                               </td>
//                               <td className="border border-blue-900 px-4 py-2">
//                                 {item.event}
//                               </td>
//                               <td className="border border-blue-900 px-4 py-2">
//                                 {formatDate(item.requestDate)}
//                               </td>
//                               <td className="border border-blue-900 px-4 py-2">
//                                 {item.requestReason}
//                               </td>
//                               <td className="border border-blue-900 px-4 py-2">
//                                 <button
//                                   onClick={() => toggleRow(rowKey)}
//                                   className="bg-blue-500 text-white px-2 py-1 rounded"
//                                 >
//                                   {expandedRows[rowKey]
//                                     ? "Hide Items"
//                                     : "Show Items"}
//                                 </button>
//                               </td>
//                             </tr>

//                             {expandedRows[rowKey] && (
//                               <tr>
//                                 <td
//                                   colSpan="7"
//                                   className="bg-white border px-4 py-2"
//                                 >
//                                   <table className="w-full text-sm border border-gray-300">
//                                     <thead className="bg-blue-200">
//                                       <tr>
//                                         <th className="border px-2 py-1">
//                                           S.No
//                                         </th>
//                                         <th className="border px-2 py-1">
//                                           Category
//                                         </th>
//                                         <th className="border px-2 py-1">
//                                           Item Name
//                                         </th>
//                                         <th className="border px-2 py-1">
//                                           Qty
//                                         </th>
//                                         <th className="border px-2 py-1">
//                                           Required Date
//                                         </th>
//                                         <th className="border px-2 py-1">
//                                           Return Status
//                                         </th>
//                                         <th className="border px-2 py-1">
//                                           Actions
//                                         </th>
//                                       </tr>
//                                     </thead>
//                                     <tbody>
//                                       {item.approvalItems.map((subItem, i) => (
//                                         <tr key={i} className="text-center">
//                                           <td className="border px-2 py-1">
//                                             {i + 1}
//                                           </td>
//                                           <td className="border px-2 py-1">
//                                             {subItem.category}
//                                           </td>
//                                           <td className="border px-2 py-1">
//                                             {subItem.itemName}
//                                           </td>
//                                           <td className="border px-2 py-1">
//                                             {subItem.requestQty}
//                                           </td>
//                                           <td className="border px-2 py-1">
//                                             {formatDate(subItem.requireDate)}
//                                           </td>
//                                           <td className="border px-2 py-1">
//                                             {subItem.returnStatus}
//                                           </td>
//                                           <td className="border px-2 py-1">
//                                             <button
//                                               className="bg-green-600 text-white mx-1 px-3 py-1 rounded-md"
//                                                onClick={handleApprove}
//                                             >
//                                               Approve
//                                             </button>
//                                             <button className="bg-red-600 text-white mx-1 px-3 py-1 rounded-md"
//                                               onClick={() =>
//                                                 openModal(item, subItem)
//                                               }>
//                                               Decline
//                                             </button>
//                                           </td>
//                                         </tr>
//                                       ))}
//                                     </tbody>
//                                   </table>
//                                 </td>
//                               </tr>
//                             )}
//                           </React.Fragment>
//                         );
//                       })
//                     )
//                   ) : (
//                     <tr>
//                       <td colSpan="7" className="text-center py-4">
//                         No request inventory
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//               {/* Modal */}
//               {modalData && (
//                 <div className="fixed top-10 left-140 w-100 h-100 bg-blue-300 bg-opacity-30 flex items-center justify-center z-50">
//                   <div className="bg-white rounded-lg shadow-lg p-6 w-96">
//                     <h3 className="text-xl font-bold mb-4">
//                       Decline
//                     </h3>

//                     <label className="block mb-2 font-semibold">
//                       Item Name:
//                     </label>
//                     <input
//                       type="text"
//                       value={modalData.itemName}
//                       disabled
//                       className="border px-3 py-1 w-full rounded mb-4"
//                     />
//                     <label className="block mb-2 font-semibold">
//                       Request Qty:
//                     </label>
//                     <input
//                       type="number"
//                       value={modalData.requestQty}
//                       disabled
//                       className="border px-3 py-1 w-full rounded mb-4"
//               ></input>

//                     <label className="block mb-2 font-semibold">
//                       Decline Reason:
//                     </label>
//                     <textarea
//                       value={modalData.declineReason}
//                       onChange={(e) =>
//                         setModalData({
//                           ...modalData,
//                           declineReason: e.target.value,
//                         })
//                       }
//                       className="border px-3 py-1 w-full rounded mb-4"
//                     />

//                     <div className="flex justify-end gap-2">
//                       <button
//                         onClick={closeModal}
//                         className="bg-gray-400 text-white px-4 py-1 rounded"
//                       >
//                         Cancel
//                       </button>
//                       <button
//                         onClick={handleDecline}
//                         className="bg-red-600 text-white px-4 py-1 rounded"
//                       >
//                         Decline
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Pagination Controls */}
//             <div className="flex justify-center mt-6 flex-wrap gap-2">
//               {Array.from({ length: totalPages }, (_, i) => i + 1).map(
//                 (num) => (
//                   <button
//                     key={num}
//                     onClick={() => handlePageChange(num)}
//                     className={`px-4 py-2 rounded-md ${
//                       currentPage === num
//                         ? "bg-blue-700 text-white"
//                         : "bg-gray-200 text-black"
//                     }`}
//                   >
//                     {num}
//                   </button>
//                 )
//               )}
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );


// export default AdminRequestTable;


import React, { useState, useEffect } from "react";
import Instance from "../../AxiosConfig";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AdminRequestTable() {
  const [approvalRequestInventory, setApprovalRequestInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [expandedRows, setExpandedRows] = useState({});
  const [modalData, setModalData] = useState(null);

  useEffect(() => {
    const fetchApprovalRequestInventory = async () => {
      try {
        const response = await Instance.get("/add/getApprovalRequestInventory", {
          withCredentials: true,
        });
        setApprovalRequestInventory(response.data);
      } catch (error) {
        console.error("Error fetching request inventory:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApprovalRequestInventory();
  }, []);

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return `${String(date.getDate()).padStart(2, "0")}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${date.getFullYear()}`;
  };

  const toggleRow = (key) => {
    setExpandedRows((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const openModal = (parent, item, catIdx, itemIdx) => {
    setModalData({ parent, item, catIdx, itemIdx, declineReason: "" });
  };

  const closeModal = () => setModalData(null);

  const handleApprove = async (parent, item, catIdx, itemIdx) => {
    try {
      const formData = {
        facultyName: parent.facultyName,
        department: parent.department,
        event: parent.event,
        category: item.category,
        itemName: item.itemName,
        requestQty: item.requestQty,
        requireDate: item.requireDate,
        requestReason: item.requestReason,
        returnStatus: item.returnStatus,
      };

      await Instance.post("/add/admin-approval-request-inventory", formData);
      toast.success("Request approved.");

      removeItemFromTable(catIdx, itemIdx);
    } catch (error) {
      console.error("Approval failed:", error);
      toast.error("Failed to approve request.");
    }
  };

  const handleDecline = async () => {
    try {
      const { parent, item, declineReason, catIdx, itemIdx } = modalData;

      const formData = {
        facultyName: parent.facultyName,
        department: parent.department,
        event: parent.event,
        category: item.category,
        itemName: item.itemName,
        requestQty: item.requestQty,
        requireDate: item.requireDate,
        requestReason: item.requestReason,
        returnStatus: item.returnStatus,
        declineReason,
      };

      await Instance.post("/add/admin-decline-request-inventory", formData);
      toast.success("Request declined.");

      removeItemFromTable(catIdx, itemIdx);
      closeModal();
    } catch (error) {
      console.error("Decline failed:", error);
      toast.error("Failed to decline request.");
    }
  };

  const removeItemFromTable = (catIdx, itemIdx) => {
    setApprovalRequestInventory((prev) => {
      const newInventory = [...prev];
      const updatedItems = [...newInventory[catIdx].approvalItems];
      updatedItems.splice(itemIdx, 1);
      if (updatedItems.length === 0) {
        newInventory.splice(catIdx, 1);
      } else {
        newInventory[catIdx] = { ...newInventory[catIdx], approvalItems: updatedItems };
      }
      return newInventory;
    });
  };

  const uniqueCategories = [
    ...new Set(approvalRequestInventory.map((cat) => cat.category)),
  ];

  return (
    <div className="wrapper">
      <ToastContainer />
      <div className="p-10 text-black">
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-900">
          Request Inventory Table
        </h2>

        <div className="flex flex-col md:flex-row justify-center mb-4 gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border rounded px-4 py-2 text-black w-full md:w-1/6"
          >
            <option value="">All Categories</option>
            {uniqueCategories.map((cat, index) => (
              <option key={index} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Search by item name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border rounded px-4 py-2 text-black w-full md:w-2/5"
          />

          <input
            type="text"
            placeholder="Search by Department"
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="border rounded px-4 py-2 text-black w-full md:w-2/5"
          />
        </div>

        {loading ? (
          <p className="text-center">Loading...</p>
        ) : approvalRequestInventory.length === 0 ? (
          <p className="text-center">No request inventory found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-blue-900 text-black">
              <thead>
                <tr className="bg-blue-800 text-white">
                  <th className="border px-4 py-2">S.No</th>
                  <th className="border px-4 py-2">Faculty</th>
                  <th className="border px-4 py-2">Department</th>
                  <th className="border px-4 py-2">Event</th>
                  <th className="border px-4 py-2">Request Date</th>
                  <th className="border px-4 py-2">Reason</th>
                  <th className="border px-4 py-2">Items</th>
                </tr>
              </thead>
              <tbody>
                {approvalRequestInventory.map((category, catIdx) =>
                  category.approvalItems.map((item, itemIdx) => {
                    const rowKey = `${catIdx}-${itemIdx}`;
                    const matchesSearch =
                      (!selectedCategory || category.category === selectedCategory) &&
                      (!selectedDepartment ||
                        item.department
                          .toLowerCase()
                          .includes(selectedDepartment.toLowerCase())) &&
                      (!searchQuery ||
                        item.itemName
                          .toLowerCase()
                          .includes(searchQuery.toLowerCase()));

                    if (!matchesSearch) return null;

                    return (
                      <React.Fragment key={rowKey}>
                        <tr className="bg-blue-100 text-center">
                          <td className="border px-4 py-2">
                            {catIdx + 1}.{itemIdx + 1}
                          </td>
                          <td className="border px-4 py-2">{item.facultyName}</td>
                          <td className="border px-4 py-2">{item.department}</td>
                          <td className="border px-4 py-2">{item.event}</td>
                          <td className="border px-4 py-2">
                            {formatDate(item.requestDate)}
                          </td>
                          <td className="border px-4 py-2">{item.requestReason}</td>
                          <td className="border px-4 py-2">
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
                            <td colSpan="7" className="p-0">
                              <table className="w-full text-sm border border-gray-300">
                                <thead className="bg-blue-200">
                                  <tr>
                                    <th className="border px-2 py-1">Category</th>
                                    <th className="border px-2 py-1">Item Name</th>
                                    <th className="border px-2 py-1">Qty</th>
                                    <th className="border px-2 py-1">Required Date</th>
                                    <th className="border px-2 py-1">Return Status</th>
                                    <th className="border px-2 py-1">Actions</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr className="text-center">
                                    <td className="border px-2 py-1">{item.category}</td>
                                    <td className="border px-2 py-1">{item.itemName}</td>
                                    <td className="border px-2 py-1">{item.requestQty}</td>
                                    <td className="border px-2 py-1">
                                      {formatDate(item.requireDate)}
                                    </td>
                                    <td className="border px-2 py-1">{item.returnStatus}</td>
                                    <td className="border px-2 py-1">
                                      <button
                                        className="bg-green-600 text-white mx-1 px-3 py-1 rounded"
                                        onClick={() =>
                                          handleApprove(category, item, catIdx, itemIdx)
                                        }
                                      >
                                        Approve
                                      </button>
                                      <button
                                        className="bg-red-600 text-white mx-1 px-3 py-1 rounded"
                                        onClick={() =>
                                          openModal(category, item, catIdx, itemIdx)
                                        }
                                      >
                                        Decline
                                      </button>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Decline Modal */}
        {modalData && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-96">
              <h3 className="text-xl font-bold mb-4">Decline Request</h3>

              <label className="block font-semibold mb-1">Item Name:</label>
              <input
                type="text"
                value={modalData.item.itemName}
                disabled
                className="border px-3 py-1 w-full mb-2 rounded"
              />

              <label className="block font-semibold mb-1">Request Qty:</label>
              <input
                type="number"
                value={modalData.item.requestQty}
                disabled
                className="border px-3 py-1 w-full mb-2 rounded"
              />

              <label className="block font-semibold mb-1">Decline Reason:</label>
              <textarea
                value={modalData.declineReason}
                onChange={(e) =>
                  setModalData((prev) => ({ ...prev, declineReason: e.target.value }))
                }
                className="border px-3 py-1 w-full rounded mb-4"
              />

              <div className="flex justify-end gap-2">
                <button
                  onClick={closeModal}
                  className="bg-gray-400 text-white px-4 py-1 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDecline}
                  className="bg-red-600 text-white px-4 py-1 rounded"
                >
                  Decline
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminRequestTable;
