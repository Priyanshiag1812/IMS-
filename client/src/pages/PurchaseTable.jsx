// import  { useState, useEffect } from "react";
// import Instance from "../AxiosConfig";
// import { useLocation } from "react-router-dom";

// function PurchaseTable() {
//   const [purchasedInventory, setPurchasedInventory] = useState([]);
//   const location = useLocation();
//   const { category, name, qty } = location.state || {};

//   useEffect(() => {
//     const fetchPurchasedInventory = async () => {
//       try {
//         const response = await Instance.get("/add/getPurchaseInventory");
//         setPurchasedInventory(response.data);
//       } catch (error) {
//         console.error("Error fetching Purchased inventory:", error);
//       }
//     };

//     fetchPurchasedInventory();
//   }, []);

//   // Filter for selected item name
//   const filteredInventory = purchasedInventory
//     .map((category) => ({
//       ...category,
//       items: category.items.filter((item) => (name ? item.name === name : true)),
//     }))
//     .filter((category) => category.items.length > 0);

//   // Format date from ISO to dd-mm-yyyy
//   const formatDate = (isoDate) => {
//     const date = new Date(isoDate);
//     const day = String(date.getDate()).padStart(2, "0");
//     const month = String(date.getMonth() + 1).padStart(2, "0");
//     const year = date.getFullYear();
//     return `${day}-${month}-${year}`;
//   };

//   return (
//     <div className="wrapper">
//       <div className="main flex items-start justify-center"></div>
//       <div className="mt-1 text-black p-10">
//         <h2 className="text-3xl font-bold text-center text-blue-900">
//           Purchased Details Table
//         </h2>
//         <br />
//         <div className="flex justify-between items-center">
//           <div><span className="font-bold text-2xl">Item Name:</span> <span className=" font-bold text-2xl text-blue-700">{name}</span></div>

//           <div><span className="font-bold text-2xl">Category:</span> <span className=" font-bold text-2xl text-blue-700">{category}</span></div>
         
//           <div><span className="font-bold text-2xl">Current Qty:</span> <span className=" font-bold text-2xl text-blue-700">{qty}</span></div>
//         </div>

//         <table className="w-full border-collapse border border-blue-900 mt-4 text-black">
//           <thead>
//             <tr className="bg-blue-800">
//               <th className="border text-white px-4 py-2">S.No</th>
//               <th className="border text-white px-4 py-2">Bill No</th>
//               <th className="border text-white px-4 py-2">Party Name</th>
//               <th className="border text-white px-4 py-2">Bill Date</th>
//               <th className="border text-white px-4 py-2">Bill Amount</th>
//               <th className="border text-white px-4 py-2">Purchase Qty</th>
//               <th className="border text-white px-4 py-2">Qty</th>
//               <th className="border text-white px-4 py-2">Price Per Unit (₹)</th>
//               <th className="border text-white px-4 py-2">Bill Photo</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredInventory.length > 0 ? (
//               filteredInventory.map((category, categoryIndex) =>
//                 category.items.map((item, itemIndex) =>
//                   [...item.purchaseItems]
//                     .sort((a, b) => new Date(b.billDate) - new Date(a.billDate)) // DESC order
//                     .map((purchaseItem, purchaseItemIndex) => (
//                       <tr
//                         key={`${categoryIndex}-${itemIndex}-${purchaseItemIndex}`}
//                       >
//                         <td className="border border-blue-900 px-4 py-2">
//                           {purchaseItemIndex + 1}
//                         </td>
//                         <td className="border border-blue-900 px-4 py-2">
//                           {purchaseItem.billNo}
//                         </td>
//                         <td className="border border-blue-900 px-4 py-2">
//                           {purchaseItem.partyName}
//                         </td>
//                         <td className="border border-blue-900 px-4 py-2">
//                           {formatDate(purchaseItem.billDate)}
//                         </td>
//                         <td className="border border-blue-900 px-4 py-2">
//                           ₹{purchaseItem.billAmount}
//                         </td>
//                         <td className="border border-blue-900 px-4 py-2">
//                           {purchaseItem.purchaseQty}
//                         </td>
//                         <td className="border border-blue-900 px-4 py-2">
//                           {purchaseItem.qty}
//                         </td>
//                         <td className="border border-blue-900 px-4 py-2">
//                           ₹{purchaseItem.pricePerUnit}
//                         </td>

//                          <td className="border border-blue-900 px-4 py-2">
//                            <button
//                           className="bg-blue-900 text-white mx-2 px-5 py-2 rounded-md"
//                           onClick={() =>
//                           purchaseItem.bill
//                           }
//                         >
//                           View
//                         </button>
//                         </td>
//                       </tr>
//                     ))
//                 )
//               )
//             ) : (
//               <tr>
//                 <td colSpan="8" className="text-center py-4">
//                   No purchased inventory found for this item.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

// export default PurchaseTable;





import { useState, useEffect } from "react";
import Instance from "../AxiosConfig";
import { useLocation } from "react-router-dom";

function PurchaseTable() {
  const [purchasedInventory, setPurchasedInventory] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const location = useLocation();
  const { category, name, qty } = location.state || {};

  useEffect(() => {
    const fetchPurchasedInventory = async () => {
      try {
        const response = await Instance.get("/add/getPurchaseInventory");
        setPurchasedInventory(response.data);
      } catch (error) {
        console.error("Error fetching Purchased inventory:", error);
      }
    };

    fetchPurchasedInventory();
  }, []);

  const filteredInventory = purchasedInventory
    .map((category) => ({
      ...category,
      items: category.items.filter((item) => (name ? item.name === name : true)),
    }))
    .filter((category) => category.items.length > 0);

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
      <div className="mt-1 text-black p-10">
        <h2 className="text-3xl font-bold text-center text-blue-900">
          Purchased Details Table
        </h2>
        <br />
        <div className="flex justify-between items-center">
          <div>
            <span className="font-bold text-2xl">Item Name:</span>{" "}
            <span className=" font-bold text-2xl text-blue-700">{name}</span>
          </div>
          <div>
            <span className="font-bold text-2xl">Category:</span>{" "}
            <span className=" font-bold text-2xl text-blue-700">{category}</span>
          </div>
          <div>
            <span className="font-bold text-2xl">Current Qty:</span>{" "}
            <span className=" font-bold text-2xl text-blue-700">{qty}</span>
          </div>
        </div>

        <table className="w-full border-collapse border border-blue-900 mt-4 text-black">
          <thead>
            <tr className="bg-blue-800">
              <th className="border text-white px-4 py-2">S.No</th>
              <th className="border text-white px-4 py-2">Bill No</th>
              <th className="border text-white px-4 py-2">Party Name</th>
              <th className="border text-white px-4 py-2">Bill Date</th>
              <th className="border text-white px-4 py-2">Bill Amount</th>
              <th className="border text-white px-4 py-2">Purchase Qty</th>
              <th className="border text-white px-4 py-2">Qty</th>
              <th className="border text-white px-4 py-2">Price Per Unit (₹)</th>
              <th className="border text-white px-4 py-2">Bill Photo</th>
            </tr>
          </thead>
          <tbody>
            {filteredInventory.length > 0 ? (
              filteredInventory.map((category, categoryIndex) =>
                category.items.map((item, itemIndex) =>
                  [...item.purchaseItems]
                    .sort((a, b) => new Date(b.billDate) - new Date(a.billDate))
                    .map((purchaseItem, purchaseItemIndex) => (
                      <tr
                        key={`${categoryIndex}-${itemIndex}-${purchaseItemIndex}`}
                      >
                        <td className="border border-blue-900 px-4 py-2">
                          {purchaseItemIndex + 1}
                        </td>
                        <td className="border border-blue-900 px-4 py-2">
                          {purchaseItem.billNo}
                        </td>
                        <td className="border border-blue-900 px-4 py-2">
                          {purchaseItem.partyName}
                        </td>
                        <td className="border border-blue-900 px-4 py-2">
                          {formatDate(purchaseItem.billDate)}
                        </td>
                        <td className="border border-blue-900 px-4 py-2">
                          ₹{purchaseItem.billAmount}
                        </td>
                        <td className="border border-blue-900 px-4 py-2">
                          {purchaseItem.purchaseQty}
                        </td>
                        <td className="border border-blue-900 px-4 py-2">
                          {purchaseItem.qty}
                        </td>
                        <td className="border border-blue-900 px-4 py-2">
                          ₹{purchaseItem.pricePerUnit}
                        </td>
                        <td className="border border-blue-900 px-4 py-2">
                          
                          <button
                            className="bg-blue-900 text-white mx-2 px-5 py-2 rounded-md"
                           
                            onClick={() => {
                              console.log(`uploads/${purchaseItem.bill}`);
                              setSelectedImage(`uploads/${purchaseItem.bill}`)}
                              }
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))
                )
              )
            ) : (
              <tr>
                <td colSpan="9" className="text-center py-4">
                  No purchased inventory found for this item.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed mx-96 my-44 h-48 w-48 inset-0 bg-yellow bg-opacity-20 flex justify-end items-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg relative">
            <button
              className="absolute top-2 right-2 text-red-600 font-bold text-xl"
              onClick={() => setSelectedImage(null)}
            >
              ×
            </button>
            <img
              src={selectedImage}
              alt="Bill"
              className="max-h-[80vh] max-w-[80vw]"
              onError={() => alert("Image not found or path incorrect")}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default PurchaseTable;
