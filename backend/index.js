import express from "express";
import dotenv from "dotenv";
import chatRouter from "./routes/chatRoute.js";
import userRouter from "./routes/user.js";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};

app.use(cors(corsOptions));

const PORT = process.env.PORT || 3000;

app.use(cookieParser());
app.use("/api/chat", chatRouter);
app.use("/api/user", userRouter);

app.get("/", (req, res) => {
  res.send("hi there every one is there or not");
});

app.listen(PORT, () => {
  console.log(`server is running on port number ${PORT}`);
});
