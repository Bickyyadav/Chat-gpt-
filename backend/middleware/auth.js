import jwt from "jsonwebtoken";
import { prismaClient } from "../config/prismaClient.js";

const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(200).json({
        message: "User not authenticated",
        success: false,
      });
    }

    const { id } = await jwt.verify(token, process.env.SECRET_KEY);

    // validate user
    const verifyUser = await prismaClient.user.findUnique({
      where: {
        id,
      },
    });
    if (!verifyUser) {
      res.status(400).json({
        success: false,
        message: "User doesnot exist",
      });
    }
    req.body.id = verifyUser.id;

    next();
  } catch (error) {
    console.log("🚀 ~ isAuthenticated ~ error:", error);
  }
};

export default isAuthenticated;
