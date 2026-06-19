import { useEffect, useState } from "react";
import {
  formatRankingTime,
  getTodayRankings,
} from "../utils/rankingService";

function RankingBoard() {
  const [rankings, setRankings] = useState([]);
  const [status, setStatus] = useState("loading");

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
        <div className="rankingList">
          {rankings.map((record, index) => (
            <div className="rankingItem" key={record.id}>
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
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default RankingBoard;
