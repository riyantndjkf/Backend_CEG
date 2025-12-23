// BACKEND/handler/auth/register.js

import db from "../../config/database.js";
// import bcrypt from "bcrypt"; // aktifkan jika ingin hashing password

export const register = async (req, res) => {
  try {
    const {
      nama_tim,
      password,
      email,
      asal_sekolah,
      no_wa,
      id_line,
      kategori_biaya,    // ENUM: 'EARLY_BIRD','NORMAL'
      paket,             // ENUM: 'SINGLE','BUNDLE'
      bukti_pembayaran,  // VARCHAR(200)
      status_pembayaran, // ENUM: 'verified','unverified'
      members,           // Array berisi 3 anggota
    } = req.body;

    // Validasi input dasar
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

    // Cek duplikasi nama tim
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

    // Insert ke tabel user
    const [insertUser] = await db.execute(
      `INSERT INTO user (nama_tim, password, role)
       VALUES (?, ?, 'PESERTA')`,
      [nama_tim, password] // gunakan hashedPassword jika bcrypt aktif
    );

    const newUserId = insertUser.insertId;

    // Insert ke tabel tim
    const timParams = [
      newUserId,
      email ?? null,
      asal_sekolah,
      no_wa ?? null,
      id_line ?? null,
      kategori_biaya,
      paket,
      bukti_pembayaran ?? null,
      status_pembayaran ?? null,
    ];

    console.log("TIM PARAMS:", timParams);

    await db.execute(
      `INSERT INTO tim (
        user_id,
        pos_game_id,
        total_points,
        total_coin,
        status,
        email,
        asal_sekolah,
        no_wa,
        id_line,
        kategori_biaya,
        paket,
        bukti_pembayaran,
        status_pembayaran,
        notes
      ) VALUES (?, NULL, 0, 0, 'KOSONG', ?, ?, ?, ?, ?, ?, ?, ?, '')`,
      timParams
    );

    // Insert anggota ke tabel member
    const memberPromises = members.map((member) => {
      const memberParams = [
        newUserId,
        member.nama_anggota,
        member.pas_foto ?? null,
        member.kartu_pelajar ?? null,
        member.bukti_follow_ceg ?? null,
        member.bukti_follow_tkubaya ?? null,
        member.alergi ?? null,
        member.penyakit_bawaan ?? null,
        member.pola_makan, // ENUM: 'NORMAL','VEGETARIAN','VEGAN'
      ];

      console.log("MEMBER PARAMS:", memberParams);

      return db.execute(
        `INSERT INTO member (
          tim_user_id,
          nama_anggota,
          pas_foto,
          kartu_pelajar,
          bukti_follow_ceg,
          bukti_follow_tkubaya,
          alergi,
          penyakit_bawaan,
          pola_makan
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        memberParams
      );
    });

    await Promise.all(memberPromises);

    // Response sukses
    return res.status(201).json({
      success: true,
      message: "Selamat, pendaftaran tim berhasil.",
      data: {
        id_user: newUserId,
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