import inventoryEntries from "../models/inventoryEntries.js";
import removedInventory from "../models/removedInventory.js";
import { uploadToCloudinary } from "../services/Cloudinary.js";

//getInventory Table
export const getInventory = async (req, res) => {
  try {
    const inventoryList = await inventoryEntries.find();
    res.status(200).json(inventoryList);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// getPurchaseInventory //
export const getPurchaseInventory = async (req, res) => {
  try {
    const purchaseInventory = await inventoryEntries.find(
      {},
      "category items purchaseItems"
    );
    if (!purchaseInventory || purchaseInventory.length === 0) {
      return res.status(404).json({ message: "No purchase inventory found." });
    }

    res.status(200).json(purchaseInventory);
  } catch (error) {
    console.error("Error fetching purchase inventory:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const purchaseInventory = async (req, res) => {
  try {
    const {
      category,
      itemName,
      billNo,
      partyName,
      billDate,
      billAmount,
      purchaseQty,
      pricePerUnit,
      gst,
      threshold,
      bill,
    } = req.body;

    let billUrl = null;

    if (req.file) {
      try {
        billUrl = await uploadToCloudinary(req);
      } catch (uploadError) {
        console.error("Cloudinary upload error : , uploadError");
      }
    }

    // Find or create the category
    let inventory = await inventoryEntries.findOne({ category });

    if (!inventory) {
      return res.status(404).json({
        message: "Category not found. Please create the category first.",
      });
    }
    // Find the item
    let item = inventory.items.find((i) => i.name === itemName);

    if (item) {
      // Update existing item
      const newQty = item.qty + parseInt(purchaseQty);
      const status =
        newQty === 0
          ? "Out of Stock"
          : newQty < item.threshold
          ? "Low Stock"
          : "Available";
      const purchaseItem = {
        billNo,
        partyName,
        billDate,
        billAmount,
        purchaseQty,
        qty: newQty,
        pricePerUnit,
        gst,
        status,
        bill: billUrl,
      };

      item.qty = newQty;
      item.status = status;
      item.purchaseItems = item.purchaseItems || [];
      item.purchaseItems.push(purchaseItem);
    } else {
      // Add new item
      const newItem = {
        name: itemName,
        qty: parseInt(purchaseQty),
        threshold: parseInt(threshold),
        status:
          parseInt(purchaseQty) === 0
            ? "Out of Stock"
            : parseInt(purchaseQty) < parseInt(threshold)
            ? "Low Stock"
            : "Available",
        pricePerUnit: parseFloat(pricePerUnit),
        purchaseItems: [
          {
            billNo,
            partyName,
            billDate,
            billAmount,
            purchaseQty,
            gst,
            qty: parseInt(purchaseQty),
            pricePerUnit,
            status:
              parseInt(purchaseQty) === 0
                ? "Out of Stock"
                : parseInt(purchaseQty) < parseInt(threshold)
                ? "Low Stock"
                : "Available",
            bill: billUrl,
          },
        ],
      };

      inventory.items.push(newItem);
    }
    await inventory.save();

    res.status(200).json({ message: "Purchase added successfully" });
  } catch (error) {
    console.error("Error in purchaseInventory:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// export const requestInventoryFaculty = async (req, res) => {
//   try {
//     const {
//       facultyName,
//       department,
//       requestReason,
//       event,
//       requestItems
//     } = req.body.formData;

//     if (
//       !event ||
//       !facultyName ||
//       !department ||
//       !requestReason ||
//       !requestItems ||
//       requestItems.length === 0 ||
//       requestItems.some(
//         (requestItem) =>
//          !requestItem.category &&
//           !requestItem.itemName &&
//           !requestItem.requestQty &&
//           !requestItem.returnStatus &&
//           !requestItem.requireDate
//       )
//     ) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     // 🔁 Loop through each requestItem and save to DB
//     for (const requestItem of requestItems) {
//       const { category, itemName, requestQty, returnStatus, requireDate } = requestItem;

//       let requestInventory = await inventoryEntries.findOne({ category });
//       if (!requestInventory)
        
        
//         {


// // const requestInventory = await inventoryEntries.find(
// //       { "multiRequestItems.0": { $exists: true } },
// //       "category multiRequestItems"
// //     );


//         // If the category does not exist, create a new one
//         // requestInventory = await inventoryEntries({
//         //   category,
//         //    multiRequestItems: {
//         //     facultyName,
//         //     department,
//         //     event,
//         //     requestDate: Date.now(),
//         //     status: "Pending",
//         //     requestReason,
//         //     requestItems: [
//         //       {
//         //         category,
//         //         itemName,
//         //         requestQty,
//         //         returnStatus,
//         //         requireDate,
//         //       },
//         //     ],
//         //   }
          
//         // });
//         // await requestInventory.save();
//       }


//     // if (!requestInventory) {
//     //   return res.status(404).json({
//     //     message: "Category not found. Please create the category first.",
//     //   });
//     // }

//       // const requestInventory = await inventoryEntries.findOne({ category });

//       // if (!requestInventory) {
//       //   return res.status(404).json({ message: `Category not found for category: ${category}` });
//       // }

//       requestInventory.multiRequestItems.push({
//         facultyName,
//         department,
//         event,
//         requestDate: Date.now(),
//         status: "Pending",
//         requestReason,
//         requestItems: [{ category, itemName, requestQty, returnStatus, requireDate }],
//       });

//       await requestInventory.save();
//     }

//     res.status(200).json({ message: "Item requests submitted successfully!" });

//   } catch (error) {
//     console.error("Error requesting inventory:", error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

export const requestInventoryFaculty = async (req, res) => {
  try {
    const {
      facultyName,
      department,
      requestReason,
      event,
      requestItems
    } = req.body.formData;

    //  Validate input
    if (
      !event ||
      !facultyName ||
      !department ||
      !requestReason ||
      !requestItems ||
      requestItems.length === 0 ||
      requestItems.some(
        (item) =>
          !item.category ||
          !item.itemName ||
          !item.requestQty ||
          !item.returnStatus ||
          !item.requireDate
      )
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    //  Group items by category
    const categoryMap = {};

    for (const item of requestItems) {
      const { category } = item;

      if (!categoryMap[category]) {
        categoryMap[category] = [];
      }
      categoryMap[category].push(item);
    }

    // For each category, push the full grouped request
    for (const category in categoryMap) {
      let requestInventory = await inventoryEntries.findOne({ category });

      if (!requestInventory) {
        return res.status(404).json({
          message: `Category not found: ${category}`
        });
      }

      requestInventory.multiRequestItems.push({
        facultyName,
        department,
        event,
        requestDate: Date.now(),
        status: "Pending",
        requestReason,
        requestItems: categoryMap[category], // all items for this category
      });

      await requestInventory.save();
    }

    res.status(200).json({ message: "Item requests submitted successfully!" });

  } catch (error) {
    console.error("Error requesting inventory:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// getViewRequestInventory
export const getViewRequestInventory = async (req, res) => {
  try {
    const viewRequestInventory = await inventoryEntries.find(
      { "multiRequestItems.0": { $exists: true } },
      "category multiRequestItems"
    );
    if (!viewRequestInventory || viewRequestInventory.length === 0) {
      return res.status(404).json({ message: "No request inventory found." });
    }
    res.status(200).json(viewRequestInventory);
  } catch (error) {
    console.error("Error fetching request inventory:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//return inventory form faculty
export const returnInventoryFaculty = async (req, res) => {
  try {
    const { category, itemName, returnQty, issuedQty, issuedDate, returnDate } =
      req.body;

    if (
      !category ||
      !itemName ||
      !returnDate ||
      !issuedDate ||
      !issuedQty == undefined ||
      !returnQty == undefined
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const returnInventory = await inventoryEntries.findOne({ category });

    if (!returnInventory) {
      return res.status(404).json({ message: "Category not found" });
    }

    const item = returnInventory.items.find((i) => i.name === itemName);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    if (item.issuedQty < returnQty) {
      return res
        .status(400)
        .json({ message: "Issued qty is less than return Qty" });
    }

    returnInventory.issuedItems.push({
      itemName,
      returnDate,
      issuedDate,
      issuedQty,
      returnedDate: Date.now(), // Assuming you want to set the current date
      returnQty,
    });

    await returnInventory.save();

    res
      .status(200)
      .json({ message: "Item return successfully!", returnInventory });
  } catch (error) {
    console.error("Error returning inventory:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// getReturnRequestInventory
export const getReturnRequestInventory = async (req, res) => {
  try {
    const returnRequestInventory = await inventoryEntries.find(
      { "issuedItems.0": { $exists: true } },
      "category issuedItems"
    );
    if (!returnRequestInventory || returnRequestInventory.length === 0) {
      return res.status(404).json({ message: "No return inventory found." });
    }
    res.status(200).json(returnRequestInventory);
  } catch (error) {
    console.error("Error fetching return inventory:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update Inventory Item
export const updatedItem = async (req, res) => {
  try {
    const {
      category,
      itemName,
      qty,
      threshold,
      reason,
      updatedQty,
      updatedThreshold,
    } = req.body;

    if (
      !category ||
      !itemName ||
      qty === undefined ||
      updatedQty === undefined ||
      threshold === undefined ||
      updatedThreshold === undefined ||
      !reason
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    let inventory = await inventoryEntries.findOne({ category });

    if (!inventory) {
      return res.status(404).json({ message: "Category not found" });
    }

    let item = inventory.items.find((i) => i.name === itemName);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    const updatedItem = {
      itemName,
      qty: qty,
      threshold: threshold,
      updatedQty,
      updatedThreshold,
      reason,
    };
    // Deduct the issued quantity from stock
    item.qty = updatedQty;
    item.threshold = updatedThreshold;
    // Add update record
    item.updatedItems = item.updatedItems || [];
    item.updatedItems.push(updatedItem);

    // Update item status
    item.status =
      item.qty === 0
        ? "Out of Stock"
        : qty < item.threshold
        ? "Low Stock"
        : "Available";

    await inventory.save();

    res.status(200).json({ message: "Item updated successfully!", inventory });
  } catch (error) {
    console.error("Error updating inventory:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
// update inventory Table
export const getUpdatedInventory = async (req, res) => {
  try {
    const updatedInventory = await inventoryEntries.find(
      {},
      "category items updatedItems"
    );

    if (!updatedInventory || updatedInventory.length === 0) {
      return res.status(404).json({ message: "No updated inventory found." });
    }

    res.status(200).json(updatedInventory);
  } catch (error) {
    console.error("Error fetching updated inventory:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//restock inventory
export const restockInventory = async (req, res) => {
  try {
    const {
      category,
      itemName,
      billNo,
      partyName,
      billDate,
      billAmount,
      purchaseQty,
      pricePerUnit,
      gst,
      bill,
    } = req.body;

    if (
      !category ||
      !itemName ||
      purchaseQty === undefined ||
      !partyName ||
      billAmount === undefined ||
      gst === undefined ||
      pricePerUnit === undefined ||
      billNo === undefined ||
      !billDate ||
      !bill
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    let billUrl = null;

    if (req.file) {
      try {
        let billUrl = await uploadToCloudinary(req);
      } catch (uploadError) {
        console.error("Cloudinary upload error : , uploadError");
      }
    }

    // Find or create the category
    let inventory = await inventoryEntries.findOne({ category });

    if (!inventory) {
      return res.status(404).json({
        message: "Category not found. Please create the category first.",
      });
    }
    // Find the item
    let item = inventory.items.find((i) => i.name === itemName);

    if (item) {
      // Update existing item
      const newQty = item.qty + parseInt(purchaseQty);
      const status =
        newQty === 0
          ? "Out of Stock"
          : newQty < item.threshold
          ? "Low Stock"
          : "Available";
      const purchaseItem = {
        billNo,
        partyName,
        billDate,
        billAmount,
        purchaseQty,
        qty: newQty,
        pricePerUnit,
        status,
        gst,
        bill: billUrl,
      };

      item.qty = newQty;
      item.status = status;
      item.purchaseItems = item.purchaseItems || [];
      item.purchaseItems.push(purchaseItem);
    }

    await inventory.save();

    res.status(200).json({ message: "Restocked added successfully" });
  } catch (error) {
    console.error("Error in restock Inventory:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// issueInventroy
export const issueInventory = async (req, res) => {
  try {
    const {
      category,
      itemName,
      issuedToDept,
      issuedToFaculty,
      issuedQty,
      returnStatus,
      event,
    } = req.body;

    if (
      !category ||
      !itemName ||
      !issuedToDept ||
      !issuedToFaculty ||
      issuedQty === undefined ||
      !returnStatus ||
      !event
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const inventory = await inventoryEntries.findOne({ category });

    if (!inventory) {
      return res.status(404).json({ message: "Category not found" });
    }

    const item = inventory.items.find((i) => i.name === itemName);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    if (item.qty < issuedQty) {
      return res.status(400).json({ message: "Not enough stock available" });
    }

    item.qty -= issuedQty;

    inventory.issuedItems.push({
      itemName,
      issuedToDept,
      issuedToFaculty,
      issuedQty,
      returnStatus,
      event,
    });

    item.status = item.qty > item.threshold ? "Available" : "Low Stock";

    await inventory.save();

    res.status(200).json({ message: "Item issued successfully!", inventory });
  } catch (error) {
    console.error("Error issuing inventory:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// getIssuedInventory //
export const getIssuedInventory = async (req, res) => {
  try {
    const issuedInventory = await inventoryEntries.find(
      {},
      "category issuedItems"
    );
    if (!issuedInventory || issuedInventory.length === 0) {
      return res.status(404).json({ message: "No issued inventory found." });
    }

    res.status(200).json(issuedInventory);
  } catch (error) {
    console.error("Error fetching issued inventory:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// removedInventoryIteam  //
export const removeInventoryItem = async (req, res) => {
  try {
    const { category, itemName } = req.body;

    if (!category || !itemName) {
      return res
        .status(400)
        .json({ message: "Category and Item Name are required." });
    }

    const inventoryCategory = await inventoryEntries.findOne({ category });

    if (!inventoryCategory) {
      return res.status(404).json({ message: "Category not found." });
    }

    const itemIndex = inventoryCategory.items.findIndex(
      (item) => item.name === itemName
    );

    const removedItem = inventoryCategory.items[itemIndex];

    inventoryCategory.items.splice(itemIndex, 1);
    await inventoryCategory.save();

    const newRemovedItem = new removedInventory({
      itemName: removedItem.name,
      category: category,
      qty: removedItem.qty,
    });

    await newRemovedItem.save();

    res.status(200).json({
      message: "Item removed successfully and stored in removed inventory!",
    });
  } catch (error) {
    console.error("Error removing inventory item:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// removed RequestInventoryItem  //
export const deleteRequestInventory = async (req, res) => {
  try {
    const { category, itemName } = req.body;

    if (!category || !itemName) {
      return res
        .status(400)
        .json({ message: "Category and Item Name are required." });
    }

    const inventoryCategory = await inventoryEntries.findOne({ category });

    if (!inventoryCategory) {
      return res.status(404).json({ message: "Category not found." });
    }

    // Filter out the item with the given itemName
    const updatedItems = inventoryCategory.requestItems.filter(
      (item) => item.itemName !== itemName
    );

    if (updatedItems.length === inventoryCategory.requestItems.length) {
      return res
        .status(404)
        .json({ message: "Item not found in the specified category." });
    }

    // Update the category with the new list of items
    inventoryCategory.requestItems = updatedItems;

    // If no items are left in the category, delete the whole category
    if (updatedItems.length === 0) {
      await inventoryEntries.deleteOne({ category });
    } else {
      await inventoryCategory.save();
    }

    res.status(200).json({ message: "Inventory item deleted successfully." });
  } catch (error) {
    console.error("Error deleting inventory:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Delete Inventory Item
export const deleteItem = async (req, res) => {
  try {
    const { category, itemName, qty } = req.body;
    let inventory = await inventoryEntries.findOne({ category });
    if (!inventory) {
      return res.status(404).json({ message: "Category not found" });
    }

    const itemIndex = inventory.items.findIndex(
      (item) => item.itemName === itemName
    );
    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in category" });
    }

    const itemToDelete = inventory.items[itemIndex];
    inventory.deleteItems.push({
      itemName: itemToDelete.itemName,
      qty: itemToDelete.qty,
      // reason,
      deleteDate: Date.now(),
    });

    inventory = inventory.items.splice(itemIndex, 1);

    await inventory.save();

    res.status(200).json({
      message: "Item delete successfully and stored in delete inventory!",
      deletedItem: {
        itemName: itemToDelete.itemName,
        qty: itemToDelete.qty,
        // reason: reason || "Item deleted via endpoint"
      },
    });
  } catch (error) {
    console.error("Error deleting inventory item:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};








//modify request inventory form storeman
export const modifyRequest = async (req, res) => {
  try {
    const { category, itemName, requestQty, modifyQty, modifyReason } =
      req.body;

    if (
      !category ||
      !itemName ||
      !modifyReason ||
      !modifyQty == undefined ||
      !requestQty == undefined
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const modifyRequestInventory = await inventoryEntries.findOne({ category });

    if (!modifyRequestInventory) {
      return res.status(404).json({ message: "Category not found" });
    }

    const item = modifyRequestInventory.items.find((i) => i.name === itemName);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    if (item.requestQty < modifyQty) {
      return res
        .status(400)
        .json({ message: "Request qty is less than modified Qty" });
    }

    modifyRequestInventory.requestItems.push({
      itemName,
      requestQty,
      modifyQty,
      modifyReason,
      modifyDate: Date.now(), // Assuming you want to set the current date
    });

    await modifyRequestInventory.save();

    res
      .status(200)
      .json({
        message: "Item modifying successfully!",
        modifyRequestInventory,
      });
  } catch (error) {
    console.error("Error modifying inventory:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// getModifyRequestInventory
export const getModifyRequestInventory = async (req, res) => {
  try {
    const modifyRequestInventory = await inventoryEntries.find(
      { "requestItems.0": { $exists: true } },
      "category requestItems"
    );
    if (!modifyRequestInventory || modifyRequestInventory.length === 0) {
      return res
        .status(404)
        .json({ message: "No modify Request inventory found." });
    }
    res.status(200).json(modifyRequestInventory);
  } catch (error) {
    console.error("Error fetching modify request inventory:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};







//modify request inventory form storeman
// export const storemanApprovalRequest = async (req, res) => {
//   try {
//     const { 
//         itemName,
//         requestQty,
//         modifiedReason,     
//         modifiedQty
//        } =
//       req.body.formData;

//     if (
//        !itemName||
//        requestQty ==undefined ||
//       !modifiedReason||     
//        !modifiedQty==undefined

//     ) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     const storemanApprovalRequest = await inventoryEntries.findOne({ category });

//     if (!storemanApprovalRequest) {
//       return res.status(404).json({ message: "Category not found" });
//     }

//     // const item = storemanApprovalRequest.items.find((i) => i.name === itemName);

//     // if (!item) {
//     //   return res.status(404).json({ message: "Item not found" });
//     // }

//     if (item.requestQty < modifyQty) {
//       return res
//         .status(400)
//         .json({ message: "Modified qty is more than requested Qty" });
//     }

//     storemanApprovalRequest.approvalItems.push({
//       requestItems,
//       storemanAction: {
//         status: "Approved",
//         modifiedItems: [{
//           itemName,
//           requestQty,
//           modifiedQty,
//           modifiedReason,
//           modifyDate: Date.now(),
//         }]
//       }
//     });

//     await storemanApprovalRequest.save();

//     res
//       .status(200)
//       .json({
//         message: "Item modifying approved by storeman successfully!",
//         storemanApprovalRequest,
//       });
//   } catch (error) {
//     console.error("Error modifying and approving inventory:", error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };/


export const approvalRequestInventory = async (req, res) => {
  try {
    const {
      facultyName,
      event,
      category,
      itemName,
      requestQty,
      requireDate,
      requestReason,
      returnStatus,
      modifiedQty,
      modifiedReason
    } = req.body;

    const inventory = await inventoryEntries.findOne({ "multiRequestItems.facultyName": facultyName });

    if (!inventory) return res.status(404).json({ message: "Inventory not found" });

    const multiRequest = inventory.multiRequestItems.find(
      r => r.facultyName === facultyName && r.event === event
    );

    if (!multiRequest) return res.status(404).json({ message: "Request not found" });

    const requestItem = multiRequest.requestItems.find(item =>
      item.category === category &&
      item.itemName === itemName &&
      item.requestQty === requestQty &&
      item.requireDate.toISOString() === new Date(requireDate).toISOString()
    );

    if (!requestItem) return res.status(404).json({ message: "Requested item not found" });

    const storemanStatus = modifiedQty && modifiedQty != requestQty ? "Modified" : "Accepted";

    const newApproval = {
      requestId: multiRequest._id,
      storemanAction: {
        status: storemanStatus,
        modifiedItems: storemanStatus === "Modified" ? [{
          itemName,
          requestQty,
          modifiedQty,
          modifiedReason,
          modifiedDate: new Date()
        }] : [],
        actionDate: new Date()
      },
      adminAction: {
        status: "Pending"
      }
    };

    inventory.approvalItems.push(newApproval);
    await inventory.save();

    res.status(201).json({ message: "Approval saved successfully", newApproval });

  } catch (error) {
    console.error("Error saving approval:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// getapprovalRequestInventory
export const getApprovalRequestInventory = async (req, res) => {
  try {
    const approvalRequestInventory = await inventoryEntries.find(
      { "approvalItems.0": { $exists: true } },
      "category approvalItems"
    );
    if (!approvalRequestInventory || approvalRequestInventory.length === 0) {
      return res
        .status(404)
        .json({ message: "No approval Request inventory found." });
    }
    res.status(200).json(approvalRequestInventory);
  } catch (error) {
    console.error("Error fetching approval request inventory:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
