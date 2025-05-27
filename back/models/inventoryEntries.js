import mongoose from "mongoose";

const issuedItemSchema = new mongoose.Schema({
  itemName: String,
  issuedToDept: String,
  issuedQty: Number,
  returnStatus: {
    type: String,
    enum: ["Returnable", "Non Returnable"],
  },
  issuedToFaculty: String,
  issuedDate: { type: Date, default: Date.now },
  returnDate: { type: Date },
  returnQty: Number,
  returnedDate: { type: Date, default: Date.now }, // date of the return form filled
  event: String,
  requestDate: { type: Date },
});

const updatedItemSchema = new mongoose.Schema({
  itemName: String,
  qty: Number,
  updatedQty: Number,
  threshold: Number,
  updatedThreshold: Number,
  reason: String,
  DateOfUpdation: { type: Date, default: Date.now },
});

const requestItemSchema = new mongoose.Schema({
  category: String,
  itemName: String,
  requestQty: Number,
  returnStatus: {
    type: String,
    enum: ["Returnable", "Non Returnable"],
  },
  requireDate: { type: Date },
  // modifyQty: Number,
  // modifyReason: String,
  // modifyDate: { type: Date, default: Date.now },
});

const multiRequestItemSchema = new mongoose.Schema({
  department: String,
  facultyName: String,
  requestDate: { type: Date, default: Date.now },
  requestReason: String,
  event: String,
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected", "Modified"],
  },
   // Array of request items
   requestItems: [requestItemSchema],
});


// const requestItemSchema = new mongoose.Schema({
//   itemName: String,
//   requestByDept: String,
//   requestQty: Number,
//   returnStatus: {
//     type: String,
//     enum: ["Returnable", "Non Returnable"],
//   },
//   requestByFaculty: String,
//   requestDate: { type: Date, default: Date.now },
//   requireDate: { type: Date },
//   status: {
//     type: String,
//     enum: ["Pending", "Approved", "Rejected", "Modified"],
//   },
//   requestReason: String,
//   event: String,
//   modifyQty: Number,
//   modifyReason: String,
//   modifyDate: { type: Date, default: Date.now },
// });

const purchaseItemSchema = new mongoose.Schema({
  billNo: String,
  partyName: String,
  billDate: Date,
  billAmount: Number,
  purchaseQty: Number,
  qty: Number,
  pricePerUnit: Number,
  gst: Number,
  status: {
    type: String,
    enum: ["Available", "Low Stock", "Out of Stock"],
  },
  purchaseDate: { type: Date, default: Date.now },
  bill: String, // Assuming this is a file path or URL to the bill document
});

const deleteItemSchema = new mongoose.Schema({
  itemName: String,
  qty: Number,
  reason: String,
  deleteDate: { type: Date, default: Date.now },
});

const itemSchema = new mongoose.Schema({
  name: String,
  qty: Number,
  threshold: Number,
  status: {
    type: String,
    enum: ["Available", "Low Stock", "Out of Stock"],
  },
  purchaseItems: [purchaseItemSchema], // Array of purchase items
  updatedItems: [updatedItemSchema],
});

const inventorySchema = new mongoose.Schema({
  category: String,
  items: [itemSchema],
  deleteItems: [deleteItemSchema],
  issuedItems: [issuedItemSchema],
  // requestItems: [requestItemSchema],
  multiRequestItems: [multiRequestItemSchema],
});

const inventoryEntries = mongoose.model("Inventory", inventorySchema);
export default inventoryEntries;
