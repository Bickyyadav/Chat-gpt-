import { prismaClient } from "../config/prismaClient.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phoneNumber } = req.body;
    if (!firstName || !lastName || !email || !password || !phoneNumber) {
      return res.status(400).json({
        message: "Something is missing",
        success: false,
      });
    }
    const userExists = await prismaClient.user.findUnique({
      where: {
        email,
      },
    });

    if (userExists) {
      return res.status(400).json({
        message: "User already exist with this email",
        success: false,
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const user = await prismaClient.user.create({
      data: {
        email,
        firstName,
        lastName,
        password: hashPassword,
        phoneNumber,
      },
      select: {
        email: true,
        firstName: true,
        lastName: true,
        phoneNumber: true,
      },
    });

    return res.status(200).json({
      message: "User created Successfully",
      success: true,
      user,
    });
  } catch (error) {
    console.log("🚀 ~ register ~ error:", error);
    return res.status(400).json({
      message: "Somethings went wrong",
      success: false,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "Something is missing",
        success: false,
      });
    }

    const userExist = await prismaClient.user.findUnique({
      where: {
        email,
      },
    });

    const isPasswordMatch = await bcrypt.compare(password, userExist.password);

    if (!isPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: "Incorrect Email or password",
      });
    }

    if (!userExist) {
      return res.status(400).json({
        message: "Incorrect email or password",
        success: false,
      });
    }

    console.log("🚀 ~ login ~ process.env.SECRET_KEY:", process.env.SECRET_KEY);

    const tokenData = {
      id: userExist.id,
    };

    const token = jwt.sign(tokenData, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
      })
      .json({
        message: `Welcome back ${userExist.firstName}`,
        success: true,
        userExist,
      });
  } catch (error) {
    console.log("🚀 ~ login ~ error:", error);
    return res.status(400).json({
      message: "Somethings went wrong",
      success: false,
    });
  }
};

export const logout = async (req, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "logged out successfully",
      success: true,
    });
  } catch (error) {
    console.log("🚀 ~ logout ~ error:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};
