// import React, { useState, useEffect } from "react";
// import Instance from "../../AxiosConfig";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";


// function RequestInventoryTable() {
//   const [viewRequestInventory, setViewRequestInventory] = useState([]);
//   const [expandedRows, setExpandedRows] = useState({});
//   const [modalData, setModalData] = useState(null);

//   useEffect(() => {
//     const fetchViewRequestInventory = async () => {
//       try {
//         const response = await Instance.get("/add/getViewRequestInventory");
//         setViewRequestInventory(response.data);
//       } catch (error) {
//         console.error("Error fetching request inventory:", error);
//       }
//     };

//     fetchViewRequestInventory();
//   }, []);

//   const toggleRow = (key) => {
//     setExpandedRows((prev) => ({
//       ...prev,
//       [key]: !prev[key],
//     }));
//   };

//   const formatDate = (isoDate) => {
//     const date = new Date(isoDate);
//     return `${date.getDate().toString().padStart(2, "0")}-${(date.getMonth() + 1)
//       .toString()
//       .padStart(2, "0")}-${date.getFullYear()}`;
//   };

//   const openModal = (parent, item) => {
//     setModalData({
//       parent,
//       item,
//       requestQty:item.requestQty,
//       itemName:item.itemName,
//       modifiedQty: item.modifiedQty ,
//       modifiedReason: item.modifiedReason,
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
//         modifiedReason:item.modifiedReason,     
//         modifiedQty:item.modifiedQty,

//       };

//       await Instance.post("/add/approval-request-inventory", formData);
//       toast.success("Request approved and sent to Approval Schema.");
//       closeModal();
//     } catch (error) {
//       console.error("Error approving request:", error);
//       toast.error("Failed to approve request.");
//     }
//   };

//   return (
//     <div className="wrapper">
//          <ToastContainer />
//       <div className="mt-10 text-black p-10">
//         <h2 className="text-3xl font-bold text-center text-blue-900">
//           View Request Inventory Table
//         </h2>

//         <table className="w-full border-collapse border border-blue-900 mt-4 text-black">
//           <thead>
//             <tr className="bg-blue-800 text-white">
//               <th className="border px-4 py-2">S.No</th>
//               <th className="border px-4 py-2">Faculty</th>
//               <th className="border px-4 py-2">Department</th>
//               <th className="border px-4 py-2">Event</th>
//               <th className="border px-4 py-2">Request Date</th>
//               <th className="border px-4 py-2">Reason</th>
//               <th className="border px-4 py-2">Items</th>
//             </tr>
//           </thead>
//           <tbody>
//             {viewRequestInventory.length > 0 ? (
//               viewRequestInventory.map((category, catIdx) =>
//                 category.multiRequestItems.map((item, itemIdx) => {
//                   const rowKey = `${catIdx}-${itemIdx}`;
//                   return (
//                     <React.Fragment key={rowKey}>
//                       <tr className="text-center bg-blue-100">
//                         <td className="border border-blue-900 px-4 py-2">
//                           {catIdx + 1}.{itemIdx + 1}
//                         </td>
//                         <td className="border border-blue-900 px-4 py-2">
//                           {item.facultyName}
//                         </td>
//                         <td className="border border-blue-900 px-4 py-2">
//                           {item.department}
//                         </td>
//                         <td className="border border-blue-900 px-4 py-2">
//                           {item.event}
//                         </td>
//                         <td className="border border-blue-900 px-4 py-2">
//                           {formatDate(item.requestDate)}
//                         </td>
//                         <td className="border border-blue-900 px-4 py-2">
//                           {item.requestReason}
//                         </td>
//                         <td className="border border-blue-900 px-4 py-2">
//                           <button
//                             onClick={() => toggleRow(rowKey)}
//                             className="bg-blue-500 text-white px-2 py-1 rounded"
//                           >
//                             {expandedRows[rowKey] ? "Hide Items" : "Show Items"}
//                           </button>
//                         </td>
//                       </tr>

//                       {expandedRows[rowKey] && (
//                         <tr>
//                           <td colSpan="7" className="bg-white border px-4 py-2">
//                             <table className="w-full text-sm border border-gray-300">
//                               <thead className="bg-blue-200">
//                                 <tr>
//                                   <th className="border px-2 py-1">S.No</th>
//                                   <th className="border px-2 py-1">Category</th>
//                                   <th className="border px-2 py-1">Item Name</th>
//                                   <th className="border px-2 py-1">Qty</th>
//                                   <th className="border px-2 py-1">Required Date</th>
//                                   <th className="border px-2 py-1">Return Status</th>
//                                   <th className="border px-2 py-1">Actions</th>
//                                 </tr>
//                               </thead>
//                               <tbody>
//                                 {item.requestItems.map((subItem, i) => (
//                                   <tr key={i} className="text-center">
//                                     <td className="border px-2 py-1">{i + 1}</td>
//                                     <td className="border px-2 py-1">{subItem.category}</td>
//                                     <td className="border px-2 py-1">{subItem.itemName}</td>
//                                     <td className="border px-2 py-1">{subItem.requestQty}</td>
//                                     <td className="border px-2 py-1">{formatDate(subItem.requireDate)}</td>
//                                     <td className="border px-2 py-1">{subItem.returnStatus}</td>
//                                     <td className="border px-2 py-1">
//                                       <button
//                                         className="bg-yellow-500 text-white mx-1 px-3 py-1 rounded-md"
//                                         onClick={() => openModal(item, subItem)}
//                                       >
//                                         Modify
//                                       </button>
//                                       <button
//                                         className="bg-green-600 text-white mx-1 px-3 py-1 rounded-md"
//                                         onClick={() => openModal(item, subItem)}
//                                       >
//                                         Approve
//                                       </button>
//                                       <button className="bg-red-600 text-white mx-1 px-3 py-1 rounded-md">
//                                         Decline
//                                       </button>
//                                     </td>
//                                   </tr>
//                                 ))}
//                               </tbody>
//                             </table>
//                           </td>
//                         </tr>
//                       )}
//                     </React.Fragment>
//                   );
//                 })
//               )
//             ) : (
//               <tr>
//                 <td colSpan="7" className="text-center py-4">
//                   No request inventory
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>

//         Modal
//         {modalData && (
//           <div className="fixed top-10 left-140 w-100 h-100 bg-blue-300 bg-opacity-30 flex items-center justify-center z-50">
//             <div className="bg-white rounded-lg shadow-lg p-6 w-96">
//               <h3 className="text-xl font-bold mb-4">Modify & Approved</h3>


//  <label className="block mb-2 font-semibold">Item Name:</label>
//               <input
//                 type="text"
//                 value={modalData.itemName}
//                 // onChange={(e) =>
//                 //   setModalData({ ...modalData, requestQty: e.target.value })
//                 // }
//                 disabled
//                 className="border px-3 py-1 w-full rounded mb-4"
//               />
//                <label className="block mb-2 font-semibold">Request Qty:</label>
//               <input
//                 type="number"
//                 // min={1}
//                 value={modalData.requestQty}
//                 // onChange={(e) =>
//                 //   setModalData({ ...modalData, requestQty: e.target.value })
//                 // }
//                 disabled
//                 className="border px-3 py-1 w-full rounded mb-4"
//               />
//               <label className="block mb-2 font-semibold">Modified Qty:</label>
//               <input
//                 type="number"
//                 min={1}
//                 value={modalData.modifiedQty}
//                 onChange={(e) =>
//                   setModalData({ ...modalData, modifiedQty: e.target.value })
//                 }
//                 className="border px-3 py-1 w-full rounded mb-4"
//               />



 


//               <label className="block mb-2 font-semibold">Modified Reason:</label>
//               <textarea
//                 value={modalData.modifiedReason}
//                 onChange={(e) =>
//                   setModalData({ ...modalData, modifiedReason: e.target.value })
//                 }
//                 className="border px-3 py-1 w-full rounded mb-4"
//               />

//               <div className="flex justify-end gap-2">
//                 <button
//                   onClick={closeModal}
//                   className="bg-gray-400 text-white px-4 py-1 rounded"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleApprove}
//                   className="bg-green-600 text-white px-4 py-1 rounded"
//                 >
//                   Approve
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default RequestInventoryTable;





// At the top, all your imports remain the same
import React, { useState, useEffect } from "react";
import Instance from "../../AxiosConfig";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AdminRequestTable() {
  const [approvalRequests, setApprovalRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalData, setModalData] = useState(null);

  const fetchApprovalRequests = async () => {
    try {
      const res = await Instance.get("/add/getApprovalRequestInventory", {
        withCredentials: true,
      });
      setApprovalRequests(res.data || []);
    } catch (error) {
      toast.error("Failed to fetch approval requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovalRequests();
  }, []);

  const formatDate = (date) => new Date(date).toLocaleDateString();

  const openModal = (parent, item) => {
    setModalData({
      parent,
      item,
      declineReason: "",
    });
  };

  const closeModal = () => setModalData(null);

  const handleApprove = async (requestId) => {
    try {
      await Instance.post("/add/admin-approval-request-inventory", {
        requestId,
        adminAction: {
          status: "Approved",
          // adminName: "Admin Name", // Optional: Replace with dynamic admin user
          approvalDate: new Date(),
        },
      });
      toast.success("Item approved successfully");
      fetchApprovalRequests(); // Refresh list
    } catch (error) {
      toast.error("Failed to approve item");
    }
  };

  const handleDecline = async () => {
    const { item, declineReason } = modalData;
    try {
      await Instance.post("/add/admin-approval-request-inventory", {
        requestId: item._id,
        adminAction: {
          status: "Declined",
          // adminName: "Admin Name", // Optional
          approvalDate: new Date(),
          remarks: declineReason,
        },
      });
      toast.success("Item declined successfully");
      closeModal();
      fetchApprovalRequests();
    } catch (error) {
      toast.error("Failed to decline item");
    }
  };

  return (
    <div className="p-10 text-black">
      <ToastContainer />
      <h2 className="text-2xl font-bold text-center mb-6 text-blue-900">
        Admin Approval Table
      </h2>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-blue-800">
            <thead className="bg-blue-900 text-white">
              <tr>
                <th className="border px-4 py-2">S.No</th>
                <th className="border px-4 py-2">Faculty</th>
                <th className="border px-4 py-2">Department</th>
                <th className="border px-4 py-2">Item</th>
                <th className="border px-4 py-2">Qty</th>
                <th className="border px-4 py-2">Req. Date</th>
                <th className="border px-4 py-2">Reason</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {approvalItems.length > 0 ? (
                approvalItems.map((item, index) => (
                  <tr key={req._id} className="text-center bg-blue-50">
                    <td className="border px-4 py-2">{index + 1}</td>
                    <td className="border px-4 py-2">{item.facultyName}</td>
                    <td className="border px-4 py-2">{item.department}</td>
                    <td className="border px-4 py-2">{item.itemName}</td>
                    <td className="border px-4 py-2">{item.requestQty}</td>
                    <td className="border px-4 py-2">{formatDate(req.requireDate)}</td>
                    <td className="border px-4 py-2">{req.requestReason}</td>
                    <td className="border px-4 py-2">
                      <button
                        onClick={() => handleApprove(req._id)}
                        className="bg-green-600 text-white px-3 py-1 rounded-md mx-1"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => openModal(null, req)}
                        className="bg-red-600 text-white px-3 py-1 rounded-md mx-1"
                      >
                        Decline
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center py-4">
                    No pending requests.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Decline Modal */}
      {modalData && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-bold mb-4">Decline Request</h3>
            <label className="block mb-2">Reason:</label>
            <textarea
              value={modalData.declineReason}
              onChange={(e) =>
                setModalData((prev) => ({
                  ...prev,
                  declineReason: e.target.value,
                }))
              }
              className="w-full border rounded px-3 py-2 mb-4"
              rows="4"
              placeholder="Enter reason for declining"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDecline}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                Decline
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminRequestTable;

