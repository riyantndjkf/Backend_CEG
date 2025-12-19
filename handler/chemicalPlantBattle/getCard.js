import db from "../../config/database.js";
import { checkToken } from "../../config/checkToken.js";

export const getCard = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        status: "Failed",
        message: "There is no Token sent!",
      });
    }
    const token = authHeader.split(" ")[1];
    const { valid, expired, decoded } = checkToken(token);
    const userId = decoded.id;

    if (!valid) {
      return res.status(401).json({
        success: false,
        message: expired ? "Token expired." : "Token invalid.",
      });
    }
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "ID pengguna tidak ditemukan.",
      });
    }

    const { game_session_id } = req.body;

    const [findGameSession] = await db.execute(
      "SELECT * FROM game_session WHERE id = ? && end_time IS NULL",
      [game_session_id]
    );

    if (findGameSession.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Game session tidak ditemukan atau sudah berakhir!",
      });
    }

    const [rows] = await db.execute("SELECT * FROM card WHERE user_id = ?", [
      userId,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Card tidak ditemukan!",
      });
    }
    const card = rows[0];

    return res.status(200).json({
      success: true,
      message: "Berhasil mendapatkan kartu awal!",
      data: {
        id: decoded.id,
        tim: decoded.tim,
        cards: card,
      },
    });
  } catch (error) {
    console.error("ERROR GET CARD:", error);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server: " + error.message,
    });
  }
};
