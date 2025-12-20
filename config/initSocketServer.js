import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const initServer = (server, db) => {
  const io = new Server(server, {
    cors: { origin: "*" },
  });

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) throw new Error("No token");

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userId = decoded.id;

      next();
    } catch (err) {
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    console.log("Device connected:", socket.id);

    socket.on("join-game", async ({ game_session_id, pos_game_id }) => {
      const userId = socket.userId;
      const [session] = await db.execute(
        "SELECT tim1_id, tim2_id FROM game_session WHERE id = ? && pos_game_id = ? && end_time IS NULL",
        [game_session_id, pos_game_id]
      );

      if (
        session.length === 0 ||
        ![session[0].tim1_id, session[0].tim2_id].includes(userId)
      ) {
        return socket.emit("error", "Tidak berhak join game");
      }

      socket.join(`game_session_${game_session_id}`);
      socket.emit("joined", "Berhasil join game");
    });

    // SELECT CARD
    socket.on("select-card", async ({ game_session_id, card_id }) => {
      // 1️⃣ validasi kartu milik user
      const userId = socket.userId;
      const [card] = await db.execute(
        "SELECT id FROM card WHERE id = ? AND user_id = ?",
        [card_id, userId]
      );

      if (card.length === 0) {
        return socket.emit("error", "Kartu tidak valid");
      }

      // 2️⃣ simpan ke DB (contoh: update di game_session / table lain)
      await db.execute("UPDATE game_session SET score = score WHERE id = ?", [
        game_session_id,
      ]);

      // 3️⃣ broadcast ke room
      socket.to(`game_session_${game_session_id}`).emit("enemy-selected", {
        user_id,
      });

      socket.emit("card-selected", { success: true });
    });

    socket.on("disconnect", () => {
      console.log("Device disconnected:", socket.id);
    });
  });

  return io;
};
