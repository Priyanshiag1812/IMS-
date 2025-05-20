import bcrypt from "bcryptjs";
import usermodel from "../models/usermodel.js";

export const registerFaculty = async (req, res) => {
  try {
    const { fname, lname, email, password , role } = req.body;

    let faculty = await usermodel.findOne({ email });
    if (faculty) return res.status(400).json({ message: "Faculty already exists" });
    console.log("password"+ password)
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("hashed"+hashedPassword);
    faculty = new usermodel({ fname, lname, email, password: hashedPassword ,role });
    await faculty.save();
    res.status(200).json({ message: "Faculty registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
