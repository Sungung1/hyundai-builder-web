const PARTICIPANT_COLORS = [
  "#FF6B6B",
  "#4ECDC4",
  "#FFD166",
  "#5C7CFA",
  "#F28482",
  "#84A59D",
  "#9B5DE5",
  "#06D6A0"
];

export function pickParticipantColor(seed: number) {
  return PARTICIPANT_COLORS[seed % PARTICIPANT_COLORS.length];
}

export function hexToRgb(hex: string) {
  const normalized = hex.replace("#", "");
  const value =
    normalized.length === 3
      ? normalized
          .split("")
          .map((char) => `${char}${char}`)
          .join("")
      : normalized;

  const number = Number.parseInt(value, 16);
  return {
    r: (number >> 16) & 255,
    g: (number >> 8) & 255,
    b: number & 255
  };
}
