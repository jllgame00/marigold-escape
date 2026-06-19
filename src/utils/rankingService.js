import {
  addDoc,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../lib/firebase";

const KOREA_TIME_ZONE = "Asia/Seoul";
const submissionPromises = new Map();

export function getKoreaDayKey(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: KOREA_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const dateParts = Object.fromEntries(
    parts
      .filter(({ type }) => type !== "literal")
      .map(({ type, value }) => [type, value]),
  );

  return `${dateParts.year}-${dateParts.month}-${dateParts.day}`;
}

function normalizeTeamName(teamName) {
  return Array.from(String(teamName ?? "").trim()).slice(0, 20).join("");
}

function normalizeCount(value) {
  const numericValue = Number(value);
  return Number.isFinite(numericValue)
    ? Math.max(0, Math.floor(numericValue))
    : 0;
}

export async function submitRanking({
  teamName,
  clearTimeSeconds,
  hintCount = 0,
  missionCount = 7,
  clearTitle = "",
  hintEnding = "",
  workshopResult = null,
}) {
  const numericClearTimeSeconds = Number(clearTimeSeconds);

  if (
    !Number.isFinite(numericClearTimeSeconds) ||
    numericClearTimeSeconds <= 0
  ) {
    throw new TypeError("clearTimeSeconds must be a positive number.");
  }

  const normalizedTeamName = normalizeTeamName(teamName);
  const dayKey = getKoreaDayKey();
  const submissionKey = `rankingSubmitted:${dayKey}:${normalizedTeamName}:${numericClearTimeSeconds}`;

  if (localStorage.getItem(submissionKey)) {
    return { status: "duplicate", dayKey };
  }

  if (submissionPromises.has(submissionKey)) {
    return submissionPromises.get(submissionKey);
  }

  const submissionPromise = addDoc(
    collection(db, "rankings", dayKey, "records"),
    {
      teamName: normalizedTeamName,
      clearTimeMs: numericClearTimeSeconds * 1000,
      clearTimeSec: numericClearTimeSeconds,
      hintCount: normalizeCount(hintCount),
      missionCount: normalizeCount(missionCount),
      dayKey,
      createdAt: serverTimestamp(),
      clearTitle: String(clearTitle || ""),
      hintEnding: String(hintEnding || ""),
      workshopTitle: String(workshopResult?.title || ""),
      workshopName: String(workshopResult?.workshop || ""),
      workshopStatName: String(workshopResult?.statName || ""),
      workshopDescription: String(workshopResult?.description || ""),
      recommendedCrafts: Array.isArray(workshopResult?.recommendedCrafts)
        ? workshopResult.recommendedCrafts
            .slice(0, 5)
            .map((craft) => String(craft || ""))
            .filter(Boolean)
        : [],
    },
  )
    .then((documentReference) => {
      localStorage.setItem(submissionKey, "true");
      return {
        status: "submitted",
        dayKey,
        recordId: documentReference.id,
      };
    })
    .finally(() => {
      submissionPromises.delete(submissionKey);
    });

  submissionPromises.set(submissionKey, submissionPromise);
  return submissionPromise;
}

export async function getTodayRankings(maxCount = 10) {
  const dayKey = getKoreaDayKey();
  const normalizedMaxCount = Math.min(
    100,
    Math.max(1, Math.floor(Number(maxCount) || 10)),
  );
  const rankingQuery = query(
    collection(db, "rankings", dayKey, "records"),
    orderBy("clearTimeMs", "asc"),
    limit(normalizedMaxCount),
  );
  const snapshot = await getDocs(rankingQuery);

  return snapshot.docs.map((documentSnapshot) => ({
    id: documentSnapshot.id,
    ...documentSnapshot.data(),
  }));
}

export function formatRankingTime(clearTimeMs) {
  const numericClearTimeMs = Number(clearTimeMs);

  if (!Number.isFinite(numericClearTimeMs) || numericClearTimeMs < 0) {
    return "--:--";
  }

  const totalSeconds = Math.floor(numericClearTimeMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}
