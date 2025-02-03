import express from "express";
import { protect, isAdmin } from "../middleware/roleMiddleware";
import {
  addProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/inventoryController";

const router = express.Router();

router.post("/", protect, isAdmin, addProduct); 
router.get("/", getProducts);
router.get("/:id", getProductById);
router.put("/:id", protect, isAdmin, updateProduct); 
router.delete("/:id", protect, isAdmin, deleteProduct);

export default router;
