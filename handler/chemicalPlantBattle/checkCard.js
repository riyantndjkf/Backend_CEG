const battleTable = {
  asam_kuat: {
    asam_kuat: "seri",
    asam_lemah: "kalah",
    netral: "seri",
    basa_lemah: "kalah",
    basa_kuat: "seri",
  },
  asam_lemah: {
    asam_kuat: "menang",
    asam_lemah: "seri",
    netral: "menang",
    basa_lemah: "seri",
    basa_kuat: "menang",
  },
  netral: {
    asam_kuat: "seri",
    asam_lemah: "kalah",
    netral: "seri",
    basa_lemah: "kalah",
    basa_kuat: "seri",
  },
  basa_lemah: {
    asam_kuat: "menang",
    asam_lemah: "seri",
    netral: "menang",
    basa_lemah: "seri",
    basa_kuat: "menang",
  },
  basa_kuat: {
    asam_kuat: "seri",
    asam_lemah: "kalah",
    netral: "seri",
    basa_lemah: "kalah",
    basa_kuat: "seri",
  },
};

export const checkBattleResult = (cardA, cardB) => {
  if (!battleTable[cardA] || !battleTable[cardA][cardB]) {
    throw new Error("Jenis kartu tidak valid");
  }

  return battleTable[cardA][cardB];
};
