import { useEffect, useState } from "react";
import {
  formatRankingTime,
  getTodayRankings,
} from "../utils/rankingService";

function RankingBoard() {
  const [rankings, setRankings] = useState([]);
  const [status, setStatus] = useState("loading");
  const [selectedRanking, setSelectedRanking] = useState(null);

  useEffect(() => {
    let isActive = true;

    getTodayRankings(10)
      .then((records) => {
        if (!isActive) return;
        setRankings(records);
        setStatus("success");
      })
      .catch((error) => {
        console.error("Failed to load today's rankings.", error);
        if (isActive) setStatus("error");
      });

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <section className="card rankingCard">
      <p className="sectionLabel">Ranking Board</p>
      <h2>오늘의 기록</h2>

      {status === "loading" && (
        <p className="rankingMessage">오늘의 랭킹을 불러오는 중...</p>
      )}

      {status === "error" && (
        <p className="rankingMessage rankingError">
          랭킹을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.
        </p>
      )}

      {status === "success" && rankings.length === 0 && (
        <p className="rankingMessage">아직 등록된 기록이 없습니다.</p>
      )}

      {status === "success" && rankings.length > 0 && (
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
    </section>
  );
}

export default RankingBoard;
