import { GoogleGenerativeAI } from "@google/generative-ai";
import { prismaClient } from "../config/prismaClient.js";

import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const conversation = async (req, res) => {
  const userId = "cm9fkjdsn0000hrriwqzabp3z";
  const { input } = req.body;
  if (!userId) {
    return res
      .status(400)
      .json({ success: false, message: "user id is required" });
  }

  const newConversation = await prismaClient.conversation.create({
    data: {
      userId: userId,
      projectTitle: input,
    },
  });

  return res.status(200).json({
    success: true,
    message: "conversation created successfully",
    data: {
      newConversation: newConversation.id,
      projectTitle: newConversation.projectTitle,
    },
  });
};

export const message = async (req, res) => {
  try {
    const { conversationId, prompt } = req.body;

    if (!conversationId || !prompt) {
      return res
        .status(400)
        .json({ success: false, message: "all fields are required" });
    }

    // get data from the db to context feed
    const previousMessage = await prismaClient.message.findMany({
      where: {
        conversationId,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    await prismaClient.message.create({
      data: {
        content: prompt,
        Role: "user",
        conversationId,
      },
    });

    //formate for gemini
    const chatHistory = previousMessage.map((msg) => ({
      role: msg.Role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }));

    chatHistory.push({
      role: "user",
      parts: [{ text: prompt }],
    });

    //  Create model instance first
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const result = await model.generateContent({
      contents: chatHistory,
    });

    const geminiReply =
      (await result?.response?.candidates?.[0]?.content?.parts?.[0]?.text) ??
      "No reply generated.";

    const aiMessage = await prismaClient.message.create({
      data: {
        content: geminiReply,
        Role: "system",
        conversationId: conversationId,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Messages saved successfully",
      data: geminiReply,
    });
  } catch (error) {
    console.log("🚀 ~ message ~ error:", error);
    return res.status(400).json({
      success: false,
      message: "Something went wrong while processing the message",
    });
  }
};

export const getAllMessage = async (req, res) => {
  try {
    const { conversationId } = req.body;
    if (!conversationId) {
      return res
        .status(400)
        .json({ success: false, message: "invalid conversation id" });
    }

    const allMessage = await prismaClient.message.findMany({
      where: {
        conversationId: conversationId,
      },
    });

    return res.status(200).json({
      success: true,
      allMessage,
    });
  } catch (error) {
    console.log("🚀 ~ getAllMessage ~ error:", error);
  }
};

export const getAllProjectTitle = async (req, res) => {
  try {
    const { conversationId } = req.body;
    if (!conversationId) {
      return res
        .status(400)
        .json({ success: false, message: "invalid conversation id" });
    }
    const data = await prismaClient.conversation.findMany({
      where: {
        userId: conversationId,
      },
      select: {
        projectTitle: true,
      },
    });
    console.log("🚀 ~ getAllProjectTitle ~ data:", data);
    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.log("🚀 ~ getAllProjectTitle ~ error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
