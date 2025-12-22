import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import penposRoutes from "./routes/penposRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Server Backend Ready!",
  });
});

// Ini berarti url loginnya jadi: http://localhost:5000/auth/login
app.use("/auth", authRoutes);
// app.use("/admin",)
app.use("/penpos", penposRoutes);
app.use("/user", userRoutes);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
