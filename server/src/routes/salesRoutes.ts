import express from "express";
import { protect } from "../middleware/authMiddleware";
import { recordSale, getSales, getSaleById, deleteSale } from "../controllers/salesController";
import { isAdmin } from "../middleware/roleMiddleware";

const router = express.Router();

router.post("/", protect, recordSale);
router.get("/", protect, isAdmin, getSales); 
router.get("/:id", protect, getSaleById); 
router.delete("/:id", protect, isAdmin, deleteSale); 

export default router;
