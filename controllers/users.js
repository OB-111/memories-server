import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const signin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const exsitingUser = await User.findOne({ email });
    if (!exsitingUser)
      return res.status(404).json({ message: "User Dosent  exsist." });
    const iscorrectPassword = await bcrypt.compare(
      password,
      exsitingUser.password
    );
    if (!iscorrectPassword)
      return res.status(400).json({ message: "Invalid cerdentials." });

    const token = jwt.sign(
      { email: exsitingUser.email, id: exsitingUser._id },
      "test",
      { expiresIn: "1h" }
    );
    res.status(200).json({ result: exsitingUser, token });
  } catch (error) {
    res.status(500).json({ message: "Somthing went wrong.." });
  }
};

export const signup = async (req, res) => {
  const { email, confirmPassword, password, firstName, lastName } = req.body;
  try {
    const exsitingUser = await User.findOne({ email });
    if (exsitingUser)
      return res.status(400).json({ message: "User alredy exsist." });
    if (password !== confirmPassword)
      return res.status(400).json({ message: "Passwords downt match." });
    const hashedPassword = await bcrypt.hash(password, 12);
    const result = await User.create({
      email,
      password: hashedPassword,
      name: `${firstName} ${lastName}`,
    });
    const token = jwt.sign({ email: result.email, id: result._id }, "test", {
      expiresIn: "1h",
    });
    console.log("from signUp server controller:\n", result);
    res.status(200).json({ result, token });
  } catch (error) {
    res.status(500).json({ message: "Somthing went wrong.." });
  }
};
