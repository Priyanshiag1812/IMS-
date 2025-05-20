import bcrypt from "bcryptjs";
import usermodel from "../models/usermodel.js";

export const registerAdmin = async (req, res) => {
  try {
    const { fname, lname, email, password , role } = req.body;

    let admin = await usermodel.findOne({ email });
    if (admin) return res.status(400).json({ message: "Admin already exists" });
    console.log("password"+ password)
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("hashed"+hashedPassword);
    admin = new usermodel({ fname, lname, email, password: hashedPassword , role});
    await admin.save();
    res.status(200).json({ message: "Admin registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
  
