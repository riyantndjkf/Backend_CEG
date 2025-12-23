import db from "../../config/database.js";

export const verifyPayment = async (req, res) => {
  try {
    const { timId } = req.query; // ini sebenarnya user_id
    const { status_pembayaran } = req.body;

    // ENUM di DB: 'verified', 'unverified' → pastikan huruf kecil
    await db.execute(
      "UPDATE tim SET status_pembayaran = ? WHERE user_id = ?",
      [status_pembayaran, timId]
    );

    return res.status(200).json({
      success: true,
      message: `Status pembayaran tim dengan user_id ${timId} berhasil diupdate menjadi ${status_pembayaran}`,
    });
  } catch (error) {
    console.error("ERROR VERIFY PAYMENT:", error);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server: " + error.message,
    });
  }
};