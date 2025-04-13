











// import bodyParser, { text } from "body-parser";
// import express, { Request, Response } from "express";
// import { Content, GoogleGenAI } from "@google/genai";
// import { config } from "dotenv";

// config();

// const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// const userContext: Content[] = [];

// const app = express();
// app.use(bodyParser.json());
// app.post("/generate-response", async (req: Request, res: Response) => {
// try {
// const { prompt } = req.body;
// const userPrompt: Content = {
// role: "user",
// parts: [{ text: prompt }],
// };

// userContext.push(userPrompt);
// console.log("🚀 ~ app.post ~ userContext:", userContext);
// const response = await ai.models.generateContent({
// model: "gemini-2.0-flash",
// contents: userContext,
// });

// const geminiReply = response.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
// console.log("🚀 ~ app.post ~ geminiReply:", geminiReply)


// console.log("🚀 ~ app.post ~ response:", response);

// const modelResponse = {
// role: "model",
// parts: [{ text: geminiReply }],
// };
// userContext.push(modelResponse);
// res.send(geminiReply);
// } catch (error) {
// console.log("🚀 ~ app.post ~ error:", error);
// }
// });

// app.listen(3000, () => {
// console.log("port is listen on 300");
// });