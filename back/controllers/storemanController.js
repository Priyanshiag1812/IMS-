import bcrypt from "bcryptjs";
import usermodel from "../models/usermodel.js";

export const registerStoreman = async (req, res) => {
  try {
    const { fname, lname, email, password , role  } = req.body;
    let storeman = await usermodel.findOne({ email });
    if (storeman) return res.status(400).json({ message: "Storeman already exists" });
    console.log("password"+ password)
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("hashed"+hashedPassword);
    storeman = new usermodel({ fname, lname, email, password: hashedPassword , role });
    await storeman.save();
    res.status(200).json({ message: "Storeman registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
