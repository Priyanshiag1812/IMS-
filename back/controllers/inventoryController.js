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
      threshold,
      gst,
      bill,
    } = req.body;

    let billUrl = null;

    if (!req.file) {
      try {
        billUrl = await uploadToCloudinary(req);
      } catch (uploadError) {
        console.error("Cloudinary upload error : , uploadError");
      }
    }

    // Find or create the category
    let inventory = await inventoryEntries.findOne({ category });

    if (!inventory) {
      return res
        .status(404)
        .json({
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
        bill: billUrl,
        gst,
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



//request inventory form
export const requestInventoryFaculty = async (req, res) => {
  try {
    const {
      category,
      itemName,
      requestByDept,
      requestQty,
      returnStatus,
      requestByFaculty,
      requireDate,
      requestReason,
    } = req.body;

    if (
      !category ||
      !itemName ||
      !requestByDept ||
      !requestQty == undefined ||
      !requestByFaculty ||
      !requireDate ||
      !requestReason ||
      !returnStatus
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const requestInventory = await inventoryEntries.findOne({ category });

    if (!requestInventory) {
      return res.status(404).json({ message: "Category not found" });
    }

    const item = requestInventory.items.find((i) => i.name === itemName);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    if (item.qty < requestQty) {
      return res.status(400).json({ message: "Not enough stock available" });
    }

    requestInventory.requestItems.push({
      itemName,
      requestByDept,
      requestQty,
      returnStatus,
      requestByFaculty,
      requestDate: Date.now(), // Assuming you want to set the current date
      requireDate,
      requireDate,
      requestReason,
    });

    item.status = item.qty > item.threshold ? "Available" : "Low Stock";

    await requestInventory.save();

    res
      .status(200)
      .json({ message: "Item request successfully!", requestInventory });
  } catch (error) {
    console.error("Error requesting inventory:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// getViewRequestInventory
export const getViewRequestInventory = async (req, res) => {
  try {
    const viewRequestInventory = await inventoryEntries.find(
      { "requestItems.0": { $exists: true } },
      "category requestItems"
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

// Update Inventory Item
export const updateInventoryItem = async (req, res) => {
  try {
    const { category, name, qty, threshold, status } = req.body;

    if (!category || !name) {
      return res
        .status(400)
        .json({ error: "Category and Item Name are required." });
    }
    const inventoryCategory = await inventoryEntries.findOne({ category });

    if (!inventoryCategory) {
      return res.status(404).json({ error: "Category not found." });
    }

    const item = inventoryCategory.items.find((item) => item.name === name);

    if (!item) {
      return res
        .status(404)
        .json({ error: "Item not found in this category." });
    }

    item.qty = qty;
    item.threshold = threshold;
    item.status = status;

    await inventoryCategory.save();
    res
      .status(200)
      .json({ message: "Inventory updated successfully", updatedItem: item });
  } catch (error) {
    console.error("Error updating inventory:", error);
    res.status(500).json({ error: "Internal Server Error" });
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
      billUrl
    } = req.body;
    
    if (!req.file) {
      try {
        billUrl = await uploadToCloudinary(req);
      } catch (uploadError) {
        console.error("Cloudinary upload error : , uploadError");
      }
    }

    // Find or create the category
    let inventory = await inventoryEntries.findOne({ category });

    if (!inventory) {
      return res
        .status(404)
        .json({
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
    } = req.body;

    if (
      !category ||
      !itemName ||
      !issuedToDept ||
      !issuedToFaculty ||
      issuedQty === undefined ||
      !returnStatus
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
