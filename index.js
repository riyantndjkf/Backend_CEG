import express from "express";
import authRoutes from "./routes/authRoutes.js";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    message: "IZINNNN",
  });
});

app.use("/auth", authRoutes);

app.listen(() => {
  console.log(`Run at http://localhost:5000`);
});
