import { useEffect, useState } from "react";
import {
  formatRankingTime,
  getCachedRankings,
  getKoreaDayKey,
  getTodayRankings,
  setCachedRankings,
} from "../utils/rankingService";

function RankingBoard() {
  const [initialRankingState] = useState(() => {
    const dayKey = getKoreaDayKey();
    const cachedRankings = getCachedRankings(dayKey);

    return {
      dayKey,
      cachedRankings,
      hasCache: cachedRankings !== null,
    };
  });
  const { dayKey, cachedRankings, hasCache } = initialRankingState;
  const [rankings, setRankings] = useState(() => cachedRankings || []);
  const [loading, setLoading] = useState(() => !hasCache);
  const [refreshing, setRefreshing] = useState(() => hasCache);
  const [error, setError] = useState("");
  const [selectedRanking, setSelectedRanking] = useState(null);

  useEffect(() => {
    let isActive = true;

    getTodayRankings(10)
      .then((records) => {
        if (!isActive) return;

        setRankings(records);
        setCachedRankings(dayKey, records);
        setSelectedRanking((selected) => {
          if (!selected) return null;
          return records.find((record) => record.id === selected.id) || null;
        });
        setError("");
      })
      .catch((fetchError) => {
        console.error("Failed to load today's rankings.", fetchError);
        if (isActive) {
          setError("랭킹을 불러오지 못했습니다.");
        }
      })
      .finally(() => {
        if (!isActive) return;
        setLoading(false);
        setRefreshing(false);
      });

    return () => {
      isActive = false;
    };
  }, [dayKey]);

  return (
    <section className="card rankingCard">
      <p className="sectionLabel">Ranking Board</p>
      <h2>오늘의 기록</h2>

      {loading && (
        <p className="rankingMessage">오늘의 랭킹을 불러오는 중...</p>
      )}

      {!loading && error && !hasCache && rankings.length === 0 && (
        <p className="rankingMessage rankingError">
          랭킹을 불러오지 못했습니다.
        </p>
      )}

      {!loading && (!error || hasCache) && rankings.length === 0 && (
        <p className="rankingMessage">아직 등록된 기록이 없습니다.</p>
      )}

      {!loading && rankings.length > 0 && (
        <>
          <div className="rankingList">
            {rankings.map((record, index) => {
              const isSelected = selectedRanking?.id === record.id;

              return (
                <button
                  type="button"
                  className={`rankingItem ${isSelected ? "selected" : ""}`}
                  key={record.id}
                  aria-expanded={isSelected}
                  onClick={() =>
                    setSelectedRanking(isSelected ? null : record)
                  }
                >
                  <span className="rankingRank">{index + 1}</span>

                  <div className="rankingInfo">
                    <strong className="rankingName">{record.teamName}</strong>
                    <span className="rankingHint">
                      힌트 {Number(record.hintCount) || 0}회
                    </span>
                  </div>

                  <span className="rankingTime">
                    {formatRankingTime(record.clearTimeMs)}
                  </span>
                </button>
              );
            })}
          </div>

          {selectedRanking && (
            <div className="rankingDetailCard">
              <p className="sectionLabel">Investigator Detail</p>
              <h3 className="rankingDetailTitle">
                {selectedRanking.teamName || "이름 없는 조사관"}
              </h3>

              <div className="rankingDetailGrid">
                <p>
                  <strong>칭호</strong>
                  <span>
                    {selectedRanking.clearTitle || "진실을 밝힌 조사관"}
                  </span>
                </p>
                <p>
                  <strong>기록</strong>
                  <span>
                    {formatRankingTime(selectedRanking.clearTimeMs)}
                  </span>
                </p>
                <p>
                  <strong>힌트</strong>
                  <span>{Number(selectedRanking.hintCount) || 0}회</span>
                </p>
                <p>
                  <strong>추천 유형</strong>
                  <span>
                    {selectedRanking.workshopTitle || "서찰 조사관형"}
                  </span>
                </p>
                <p>
                  <strong>추천 공방</strong>
                  <span>
                    {selectedRanking.workshopName || "공방거리 종합 체험"}
                  </span>
                </p>
                <p>
                  <strong>강점</strong>
                  <span>
                    {selectedRanking.workshopStatName || "종합 추리 감각"}
                  </span>
                </p>
              </div>

              <div className="rankingDetailText">
                <strong>힌트 평가</strong>
                <p>
                  {selectedRanking.hintEnding ||
                    "끝까지 사건을 추적한 기록입니다."}
                </p>
              </div>

              <div className="rankingDetailText">
                <strong>공방 추천 설명</strong>
                <p>
                  {selectedRanking.workshopDescription ||
                    "여러 단서를 균형 있게 따라간 조사관에게 어울리는 체험입니다."}
                </p>
              </div>

              <div className="rankingDetailText">
                <strong>추천 체험</strong>
                {Array.isArray(selectedRanking.recommendedCrafts) &&
                selectedRanking.recommendedCrafts.length > 0 ? (
                  <ul className="rankingCraftList">
                    {selectedRanking.recommendedCrafts.map((craft, index) => (
                      <li key={`${craft}-${index}`}>{craft}</li>
                    ))}
                  </ul>
                ) : (
                  <p>추천 체험 정보가 없습니다.</p>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {refreshing && (
        <p className="rankingRefreshMessage">
          최신 기록을 확인하고 있습니다...
        </p>
      )}
    </section>
  );
}

export default RankingBoard;
