import bcrypt from "bcryptjs";
import usermodel from "../models/usermodel.js";

export const registerAccountant = async (req, res) => {
  try {
    const { fname, lname, email, password , role } = req.body;

    let accountant = await usermodel.findOne({ email });
    if (accountant) return res.status(400).json({ message: "Accountant already exists" });
    console.log("password"+ password)
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("hashed"+hashedPassword);
    user = new usermodel({ fname, lname, email, password: hashedPassword ,role });
    await user.save();
    res.status(200).json({ message: "Accountant registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
  




