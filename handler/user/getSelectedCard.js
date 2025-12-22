import db from "../../config/database.js";
import { checkToken } from "../../config/checkToken.js";

export const getSelectedCard = async (req, res) => {
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

    const { game_session_id, card1, card2 } = req.body;

    const [tim] = await db.execute(
      "SELECT tim1, tim2 FROM game_session WHERE id = ?",
      [game_session_id]
    );

    const result = checkBattleResult(tim[0].tim1, card1, tim[0].tim2, card2);

    if (userId === tim[0].tim1) {
      await db.execute(
        `UPDATE card SET ${card1} = ${card1} - 1 where user_id = ?`,
        [tim[0].tim1]
      );

      await db.execute(
        `UPDATE user SET selected_card = NULL where user_id = ?`,
        [userId]
      );

      return res.status(200).json({
        success: true,
        message: "Berhasil mendapatkan kartu terpilih!",
        data: result,
      });
    } else if (userId === tim[0].tim2) {
      await db.execute(
        `UPDATE card SET ${card2} = ${card2} - 1 where user_id = ?`,
        [tim[0].tim2]
      );
      await db.execute(
        `UPDATE user SET selected_card = NULL where user_id = ?`,
        [userId]
      );
      return res.status(200).json({
        success: true,
        message: "Berhasil mendapatkan kartu terpilih!",
        data: result,
      });
    }
  } catch (error) {
    console.error("ERROR GET SELECTED CARD:", error);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server: " + error.message,
    });
  }
};
