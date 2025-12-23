import db from "../../config/database.js";
//import bcrypt from "bcrypt"; // Uncomment jika ingin mengaktifkan hashing

export const register = async (req, res) => {
  try {
    const {
      nama_tim,
      password,
      email,
      asal_sekolah,
      no_wa,
      id_line,
      kategori_biaya,
      paket,
      bukti_pembayaran,
      members,
    } = req.body;

    // 1. Validasi Input Dasar
    if (!nama_tim || !password || !asal_sekolah) {
      return res.status(400).json({
        success: false,
        message: "Nama tim, password, dan asal sekolah wajib diisi.",
      });
    }

    if (!Array.isArray(members) || members.length !== 3) {
      return res.status(400).json({
        success: false,
        message: "Jumlah anggota tim wajib 3 orang.",
      });
    }

    // 2. Cek Duplikasi Nama Tim (Cek di tabel USER karena itu master datanya)
    const [existingUser] = await db.execute(
      "SELECT id FROM user WHERE nama_tim = ?",
      [nama_tim]
    );

    if (existingUser.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Nama tim sudah terdaftar.",
      });
    }

    // ==================================================================
    // STEP 3: INSERT KE TABEL USER (PARENT)
    // Kita harus insert ke user dulu untuk mendapatkan ID (Auto Increment)
    // ==================================================================

    // const hashedPassword = await bcrypt.hash(password, 10); // Gunakan ini jika bcrypt aktif

    const [insertUser] = await db.execute(
      `INSERT INTO user (
        nama_tim, password, role
      ) VALUES (?, ?, 'PESERTA')`,
      [nama_tim, password] // Ganti 'password' dengan 'hashedPassword' jika bcrypt aktif
    );

    const newUserId = insertUser.insertId;

    await db.execute(
      `INSERT INTO tim (
        user_id, nama_tim, email, asal_sekolah, no_wa, id_line,
        kategori_biaya, paket, bukti_pembayaran,
        status_pembayaran, notes, total_points, total_coin, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'unverified', '', 0, 0, 'KOSONG')`,
      [
        newUserId, // user_id (FK dari user.id)
        nama_tim, // Disimpan lagi di tim sesuai struktur SQL
        email,
        asal_sekolah,
        no_wa,
        id_line,
        kategori_biaya,
        paket,
        bukti_pembayaran,
      ]
    );
    const memberPromises = members.map((member) => {
      return db.execute(
        `INSERT INTO member (
          tim_user_id, nama_anggota, pas_foto, kartu_pelajar,
          bukti_follow_ceg, bukti_follow_tkubaya,
          alergi, penyakit_bawaan, pola_makan
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          newUserId,
          member.nama_anggota,
          member.pas_foto,
          member.kartu_pelajar,
          member.bukti_follow_ceg,
          member.bukti_follow_tkubaya,
          member.alergi,
          member.penyakit_bawaan,
          member.pola_makan,
        ]
      );
    });

    await Promise.all(memberPromises);

    // Response Sukses
    return res.status(201).json({
      success: true,
      message: "Selamat, pendaftaran tim berhasil.",
      data: {
        id_tim: newUserId,
        nama_tim,
        jumlah_anggota: members.length,
      },
    });
  } catch (error) {
    console.error("ERROR REGISTER:", error);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server: " + error.message,
    });
  }
};
