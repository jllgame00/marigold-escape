export function formatTime(seconds) {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

export function getClearTitle(clearTimeSeconds, hintCount) {
  if (hintCount === 0 && clearTimeSeconds <= 1200) {
    return "왕명을 받은 비밀 조사관";
  }

  if (clearTimeSeconds <= 1800) {
    return "서찰의 진실을 밝힌 자";
  }

  if (clearTimeSeconds <= 2700) {
    return "약속을 잇는 조사관";
  }

  return "끝까지 따라간 궁중 기록관";
}

export function getHintEnding(hintCount) {
  if (hintCount === 0) return "흔들림 없는 완벽한 추리";
  if (hintCount <= 2) return "단서를 놓치지 않은 노련한 조사";
  return "끝내 진실에 닿은 집념의 조사";
}
