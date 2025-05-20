import mongoose from "mongoose";

const removedItemSchema = new mongoose.Schema({
  itemName: String,
  category: String,
  qty: Number,
  removedDate: { type: Date, default: Date.now },
});

const removedInventory = mongoose.model("RemovedInventory", removedItemSchema);
export default removedInventory;
