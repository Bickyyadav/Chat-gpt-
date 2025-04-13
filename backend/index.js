import express from "express";
import dotenv from "dotenv";
import router from "./routes/chatRoute.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;

app.use("/api/chat", router);

app.get("/", (req, res) => {
  res.send("hi there every one is there or not");
});

app.listen(PORT, () => {
  console.log(`server is running on port number ${PORT}`);
});
