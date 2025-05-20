import userModel from "../models/usermodel.js";
import bcrypt from "bcryptjs";

import jwt from "jsonwebtoken";

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    const cookieName = `${user.role}Token`;

    res.cookie(cookieName, token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 2 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: `${user.role} login successful`,
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};

export const checkAuth = (req, res) => {
  const { adminToken, facultyToken, storemanToken, accountantToken } =
    req.cookies;

  let token = null;
  let role = null;

  if (adminToken) {
    token = adminToken;
    role = "admin";
  } else if (facultyToken) {
    token = facultyToken;
    role = "faculty";
  } else if (storemanToken) {
    token = storemanToken;
    role = "storeman";
  } else if (accountantToken) {
    token = accountantToken;
    role = "accountant";
  } else {
    return res.status(401).json({ message: "No token found, please log in" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return res.status(200).json({
      message: `${role} authenticated`,
      role,
      user: decoded,
    });
  } catch (error) {
    return res.status(401).json({ message: "Invalid token", error });
  }
};

export const logOut = (req, res) => {
  const { adminToken, facultyToken, storemanToken, accountantToken } =
    req.cookies;
  let role = null;

  if (adminToken) {
    role = "admin";
  } else if (facultyToken) {
    role = "faculty";
  } else if (storemanToken) {
    role = "storeman";
  } else if (accountantToken) {
    role = "accountant";
  } else {
    return res.status(201).json({ message: "No token found, please log in" });
  }
  try {
   res.clearCookie(`${role}Token`,{
    httpOnly:true,
    secure:true,
    sameSite:"none"
   });
   return res.json({message: "logout successful"})
  } catch (error) {
    return res.status(500).json({ error : "internal server error" });
  }
};