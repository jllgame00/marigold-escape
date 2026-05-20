export function formatTime(seconds) {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

export function getClearTitle(clearTimeSeconds, hintCount) {
  if (hintCount === 0 && clearTimeSeconds <= 1200) {
    return "전설의 공방 탐험가";
  }

  if (clearTimeSeconds <= 1800) {
    return "행궁 수작 장인";
  }

  if (clearTimeSeconds <= 2700) {
    return "골목 유람가";
  }

  return "느긋한 산책자";
}

export function getHintEnding(hintCount) {
  if (hintCount === 0) return "완벽한 탐정";
  if (hintCount <= 2) return "노련한 유람가";
  return "끈기의 장인";
}
