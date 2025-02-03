import { Request, Response } from "express";
import Product, { IProduct } from "../models/Product";

// **Add a Product**
export const addProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, category, quantity, price, expirationDate } = req.body;
    
    const newProduct: IProduct = new Product({
      name,
      category,
      quantity,
      price,
      expirationDate,
    });

    await newProduct.save();
    res.status(201).json({ message: "Product added successfully", product: newProduct });
  } catch (error) {
    res.status(500).json({ message: "Error adding product" });
  }
};

// **Get All Products**
export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products" });
  }
};

// **Get a Single Product**
export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) res.status(404).json({ message: "Product not found" });
    return;
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Error fetching product" });
  }
};

// **Update a Product**
export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, category, quantity, price, expirationDate } = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { name, category, quantity, price, expirationDate },
      { new: true }
    );

    if (!updatedProduct) res.status(404).json({ message: "Product not found" });
    return;

    res.json({ message: "Product updated successfully", product: updatedProduct });
  } catch (error) {
    res.status(500).json({ message: "Error updating product" });
  }
};

// **Delete a Product**
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) res.status(404).json({ message: "Product not found" });
    return;

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product" });
  }
};
