import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "../models/User";
import Product from "../models/Product";
import Sale from "../models/Sale";

dotenv.config();

const mongoURI = process.env.MONGO_URI as string;

const seedDatabase = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log("✅ Connected to MongoDB");

    await User.deleteMany();
    await Product.deleteMany();
    await Sale.deleteMany();
    console.log("🗑️  Cleared old data");

    const adminUser = await User.create({
      username: "adminuser",
      name: "Admin User",
      email: "admin@example.com",
      password: bcrypt.hashSync("password123", 10),
      role: "admin",
    });

    console.log(`👤 Admin user created: ${adminUser.email}`);

    // **Create Employee Users**
    const employeeUsers = await User.insertMany([
      {
        username: "john_doe",
        name: "John Doe",
        email: "john@example.com",
        password: bcrypt.hashSync("password123", 10),
        role: "employee",
      },
      {
        username: "jane_smith",
        name: "Jane Smith",
        email: "jane@example.com",
        password: bcrypt.hashSync("password123", 10),
        role: "employee",
      },
    ]);

    console.log("👤 Seeded users");

    const products = await Product.insertMany([
        { name: "Apples", price: 2.5, quantity: 100, category: "Fruits" },
        { name: "Bananas", price: 1.5, quantity: 150, category: "Fruits" },
        { name: "Carrots", price: 1.2, quantity: 80, category: "Vegetables" },
        { name: "Milk", price: 3.0, quantity: 50, category: "Dairy" },
        { name: "Bread", price: 2.0, quantity: 40, category: "Bakery" },
      ]);

    console.log("🛒 Seeded products");

    const sales = await Sale.insertMany([
      {
        product: products[0]._id, 
        user: employeeUsers[0]._id, 
        quantity: 3,
        totalPrice: products[0].price * 3,
      },
      {
        product: products[1]._id, 
        user: employeeUsers[1]._id, 
        quantity: 5,
        totalPrice: products[1].price * 5,
      },
    ]);

    console.log(`💰 Seeded ${sales.length} sales`);

    console.log("🎉 Database Seeded Successfully!");
    process.exit();
  } catch (error) {
    console.error("❌ Error Seeding Database:", error);
    process.exit(1);
  }
};

seedDatabase();
