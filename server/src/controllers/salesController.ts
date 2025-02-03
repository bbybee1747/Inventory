import { Response } from "express";
import Sale, { ISale } from "../models/Sale";
import Product from "../models/Product";
import { AuthRequest } from "../middleware/authMiddleware"; 

export const recordSale = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { productId, quantity } = req.body;

    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const product = await Product.findById(productId);
    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    if (product.quantity < quantity) {
      res.status(400).json({ message: "Not enough stock available" });
      return;
    }

    const totalPrice = product.price * quantity;

    const newSale: ISale = new Sale({
      product: productId,
      quantity,
      totalPrice,
      user: req.user.id, 
    });

    await newSale.save();

    product.quantity -= quantity;
    await product.save();

    res.status(201).json({ message: "Sale recorded successfully", sale: newSale });
  } catch (error) {
    res.status(500).json({ message: "Error recording sale" });
  }
};

export const getSales = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    let sales;
    if (req.user.role === "admin") {
      sales = await Sale.find().populate("product").sort({ soldAt: -1 });
    } else {
      sales = await Sale.find({ user: req.user.id }).populate("product").sort({ soldAt: -1 });
    }

    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: "Error fetching sales" });
  }
};

export const getSaleById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const sale = await Sale.findById(req.params.id).populate("product");

    if (!sale) {
      res.status(404).json({ message: "Sale not found" });
      return;
    }

    if (req.user.role !== "admin" && sale.user.toString() !== req.user.id) {
      res.status(403).json({ message: "Access denied" });
      return;
    }

    res.json(sale);
  } catch (error) {
    res.status(500).json({ message: "Error fetching sale" });
  }
};

export const deleteSale = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user || req.user.role !== "admin") {
      res.status(403).json({ message: "Access denied" });
      return;
    }

    const sale = await Sale.findById(req.params.id);
    if (!sale) {
      res.status(404).json({ message: "Sale not found" });
      return;
    }

    await sale.deleteOne();
    res.json({ message: "Sale deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting sale" });
  }
};
