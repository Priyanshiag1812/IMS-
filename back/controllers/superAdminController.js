import bcrypt from "bcryptjs";
import usermodel from "../models/usermodel.js";

export const registerSuperAdmin = async (req, res) => {
  try {
    const { fname, lname, email, password , role } = req.body;

    let superAdmin = await usermodel.findOne({ email });
    if (superAdmin) return res.status(400).json({ message: "Super Admin already exists" });
    console.log("password"+ password)
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("hashed"+hashedPassword);
    superAdmin = new usermodel({ fname, lname, email, password: hashedPassword ,role });
    await superAdmin.save();
    res.status(200).json({ message: "Super Admin registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
  




