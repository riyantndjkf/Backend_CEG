import db from "../../config/database";
import { checkToken } from "../../config/checkToken.js";

export const matchResult = async (req, res) => {
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

    const game_session_id = req.body.game_session_id;

    if (!game_session_id) {
      return res.status(400).json({
        success: false,
        message: "game_session_id is required.",
      });
    }

    const [checkStatus] = await db.execute(
      "SELECT p.tipe FROM dbceg.game_session g INNER JOIN pos_game p ON p.id = g.pos_game_id WHERE g.id = ?",
      [game_session_id]
    );

    if (checkStatus[0].tipe !== "BATTLE") {
      const { tim_menang, tim_kalah } = req.body;
      if (!tim_menang || !tim_kalah) {
        return res.status(400).json({
          success: false,
          message: "tim_menang dan tim_kalah wajib dikirim",
        });
      }

      await db.execute(
        "UPDATE game_session SET end_time = NOW() WHERE game_session_id = ?",
        [game_session_id]
      );

      await db.execute(
        "UPDATE user SET total_points = total_points + 5 WHERE id = ?",
        [tim_menang]
      );

      await db.execute(
        "UPDATE user SET total_points = total_points + 1 WHERE id = ?",
        [tim_kalah]
      );

      return res.status(200).json({
        success: true,
        message: `Tim yang menang mendapatkan 5 poin & tim yang kalah mendapatkan 1 poin!`,
        data: {
          tim_menang: tim_menang,
          tim_kalah: tim_kalah,
        },
      });
    } else if (checkStatus[0].tipe === "SINGLE") {
      const { result, tim_id } = req.body;

      if (!result || !tim_id) {
        return res.status(400).json({
          success: false,
          message: "result dan tim_id wajib dikirim",
        });
      }

      await db.execute(
        "UPDATE game_session SET end_time = NOW() WHERE game_session_id = ?",
        [game_session_id]
      );

      if (result) {
        "UPDATE user SET total_points = total_points + 5 WHERE id = ?",
          [tim_id];
      } else if (result === false) {
        "UPDATE user SET total_points = total_points + 1 WHERE id = ?",
          [tim_id];
      }

      res.status(200).json({
        success: true,
        message:
          "Tim yang menang mendapatkan 5 poin & tim yang kalah mendapatkan 1 poin!",
      });
    }
  } catch (error) {
    console.error("ERROR MATCH RESULT:", error);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server: " + error.message,
    });
  }
};
