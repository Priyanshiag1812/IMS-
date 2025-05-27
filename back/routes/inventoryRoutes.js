import express from "express";
import {
  getInventory,
  updatedItem,
  issueInventory,
  getIssuedInventory,
  removeInventoryItem,
  purchaseInventory,
  restockInventory,
  requestInventoryFaculty,
  returnInventoryFaculty,
  getReturnRequestInventory,
  getModifyRequestInventory,
  modifyRequest,
  getViewRequestInventory,
  deleteRequestInventory,
  deleteItem,
  getPurchaseInventory,
  getUpdatedInventory,
} from "../controllers/inventoryController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import upload from "../middlewares/Upload.js";
const router = express.Router();


router.post(
  "/purchase",
  authMiddleware( "adminToken","storemanToken","superAdminToken"),
  upload.single("image"), 
  purchaseInventory
);
router.get(
  "/getTable",
  authMiddleware( "adminToken", "storemanToken","facultyToken","accountantToken" ,"superAdminToken"),
  getInventory
);
router.put(
  "/update-inventory",
  authMiddleware("storemanToken", "admin" ,"superAdminToken"),
  updatedItem
);
router.post(
  "/issue-inventory",
  authMiddleware("storemanToken", "adminToken", "superAdminToken"),
  issueInventory
);
router.get(
  "/getIssuedInventory",
  authMiddleware("storemanToken", "adminToken","facultyToken","superAdminToken"),
  getIssuedInventory
);

router.get(
  "/getUpdatedInventory",
  authMiddleware("storemanToken", "adminToken","superAdminToken"),
  getUpdatedInventory
);

router.get(
  "/getPurchaseInventory",
  authMiddleware("storemanToken", "adminToken" ,"superAdminToken"),
  getPurchaseInventory
);


router.delete(
  "/removeInventory",
  authMiddleware("storemanToken", "adminToken" ,"superAdminToken"),
  removeInventoryItem
);


router.post(
  "/delete-inventory",
  authMiddleware("storemanToken", "adminToken" ,"superAdminToken"),
  deleteItem
);

router.put(
  "/restock-inventory",
  authMiddleware("storemanToken", "adminToken","superAdminToken"),
  upload.single("image"),
  restockInventory
);


router.post(
  "/faculty-request-inventory",
  authMiddleware("facultyToken", "adminToken","superAdminToken"),
  requestInventoryFaculty
);

router.post(
  "/faculty-return-inventory",
  authMiddleware("facultyToken", "adminToken" ,"superAdminToken"),
  returnInventoryFaculty
);

router.get(
  "/getReturnRequestInventory",
  authMiddleware("storemanToken" ,"superAdminToken"),
  getReturnRequestInventory
);


router.get(
  "/getModifyRequestInventory",
  authMiddleware("storemanToken" ,"adminToken" ,"superAdminToken"),
  getModifyRequestInventory
);


router.post(
  "/modify-request",
  authMiddleware("storemanToken", "adminToken", "facultyToken" ,"superAdminToken"),
  modifyRequest
);

router.get(
  "/getViewRequestInventory",
  authMiddleware("storemanToken", "facultyToken", "adminToken" ,"superAdminToken"),
  getViewRequestInventory
);
router.get(
  "/faculty-inventory-table",
  authMiddleware("facultyToken", "adminToken","superAdminToken"),
  getInventory
);
router.delete("/deleteRequestInventory",
  authMiddleware("adminToken" ,"superAdminToken" ),
  deleteRequestInventory);

export default router;